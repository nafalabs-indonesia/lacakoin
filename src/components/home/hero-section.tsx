"use client";

import { useListings } from "@/lib/hooks/use-listings";
import { useCurrency } from "@/lib/hooks/use-currency";
import { formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Coin } from "@/types/coin";
import { ArrowUpRight } from "lucide-react"; // Icon lain dihapus karena quicklinks sudah tanpa icon

// Warna Aksen Utama
const BRAND_COLOR = "#5170ff";

function CoinCard({ coin, index }: { coin: Coin; index: number }) {
    const { formatPrice } = useCurrency();
    const usd = coin.quote.USD;
    const positive = isPositive(usd.percent_change_24h);

    return (
        <Link
            href={`/coin/${coin.slug}`}
            className="flex flex-col gap-3 p-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card hover:border-[#5170ff]/40 transition-all group"
            style={{ animation: `fadeSlideUp 0.5s ease ${0.1 + index * 0.07}s both` }}
        >
            <Image
                src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                alt={coin.name}
                width={36}
                height={36}
                className="rounded-full"
            />
            <div>
                <p className="text-xs text-muted-foreground">
                    {coin.symbol}
                    <span className="text-muted-foreground/60">/USDT</span>
                </p>
                <p className="text-base font-bold tabular-nums mt-0.5">
                    {formatPrice(usd.price)}
                </p>
                <p
                    className={cn(
                        "text-sm font-semibold tabular-nums mt-0.5",
                        positive ? "text-emerald-500" : "text-rose-500"
                    )}
                >
                    {formatPercent(usd.percent_change_24h)}
                </p>
            </div>
        </Link>
    );
}

function CoinCardSkeleton({ index }: { index: number }) {
    return (
        <div
            className="h-32 rounded-2xl bg-secondary animate-pulse"
            style={{ animationDelay: `${index * 0.08}s` }}
        />
    );
}

// Quick links tanpa icon, lebih simpel
const quickLinks = [
    { href: "/trending", label: "Trending" },
    { href: "/fear-greed", label: "Sentimen" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/news", label: "Berita" },
];

export function HeroSection() {
    const { data } = useListings({ limit: 6 });
    const topCoins = data?.data?.slice(0, 6) ?? [];

    return (
        <section className="relative overflow-hidden border-b border-border/50">

            {/* Background blobs with new accent color */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
                    style={{
                        background: `radial-gradient(circle, ${BRAND_COLOR}, transparent 70%)`,
                        animation: "blob 10s ease-in-out infinite",
                    }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-5"
                    style={{
                        background: `radial-gradient(circle, ${BRAND_COLOR}, transparent 70%)`,
                        animation: "blob 14s ease-in-out infinite reverse",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Kiri */}
                    <div className="space-y-8">

                        {/* Headline */}
                        <div
                            className="space-y-4"
                            style={{ animation: "fadeSlideUp 0.5s ease both" }}
                        >
                            <h1 className="text-6xl sm:text-7xl font-bold leading-[1.05] tracking-tight">
                                Pantau kripto.
                                <br />
                                <span style={{ color: BRAND_COLOR }}>
                                    Rasa lokal.
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                                Data harga realtime dari ratusan koin kripto.
                                Gratis, tanpa iklan, nuansa Indonesia.
                            </p>
                        </div>

                        {/* Email form */}
                        <div
                            className="space-y-3"
                            style={{ animation: "fadeSlideUp 0.5s ease 0.15s both" }}
                        >
                            <div className="flex items-center gap-2 bg-secondary border border-border/50 rounded-2xl px-4 py-1 max-w-md focus-within:ring-1 focus-within:ring-[#5170ff] focus-within:border-[#5170ff] transition-all">
                                <input
                                    type="email"
                                    placeholder="Masukkan email kamu"
                                    className="flex-1 bg-transparent py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none"
                                />
                                <button
                                    className="shrink-0 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                                    style={{ backgroundColor: BRAND_COLOR }}
                                >
                                    Mulai Gratis
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Quick links (No Icons) */}
                        <div
                            className="flex items-center gap-2 flex-wrap"
                            style={{ animation: "fadeSlideUp 0.5s ease 0.25s both" }}
                        >
                            {quickLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="inline-flex items-center px-4 py-2 rounded-xl border border-border/50 text-xs font-medium text-muted-foreground hover:text-[#5170ff] hover:border-[#5170ff]/30 hover:bg-[#5170ff]/5 transition-colors"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Kanan — 3x2 grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {topCoins.length === 0
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <CoinCardSkeleton key={i} index={i} />
                            ))
                            : topCoins.map((coin, i) => (
                                <CoinCard key={coin.id} coin={coin} index={i} />
                            ))}
                    </div>

                </div>
            </div>
        </section>
    );
}