import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "@/types/coin";

async function searchCoins(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 1) return [];
  const res = await fetch(`/api/cmc/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 1,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}