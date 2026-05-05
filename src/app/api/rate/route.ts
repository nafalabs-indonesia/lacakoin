import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/USD",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ rate: 16200 });
    }

    const data = await res.json();
    const rate = data.rates?.IDR ?? 16200;

    return NextResponse.json({ rate });
  } catch {
    return NextResponse.json({ rate: 16200 });
  }
}