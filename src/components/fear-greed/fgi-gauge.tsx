"use client";

interface FgiGaugeProps {
    value: number;
    label: string;
}

function getColor(value: number): string {
    if (value <= 20) return "#ef4444";
    if (value <= 40) return "#f97316";
    if (value <= 60) return "#eab308";
    if (value <= 80) return "#84cc16";
    return "#22c55e";
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

export function FgiGauge({ value, label }: FgiGaugeProps) {
    const color = getColor(value);
    const translated = translateLabel(label);

    const size = 200;
    const cx = size / 2;
    const cy = size / 2 + 20;
    const r = 75;
    const startAngle = -180;
    const endAngle = 0;
    const totalAngle = endAngle - startAngle;
    const valueAngle = startAngle + (value / 100) * totalAngle;

    function polarToCartesian(angle: number) {
        const rad = (angle * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    }

    function describeArc(start: number, end: number) {
        const s = polarToCartesian(start);
        const e = polarToCartesian(end);
        const largeArc = end - start > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    }

    const needleLen = r - 10;
    const angle = (valueAngle * Math.PI) / 180;
    const tipX = cx + needleLen * Math.cos(angle);
    const tipY = cy + needleLen * Math.sin(angle);

    const needleBase1 = {
        x: cx + 6 * Math.cos(((valueAngle + 90) * Math.PI) / 180),
        y: cy + 6 * Math.sin(((valueAngle + 90) * Math.PI) / 180),
    };
    const needleBase2 = {
        x: cx + 6 * Math.cos(((valueAngle - 90) * Math.PI) / 180),
        y: cy + 6 * Math.sin(((valueAngle - 90) * Math.PI) / 180),
    };

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
                {/* Background arc */}
                <path
                    d={describeArc(startAngle, endAngle)}
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth={14}
                    strokeLinecap="round"
                />

                {/* Value arc */}
                <path
                    d={describeArc(startAngle, valueAngle)}
                    fill="none"
                    stroke={color}
                    strokeWidth={14}
                    strokeLinecap="round"
                />

                {/* Zone labels */}
                {[
                    { angle: -165, label: "10" },
                    { angle: -135, label: "25" },
                    { angle: -90, label: "50" },
                    { angle: -45, label: "75" },
                    { angle: -15, label: "90" },
                ].map(({ angle: a, label: l }) => {
                    const pos = polarToCartesian(a);
                    return (
                        <text
                            key={l}
                            x={pos.x}
                            y={pos.y - 18}
                            textAnchor="middle"
                            fontSize={9}
                            fill="var(--color-muted-foreground)"
                        >
                            {l}
                        </text>
                    );
                })}

                {/* Needle */}
                <polygon
                    points={`${tipX},${tipY} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                    fill={color}
                    opacity={0.9}
                />
                <circle cx={cx} cy={cy} r={6} fill={color} />

                {/* Value text */}
                <text
                    x={cx}
                    y={cy + 28}
                    textAnchor="middle"
                    fontSize={28}
                    fontWeight="bold"
                    fill={color}
                    fontFamily="monospace"
                >
                    {value}
                </text>
            </svg>

            {/* Label */}
            <div className="text-center -mt-2">
                <p className="text-lg font-semibold">{translated}</p>
            </div>
        </div>
    );
}