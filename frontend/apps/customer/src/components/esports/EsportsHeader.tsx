import { Gamepad2, Search } from "lucide-react";

interface EsportsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function EsportsHeader({ searchQuery, setSearchQuery }: EsportsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-6">
      <div>
        <h1 className="text-xl font-black tracking-wider uppercase text-white flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-amber-500 rounded-sm" />
          <Gamepad2 className="w-5 h-5 text-amber-500" />
          Esports & Live Lobbies
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Real-time odds, major pro leagues, and competitive match lobbies synced from backend.
        </p>
      </div>

      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search lobbies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>
    </div>
  );
}
