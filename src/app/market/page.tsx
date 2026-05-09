"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect otomatis ke Bitcoin pair saat user buka /market
        router.replace("/market/bitcoin");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
            <div className="animate-pulse">Loading Market...</div>
        </div>
    );
}