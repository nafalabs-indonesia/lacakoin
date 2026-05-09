"use client";

import { useTrending } from "@/lib/hooks/use-trending";
import { CoinCard } from "@/components/common/coin-card";
import { TrendingUp, TrendingDown, Flame } from "lucide-react";
import Link from "next/link";
import { Coin } from "@/types/coin";

export function FeaturedCoins() {
    const { data, isLoading } = useTrending();

    const sections = [
        {
            label: "Trending",
            icon: Flame,
            color: "text-orange-400",
            coins: data?.trending.slice(0, 3) ?? [],
            href: "/trending",
        },
        {
            label: "Top Gainers",
            icon: TrendingUp,
            color: "text-[var(--color-up)]",
            coins: data?.gainers.slice(0, 3) ?? [],
            href: "/trending",
        },
        {
            label: "Top Losers",
            icon: TrendingDown,
            color: "text-[var(--color-down)]",
            coins: data?.losers.slice(0, 3) ?? [],
            href: "/trending",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map(({ label, icon: Icon, color, coins, href }) => (
                <div key={label} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Icon size={16} className={color} />
                            {label}
                        </h2>
                        <Link
                            href={href}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Lihat semua →
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
                            ))
                            : coins.map((coin: Coin, i: number) => (
                                <CoinCard key={coin.id} coin={coin} rank={i + 1} />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}