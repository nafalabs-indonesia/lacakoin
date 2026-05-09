import { Token } from "@/types/trade";

export const USDT: Token = {
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  symbol: "USDT",
  name: "Tether USD",
  decimals: 6,
  chainId: 1,
  logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
};

export const POPULAR_TOKENS: Token[] = [
  {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    symbol: "UNI",
    name: "Uniswap",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  },
  {
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    symbol: "AAVE",
    name: "Aave",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  },
  {
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    symbol: "CRV",
    name: "Curve DAO",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
  },
  {
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    symbol: "COMP",
    name: "Compound",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  },
  {
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    symbol: "MKR",
    name: "Maker",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png",
  },
  {
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    symbol: "LINK",
    name: "Chainlink",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  },
  {
    address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    symbol: "YFI",
    name: "yearn.finance",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png",
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    name: "Dai",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/9956/small/4943.png",
  },
];

export const SYMBOL_TO_COINGECKO: Record<string, string> = {
  WETH:  "ethereum",
  WBTC:  "bitcoin",
  UNI:   "uniswap",
  AAVE:  "aave",
  CRV:   "curve-dao-token",
  COMP:  "compound-governance-token",
  MKR:   "maker",
  LINK:  "chainlink",
  YFI:   "yearn-finance",
  DAI:   "dai",
  USDT:  "tether",
};

export const DEFAULT_TOKENS = POPULAR_TOKENS;