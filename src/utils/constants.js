export const ENV = {
  // API_URL: "http://localhost:1337/api",
  API_URL: "https://pailontravel-banos-5a22cb25d6ed.herokuapp.com/api",
  ENDPOINTS: {
    REGISTER: "auth/local/register",
    LOGIN: "auth/local",
    USERS_ME: "users/me",
    USERS: "users",
    HOME_BANNERS: "home-banners",
    PRODUCTS: "products",
    WISHLIST: "wishlists",
    PAYMENT_ORDER: "payment-order",
    ORDERS: "orders",
  },
  STORAGE: {
    TOKEN: "token",
    SEARCH_HISTORY: "search-history",
    CART: "cart",
  },
  STRIPE: {
    PUBLISHEBLE_KEY:
      "pk_test_51PnYN8FzfXKFuZfxeO4qHHcK81jinuFpTNEq8Rxos5bRgctuL7ErJYcha0WdOQynqKz0faGZvessJwBkfC0e5bbf00eqjAOkGX",
  },
};
