import { useCasinoGames } from "../../hooks/useCasinoGames";
import { EsportsHeader } from "../esports/EsportsHeader";
import { GameCategories } from "../esports/GameCategories";
import { ProviderFilter } from "../esports/ProviderFilter";
import { GameGrid } from "./GameGrid";
import { Pagination } from "./Pagination";

export function HomeCatalogSection() {
  const {
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
  } = useCasinoGames();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
      <EsportsHeader
        searchQuery={searchQuery}
        setSearchQuery={(q: string) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      <GameCategories
        selectedCategory={selectedCategory}
        onSelectCategory={(cat: string) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
      />

      <ProviderFilter
        providers={providers}
        selectedProvider={selectedProvider}
        onSelectProvider={(prov: string) => {
          setSelectedProvider(prov);
          setCurrentPage(1);
        }}
      />

      <GameGrid loading={loading} games={games} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
