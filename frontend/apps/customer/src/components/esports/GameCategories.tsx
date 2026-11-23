import React from "react";
import { LayoutGrid, Sparkles, CreditCard, Radio, Zap } from "lucide-react";

interface GameCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CATEGORIES = [
  { id: "all", label: "All Games", icon: LayoutGrid },
  { id: "slots", label: "Slots", icon: Sparkles },
  { id: "cards", label: "Card Games", icon: CreditCard },
  { id: "casino", label: "Live Casino", icon: Radio },
  { id: "crash", label: "Crash Games", icon: Zap },
];

export const GameCategories: React.FC<GameCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none scroll-smooth">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ease-out cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02] border-transparent"
                : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-transform duration-300 ${
                isActive
                  ? "text-black"
                  : "text-zinc-500 group-hover:text-amber-400 group-hover:scale-110"
              }`}
            />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
