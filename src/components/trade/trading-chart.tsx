"use client";
import { useEffect, useRef, useState } from "react";
import {
    createChart,
    IChartApi,
    CandlestickSeries,
    CandlestickData,
    Time
} from "lightweight-charts";
import { cn } from "@/lib/utils";

type TimeRange = "1D" | "1W" | "1M" | "3M";

const RANGE_TO_DAYS: Record<TimeRange, number> = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "3M": 90,
};

interface TradingChartProps {
    coinId: string;
    baseSymbol: string;
    quoteSymbol: string;
}

export function TradingChart({ coinId, baseSymbol, quoteSymbol }: TradingChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    // Simpan referensi series agar bisa di-update/dihapus tanpa recreate chart
    const seriesRef = useRef<any>(null);

    const [range, setRange] = useState<TimeRange>("1D");
    const [isLoading, setIsLoading] = useState(true);
    const [price, setPrice] = useState<number | null>(null);
    const [change, setChange] = useState<number | null>(null);
    const [high, setHigh] = useState<number | null>(null);
    const [low, setLow] = useState<number | null>(null);

    // 1. Init chart once
    useEffect(() => {
        if (!containerRef.current) return;

        chartRef.current = createChart(containerRef.current, {
            layout: {
                background: { color: "transparent" },
                textColor: "#6b7280",
            },
            grid: {
                vertLines: { color: "rgba(255,255,255,0.04)" },
                horzLines: { color: "rgba(255,255,255,0.04)" },
            },
            crosshair: {
                mode: 1, // Normal mode
            },
            rightPriceScale: {
                borderColor: "rgba(255,255,255,0.08)",
                textColor: "#6b7280",
            },
            timeScale: {
                borderColor: "rgba(255,255,255,0.08)",
                timeVisible: true,
                secondsVisible: false,
                fixLeftEdge: true,
            },
            width: containerRef.current.clientWidth,
            height: 420,
        });

        // Add series initially
        seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: "#22c55e",
            downColor: "#ef4444",
            borderVisible: false,
            wickUpColor: "#22c55e",
            wickDownColor: "#ef4444",
        });

        const ro = new ResizeObserver(() => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: containerRef.current.clientWidth,
                });
            }
        });
        ro.observe(containerRef.current);

        return () => {
            ro.disconnect();
            chartRef.current?.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []);

    // 2. Fetch data on range/coinId change
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || !coinId) return;

        const days = RANGE_TO_DAYS[range];
        setIsLoading(true);

        fetch(`/api/chart/${coinId}?range=${days}`)
            .then((r) => r.json())
            .then((json) => {
                if (!json.prices?.length || !chartRef.current || !seriesRef.current) return;

                const bucketMs = days <= 1 ? 3600000 : 86400000; // 1 hour or 1 day
                const bucketS = bucketMs / 1000;
                const map = new Map<number, { o: number; h: number; l: number; c: number; v: number }>();

                json.prices.forEach(({ time, price: p }: { time: number; price: number }) => {
                    // Align time to bucket
                    const key = Math.floor(time / bucketMs) * bucketS;

                    if (!map.has(key)) {
                        map.set(key, { o: p, h: p, l: p, c: p, v: 0 });
                    } else {
                        const c = map.get(key)!;
                        c.h = Math.max(c.h, p);
                        c.l = Math.min(c.l, p);
                        c.c = p;
                        // Optional: accumulate volume if available in source
                    }
                });

                // FIX TYPE ERROR HERE: Explicitly cast to CandlestickData<Time>
                const candles: CandlestickData<Time>[] = Array.from(map.entries())
                    .sort(([a], [b]) => a - b)
                    .map(([time, d]) => ({
                        time: time as Time, // Cast number (unix timestamp) to Time type
                        open: d.o,
                        high: d.h,
                        low: d.l,
                        close: d.c,
                    }));

                if (!candles.length) {
                    setIsLoading(false);
                    return;
                }

                // Update data instead of recreating chart
                seriesRef.current.setData(candles);
                chartRef.current.timeScale().fitContent();

                // Calculate stats
                const last = candles[candles.length - 1];
                const first = candles[0];

                setPrice(last.close);
                setChange(((last.close - first.open) / first.open) * 100);
                setHigh(Math.max(...candles.map((c) => c.high)));
                setLow(Math.min(...candles.map((c) => c.low)));

                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch chart data", err);
                setIsLoading(false);
            });
    }, [coinId, range]);

    const positive = (change ?? 0) >= 0;

    return (
        <div className="flex flex-col h-full bg-[#0d0e14]  border border-white/5 overflow-hidden">
            {/* Pair header bar */}
            <div className="flex items-center gap-6 px-4 py-3 border-b border-white/5 flex-wrap gap-y-2">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-white text-base">
                        {baseSymbol}
                        <span className="text-gray-500 font-normal">/{quoteSymbol}</span>
                    </span>
                    {price && (
                        <span className={cn(
                            "text-sm font-semibold tabular-nums",
                            positive ? "text-green-400" : "text-red-400"
                        )}>
                            {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </span>
                    )}
                    {change !== null && (
                        <span className={cn(
                            "text-xs font-medium tabular-nums px-1.5 py-0.5 rounded",
                            positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        )}>
                            {positive ? "+" : ""}{change.toFixed(2)}%
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    {high && (
                        <div>
                            <span className="text-gray-600">24h High </span>
                            <span className="text-gray-300 tabular-nums">
                                {high.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </span>
                        </div>
                    )}
                    {low && (
                        <div>
                            <span className="text-gray-600">24h Low </span>
                            <span className="text-gray-300 tabular-nums">
                                {low.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Range selector */}
                <div className="flex items-center gap-1 ml-auto">
                    {(["1D", "1W", "1M", "3M"] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={cn(
                                "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                                range === r
                                    ? "bg-[#5170ff] text-white"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart area */}
            <div className="relative flex-1">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0d0e14] z-10">
                        <div className="w-7 h-7 border-2 border-[#5170ff] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <div ref={containerRef} className="w-full h-full" />
            </div>
        </div>
    );
}