"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { useSearch } from "@/lib/hooks/use-search";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isFetching } = useSearch(debouncedQuery);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(slug: string) {
    router.push(`/coin/${slug}`);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      {/* Input */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 1 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari koin..."
          className={cn(
            "w-full bg-secondary border border-border/50 rounded-lg",
            "pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-1 focus:ring-(--color-brand-500) focus:border-(--color-brand-500)",
            "transition-all"
          )}
        />
        {isFetching && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
          />
        )}
      </div>

      {/* Dropdown */}
      {open && query.length >= 1 && (
        <div className="absolute top-full mt-1 w-full min-w-70 right-0 z-50 rounded-xl border border-border/50 bg-popover shadow-xl overflow-hidden">
          {!results || results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {isFetching ? "Mencari..." : `Tidak ada hasil untuk "${query}"`}
            </div>
          ) : (
            <ul>
              {results.map((coin) => (
                <li key={coin.id}>
                  <button
                    onClick={() => handleSelect(coin.slug)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <TrendingUp size={14} className="text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{coin.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 uppercase">
                        {coin.symbol}
                      </span>
                    </div>
                    {coin.rank && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        #{coin.rank}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}