import { EsportsCard } from "../esports/EsportsCard";
import type { Game } from "../../services/casinoApi";

interface GameGridProps {
  loading: boolean;
  games: Game[];
}

export function GameGrid({ loading, games }: GameGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 mt-6">
        <p className="text-sm text-zinc-400">
          No active lobbies found matching your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {games.map((game) => (
        <EsportsCard key={game.id} game={game} />
      ))}
    </div>
  );
}
