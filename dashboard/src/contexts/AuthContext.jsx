import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { apiCall } = useApi();

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await apiCall("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
        suppressError: true,
      });

      setUser(response.data.user);
      setUserRole(response.data.user.role);
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiCall("/auth/login", {
        method: "POST",
        data: { email, password },
      });

      const { user: userData, token: authToken } = response.data;

      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      setUserRole(userData.role);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiCall("/auth/register", {
        method: "POST",
        data: userData,
      });

      const { user: newUser, token: authToken } = response.data;

      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(newUser);
      setUserRole(newUser.role);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await apiCall("/auth/forgot-password", {
        method: "POST",
        data: { email },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await apiCall("/auth/reset-password", {
        method: "POST",
        data: { token, password },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    userRole,
    token,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
