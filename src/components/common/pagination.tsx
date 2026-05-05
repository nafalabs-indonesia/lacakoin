import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ page, totalPages, onPageChange, isLoading }: PaginationProps) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1">
      {/* First */}
      <PageButton
        onClick={() => onPageChange(1)}
        disabled={page === 1 || isLoading}
        aria-label="Halaman pertama"
      >
        <ChevronsLeft size={15} />
      </PageButton>

      {/* Prev */}
      <PageButton
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isLoading}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={15} />
      </PageButton>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <PageButton
            key={p}
            onClick={() => onPageChange(p as number)}
            active={p === page}
            disabled={isLoading}
          >
            {p}
          </PageButton>
        )
      )}

      {/* Next */}
      <PageButton
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isLoading}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={15} />
      </PageButton>

      {/* Last */}
      <PageButton
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages || isLoading}
        aria-label="Halaman terakhir"
      >
        <ChevronsRight size={15} />
      </PageButton>
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "min-w-8 h-8 px-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center",
        active
          ? "bg-(--color-brand-500) text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
}