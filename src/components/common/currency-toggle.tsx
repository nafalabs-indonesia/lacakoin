"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrencyStore } from "@/lib/stores/currency";
import { Coins, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrencyToggle() {
  const { currency, toggle } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (c: string) => {
    if (currency !== c) toggle();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-secondary text-sm font-medium transition-colors",
          isOpen ? "bg-secondary/80 text-foreground" : "text-foreground hover:bg-secondary/80"
        )}
        aria-label="Select currency"
      >
        <Coins className="w-4 h-4 text-[#5170ff]" /> {/* Icon Koin dengan aksen biru */}
        <span>{currency}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu - Style mirip Header */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 p-1.5 bg-popover border border-border/50 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
          {["USD", "IDR"].map((c) => (
            <button
              key={c}
              onClick={() => handleSelect(c)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                currency === c
                  ? "bg-[#5170ff]/10 text-[#5170ff]"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <span>{c}</span>
              {currency === c && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#5170ff]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}