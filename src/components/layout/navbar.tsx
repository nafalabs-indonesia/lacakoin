"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/common/search-bar";
import { CurrencyToggle } from "@/components/common/currency-toggle";

// --- Konfigurasi Menu (Text Only) ---
const navItems = [
  { label: "Market", href: "/" },
  { label: "Trending", href: "/trending" },
  {
    label: "Explore",
    children: [
      { label: "Berita Crypto", href: "/news" },
      { label: "Sentimen Pasar", href: "/fear-greed" },
    ]
  },
  {
    label: "Portfolio",
    children: [
      { label: "Watchlist", href: "/watchlist" },
      { label: "Holdings", href: "/portfolio" },
    ]
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* --- 1. LOGO (Width ~100px / w-25) --- */}
          <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <div className="relative h-10 w-24 sm:w-28">
              {/* Light Mode Logo */}
              <Image
                src="/lacax-light.png"
                alt="Lacax Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              {/* Dark Mode Logo */}
              <Image
                src="/lacax-dark.png"
                alt="Lacax Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </Link>

          {/* --- 2. DESKTOP NAVIGATION (Gray Default, White Active/Hover) --- */}
          <nav className="hidden md:flex items-center gap-6 ml-4" ref={dropdownRef}>
            {navItems.map((item) => {
              const hasDropdown = !!item.children;
              const isActive = item.href ? pathname === item.href : false;
              const isAnyChildActive = item.children?.some(c => c.href === pathname);

              // Logic Warna:
              // 1. Jika Aktif/Dropdown Terbuka: Putih (#ffffff)
              // 2. Jika Hover: Putih (#ffffff)
              // 3. Default: Abu-abu (text-gray-400)
              const isCurrentContext = isActive || isAnyChildActive || activeDropdown === item.label;

              const textColorClass = isCurrentContext
                ? "text-white"
                : "text-gray-400 hover:text-white transition-colors duration-200";

              return (
                <div key={item.label} className="relative group">
                  {hasDropdown ? (
                    // Item dengan Dropdown
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className={cn(
                        "flex items-center gap-1.5 py-2 text-sm font-medium outline-none",
                        textColorClass
                      )}
                    >
                      {item.label}
                      <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === item.label && "rotate-180")} />
                    </button>
                  ) : (
                    // Item Link Biasa
                    <Link
                      href={item.href!}
                      className={cn(
                        "py-2 text-sm font-medium outline-none",
                        textColorClass
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Content */}
                  {hasDropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-1.5 bg-popover border border-border/50 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top-left z-50">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setActiveDropdown(null)}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === child.href
                              ? "bg-[#5170ff]/10 text-white" // Active child: White text with blue tint bg
                              : "text-gray-400 hover:bg-secondary/50 hover:text-white" // Inactive child: Gray to White
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* --- 3. RIGHT ACTIONS --- */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <CurrencyToggle />
              <div className="w-[200px]">
                <SearchBar />
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-secondary/10 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-4 space-y-4">
            <SearchBar />

            <div className="space-y-1 pt-2">
              {navItems.map((item) => {
                const hasDropdown = !!item.children;

                return (
                  <div key={item.label}>
                    {hasDropdown ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-sm font-semibold text-white">
                          {item.label}
                        </div>
                        <div className="pl-4 space-y-1 border-l-2 border-border/50 ml-3">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === child.href
                                  ? "text-[#5170ff]" // Active mobile link uses accent color for distinction
                                  : "text-gray-400 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}