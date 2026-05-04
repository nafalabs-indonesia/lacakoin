"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="p-4 rounded-full bg-destructive/10">
        <AlertTriangle size={32} className="text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Terjadi kesalahan</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Sesuatu yang tidak terduga terjadi. Coba lagi atau refresh halaman.
        </p>
      </div>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/70 transition-colors"
      >
        Coba lagi
      </button>
    </div>
  );
}