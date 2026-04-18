"use client";

import { useState } from "react";
import { Wand2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColorConfig } from "@/types/barcode";

interface Palette {
  name: string;
  primary: string;
  secondary?: string;
  background: string;
}

interface BrandMatcherProps {
  onApply: (color: ColorConfig) => void;
}

export function BrandMatcher({ onApply }: BrandMatcherProps) {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if ((!brandName.trim() && !brandDescription.trim()) || loading) return;
    setLoading(true);
    setError(null);
    setPalettes([]);

    try {
      const res = await fetch("/api/v1/brand/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim() || undefined,
          brandDescription: brandDescription.trim() || undefined,
        }),
      });
      const json = await res.json() as { data?: { palettes: Palette[] }; error?: string };
      if (!res.ok || !json.data) throw new Error(json.error ?? "Generation failed");
      setPalettes(json.data.palettes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const apply = (palette: Palette) => {
    const colorConfig: ColorConfig = palette.secondary
      ? {
          mode: "gradient",
          primary: palette.primary,
          secondary: palette.secondary,
          gradientDirection: "to-br",
          background: palette.background,
        }
      : {
          mode: "solid",
          primary: palette.primary,
          background: palette.background,
        };
    onApply(colorConfig);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1 block">
          Brand name
        </label>
        <Input
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Oat & Honey"
          className="h-8 text-xs"
        />
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1 block">
          Brand vibe
        </label>
        <Input
          value={brandDescription}
          onChange={(e) => setBrandDescription(e.target.value)}
          placeholder="e.g. natural, earthy, premium organic snacks"
          className="h-8 text-xs"
        />
      </div>

      <Button
        onClick={generate}
        disabled={(!brandName.trim() && !brandDescription.trim()) || loading}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {loading ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
        {loading ? "Matching colors…" : "Match brand colors"}
      </Button>

      {error && (
        <p className="text-[11px] text-scan-bad">{error}</p>
      )}

      {palettes.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Suggested palettes
          </p>
          {palettes.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => apply(p)}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg border border-canvas-border",
                "hover:border-white/30 transition-colors text-left"
              )}
            >
              {/* Color swatches */}
              <div className="flex gap-1 shrink-0">
                <div
                  className="w-6 h-6 rounded-md border border-white/10"
                  style={{ background: p.secondary
                    ? `linear-gradient(135deg, ${p.primary}, ${p.secondary})`
                    : p.primary }}
                />
                <div
                  className="w-6 h-6 rounded-md border border-white/10"
                  style={{ backgroundColor: p.background }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-white/80 truncate">{p.name}</p>
                <p className="text-[10px] text-white/30 font-mono">
                  {p.primary} / {p.background}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
