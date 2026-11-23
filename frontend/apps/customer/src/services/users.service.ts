import { apiClient } from "../lib/api";

export const usersService = {
  // Fetch all players for a dashboard table
  getAllUsers: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  // Get details for one specific user
  getUserById: async (userId: string) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Ban or unban a user
  updateUserStatus: async (userId: string, isBanned: boolean) => {
    const response = await apiClient.put(`/admin/users/${userId}/status`, {
      isBanned,
    });
    return response.data;
  },
};
