"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowLeftRight, X, Copy, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi"; // Pastikan wagmi sudah terinstall
import { formatEther, formatUnits } from "viem";

// Tipe data untuk aset (sesuaikan dengan struktur data wallet/token Anda)
interface Asset {
    symbol: string;
    balance: bigint | number;
    decimals: number;
    logoURI?: string;
}

export function AccountPanel({ onClose }: { onClose?: () => void }) {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transfer">("deposit");

    // Simulasi data saldo (Ganti ini dengan fetch data saldo token Anda dari contract/wallet)
    // Contoh: Menggunakan USDT (6 decimals) dan ETH (18 decimals)
    const assets: Asset[] = [
        { symbol: "USDT", balance: 0, decimals: 6 },
        { symbol: "ETH", balance: 0, decimals: 18 },
        { symbol: "WBTC", balance: 0, decimals: 8 },
    ];

    // Fungsi helper untuk memformat alamat wallet (misal: 0x123...456)
    const shortenAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col h-full w-full bg-[#121418] text-gray-300 items-center justify-center p-6 text-center border-l border-white/5">
                <Wallet size={48} className="text-[#5170ff] mb-4 opacity-80" />
                <h3 className="text-lg font-semibold text-white mb-2">Wallet Not Connected</h3>
                <p className="text-sm text-gray-500 mb-6">Please connect your wallet to view account details.</p>
                {/* Tombol Connect Wallet biasanya dihandle oleh komponen lain, tapi bisa ditambahkan di sini jika perlu */}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#121418] text-gray-300 border-l border-white/5 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#161920]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#5170ff]" />
                    <h3 className="text-sm font-semibold text-white">Account</h3>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Address Display */}
            <div className="px-4 py-3 border-b border-white/5 bg-[#121418]">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Connected Address</span>
                    <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer" className="text-[#5170ff] hover:text-[#405bd9]">
                        <ExternalLink size={12} />
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/5">
                        {shortenAddress(address!)}
                    </span>
                    <button
                        onClick={() => navigator.clipboard.writeText(address!)}
                        className="text-gray-500 hover:text-[#5170ff] transition-colors"
                        title="Copy Address"
                    >
                        <Copy size={14} />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 grid grid-cols-3 gap-2">
                <button
                    onClick={() => setActiveTab("deposit")}
                    className={cn(
                        "flex items-center justify-center gap-1.5 py-2 rounded text-xs font-medium transition-all",
                        activeTab === "deposit"
                            ? "bg-[#5170ff]/15 text-[#5170ff] border border-[#5170ff]/30"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    <ArrowUpRight size={12} />
                    Deposit
                </button>

                <button
                    onClick={() => setActiveTab("withdraw")}
                    className={cn(
                        "flex items-center justify-center gap-1.5 py-2 rounded text-xs font-medium transition-all",
                        activeTab === "withdraw"
                            ? "bg-[#5170ff]/15 text-[#5170ff] border border-[#5170ff]/30"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    <ArrowUpRight size={12} className="rotate-180" />
                    Withdraw
                </button>

                <button
                    onClick={() => setActiveTab("transfer")}
                    className={cn(
                        "flex items-center justify-center gap-1.5 py-2 rounded text-xs font-medium transition-all",
                        activeTab === "transfer"
                            ? "bg-[#5170ff]/15 text-[#5170ff] border border-[#5170ff]/30"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    <ArrowLeftRight size={12} />
                    Transfer
                </button>
            </div>

            {/* Spot Overview Section */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 sticky top-0 bg-[#121418] pt-1">
                    Spot Overview
                </h4>

                <div className="space-y-1">
                    {assets.map((asset) => (
                        <div key={asset.symbol} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 -mx-2 rounded transition-colors">
                            <div className="flex items-center gap-3">
                                {/* Placeholder Logo */}
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                                    {asset.symbol[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">{asset.symbol}</span>
                                    <span className="text-[10px] text-gray-500">Available</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-mono text-white">
                                    {/* Format balance sesuai decimals */}
                                    {typeof asset.balance === 'bigint'
                                        ? parseFloat(formatUnits(asset.balance, asset.decimals)).toFixed(asset.decimals > 4 ? 4 : 2)
                                        : asset.balance.toFixed(asset.decimals > 4 ? 4 : 2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Optional: Resize Handle Simulation */}
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-gray-700 opacity-50 pointer-events-none" />
        </div>
    );
}