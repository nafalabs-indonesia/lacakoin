"use client";

import { use, useState, useEffect } from "react";
import { TradingChart } from "@/components/trade/trading-chart";
import { OrderBook } from "@/components/trade/order-book";
import { OrderForm } from "@/components/trade/order-form";
import { OpenOrders } from "@/components/trade/open-orders";
import { AccountPanel } from "@/components/trade/account-panel";
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

                    <div className="w-px h-5 bg-white/10" />

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

            {/* Main Layout */}
            <div className="mx-auto max-w-[1800px] p-1">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_300px_300px] gap-1 min-h-[calc(100vh-4rem)]">

                    {/* Left Column - Chart + OrderBook + OpenOrders */}
                    <div className="flex flex-col gap-1 min-h-0 lg:col-span-1 xl:col-span-2">

                        {/* Top row: Chart + OrderBook side by side */}
                        <div className="flex flex-col xl:flex-row gap-1 flex-1 min-h-0">

                            {/* Chart */}
                            <div className="flex-1 min-h-[400px]">
                                <TradingChart
                                    coinId={coinId}
                                    baseSymbol={baseToken.symbol}
                                    quoteSymbol={quoteToken.symbol}
                                />
                            </div>

                            {/* OrderBook - now visible on mobile */}
                            <div className="w-full xl:w-[300px]">
                                <OrderBook
                                    basePrice={price}
                                    baseSymbol={baseToken.symbol}
                                    quoteSymbol={quoteToken.symbol}
                                />
                            </div>

                        </div>

                        {/* Bottom: OpenOrders */}
                        <div className="h-[450px]">
                            <OpenOrders />
                        </div>
                    </div>

                    {/* Right Column - OrderForm + AccountPanel */}
                    <div className="flex flex-col gap-1 min-h-0">

                        {/* OrderForm */}
                        <div className="flex-1 min-h-[400px]">
                            <OrderForm
                                tokenA={baseToken}
                                tokenB={quoteToken}
                                currentPrice={price}
                            />
                        </div>

                        {/* AccountPanel */}
                        <div className="h-[450px]">
                            <AccountPanel />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}