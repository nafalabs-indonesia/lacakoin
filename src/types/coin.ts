// Representasi satu koin di list/table
export interface Coin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      market_cap: number;
      market_cap_dominance: number;
    };
  };
}

// Global market stats
export interface GlobalMetrics {
  quote: {
    USD: {
      total_market_cap: number;
      total_volume_24h: number;
      total_market_cap_yesterday_percentage_change: number;
      total_volume_24h_yesterday_percentage_change: number;
    };
  };
  btc_dominance: number;
  eth_dominance: number;
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
}

// Detail koin (untuk halaman detail)
export interface CoinDetail {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  description: string;
  logo: string;
  tags: string[];
  urls: {
    website: string[];
    technical_doc: string[];
    twitter: string[];
    reddit: string[];
    source_code: string[];
  };
  date_added: string;
  category: string;
  infinite_supply: boolean;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
}

// Quote detail (harga + supply)
export interface CoinQuote {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  cmc_rank: number;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
}

// Response wrapper CMC
export interface CMCResponse<T> {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: T;
}

// Response gabungan coin detail
export interface CoinDetailResponse {
  meta: CMCResponse<Record<string, CoinDetail>>;
  quote: CMCResponse<Record<string, CoinQuote>>;
}

// Query params untuk listings
export interface ListingsParams {
  start?: number;
  limit?: number;
  sort?: "market_cap" | "volume_24h" | "percent_change_24h";
  sort_dir?: "asc" | "desc";
}

export interface SearchResult {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  rank: number;
}

export type ChartRange = "1" | "7" | "30" | "90" | "365";

export interface ChartPoint {
  time: number;
  price: number;
}

export interface PortfolioEntry {
  coinId: number;
  symbol: string;
  name: string;
  slug: string;
  amount: number;      // jumlah koin dimiliki
  buyPrice: number;    // harga beli dalam USD
  addedAt: number;     // timestamp
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercent: number;
}

export interface FearGreedEntry {
  value: string;
  value_classification: string;
  timestamp: string;
}

export interface FearGreedResponse {
  data: FearGreedEntry[];
}

export interface NewsArticle {
  ID: number;
  TITLE: string;
  URL: string;
  IMAGE_URL: string;
  PUBLISHED_ON: number;
  AUTHORS: string;
  BODY: string;
  SENTIMENT: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  SOURCE_DATA: {
    NAME: string;
    IMAGE_URL: string;
  };
  CATEGORY_DATA: {
    NAME: string;
    CATEGORY: string;
  }[];
}

export interface NewsResponse {
  Data: NewsArticle[];
}