export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

export interface PoolInfo {
  token0: Token;
  token1: Token;
  fee: number;
  liquidity: string;
  sqrtPriceX96: string;
  tick: number;
  token0Price: string;
  token1Price: string;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  priceImpact: string;
  route: string[];
}

export interface LimitOrderParams {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  validTo: number;
  receiver: string;
}

export type OrderType = "market" | "limit";
export type OrderSide = "buy" | "sell";

export interface TradeState {
  orderType: OrderType;
  orderSide: OrderSide;
  inputAmount: string;
  outputAmount: string;
  slippage: number;
  deadline: number;
}