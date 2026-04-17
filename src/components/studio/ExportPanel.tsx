"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExportPanelProps {
  svg: string;
  disabled: boolean;
  filenameHint: string;
}

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = { sm: 200, md: 400, lg: 800 };

export function ExportPanel({ svg, disabled, filenameHint }: ExportPanelProps) {
  const [size, setSize] = useState<Size>("md");
  const [copied, setCopied] = useState(false);

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${filenameHint}.svg`);
    URL.revokeObjectURL(url);
  };

  const downloadPng = async () => {
    if (!svg) return;
    try {
      const pngBlob = await rasterizeSvgToPng(svg, SIZE_PX[size]);
      const url = URL.createObjectURL(pngBlob);
      triggerDownload(url, `${filenameHint}.png`);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PNG export failed", err);
    }
  };

  const copySvg = async () => {
    if (!svg) return;
    try {
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable — silently ignore
    }
  };

  return (
    <div className="space-y-3">
      {/* Size selector */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">
          PNG size
        </p>
        <div className="flex items-center gap-1 rounded-md border border-canvas-border p-0.5">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "flex-1 text-[11px] font-medium py-1 rounded transition-colors",
                size === s
                  ? "bg-canvas-elevated text-white"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              {SIZE_PX[s]}px
            </button>
          ))}
        </div>
      </div>

      {/* Download buttons */}
      <div className="space-y-2">
        <Button
          onClick={downloadSvg}
          disabled={disabled}
          size="md"
          className="w-full"
        >
          <Download size={14} />
          Download SVG
        </Button>

        <Button
          onClick={downloadPng}
          disabled={disabled}
          variant="outline"
          size="md"
          className="w-full"
        >
          <Download size={14} />
          Download PNG
        </Button>

        <Button
          onClick={copySvg}
          disabled={disabled}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy SVG code"}
        </Button>
      </div>
    </div>
  );
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Rasterize an SVG string to a PNG Blob via a canvas.
 * Client-side, no server roundtrip — works for any size.
 */
function rasterizeSvgToPng(svg: string, width: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Parse viewBox to get aspect ratio for height
    const vbMatch = svg.match(/viewBox="([^"]+)"/);
    let aspectRatio = 4 / 3;
    if (vbMatch) {
      const parts = vbMatch[1]!.split(/\s+/).map(Number);
      const w = parts[2] ?? 400;
      const h = parts[3] ?? 300;
      aspectRatio = w / h;
    }
    const height = Math.round(width / aspectRatio);

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((pngBlob) => {
        URL.revokeObjectURL(url);
        if (pngBlob) resolve(pngBlob);
        else reject(new Error("PNG encoding failed"));
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG failed to load"));
    };
    img.src = url;
  });
}
