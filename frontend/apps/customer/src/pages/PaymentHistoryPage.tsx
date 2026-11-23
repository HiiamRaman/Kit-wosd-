import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  Receipt
} from "lucide-react";
import { apiClient } from "../services/api.client";
import { useAuthStore } from "../store/auth.store";

interface Transaction {
  _id: string;
  type?: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "rejected";
  method?: "esewa" | "khalti" | string;
  accountDetails?: string;
  qrcode?: string;
  image_url?: string;
  createdAt: string;
}

export function PaymentHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "deposit" | "withdraw">("all");

  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // Endpoint hits router.get("/user/:userId", getUserPayments)
        const res = await apiClient.get(`/payments/user/${userId}`);
        const data = res.data?.payments || res.data?.data || res.data || [];
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to fetch payment history:", err);
        setError(err.response?.data?.message || "Failed to load transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const filteredTransactions = transactions.filter((tx) => {
    const txType = tx.type || "deposit";
    if (filter === "all") return true;
    return txType === filter;
  });

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex gap-2">
          {(["all", "deposit", "withdraw"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? "bg-zinc-100 text-zinc-900 shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "All History" : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5 mb-6">
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Transaction History</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review all past deposits and withdrawal requests
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Current Balance
            </span>
            <span className="text-base font-bold text-emerald-400">
              Rs {user?.balance?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-7 h-7 animate-spin mb-3 text-zinc-400" />
            <p className="text-xs font-medium">Fetching transaction records...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <Receipt className="w-10 h-10 mb-2 stroke-[1.5] text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-400">No transactions found</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Your deposits and withdrawals will appear here once submitted.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {filteredTransactions.map((tx) => {
              const isWithdrawal = tx.type === "withdraw";
              const dateStr = new Date(tx.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={tx._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-zinc-800/20 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isWithdrawal
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {isWithdrawal ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white capitalize">
                          {isWithdrawal ? "Withdrawal" : "Deposit"}
                        </span>
                        {tx.method && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {tx.method}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span>{dateStr}</span>
                        {tx.accountDetails && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-300 font-mono text-[11px]">
                              To: {tx.accountDetails}
                            </span>
                          </>
                        )}
                        {(tx.qrcode || tx.image_url) && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <a
                              href={tx.image_url || tx.qrcode}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline"
                            >
                              Receipt <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div
                        className={`text-sm font-black tracking-tight ${
                          isWithdrawal ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {isWithdrawal ? "-" : "+"} Rs {tx.amount?.toLocaleString()}
                      </div>
                      <div className="mt-1">{getStatusBadge(tx.status)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
