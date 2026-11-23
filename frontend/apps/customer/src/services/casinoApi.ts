// import { apiClient } from "./api.client";
// import type {
//   FetchGamesParams,
//   FetchGamesResponse,
// } from "../../../../packages/shared/types/casino";

// export interface Game {
//   id: number;
//   title: string;
//   provider: string;
//   category: "live" | "slots" | "table" | "crash" | "shows";
//   players: number;
//   rtp: string;
//   image: string;
//   badge?: "LIVE" | "HOT" | "NEW" | "VIP" | "EXCLUSIVE" | "DROPS" | string;
//   badgeColor?: string;
// }

// // Fallback images if the provider thumbnail is missing or fails
// const CASINO_IMAGES = {
//   slots:
//     "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
//   roulette:
//     "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80",
// };

// export async function fetchCasinoGames(
//   params: FetchGamesParams = {},
// ): Promise<FetchGamesResponse> {
//   const {
//     page = 1,
//     limit = 18,
//     search = "",
//     category = "all",
//     provider = "all",
//   } = params;

//   try {
//     // 1. Fetch game catalog from backend
//     const response = await apiClient.get("/bet");
//     const rawGames = response.data.data || [];

//     // 2. Map raw backend games to match the shared Game type
//     const formattedGames: Game[] = rawGames.map((g: any) => ({
//       id: g.id,
//       title: g.name,
//       provider: g.provider || g.category_title || "Unknown",
//       category: g.game_type === "slot" ? "slots" : "live",
//       players: Math.floor(Math.random() * 5000) + 500,
//       rtp: "96.50%",
//       image: g.thumbnail || CASINO_IMAGES.slots,
//       badge: g.is_premium ? "VIP" : undefined,
//     }));

//     // 3. Extract unique providers from the FULL list before filtering
//     const allProviders = Array.from(
//       new Set(formattedGames.map((g) => g.provider)),
//     ).sort();

//     // 4. Apply filters (Search, Category, Provider)
//     let filteredGames = formattedGames;

//     if (search.trim()) {
//       const query = search.toLowerCase();
//       filteredGames = filteredGames.filter(
//         (g) =>
//           g.title.toLowerCase().includes(query) ||
//           g.provider.toLowerCase().includes(query),
//       );
//     }

//     if (category !== "all") {
//       if (category === "hot") {
//         filteredGames = filteredGames.filter(
//           (g) => g.badge === "HOT" || g.players > 4000,
//         );
//       } else {
//         filteredGames = filteredGames.filter((g) => g.category === category);
//       }
//     }

//     if (provider !== "all") {
//       filteredGames = filteredGames.filter((g) => g.provider === provider);
//     }

//     // 5. Handle Pagination
//     const total = filteredGames.length;
//     const totalPages = Math.ceil(total / limit) || 1;
//     const startIndex = (page - 1) * limit;
//     const paginatedGames = filteredGames.slice(startIndex, startIndex + limit);

//     return {
//       games: paginatedGames,
//       total,
//       totalPages,
//       currentPage: page,
//       providers: allProviders,
//     };
//   } catch (error) {
//     console.error("Failed to fetch casino games from backend:", error);
//     return {
//       games: [],
//       total: 0,
//       totalPages: 1,
//       currentPage: page,
//       providers: [],
//     };
//   }
// }

import { apiClient } from "./api.client";
import type {
  Game,
  FetchGamesParams,
  FetchGamesResponse,
} from "../../../../packages/shared/types/casino";

// Export the canonical Game type from the shared package
export type { Game };

// Fallback images based on category if provider thumbnail fails
const CASINO_IMAGES: Record<string, string> = {
  slots:
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
  roulette:
    "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80",
  table:
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80",
  crash:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
};

/**
 * Normalizes varied backend types/tags into standard categories
 */
function normalizeCategory(
  gameType?: string,
  categoryTitle?: string,
): Game["category"] {
  const text = `${gameType || ""} ${categoryTitle || ""}`.toLowerCase();

  if (text.includes("slot")) return "slots";
  if (text.includes("crash") || text.includes("aviator")) return "crash";
  if (
    text.includes("card") ||
    text.includes("blackjack") ||
    text.includes("poker") ||
    text.includes("table")
  ) {
    return "table";
  }
  if (text.includes("show") || text.includes("wheel")) return "shows";
  return "live";
}

