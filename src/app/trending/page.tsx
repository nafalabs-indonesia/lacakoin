"use client";

import { useTrending } from "@/lib/hooks/use-trending";
import { CoinCard } from "@/components/common/coin-card";
import { TrendingUp, TrendingDown, Flame } from "lucide-react";
import { Coin } from "@/types/coin";

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  iconClass,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={20} className={iconClass} />
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function CoinListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl border border-border/50 bg-card animate-pulse"
        />
      ))}
    </div>
  );
}

export default function TrendingPage() {
  const { data, isLoading, isError } = useTrending();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Flame size={24} className="text-orange-400" />
          Trending
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Koin dengan pergerakan paling signifikan hari ini
        </p>
      </div>

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive text-sm text-center">
          Gagal memuat data trending. Coba refresh halaman.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Trending */}
        <div>
          <SectionHeader
            icon={Flame}
            title="Trending"
            subtitle="Volume tertinggi vs market cap"
            iconClass="text-orange-400"
          />
          {isLoading ? (
            <CoinListSkeleton />
          ) : (
            <div className="space-y-2">
              {data?.trending.map((coin: Coin, i: number) => (
                <CoinCard key={coin.id} coin={coin} rank={i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Gainers */}
        <div>
          <SectionHeader
            icon={TrendingUp}
            title="Top Gainers"
            subtitle="Naik terbanyak dalam 24 jam"
            iconClass="text-[var(--color-up)]"
          />
          {isLoading ? (
            <CoinListSkeleton />
          ) : (
            <div className="space-y-2">
              {data?.gainers.map((coin: Coin, i: number) => (
                <CoinCard key={coin.id} coin={coin} rank={i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Losers */}
        <div>
          <SectionHeader
            icon={TrendingDown}
            title="Top Losers"
            subtitle="Turun terbanyak dalam 24 jam"
            iconClass="text-[var(--color-down)]"
          />
          {isLoading ? (
            <CoinListSkeleton />
          ) : (
            <div className="space-y-2">
              {data?.losers.map((coin: Coin, i: number) => (
                <CoinCard key={coin.id} coin={coin} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}