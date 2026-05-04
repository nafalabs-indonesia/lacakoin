export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div className="h-8 bg-secondary rounded w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-secondary rounded-xl" />
        ))}
      </div>
      <div className="h-6 bg-secondary rounded w-32" />
      <div className="rounded-xl border border-border/50 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-14 bg-secondary/50 border-b border-border/20" />
        ))}
      </div>
    </div>
  );
}