"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TradingChartProps {
    coinId: string;
    baseSymbol: string;
    quoteSymbol: string;
}

export function TradingChart({ coinId, baseSymbol, quoteSymbol }: TradingChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [price, setPrice] = useState<number | null>(null);
    const [change, setChange] = useState<number | null>(null);
    const [high, setHigh] = useState<number | null>(null);
    const [low, setLow] = useState<number | null>(null);

    // Fetch price stats dari API kamu untuk header
    useEffect(() => {
        if (!coinId) return;
        setIsLoading(true);

        fetch(`/api/chart/${coinId}?range=1`) // 1 day for 24h stats
            .then((r) => r.json())
            .then((json) => {
                if (!json.prices?.length) {
                    setIsLoading(false);
                    return;
                }

                const prices = json.prices.map((p: { price: number }) => p.price);
                const current = prices[prices.length - 1];
                const first = prices[0];
                const max = Math.max(...prices);
                const min = Math.min(...prices);

                setPrice(current);
                setChange(((current - first) / first) * 100);
                setHigh(max);
                setLow(min);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch stats", err);
                setIsLoading(false);
            });
    }, [coinId]);

    // Init TradingView Widget
    useEffect(() => {
        if (!containerRef.current) return;

        const symbol = `BINANCE:${baseSymbol}${quoteSymbol}`;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            backgroundColor: "rgba(13, 14, 20, 1)",
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: true,
            calendar: false,
            hide_volume: false,
            support_host: "https://www.tradingview.com",
            disabled_features: [
                "header_symbol_search",
                "header_compare",
                "header_undo_redo",
                "header_screenshot",
                "header_fullscreen_button",
                "paneProperties.vertGridProperties",
                "paneProperties.horzGridProperties",
            ],
            enabled_features: [
                "use_localstorage_for_settings",
            ],
        });

        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(script);
        setIsLoading(false);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, [baseSymbol, quoteSymbol]);

    const positive = (change ?? 0) >= 0;

    return (
        <div className="flex flex-col h-full bg-[#0d0e14] overflow-hidden">
            {/* Pair header bar - seamless dengan tema, tanpa border */}
            <div className="flex items-center gap-6 px-4 py-3 flex-wrap gap-y-2">
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
            </div>

            {/* Chart area - TradingView Widget */}
            <div className="relative flex-1 min-h-[420px]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0d0e14] z-10">
                        <div className="w-7 h-7 border-2 border-[#5170ff] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <div
                    ref={containerRef}
                    className="tradingview-widget-container w-full h-full"
                    style={{ minHeight: "420px" }}
                >
                    <div className="tradingview-widget-container__widget w-full h-full" />
                </div>
            </div>
        </div>
    );
}