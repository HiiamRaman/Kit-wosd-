interface TransactionInfoGridProps {
  transactionId: string;
  status: string;
  username: string;
  amount: number;
}

export function TransactionInfoGrid({
  transactionId,
  status,
  username,
  amount,
}: TransactionInfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
      <div>
        <span className="text-zinc-500 text-xs uppercase block">
          Transaction ID
        </span>
        <span className="font-mono text-zinc-300 text-xs">{transactionId}</span>
      </div>
      <div>
        <span className="text-zinc-500 text-xs uppercase block">Status</span>
        <span className="font-bold uppercase text-xs text-amber-400">
          {status}
        </span>
      </div>
      <div>
        <span className="text-zinc-500 text-xs uppercase block">User</span>
        <span className="font-bold text-white">{username}</span>
      </div>
      <div>
        <span className="text-zinc-500 text-xs uppercase block">
          Requested Amount
        </span>
        <span className="font-mono font-bold text-emerald-400">
          Rs {amount?.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
