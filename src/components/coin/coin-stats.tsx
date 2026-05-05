"use client";

import { CoinQuote } from "@/types/coin";
import { formatPercent, formatSupply, formatDate, isPositive } from "@/lib/utils";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";

interface CoinStatsProps {
  quote: CoinQuote;
  dateAdded: string;
}

function StatRow({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          trend !== undefined
            ? isPositive(trend)
              ? "text-(--color-up)"
              : "text-(--color-down)"
            : ""
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CoinStats({ quote, dateAdded }: CoinStatsProps) {
  const usd = quote.quote.USD;
  const { formatPrice, formatLarge } = useCurrency();

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-semibold mb-1">Statistik Pasar</h3>
      <div className="mt-3">
        <StatRow label="Harga"              value={formatPrice(usd.price)}                        />
        <StatRow label="Market Cap"         value={formatLarge(usd.market_cap)}                   />
        <StatRow label="Volume 24 Jam"      value={formatLarge(usd.volume_24h)}                   />
        <StatRow label="FDV"                value={formatLarge(usd.fully_diluted_market_cap)}     />
        <StatRow label="Dominasi MC"        value={`${usd.market_cap_dominance.toFixed(2)}%`}    />
        <StatRow label="Perubahan 24j"      value={formatPercent(usd.percent_change_24h)} trend={usd.percent_change_24h} />
        <StatRow label="Perubahan 7h"       value={formatPercent(usd.percent_change_7d)}  trend={usd.percent_change_7d}  />
        <StatRow label="Perubahan 30h"      value={formatPercent(usd.percent_change_30d)} trend={usd.percent_change_30d} />
        <StatRow label="Rank CMC"           value={`#${quote.cmc_rank}`}                          />
        <StatRow label="Circulating Supply" value={formatSupply(quote.circulating_supply)}        />
        <StatRow label="Total Supply"       value={formatSupply(quote.total_supply)}              />
        <StatRow label="Max Supply"         value={formatSupply(quote.max_supply)}                />
        <StatRow label="Tanggal Listed"     value={formatDate(dateAdded)}                         />
      </div>
    </div>
  );
}