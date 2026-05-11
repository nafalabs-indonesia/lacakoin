"use client";

import { useEffect, useMemo, useState } from "react";

import {
    useAccount,
    useBalance,
    useChainId,
    usePublicClient,
    useWalletClient,
    useReadContract,
} from "wagmi";

import {
    erc20Abi,
    formatUnits,
    parseUnits,
} from "viem";

import { Token, OrderType, OrderSide } from "@/types/trade";

import { cn } from "@/lib/utils";

import {
    Settings2,
    ArrowUpDown,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface OrderFormProps {
    tokenA: Token;
    tokenB: Token;
    currentPrice?: number;
}

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0];

const PERCENT_OPTIONS = [25, 50, 75, 100];

const NATIVE_TOKEN =
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export function OrderForm({
    tokenA,
    tokenB,
    currentPrice,
}: OrderFormProps) {
    const { isConnected, address } =
        useAccount();

    const chainId = useChainId();

    const publicClient = usePublicClient();

    const { data: walletClient } =
        useWalletClient();

    const [orderType, setOrderType] =
        useState<OrderType>("market");

    const [orderSide, setOrderSide] =
        useState<OrderSide>("buy");

    const [sellAmount, setSellAmount] =
        useState("");

    const [buyAmount, setBuyAmount] =
        useState("");

    const [limitPrice, setLimitPrice] =
        useState(
            currentPrice
                ? String(
                    currentPrice.toFixed(2)
                )
                : ""
        );

    const [slippage, setSlippage] =
        useState(0.5);

    const [showSettings, setShowSettings] =
        useState(false);

    const [isQuoting, setIsQuoting] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState<
        string | null
    >(null);

    const [quoteData, setQuoteData] =
        useState<any>(null);

    // =========================
    // TOKEN SIDE
    // =========================

    const sellToken =
        orderSide === "buy"
            ? tokenB
            : tokenA;

    const buyToken =
        orderSide === "buy"
            ? tokenA
            : tokenB;

    // =========================
    // BALANCE
    // =========================

    const isNative = useMemo(() => {
        return (
            sellToken.address.toLowerCase() ===
            NATIVE_TOKEN
        );
    }, [sellToken.address]);

    // native balance
    const {
        data: nativeBalance,
        refetch: refetchNativeBalance,
    } = useBalance({
        address,
        chainId,
        query: {
            enabled: !!address && isNative,
        },
    });

    // erc20 balance
    const {
        data: erc20Balance,
        refetch: refetchTokenBalance,
    } = useReadContract({
        address:
            sellToken.address as `0x${string}`,

        abi: erc20Abi,

        functionName: "balanceOf",

        args: address
            ? [address as `0x${string}`]
            : undefined,

        query: {
            enabled:
                !!address && !isNative,
        },
    });

    const formattedBalance = useMemo(() => {
        try {
            if (isNative) {
                if (!nativeBalance) return "0";

                return Number(
                    formatUnits(
                        nativeBalance.value,
                        nativeBalance.decimals
                    )
                ).toFixed(6);
            }

            if (!erc20Balance) return "0";

            return Number(
                formatUnits(
                    erc20Balance as bigint,
                    sellToken.decimals
                )
            ).toFixed(6);

        } catch {
            return "0";
        }

    }, [
        isNative,
        nativeBalance,
        erc20Balance,
        sellToken.decimals,
    ]);

    // =========================
    // INIT LIMIT PRICE
    // =========================

    useEffect(() => {
        if (currentPrice && !limitPrice) {
            setLimitPrice(
                currentPrice.toFixed(2)
            );
        }
    }, [currentPrice]);

    // =========================
    // QUOTE
    // =========================

    useEffect(() => {
        if (
            !sellAmount ||
            parseFloat(sellAmount) <= 0 ||
            orderType === "limit"
        ) {
            setBuyAmount("");
            setQuoteData(null);
            setError(null);
            return;
        }

        const timeout = setTimeout(
            async () => {
                setIsQuoting(true);

                setError(null);

                try {
                    const balanceNum =
                        Number(
                            formattedBalance
                        );

                    // VALIDASI SALDO
                    if (
                        parseFloat(
                            sellAmount
                        ) > balanceNum
                    ) {
                        setBuyAmount("");

                        setQuoteData(null);

                        setError(
                            `Saldo ${sellToken.symbol} tidak cukup`
                        );

                        setIsQuoting(false);

                        return;
                    }

                    const rawAmount =
                        parseUnits(
                            sellAmount,
                            sellToken.decimals
                        ).toString();

                    const params =
                        new URLSearchParams(
                            {
                                src: sellToken.address,
                                dst: buyToken.address,
                                amount:
                                    rawAmount,
                                chainId:
                                    String(
                                        chainId
                                    ),
                            }
                        );

                    if (address) {
                        params.set(
                            "taker",
                            address
                        );
                    }

                    const response =
                        await fetch(
                            `/api/dex/quote?${params.toString()}`
                        );

                    const json =
                        await response.json();

                    if (
                        !response.ok ||
                        !json.success
                    ) {
                        setBuyAmount("");

                        setQuoteData(
                            null
                        );

                        setError(
                            json?.error ||
                            "Failed to fetch quote"
                        );

                        setIsQuoting(
                            false
                        );

                        return;
                    }

                    const quote =
                        json.data;

                    setQuoteData(quote);

                    const outAmount =
                        Number(
                            quote.buyAmount
                        ) /
                        Math.pow(
                            10,
                            buyToken.decimals
                        );

                    setBuyAmount(
                        outAmount.toFixed(
                            6
                        )
                    );

                } catch (err: any) {
                    setBuyAmount("");

                    setQuoteData(null);

                    setError(
                        err?.message ||
                        "Gagal mendapatkan quote"
                    );

                } finally {
                    setIsQuoting(false);
                }
            },
            500
        );

        return () =>
            clearTimeout(timeout);

    }, [
        sellAmount,
        sellToken,
        buyToken,
        orderType,
        chainId,
        address,
        formattedBalance,
    ]);

    // =========================
    // PERCENT SHORTCUT
    // =========================

    function handlePercentClick(
        pct: number
    ) {
        const balanceNum = Number(
            formattedBalance
        );

        const value =
            (balanceNum * pct) / 100;

        setSellAmount(value.toFixed(6));
    }

    // =========================
    // APPROVE ERC20
    // =========================

    async function approveIfNeeded() {
        if (
            !walletClient ||
            !publicClient ||
            !address ||
            !quoteData
        ) {
            return;
        }

        // native token tidak perlu approve
        if (isNative) {
            return;
        }

        const allowanceTarget =
            quoteData.allowanceTarget;

        if (!allowanceTarget) {
            return;
        }

        const rawAmount = parseUnits(
            sellAmount,
            sellToken.decimals
        );

        const allowance =
            await publicClient.readContract({
                address:
                    sellToken.address as `0x${string}`,

                abi: erc20Abi,

                functionName:
                    "allowance",

                args: [
                    address as `0x${string}`,
                    allowanceTarget as `0x${string}`,
                ],
            });

        // SUDAH APPROVED
        if (allowance >= rawAmount) {
            return;
        }

        const hash =
            await walletClient.writeContract({
                address:
                    sellToken.address as `0x${string}`,

                abi: erc20Abi,

                functionName:
                    "approve",

                args: [
                    allowanceTarget as `0x${string}`,
                    rawAmount,
                ],

                account: address,

                chain:
                    walletClient.chain,
            });

        await publicClient.waitForTransactionReceipt(
            {
                hash,
            }
        );
    }

    // =========================
    // SWAP
    // =========================

    async function handleSubmit() {
        try {
            if (
                !walletClient ||
                !publicClient ||
                !quoteData ||
                !address
            ) {
                return;
            }

            setIsSubmitting(true);

            setError(null);

            const balanceNum = Number(
                formattedBalance
            );

            // VALIDASI SALDO
            if (
                parseFloat(sellAmount) >
                balanceNum
            ) {
                setError(
                    `Saldo ${sellToken.symbol} tidak cukup`
                );

                return;
            }

            // approve
            await approveIfNeeded();

            const tx =
                quoteData.transaction;

            if (!tx) {
                setError(
                    "Transaction data tidak ditemukan"
                );

                return;
            }

            // execute transaction
            const hash =
                await walletClient.sendTransaction(
                    {
                        account: address,

                        to: tx.to,

                        data: tx.data,

                        value: BigInt(
                            tx.value || "0"
                        ),

                        gas: tx.gas
                            ? BigInt(tx.gas)
                            : undefined,

                        chain:
                            walletClient.chain,
                    }
                );

            // wait confirmation
            await publicClient.waitForTransactionReceipt(
                {
                    hash,
                }
            );

            // reset
            setSellAmount("");
            setBuyAmount("");
            setQuoteData(null);

            // refresh balance
            await refetchNativeBalance();

            await refetchTokenBalance();

        } catch (err: any) {
            setError(
                err?.shortMessage ||
                err?.message ||
                "Transaksi gagal"
            );

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col bg-[#0d0e14] border border-white/5 overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 pt-3 pb-0 border-b border-white/5">
                <div className="flex gap-0">
                    {(
                        [
                            "market",
                            "limit",
                        ] as OrderType[]
                    ).map((t) => (
                        <button
                            key={t}
                            onClick={() =>
                                setOrderType(
                                    t
                                )
                            }
                            className={cn(
                                "px-4 py-2.5 text-xs font-semibold capitalize transition-colors border-b-2",
                                orderType ===
                                    t
                                    ? "border-[#5170ff] text-white"
                                    : "border-transparent text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {t === "market"
                                ? "Market"
                                : "Limit"}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() =>
                        setShowSettings(
                            !showSettings
                        )
                    }
                    className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors mb-1"
                >
                    <Settings2 size={15} />
                </button>
            </div>

            <div className="p-4 space-y-3">
                {/* SETTINGS */}
                {showSettings && (
                    <div className="p-3 bg-white/3 border border-white/5 space-y-2">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                            Slippage Tolerance
                        </p>

                        <div className="flex items-center gap-2">
                            {SLIPPAGE_OPTIONS.map(
                                (
                                    s
                                ) => (
                                    <button
                                        key={
                                            s
                                        }
                                        onClick={() =>
                                            setSlippage(
                                                s
                                            )
                                        }
                                        className={cn(
                                            "px-2.5 py-1 text-xs font-medium transition-colors",
                                            slippage ===
                                                s
                                                ? "bg-[#5170ff] text-white"
                                                : "bg-white/5 text-gray-400 hover:text-white"
                                        )}
                                    >
                                        {s}%
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* BUY SELL */}
                <div className="flex overflow-hidden border border-white/10">
                    <button
                        onClick={() =>
                            setOrderSide(
                                "buy"
                            )
                        }
                        className={cn(
                            "flex-1 py-2.5 text-xs font-bold transition-colors",
                            orderSide ===
                                "buy"
                                ? "bg-green-500 text-white"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/3"
                        )}
                    >
                        Beli
                    </button>

                    <button
                        onClick={() =>
                            setOrderSide(
                                "sell"
                            )
                        }
                        className={cn(
                            "flex-1 py-2.5 text-xs font-bold transition-colors",
                            orderSide ===
                                "sell"
                                ? "bg-red-500 text-white"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/3"
                        )}
                    >
                        Jual
                    </button>
                </div>

                {/* LIMIT PRICE */}
                {orderType === "limit" && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Harga Limit
                        </label>

                        <div className="flex items-center gap-2 px-3 py-2.5 bg-white/3 border border-white/10">
                            <input
                                type="number"
                                value={
                                    limitPrice
                                }
                                onChange={(
                                    e
                                ) =>
                                    setLimitPrice(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                className="flex-1 bg-transparent text-sm font-medium text-white focus:outline-none"
                                placeholder="0.00"
                            />

                            <span className="text-xs text-gray-500">
                                {
                                    tokenB.symbol
                                }
                            </span>
                        </div>
                    </div>
                )}

                {/* SELL INPUT */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Jumlah
                        </label>

                        <span className="text-[10px] text-gray-400">
                            Saldo:{" "}
                            {
                                formattedBalance
                            }{" "}
                            {
                                sellToken.symbol
                            }
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2.5 bg-white/3 border border-white/10">
                        <input
                            type="number"
                            value={
                                sellAmount
                            }
                            onChange={(
                                e
                            ) =>
                                setSellAmount(
                                    e
                                        .target
                                        .value
                                )
                            }
                            className="flex-1 bg-transparent text-sm font-medium text-white focus:outline-none"
                            placeholder="0.00"
                        />

                        <div className="flex items-center gap-1.5">
                            <img
                                src={
                                    sellToken.logoURI
                                }
                                alt={
                                    sellToken.symbol
                                }
                                className="w-4 h-4"
                            />

                            {/* <span className="text-xs font-semibold text-gray-300">
                                {
                                    sellToken.symbol
                                }
                            </span> */}
                        </div>
                    </div>

                    {/* PERCENT */}
                    <div className="flex gap-1.5">
                        {PERCENT_OPTIONS.map(
                            (
                                pct
                            ) => (
                                <button
                                    key={
                                        pct
                                    }
                                    onClick={() =>
                                        handlePercentClick(
                                            pct
                                        )
                                    }
                                    className="flex-1 py-1 text-[10px] font-medium text-gray-500 bg-white/3 hover:bg-white/8 hover:text-gray-300 transition-colors"
                                >
                                    {pct}%
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* SWITCH */}
                <div className="flex justify-center">
                    <button
                        onClick={() =>
                            setOrderSide(
                                orderSide ===
                                    "buy"
                                    ? "sell"
                                    : "buy"
                            )
                        }
                        className="p-1.5 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowUpDown
                            size={13}
                            className="text-gray-500"
                        />
                    </button>
                </div>

                {/* RECEIVE */}
                <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Kamu Terima
                    </label>

                    <div className="flex items-center gap-2 px-3 py-2.5 bg-white/2 border border-white/5">
                        <div className="flex-1 text-sm font-medium tabular-nums text-gray-300">
                            {isQuoting ? (
                                <Loader2
                                    size={
                                        14
                                    }
                                    className="animate-spin text-[#5170ff]"
                                />
                            ) : (
                                buyAmount ||
                                "0.00"
                            )}
                        </div>

                        <div className="flex items-center gap-1.5">
                            <img
                                src={
                                    buyToken.logoURI
                                }
                                alt={
                                    buyToken.symbol
                                }
                                className="w-4 h-4"
                            />

                            <span className="text-xs font-semibold text-gray-300">
                                {
                                    buyToken.symbol
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* TRADE INFO */}
                {orderType ===
                    "market" &&
                    sellAmount &&
                    buyAmount && (
                        <div className="space-y-1.5 px-1">
                            {[
                                {
                                    label:
                                        "Slippage",
                                    value: `${slippage}%`,
                                },

                                {
                                    label:
                                        "Gas",
                                    value:
                                        quoteData?.gas
                                            ? `${Number(
                                                quoteData.gas
                                            ).toLocaleString()} units`
                                            : "—",
                                },
                            ].map(
                                ({
                                    label,
                                    value,
                                }) => (
                                    <div
                                        key={
                                            label
                                        }
                                        className="flex justify-between text-[11px]"
                                    >
                                        <span className="text-gray-600">
                                            {
                                                label
                                            }
                                        </span>

                                        <span className="text-gray-400 font-medium">
                                            {
                                                value
                                            }
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                {/* ERROR */}
                {error && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                        <AlertCircle
                            size={13}
                        />

                        {error}
                    </div>
                )}

                {/* SUBMIT */}
                {isConnected ? (
                    <button
                        onClick={
                            handleSubmit
                        }
                        disabled={
                            isSubmitting ||
                            !sellAmount ||
                            isQuoting
                        }
                        className={cn(
                            "w-full py-3 text-sm font-bold transition-all",
                            orderSide ===
                                "buy"
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white",

                            (isSubmitting ||
                                !sellAmount ||
                                isQuoting) &&
                            "opacity-40 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2
                                    size={
                                        15
                                    }
                                    className="animate-spin"
                                />

                                Memproses...
                            </span>
                        ) : (
                            `Swap ${tokenA.symbol}`
                        )}
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full py-3 text-sm font-bold bg-[#5170ff]/20 text-[#5170ff] border border-[#5170ff]/20 cursor-not-allowed"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </div>
    );
}