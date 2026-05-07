import { MarketStats } from "@/components/market/market-stats";
import { CoinTable } from "@/components/market/coin-table";
import { NewsList } from "@/components/news/news-list";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Pasar Kripto</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Data harga real-time dari 100 koin teratas
        </p>
      </div>

      {/* Market Stats */}
      <MarketStats />

      {/* Coin Table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Semua Koin</h2>
        <CoinTable />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Berita Terbaru</h2>
          <Link href="/news" className="text-xs text-[var(--color-brand-500)] hover:opacity-80">
            Lihat semua →
          </Link>
        </div>
        <NewsList />
      </div>
    </div>
  );
}