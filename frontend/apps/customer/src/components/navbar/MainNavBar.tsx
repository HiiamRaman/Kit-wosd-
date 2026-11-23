import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Home,
  Trophy,
  Gamepad2,
  PlayCircle,
  Flame,
  Menu,
  Gift,
} from "lucide-react";

export function MainNavBar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Active category from URL query (?category=slots), default to "all" on home page
  const currentCategory = searchParams.get("category") || "all";
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "HOME", icon: Home, category: "all", to: "/?category=all" },
    { label: "SLOT", icon: Gamepad2, category: "slots", to: "/?category=slots" },
    { label: "LIVE CASINO", icon: PlayCircle, category: "casino", to: "/?category=casino" },
    { label: "CRASH GAME", icon: Flame, category: "crash", to: "/?category=crash" },
    { label: "JACKPOT", icon: Trophy, category: "cards", to: "/?category=cards" },
  ];

  return (
    <nav className="bg-red-700 border-t border-red-800 shadow-md overflow-x-auto scrollbar-none sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-14 px-4 flex items-center gap-1 text-sm font-bold tracking-wide uppercase text-white whitespace-nowrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isHomePage && currentCategory === item.category;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors relative ${
                isActive
                  ? "border-b-2 border-amber-400 bg-red-800/60 text-amber-300"
                  : "hover:bg-red-800/50 text-zinc-100 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Promotion */}
        <Link
          to="/promotion"
          className={`flex items-center rounded-md gap-1.5 px-3.5 py-2 ml-auto transition-all text-xs font-black shadow-sm ${
            location.pathname === "/promotion"
              ? "bg-emerald-700 border-b-2 border-amber-400 text-white"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          <Gift className="w-3.5 h-3.5" /> PROMOTION
        </Link>

        {/* More Menu */}
        <Link
          to="/more"
          className={`flex items-center rounded-md gap-1.5 px-3.5 py-2 transition-all text-xs font-black shadow-sm ${
            location.pathname === "/more"
              ? "bg-red-950 border-b-2 border-amber-400 text-amber-300"
              : "bg-red-900 hover:bg-red-950 text-zinc-200"
          }`}
        >
          <Menu className="w-3.5 h-3.5" /> MORE
        </Link>
      </div>
    </nav>
  );
}
