import { NextResponse } from "next/server";
import { CMCResponse, GlobalMetrics } from "@/types/coin";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.CMC_API_BASE_URL}/v1/global-metrics/quotes/latest?convert=USD`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from CMC" },
        { status: res.status }
      );
    }

    const data: CMCResponse<GlobalMetrics> = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[CMC global]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}