import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Berita Kripto",
    description: "Berita terbaru seputar dunia kripto dari berbagai sumber terpercaya.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}