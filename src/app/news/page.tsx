import { NewsList } from "@/components/news/news-list";
import { Newspaper } from "lucide-react";

export default function NewsPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Newspaper size={22} className="text-[var(--color-brand-500)]" />
                    Berita Kripto
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Berita terbaru dari berbagai sumber kripto terpercaya
                </p>
            </div>

            <NewsList />
        </div>
    );
}