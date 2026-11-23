import { HeroBanner } from "../components/HeroBanner";
import { PromoTicker } from "../components/PromoTicker";
import { HomeCatalogSection } from "../components/catalog/HomeCatalogSection";
import { CashierSteps } from "../components/CashierSteps";

export function HomePage() {
  return (
    <div className="bg-[#050505] text-zinc-100 overflow-hidden font-sans pb-24 relative">
      <HeroBanner />
      <PromoTicker />
      <HomeCatalogSection />
      <CashierSteps />
    </div>
  );
}
