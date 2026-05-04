import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 1) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(
      `${process.env.CMC_API_BASE_URL}/v1/cryptocurrency/map?listing_status=active&limit=20&sort=cmc_rank`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // cache 1 jam, data jarang berubah
      }
    );

    if (!res.ok) {
      return NextResponse.json({ data: [] }, { status: res.status });
    }

    const json = await res.json();

    // Filter by query (name atau symbol)
    const q = query.toLowerCase();
    const filtered = json.data.filter(
      (coin: { name: string; symbol: string }) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
    );

    return NextResponse.json({ data: filtered.slice(0, 8) });
  } catch (error) {
    console.error("[CMC search]", error);
    return NextResponse.json({ data: [] });
  }
}