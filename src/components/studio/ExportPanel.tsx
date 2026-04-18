"use client";

import { useState } from "react";
import { Copy, Download, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExportPanelProps {
  svg: string;
  disabled: boolean;
  filenameHint: string;
}

type PngSize = "sm" | "md" | "lg";
const PNG_SIZES: Record<PngSize, number> = { sm: 200, md: 400, lg: 800 };

export function ExportPanel({ svg, disabled, filenameHint }: ExportPanelProps) {
  const [pngSize, setPngSize] = useState<PngSize>("md");
  const [copied, setCopied] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

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
      const pngBlob = await rasterizeSvgToPng(svg, PNG_SIZES[pngSize]);
      const url = URL.createObjectURL(pngBlob);
      triggerDownload(url, `${filenameHint}.png`);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PNG export failed", err);
    }
  };

  const downloadPdf = async () => {
    if (!svg || exportingPdf) return;
    setExportingPdf(true);
    try {
      const res = await fetch("/api/v1/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          svg,
          widthMm: 50,
          dpi: 300,
          filename: filenameHint,
          title: filenameHint,
        }),
      });
      if (!res.ok) throw new Error("PDF export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${filenameHint}.pdf`);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setExportingPdf(false);
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
      {/* PNG size selector */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">
          PNG size
        </p>
        <div className="flex items-center gap-1 rounded-md border border-canvas-border p-0.5">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPngSize(s)}
              className={cn(
                "flex-1 text-[11px] font-medium py-1 rounded transition-colors",
                pngSize === s
                  ? "bg-canvas-elevated text-white"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              {PNG_SIZES[s]}px
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
          Download PNG ({PNG_SIZES[pngSize]}px)
        </Button>

        <Button
          onClick={downloadPdf}
          disabled={disabled || exportingPdf}
          variant="outline"
          size="md"
          className="w-full"
        >
          <FileText size={14} />
          {exportingPdf ? "Generating PDF…" : "Download PDF (300 DPI)"}
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

function rasterizeSvgToPng(svg: string, width: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const vbMatch = svg.match(/viewBox="([^"]+)"/);
    let aspectRatio = 4 / 3;
    if (vbMatch) {
      const parts = vbMatch[1]!.split(/\s+/).map(Number);
      const w = parts[2] ?? 400;
      const h = parts[3] ?? 300;
      if (h > 0) aspectRatio = w / h;
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
