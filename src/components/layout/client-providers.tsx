"use client";

import { Providers } from "./providers";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <div suppressHydrationWarning>
            <Providers>{children}</Providers>
        </div>
    );
}