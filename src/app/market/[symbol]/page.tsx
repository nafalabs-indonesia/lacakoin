"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TrendingUp, TrendingDown, Star, Share2, Settings, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface sederhana untuk tipe data
interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
}

export default function MarketSymbolPage() {
    const params = useParams();
    // Ambil parameter dari URL. Jika user akses /market/bitcoin, symbol = "bitcoin"
    const symbolId = (params.symbol as string) || "bitcoin";

    const [coin, setCoin] = useState<CoinData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCoinData() {
            setLoading(true);
            try {
                // Menggunakan CoinGecko Public API
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${symbolId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
                );

                if (!response.ok) throw new Error("Failed to fetch");

                const data = await response.json();

                setCoin({
                    id: data.id,
                    symbol: data.symbol.toUpperCase(),
                    name: data.name,
                    image: data.image.large,
                    current_price: data.market_data.current_price.usd,
                    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
                });
            } catch (error) {
                console.error("Error fetching coin:", error);
                // Fallback data jika API limit tercapai atau error
                setCoin({
                    id: symbolId,
                    symbol: symbolId.substring(0, 3).toUpperCase() + "T",
                    name: "Unknown Coin",
                    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
                    current_price: 0,
                    price_change_percentage_24h: 0,
                });
            } finally {
                setLoading(false);
            }
        }

        fetchCoinData();
    }, [symbolId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-background text-muted-foreground">
                Loading Market Data...
            </div>
        );
    }

    if (!coin) return <div>Coin not found</div>;

    const isPositive = coin.price_change_percentage_24h >= 0;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden">

            {/* --- HEADER --- */}
            <header className="h-16 border-b border-border/50 bg-card flex items-center px-4 gap-6 shrink-0">
                <div className="flex items-center gap-3">
                    <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" />
                    <div>
                        <h1 className="font-bold text-lg flex items-center gap-2">
                            {coin.symbol}/USDT
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-normal">Perp</span>
                        </h1>
                        <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs border-l border-border/50 pl-6">
                    <StatBox label="Last Price" value={`$${coin.current_price.toLocaleString()}`} color={isPositive ? "text-emerald-500" : "text-rose-500"} />
                    <StatBox label="24h Change" value={`${coin.price_change_percentage_24h.toFixed(2)}%`} />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground"><Star size={18} /></button>
                    <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground"><Share2 size={18} /></button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

                {/* CHART AREA (Left) */}
                <section className="lg:col-span-8 flex flex-col border-r border-border/50 min-w-0 relative bg-card">
                    <div className="h-10 border-b border-border/50 flex items-center px-2 gap-1">
                        {["15m", "1H", "4H", "1D"].map(tf => (
                            <button key={tf} className="px-2 py-1 text-xs font-medium rounded hover:bg-secondary text-muted-foreground">{tf}</button>
                        ))}
                    </div>
                    <div className="flex-1 flex items-center justify-center text-muted-foreground/30">
                        <div className="text-center">
                            <BarChart2 size={48} className="mx-auto mb-2" />
                            <p>Chart for {coin.symbol}</p>
                            <p className="text-xs">(Integrate TradingView Widget Here)</p>
                        </div>
                    </div>
                </section>

                {/* ORDER BOOK (Middle) */}
                <section className="lg:col-span-2 flex flex-col border-r border-border/50 bg-card hidden lg:flex">
                    <div className="h-10 border-b border-border/50 flex items-center justify-between px-3">
                        <span className="text-xs font-bold">Order Book</span>
                        <Settings size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                        Order Book Data
                    </div>
                </section>

                {/* TRADE PANEL (Right) */}
                <section className="lg:col-span-2 flex flex-col bg-card">
                    <div className="p-1 grid grid-cols-2 gap-1 border-b border-border/50">
                        <button className="py-1.5 text-xs font-bold rounded bg-emerald-500 text-white">Buy</button>
                        <button className="py-1.5 text-xs font-bold rounded bg-secondary text-muted-foreground">Sell</button>
                    </div>
                    <div className="p-3 space-y-3">
                        <InputField label="Price" suffix="USDT" placeholder={coin.current_price.toString()} />
                        <InputField label="Amount" suffix={coin.symbol} placeholder="0.00" />
                        <button className="w-full py-2.5 rounded-lg font-bold text-sm text-white bg-emerald-500 mt-4">
                            Buy {coin.symbol}
                        </button>
                    </div>
                </section>

            </main>
        </div>
    );
}

// --- Helper Components ---
function StatBox({ label, value, color = "text-foreground" }: any) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
            <span className={`text-sm font-medium tabular-nums ${color}`}>{value}</span>
        </div>
    );
}

function InputField({ label, suffix, placeholder }: any) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground">{label}</label>
            <div className="flex items-center bg-secondary/30 border border-border/50 rounded px-2">
                <input type="text" placeholder={placeholder} className="w-full bg-transparent py-1.5 text-right text-xs focus:outline-none" />
                <span className="text-[10px] text-muted-foreground ml-1">{suffix}</span>
            </div>
        </div>
    );
}