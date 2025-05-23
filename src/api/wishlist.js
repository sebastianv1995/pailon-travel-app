import { size } from "lodash";
import { authFetch } from "../lib";
import { ENV } from "../utils";

// Mantener un registro de operaciones en progreso
const operationsInProgress = new Map();

async function addWishlist(userId, productId) {
  const operationKey = `${userId}-${productId}`;

  if (operationsInProgress.get(operationKey)) {
    return { message: "OperaciÃ³n en progreso" };
  }

  try {
    operationsInProgress.set(operationKey, true);

    // Usar una Ãºnica llamada para verificar y crear
    const checkUrl = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${productId}`;
    const checkResponse = await authFetch(checkUrl);
    const existingEntries = await checkResponse.json();

    // Si ya existe alguna entrada, no crear una nueva
    if (existingEntries.data.length > 0) {
      return {
        message: "Este producto ya estÃ¡ en tu lista de deseos",
        data: existingEntries.data[0],
      };
    }

    // Si no existe, crear una nueva entrada con bloqueo optimista
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
          lockToken: Date.now().toString(), // AÃ±adir un token Ãºnico
        },
      }),
    };

    const addResponse = await authFetch(addUrl, params);

    // Verificar una vez mÃ¡s despuÃ©s de crear para asegurar unicidad
    const verifyResponse = await authFetch(checkUrl);
    const finalEntries = await verifyResponse.json();

    // Si se detectan duplicados, eliminar los extras
    if (finalEntries.data.length > 1) {
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
    console.error("Error en addWishlist:", error);
    throw error;
  } finally {
    operationsInProgress.delete(operationKey);
  }
}

async function checkWishlist(userId, productId) {
  try {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${productId}`;
    const response = await authFetch(url);
    if (response.status !== 200) throw response;
    const result = await response.json();
    return result.data.length > 0;
  } catch (error) {
    console.error("Error verificando wishlist:", error);
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

    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${productId}`;
    const response = await authFetch(url);
    const result = await response.json();

    // Eliminar todas las entradas en serie
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
    console.error("Error en deleteWishlist:", error);
    throw error;
  } finally {
    operationsInProgress.delete(operationKey);
  }
}

async function getAllProductWishlist(userId) {
  try {
    const userFilters = `filters[user][id][$eq]=${userId}`;
    const populate = "populate[0]=product&populate[1]=product.main_image";
    const filters = `${userFilters}&${populate}`;
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.WISHLIST}?${filters}`;

    const response = await authFetch(url);
    const result = await response.json();

    // Eliminar duplicados basados en el ID del producto
    const uniqueMap = new Map();
    result.data.forEach((item) => {
      const productId = item.attributes.product.data.id;
      if (
        !uniqueMap.has(productId) ||
        uniqueMap.get(productId).attributes.createdAt >
          item.attributes.createdAt
      ) {
        uniqueMap.set(productId, item);
      }
    });

    return {
      ...result,
      data: Array.from(uniqueMap.values()),
    };
  } catch (error) {
    console.error("Error en getAllProductWishlist:", error);
    throw error;
  }
}

export const wishlistCtrl = {
  add: addWishlist,
  check: checkWishlist,
  delete: deleteWishlist,
  getAllProducts: getAllProductWishlist,
};
