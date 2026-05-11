"use client";

import { useListings } from "@/lib/hooks/use-listings";
import { useCurrency } from "@/lib/hooks/use-currency";
import { formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Coin } from "@/types/coin";

function TickerItem({ coin }: { coin: Coin }) {
    const { formatPrice } = useCurrency();
    const usd = coin.quote.USD;
    const positive = isPositive(usd.percent_change_24h);

    return (
        <Link
            href={`/coin/${coin.slug}`}
            className="flex items-center gap-2 px-4 py-1 hover:bg-secondary/50 transition-colors shrink-0 group"
        >
            <Image
                src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                alt={coin.name}
                width={16}
                height={16}
                className="rounded-full shrink-0"
            />
            <span className="text-xs font-medium uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                {coin.symbol}
            </span>
            <span className="text-xs font-medium tabular-nums">
                {formatPrice(usd.price)}
            </span>
            <span
                className={cn(
                    "text-xs tabular-nums flex items-center gap-0.5",
                    positive ? "text-[var(--color-up)]" : "text-[var(--color-down)]"
                )}
            >
                {positive ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {formatPercent(usd.percent_change_24h)}
            </span>
        </Link>
    );
}

function TickerSkeleton() {
    return (
        <div className="flex items-center gap-8 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0 animate-pulse">
                    <div className="w-4 h-4 rounded-full bg-secondary" />
                    <div className="w-8 h-3 rounded bg-secondary" />
                    <div className="w-16 h-3 rounded bg-secondary" />
                    <div className="w-12 h-3 rounded bg-secondary" />
                </div>
            ))}
        </div>
    );
}

export function CoinTicker() {
    const { data, isLoading } = useListings({ limit: 20 });
    const coins = data?.data ?? [];

    return (
        // Hapus sticky bottom-0 di sini karena sudah diatur oleh parent AppLayout
        // Ticker ini hanya perlu border dan background
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm overflow-hidden">
            {isLoading ? (
                <div className="py-1">
                    <TickerSkeleton />
                </div>
            ) : (
                <div className="relative flex py-1">
                    {/* Gradient fade kiri */}
                    <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

                    {/* Marquee */}
                    <div className="flex animate-ticker">
                        {[...coins, ...coins].map((coin, i) => (
                            <TickerItem key={`${coin.id}-${i}`} coin={coin} />
                        ))}
                    </div>

                    {/* Gradient fade kanan */}
                    <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                </div>
            )}
        </div>
    );
}