"use client";

import { useLayout } from "./layout-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CoinTicker } from "@/components/layout/coin-ticker";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { isFooterVisible, isNavbarVisible } = useLayout();

    return (
        <div className="flex flex-col h-full w-full">
            {/* 1. Navbar */}
            {isNavbarVisible && (
                <header className="shrink-0 z-50">
                    <Navbar />
                </header>
            )}

            {/* 2. Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <div className="min-h-full flex flex-col">
                    {children}

                    {/* Footer di dalam konten yang discroll */}
                    {isFooterVisible && (
                        <div className="shrink-0 mt-auto">
                            <Footer />
                        </div>
                    )}
                </div>
            </main>

            {/* 3. CoinTicker - Selalu di bawah viewport */}
            <div className="shrink-0 z-40">
                <CoinTicker />
            </div>
        </div>
    );
}