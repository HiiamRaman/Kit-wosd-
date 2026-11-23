// import { useState, useEffect } from "react";
// import { fetchCasinoGames, type Game } from "../services/casinoApi";

// export function useCasinoGames() {
//   const [games, setGames] = useState<Game[]>([]);
//   const [providers, setProviders] = useState<string[]>([]);
//   const [selectedProvider, setSelectedProvider] = useState("All Providers");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     async function loadGames() {
//       setLoading(true);
//       try {
//         const response = await fetchCasinoGames({
//           page: currentPage,
//           limit: 12,
//           search: searchQuery,
//           category: selectedCategory,
//           provider:
//             selectedProvider === "All Providers" ? "all" : selectedProvider,
//         });

//         if (isMounted) {
//           setGames(response.games);
//           setTotalPages(response.totalPages);
//           if (providers.length === 0) {
//             setProviders(["All Providers", ...response.providers]);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load catalog games:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     }

//     const debounceTimer = setTimeout(() => {
//       loadGames();
//     }, 300);

//     return () => {
//       clearTimeout(debounceTimer);
//       isMounted = false;
//     };
//   }, [currentPage, selectedCategory, selectedProvider, searchQuery]);

//   return {
//     games,
//     providers,
//     selectedProvider,
//     setSelectedProvider,
//     selectedCategory,
//     setSelectedCategory,
//     searchQuery,
//     setSearchQuery,
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     loading,
//   };
// }











import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCasinoGames,  } from "../services/casinoApi";
import  type { Game } from "../services/casinoApi";
export function useCasinoGames() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial category directly from URL (e.g., ?category=slots)
  const categoryFromUrl = searchParams.get("category") || "all";

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategoryState] = useState(categoryFromUrl);
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Keep state in sync if URL parameter changes (e.g. user clicks MainNavBar)
  useEffect(() => {
    const urlCat = searchParams.get("category") || "all";
    setSelectedCategoryState(urlCat);
    setCurrentPage(1);
  }, [searchParams]);

  // Wrapper so selecting category updates the URL query param
  const setSelectedCategory = useCallback((cat: string) => {
    setSelectedCategoryState(cat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === "all") {
        next.delete("category");
      } else {
        next.set("category", cat);
      }
      return next;
    });
  }, [setSearchParams]);

  // Fetch games when filters change
  useEffect(() => {
    let isMounted = true;

    async function loadGames() {
      setLoading(true);
      try {
        const res = await fetchCasinoGames({
          page: currentPage,
          limit: 18,
          search: searchQuery,
          category: selectedCategory,
          provider: selectedProvider,
        });

        if (isMounted) {
          setGames(res.games);
          setTotalPages(res.totalPages);
          if (res.providers && res.providers.length > 0) {
            setProviders(res.providers);
          }
        }
      } catch (err) {
        console.error("Error in useCasinoGames:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGames();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedProvider, searchQuery, currentPage]);

  return {
    games,
    loading,
    providers,
    selectedCategory,
    setSelectedCategory,
    selectedProvider,
    setSelectedProvider,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
