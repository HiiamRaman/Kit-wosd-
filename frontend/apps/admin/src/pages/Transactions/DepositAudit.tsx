import { useEffect, useState } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../lib/api";
import { TransactionTable } from "./TransactionTable";
import { TransactionDetailModal } from "./TransactionDetailModal";

interface Transaction {
  _id: string;
  type?: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "rejected";
  method?: string;
  accountDetails?: string;
  image_url?: string;
  qrcode?: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
}

export function DepositAudit() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/payments");
      const data = res.data?.payments || res.data?.data || res.data || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error("Failed to load audit ledger:", err);
      const errorMsg =
        (err as any)?.response?.data?.message ||
        "Failed to fetch ledger records.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      setActionLoading(id);
      await apiClient.post(`/payments/${id}/${action}`, {});

      if (action === "approve") {
        toast.success(
          `Transaction ${id.slice(-6).toUpperCase()} approved successfully.`,
        );
      } else {
        toast.error(
          `Transaction ${id.slice(-6).toUpperCase()} has been rejected.`,
        );
      }

      setTransactions((prev) => prev.filter((txn) => txn._id !== id));
    } catch (err: unknown) {
      console.error(`Failed to ${action} transaction:`, err);
      const errorMsg =
        (err as any)?.response?.data?.message ||
        `Failed to ${action} transaction.`;
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const txnId = txn._id || "";
    const username = txn.user?.username || "";
    const matchesSearch =
      txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            Deposit Audit Ledger
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Review and process live user financial transactions
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ID or User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-zinc-800 text-sm text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111] border border-zinc-800 text-sm text-zinc-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchTransactions}
            className="bg-[#111] border border-zinc-800 p-2.5 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-zinc-400 flex-shrink-0"
            title="Refresh Ledger"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#111] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
            <p className="text-xs font-mono uppercase tracking-widest">
              Querying live transaction logs...
            </p>
          </div>
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            actionLoading={actionLoading}
            onAction={handleAction}
            onSelectTransaction={(txn) => setSelectedTransaction(txn)}
          />
        )}
      </div>

      {/* Modal Popup Component */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onAction={handleAction}
        actionLoading={actionLoading}
      />
    </div>
  );
}
