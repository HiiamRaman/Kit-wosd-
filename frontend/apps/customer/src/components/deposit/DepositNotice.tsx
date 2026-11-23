import { ShieldCheck } from "lucide-react";

export function DepositNotice() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-yellow-500">
        <ShieldCheck className="w-4 h-4" /> Manual Verification Notice
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">
        After completing your payment via the QR code, your balance will be
        manually reviewed and credited by an administrator shortly. If your
        balance does not update within 15 minutes, please contact live support.
      </p>
    </div>
  );
}
