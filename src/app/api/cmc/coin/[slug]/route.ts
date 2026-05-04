import { NextRequest, NextResponse } from "next/server";
import { CMCResponse, CoinDetail, CoinQuote } from "@/types/coin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Fetch metadata + quote secara paralel
    const [metaRes, quoteRes] = await Promise.all([
      fetch(
        `${process.env.CMC_API_BASE_URL}/v2/cryptocurrency/info?slug=${slug}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
            Accept: "application/json",
          },
          next: { revalidate: 300 }, // metadata jarang berubah
        }
      ),
      fetch(
        `${process.env.CMC_API_BASE_URL}/v2/cryptocurrency/quotes/latest?slug=${slug}&convert=USD`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
            Accept: "application/json",
          },
          next: { revalidate: 60 },
        }
      ),
    ]);

    if (!metaRes.ok || !quoteRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch coin data" },
        { status: 500 }
      );
    }

    const [meta, quote] = await Promise.all([
      metaRes.json() as Promise<CMCResponse<Record<string, CoinDetail>>>,
      quoteRes.json() as Promise<CMCResponse<Record<string, CoinQuote>>>,
    ]);

    return NextResponse.json({ meta, quote });
  } catch (error) {
    console.error("[CMC coin detail]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}