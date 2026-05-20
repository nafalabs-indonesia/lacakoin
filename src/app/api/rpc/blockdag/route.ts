import { NextRequest, NextResponse } from 'next/server';

// Mapping Chain ID ke RPC URL Asli
const RPC_URL_MAP: Record<string, string> = {
  '1404': process.env.BLOCKDAG_MAINNET_RPC || 'https://rpc.bdagscan.com/',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Ambil chainId dari header
    const chainId = req.headers.get('x-chain-id');
    
    if (!chainId || !RPC_URL_MAP[chainId]) {
      return NextResponse.json(
        { error: 'Invalid or missing chain ID' },
        { status: 400 }
      );
    }

    const targetRpcUrl = RPC_URL_MAP[chainId];

    // Headers untuk menipu Cloudflare
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Origin': 'https://bdagscan.com',
      'Referer': 'https://bdagscan.com/',
    };

    // Forward request
    const response = await fetch(targetRpcUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`RPC Error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-chain-id',
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
      'Access-Control-Allow-Headers': 'Content-Type, x-chain-id',
    },
  });
}