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

// NEW: Password reset functions
export const resetPassword = async (userId, payload) => {
  const endpoint = `/auth/reset-my-password`; // Uses current user from token
  const { data } = await api.post(endpoint, payload);
  return data;
};

export const adminResetPassword = async (email, payload) => {
  const { data } = await api.post(`/auth/admin-reset/${email}`, payload);
  return data;
};

