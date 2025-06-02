import { size } from "lodash";
import { authFetch } from "../lib";
import { ENV } from "../utils";

const operationsInProgress = new Map();

async function addWishlist(userId, productId) {
  const operationKey = `${userId}-${productId}`;

  if (operationsInProgress.get(operationKey)) {
    return { message: "Operación en progreso" };
  }

  try {
    operationsInProgress.set(operationKey, true);

    const checkUrl = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${productId}&publicationState=live`;
    const checkResponse = await authFetch(checkUrl);
    const existingEntries = await checkResponse.json();

    if (existingEntries.data && existingEntries.data.length > 0) {
      return {
        message: "Este producto ya está en tu lista de deseos",
        data: existingEntries.data[0],
      };
    }

    const addUrl = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          user: userId,
          product: productId,
          lockToken: Date.now().toString(),
        },
      }),
    };

    const addResponse = await authFetch(addUrl, params);

    const verifyResponse = await authFetch(checkUrl);
    const finalEntries = await verifyResponse.json();

    if (finalEntries.data && finalEntries.data.length > 1) {
      const [keep, ...duplicates] = finalEntries.data;
      await Promise.all(
        duplicates.map(async (entry) => {
          const deleteUrl = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}/${entry.id}`;
          await authFetch(deleteUrl, { method: "DELETE" });
        })
      );
    }

    return await addResponse.json();
  } catch (error) {
    throw error;
  } finally {
    operationsInProgress.delete(operationKey);
  }
}

async function checkWishlist(userId, productId) {
  try {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${productId}&publicationState=live`;
    const response = await authFetch(url);
    if (response.status !== 200) throw response;
    const result = await response.json();
    return result.data && result.data.length > 0;
  } catch (error) {
    return false;
  }
}

async function deleteWishlist(userId, productId) {
  const operationKey = `delete-${userId}-${productId}`;

  if (operationsInProgress.get(operationKey)) {
    return true;
  }

  try {
    operationsInProgress.set(operationKey, true);

    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${productId}&publicationState=live`;
    const response = await authFetch(url);
    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      return false;
    }

    for (const item of result.data) {
      const deleteUrl = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}/${item.id}`;
      try {
        await authFetch(deleteUrl, { method: "DELETE" });
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    }

    return result.data.length > 0;
  } catch (error) {
    throw error;
  } finally {
    operationsInProgress.delete(operationKey);
  }
}

async function getAllProductWishlist(userId) {
  console.log("🔍 [API] getAllProductWishlist iniciado", { userId });
  
  try {
    if (!userId) {
      console.log("❌ [API] No userId proporcionado");
      return {
        data: [],
        meta: { pagination: { total: 0 } },
      };
    }

    // 🔧 Simplificar la consulta para que funcione con el controlador personalizado
    const userFilters = `filters[user][id][$eq]=${userId}`;
    const populate = "populate=*"; // Usar wildcard que funciona mejor con Strapi v4
    const publicationState = "publicationState=live"; // Para manejar draftAndPublish
    const filters = `${userFilters}&${populate}&${publicationState}`;
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?${filters}`;
    
    console.log("🌐 [API] URL simplificada:", url);
    const response = await authFetch(url);
    console.log("📨 [API] Response status:", response.status, response.ok);

    if (!response.ok) {
      console.log("❌ [API] Response no OK, retornando array vacío");
      
      // Intentar obtener el texto del error para debugging
      try {
        const errorText = await response.text();
        console.log("🚨 [API] Error del servidor:", errorText);
      } catch (e) {
        console.log("🚨 [API] No se pudo leer el error del servidor");
      }
      
      return {
        data: [],
        meta: { pagination: { total: 0 } },
      };
    }

    const result = await response.json();
    console.log("📦 [API] Datos parseados del JSON:", JSON.stringify(result, null, 2));

    if (!result || !result.data) {
      console.log("❌ [API] No hay result.data");
      return {
        data: [],
        meta: result?.meta || { pagination: { total: 0 } },
      };
    }

    if (!Array.isArray(result.data)) {
      console.log("❌ [API] result.data no es array");
      return {
        data: [],
        meta: result.meta || { pagination: { total: 0 } },
      };
    }

    if (result.data.length === 0) {
      console.log("🚨 [API] result.data está vacío");
      return result;
    }

    console.log("✅ [API] Procesando datos para eliminar duplicados...");
    const uniqueMap = new Map();
    result.data.forEach((item, index) => {
      console.log(`🔍 [API] Procesando item ${index}:`, item);
      
      if (
        !item ||
        !item.attributes ||
        !item.attributes.product ||
        !item.attributes.product.data
      ) {
        console.log(`❌ [API] Item ${index} tiene estructura inválida`);
        return;
      }

      const productId = item.attributes.product.data.id;
      if (!productId) {
        console.log(`❌ [API] Item ${index} no tiene productId`);
        return;
      }

      if (
        !uniqueMap.has(productId) ||
        uniqueMap.get(productId).attributes.createdAt >
          item.attributes.createdAt
      ) {
        console.log(`✅ [API] Agregando/actualizando producto ${productId}`);
        uniqueMap.set(productId, item);
      }
    });

    const finalResult = {
      ...result,
      data: Array.from(uniqueMap.values()),
    };
    
    console.log("🎆 [API] Resultado final:", JSON.stringify(finalResult, null, 2));
    return finalResult;
  } catch (error) {
    console.error("❌ [API] Error en getAllProductWishlist:", error);
    return {
      data: [],
      meta: { pagination: { total: 0 } },
      error: error.message,
    };
  }
}

export const wishlistCtrl = {
  add: addWishlist,
  check: checkWishlist,
  delete: deleteWishlist,
  getAllProducts: getAllProductWishlist,
};
