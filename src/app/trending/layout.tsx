import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending",
  description: "Koin kripto yang sedang trending, naik, dan turun hari ini.",
};

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}