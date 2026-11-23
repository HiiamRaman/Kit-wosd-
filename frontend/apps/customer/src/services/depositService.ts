import { apiClient } from "../lib/api";

export interface DepositRequestPayload {
  amount: number;
  paymentMethod: string;
  transactionId: string;
}

export async function requestDeposit(payload: DepositRequestPayload) {
  try {
    const response = await apiClient.post("/deposit", payload);
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Failed to submit deposit request.",
    );
  }
}