export async function fetchCasinoGames(
  params: FetchGamesParams = {},
): Promise<FetchGamesResponse> {
  const {
    page = 1,
    limit = 18,
    search = "",
    category = "all",
    provider = "all",
  } = params;

  try {
    // 1. Fetch game catalog from backend
    const response = await apiClient.get("/bet");
    const rawGames =
      response.data?.data || response.data?.games || response.data || [];

    if (!Array.isArray(rawGames)) {
      console.warn("Expected an array of games from /bet, received:", rawGames);
      return {
        games: [],
        total: 0,
        totalPages: 1,
        currentPage: page,
        providers: [],
      };
    }

    // 2. Map raw backend games to match shared Game format
    const formattedGames: Game[] = rawGames.map((g: any, index: number) => {
      const mappedCategory = normalizeCategory(
        g.game_type,
        g.category_title || g.category,
      );
      const fallbackImage =
        CASINO_IMAGES[
          mappedCategory === "live" ? "roulette" : mappedCategory
        ] || CASINO_IMAGES.slots;

      // Ensure id is strictly a number to satisfy shared Game type
      const parsedId = Number(g.id);
      const safeId = !isNaN(parsedId) && parsedId !== 0 ? parsedId : index + 1;

      return {
        id: safeId,
        title: g.name || g.title || "Untitled Game",
        provider: g.provider || g.category_title || "Unknown Provider",
        category: mappedCategory,
        players: g.players ?? Math.floor(Math.random() * 4500) + 500,
        rtp: g.rtp || "96.50%",
        image: g.thumbnail || g.image || fallbackImage,
        badge: g.is_premium ? "VIP" : g.is_hot ? "HOT" : g.badge || undefined,
      };
    });

    // 3. Extract unique providers before filtering
    const allProviders = Array.from(
      new Set(formattedGames.map((g) => g.provider)),
    )
      .filter(Boolean)
      .sort();

    // 4. Apply Filters (Search, Category, Provider)
    let filteredGames = formattedGames;

    if (search.trim()) {
      const query = search.toLowerCase();
      filteredGames = filteredGames.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.provider.toLowerCase().includes(query),
      );
    }

    if (category && category !== "all") {
      const targetCategory = category.toLowerCase();

      if (targetCategory === "hot") {
        filteredGames = filteredGames.filter(
          (g) => g.badge === "HOT" || g.players > 4000,
        );
      } else if (targetCategory === "slots" || targetCategory === "slot") {
        filteredGames = filteredGames.filter((g) => g.category === "slots");
      } else if (
        targetCategory === "casino" ||
        targetCategory === "live" ||
        targetCategory === "live-casino"
      ) {
        filteredGames = filteredGames.filter(
          (g) => g.category === "live" || g.category === "shows",
        );
      } else if (
        targetCategory === "cards" ||
        targetCategory === "card" ||
        targetCategory === "table"
      ) {
        filteredGames = filteredGames.filter((g) => g.category === "table");
      } else if (
        targetCategory === "crash" ||
        targetCategory === "crash-game"
      ) {
        filteredGames = filteredGames.filter((g) => g.category === "crash");
      } else {
        filteredGames = filteredGames.filter(
          (g) => g.category === targetCategory,
        );
      }
    }

    if (provider && provider !== "all") {
      filteredGames = filteredGames.filter(
        (g) => g.provider.toLowerCase() === provider.toLowerCase(),
      );
    }

    // 5. Handle Pagination
    const total = filteredGames.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedGames = filteredGames.slice(startIndex, startIndex + limit);

    return {
      games: paginatedGames,
      total,
      totalPages,
      currentPage: page,
      providers: allProviders,
    };
  } catch (error) {
    console.error("Failed to fetch casino games from backend:", error);
    return {
      games: [],
      total: 0,
      totalPages: 1,
      currentPage: page,
      providers: [],
    };
  }
}
