import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Automatically attach the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handle global errors like expired tokens (401/403)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Token is invalid or expired
      console.warn("Session expired or unauthorized. Clearing credentials.");

      // Clear stored tokens
      localStorage.removeItem("accessToken");

      // Optional: You can trigger a window reload or let your store handle it
      // window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
