import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ambil top 100, lalu kita sort di server untuk gainers/losers/trending
    const res = await fetch(
      `${process.env.CMC_API_BASE_URL}/v1/cryptocurrency/listings/latest?limit=100&convert=USD&sort=market_cap`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: res.status });
    }

    const json = await res.json();
    const coins = json.data;

    // Gainers: naik terbanyak 24j
    const gainers = [...coins]
      .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
      .slice(0, 10);

    // Losers: turun terbanyak 24j
    const losers = [...coins]
      .sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
      .slice(0, 10);

    // Trending: volume terbesar relative to market cap (volume/mcap ratio)
    const trending = [...coins]
      .sort((a, b) => {
        const ratioA = a.quote.USD.volume_24h / a.quote.USD.market_cap;
        const ratioB = b.quote.USD.volume_24h / b.quote.USD.market_cap;
        return ratioB - ratioA;
      })
      .slice(0, 10);

    return NextResponse.json({ gainers, losers, trending });
  } catch (error) {
    console.error("[CMC trending]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}