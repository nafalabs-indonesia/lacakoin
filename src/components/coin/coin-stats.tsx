import { CoinQuote } from "@/types/coin";
import { formatUSD, formatLargeNumber, formatSupply, formatDate } from "@/lib/utils";

interface CoinStatsProps {
  quote: CoinQuote;
  dateAdded: string;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

export function CoinStats({ quote, dateAdded }: CoinStatsProps) {
  const usd = quote.quote.USD;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-semibold mb-1">Statistik Pasar</h3>
      <div className="mt-3">
        <StatRow label="Harga"              value={formatUSD(usd.price)}                              />
        <StatRow label="Market Cap"         value={formatLargeNumber(usd.market_cap)}                 />
        <StatRow label="Volume 24 Jam"      value={formatLargeNumber(usd.volume_24h)}                 />
        <StatRow label="FDV"                value={formatLargeNumber(usd.fully_diluted_market_cap)}   />
        <StatRow label="Dominasi MC"        value={`${usd.market_cap_dominance.toFixed(2)}%`}         />
        <StatRow label="Rank CMC"           value={`#${quote.cmc_rank}`}                              />
        <StatRow label="Circulating Supply" value={formatSupply(quote.circulating_supply)}            />
        <StatRow label="Total Supply"       value={formatSupply(quote.total_supply)}                  />
        <StatRow label="Max Supply"         value={formatSupply(quote.max_supply)}                    />
        <StatRow label="Tanggal Listed"     value={formatDate(dateAdded)}                             />
      </div>
    </div>
  );
}