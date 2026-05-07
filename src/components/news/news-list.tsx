"use client";

import { useState } from "react";
import { useNews } from "@/lib/hooks/use-news";
import { NewsCard } from "./news-card";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { label: "Semua", value: "" },
    { label: "BTC", value: "BTC" },
    { label: "ETH", value: "ETH" },
    { label: "Altcoin", value: "ALTCOIN" },
    { label: "DeFi", value: "DEFI" },
    { label: "Market", value: "MARKET" },
    { label: "Regulasi", value: "REGULATION" },
    { label: "Mining", value: "MINING" },
];

function NewsCardSkeleton() {
    return (
        <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card animate-pulse">
            <div className="shrink-0 w-20 h-20 rounded-lg bg-secondary" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary rounded w-full" />
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
        </div>
    );
}

export function NewsList() {
    const [category, setCategory] = useState("");
    const { data, isLoading, isError } = useNews(category, 20);

    return (
        <div className="space-y-4">
            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setCategory(value)}
                        className={cn(
                            "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            category === value
                                ? "bg-[var(--color-brand-500)] text-background"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {isError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive text-center">
                    Gagal memuat berita. Coba refresh halaman.
                </div>
            )}

            {/* List */}
            <div className="space-y-3">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
                    : (data?.Data ?? []).map((article) => (
                        <NewsCard key={article.ID} article={article} />
                    ))}
            </div>
        </div>
    );
}