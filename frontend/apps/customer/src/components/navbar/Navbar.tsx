import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Loader2 } from "lucide-react";
import { MainNavBar } from "./MainNavBar";
import { useAuthStore } from "../../store/auth.store";
import { apiClient } from "../../services/api.client";

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  onLogoutClick?: () => void;
}

export function Navbar({
  onLoginClick,
  onSignUpClick,
  onLogoutClick,
}: NavbarProps) {
  const navigate = useNavigate();

  // Pull authentication status from Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // Local state for the User Profile API integration
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  // Fetch real user data and balance when authenticated
  useEffect(() => {
    let isMounted = true;

    async function fetchUserProfile() {
      if (!isAuthenticated) {
        setProfile(null);
        setBalance(null);
        return;
      }

      setWalletLoading(true);
      try {
        // GET /user/me fetches user data including the balance directly
        const userRes = await apiClient.get("/user/me");
        const userData = userRes.data?.data || userRes.data;

        if (isMounted) {
          setProfile(userData);
          setBalance(userData?.balance ?? 0);
        }
      } catch (err) {
        console.error("Failed to fetch navbar profile data:", err);
      } finally {
        if (isMounted) {
          setWalletLoading(false);
        }
      }
    }

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    if (onLogoutClick) {
      onLogoutClick();
    }
    navigate("/");
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-black tracking-wider text-white flex items-center gap-1.5"
        >
          KHALTI<span className="text-yellow-500">88</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Displaying Live Profile Info & Balance */}
              <div className="hidden sm:flex flex-col text-right mr-1">
                <span className="text-xs font-bold text-zinc-200">
                  {profile?.username ?? profile?.name ?? "Player"}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center justify-end gap-1">
                  {walletLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                  ) : (
                    `Rs ${balance !== null ? balance.toFixed(2) : "0.00"}`
                  )}
                </span>
              </div>

              <button
                onClick={() => navigate("/withdraw")}
                className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
              >
                Withdrawal
              </button>

              <button
                onClick={() => navigate("/deposit")}
                className="text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                DEPOSIT
              </button>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold bg-zinc-950 hover:bg-red-950/40 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/50 transition-colors cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert("Opening live chat...")}
                className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
                title="Live Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={onLoginClick}
                className="text-xs font-bold text-yellow-500 border border-yellow-500/60 hover:bg-yellow-500/10 px-4 py-2 rounded-lg transition-all tracking-wider cursor-pointer"
              >
                LOGIN
              </button>

              <button
                onClick={onSignUpClick}
                className="text-xs font-bold text-white bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 px-4 py-2 rounded-lg shadow-md transition-all tracking-wider cursor-pointer"
              >
                SIGN UP
              </button>

              <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-950 ml-1">
                <span className="text-base" role="img" aria-label="Nepal Flag">
                  🇳🇵
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <MainNavBar />
    </header>
  );
}
