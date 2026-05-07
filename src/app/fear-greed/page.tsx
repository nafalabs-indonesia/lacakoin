"use client";

import { useFearGreed } from "@/lib/hooks/use-fear-greed";
import { FgiGauge } from "@/components/fear-greed/fgi-gauge";
import { FgiHistory } from "@/components/fear-greed/fgi-history";
import { Activity } from "lucide-react";

function PageSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 bg-secondary rounded w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-72 bg-secondary rounded-xl" />
                <div className="h-72 bg-secondary rounded-xl" />
            </div>
            <div className="h-64 bg-secondary rounded-xl" />
        </div>
    );
}

function translateLabel(label: string): string {
    switch (label.toLowerCase()) {
        case "extreme fear": return "Ketakutan Ekstrem";
        case "fear": return "Ketakutan";
        case "neutral": return "Netral";
        case "greed": return "Keserakahan";
        case "extreme greed": return "Keserakahan Ekstrem";
        default: return label;
    }
}

export default function FearGreedPage() {
    const { data, isLoading, isError } = useFearGreed();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <PageSkeleton />
            </div>
        );
    }

    if (isError || !data?.data?.length) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive text-sm text-center">
                    Gagal memuat data Fear & Greed Index.
                </div>
            </div>
        );
    }

    const current = data.data[0];
    const yesterday = data.data[1];
    const lastWeek = data.data[6];
    const lastMonth = data.data[29];

    const currentVal = parseInt(current.value);
    const yesterdayVal = parseInt(yesterday.value);
    const lastWeekVal = parseInt(lastWeek.value);
    const lastMonthVal = parseInt(lastMonth.value);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Activity size={22} className="text-[var(--color-brand-500)]" />
                    Fear & Greed Index
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Sentimen pasar kripto — semakin tinggi, semakin serakah pasar
                </p>
            </div>

            {/* Main gauge + comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gauge */}
                <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground mb-4">Sekarang</p>
                    <FgiGauge value={currentVal} label={current.value_classification} />
                </div>

                {/* Comparison */}
                <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
                    <h3 className="text-sm font-semibold">Perbandingan</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Kemarin", value: yesterdayVal, classification: yesterday.value_classification },
                            { label: "Minggu lalu", value: lastWeekVal, classification: lastWeek.value_classification },
                            { label: "Bulan lalu", value: lastMonthVal, classification: lastMonth.value_classification },
                        ].map(({ label, value, classification }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{label}</span>
                                <div className="flex items-center gap-3">
                                    {/* Mini bar */}
                                    <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${value}%`,
                                                background: value <= 20 ? "#ef4444"
                                                    : value <= 40 ? "#f97316"
                                                        : value <= 60 ? "#eab308"
                                                            : value <= 80 ? "#84cc16"
                                                                : "#22c55e",
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium tabular-nums w-6 text-right">
                                        {value}
                                    </span>
                                    <span className="text-xs text-muted-foreground w-36 truncate">
                                        {translateLabel(classification)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Explanation */}
                    <div className="mt-4 pt-4 border-t border-border/30 space-y-2 text-xs text-muted-foreground">
                        <p>
                            <span className="font-medium text-foreground">Fear & Greed Index</span> mengukur
                            sentimen pasar kripto dari 0 (Ketakutan Ekstrem) hingga 100 (Keserakahan Ekstrem).
                        </p>
                        <p>
                            Indeks rendah bisa jadi peluang beli, indeks tinggi bisa jadi sinyal jual —
                            tapi selalu lakukan riset sendiri.
                        </p>
                    </div>
                </div>
            </div>

            {/* History chart */}
            <FgiHistory data={data.data} />
        </div>
    );
}