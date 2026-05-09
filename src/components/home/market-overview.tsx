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

function PriceChange({ value }: { value: number }) {
    const positive = isPositive(value);
    return (
        <span
            className={cn(
                "text-sm font-medium tabular-nums",
                positive ? "text-[var(--color-up)]" : "text-[var(--color-down)]"
            )}
        >
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
            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors group"
        >
            <Image
                src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                alt={coin.name}
                width={28}
                height={28}
                className="rounded-full shrink-0"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-[var(--color-brand-500)] transition-colors">
                    {coin.symbol}
                    <span className="text-muted-foreground font-normal">/USDT</span>
                </p>
            </div>
            <p className="text-sm font-medium tabular-nums w-28 text-right">
                {formatPrice(usd.price)}
            </p>
            {showVolume && (
                <p className="text-sm text-muted-foreground tabular-nums w-32 text-right hidden md:block">
                    {formatLarge(usd.volume_24h)}
                </p>
            )}
            <div className="w-20 text-right">
                <PriceChange value={usd.percent_change_24h} />
            </div>
        </Link>
    );
}

function CoinRowSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-secondary shrink-0" />
            <div className="flex-1 h-4 bg-secondary rounded" />
            <div className="w-24 h-4 bg-secondary rounded" />
            <div className="w-16 h-4 bg-secondary rounded" />
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

    const displayCoins: Coin[] = (() => {
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
                                    ? "border-[var(--color-brand-500)] text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground border-b border-border/20">
                    <div className="w-7 shrink-0" />
                    <div className="flex-1">Pair</div>
                    <div className="w-28 text-right">Harga</div>
                    {tab === "volume" && (
                        <div className="w-32 text-right hidden md:block">Volume 24j</div>
                    )}
                    <div className="w-20 text-right">24j</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border/20">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <CoinRowSkeleton key={i} />)
                        : displayCoins.map((coin) => (
                            <CoinRow
                                key={coin.id}
                                coin={coin}
                                showVolume={tab === "volume"}
                            />
                        ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border/20">
                    <Link
                        href="/"
                        className="text-xs text-[var(--color-brand-500)] hover:opacity-80 transition-opacity"
                    >
                        Lihat semua koin →
                    </Link>
                </div>
            </div>

            {/* Kanan — Listings & Trending */}
            <div className="space-y-4">

                {/* Listings — Top losers */}
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/20">
                        <h3 className="text-sm font-semibold">Listings Baru</h3>
                    </div>
                    <div className="divide-y divide-border/20">
                        {trendingLoading
                            ? Array.from({ length: 3 }).map((_, i) => <CoinRowSkeleton key={i} />)
                            : (trendingData?.losers.slice(0, 3) ?? []).map((coin) => (
                                <CoinRow key={coin.id} coin={coin} />
                            ))}
                    </div>
                </div>

                {/* Trending */}
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/20">
                        <h3 className="text-sm font-semibold">Trending</h3>
                    </div>
                    <div className="divide-y divide-border/20">
                        {trendingLoading
                            ? Array.from({ length: 3 }).map((_, i) => <CoinRowSkeleton key={i} />)
                            : (trendingData?.trending.slice(0, 3) ?? []).map((coin) => (
                                <CoinRow key={coin.id} coin={coin} />
                            ))}
                    </div>
                </div>

            </div>
        </div>
    );
}