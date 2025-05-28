import AsyncStorage from "@react-native-async-storage/async-storage";
import { map, forEach } from "lodash";
import { ENV } from "../utils";

async function getAllProducts() {
  const response = await AsyncStorage.getItem(ENV.STORAGE.CART);

  if (!response) {
    return [];
  } else {
    return JSON.parse(response);
  }
}

// Función mejorada para manejar tanto productId como objetos completos
async function addCart(productData) {
  const products = await getAllProducts();

  // Determinar si recibimos un ID o un objeto completo
  let productId, quantity, date;

  if (typeof productData === "object" && productData.id) {
    // Recibimos objeto completo: {id, quantity, date}
    productId = productData.id;
    quantity = productData.quantity || 1;
    date = productData.date;
  } else {
    // Recibimos solo ID (compatibilidad hacia atrás)
    productId = productData;
    quantity = 1;
    date = null;
  }

  const objIndex = products.findIndex((product) => product.id === productId);

  if (objIndex < 0) {
    // Producto nuevo: incluir todos los datos
    const newProduct = {
      id: productId,
      quantity: quantity,
      ...(date && { date: date }),
    };
    products.push(newProduct);
  } else {
    // Producto existente: actualizar cantidad y fecha
    const existingProduct = products[objIndex];
    products[objIndex] = {
      ...existingProduct,
      quantity: existingProduct.quantity + quantity,
      ...(date && { date: date }),
    };
  }

  await AsyncStorage.setItem(ENV.STORAGE.CART, JSON.stringify(products));
}

async function count() {
  const products = await getAllProducts();
  let count = 0;
  forEach(products, (product) => {
    count += product.quantity;
  });
  return count;
}

async function deleteProduct(productId) {
  const products = await getAllProducts();
  const updateProducts = products.filter((product) => product.id !== productId);
  await AsyncStorage.setItem(ENV.STORAGE.CART, JSON.stringify(updateProducts));
}

async function increaseProduct(productId) {
  try {
    const products = await getAllProducts();
    map(products, (product) => {
      if (product.id === productId) {
        return (product.quantity += 1);
      }
    });
    await AsyncStorage.setItem(ENV.STORAGE.CART, JSON.stringify(products));
  } catch (error) {
    throw error;
  }
}

async function decreaseProduct(productId) {
  try {
    let isDelete = false;

    const products = await getAllProducts();
    map(products, (product) => {
      if (product.id === productId) {
        if (product.quantity === 1) {
          isDelete = true;
          return null;
        } else {
          return (product.quantity -= 1);
        }
      }
    });

    if (isDelete) {
      await deleteProduct(productId);
    } else {
      await AsyncStorage.setItem(ENV.STORAGE.CART, JSON.stringify(products));
    }
  } catch (error) {
    throw error;
  }
}

async function deleteAll() {
  AsyncStorage.removeItem(ENV.STORAGE.CART);
}

export const cartCtrl = {
  getAll: getAllProducts,
  add: addCart,
  count,
  delete: deleteProduct,
  increaseProduct,
  decreaseProduct,
  deleteAll,
};
