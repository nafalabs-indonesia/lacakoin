"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { useExchangeRate } from "@/lib/hooks/use-exchange-rate";

// --- Import Wagmi ---
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi"; // Pastikan path ini sesuai dengan lokasi file config wagmi kamu

function RateInitializer() {
  useExchangeRate();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchInterval: 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    // 1. WagmiProvider harus di paling luar (atau di dalam ThemeProvider, urutan tidak terlalu krusial 
    //    asalkan Navbar berada di dalamnya). Biasanya Wagmi di luar QueryClient.
    <WagmiProvider config={config}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <RateInitializer />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </WagmiProvider>
  );
}