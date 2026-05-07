"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Star, BarChart2, Menu, X, PieChart, Activity, Newspaper } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/common/search-bar";
import { CurrencyToggle } from "@/components/common/currency-toggle";

const navLinks = [
  { href: "/", label: "Market", icon: BarChart2 },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/news", label: "Berita", icon: Newspaper },
  { href: "/fear-greed", label: "Sentimen", icon: Activity },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl shrink-0"
          >
            <span className="text-(--color-brand-500)">₿</span>
            <span>Lacakoin</span>
          </Link>

          {/* Live indicator */}
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-up) animate-pulse" />
            Live
          </span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Search — push ke kanan */}
          <div className="ml-auto hidden md:flex items-center gap-3">
            <CurrencyToggle />
            <SearchBar />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {/* Search di mobile */}
            <div className="pt-2 pb-1">
              <SearchBar />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
