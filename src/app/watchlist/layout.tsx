import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "Pantau koin kripto favorit kamu di satu tempat.",
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}