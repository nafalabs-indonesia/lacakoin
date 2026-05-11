"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAccount, useConnect } from "wagmi";
import { Wallet } from "lucide-react";

type TabType = "open" | "history" | "trade" | "funds";

export function OpenOrders() {
    const [activeTab, setActiveTab] = useState<TabType>("open");
    const { isConnected, address } = useAccount();
    const { connect, connectors } = useConnect();

    const tabs = [
        { id: "open", label: "Open Orders" },
        { id: "history", label: "Orders History" },
        { id: "trade", label: "Trade History" },
        { id: "funds", label: "Funds" },
    ] as const;

    const handleConnect = () => {
        if (connectors.length > 0) {
            connect({ connector: connectors[0] });
        } else {
            alert("Please install a Web3 wallet like MetaMask.");
        }
    };

    // Not connected state
    if (!isConnected) {
        return (
            <div className="flex flex-col h-full bg-[#0d0e14] text-gray-400">
                {/* Header Tabs */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-2 py-1 rounded text-xs font-medium transition-colors",
                                activeTab === tab.id
                                    ? "text-white"
                                    : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Connect Wallet Prompt */}
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Wallet size={20} className="text-[#5170ff]" />
                    <p className="text-sm text-gray-500">
                        Connect wallet to view orders
                    </p>
                </div>
            </div>
        );
    }

    // Connected state
    return (
        <div className="flex flex-col h-full bg-[#0d0e14] text-gray-400">
            {/* Header Tabs */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-2 py-1 rounded text-xs font-medium transition-colors",
                            activeTab === tab.id
                                ? "text-white"
                                : "text-gray-600 hover:text-gray-400"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <p className="text-xs text-gray-600">No open orders</p>
                <p className="text-[10px] font-mono text-gray-700">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
            </div>
        </div>
    );
}