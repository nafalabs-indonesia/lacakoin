"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAccount, useConnect } from "wagmi"; // Import hook wagmi
import { Wallet } from "lucide-react";

type TabType = "open" | "history" | "trade" | "funds";

export function OpenOrders() {
    const [activeTab, setActiveTab] = useState<TabType>("open");

    // Hook untuk mengecek status koneksi wallet
    const { isConnected, address } = useAccount();

    // Hook untuk memicu modal connect wallet (opsional, jika Anda menggunakan connector bawaan wagmi/rainbowkit)
    const { connect, connectors } = useConnect();

    const tabs = [
        { id: "open", label: "Open Orders" },
        { id: "history", label: "Orders History" },
        { id: "trade", label: "Trade History" },
        { id: "funds", label: "Funds" },
    ] as const;

    // Fungsi untuk menangani klik "Connect Wallet"
    const handleConnect = () => {
        if (connectors.length > 0) {
            connect({ connector: connectors[0] }); // Menghubungkan dengan connector pertama (misal MetaMask)
        } else {
            alert("Please install a Web3 wallet like MetaMask.");
        }
    };

    // Tampilan jika Wallet BELUM Terhubung
    if (!isConnected) {
        return (
            <div className="flex flex-col h-full bg-[#0b0c12] text-gray-400 relative">
                {/* Header Tabs */}
                <div className="flex items-center gap-4 px-3 py-2 border-b border-white/5 bg-[#0f111a]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-white",
                                activeTab === tab.id ? "text-white" : "text-gray-500"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Empty State / Connect Wallet Prompt */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#5170ff]/10 flex items-center justify-center mb-2">
                        <Wallet size={24} className="text-[#5170ff]" />
                    </div>

                    <p className="text-base text-gray-300">
                        Please <span
                            onClick={handleConnect}
                            className="text-[#5170ff] font-semibold cursor-pointer hover:underline hover:text-[#405bd9] transition-colors"
                        >
                            Connect Wallet
                        </span> to view orders
                    </p>

                    <button
                        onClick={handleConnect}
                        className="px-4 py-2 bg-[#5170ff] hover:bg-[#405bd9] text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-[#5170ff]/20"
                    >
                        Connect Now
                    </button>
                </div>

                {/* Corner resize icon simulation */}
                <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-gray-700 opacity-50 pointer-events-none" />
            </div>
        );
    }

    // Tampilan jika Wallet SUDAH Terhubung (Placeholder untuk tabel order)
    return (
        <div className="flex flex-col h-full bg-[#0b0c12] text-gray-400 relative">
            <div className="flex items-center gap-4 px-3 py-2 border-b border-white/5 bg-[#0f111a]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-white",
                            activeTab === tab.id ? "text-white" : "text-gray-500"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm text-gray-500 mb-2">No open orders for</p>
                <p className="text-xs font-mono text-[#5170ff] bg-[#5170ff]/10 px-2 py-1 rounded border border-[#5170ff]/20">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
            </div>

            {/* Corner resize icon simulation */}
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-gray-700 opacity-50 pointer-events-none" />
        </div>
    );
}