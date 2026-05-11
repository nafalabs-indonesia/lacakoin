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
} from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/common/search-bar";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// ==========================================
// DEFINISI INTERFACE & DATA (JANGAN DIHAPUS)
// ==========================================

interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  icon?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Market", href: "/" },
  { label: "Trending", href: "/trending" },
  {
    label: "Trade",
    children: [
      { label: "Spot Trading", href: "/trade/spot", icon: "/spot.svg" },
    ]
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

// ==========================================
// COMPONENT UTAMA
// ==========================================

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Mount detection untuk avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.group')) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Wallet button component yang aman dari hydration
  const WalletButton = () => {
    if (!mounted) {
      return (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border min-w-[140px] justify-center bg-secondary text-muted-foreground border-border cursor-not-allowed"
        >
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </button>
      );
    }

    if (isConnected && address) {
      return (
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#5170ff]/50 bg-background/50 hover:bg-[#5170ff]/10 transition-all duration-300 group"
        >
          <div className="w-2 h-2 rounded-full bg-[#5170ff] animate-pulse"></div>
          <span className="text-sm font-semibold font-mono text-gray-200 group-hover:text-white">
            {formatAddress(address)}
          </span>
          <LogOut size={14} className="text-gray-400 group-hover:text-[#5170ff] transition-colors" />
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsWalletModalOpen(true)}
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
          </>
        )}
      </button>
    );
  };

  // Mobile wallet button yang sama
  const MobileWalletButton = () => {
    if (!mounted) {
      return (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border bg-secondary text-muted-foreground border-border"
        >
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </button>
      );
    }

    if (isConnected && address) {
      return (
        <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-background border border-[#5170ff]/50 text-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5170ff]"></div>
            <span className="text-sm font-semibold font-mono">{formatAddress(address)}</span>
          </div>
          <button onClick={() => disconnect()} className="p-1 hover:bg-secondary/50 rounded-full text-muted-foreground">
            <LogOut size={16} />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setIsWalletModalOpen(true)}
        disabled={isConnecting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border bg-[#5170ff] text-white border-[#5170ff] disabled:opacity-50"
      >
        <Wallet size={16} />
        <span>Connect Wallet</span>
        {isConnecting && <Loader2 size={14} className="animate-spin" />}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* KIRI: Logo dan Nav */}
          <div className="flex items-center gap-6 md:gap-8">
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

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item: NavItem) => {
                const hasDropdown = !!item.children;
                const isActive = item.href ? pathname === item.href : false;
                const isAnyChildActive = item.children?.some((c: NavItem) => c.href === pathname);
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
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.label && "rotate-180"
                          )}
                        />
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

                    {hasDropdown && activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-52 p-1.5 bg-popover border border-border/50 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top-left z-40">
                        {item.children?.map((child: NavItem) => (
                          <Link
                            key={child.href}
                            href={child.href!}
                            onClick={() => setActiveDropdown(null)}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                              pathname === child.href
                                ? "bg-[#5170ff]/10 text-white"
                                : "text-gray-400 hover:bg-secondary/50 hover:text-white"
                            )}
                          >
                            {child.icon && (
                              <Image
                                src={child.icon}
                                alt={child.label}
                                width={16}
                                height={16}
                                className="shrink-0 opacity-70"
                              />
                            )}
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* KANAN: Search dan Wallet */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-[200px]">
                <SearchBar />
              </div>
            </div>

            <div className="hidden sm:block relative">
              <WalletButton />
            </div>

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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-4 space-y-4">
            <SearchBar />

            <div className="mb-2 space-y-2">
              <MobileWalletButton />
            </div>

            <div className="space-y-1 pt-2">
              {navItems.map((item: NavItem) => {
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
                          {item.children?.map((child: NavItem) => (
                            <Link
                              key={child.href}
                              href={child.href!}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === child.href
                                  ? "text-[#5170ff]"
                                  : "text-gray-400 hover:text-white"
                              )}
                            >
                              {child.icon && (
                                <Image
                                  src={child.icon}
                                  alt={child.label}
                                  width={16}
                                  height={16}
                                  className="shrink-0 opacity-70"
                                />
                              )}
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
                            "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
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

      {/* Wallet Modal */}
      {isWalletModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsWalletModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-popover border border-border/50 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Connect Wallet</h3>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setIsWalletModalOpen(false);
                  }}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-[#5170ff]/50 hover:bg-[#5170ff]/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center overflow-hidden shadow-sm">
                      {connector.icon ? (
                        <img
                          src={connector.icon}
                          alt={connector.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Wallet size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-foreground group-hover:text-[#5170ff] transition-colors">
                        {connector.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {connector.ready ? "Ready to install" : "Install extension"}
                      </span>
                    </div>
                  </div>
                  {isConnecting && (
                    <Loader2 size={20} className="animate-spin text-[#5170ff]" />
                  )}
                  {!isConnecting && (
                    <ChevronDown size={16} className="-rotate-90 text-muted-foreground group-hover:text-[#5170ff]" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya wallet?{" "}
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5170ff] hover:underline font-medium"
                >
                  Download MetaMask
                </a>
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}