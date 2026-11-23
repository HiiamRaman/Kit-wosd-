import { X, ExternalLink, ShieldCheck } from "lucide-react";
import { TransactionInfoGrid } from "./TransactionInfoGrid";

import { AdminBalanceForm } from "./AdminBalanceForm";
import { ReceiptPreview } from "./ReceiptPreview";

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
    balance?: number;
  };
  createdAt: string;
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onAction: (id: string, action: "approve" | "reject") => void;
  actionLoading: string | null;
}

export function TransactionDetailModal({
  transaction,
  onClose,
  onAction,
  actionLoading,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const isProcessing = actionLoading === transaction._id;
  const userId = transaction.user?._id;
  const proofUrl = transaction.image_url || transaction.qrcode;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#161616]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">
              Transaction Audit & Admin Control
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
          <TransactionInfoGrid
            transactionId={transaction._id}
            status={transaction.status}
            username={transaction.user?.username || "Unknown"}
            amount={transaction.amount}
          />

          {userId && (
  <AdminBalanceForm
    paymentId={transaction._id}
    userId={userId}
    status={transaction.status} // 👈 Pass status here
    onSuccess={onClose}
  />
)}

          <div className="space-y-2">
            <span className="text-zinc-400 text-xs uppercase font-bold tracking-wider">
              Account / Payment Details
            </span>
            <div className="bg-[#0a0a0a] border border-zinc-800 p-3 rounded-xl font-mono text-xs text-zinc-300">
              {transaction.accountDetails ||
                "No additional account details provided."}
            </div>
          </div>

          <ReceiptPreview imageUrl={proofUrl} />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#161616]">
          <a
            href={proofUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-mono"
          >
            Open Receipt <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {transaction.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    onAction(transaction._id, "reject");
                    onClose();
                  }}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20 text-xs font-bold uppercase"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    onAction(transaction._id, "approve");
                    onClose();
                  }}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20 text-xs font-bold uppercase"
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
