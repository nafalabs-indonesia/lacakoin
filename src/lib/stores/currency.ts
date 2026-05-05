import { create } from "zustand";
import { persist } from "zustand/middleware";

type Currency = "USD" | "IDR";

interface CurrencyStore {
  currency: Currency;
  usdToIdr: number;
  toggle: () => void;
  setRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: "USD",
      usdToIdr: 16_200,
      toggle: () =>
        set({ currency: get().currency === "USD" ? "IDR" : "USD" }),
      setRate: (rate) => set({ usdToIdr: rate }),
    }),
    { name: "lacakoin-currency" }
  )
);