"use client";

import { useState } from "react";
import { Sparkles, X, RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerTransientShape } from "@/engine/shapes";
import type { AIShapeResponse } from "@/types/shapes";

type Style = "minimal" | "detailed" | "geometric" | "organic";

const STYLE_LABELS: Record<Style, string> = {
  minimal: "Minimal",
  detailed: "Detailed",
  geometric: "Geometric",
  organic: "Organic",
};

const STYLE_DESCRIPTIONS: Record<Style, string> = {
  minimal: "Simple, few points",
  detailed: "Organic curves",
  geometric: "Straight lines",
  organic: "Smooth beziers",
};

interface AIShapePromptProps {
  onAccept: (shapeId: string) => void;
  onClose: () => void;
}

export function AIShapePrompt({ onAccept, onClose }: AIShapePromptProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<Style>("minimal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIShapeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/v1/shapes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style }),
      });
      const json = await res.json() as { data?: AIShapeResponse; error?: string };
      if (!res.ok || !json.data) throw new Error(json.error ?? "Generation failed");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const accept = () => {
    if (!result) return;
    const id = `ai-${Date.now()}`;
    registerTransientShape({
      id,
      name: prompt.trim().slice(0, 40),
      category: "ai-generated",
      tags: ["ai", "generated"],
      svgPath: result.svgPath,
      viewBox: result.viewBox,
      recommendedTypes: ["EAN-13", "EAN-8", "CODE-128", "QR"],
      isCustom: true,
      isPremium: false,
      artZoneRatio: 0.8,
    });
    onAccept(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-canvas-surface border border-canvas-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-canvas-border">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand" />
            <span className="text-sm font-semibold">AI Shape Generator</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Prompt */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
              Describe your shape
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. a howling wolf, a coffee cup, a lightning bolt"
              onKeyDown={(e) => e.key === "Enter" && generate()}
              autoFocus
            />
          </div>

          {/* Style */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
              Style
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(["minimal", "detailed", "geometric", "organic"] as Style[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-left transition-colors",
                    style === s
                      ? "border-brand bg-brand/10 text-white"
                      : "border-canvas-border text-white/50 hover:text-white hover:border-white/30"
                  )}
                >
                  <p className="text-[11px] font-semibold">{STYLE_LABELS[s]}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{STYLE_DESCRIPTIONS[s]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {result && (
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                Preview
              </p>
              <div className="aspect-[4/3] bg-canvas-elevated rounded-lg flex items-center justify-center p-4">
                <svg viewBox={result.viewBox} className="w-full h-full" aria-hidden>
                  <path d={result.svgPath} fill="currentColor" className="text-brand" />
                </svg>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-scan-bad bg-scan-bad/10 border border-scan-bad/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {!result ? (
              <Button
                onClick={generate}
                disabled={!prompt.trim() || loading}
                className="flex-1"
                size="md"
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {loading ? "Generating…" : "Generate"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={generate}
                  disabled={loading}
                  variant="outline"
                  size="md"
                  className="flex-1"
                >
                  <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                  Regenerate
                </Button>
                <Button onClick={accept} size="md" className="flex-1">
                  <Check size={14} />
                  Use Shape
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
