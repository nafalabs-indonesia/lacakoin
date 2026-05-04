import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-foreground font-medium">Lacakoin</span>.
            Data dari CoinMarketCap.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Market
            </Link>
            <Link href="/trending" className="hover:text-foreground transition-colors">
              Trending
            </Link>
            <Link href="/watchlist" className="hover:text-foreground transition-colors">
              Watchlist
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}