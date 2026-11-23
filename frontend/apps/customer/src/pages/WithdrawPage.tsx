import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, Loader2, CheckCircle } from "lucide-react";
import { apiClient } from "../services/api.client";
import { useAuthStore } from "../store/auth.store";

export function WithdrawPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("esewa");
  const [accountDetails, setAccountDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountDetails) {
      setError("Please fill out all fields.");
      return;
    }

    const currentUserId = user?._id || user?.id;
    if (!currentUserId) {
      setError("User authentication error.");
      return;
    }

    if (Number(amount) > (user?.balance || 0)) {
      setError("Insufficient wallet balance.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.post("/payments/withdraw", {
        userId: currentUserId,
        amount: Number(amount),
        method,
        accountDetails,
      });

      setSuccess(true);
      setTimeout(() => navigate("/history"), 2500);
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
      setError(err.response?.data?.message || "Failed to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">Withdrawal Requested</h2>
        <p className="text-zinc-400 text-center text-sm">
          Your request is pending admin review. Funds will be transferred to your account shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-black uppercase text-white tracking-wider mb-1">
            Withdraw Funds
          </h1>
          <p className="text-xs text-zinc-400">
            Current Available Balance: <span className="text-emerald-400 font-bold">Rs {user?.balance || 0}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-xs text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Withdrawal Amount (Rs)
            </label>
            <input
              type="number"
              min="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Transfer Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            >
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Account Details (ID / Number)
            </label>
            <input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder="e.g. 98XXXXXXXX"
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            Request Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
}
