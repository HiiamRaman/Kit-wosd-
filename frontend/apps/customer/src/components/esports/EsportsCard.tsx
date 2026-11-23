import React, { useState, useEffect } from "react";
import { Play, Loader2, Info, X } from "lucide-react";
import { apiClient } from "../../services/api.client";
import { toast } from "sonner";

export interface GameCardProps {
  game: {
    id: string | number;
    title: string;
    provider: string;
    image?: string;
    badge?: string;
    rtp?: string;
  };
}

export const EsportsCard: React.FC<GameCardProps> = ({ game }) => {
  // API 3 (Launch) State
  const [isLaunching, setIsLaunching] = useState(false);

  // API 2 (Details) State
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function if component unmounts while modal is open
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleLaunchSession = async () => {
    if (isLaunching) return;
    setIsLaunching(true);

    try {
      const response = await apiClient.get(`/bet/launch/${game.id}`);
      const launchUrl =
        response.data?.data?.game_url || response.data?.game_url;

      if (launchUrl) {
        window.location.href = launchUrl;
      } else {
        console.error("Backend response structure:", response.data);
        alert("Session launch URL could not be generated.");
        setIsLaunching(false);
      }
    } catch (err: any) {
      console.error("Failed to launch game session:", err);
      setIsLaunching(false);

      const status = err.response?.status;
      const backendMessage = err.response?.data?.message || err.message;

      // 1. Intercept "Token not found" and translate it
      if (status === 401 || backendMessage?.toLowerCase().includes("token")) {
        toast.error("Session Expired", {
          description: "Please log in to your account to play this game.",
        });
      }
      // 2. Handle balance issues
      else if (
        status === 402 ||
        backendMessage?.toLowerCase().includes("balance")
      ) {
        toast.error("Insufficient Funds", {
          description:
            "Your wallet balance is too low to launch this session. Please deposit.",
        });
      }
      // 3. Handle missing games
      else if (status === 404) {
        toast.error("Game Unavailable", {
          description: "This game is currently offline or under maintenance.",
        });
      }
      // 4. Fallback for everything else
      else {
        toast.error("Failed to Launch Game", {
          // If the backend message is still too technical, you can hardcode a generic fallback here instead
          description:
            "Unable to connect to the game provider. Please try again later.",
        });
      }
    }
  };

  const handleFetchDetails = async () => {
    setIsLoadingDetails(true);
    setShowModal(true);
    try {
      const response = await apiClient.get(`/bet/${game.id}`);
      setGameDetails(response.data?.data || response.data);
    } catch (error) {
      console.error("Failed to fetch game details:", error);
      setShowModal(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-yellow-500/60 hover:shadow-yellow-500/10 transition-all duration-300 shadow-xl flex flex-col relative">
        {/* Thumbnail Container */}
        <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
          <img
            src={
              game.image ||
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400"
            }
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Badge */}
          {game.badge && (
            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg border border-red-500/30">
              {game.badge}
            </span>
          )}

          {/* Info Button Overlay (API 2 Trigger) */}
          <button
            onClick={handleFetchDetails}
            className="absolute top-2.5 right-2.5 p-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-zinc-700/50 hover:border-zinc-500 z-10"
            title="Game Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Play Button Action Overlay (API 3 Trigger) */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${
              isLaunching ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <button
              onClick={handleLaunchSession}
              disabled={isLaunching}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black p-3.5 rounded-full shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 font-bold flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-80"
              aria-label={`Play ${game.title}`}
            >
              {isLaunching ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Details Footer */}
        <div className="p-3.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-zinc-900 to-[#111]">
          <h3 className="text-xs font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
            {game.title}
          </h3>
          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate max-w-[70%]">
              {game.provider}
            </span>
            {game.rtp && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {game.rtp}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Game Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
                  <p className="text-zinc-400 text-sm animate-pulse">
                    Loading game data...
                  </p>
                </div>
              ) : gameDetails ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      <img
                        src={
                          game.image ||
                          "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400"
                        }
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">
                        {gameDetails.title || game.title}
                      </h2>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-zinc-800 text-zinc-300 text-[10px] uppercase tracking-wider rounded font-medium">
                        {gameDetails.provider || game.provider}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-zinc-400 bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                      <span className="text-zinc-500">Category</span>
                      <span className="text-white font-medium capitalize">
                        {gameDetails.category || "Slots"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                      <span className="text-zinc-500">RTP</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {gameDetails.rtp || game.rtp || "N/A"}
                      </span>
                    </div>
                    <div className="pt-2 text-xs leading-relaxed">
                      {gameDetails.description ||
                        "Immerse yourself in this premium casino experience. Place your bets and enjoy cutting-edge gameplay."}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleLaunchSession();
                    }}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-current" /> Play Game Now
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center text-zinc-500">
                  Could not load game details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
