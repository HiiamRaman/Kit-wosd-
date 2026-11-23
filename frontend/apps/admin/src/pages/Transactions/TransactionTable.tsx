import { CheckCircle, XCircle, Clock, Eye, Loader2 } from "lucide-react";

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

interface TransactionTableProps {
  transactions: Transaction[];
  actionLoading: string | null;
  onAction: (id: string, action: "approve" | "reject") => void;
  onSelectTransaction: (txn: Transaction) => void;
}

export function TransactionTable({
  transactions,
  actionLoading,
  onAction,
  onSelectTransaction,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#161616] text-zinc-400 text-xs uppercase font-bold tracking-wider border-b border-zinc-800">
          <tr>
            <th className="px-6 py-4">Transaction ID</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date & Time</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80">
          {transactions.map((txn) => {
            const isProcessing = actionLoading === txn._id;
            const dateStr = new Date(txn.createdAt).toLocaleString();

            return (
              <tr key={txn._id} className="hover:bg-zinc-900/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-zinc-300">
                  {txn._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4 font-bold text-white">
                  {txn.user?.username || "Unknown User"}
                </td>
                <td className="px-6 py-4 uppercase text-xs font-bold text-zinc-300">
                  {txn.type || "deposit"}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-white">
                  Rs {txn.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      txn.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : txn.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {txn.status === "approved" && <CheckCircle className="w-3 h-3" />}
                    {txn.status === "pending" && <Clock className="w-3 h-3 animate-pulse" />}
                    {txn.status === "rejected" && <XCircle className="w-3 h-3" />}
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-xs font-mono">{dateStr}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {txn.status === "pending" && (
                      <>
                        <button
                          onClick={() => onAction(txn._id, "approve")}
                          disabled={isProcessing}
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20 disabled:opacity-50"
                          title="Approve"
                        >
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onAction(txn._id, "reject")}
                          disabled={isProcessing}
                          className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20 disabled:opacity-50"
                          title="Reject"
                        >
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onSelectTransaction(txn)}
                      className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {transactions.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 font-mono text-sm">
                No transaction logs discovered matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
