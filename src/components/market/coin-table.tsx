"use client";

import { useState } from "react";
import Link from "next/link";
import { useListings } from "@/lib/hooks/use-listings";
import { formatUSD, formatLargeNumber, formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import { useWatchlistStore } from "@/lib/stores/watchlist";
import { Coin } from "@/types/coin";

type SortKey = "cmc_rank" | "price" | "percent_change_24h" | "market_cap" | "volume_24h";
type SortDir = "asc" | "desc";

function PriceChange({ value }: { value: number }) {
  const positive = isPositive(value);
  return (
    <span
      className={cn(
        "tabular-nums text-sm font-medium",
        positive ? "text-(--color-up)" : "text-(--color-down)"
      )}
    >
      {positive ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />}
      {formatPercent(value)}
    </span>
  );
}

function CoinRowSkeleton() {
  return (
    <tr className="border-b border-border/30 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-secondary rounded w-full max-w-24" />
        </td>
      ))}
    </tr>
  );
}

function SortButton({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = currentSort === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {label}
      <span className="flex flex-col">
        <ChevronUp
          size={10}
          className={cn(active && currentDir === "asc" ? "text-(--color-brand-500)" : "opacity-30")}
        />
        <ChevronDown
          size={10}
          className={cn(active && currentDir === "desc" ? "text-(--color-brand-500)" : "opacity-30")}
        />
      </span>
    </button>
  );
}

export function CoinTable() {
  const [sortKey, setSortKey] = useState<SortKey>("cmc_rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const { data, isLoading, isError } = useListings({ limit: 100 });
  const { ids: watchlistIds, toggle } = useWatchlistStore();

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "cmc_rank" ? "asc" : "desc");
    }
  }

  const sortedCoins = [...(data?.data ?? [])].sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (sortKey) {
      case "price":
        aVal = a.quote.USD.price;
        bVal = b.quote.USD.price;
        break;
      case "percent_change_24h":
        aVal = a.quote.USD.percent_change_24h;
        bVal = b.quote.USD.percent_change_24h;
        break;
      case "market_cap":
        aVal = a.quote.USD.market_cap;
        bVal = b.quote.USD.market_cap;
        break;
      case "volume_24h":
        aVal = a.quote.USD.volume_24h;
        bVal = b.quote.USD.volume_24h;
        break;
      default:
        aVal = a.cmc_rank;
        bVal = b.cmc_rank;
    }

    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive text-center">
        Gagal memuat daftar koin. Coba refresh halaman.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/30">
              <th className="px-4 py-3 text-left w-8">
                <SortButton
                  label="#"
                  sortKey="cmc_rank"
                  currentSort={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-right">
                <SortButton
                  label="Harga"
                  sortKey="price"
                  currentSort={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="ml-auto"
                />
              </th>
              <th className="px-4 py-3 text-right">
                <SortButton
                  label="24j"
                  sortKey="percent_change_24h"
                  currentSort={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="ml-auto"
                />
              </th>
              <th className="px-4 py-3 text-right hidden md:table-cell">
                <SortButton
                  label="Market Cap"
                  sortKey="market_cap"
                  currentSort={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="ml-auto"
                />
              </th>
              <th className="px-4 py-3 text-right hidden lg:table-cell">
                <SortButton
                  label="Volume 24j"
                  sortKey="volume_24h"
                  currentSort={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="ml-auto"
                />
              </th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 20 }).map((_, i) => <CoinRowSkeleton key={i} />)
              : sortedCoins.map((coin: Coin) => (
                  <tr
                    key={coin.id}
                    className="border-b border-border/20 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {coin.cmc_rank}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/coin/${coin.slug}`}
                        className="flex items-center gap-2 hover:text-(--color-brand-500) transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{coin.name}</span>
                          <span className="text-xs text-muted-foreground uppercase">
                            {coin.symbol}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatUSD(coin.quote.USD.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PriceChange value={coin.quote.USD.percent_change_24h} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden md:table-cell">
                      {formatLargeNumber(coin.quote.USD.market_cap)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden lg:table-cell">
                      {formatLargeNumber(coin.quote.USD.volume_24h)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggle(coin.id)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          watchlistIds.includes(coin.id)
                            ? "text-yellow-400"
                            : "text-muted-foreground hover:text-yellow-400"
                        )}
                        aria-label={`${watchlistIds.includes(coin.id) ? "Hapus dari" : "Tambah ke"} watchlist`}
                      >
                        <Star
                          size={15}
                          fill={watchlistIds.includes(coin.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}