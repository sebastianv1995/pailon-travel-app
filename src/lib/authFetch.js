import { storageCrtl } from "../api/storage";
import { fn } from "../utils";

export async function authFetch(url, params) {
  const token = await storageCrtl.getToken();

  const logout = async () => {
    await storageCrtl.removeToken();
  };

  if (!token) {
    await logout();
    return new Response(JSON.stringify({ error: "No authentication token" }), {
      status: 401,
      statusText: "Unauthorized",
      headers: { "Content-Type": "application/json" },
    });
  }

  if (fn.hasTokenExpired(token)) {
    await logout();
    return new Response(JSON.stringify({ error: "Token expired" }), {
      status: 401,
      statusText: "Unauthorized",
      headers: { "Content-Type": "application/json" },
    });
  }

  const paramsTemp = {
    ...params,
    headers: {
      ...params?.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, paramsTemp);

    if (response.status === 401) {
      await logout();
    }

    return response;
  } catch (error) {
    throw error;
  }
}
