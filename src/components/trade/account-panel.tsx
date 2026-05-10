"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowLeftRight, X, Copy, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

interface Asset {
    symbol: string;
    balance: bigint | number;
    decimals: number;
    logoURI?: string;
}

export function AccountPanel({ onClose }: { onClose?: () => void }) {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transfer">("deposit");

    const assets: Asset[] = [
        { symbol: "USDT", balance: 0, decimals: 6 },
        { symbol: "ETH", balance: 0, decimals: 18 },
        { symbol: "WBTC", balance: 0, decimals: 8 },
    ];

    const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    if (!isConnected) {
        return (
            <div className="flex flex-col h-full w-full bg-[#0d0e14] text-gray-400 items-center justify-center gap-3">
                <Wallet size={20} className="text-[#5170ff]" />
                <p className="text-xs text-gray-500">Connect wallet to view account</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#0d0e14] text-gray-300">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                <span className="text-xs font-medium text-white">Account</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Address */}
            <div className="px-3 py-2 border-b border-white/5">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-600">Address</span>
                    <a
                        href={`https://etherscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#5170ff] transition-colors"
                    >
                        <ExternalLink size={10} />
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-300">
                        {shortenAddress(address!)}
                    </span>
                    <button
                        onClick={() => navigator.clipboard.writeText(address!)}
                        className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        <Copy size={12} />
                    </button>
                </div>
            </div>

            {/* Action Tabs */}
            <div className="flex gap-1 p-2 border-b border-white/5">
                {[
                    { id: "deposit", icon: ArrowUpRight, label: "Deposit" },
                    { id: "withdraw", icon: ArrowUpRight, label: "Withdraw" },
                    { id: "transfer", icon: ArrowLeftRight, label: "Transfer" },
                ].map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id as typeof activeTab)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-medium transition-colors",
                            activeTab === id
                                ? "bg-[#5170ff]/15 text-[#5170ff]"
                                : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
                        )}
                    >
                        <Icon size={10} className={id === "withdraw" ? "rotate-180" : ""} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Assets */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
                <span className="text-[10px] text-gray-600 uppercase mb-2 block">Assets</span>
                <div className="space-y-0.5">
                    {assets.map((asset) => (
                        <div
                            key={asset.symbol}
                            className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/[0.03] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">
                                    {asset.symbol[0]}
                                </div>
                                <span className="text-xs text-gray-300">{asset.symbol}</span>
                            </div>
                            <span className="text-xs font-mono text-gray-400">
                                {typeof asset.balance === 'bigint'
                                    ? parseFloat(formatUnits(asset.balance, asset.decimals)).toFixed(4)
                                    : asset.balance.toFixed(4)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}