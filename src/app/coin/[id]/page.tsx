"use client";

import { use } from "react";
import { useCoinDetail } from "@/lib/hooks/use-coin-detail";
import { CoinHeader } from "@/components/coin/coin-header";
import { CoinStats } from "@/components/coin/coin-stats";
import { CoinDescription } from "@/components/coin/coin-description";
import { PriceChart } from "@/components/coin/price-chart";
import { AddToPortfolio } from "@/components/portfolio/add-to-portfolio";
import { CoinDetail, CoinQuote } from "@/types/coin";
import { isPositive } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-secondary rounded w-48" />
      <div className="h-24 bg-secondary rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 bg-secondary rounded-xl" />
          <div className="h-48 bg-secondary rounded-xl" />
        </div>
        <div className="h-96 bg-secondary rounded-xl" />
      </div>
    </div>
  );
}

export default function CoinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = use(params);
  const { data, isLoading, isError } = useCoinDetail(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <PageSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive text-sm text-center">
          Gagal memuat data koin. Coba refresh halaman.
        </div>
      </div>
    );
  }

  const metaEntry = Object.values(data.meta.data)[0] as CoinDetail;
  const quoteEntry = Object.values(data.quote.data)[0] as CoinQuote;
  const positive = isPositive(quoteEntry.quote.USD.percent_change_24h);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Market
      </Link>

      {/* Header: logo, nama, harga, perubahan */}
      <CoinHeader meta={metaEntry} quote={quoteEntry} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Diperbarui otomatis setiap 60 detik</span>
        </div>
        <AddToPortfolio
          coinId={quoteEntry.id}
          symbol={quoteEntry.symbol}
          name={quoteEntry.name}
          slug={quoteEntry.slug}
          currentPrice={quoteEntry.quote.USD.price}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri: chart + deskripsi */}
        <div className="lg:col-span-2 space-y-6">
          <PriceChart slug={metaEntry.slug} isPositive={positive} />
          <CoinDescription
            name={metaEntry.name}
            description={metaEntry.description}
            tags={metaEntry.tags ?? []}
          />
        </div>

        {/* Kanan: statistik */}
        <div>
          <CoinStats quote={quoteEntry} dateAdded={metaEntry.date_added} />
        </div>
      </div>
    </div>
  );
}
