import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.0x.org/swap/allowance-holder";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const src = searchParams.get("src");
    const dst = searchParams.get("dst");
    const amount = searchParams.get("amount");
    const taker = searchParams.get("taker"); // wallet address user
    const chainId = searchParams.get("chainId") || "1";

    if (!src || !dst || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required params",
        },
        { status: 400 }
      );
    }

    const url = new URL(`${BASE_URL}/quote`);

    url.searchParams.set("chainId", chainId);
    url.searchParams.set("sellToken", src);
    url.searchParams.set("buyToken", dst);
    url.searchParams.set("sellAmount", amount);

    if (taker) {
      url.searchParams.set("taker", taker);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "0x-api-key": process.env.LACAX_API_KEY!,
        "0x-version": "v2",
        Accept: "application/json",
      },

      next: {
        revalidate: 5,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.reason || "0x quote failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[0X_QUOTE_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}