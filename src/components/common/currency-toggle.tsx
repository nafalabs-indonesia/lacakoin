"use client";

import { useCurrencyStore } from "@/lib/stores/currency";
import { cn } from "@/lib/utils";

export function CurrencyToggle() {
  const { currency, toggle } = useCurrencyStore();

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
        "border-border/50 bg-secondary hover:bg-secondary/70"
      )}
      aria-label="Toggle currency"
    >
      <span className={cn(currency === "USD" ? "text-foreground" : "text-muted-foreground")}>
        USD
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={cn(currency === "IDR" ? "text-foreground" : "text-muted-foreground")}>
        IDR
      </span>
    </button>
  );
}