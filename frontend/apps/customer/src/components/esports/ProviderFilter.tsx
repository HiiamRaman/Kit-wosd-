import React from "react";
import { Filter } from "lucide-react";

interface ProviderFilterProps {
  providers: string[];
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
}

export const ProviderFilter: React.FC<ProviderFilterProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
      <Filter className="w-4 h-4 text-zinc-500 mr-1 flex-shrink-0" />
      {providers.map((provider) => (
        <button
          key={provider}
          onClick={() => onSelectProvider(provider)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
            selectedProvider === provider
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          {provider}
        </button>
      ))}
    </div>
  );
};
