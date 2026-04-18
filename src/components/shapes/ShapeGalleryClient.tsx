"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SHAPES } from "@/engine/shapes";
import { SHAPE_CATEGORY_LABELS, type ShapeCategory } from "@/types/shapes";

type Filter = "all" | ShapeCategory;

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


export function ShapeGalleryClient() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const openInStudio = (shapeId: string) => {
    router.push(`/studio?shape=${shapeId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search + filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shapes…"
            className="pl-8"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap",
                filter === cat
                  ? "bg-brand/20 text-brand-hover border border-brand/30"
                  : "text-white/50 hover:text-white hover:bg-canvas-elevated border border-transparent"
              )}
            >
              {cat === "all" ? `All (${SHAPES.length})` : SHAPE_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-white/40">
        {filtered.length} shape{filtered.length !== 1 ? "s" : ""}
        {query ? ` matching "${query}"` : ""}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filtered.map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => openInStudio(shape.id)}
              onMouseEnter={() => setHoveredId(shape.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={`${shape.name} — click to open in studio`}
              className={cn(
                "group rounded-xl border bg-canvas-elevated overflow-hidden transition-all duration-200",
                "flex flex-col items-center",
                hoveredId === shape.id
                  ? "border-brand scale-105 shadow-lg shadow-brand/20"
                  : "border-canvas-border hover:border-white/30"
              )}
            >
              {/* Shape preview */}
              <div className="w-full aspect-[4/3] flex items-center justify-center p-3 bg-canvas-surface relative overflow-hidden">
                <svg
                  viewBox={shape.viewBox}
                  className="w-full h-full"
                  aria-hidden
                >
                  <path
                    d={shape.svgPath}
                    fill="currentColor"
                    className={cn(
                      "transition-colors duration-200",
                      hoveredId === shape.id ? "text-brand" : "text-white/60"
                    )}
                  />
                </svg>

              </div>

              {/* Label */}
              <div className="w-full px-2 py-2 text-center">
                <p className="text-[11px] font-medium text-white/70 leading-none truncate group-hover:text-white transition-colors">
                  {shape.name}
                </p>
                <p className="text-[9px] text-white/30 mt-0.5">
                  {SHAPE_CATEGORY_LABELS[shape.category as ShapeCategory] ?? shape.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg mb-1">No shapes found</p>
          <p className="text-sm">Try a different search or category filter</p>
        </div>
      )}

      {/* Phase 3 CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-canvas-border">
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-canvas-border text-white/30 text-sm font-medium cursor-not-allowed flex-1"
        >
          <Sparkles size={16} />
          AI Generate Shape — Coming in Phase 3
        </button>
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-canvas-border text-white/30 text-sm font-medium cursor-not-allowed flex-1"
        >
          <Upload size={16} />
          Upload Custom SVG — Coming in Phase 3
        </button>
      </div>

      {/* Shape stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {CATEGORY_ORDER.filter((c) => c !== "all").map((cat) => {
          const count = SHAPES.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className="text-left p-3 rounded-lg border border-canvas-border hover:border-white/20 bg-canvas-elevated transition-colors"
            >
              <p className="text-white font-semibold text-lg leading-none">{count}</p>
              <p className="text-white/40 text-xs mt-1">
                {SHAPE_CATEGORY_LABELS[cat as ShapeCategory]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
