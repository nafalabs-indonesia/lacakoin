import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetail } from "@/lib/api/cmc";

export function useCoinDetail(slug: string) {
  return useQuery({
    queryKey: ["coin", slug],
    queryFn: () => fetchCoinDetail(slug),
    enabled: !!slug,
  });
}