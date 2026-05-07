import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fear & Greed Index",
    description: "Indeks sentimen pasar kripto — pantau ketakutan dan keserakahan pasar.",
};

export default function FearGreedLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}