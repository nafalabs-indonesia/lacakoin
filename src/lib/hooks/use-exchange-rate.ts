"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrencyStore } from "@/lib/stores/currency";

async function fetchRate(): Promise<number> {
  const res = await fetch("/api/rate");
  if (!res.ok) return 16200;
  const json = await res.json();
  return json.rate;
}

export function useExchangeRate() {
  const setRate = useCurrencyStore((s) => s.setRate);

  const query = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: fetchRate,
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (query.data) setRate(query.data);
  }, [query.data, setRate]);

  return query;
}