"use client";

import { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
} from "recharts";
import { FearGreedEntry } from "@/types/coin";

interface FgiHistoryProps {
    data: FearGreedEntry[];
}

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { value: number; payload: { date: string; label: string } }[];
}) {
    if (!active || !payload?.length) return null;
    const { value, payload: p } = payload[0];

    function getColor(v: number) {
        if (v <= 20) return "#ef4444";
        if (v <= 40) return "#f97316";
        if (v <= 60) return "#eab308";
        if (v <= 80) return "#84cc16";
        return "#22c55e";
    }

    return (
        <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-xl text-xs">
            <p className="text-muted-foreground mb-1">{p.date}</p>
            <p className="font-semibold" style={{ color: getColor(value) }}>
                {value} — {p.label}
            </p>
        </div>
    );
}

export function FgiHistory({ data }: FgiHistoryProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const chartData = [...data]
        .reverse()
        .map((entry) => ({
            date: new Date(parseInt(entry.timestamp) * 1000).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
            }),
            value: parseInt(entry.value),
            label: entry.value_classification,
        }));

    return (
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Riwayat 30 Hari</h3>
            <div className="h-48 w-full min-w-0">
                {!isMounted ? (
                    <div className="h-full bg-secondary rounded-lg animate-pulse" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fgi-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                                interval={4}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                                width={28}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} />
                            <ReferenceLine y={50} stroke="#eab308" strokeDasharray="3 3" strokeOpacity={0.4} />
                            <ReferenceLine y={75} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.4} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#eab308"
                                strokeWidth={2}
                                fill="url(#fgi-gradient)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: "#eab308" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Zone legend */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {[
                    { color: "#ef4444", label: "0–24: Ketakutan Ekstrem" },
                    { color: "#f97316", label: "25–49: Ketakutan" },
                    { color: "#eab308", label: "50: Netral" },
                    { color: "#84cc16", label: "51–74: Keserakahan" },
                    { color: "#22c55e", label: "75–100: Keserakahan Ekstrem" },
                ].map(({ color, label }) => (
                    <span key={label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}