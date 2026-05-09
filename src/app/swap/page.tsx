"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowDownUp,
    Settings,
    ChevronDown,
    Wallet,
    Info,
    TrendingUp,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data untuk Token (Nanti diganti dengan data real) ---
const TOKENS = [
    { symbol: "ETH", name: "Ethereum", balance: "0.45", price: 3200, img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" },
    { symbol: "USDT", name: "Tether USD", balance: "1,250.00", price: 1, img: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" },
    { symbol: "BTC", name: "Bitcoin", balance: "0.012", price: 64000, img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" },
];

export default function SwapPage() {
    const [fromToken, setFromToken] = useState(TOKENS[0]);
    const [toToken, setToToken] = useState(TOKENS[1]);
    const [fromAmount, setFromAmount] = useState("");
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    // Kalkulasi sederhana (Mock)
    const toAmount = fromAmount
        ? ((parseFloat(fromAmount) * fromToken.price) / toToken.price).toFixed(6)
        : "";

    const handleSwitchTokens = () => {
        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);
        setFromAmount(toAmount); // Opsional: swap amount juga
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decorative Blobs (Subtle) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5170ff]/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

            {/* Main Card */}
            <div className="w-full max-w-md bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden relative">

                {/* Header Card */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
                    <h1 className="text-lg font-semibold text-foreground">Swap</h1>
                    <div className="relative">
                        <button
                            onClick={() => setIsSettingOpen(!isSettingOpen)}
                            className="p-2 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Settings size={20} />
                        </button>

                        {/* Settings Dropdown */}
                        {isSettingOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-popover border border-border/50 rounded-2xl shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground">Slippage Tolerance</span>
                                            <span className="text-xs text-[#5170ff]">Auto</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {["0.1%", "0.5%", "1.0%"].map((val) => (
                                                <button key={val} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-border/50 hover:border-[#5170ff] hover:text-[#5170ff] transition-all">
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-border/50">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Transaction Deadline</span>
                                            <div className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded-lg">
                                                <input type="number" defaultValue={20} className="w-10 bg-transparent text-right text-xs focus:outline-none" />
                                                <span className="text-xs text-muted-foreground">min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Swap Body */}
                <div className="p-4 space-y-2">

                    {/* FROM Input */}
                    <div className="bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-2xl p-4 group">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-muted-foreground font-medium">You pay</span>
                            <span className="text-xs text-muted-foreground">Balance: {fromToken.balance}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                placeholder="0.0"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                className="w-full bg-transparent text-3xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                            />
                            {/* Token Selector Button */}
                            <button className="flex items-center gap-2 bg-background hover:bg-secondary border border-border/50 rounded-full px-3 py-1.5 shrink-0 transition-all shadow-sm">
                                <Image src={fromToken.img} alt={fromToken.symbol} width={24} height={24} className="rounded-full" />
                                <span className="font-semibold text-sm">{fromToken.symbol}</span>
                                <ChevronDown size={16} className="text-muted-foreground" />
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            ≈ ${(parseFloat(fromAmount || "0") * fromToken.price).toLocaleString()}
                        </div>
                    </div>

                    {/* Switch Button */}
                    <div className="relative h-4 flex items-center justify-center z-10">
                        <button
                            onClick={handleSwitchTokens}
                            className="bg-background border-4 border-background rounded-xl p-2 shadow-lg hover:scale-110 hover:bg-secondary/20 transition-all duration-200 group"
                        >
                            <ArrowDownUp size={20} className="text-[#5170ff] group-hover:rotate-180 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* TO Input */}
                    <div className="bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-2xl p-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-muted-foreground font-medium">You receive</span>
                            <span className="text-xs text-muted-foreground">Balance: {toToken.balance}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                readOnly
                                placeholder="0.0"
                                value={toAmount}
                                className="w-full bg-transparent text-3xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none cursor-default"
                            />
                            {/* Token Selector Button */}
                            <button className="flex items-center gap-2 bg-background hover:bg-secondary border border-border/50 rounded-full px-3 py-1.5 shrink-0 transition-all shadow-sm">
                                <Image src={toToken.img} alt={toToken.symbol} width={24} height={24} className="rounded-full" />
                                <span className="font-semibold text-sm">{toToken.symbol}</span>
                                <ChevronDown size={16} className="text-muted-foreground" />
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            ≈ ${(parseFloat(toAmount || "0") * toToken.price).toLocaleString()}
                        </div>
                    </div>

                </div>

                {/* Price Info & Details */}
                {fromAmount && (
                    <div className="px-6 pb-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between text-xs text-muted-foreground p-3 rounded-xl bg-secondary/20 border border-border/30">
                            <div className="flex items-center gap-1.5">
                                <TrendingUp size={14} />
                                <span>Rate</span>
                            </div>
                            <span className="font-medium text-foreground">
                                1 {fromToken.symbol} ≈ {(fromToken.price / toToken.price).toFixed(4)} {toToken.symbol}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-muted-foreground">Network Fee</span>
                            <span className="text-foreground font-medium">~$2.45</span>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="p-4 pt-2">
                    <button
                        disabled={!fromAmount}
                        className={cn(
                            "w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg shadow-blue-500/20",
                            fromAmount
                                ? "bg-[#5170ff] text-white hover:bg-[#4059cc] hover:shadow-blue-500/30 active:scale-[0.98]"
                                : "bg-secondary/50 text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        {fromAmount ? "Swap Now" : "Enter Amount"}
                    </button>
                </div>

            </div>

            {/* Recent Transactions (Optional Footer) */}
            <div className="fixed bottom-8 right-8 hidden lg:block">
                <div className="bg-background/90 backdrop-blur border border-border/50 rounded-2xl p-4 shadow-xl w-72">
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                        <Clock size={16} className="text-[#5170ff]" />
                        <span>Recent Activity</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-muted-foreground">Swapped ETH for USDT</span>
                            </div>
                            <span className="text-muted-foreground">2m ago</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-muted-foreground">Bought BTC</span>
                            </div>
                            <span className="text-muted-foreground">15m ago</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}