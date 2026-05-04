import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-(--color-brand-500)">404</h1>
        <h2 className="text-xl font-semibold">Halaman tidak ditemukan</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-brand-500) text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <TrendingUp size={16} />
        Kembali ke Market
      </Link>
    </div>
  );
}