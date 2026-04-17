"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SHAPES } from "@/engine/shapes";
import { SHAPE_CATEGORY_LABELS, type ShapeCategory } from "@/types/shapes";

type Filter = "all" | ShapeCategory;

interface ShapeSelectorProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const CATEGORY_ORDER: Filter[] = [
  "all",
  "nature",
  "animals",
  "food-drink",
  "people-culture",
  "architecture",
  "transport",
  "tech-objects",
  "abstract",
];

export function ShapeSelector({ selectedId, onSelect }: ShapeSelectorProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SHAPES.filter((shape) => {
      if (filter !== "all" && shape.category !== filter) return false;
      if (q) {
        return (
          shape.name.toLowerCase().includes(q) ||
          shape.tags.some((t) => t.includes(q))
        );
      }
      return true;
    });
  }, [filter, query]);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shapes"
          className="pl-8 h-8"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin -mx-0.5 px-0.5 pb-1">
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "shrink-0 text-[11px] font-medium px-2 py-1 rounded transition-colors whitespace-nowrap",
              filter === cat
                ? "bg-brand/20 text-brand-hover"
                : "text-white/50 hover:text-white/80 hover:bg-canvas-elevated"
            )}
          >
            {cat === "all" ? "All" : SHAPE_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* None option */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "w-full text-xs px-3 py-2 rounded-md border transition-colors text-left",
          selectedId === null
            ? "border-brand bg-brand/10 text-white"
            : "border-canvas-border text-white/60 hover:text-white hover:border-white/30"
        )}
      >
        No shape · Plain barcode
      </button>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
        {filtered.map((shape) => (
          <button
            key={shape.id}
            type="button"
            onClick={() => onSelect(shape.id)}
            title={shape.name}
            className={cn(
              "shape-card aspect-[4/3] rounded-md border bg-canvas-elevated p-1.5",
              "flex flex-col items-center justify-center gap-1",
              selectedId === shape.id
                ? "border-brand selected"
                : "border-canvas-border hover:border-white/30"
            )}
          >
            <svg
              viewBox={shape.viewBox}
              className="w-full h-full"
              aria-hidden
            >
              <path d={shape.svgPath} fill="currentColor" className="text-white/70" />
            </svg>
            <span className="text-[9px] text-white/50 leading-none truncate w-full text-center">
              {shape.name}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-xs text-white/40 py-4">No shapes match.</p>
      )}

      {/* AI + Upload CTAs (Phase 3) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          disabled
          title="Coming in Phase 3"
          className="flex items-center justify-center gap-1.5 text-[11px] font-medium px-2 py-2 rounded border border-dashed border-canvas-border text-white/30 cursor-not-allowed"
        >
          <Sparkles size={12} />
          AI Generate
        </button>
        <button
          type="button"
          disabled
          title="Coming in Phase 3"
          className="flex items-center justify-center gap-1.5 text-[11px] font-medium px-2 py-2 rounded border border-dashed border-canvas-border text-white/30 cursor-not-allowed"
        >
          <Upload size={12} />
          Upload SVG
        </button>
      </div>
    </div>
  );
}
