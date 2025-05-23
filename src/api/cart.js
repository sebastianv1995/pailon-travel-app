import AsyncStorage from "@react-native-async-storage/async-storage";
import { map, forEach } from "lodash";
import { ENV } from "../utils";

async function addCart(productId) {
  const products = [];

  products.push({ id: productId, quantity: 1 });

  await AsyncStorage.setItem(ENV.STORAGE.CART, JSON.stringify(products));
}

export const cartCtrl = {
  addCart,
};
