import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Pantau nilai aset kripto kamu secara realtime.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}