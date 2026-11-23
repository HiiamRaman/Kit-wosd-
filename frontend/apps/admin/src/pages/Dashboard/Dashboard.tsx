import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  ArrowUpRight,
  Wallet,
  Clock,
  ShieldAlert,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { apiClient } from "../../lib/api";
import { toast } from "sonner";

interface Transaction {
  _id: string;
  type?: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "rejected";
  method?: string;
  user?: {
    username: string;
    email: string;
  };
  createdAt: string;
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    pendingPaymentsCount: 0,
    totalDepositsSum: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const usersRes = await apiClient.get("/user");
      const usersList = usersRes.data?.users || usersRes.data?.data || usersRes.data || [];

      const pendingRes = await apiClient.get("/payments/pending");
      const pendingList = pendingRes.data?.payments || pendingRes.data?.data || pendingRes.data || [];

      const allPaymentsRes = await apiClient.get("/payments");
      const allPayments = allPaymentsRes.data?.payments || allPaymentsRes.data?.data || allPaymentsRes.data || [];

      const totalVolume = allPayments
        .filter((txn: Transaction) => txn.status === "approved")
        .reduce((sum: number, txn: Transaction) => sum + (txn.amount || 0), 0);

      setStatsData({
        totalUsers: Array.isArray(usersList) ? usersList.length : 0,
        pendingPaymentsCount: Array.isArray(pendingList) ? pendingList.length : 0,
        totalDepositsSum: totalVolume,
      });

      setRecentTransactions(Array.isArray(allPayments) ? allPayments.slice(0, 8) : []);
    } catch (err: any) {
      console.error("Failed to load dashboard metrics:", err);
      toast.error(err.response?.data?.message || "Failed to fetch live telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      id: 1,
      label: "Total Approved Volume",
      value: `NPR ${statsData.totalDepositsSum.toLocaleString()}`,
      trend: "Live Data",
      isUp: true,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      id: 2,
      label: "Registered Users",
      value: statsData.totalUsers.toLocaleString(),
      trend: "Live Data",
      isUp: true,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: 3,
      label: "Pending Approvals",
      value: statsData.pendingPaymentsCount.toLocaleString(),
      trend: statsData.pendingPaymentsCount > 0 ? "Action Needed" : "All Clear",
      isUp: statsData.pendingPaymentsCount === 0 ? true : null,
      icon: Wallet,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time telemetry connected to database records
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-[#111] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>

                {stat.isUp !== null && (
                  <div className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}

                {stat.isUp === null && (
                  <div className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 animate-pulse">
                    <ShieldAlert className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </div>

              <div>
                <span className="text-zinc-500 text-xs block mb-1">
                  {stat.label}
                </span>
                {loading ? (
                  <div className="h-7 w-24 bg-zinc-800 animate-pulse rounded my-1" />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {stat.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Ledger Activity Feed */}
      <div className="bg-[#111] border border-zinc-800/80 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Transactions Feed
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Recent Activity</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-red-500" />
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-12 font-mono">
            No transaction logs found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn._id}
                className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {txn.user?.username || "Unknown User"}
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(txn.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 capitalize">
                    {txn.type || "deposit"}
                  </span>
                  <span
                    className={`text-xs font-mono font-medium ${
                      txn.status === "approved"
                        ? "text-emerald-400"
                        : txn.status === "pending"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    NPR {txn.amount?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
