import { useState } from "react";
import { Wallet, PlusCircle } from "lucide-react";
import { DepositModal } from "../DepositModal";
import { useAuthStore } from "../../store/auth.store";

export function NavbarDeposit() {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const { user, fetchProfile } = useAuthStore();

  const handleDepositSuccess = () => {
    // Refresh user profile/balance after successful deposit submission
    fetchProfile();
  };

  return (
    <>
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
        <Wallet className="w-4 h-4 text-yellow-500" />
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
            Balance
          </span>
          <span className="text-xs font-mono font-bold text-white">
            NPR {user?.balance?.toLocaleString() || "0.00"}
          </span>
        </div>

        <button
          onClick={() => setIsDepositOpen(true)}
          className="ml-2 bg-yellow-500 hover:bg-yellow-400 text-black p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center shadow-md shadow-yellow-500/10"
          title="Deposit Funds"
          aria-label="Deposit Funds"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={handleDepositSuccess}
      />
    </>
  );
}
