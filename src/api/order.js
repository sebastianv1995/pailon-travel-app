import { method } from "lodash";
import { authFetch } from "../lib";
import { ENV } from "../utils";

async function payment(token, userId, products) {
  try {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PAYMENT_ORDER}`;

    const paymentData = {
      token,
      products,
      userId,
      timestamp: new Date().toISOString(),
    };

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    };

    const response = await authFetch(url, params);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function getAll(userId) {
  try {
    const userFilter = `filters[user][id][$eq]=${userId}`;
    const sortFilter = "sort[0]=createdAt:desc";
    const populateFilter = "populate=*";
    const filters = `${userFilter}&${sortFilter}&${populateFilter}`;
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ORDERS}?${filters}`;

    const response = await authFetch(url);

    if (response.status !== 200) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function getOrderById(orderId) {
  try {
    const populateFilter = "populate=*";
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ORDERS}/${orderId}?${populateFilter}`;

    const response = await authFetch(url);

    if (response.status !== 200) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    const orderData = {
      ...result.data.attributes,
      id: result.data.id,
      products: result.data.attributes.products || [],
    };

    return orderData;
  } catch (error) {
    throw error;
  }
}

export const orderCtrl = {
  payment,
  getAll,
  getById: getOrderById,
};
