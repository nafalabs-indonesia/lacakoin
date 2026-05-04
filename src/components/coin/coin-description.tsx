"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CoinDescriptionProps {
  name: string;
  description: string;
  tags: string[];
}

export function CoinDescription({ name, description, tags }: CoinDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 400;
  const displayed = expanded || !isLong ? description : description.slice(0, 400) + "...";

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
      <h3 className="text-sm font-semibold">Tentang {name}</h3>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{displayed}</p>
        {isLong && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-(--color-brand-500) flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            {expanded ? (
              <><ChevronUp size={14} /> Tampilkan lebih sedikit</>
            ) : (
              <><ChevronDown size={14} /> Baca selengkapnya</>
            )}
          </button>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.slice(0, 10).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}