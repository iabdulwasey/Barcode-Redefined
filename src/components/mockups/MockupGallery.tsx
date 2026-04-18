"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MockupTemplate {
  id: string;
  name: string;
  description: string;
  // CSS background for the product area
  productStyle: React.CSSProperties;
  // Where barcode sits: top/left/width/height as % of container
  barcodeRegion: { top: number; left: number; width: number; height: number };
  // Label color for barcode area
  labelStyle: React.CSSProperties;
}

const TEMPLATES: MockupTemplate[] = [
  {
    id: "kraft-box",
    name: "Kraft Box",
    description: "Brown cardboard packaging",
    productStyle: { background: "linear-gradient(135deg, #c8a97a 0%, #a07040 50%, #c8a97a 100%)" },
    barcodeRegion: { top: 55, left: 15, width: 70, height: 35 },
    labelStyle: { backgroundColor: "#fffdf7" },
  },
  {
    id: "white-box",
    name: "White Box",
    description: "Clean white retail packaging",
    productStyle: { background: "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 50%, #f8f8f8 100%)" },
    barcodeRegion: { top: 55, left: 15, width: 70, height: 35 },
    labelStyle: { backgroundColor: "#ffffff" },
  },
  {
    id: "glass-bottle",
    name: "Glass Bottle",
    description: "Wine or skincare bottle",
    productStyle: {
      background: "linear-gradient(90deg, rgba(180,210,180,0.3) 0%, rgba(140,180,140,0.8) 40%, rgba(100,150,100,1) 50%, rgba(140,180,140,0.8) 60%, rgba(180,210,180,0.3) 100%)",
      borderRadius: "40% 40% 30% 30% / 5% 5% 10% 10%",
    },
    barcodeRegion: { top: 50, left: 20, width: 60, height: 30 },
    labelStyle: { backgroundColor: "#fffdf5", borderRadius: "4px" },
  },
  {
    id: "aluminum-can",
    name: "Aluminum Can",
    description: "Beverage or energy drink can",
    productStyle: {
      background: "linear-gradient(90deg, #b0b8c0 0%, #e8eef2 30%, #f5f8fa 50%, #e8eef2 70%, #b0b8c0 100%)",
      borderRadius: "10px 10px 20px 20px",
    },
    barcodeRegion: { top: 30, left: 15, width: 70, height: 40 },
    labelStyle: { backgroundColor: "rgba(255,255,255,0.9)" },
  },
  {
    id: "paper-bag",
    name: "Paper Bag",
    description: "Coffee or takeaway bag",
    productStyle: {
      background: "linear-gradient(180deg, #d4b896 0%, #c4a47a 40%, #b89060 100%)",
      borderRadius: "4px 4px 12px 12px",
    },
    barcodeRegion: { top: 60, left: 20, width: 60, height: 28 },
    labelStyle: { backgroundColor: "#fffef9" },
  },
  {
    id: "label-sticker",
    name: "Label / Sticker",
    description: "Flat product label sheet",
    productStyle: {
      background: "#f0f0f0",
      border: "1px dashed #ccc",
      borderRadius: "4px",
    },
    barcodeRegion: { top: 20, left: 10, width: 80, height: 60 },
    labelStyle: { backgroundColor: "#ffffff", borderRadius: "4px" },
  },
];

export function MockupGallery() {
  const [svgInput, setSvgInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("kraft-box");
  const [svgUrl, setSvgUrl] = useState<string | null>(null);

  const handleSvgChange = (text: string) => {
    setSvgInput(text);
    if (svgUrl) {
      URL.revokeObjectURL(svgUrl);
      setSvgUrl(null);
    }
    if (text.trim().startsWith("<svg")) {
      const blob = new Blob([text], { type: "image/svg+xml" });
      setSvgUrl(URL.createObjectURL(blob));
    }
  };

  const downloadMockup = async (template: MockupTemplate) => {
    const el = document.getElementById(`mockup-${template.id}`);
    if (!el) return;
    // Simple: screenshot via canvas — prompt user to use browser screenshot
    alert("Tip: Use your browser's screenshot tool (or Cmd+Shift+4 on Mac) to capture the mockup preview.");
  };

  return (
    <div className="space-y-8">
      {/* SVG Input */}
      <div className="rounded-xl border border-canvas-border bg-canvas-elevated p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
          Paste your barcode SVG
        </p>
        <div className="flex gap-3">
          <textarea
            value={svgInput}
            onChange={(e) => handleSvgChange(e.target.value)}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">…</svg>'
            rows={3}
            className={cn(
              "flex-1 rounded-lg border border-canvas-border bg-canvas-surface",
              "text-xs font-mono text-white/70 placeholder:text-white/20",
              "px-3 py-2 resize-none outline-none focus:border-brand transition-colors"
            )}
          />
          <div className="flex flex-col gap-2 text-xs text-white/40">
            <p>→</p>
            <p className="text-[10px]">Generate in Studio,<br />copy SVG, paste here</p>
          </div>
        </div>
        {!svgInput && (
          <p className="text-[11px] text-white/30 mt-2">
            Go to <a href="/studio" className="text-brand-hover hover:underline">Studio</a> → generate a barcode → click &ldquo;Copy SVG code&rdquo;
          </p>
        )}
      </div>

      {/* Template selector */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
          Choose template
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t.id)}
              className={cn(
                "rounded-lg border p-2 text-center transition-all",
                selectedTemplate === t.id
                  ? "border-brand bg-brand/10"
                  : "border-canvas-border hover:border-white/30 bg-canvas-elevated"
              )}
            >
              <div
                className="h-8 rounded mb-1 mx-auto w-8"
                style={t.productStyle}
              />
              <p className="text-[10px] font-medium text-white/60 leading-tight">{t.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mockup previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.filter((t) => !selectedTemplate || t.id === selectedTemplate || true).map(
          (template) => (
            <div
              key={template.id}
              id={`mockup-${template.id}`}
              className={cn(
                "rounded-2xl border overflow-hidden transition-all",
                selectedTemplate === template.id
                  ? "border-brand ring-1 ring-brand/30"
                  : "border-canvas-border opacity-60 hover:opacity-80"
              )}
            >
              {/* Mockup canvas */}
              <div className="aspect-square bg-canvas-bg flex items-center justify-center p-8 relative">
                {/* Product silhouette */}
                <div
                  className="w-48 h-64 relative flex items-center justify-center"
                  style={template.productStyle}
                >
                  {/* Barcode label area */}
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      top: `${template.barcodeRegion.top}%`,
                      left: `${template.barcodeRegion.left}%`,
                      width: `${template.barcodeRegion.width}%`,
                      height: `${template.barcodeRegion.height}%`,
                      ...template.labelStyle,
                    }}
                  >
                    {svgUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={svgUrl}
                        alt="Barcode on product"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center opacity-20">
                          <div className="text-lg font-mono tracking-wider">▐▌▐▐▌</div>
                          <p className="text-[8px] mt-0.5">your barcode</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="px-4 py-3 border-t border-canvas-border bg-canvas-elevated flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-white/40">{template.description}</p>
                </div>
                <Button
                  onClick={() => downloadMockup(template)}
                  variant="ghost"
                  size="sm"
                  disabled={!svgInput}
                >
                  <Download size={12} />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
