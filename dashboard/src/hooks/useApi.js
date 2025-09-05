import { useState } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { showError } = useNotification();

  // Add request interceptor to include auth token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const apiCall = async (url, options = {}) => {
    setLoading(true);
    try {
      const response = await api({
        url,
        method: options.method || "GET",
        data: options.data,
        params: options.params,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      if (!options.suppressError) {
        showError(errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    apiCall,
    loading,
  };
};
