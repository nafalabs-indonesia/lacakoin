"use client";

import { useGlobalMetrics } from "@/lib/hooks/use-global-metrics";
import { formatLargeNumber, formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: number;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-secondary">
        <Icon size={18} className="text-(--color-brand-500)" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-semibold tabular-nums truncate">{value}</p>
        {sub && (
          <p
            className={cn(
              "text-xs mt-0.5 tabular-nums",
              trend !== undefined
                ? isPositive(trend)
                  ? "text-(--color-up)"
                  : "text-(--color-down)"
                : "text-muted-foreground"
            )}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 flex items-start gap-3 animate-pulse">
      <div className="p-2 rounded-lg bg-secondary w-10 h-10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-secondary rounded w-24" />
        <div className="h-5 bg-secondary rounded w-32" />
        <div className="h-3 bg-secondary rounded w-16" />
      </div>
    </div>
  );
}

export function MarketStats() {
  const { data, isLoading, isError } = useGlobalMetrics();

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Gagal memuat data pasar. Coba refresh halaman.
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const metrics = data.data;
  const totalMarketCap  = metrics.quote.USD.total_market_cap;
  const totalVolume     = metrics.quote.USD.total_volume_24h;
  const marketCapChange = metrics.quote.USD.total_market_cap_yesterday_percentage_change;
  const volumeChange    = metrics.quote.USD.total_volume_24h_yesterday_percentage_change;
  const btcDominance    = metrics.btc_dominance;
  const ethDominance    = metrics.eth_dominance;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Total Market Cap"
        value={formatLargeNumber(totalMarketCap)}
        sub={formatPercent(marketCapChange) + " vs kemarin"}
        trend={marketCapChange}
        icon={DollarSign}
      />
      <StatCard
        label="Volume 24 Jam"
        value={formatLargeNumber(totalVolume)}
        sub={formatPercent(volumeChange) + " vs kemarin"}
        trend={volumeChange}
        icon={Activity}
      />
      <StatCard
        label="Dominasi BTC"
        value={`${btcDominance.toFixed(1)}%`}
        sub="Bitcoin"
        icon={TrendingUp}
      />
      <StatCard
        label="Dominasi ETH"
        value={`${ethDominance.toFixed(1)}%`}
        sub="Ethereum"
        icon={TrendingDown}
      />
    </div>
  );
}