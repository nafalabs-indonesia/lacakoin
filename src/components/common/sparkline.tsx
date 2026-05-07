interface SparklineProps {
    changes: number[]; // [1h, 24h, 7d]
    positive: boolean;
}

export function Sparkline({ changes, positive }: SparklineProps) {
    // Buat titik dari perubahan kumulatif
    const base = 100;
    const points = [
        base,
        base * (1 + changes[0] / 100),
        base * (1 + changes[1] / 100),
        base * (1 + changes[2] / 100),
    ];

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const width = 80;
    const height = 32;
    const pad = 2;

    const coords = points.map((p, i) => {
        const x = pad + (i / (points.length - 1)) * (width - pad * 2);
        const y = pad + ((max - p) / range) * (height - pad * 2);
        return `${x},${y}`;
    });

    const d = `M ${coords.join(" L ")}`;

    const fillCoords = [
        `${pad},${height - pad}`,
        ...coords,
        `${width - pad},${height - pad}`,
    ];
    const fillD = `M ${fillCoords.join(" L ")} Z`;

    const color = positive ? "var(--color-up)" : "var(--color-down)";

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="shrink-0"
        >
            <defs>
                <linearGradient id={`spark-${positive}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={fillD} fill={`url(#spark-${positive})`} />
            <path d={d} stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}