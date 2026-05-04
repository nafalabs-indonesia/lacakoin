import { NextRequest, NextResponse } from "next/server";
import { CMCResponse, Coin } from "@/types/coin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams({
    start:    searchParams.get("start")    ?? "1",
    limit:    searchParams.get("limit")    ?? "100",
    sort:     searchParams.get("sort")     ?? "market_cap",
    sort_dir: searchParams.get("sort_dir") ?? "desc",
    convert:  "USD",
  });

  try {
    const res = await fetch(
      `${process.env.CMC_API_BASE_URL}/v1/cryptocurrency/listings/latest?${params}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // cache 60 detik
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from CMC" },
        { status: res.status }
      );
    }

    const data: CMCResponse<Coin[]> = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[CMC listings]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}