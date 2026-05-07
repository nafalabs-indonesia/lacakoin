import { NewsArticle } from "@/types/coin";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    article: NewsArticle;
}

function SentimentBadge({
    sentiment,
}: {
    sentiment: NewsArticle["SENTIMENT"];
}) {
    return (
        <span
            className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                sentiment === "POSITIVE" &&
                "bg-[var(--color-up)]/10 text-[var(--color-up)]",
                sentiment === "NEGATIVE" &&
                "bg-[var(--color-down)]/10 text-[var(--color-down)]",
                sentiment === "NEUTRAL" &&
                "bg-secondary text-muted-foreground"
            )}
        >
            {sentiment === "POSITIVE"
                ? "Positif"
                : sentiment === "NEGATIVE"
                    ? "Negatif"
                    : "Netral"}
        </span>
    );
}

function formatTimeAgo(timestamp: number): string {
    const diff = Math.floor(Date.now() / 1000) - timestamp;

    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;

    return `${Math.floor(diff / 86400)} hari lalu`;
}

export function NewsCard({ article }: NewsCardProps) {
    const hasImage =
        article.IMAGE_URL &&
        !article.IMAGE_URL.includes("default.png");

    return (
        <a
            href={article.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/20 transition-colors group"
        >
            {/* Thumbnail */}
            {hasImage && (
                <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-secondary">
                    <img
                        src={article.IMAGE_URL}
                        alt={article.TITLE}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
                {/* Title */}
                <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[var(--color-brand-500)] transition-colors">
                    {article.TITLE}
                </p>

                {/* Body preview */}
                {article.BODY && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.BODY}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                        {article.SOURCE_DATA.NAME}
                    </span>

                    <span className="text-xs text-muted-foreground">·</span>

                    <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(article.PUBLISHED_ON)}
                    </span>

                    <SentimentBadge sentiment={article.SENTIMENT} />

                    <ExternalLink
                        size={12}
                        className="text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </div>
            </div>
        </a>
    );
}