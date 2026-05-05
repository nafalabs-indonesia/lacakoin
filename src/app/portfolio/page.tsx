"use client";

import { usePortfolioStore } from "@/lib/stores/portfolio";
import { useListings } from "@/lib/hooks/use-listings";
import { useCurrency } from "@/lib/hooks/use-currency";
import { formatPercent, isPositive } from "@/lib/utils";
import { PortfolioEntry, PortfolioStats, Coin } from "@/types/coin";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronUp, ChevronDown, Trash2, PieChart } from "lucide-react";

function calcStats(entries: PortfolioEntry[], prices: Record<number, number>): PortfolioStats {
  let totalValue = 0;
  let totalCost  = 0;

  for (const e of entries) {
    const currentPrice = prices[e.coinId] ?? e.buyPrice;
    totalValue += currentPrice * e.amount;
    totalCost  += e.buyPrice  * e.amount;
  }

  const totalPnl        = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return { totalValue, totalCost, totalPnl, totalPnlPercent };
}

function EmptyPortfolio() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="p-4 rounded-full bg-secondary">
        <PieChart size={32} className="text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Portfolio kosong</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tambahkan koin dari halaman detail koin.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-(--color-brand-500) hover:opacity-80 transition-opacity"
      >
        Lihat Market
      </Link>
    </div>
  );
}

export default function PortfolioPage() {
  const { entries, remove } = usePortfolioStore();
  const { data } = useListings({ limit: 100 });
  const { formatPrice, formatLarge } = useCurrency();

  // Map coinId → current price
  const prices: Record<number, number> = {};
  for (const coin of (data?.data ?? []) as Coin[]) {
    prices[coin.id] = coin.quote.USD.price;
  }

  const stats = calcStats(entries, prices);
  const pnlPositive = isPositive(stats.totalPnl);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart size={22} className="text-(--color-brand-500)" />
          Portfolio
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pantau nilai aset kripto kamu
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyPortfolio />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard
              label="Total Nilai"
              value={formatPrice(stats.totalValue)}
            />
            <SummaryCard
              label="Total Modal"
              value={formatPrice(stats.totalCost)}
            />
            <SummaryCard
              label="Profit / Loss"
              value={formatPrice(Math.abs(stats.totalPnl))}
              trend={stats.totalPnl}
              prefix={pnlPositive ? "+" : "-"}
            />
            <SummaryCard
              label="Return"
              value={formatPercent(stats.totalPnlPercent)}
              trend={stats.totalPnlPercent}
            />
          </div>

          {/* Holdings Table */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Koin</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Jumlah</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Harga Beli</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Harga Kini</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden md:table-cell">Nilai</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden md:table-cell">PnL</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const currentPrice = prices[entry.coinId] ?? entry.buyPrice;
                    const value        = currentPrice * entry.amount;
                    const cost         = entry.buyPrice * entry.amount;
                    const pnl          = value - cost;
                    const pnlPct       = cost > 0 ? (pnl / cost) * 100 : 0;
                    const positive     = isPositive(pnl);

                    return (
                      <tr
                        key={entry.coinId}
                        className="border-b border-border/20 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/coin/${entry.slug}`}
                            className="flex flex-col hover:text-(--color-brand-500) transition-colors"
                          >
                            <span className="font-medium">{entry.name}</span>
                            <span className="text-xs text-muted-foreground uppercase">
                              {entry.symbol}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {entry.amount} {entry.symbol}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {formatPrice(entry.buyPrice)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium">
                          {formatPrice(currentPrice)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                          {formatPrice(value)}
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <div className="flex flex-col items-end">
                            <span
                              className={cn(
                                "tabular-nums text-sm font-medium flex items-center gap-0.5",
                                positive ? "text-(--color-up)" : "text-(--color-down)"
                              )}
                            >
                              {positive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              {formatPercent(pnlPct)}
                            </span>
                            <span className={cn(
                              "text-xs tabular-nums",
                              positive ? "text-(--color-up)" : "text-(--color-down)"
                            )}>
                              {positive ? "+" : ""}{formatPrice(pnl)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => remove(entry.coinId)}
                            className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Hapus dari portfolio"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  prefix = "",
}: {
  label: string;
  value: string;
  trend?: number;
  prefix?: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          "text-lg font-semibold tabular-nums",
          trend !== undefined
            ? isPositive(trend)
              ? "text-(--color-up)"
              : "text-(--color-down)"
            : ""
        )}
      >
        {prefix}{value}
      </p>
    </div>
  );
}