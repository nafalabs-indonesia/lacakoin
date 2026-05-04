import { CMCResponse, Coin, GlobalMetrics, ListingsParams } from "@/types/coin";

const BASE = "/api/cmc";

export async function fetchListings(
  params: ListingsParams = {}
): Promise<CMCResponse<Coin[]>> {
  const query = new URLSearchParams({
    start:    String(params.start    ?? 1),
    limit:    String(params.limit    ?? 100),
    sort:     params.sort            ?? "market_cap",
    sort_dir: params.sort_dir        ?? "desc",
  });

  const res = await fetch(`${BASE}/listings?${query}`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function fetchGlobalMetrics(): Promise<CMCResponse<GlobalMetrics>> {
  const res = await fetch(`${BASE}/global`);
  if (!res.ok) throw new Error("Failed to fetch global metrics");
  return res.json();
}

export async function fetchCoinDetail(slug: string) {
  const res = await fetch(`${BASE}/coin/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch coin: ${slug}`);
  return res.json();
}