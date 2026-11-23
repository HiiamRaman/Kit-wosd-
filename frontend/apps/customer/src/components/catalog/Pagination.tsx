import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>

      <span className="text-xs font-mono text-zinc-400">
        Page <strong className="text-white">{currentPage}</strong> of{" "}
        <strong className="text-white">{totalPages}</strong>
      </span>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
