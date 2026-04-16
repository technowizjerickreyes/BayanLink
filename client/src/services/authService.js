import api, { clearStoredAccessToken, storeAccessToken } from "./api";

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  storeAccessToken(data.data.accessToken);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const logout = async () => {
  try {
    const { data } = await api.post("/auth/logout");
    return data;
  } finally {
    clearStoredAccessToken();
  }
};

export const refreshSession = async () => {
  const { data } = await api.post("/auth/refresh");
  storeAccessToken(data.data.accessToken);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
