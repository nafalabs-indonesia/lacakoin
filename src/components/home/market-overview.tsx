"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useListings } from "@/lib/hooks/use-listings";
import { useTrending } from "@/lib/hooks/use-trending";
import { useCurrency } from "@/lib/hooks/use-currency";
import { formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Coin } from "@/types/coin";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

// Warna Aksen
const BRAND_COLOR = "#5170ff";

function PriceChange({ value }: { value: number }) {
    const positive = isPositive(value);
    const neutral = value === 0;

    return (
        <span
            className={cn(
                "text-sm font-medium tabular-nums flex items-center justify-end gap-1",
                positive ? "text-emerald-500" : neutral ? "text-muted-foreground" : "text-rose-500"
            )}
        >
            {positive && <ArrowUpRight size={12} />}
            {neutral && <Minus size={12} />}
            {!positive && !neutral && <ArrowDownRight size={12} />}
            {formatPercent(value)}
        </span>
    );
}

function CoinRow({ coin, showVolume = false }: { coin: Coin; showVolume?: boolean }) {
    const { formatPrice, formatLarge } = useCurrency();
    const usd = coin.quote.USD;

    return (
        <Link
            href={`/coin/${coin.slug}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors group border-b border-border/50 last:border-0"
        >
            {/* Image Container - Fixed Width to prevent layout shift */}
            <div className="w-7 h-7 shrink-0 relative">
                <Image
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                    alt={coin.name}
                    fill
                    sizes="32px" // Menambahkan sizes untuk optimasi performa
                    className="rounded-full object-contain"
                />
            </div>

            {/* Symbol */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-[#5170ff] transition-colors truncate">
                    {coin.symbol}
                    <span className="text-muted-foreground font-normal ml-1">/USDT</span>
                </p>
            </div>

            {/* Price */}
            <p className="text-sm font-medium tabular-nums w-24 text-right hidden sm:block">
                {formatPrice(usd.price)}
            </p>

            {/* Volume (Conditional) */}
            {showVolume && (
                <p className="text-sm text-muted-foreground tabular-nums w-28 text-right hidden md:block">
                    {formatLarge(usd.volume_24h)}
                </p>
            )}

            {/* Change % */}
            <div className="w-20 text-right">
                <PriceChange value={usd.percent_change_24h} />
            </div>
        </Link>
    );
}

// Skeleton harus meniru struktur CoinRow sebisa mungkin
function CoinRowSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-secondary shrink-0" />
            <div className="flex-1 h-4 bg-secondary rounded w-16" />
            <div className="w-24 h-4 bg-secondary rounded hidden sm:block" />
            <div className="w-20 h-4 bg-secondary rounded ml-auto" />
        </div>
    );
}

type TabKey = "popular" | "gainers" | "volume";

const TABS: { key: TabKey; label: string }[] = [
    { key: "popular", label: "Popular" },
    { key: "gainers", label: "Gainers" },
    { key: "volume", label: "24h Vol" },
];

export function MarketOverview() {
    const [tab, setTab] = useState<TabKey>("popular");
    const { data, isLoading } = useListings({ limit: 20 });
    const { data: trendingData, isLoading: trendingLoading } = useTrending();

    const coins = data?.data ?? [];

    // Memoize sorting logic to avoid recalculation on every render if not needed
    const displayCoins = (() => {
        if (!coins.length) return [];

        switch (tab) {
            case "gainers":
                return [...coins].sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h).slice(0, 6);
            case "volume":
                return [...coins].sort((a, b) => b.quote.USD.volume_24h - a.quote.USD.volume_24h).slice(0, 6);
            default:
                return coins.slice(0, 6);
        }
    })();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Kiri — Popular / Gainers / Volume */}
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-border/30">
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                                tab === key
                                    ? "border-[#5170ff] text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Header Columns */}
                <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground border-b border-border/20 bg-secondary/10">
                    <div className="w-7 shrink-0" /> {/* Spacer for Icon */}
                    <div className="flex-1">Pair</div>
                    <div className="w-24 text-right hidden sm:block">Harga</div>
                    {tab === "volume" && (
                        <div className="w-28 text-right hidden md:block">Volume</div>
                    )}
                    <div className="w-20 text-right">24j</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border/20">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <CoinRowSkeleton key={`skel-${i}`} />)
                        : displayCoins.map((coin) => (
                            <CoinRow
                                key={coin.id}
                                coin={coin}
                                showVolume={tab === "volume"}
                            />
                        ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border/20 bg-secondary/10">
                    <Link
                        href="/"
                        className="text-xs font-medium text-[#5170ff] hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                        Lihat semua koin
                        <ArrowUpRight size={12} className="-rotate-45" />
                    </Link>
                </div>
            </div>

            {/* Kanan — Listings & Trending */}
            <div className="space-y-4">

                {/* Listings — Top losers (Contoh menggunakan losers dari trendingData) */}
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/20 bg-secondary/10">
                        <h3 className="text-sm font-semibold">Top Losers</h3>
                    </div>
                    <div className="divide-y divide-border/20">
                        {trendingLoading || !trendingData?.losers
                            ? Array.from({ length: 3 }).map((_, i) => <CoinRowSkeleton key={`loser-sk-${i}`} />)
                            : trendingData.losers.slice(0, 3).map((coin) => (
                                <CoinRow key={coin.id} coin={coin} />
                            ))}
                    </div>
                </div>

                {/* Trending */}
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/20 bg-secondary/10">
                        <h3 className="text-sm font-semibold">Trending</h3>
                    </div>
                    <div className="divide-y divide-border/20">
                        {trendingLoading || !trendingData?.trending
                            ? Array.from({ length: 3 }).map((_, i) => <CoinRowSkeleton key={`trend-sk-${i}`} />)
                            : trendingData.trending.slice(0, 3).map((coin) => (
                                <CoinRow key={coin.id} coin={coin} />
                            ))}
                    </div>
                </div>

            </div>
        </div>
    );
}