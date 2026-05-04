import { useQuery } from "@tanstack/react-query";
import { Coin } from "@/types/coin";

interface TrendingData {
  gainers: Coin[];
  losers: Coin[];
  trending: Coin[];
}

async function fetchTrending(): Promise<TrendingData> {
  const res = await fetch("/api/cmc/trending");
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}