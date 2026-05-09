"use client";

import { use, useState, useEffect } from "react";
import { TradingChart } from "@/components/trade/trading-chart";
import { OrderBook } from "@/components/trade/order-book";
import { OrderForm } from "@/components/trade/order-form";
import { POPULAR_TOKENS, USDT, SYMBOL_TO_COINGECKO } from "@/lib/dex/tokens";
import { Token } from "@/types/trade";
import { ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const QUICK_PAIRS = [
    "WBTC-USDT",
    "WETH-USDT",
    "LINK-USDT",
    "UNI-USDT",
    "AAVE-USDT",
];

export default function SpotTradePage({
    params,
}: {
    params: Promise<{ symbol: string }>;
}) {
    const { symbol } = use(params);
    const [baseSymbol, quoteSymbol] = symbol.toUpperCase().split("-");

    const baseToken: Token =
        POPULAR_TOKENS.find((t) => t.symbol === baseSymbol) ?? POPULAR_TOKENS[0];
    const quoteToken: Token = USDT;

    const coinId = SYMBOL_TO_COINGECKO[baseToken.symbol] ?? baseToken.symbol.toLowerCase();
    const [price, setPrice] = useState<number>(0);

    // Fetch current price for order book seed
    useEffect(() => {
        fetch(`/api/chart/${coinId}?range=1`)
            .then((r) => r.json())
            .then((d) => {
                if (d.prices?.length) {
                    setPrice(d.prices[d.prices.length - 1].price);
                }
            })
            .catch(() => { });
    }, [coinId]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top Bar */}
            <div className="border-b border-white/5 bg-[#0d0e14]">
                <div className="mx-auto max-w-[1800px] px-3 h-12 flex items-center gap-3">
                    <Link
                        href="/trade/spot"
                        className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </Link>

                    {/* Pair selector */}
                    <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex -space-x-1.5">
                            <img
                                src={baseToken.logoURI}
                                alt={baseToken.symbol}
                                className="w-5 h-5 rounded-full ring-1 ring-[#0d0e14]"
                            />
                            <img
                                src={quoteToken.logoURI}
                                alt={quoteToken.symbol}
                                className="w-5 h-5 rounded-full ring-1 ring-[#0d0e14]"
                            />
                        </div>
                        <span className="text-sm font-bold">
                            {baseToken.symbol}
                            <span className="text-gray-500 font-normal">/{quoteToken.symbol}</span>
                        </span>
                        <ChevronDown size={13} className="text-gray-500" />
                    </button>

                    {/* Divider */}
                    <div className="w-px h-5 bg-white/10" />

                    {/* Quick pairs */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {QUICK_PAIRS.map((pair) => {
                            const [base] = pair.split("-");
                            const isActive = base === baseSymbol;
                            return (
                                <Link
                                    key={pair}
                                    href={`/trade/spot/${pair}`}
                                    className={cn(
                                        "px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                                        isActive
                                            ? "bg-[#5170ff]/15 text-[#5170ff]"
                                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                    )}
                                >
                                    {base}/USDT
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main layout — 3 kolom */}
            <div className="mx-auto max-w-[1800px] py-1">
                {/* 
                   UPDATE: 
                   1. Gap dikurangi menjadi gap-2 agar lebih mepet.
                   2. Chart menggunakan 1fr (maksimal sisa ruang).
                   3. Order Book & Form diset ke 300px agar chart lebih luas tapi panel kanan tetap usable.
                */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_310px_310px] gap-1 h-[calc(100vh-8rem)]">

                    {/* Kiri — Chart */}
                    <div className="min-h-[500px] xl:min-h-0 w-full">
                        <TradingChart
                            coinId={coinId}
                            baseSymbol={baseToken.symbol}
                            quoteSymbol={quoteToken.symbol}
                        />
                    </div>

                    {/* Tengah — Order Book */}
                    <div className="hidden xl:block h-full">
                        <OrderBook
                            basePrice={price}
                            baseSymbol={baseToken.symbol}
                            quoteSymbol={quoteToken.symbol}
                        />
                    </div>

                    {/* Kanan — Order Form */}
                    <div className="h-full overflow-y-auto">
                        <OrderForm
                            tokenA={baseToken}
                            tokenB={quoteToken}
                            currentPrice={price}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}