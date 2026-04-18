"use client";

import { useState } from "react";
import { Download, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { V1AIQRResponse } from "@/types/api";

type Style =
  | "watercolor"
  | "oil-painting"
  | "pixel-art"
  | "geometric"
  | "neon"
  | "vintage"
  | "minimalist"
  | "botanical"
  | "custom";

const STYLES: { id: Style; label: string; emoji: string }[] = [
  { id: "watercolor", label: "Watercolor", emoji: "🎨" },
  { id: "oil-painting", label: "Oil Painting", emoji: "🖼️" },
  { id: "pixel-art", label: "Pixel Art", emoji: "👾" },
  { id: "geometric", label: "Geometric", emoji: "⬡" },
  { id: "neon", label: "Neon", emoji: "⚡" },
  { id: "vintage", label: "Vintage", emoji: "📜" },
  { id: "minimalist", label: "Minimalist", emoji: "◻" },
  { id: "botanical", label: "Botanical", emoji: "🌿" },
  { id: "custom", label: "Custom", emoji: "✏️" },
];

export function AIQRStudio() {
  const [data, setData] = useState("https://scanvas.studio");
  const [style, setStyle] = useState<Style>("geometric");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<V1AIQRResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!data.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/qr/ai-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: data.trim(),
          prompt: prompt.trim() || "beautiful artistic design",
          style,
        }),
      });
      const json = await res.json() as { data?: V1AIQRResponse; error?: string };
      if (!res.ok || !json.data) throw new Error(json.error ?? "Generation failed");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!result?.imageUrl) return;
    const res = await fetch(result.imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scanvas-ai-qr-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Configuration */}
      <div className="space-y-6">
        {/* QR Data */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2 block">
            URL or text
          </label>
          <Input
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="https://your-website.com"
            className="font-mono"
          />
          <p className="text-[11px] text-white/30 mt-1">
            {data.length}/2048 characters
          </p>
        </div>

        {/* Style */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2 block">
            Art style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all text-sm",
                  style === s.id
                    ? "border-brand bg-brand/10 text-white"
                    : "border-canvas-border text-white/50 hover:text-white hover:border-white/30"
                )}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px] font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2 block">
            Additional prompt {style !== "custom" && <span className="text-white/20">(optional)</span>}
          </label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              style === "custom"
                ? "Describe exactly what you want…"
                : "e.g. sunset colors, tropical theme…"
            }
          />
        </div>

        {/* Generate */}
        <Button
          onClick={generate}
          disabled={!data.trim() || loading}
          className="w-full"
          size="md"
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {loading ? "Generating (20–30s)…" : "Generate AI QR Code"}
        </Button>

        {error && (
          <p className="text-xs text-scan-bad bg-scan-bad/10 border border-scan-bad/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Tips */}
        <div className="rounded-xl border border-canvas-border bg-canvas-elevated p-4 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Tips</p>
          <ul className="text-[11px] text-white/40 space-y-1">
            <li>• QR codes use 30% error correction — artwork can cover ~30% of the code</li>
            <li>• Short URLs produce simpler QR patterns that blend better</li>
            <li>• High contrast styles (geometric, neon) are most reliable scanners</li>
            <li>• Always test scan before printing</li>
          </ul>
        </div>
      </div>

      {/* Right: Result */}
      <div className="flex flex-col gap-4">
        <div className="aspect-square rounded-2xl border border-canvas-border bg-canvas-elevated flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="text-center space-y-3 text-white/30">
              <RefreshCw size={32} className="animate-spin mx-auto" />
              <p className="text-sm">Generating your AI QR code…</p>
              <p className="text-xs">This takes 20–30 seconds</p>
            </div>
          ) : result ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.imageUrl}
              alt="AI-generated QR code"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center space-y-3 text-white/20">
              <div className="text-5xl">◻◼◻◼◻</div>
              <p className="text-sm">Your AI QR will appear here</p>
            </div>
          )}
        </div>

        {result && (
          <Button onClick={downloadImage} variant="outline" size="md" className="w-full">
            <Download size={14} />
            Download PNG
          </Button>
        )}

        {result && (
          <div className="rounded-xl border border-scan-good/20 bg-scan-good/5 px-4 py-3">
            <p className="text-[11px] text-scan-good font-medium">
              Always verify scannability before using in production.
              Use your phone camera to test this QR code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
