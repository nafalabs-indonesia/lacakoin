import { useQuery } from "@tanstack/react-query";
import { NewsResponse } from "@/types/coin";

async function fetchNews(category = "", limit = 20): Promise<NewsResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (category) params.set("category", category);
  const res = await fetch(`/api/news?${params}`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export function useNews(category = "", limit = 20) {
  return useQuery({
    queryKey: ["news", category, limit],
    queryFn:  () => fetchNews(category, limit),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
}