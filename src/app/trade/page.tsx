import Link from "next/link";
import { POPULAR_TOKENS, USDT } from "@/lib/dex/tokens";

export default function SpotPage() {
    return (
        <div className="min-h-screen bg-[#080910] text-white">
            <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Spot Trading</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Trade token via Uniswap V3 · Pair USDT
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {POPULAR_TOKENS.map((token) => (
                        <Link
                            key={token.address}
                            href={`/trade/spot/${token.symbol}-USDT`}
                            className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-[#5170ff]/30 transition-all group"
                        >
                            <div className="flex -space-x-2">
                                <img
                                    src={token.logoURI}
                                    alt={token.symbol}
                                    className="w-9 h-9 rounded-full ring-2 ring-[#080910]"
                                />
                                <img
                                    src={USDT.logoURI}
                                    alt="USDT"
                                    className="w-9 h-9 rounded-full ring-2 ring-[#080910]"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-sm group-hover:text-[#5170ff] transition-colors">
                                    {token.symbol}/USDT
                                </p>
                                <p className="text-xs text-gray-600">{token.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}