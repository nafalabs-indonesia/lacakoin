import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const limit    = searchParams.get("limit")    ?? "20";

  const params = new URLSearchParams({
    lang:  "EN",
    limit,
    sortOrder: "latest",
  });

  if (category) params.set("categories", category);

  try {
    const res = await fetch(
      `https://data-api.cryptocompare.com/news/v1/article/list?${params}`,
      { next: { revalidate: 300 } } // cache 5 menit
    );

    if (!res.ok) {
      return NextResponse.json({ Data: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[News]", error);
    return NextResponse.json({ Data: [] });
  }
}