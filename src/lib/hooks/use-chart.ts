import { useQuery } from "@tanstack/react-query";
import { ChartRange, ChartPoint } from "@/types/coin";

async function fetchChart(slug: string, range: ChartRange): Promise<ChartPoint[]> {
  const res = await fetch(`/api/chart/${slug}?range=${range}`);
  if (!res.ok) throw new Error("Failed to fetch chart");
  const json = await res.json();
  return json.prices;
}

export function useChart(slug: string, range: ChartRange) {
  return useQuery({
    queryKey: ["chart", slug, range],
    queryFn: () => fetchChart(slug, range),
    enabled: !!slug,
    staleTime: range === "1" ? 1000 * 60 * 5 : 1000 * 60 * 60,
  });
}