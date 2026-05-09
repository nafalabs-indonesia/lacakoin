import { HeroSection } from "@/components/home/hero-section";
import { MarketStats } from "@/components/market/market-stats";
import { MarketOverview } from "@/components/home/market-overview";
import { FeaturedCoins } from "@/components/home/featured-coins";
import { HomeNews } from "@/components/home/home-news";
import { CoinTable } from "@/components/market/coin-table";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <HeroSection />

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Global Stats */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Ringkasan Pasar</h2>
          <MarketStats />
        </section>

        {/* Market Overview — Popular / Gainers / Volume */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Pasar</h2>
          <MarketOverview />
        </section>

        {/* Featured Coins — Trending / Gainers / Losers */}
        <section className="space-y-4">
          <FeaturedCoins />
        </section>

        {/* Full Market Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Semua Koin</h2>
          </div>
          <CoinTable />
        </section>

        {/* News preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Berita Terbaru</h2>
            <Link
              href="/news"
              className="text-xs text-[var(--color-brand-500)] hover:opacity-80 transition-opacity"
            >
              Lihat semua →
            </Link>
          </div>
          <HomeNews />
        </section>

      </div>
    </div>
  );
}