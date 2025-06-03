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
  console.log('🛒 === INICIO AGREGAR AL CARRITO ===');
  console.log('📦 Datos recibidos:', productData);
  
  const products = await getAllProducts();
  console.log('🗃️ Productos existentes en carrito:', products);

  // Determinar si recibimos un ID o un objeto completo
  let productId, quantity, date;

  if (typeof productData === "object" && productData.id) {
    // Recibimos objeto completo: {id, quantity, date}
    productId = productData.id;
    quantity = productData.quantity || 1;
    date = productData.date;
    
    console.log('📋 Datos parseados:', {
      productId,
      quantity,
      date,
      dateType: typeof date
    });
  } else {
    // Recibimos solo ID (compatibilidad hacia atrás)
    productId = productData;
    quantity = 1;
    date = null;
    
    console.log('🔄 Modo compatibilidad - solo ID:', productId);
  }

  const objIndex = products.findIndex((product) => product.id === productId);
  console.log('🔍 Índice del producto existente:', objIndex);

  if (objIndex < 0) {
    // Producto nuevo: incluir todos los datos
    const newProduct = {
      id: productId,
      quantity: quantity,
      ...(date && { date: date }),
    };
    
    console.log('✨ Agregando producto nuevo:', newProduct);
    products.push(newProduct);
  } else {
    // Producto existente: actualizar cantidad y fecha
    const existingProduct = products[objIndex];
    console.log('🔄 Producto existente encontrado:', existingProduct);
    
    const updatedProduct = {
      ...existingProduct,
      quantity: existingProduct.quantity + quantity,
      ...(date && { date: date }), // ✅ Actualizar fecha si se proporciona
    };
    
    console.log('📝 Producto actualizado:', updatedProduct);
    products[objIndex] = updatedProduct;
  }

  console.log('💾 Guardando carrito actualizado:', products);
  await AsyncStorage.setItem(ENV.STORAGE.CART, JSON.stringify(products));
  console.log('✅ === FIN AGREGAR AL CARRITO ===');
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

// 🔧 FUNCIÓN ADICIONAL PARA DEBUGGING DEL CARRITO
async function debugCart() {
  const products = await getAllProducts();
  console.log('🔍 === DEBUG CARRITO ===');
  console.log('📦 Total de productos:', products.length);
  
  products.forEach((product, index) => {
    console.log(`🛍️ Producto ${index + 1}:`, {
      id: product.id,
      quantity: product.quantity,
      date: product.date,
      dateType: typeof product.date
    });
    
    if (product.date) {
      // Intentar parsear la fecha para ver si es válida
      try {
        const parsedDate = new Date(product.date);
        console.log(`  📅 Fecha parseada: ${parsedDate.toLocaleString()}`);
        console.log(`  ⏰ Hora: ${parsedDate.getHours()}:${parsedDate.getMinutes().toString().padStart(2, '0')}`);
      } catch (error) {
        console.log(`  ❌ Error al parsear fecha: ${error.message}`);
      }
    }
  });
  console.log('🔍 === FIN DEBUG CARRITO ===');
  
  return products;
}

export const cartCtrl = {
  getAll: getAllProducts,
  add: addCart,
  count,
  delete: deleteProduct,
  increaseProduct,
  decreaseProduct,
  deleteAll,
  debug: debugCart, // ✅ Nueva función para debugging
};
