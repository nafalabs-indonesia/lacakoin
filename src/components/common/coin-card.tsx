import Link from "next/link";
import Image from "next/image";
import { Coin } from "@/types/coin";
import { formatUSD, formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CoinCardProps {
  coin: Coin;
  rank?: number;
}

export function CoinCard({ coin, rank }: CoinCardProps) {
  const usd = coin.quote.USD;
  const positive = isPositive(usd.percent_change_24h);

  return (
    <Link
      href={`/coin/${coin.slug}`}
      className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors group"
    >
      {/* Rank */}
      {rank && (
        <span className="text-xs text-muted-foreground tabular-nums w-5 shrink-0">
          {rank}
        </span>
      )}

      {/* Logo */}
      <Image
        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
        alt={coin.name}
        width={32}
        height={32}
        className="rounded-full shrink-0"
      />

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-(--color-brand-500) transition-colors">
          {coin.name}
        </p>
        <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
      </div>

      {/* Price & Change */}
      <div className="text-right shrink-0">
        <p className="text-sm font-medium tabular-nums">{formatUSD(usd.price)}</p>
        <p
          className={cn(
            "text-xs tabular-nums flex items-center justify-end gap-0.5",
            positive ? "text-(--color-up)" : "text-(--color-down)"
          )}
        >
          {positive ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {formatPercent(usd.percent_change_24h)}
        </p>
      </div>
    </Link>
  );
}