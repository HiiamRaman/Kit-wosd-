import { Flame, Wallet } from "lucide-react";

const steps = [
  { num: "01", title: "CLICK ON DEPOSIT", desc: "Instantly launch the secure cashier matrix from your personal dashboard." },
  { num: "02", title: "SELECT BANK & AMOUNT", desc: "Pick your preferred high-speed banking channel and enter your stake." },
  { num: "03", title: "SCAN QR / TRANSFER", desc: "Authorize seamlessly via official encrypted gateway QR codes." },
  { num: "04", title: "UPLOAD RECEIPT", desc: "Instant automated audit validation clears your transaction instantly." },
  { num: "05", title: "START PLAYING", desc: "Funds hit your ledger at lightspeed. Claim your table." },
];

export function CashierSteps() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800/80 pb-6">
        <h2 className="text-lg font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Flame className="w-4 h-4 text-amber-500" /> Instant Cashier Protocol
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <Wallet className="w-3.5 h-3.5" /> SECURE PIPELINE
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((item, idx) => (
          <div key={idx} className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <span className="text-xs font-mono font-black text-red-500 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-900/40 w-fit mb-4">
              {item.num}
            </span>
            <h3 className="text-white font-black text-xs uppercase tracking-wider mb-2">{item.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
