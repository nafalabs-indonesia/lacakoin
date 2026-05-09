import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CoinTicker } from "@/components/layout/coin-ticker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lacakoin — Pantau Pasar Kripto Indonesia",
    template: "%s | Lacakoin",
  },
  description:
    "Platform agregator data kripto dengan nuansa lokal Indonesia. Pantau harga Bitcoin, Ethereum, dan ribuan koin lainnya.",
  keywords: [
    "kripto",
    "bitcoin",
    "ethereum",
    "harga kripto",
    "crypto indonesia",
    "lacakoin",
  ],
  openGraph: {
    title: "Lacakoin — Pantau Pasar Kripto Indonesia",
    description:
      "Platform agregator data kripto dengan nuansa lokal Indonesia.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary",
    title: "Lacakoin",
    description: "Pantau pasar kripto Indonesia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>

          <Footer />
          <CoinTicker />
        </Providers>
      </body>
    </html>
  );
}
