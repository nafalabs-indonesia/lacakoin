// ============================================================
// Lacakoin — Number & Currency Formatters
// ============================================================

/**
 * Format harga dalam USD
 * Otomatis sesuaikan desimal berdasarkan magnitude harga
 *
 * > $1        → $1,234.56
 * $0.01–$1   → $0.1234
 * < $0.01    → $0.000123
 */
export function formatUSD(value: number): string {
  if (value === 0) return "$0.00";

  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (value >= 0.01) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  }

  // Harga sangat kecil (altcoin murah)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 4,
  }).format(value);
}

/**
 * Format harga dalam IDR
 * > 1000     → Rp 1.234,56
 * < 1        → Rp 0,0012
 */
export function formatIDR(value: number): string {
  if (value === 0) return "Rp 0";

  if (value >= 1) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Format angka besar jadi singkatan
 * 1.234.567.890 → $1.23B
 * 1.234.567     → $1.23M
 * 1.234         → $1.23K
 */
export function formatLargeNumber(
  value: number,
  currency: "USD" | "IDR" = "USD"
): string {
  const prefix = currency === "USD" ? "$" : "Rp ";
  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return `${prefix}${(value / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${prefix}${(value / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${prefix}${(value / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${prefix}${(value / 1e3).toFixed(2)}K`;
  }

  return `${prefix}${value.toFixed(2)}`;
}

/**
 * Format persentase perubahan harga
 * Positif → "+1.23%"
 * Negatif → "-1.23%"
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format supply koin
 * 21.000.000 → "21.00M"
 */
export function formatSupply(value: number | null): string {
  if (value === null || value === 0) return "∞";
  return formatLargeNumber(value, "USD").replace("$", "");
}

/**
 * Format tanggal ke lokal Indonesia
 * "2024-01-15T00:00:00Z" → "15 Jan 2024"
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

/**
 * Konversi USD ke IDR
 * Rate di-hardcode sebagai fallback, idealnya nanti fetch dari API
 */
const USD_TO_IDR_FALLBACK = 16_200;

export function usdToIDR(
  usdValue: number,
  rate: number = USD_TO_IDR_FALLBACK
): number {
  return usdValue * rate;
}

/**
 * Helper: apakah perubahan positif?
 * Dipakai untuk conditional styling (warna hijau/merah)
 */
export function isPositive(value: number): boolean {
  return value >= 0;
}