import axios from "axios";
import { BackURL } from "urls";

const api = axios.create({
  baseURL: BackURL,
  headers: {
    "Content-Type": "application/json"
  },
});


let isRefreshing = false ;
let pendingRequests = [];

async function getNewTokens(refresh) {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject });
    });
  }

  isRefreshing= true;

  try {
    const response = await fetch(BackURL + "/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + refresh,
      },
    });

    if (response.status === 200) {
      const result = await response.json();

      pendingRequests.forEach(({ resolve }) => resolve(result));
      pendingRequests=[];

      return result;
    } else {
      pendingRequests.forEach(({ reject }) =>
        reject(new Error("Failed to refresh tokens"))
      );
      pendingRequests = []

      return null;
    }
  } catch (error) {
    console.error("Ошибка:", error);

    pendingRequests.forEach(({ reject }) => reject(error));
    pendingRequests = []

    return null;
  } finally {
    isRefreshing = false;
  }
}

export async function updateTokens() {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) return null;

  const newTokens = await getNewTokens(refreshToken);

  if (newTokens) {
    localStorage.setItem("access", newTokens.accessToken);
    localStorage.setItem("refresh", newTokens.refreshToken);
    localStorage.setItem("role", newTokens.userType);
    localStorage.setItem("accessTime", newTokens.accessExpiresAt);
    localStorage.setItem("refreshTime", newTokens.refreshExpiresAt);

    api.defaults.headers.common["Authorization"] = `Bearer ${newTokens.accessToken}`;
  }

  return newTokens;
}

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newTokens = await updateTokens();

      if (newTokens) {
        originalRequest.headers["Authorization"] = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);  
      } else {
        window.location.href = "/login/"; 
      }
    }

    return Promise.reject(error);
  }
);

export default api;