import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PortfolioEntry } from "@/types/coin";

interface PortfolioStore {
  entries: PortfolioEntry[];
  add: (entry: Omit<PortfolioEntry, "addedAt">) => void;
  remove: (coinId: number) => void;
  update: (coinId: number, amount: number, buyPrice: number) => void;
  has: (coinId: number) => boolean;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries.filter((e) => e.coinId !== entry.coinId),
            { ...entry, addedAt: Date.now() },
          ],
        })),
      remove: (coinId) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.coinId !== coinId),
        })),
      update: (coinId, amount, buyPrice) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.coinId === coinId ? { ...e, amount, buyPrice } : e
          ),
        })),
      has: (coinId) => get().entries.some((e) => e.coinId === coinId),
    }),
    { name: "lacakoin-portfolio" }
  )
);