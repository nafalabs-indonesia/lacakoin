import { NextRequest, NextResponse } from 'next/server';

// Mapping Chain ID ke RPC URL Asli
const RPC_URL_MAP: Record<string, string> = {
  '1404': process.env.BLOCKDAG_MAINNET_RPC || 'https://rpc.bdagscan.com/',
  '1043': process.env.BLOCKDAG_TESTNET_RPC || 'https://rpc.awakening.bdagscan.com',
  // Tambahkan chain lain jika perlu
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chainId: string }> } // <-- Perhatikan: params adalah Promise
) {
  try {
    // Await params untuk mendapatkan nilai chainId
    const { chainId } = await params;
    
    // Validasi chainId
    if (!RPC_URL_MAP[chainId]) {
      return NextResponse.json(
        { error: `Unsupported chain ID: ${chainId}` },
        { status: 400 }
      );
    }

    const targetRpcUrl = RPC_URL_MAP[chainId];
    
    // Ambil body request dari mobile app
    const body = await req.text(); 

    // Headers untuk menipu Cloudflare agar mengira ini request browser biasa
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Origin': 'https://bdagscan.com',
      'Referer': 'https://bdagscan.com/',
    };

    // Forward request ke RPC asli BlockDAG
    const response = await fetch(targetRpcUrl, {
      method: 'POST',
      headers: headers,
      body: body,
      cache: 'no-store',
    });

    if (!response.ok) {
      // Jika RPC asli mengembalikan error, forward status codenya
      throw new Error(`RPC Error: ${response.status}`);
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Proxy RPC Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RPC data' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}