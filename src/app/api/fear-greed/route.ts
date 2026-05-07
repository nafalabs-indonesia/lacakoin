import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.alternative.me/fng/?limit=30&format=json",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Fear & Greed]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}