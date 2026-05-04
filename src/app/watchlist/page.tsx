"use client";

import { useWatchlistStore } from "@/lib/stores/watchlist";
import { useListings } from "@/lib/hooks/use-listings";
import { CoinTable } from "@/components/market/coin-table";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatUSD, formatLargeNumber, formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Coin } from "@/types/coin";

function WatchlistCoinRow({ coin }: { coin: Coin }) {
  const { toggle, ids } = useWatchlistStore();
  const usd = coin.quote.USD;

  return (
    <tr className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
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
        {formatUSD(usd.price)}
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={cn(
            "tabular-nums text-sm font-medium flex items-center justify-end gap-0.5",
            isPositive(usd.percent_change_24h)
              ? "text-(--color-up)"
              : "text-(--color-down)"
          )}
        >
          {isPositive(usd.percent_change_24h) ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
          {formatPercent(usd.percent_change_24h)}
        </span>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden md:table-cell">
        {formatLargeNumber(usd.market_cap)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden lg:table-cell">
        {formatLargeNumber(usd.volume_24h)}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => toggle(coin.id)}
          className="p-1 rounded transition-colors text-yellow-400 hover:text-muted-foreground"
          aria-label="Hapus dari watchlist"
        >
          <Star size={15} fill="currentColor" />
        </button>
      </td>
    </tr>
  );
}

function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="p-4 rounded-full bg-secondary">
        <Star size={32} className="text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Watchlist kosong</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tambahkan koin dari halaman Market dengan klik ikon bintang.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-(--color-brand-500) hover:opacity-80 transition-opacity"
      >
        <TrendingUp size={16} />
        Lihat Market
      </Link>
    </div>
  );
}

export default function WatchlistPage() {
  const { ids } = useWatchlistStore();
  const { data, isLoading } = useListings({ limit: 100 });

  const watchlistCoins = (data?.data ?? []).filter((coin: Coin) =>
    ids.includes(coin.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Star size={22} className="text-yellow-400" fill="currentColor" />
          Watchlist
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {ids.length > 0
            ? `${ids.length} koin dipantau`
            : "Belum ada koin yang dipantau"}
        </p>
      </div>

      {/* Content */}
      {ids.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
              Memuat data...
            </div>
          ) : watchlistCoins.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Koin di watchlist tidak ditemukan di top 100. Coba tambah koin lain.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-8">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Nama</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Harga</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">24j</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden md:table-cell">Market Cap</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden lg:table-cell">Volume 24j</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {watchlistCoins.map((coin: Coin) => (
                    <WatchlistCoinRow key={coin.id} coin={coin} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}