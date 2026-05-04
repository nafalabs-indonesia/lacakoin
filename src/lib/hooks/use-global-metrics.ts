import { useQuery } from "@tanstack/react-query";
import { fetchGlobalMetrics } from "@/lib/api/cmc";

export function useGlobalMetrics() {
  return useQuery({
    queryKey: ["global-metrics"],
    queryFn: fetchGlobalMetrics,
  });
}