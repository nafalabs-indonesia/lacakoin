"use client";

import { useLayout } from "./layout-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CoinTicker } from "@/components/layout/coin-ticker";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { isFooterVisible, isNavbarVisible } = useLayout();

    return (
        <div className="flex flex-col h-full w-full">
            {/* 1. Navbar (Fixed atau Static tergantung desain, disini static dalam flow flex) */}
            {isNavbarVisible && <Navbar />}

            {/* 2. Main Content Area - Scrollable */}
            {/* flex-1 membuat ini mengisi sisa ruang vertikal */}
            {/* overflow-y-auto membuat hanya area ini yang discroll */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
            </main>

            {/* 3. Footer (Optional, muncul di atas ticker jika bukan halaman trade) */}
            {isFooterVisible && (
                <div className="shrink-0">
                    <Footer />
                </div>
            )}

            {/* 4. CoinTicker - Sticky di Paling Bawah */}
            {/* shrink-0 mencegah ticker mengecil/terpotong */}
            <div className="shrink-0 z-50">
                <CoinTicker />
            </div>
        </div>
    );
}