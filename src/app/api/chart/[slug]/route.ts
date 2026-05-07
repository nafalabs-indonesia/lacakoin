import { NextRequest, NextResponse } from "next/server";
import { toCoingeckoSlug } from "@/lib/utils/coingecko-slug";

export type ChartRange = "1" | "7" | "30" | "90" | "365";

const RANGE_TO_DAYS: Record<ChartRange, string> = {
  "1":   "1",
  "7":   "7",
  "30":  "30",
  "90":  "90",
  "365": "365",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const range = (searchParams.get("range") ?? "7") as ChartRange;
  const days = RANGE_TO_DAYS[range] ?? "7";

  const coingeckoSlug = toCoingeckoSlug(slug);

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coingeckoSlug}/market_chart?vs_currency=usd&days=${days}&precision=6`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: range === "1" ? 300 : 3600 },
      }
    );

    if (!res.ok) {
      // Return empty array — komponen akan handle gracefully
      return NextResponse.json({ prices: [] }, { status: 200 });
    }

    const data = await res.json();

    const prices = (data.prices as [number, number][]).map(([time, price]) => ({
      time,
      price,
    }));

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("[Chart]", error);
    return NextResponse.json({ prices: [] }, { status: 200 });
  }
}