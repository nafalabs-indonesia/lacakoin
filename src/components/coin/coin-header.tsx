"use client";

import Image from "next/image";
import { CoinDetail, CoinQuote } from "@/types/coin";
import { formatPercent, isPositive, cn } from "@/lib/utils";
import { useCurrency } from "@/lib/hooks/use-currency";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";

interface CoinHeaderProps {
  meta: CoinDetail;
  quote: CoinQuote;
}

function PriceChange({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const positive = isPositive(value);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-medium tabular-nums flex items-center gap-0.5",
          positive ? "text-(--color-up)" : "text-(--color-down)"
        )}
      >
        {positive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {formatPercent(value)}
      </span>
    </div>
  );
}

export function CoinHeader({ meta, quote }: CoinHeaderProps) {
  const usd = quote.quote.USD;
  const { formatPrice } = useCurrency();

  return (
    <div className="flex flex-col gap-6">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <Image
            src={meta.logo}
            alt={meta.name}
            width={48}
            height={48}
            className="rounded-full"
          />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{meta.name}</h1>

              <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded font-mono uppercase">
                {meta.symbol}
              </span>

              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                #{quote.cmc_rank}
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {meta.urls?.website?.[0] && (
                <a
                  href={meta.urls.website[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Website <ExternalLink size={10} />
                </a>
              )}

              {meta.urls?.source_code?.[0] && (
                <a
                  href={meta.urls.source_code[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  GitHub <ExternalLink size={10} />
                </a>
              )}

              {meta.urls?.reddit?.[0] && (
                <a
                  href={meta.urls.reddit[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Reddit <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="sm:ml-auto text-left sm:text-right">
          <p className="text-3xl font-bold tabular-nums">
            {formatPrice(usd.price)}
          </p>

          <p
            className={cn(
              "text-sm font-medium mt-1 tabular-nums flex items-center gap-1 sm:justify-end",
              isPositive(usd.percent_change_24h)
                ? "text-(--color-up)"
                : "text-(--color-down)"
            )}
          >
            {isPositive(usd.percent_change_24h) ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
            {formatPercent(usd.percent_change_24h)} (24j)
          </p>
        </div>
      </div>

      {/* Price changes */}
      <div className="flex items-center gap-6 overflow-x-auto pb-1">
        <PriceChange value={usd.percent_change_1h} label="1 Jam" />
        <PriceChange value={usd.percent_change_24h} label="24 Jam" />
        <PriceChange value={usd.percent_change_7d} label="7 Hari" />
        <PriceChange value={usd.percent_change_30d} label="30 Hari" />
        <PriceChange value={usd.percent_change_60d} label="60 Hari" />
        <PriceChange value={usd.percent_change_90d} label="90 Hari" />
      </div>
    </div>
  );
}