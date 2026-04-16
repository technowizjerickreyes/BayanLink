import axios from "axios";

function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  const trimmed = typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";

  if (trimmed) {
    return trimmed;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }

  if (import.meta.env.PROD) {
    console.error(
      "[BayanLink] Set VITE_API_BASE_URL (preferred) or VITE_API_URL in the Netlify build environment. Example: https://api.example.com/api"
    );
  }

  return "";
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "bayanlink_access_token";

export function getStoredAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function storeAccessToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRefresh = originalRequest?.url?.includes("/auth/refresh");
    const isLogin = originalRequest?.url?.includes("/auth/login");

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRefresh && !isLogin) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");
        storeAccessToken(data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
