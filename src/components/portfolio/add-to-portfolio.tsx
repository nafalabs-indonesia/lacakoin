"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/lib/stores/portfolio";
import { PlusCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToPortfolioProps {
  coinId: number;
  symbol: string;
  name: string;
  slug: string;
  currentPrice: number;
}

export function AddToPortfolio({
  coinId,
  symbol,
  name,
  slug,
  currentPrice,
}: AddToPortfolioProps) {
  const { has, add, remove } = usePortfolioStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState(String(currentPrice.toFixed(2)));

  const inPortfolio = has(coinId);

  function handleSubmit() {
    const parsedAmount   = parseFloat(amount);
    const parsedBuyPrice = parseFloat(buyPrice);
    if (!parsedAmount || !parsedBuyPrice) return;

    add({ coinId, symbol, name, slug, amount: parsedAmount, buyPrice: parsedBuyPrice });
    setOpen(false);
    setAmount("");
  }

  if (inPortfolio) {
    return (
      <button
        onClick={() => remove(coinId)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-(--color-brand-500) text-(--color-brand-500) text-xs font-medium hover:bg-brand-500/10 transition-colors"
      >
        <Check size={14} />
        Di Portfolio
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--color-brand-500) text-background text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <PlusCircle size={14} />
        Tambah ke Portfolio
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border/50 bg-popover shadow-xl p-4 z-50 space-y-3">
          <p className="text-sm font-semibold">
            Tambah {name} ({symbol})
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Jumlah {symbol}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--color-brand-500)"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Harga Beli (USD)
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--color-brand-500)"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/70 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount || !buyPrice}
              className="flex-1 px-3 py-2 rounded-lg bg-(--color-brand-500) text-background text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}