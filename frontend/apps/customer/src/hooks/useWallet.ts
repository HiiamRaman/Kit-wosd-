import { useState, useEffect } from "react";
import { apiClient } from "../services/api.client";
import { toast } from "sonner";

export function useWallet() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and balance on mount
  useEffect(() => {
    async function fetchWalletData() {
      setLoading(true);
      try {
        // 1. Get User Profile (GET /user)
        const userResponse = await apiClient.get("/user");
        const userData = userResponse.data?.data || userResponse.data;
        setUser(userData);

        // 2. Get Balance (POST /balance)
        // Adjust the payload if your backend expects a specific userId or token
        const balanceResponse = await apiClient.post("/wallet/balance", {
          userId: userData?.id,
        });

        const userBalance =
          balanceResponse.data?.data?.balance ??
          balanceResponse.data?.balance ??
          0;

        setBalance(userBalance);
      } catch (err: any) {
        console.error("Failed to load wallet data:", err);
        const errorMsg = err.response?.data?.message || err.message;

        if (err.response?.status === 401) {
          toast.error("Session Expired", { description: "Please log in again." });
        } else {
          toast.error("Wallet Error", { description: errorMsg });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, []);

  return { user, balance, loading, setBalance };
}
