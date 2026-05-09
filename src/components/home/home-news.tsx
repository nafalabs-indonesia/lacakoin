"use client";

import { useNews } from "@/lib/hooks/use-news";
import { NewsCard } from "@/components/news/news-card";

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

export function HomeNews() {
    const { data, isLoading } = useNews("", 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <NewsCardSkeleton key={i} />)
                : (data?.Data ?? []).slice(0, 4).map((article) => (
                    <NewsCard key={article.ID} article={article} />
                ))}
        </div>
    );
}