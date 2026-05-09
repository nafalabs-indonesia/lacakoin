"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Star, Share2, MoreHorizontal, TrendingUp, BarChart2, Settings, Clock, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data Helper ---
const getCoinData = (symbol: string) => {
    // Di real app, fetch data ini dari API berdasarkan symbol
    return {
        name: symbol.includes("BTC") ? "Bitcoin" : symbol.includes("ETH") ? "Ethereum" : "Altcoin",
        symbol: symbol.replace("USDT", ""),
        price: symbol.includes("BTC") ? 80397.50 : 4200.00,
        change24h: 0.75,
        high24h: 81200.00,
        low24h: 79500.00,
        vol24h: "58.2B",
    };
};

const generateOrderBook = (type: 'ask' | 'bid', basePrice: number) => {
    return Array.from({ length: 16 }).map((_, i) => {
        const offset = type === 'ask' ? (i * 0.5) : -(i * 0.5);
        const price = basePrice + offset;
        const amount = Math.random() * 1.5;
        const total = price * amount;
        const width = Math.random() * 100;

        return {
            price: price.toFixed(2),
            amount: amount.toFixed(4),
            total: total.toFixed(2),
            width: `${width}%`
        };
    });
};

export default function TradingInterface({ symbol }: { symbol: string }) {
    // Jika component ini dipanggil langsung tanpa dynamic route, handle error atau default
    // Tapi karena kita pakai redirect di parent, symbol seharusnya selalu ada.
    // Jika pakai dynamic route [symbol], gunakan useParams():
    // const params = useParams();
    // const currentSymbol = params.symbol as string || "BTCUSDT";

    const currentSymbol = symbol || "BTCUSDT";
    const coinData = getCoinData(currentSymbol);

    const [timeframe, setTimeframe] = useState("1H");
    const [tradeTab, setTradeTab] = useState<"buy" | "sell">("buy");
    const [orderType, setOrderType] = useState<"limit" | "market">("limit");

    const asks = generateOrderBook('ask', coinData.price).reverse();
    const bids = generateOrderBook('bid', coinData.price);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden">

            {/* --- 1. TOP HEADER INFO BAR --- */}
            <header className="h-14 border-b border-border/50 bg-card flex items-center px-4 gap-6 shrink-0 overflow-x-auto no-scrollbar">
                {/* Coin Identity */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                        {/* Placeholder Icon jika image gagal load */}
                        {coinData.symbol[0]}
                    </div>
                    <div>
                        <h1 className="font-bold text-sm flex items-center gap-1">
                            {coinData.symbol}/USDT
                            <span className="text-[10px] bg-secondary px-1 rounded text-muted-foreground">Perp</span>
                        </h1>
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                            <TrendingUp size={10} /> +{coinData.change24h}%
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="hidden md:flex items-center gap-6 text-xs">
                    <StatBox label="Last Price" value={coinData.price} color="text-emerald-500" />
                    <StatBox label="Mark" value={coinData.price - 10} />
                    <StatBox label="Index" value={coinData.price - 50} />
                    <StatBox label="24h Vol" value={coinData.vol24h} />
                    <StatBox label="Funding" value="0.0100%" suffix="/04:12:00" />
                </div>

                {/* Actions Right */}
                <div className="ml-auto flex items-center gap-2 shrink-0">
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground"><Star size={16} /></button>
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground"><Share2 size={16} /></button>
                </div>
            </header>

            {/* --- 2. MAIN TRADING GRID --- */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

                {/* LEFT: CHART & ORDERS (Col 8) */}
                <section className="lg:col-span-8 flex flex-col border-r border-border/50 min-w-0">

                    {/* Chart Toolbar */}
                    <div className="h-10 border-b border-border/50 flex items-center px-2 gap-1 bg-card">
                        {["15m", "1H", "4H", "1D", "1W"].map(tf => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={cn("px-2 py-1 text-xs font-medium rounded hover:bg-secondary", timeframe === tf ? "text-[#5170ff]" : "text-muted-foreground")}
                            >
                                {tf}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pr-2">
                            <span>O <b className="text-foreground">80155</b></span>
                            <span>H <b className="text-foreground">80630</b></span>
                            <span>L <b className="text-foreground">80085</b></span>
                            <span>C <b className="text-foreground">80397</b></span>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 relative bg-card group">
                        {/* Placeholder Chart Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <BarChart2 size={120} />
                        </div>
                        {/* Grid Lines Simulation */}
                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="border-r border-b border-border/20" />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Tabs (Open Orders) */}
                    <div className="h-48 border-t border-border/50 bg-card flex flex-col">
                        <div className="flex items-center gap-4 px-4 border-b border-border/50 h-9">
                            <button className="text-xs font-bold text-[#5170ff] border-b-2 border-[#5170ff] h-full">Open Orders (0)</button>
                            <button className="text-xs font-medium text-muted-foreground hover:text-foreground h-full">History</button>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                            No Open Orders
                        </div>
                    </div>
                </section>

                {/* MIDDLE: ORDER BOOK (Col 2) */}
                <section className="lg:col-span-2 flex flex-col border-r border-border/50 min-w-[200px] bg-card">
                    <div className="h-10 border-b border-border/50 flex items-center justify-between px-3">
                        <span className="text-xs font-bold">Order Book</span>
                        <Settings size={14} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                    </div>

                    {/* Header */}
                    <div className="grid grid-cols-3 px-3 py-1 text-[10px] text-muted-foreground">
                        <span>Price</span><span className="text-right">Amount</span><span className="text-right">Total</span>
                    </div>

                    {/* Asks (Red) */}
                    <div className="flex-1 overflow-hidden flex flex-col-reverse">
                        {asks.map((item, i) => <OrderRow key={i} item={item} type="ask" />)}
                    </div>

                    {/* Current Price Middle */}
                    <div className="py-2 px-3 border-y border-border/50 bg-secondary/20 flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-500">{coinData.price}</span>
                        <TrendingUp size={14} className="text-emerald-500" />
                    </div>

                    {/* Bids (Green) */}
                    <div className="flex-1 overflow-hidden">
                        {bids.map((item, i) => <OrderRow key={i} item={item} type="bid" />)}
                    </div>
                </section>

                {/* RIGHT: TRADE PANEL (Col 2) */}
                <section className="lg:col-span-2 flex flex-col bg-card min-w-[240px]">

                    {/* Buy/Sell Toggle */}
                    <div className="p-1 grid grid-cols-2 gap-1 border-b border-border/50">
                        <button
                            onClick={() => setTradeTab("buy")}
                            className={cn("py-1.5 text-xs font-bold rounded transition-colors", tradeTab === "buy" ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}
                        >Buy Long</button>
                        <button
                            onClick={() => setTradeTab("sell")}
                            className={cn("py-1.5 text-xs font-bold rounded transition-colors", tradeTab === "sell" ? "bg-rose-500 text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}
                        >Sell Short</button>
                    </div>

                    {/* Form */}
                    <div className="p-3 space-y-3 flex-1 overflow-y-auto">

                        {/* Limit/Market */}
                        <div className="flex gap-3 text-xs font-medium mb-2">
                            <button onClick={() => setOrderType("limit")} className={cn(orderType === "limit" ? "text-[#5170ff]" : "text-muted-foreground")}>Limit</button>
                            <button onClick={() => setOrderType("market")} className={cn(orderType === "market" ? "text-[#5170ff]" : "text-muted-foreground")}>Market</button>
                        </div>

                        {/* Inputs */}
                        <InputField label="Price" suffix="USDT" placeholder={coinData.price.toString()} readOnly={orderType === 'market'} />
                        <InputField label="Size" suffix={coinData.symbol} placeholder="0.00" />

                        {/* Slider */}
                        <div className="py-1">
                            <div className="h-1 bg-secondary rounded-full w-full relative">
                                <div className="absolute left-0 top-0 h-full w-1/4 bg-[#5170ff] rounded-full" />
                            </div>
                            <div className="flex justify-between mt-1">
                                {[0, 25, 50, 75, 100].map(p => <span key={p} className="text-[9px] text-muted-foreground">{p}%</span>)}
                            </div>
                        </div>

                        <InputField label="Cost" suffix="USDT" placeholder="0.00" readOnly />

                        {/* Button */}
                        <button className={cn(
                            "w-full py-2.5 rounded-lg font-bold text-sm text-white mt-2 shadow-lg active:scale-95 transition-transform",
                            tradeTab === "buy" ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
                        )}>
                            {tradeTab === "buy" ? "Buy/Long" : "Sell/Short"}
                        </button>

                        {/* Assets Info */}
                        <div className="pt-2 border-t border-border/50 space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Assets</span>
                                <span className="text-foreground">1,204.50 USDT</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Margin Ratio</span>
                                <span className="text-foreground">0.00%</span>
                            </div>
                        </div>

                    </div>
                </section>

            </main>
        </div>
    );
}

// --- Sub Components ---

function StatBox({ label, value, suffix, color = "text-foreground" }: any) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">{label}</span>
            <span className={`text-xs font-medium tabular-nums ${color}`}>{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</span>
        </div>
    );
}

function OrderRow({ item, type }: any) {
    return (
        <div className="relative grid grid-cols-3 px-3 py-0.5 text-[11px] hover:bg-secondary/50 cursor-pointer">
            <div className={cn("absolute top-0 bottom-0 right-0 opacity-10", type === 'ask' ? "bg-rose-500" : "bg-emerald-500")} style={{ width: item.width }} />
            <span className={cn("relative z-10", type === 'ask' ? "text-rose-500" : "text-emerald-500")}>{item.price}</span>
            <span className="relative z-10 text-right text-muted-foreground">{item.amount}</span>
            <span className="relative z-10 text-right text-muted-foreground">{item.total}</span>
        </div>
    );
}

function InputField({ label, suffix, placeholder, readOnly }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-[10px] text-muted-foreground">{label}</label>
            </div>
            <div className="flex items-center bg-secondary/30 border border-border/50 rounded px-2 focus-within:border-[#5170ff] transition-colors">
                <input type="text" readOnly={readOnly} placeholder={placeholder} className="w-full bg-transparent py-1.5 text-right text-xs focus:outline-none placeholder:text-muted-foreground/50" />
                <span className="text-[10px] text-muted-foreground ml-1">{suffix}</span>
            </div>
        </div>
    );
}