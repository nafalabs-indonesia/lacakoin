"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OrderBookProps {
    basePrice: number;
    baseSymbol: string;
    quoteSymbol: string;
}

interface OrderEntry {
    price: number;
    size: number;
    total: number;
}

function generateOrders(
    midPrice: number,
    side: "ask" | "bid",
    count = 12
): OrderEntry[] {
    const orders: OrderEntry[] = [];
    let cumTotal = 0;

    for (let i = 0; i < count; i++) {
        const spread = midPrice * 0.0003;
        const offset = side === "ask" ? spread * (i + 1) : -spread * (i + 1);
        const price = midPrice + offset;
        const size = Math.random() * 2 + 0.01;
        cumTotal += size * price;

        orders.push({
            price,
            size,
            total: cumTotal,
        });
    }

    return side === "ask" ? orders.reverse() : orders;
}

export function OrderBook({
    basePrice,
    baseSymbol,
    quoteSymbol,
}: OrderBookProps) {
    const [asks, setAsks] = useState<OrderEntry[]>([]);
    const [bids, setBids] = useState<OrderEntry[]>([]);
    const [view, setView] = useState<"both" | "asks" | "bids">("both");

    const [hoveredOrder, setHoveredOrder] = useState<OrderEntry | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!basePrice) return;

        function refresh() {
            setAsks(generateOrders(basePrice, "ask", 12));
            setBids(generateOrders(basePrice, "bid", 12));
        }

        refresh();

        const interval = setInterval(refresh, 2000);

        return () => clearInterval(interval);
    }, [basePrice]);

    const maxTotal = Math.max(
        ...[...asks, ...bids].map((o) => o.total),
        1
    );

    const totalBidVol = bids.reduce((acc, curr) => acc + curr.size, 0);
    const totalAskVol = asks.reduce((acc, curr) => acc + curr.size, 0);
    const totalVol = totalBidVol + totalAskVol;

    const bidPercent =
        totalVol > 0
            ? Math.round((totalBidVol / totalVol) * 100)
            : 50;

    const askPercent =
        totalVol > 0
            ? Math.round((totalAskVol / totalVol) * 100)
            : 50;

    const fmtPrice = (p: number) =>
        p.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const fmtSize = (s: number) => s.toFixed(4);

    const fmtTotal = (t: number) =>
        t.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

    const handleMouseEnter = (
        e: React.MouseEvent,
        order: OrderEntry
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setHoveredOrder(order);

        setTooltipPos({
            x: rect.left,
            y: rect.top + rect.height / 2,
        });
    };

    const handleMouseLeave = () => {
        setHoveredOrder(null);
    };

    return (
        <div className="relative flex flex-col h-full bg-[#0d0e14] border border-white/25 overflow-hidden font-sans">

            {/* Tooltip */}
            {hoveredOrder && (
                <div
                    className="fixed z-50 pointer-events-none bg-[#0d0e14] border border-white/10 shadow-2xl p-2 min-w-[140px]"
                    style={{
                        left: tooltipPos.x - 150,
                        top: tooltipPos.y - 20,
                    }}
                >
                    <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-gray-500">
                            <span>Cumulative Total</span>
                        </div>

                        <div className="text-gray-200 font-mono text-xs truncate">
                            {fmtTotal(hoveredOrder.total)}
                            <span className="text-gray-600 ml-1">
                                {quoteSymbol}
                            </span>
                        </div>

                        <div className="h-px bg-white/5 my-1" />

                        <div className="flex justify-between text-gray-500">
                            <span>Price</span>

                            <span
                                className={cn(
                                    hoveredOrder.price >= basePrice
                                        ? "text-green-500"
                                        : "text-red-500"
                                )}
                            >
                                {fmtPrice(hoveredOrder.price)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
                <span className="text-xs font-semibold text-gray-300">
                    Order Book
                </span>

                <div className="flex items-center gap-1">

                    {/* BOTH */}
                    <button
                        onClick={() => setView("both")}
                        className={cn(
                            "w-6 h-6 flex items-center justify-center rounded transition-all",
                            view === "both"
                                ? "bg-[#5170ff]/20"
                                : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <Image
                            src="/orderbook-askbid.svg"
                            alt="Both"
                            width={14}
                            height={14}
                            className="object-contain"
                        />
                    </button>

                    {/* BIDS */}
                    <button
                        onClick={() => setView("bids")}
                        className={cn(
                            "w-6 h-6 flex items-center justify-center rounded transition-all",
                            view === "bids"
                                ? "bg-[#5170ff]/20"
                                : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <Image
                            src="/orderbook-bid.svg"
                            alt="Bids"
                            width={14}
                            height={14}
                            className="object-contain"
                        />
                    </button>

                    {/* ASKS */}
                    <button
                        onClick={() => setView("asks")}
                        className={cn(
                            "w-6 h-6 flex items-center justify-center rounded transition-all",
                            view === "asks"
                                ? "bg-[#5170ff]/20"
                                : "hover:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                    >
                        <Image
                            src="/orderbook-ask.svg"
                            alt="Asks"
                            width={14}
                            height={14}
                            className="object-contain"
                        />
                    </button>
                </div>
            </div>

            {/* Headers */}
            <div className="px-3 pt-2 pb-1 border-b border-white/5">
                <div className="grid grid-cols-3 text-[10px] text-gray-600 mb-2">
                    <span>Price ({quoteSymbol})</span>

                    <span className="text-right">
                        Size ({baseSymbol})
                    </span>

                    <span className="text-right">
                        Total ({quoteSymbol})
                    </span>
                </div>

                {/* Dominance */}
                <div className="flex items-center gap-2 text-[10px]">
                    <span
                        className={cn(
                            "w-8 text-right font-medium",
                            bidPercent > 50
                                ? "text-green-400"
                                : "text-gray-500"
                        )}
                    >
                        {bidPercent}%
                    </span>

                    <div className="flex-1 h-1.5 bg-white/5 flex overflow-hidden">
                        <div
                            className="h-full bg-green-500/80 transition-all duration-500"
                            style={{ width: `${bidPercent}%` }}
                        />

                        <div
                            className="h-full bg-red-500/80 transition-all duration-500"
                            style={{ width: `${askPercent}%` }}
                        />
                    </div>

                    <span
                        className={cn(
                            "w-8 font-medium",
                            askPercent > 50
                                ? "text-red-400"
                                : "text-gray-500"
                        )}
                    >
                        {askPercent}%
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">

                {/* ASKS */}
                {(view === "both" || view === "asks") && (
                    <div className="flex-1 overflow-y-auto flex flex-col justify-end">
                        {asks.map((order, i) => (
                            <div
                                key={i}
                                onMouseEnter={(e) =>
                                    handleMouseEnter(e, order)
                                }
                                onMouseLeave={handleMouseLeave}
                                className="relative grid grid-cols-3 px-3 py-[3px] text-xs hover:bg-white/5 transition-colors cursor-crosshair group"
                            >
                                <div
                                    className="absolute right-0 top-0 h-full bg-red-500/8 pointer-events-none"
                                    style={{
                                        width: `${(order.total / maxTotal) * 100}%`,
                                    }}
                                />

                                <span className="text-red-400 tabular-nums z-10">
                                    {fmtPrice(order.price)}
                                </span>

                                <span className="text-right text-gray-400 tabular-nums z-10">
                                    {fmtSize(order.size)}
                                </span>

                                <span className="text-right text-gray-500 tabular-nums z-10">
                                    {fmtTotal(order.total)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* MID */}
                {view === "both" && (
                    <div className="flex items-center justify-between px-3 py-2 border-y border-white/5 bg-white/2">
                        <span
                            className={cn(
                                "text-sm font-bold tabular-nums",
                                (bids[0]?.price ?? 0) >
                                    (asks[asks.length - 1]?.price ?? 0)
                                    ? "text-green-400"
                                    : "text-red-400"
                            )}
                        >
                            {basePrice.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>

                        <span className="text-[10px] text-gray-600">
                            Spread:{" "}
                            {asks.length && bids.length
                                ? (
                                    asks[asks.length - 1].price -
                                    bids[0].price
                                ).toFixed(2)
                                : "—"}
                        </span>
                    </div>
                )}

                {/* BIDS */}
                {(view === "both" || view === "bids") && (
                    <div className="flex-1 overflow-y-auto">
                        {bids.map((order, i) => (
                            <div
                                key={i}
                                onMouseEnter={(e) =>
                                    handleMouseEnter(e, order)
                                }
                                onMouseLeave={handleMouseLeave}
                                className="relative grid grid-cols-3 px-3 py-[3px] text-xs hover:bg-white/5 transition-colors cursor-crosshair group"
                            >
                                <div
                                    className="absolute right-0 top-0 h-full bg-green-500/8 pointer-events-none"
                                    style={{
                                        width: `${(order.total / maxTotal) * 100}%`,
                                    }}
                                />

                                <span className="text-green-400 tabular-nums z-10">
                                    {fmtPrice(order.price)}
                                </span>

                                <span className="text-right text-gray-400 tabular-nums z-10">
                                    {fmtSize(order.size)}
                                </span>

                                <span className="text-right text-gray-500 tabular-nums z-10">
                                    {fmtTotal(order.total)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}