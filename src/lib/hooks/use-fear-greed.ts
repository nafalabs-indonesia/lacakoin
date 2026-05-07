import { useQuery } from "@tanstack/react-query";
import { FearGreedResponse } from "@/types/coin";

async function fetchFearGreed(): Promise<FearGreedResponse> {
  const res = await fetch("/api/fear-greed");
  if (!res.ok) throw new Error("Failed to fetch fear & greed");
  return res.json();
}

export function useFearGreed() {
  return useQuery({
    queryKey: ["fear-greed"],
    queryFn: fetchFearGreed,
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });
}