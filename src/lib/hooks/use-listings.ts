import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/api/cmc";
import { ListingsParams } from "@/types/coin";

export function useListings(params: ListingsParams = {}) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => fetchListings(params),
  });
}