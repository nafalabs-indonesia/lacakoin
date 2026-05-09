import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { LayoutProvider } from "@/components/layout/layout-provider";
import { AppLayout } from "@/components/layout/app-layout"; // Import wrapper baru

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
    default: "LacaX — Pantau Pasar Kripto Indonesia",
    template: "%s | LacaX",
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
      {/* Ubah body menjadi h-screen dan overflow-hidden */}
      <body className="h-screen overflow-hidden flex flex-col bg-background text-foreground">
        <Providers>
          <LayoutProvider>
            <AppLayout>{children}</AppLayout>
          </LayoutProvider>
        </Providers>
      </body>
    </html>
  );
}