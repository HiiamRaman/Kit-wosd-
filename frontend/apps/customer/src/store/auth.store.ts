import { create } from "zustand";
import { apiClient } from "../services/api.client";

interface AuthState {
  user: any | null; // Replace 'any' with your UserSession type
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Call the backend login route
      const response = await apiClient.post("/user/login", { email, password });

      // 2. Save the token to local storage
      localStorage.setItem("accessToken", response.data.accessToken);

      // 3. Immediately fetch the user's profile data using the new token
      const profileRes = await apiClient.get("/user/me");

      set({
        user: profileRes.data,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  fetchProfile: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/user/me");
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch {
      // If token is expired or invalid, clear everything
      localStorage.removeItem("accessToken");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false });
  },
}));
