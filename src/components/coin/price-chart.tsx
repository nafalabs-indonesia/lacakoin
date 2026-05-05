"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChart } from "@/lib/hooks/use-chart";
import { ChartRange, ChartPoint } from "@/types/coin";
import { formatUSD } from "@/lib/utils";
import { cn } from "@/lib/utils";

const RANGES: { label: string; value: ChartRange }[] = [
  { label: "24J",  value: "1"   },
  { label: "7H",   value: "7"   },
  { label: "30H",  value: "30"  },
  { label: "90H",  value: "90"  },
  { label: "1T",   value: "365" },
];

function formatXAxis(time: number, range: ChartRange): string {
  const date = new Date(time);
  if (range === "1") {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }
  if (range === "7" || range === "30") {
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
}

function CustomTooltip({
  active,
  payload,
  range,
}: {
  active?: boolean;
  payload?: { value: number; payload: ChartPoint }[];
  range: ChartRange;
}) {
  if (!active || !payload?.length) return null;
  const { time, price } = payload[0].payload;
  const date = new Date(time);

  return (
    <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1">
        {range === "1"
          ? date.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })
          : date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <p className="font-semibold tabular-nums text-foreground">{formatUSD(price)}</p>
    </div>
  );
}

interface PriceChartProps {
  slug: string;
  isPositive: boolean;
}

export function PriceChart({ slug, isPositive: positive }: PriceChartProps) {
  const [range, setRange] = useState<ChartRange>("7");
  const [isMounted, setIsMounted] = useState(false);
  const { data, isLoading, isError } = useChart(slug, range);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const strokeColor = positive ? "var(--color-up)" : "var(--color-down)";
  const gradientId  = `gradient-${slug}`;
  const tickCount   = range === "1" ? 6 : range === "7" ? 7 : 6;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 overflow-hidden">
      {/* Header + Range selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Grafik Harga</h3>
        <div className="flex items-center gap-1">
          {RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                range === value
                  ? "bg-(--color-brand-500) text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full min-w-0">
        {!isMounted || isLoading ? (
          <div className="h-full w-full rounded-lg bg-secondary animate-pulse" />
        ) : isError ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Gagal memuat grafik.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tickCount={tickCount}
                tickFormatter={(t) => formatXAxis(t, range)}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => formatUSD(v)}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={88}
              />
              <Tooltip content={<CustomTooltip range={range} />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}