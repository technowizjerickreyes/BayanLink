import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearStoredAccessToken, getStoredAccessToken } from "../services/api.js";
import { getMe, login as loginRequest, logout as logoutRequest, refreshSession } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const response = getStoredAccessToken() ? await getMe() : await refreshSession();

        if (mounted) {
          setUser(response.data.user);
        }
      } catch (_error) {
        clearStoredAccessToken();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (payload) => {
    const response = await loginRequest(payload);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
