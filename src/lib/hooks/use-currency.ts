import { useCurrencyStore } from "@/lib/stores/currency";
import { formatUSD, formatIDR, formatLargeNumber, usdToIDR } from "@/lib/utils";

export function useCurrency() {
  const { currency, usdToIdr } = useCurrencyStore();

  function formatPrice(usdValue: number): string {
    if (currency === "IDR") {
      return formatIDR(usdToIDR(usdValue, usdToIdr));
    }
    return formatUSD(usdValue);
  }

  function formatLarge(usdValue: number): string {
    if (currency === "IDR") {
      return formatLargeNumber(usdToIDR(usdValue, usdToIdr), "IDR");
    }
    return formatLargeNumber(usdValue, "USD");
  }

  return { currency, formatPrice, formatLarge, usdToIdr };
}