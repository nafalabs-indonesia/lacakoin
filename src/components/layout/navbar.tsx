"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Wallet,
  Loader2,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/common/search-bar";
import { CurrencyToggle } from "@/components/common/currency-toggle";

// --- Wagmi Imports ---
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// --- 1. Definisi Tipe Data untuk Menu ---
interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  children?: NavItem[];
}

// --- 2. Konfigurasi Menu ---
const navItems: NavItem[] = [
  { label: "Market", href: "/" },
  { label: "Trending", href: "/trending" },
  {
    label: "Swap",
    href: "/swap",
    badge: "BETA"
  },
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

  // State untuk Dropdown Wallet
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const walletMenuRef = useRef<HTMLDivElement>(null);

  // --- Wagmi Hooks ---
  // isConnecting mencakup status 'connecting' dari account
  const { address, isConnected, isConnecting } = useAccount();

  // Hapus isLoading dari sini karena sudah tidak ada di Wagmi v2
  const { connect, connectors } = useConnect();

  const { disconnect } = useDisconnect();

  // Close Nav Dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close Wallet Dropdown
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setIsWalletMenuOpen(false);
      }

      // Close Nav Menu Dropdown (Simple implementation)
      // Jika klik di luar elemen dengan class 'group' (nav item), tutup dropdown nav
      const target = event.target as HTMLElement;
      if (!target.closest('.group')) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper untuk format alamat wallet
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* --- 1. LOGO --- */}
          <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <div className="relative h-10 w-24 sm:w-28">
              <Image
                src="/lacax-light.png"
                alt="Lacax Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/lacax-dark.png"
                alt="Lacax Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </Link>

          {/* --- 2. DESKTOP NAVIGATION --- */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            {navItems.map((item) => {
              const hasDropdown = !!item.children;
              const isActive = item.href ? pathname === item.href : false;
              const isAnyChildActive = item.children?.some(c => c.href === pathname);

              const isCurrentContext = isActive || isAnyChildActive || activeDropdown === item.label;

              const textColorClass = isCurrentContext
                ? "text-white"
                : "text-gray-400 hover:text-white transition-colors duration-200";

              return (
                <div key={item.label} className="relative group">
                  {hasDropdown ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className={cn(
                        "flex items-center gap-1.5 py-2 text-sm font-medium outline-none relative",
                        textColorClass
                      )}
                    >
                      {item.label}
                      {item.badge && (
                        <span className="absolute -top-1.5 -right-2 px-1 py-[1px] rounded-[2px] text-[8px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-sm">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === item.label && "rotate-180")} />
                    </button>
                  ) : (
                    item.href ? (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 py-2 text-sm font-medium outline-none relative",
                          textColorClass
                        )}
                      >
                        {item.label}
                        {item.badge && (
                          <span className="absolute -top-1.5 -right-2 px-1 py-[1px] rounded-[2px] text-[8px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : null
                  )}

                  {/* Dropdown Content Navigation */}
                  {hasDropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-1.5 bg-popover border border-border/50 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top-left z-40">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href!}
                          onClick={() => setActiveDropdown(null)}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === child.href
                              ? "bg-[#5170ff]/10 text-white"
                              : "text-gray-400 hover:bg-secondary/50 hover:text-white"
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

            {/* Desktop Tools */}
            <div className="hidden md:flex items-center gap-3">
              <CurrencyToggle />
              <div className="w-[200px]">
                <SearchBar />
              </div>
            </div>

            {/* Connect Wallet Section with Dropdown */}
            <div className="hidden sm:block relative" ref={walletMenuRef}>
              {isConnected && address ? (
                // --- STATE: CONNECTED ---
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-semibold font-mono">{formatAddress(address)}</span>
                  <button
                    onClick={() => disconnect()}
                    className="ml-1 p-1 hover:bg-emerald-500/20 rounded-full transition-colors text-emerald-600"
                    title="Disconnect"
                  >
                    <LogOut size={12} />
                  </button>
                </div>
              ) : (
                // --- STATE: DISCONNECTED ---
                <>
                  <button
                    onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                    disabled={isConnecting}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border min-w-[140px] justify-center",
                      isConnecting
                        ? "bg-secondary text-muted-foreground border-border cursor-not-allowed"
                        : "bg-[#5170ff] text-white border-[#5170ff] hover:bg-[#4059cc] hover:border-[#4059cc]"
                    )}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet size={16} />
                        <span>Connect Wallet</span>
                        <ChevronDown size={14} className={cn("transition-transform", isWalletMenuOpen && "rotate-180")} />
                      </>
                    )}
                  </button>

                  {/* Wallet Selector Dropdown */}
                  {isWalletMenuOpen && !isConnected && (
                    <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-popover border border-border/50 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="mb-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Pilih Wallet
                      </div>
                      <div className="space-y-1">
                        {connectors.map((connector) => (
                          <button
                            key={connector.uid}
                            onClick={() => {
                              connect({ connector });
                              setIsWalletMenuOpen(false);
                            }}
                            disabled={isConnecting} // Gunakan isConnecting global
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-3">
                              {/* Icon Wallet */}
                              <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                                {connector.icon ? (
                                  <img
                                    src={connector.icon}
                                    alt={connector.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Wallet size={16} className="text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground group-hover:text-[#5170ff] transition-colors">
                                  {connector.name}
                                </span>
                              </div>
                            </div>

                            {/* Indikator Connecting Global */}
                            {isConnecting && (
                              <Loader2 size={14} className="animate-spin text-[#5170ff]" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 pt-2 border-t border-border/50 px-2 text-[10px] text-muted-foreground text-center">
                        Belum punya wallet? <a href="https://metamask.io" target="_blank" rel="noreferrer" className="underline hover:text-foreground">Download MetaMask</a>
                      </div>
                    </div>
                  )}
                </>
              )}
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

            {/* Mobile Connect Wallet List */}
            <div className="mb-2 space-y-2">
              {isConnected && address ? (
                <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-semibold font-mono">{formatAddress(address)}</span>
                  </div>
                  <button onClick={() => disconnect()} className="p-1 hover:bg-emerald-500/20 rounded-full">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      disabled={isConnecting}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border bg-secondary/30 hover:bg-secondary/50 disabled:opacity-50"
                    >
                      {connector.icon && (
                        <img src={connector.icon} alt={connector.name} className="w-5 h-5 rounded-full" />
                      )}
                      <span>{connector.name}</span>
                      {isConnecting && <Loader2 size={14} className="animate-spin" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 pt-2">
              {navItems.map((item) => {
                const hasDropdown = !!item.children;
                return (
                  <div key={item.label}>
                    {hasDropdown ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-sm font-semibold text-white flex items-center justify-between relative">
                          {item.label}
                          {item.badge && (
                            <span className="absolute top-1 right-8 px-1 py-[1px] rounded-[2px] text-[8px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-sm">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="pl-4 space-y-1 border-l-2 border-border/50 ml-3">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href!}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === child.href
                                  ? "text-[#5170ff]"
                                  : "text-gray-400 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between relative",
                            pathname === item.href
                              ? "text-white"
                              : "text-gray-400 hover:text-white"
                          )}
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="absolute top-1 right-8 px-1 py-[1px] rounded-[2px] text-[8px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-sm">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ) : null
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