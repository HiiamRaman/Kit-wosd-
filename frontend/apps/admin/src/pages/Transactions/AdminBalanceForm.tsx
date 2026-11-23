import { useState } from "react";
import { DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../lib/api";

interface AdminBalanceFormProps {
  paymentId: string;
  userId: string;
  status: string; // 👈 Added status prop to check if already approved
  onSuccess?: () => void;
}

export function AdminBalanceForm({
  paymentId,
  userId,
  status,
  onSuccess,
}: AdminBalanceFormProps) {
  const [newBalanceInput, setNewBalanceInput] = useState("");
  const [updatingBalance, setUpdatingBalance] = useState(false);

  const isAlreadyApproved = status === "approved";

  const handleSetBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error("User ID not found for this transaction.");

    const parsedBalance = Number(newBalanceInput);

    // Strict negative value restriction
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      return toast.error("Please enter a valid positive number (0 or greater).");
    }

    try {
      setUpdatingBalance(true);
      const res = await apiClient.put(`/payments/${paymentId}/status`, {
        status: "approved",
        amount: parsedBalance,
      });
      toast.success(res.data?.message || "User balance updated successfully!");
      setNewBalanceInput("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Failed to update balance:", err);
      toast.error(err.response?.data?.message || "Failed to set user balance.");
    } finally {
      setUpdatingBalance(false);
    }
  };

  // If already approved, lock down the form so admin cannot modify it again
  if (isAlreadyApproved) {
    return (
      <div className="bg-zinc-900/50 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Transaction Approved
          </h4>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            This deposit has already been approved and credited. Balance adjustments are locked.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSetBalance}
      className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-3"
    >
      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-red-500" /> Admin: Set User
        Balance Directly
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Enter absolute balance..."
          value={newBalanceInput}
          onChange={(e) => {
            const val = e.target.value;
            // Prevent typing negative numbers directly into the input field
            if (val === "" || Number(val) >= 0) {
              setNewBalanceInput(val);
            }
          }}
          className="w-full bg-black border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-mono"
        />
        <button
          type="submit"
          disabled={updatingBalance || !newBalanceInput}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded-lg transition-colors border border-zinc-700 disabled:opacity-50 flex-shrink-0"
        >
          {updatingBalance ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Set Balance"
          )}
        </button>
      </div>
      <p className="text-[11px] text-zinc-500 font-mono">
        *Approves the transaction and applies this positive amount to the user's
        account. Negative numbers are disabled.
      </p>
    </form>
  );
}
