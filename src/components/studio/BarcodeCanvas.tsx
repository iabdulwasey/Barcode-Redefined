"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BarcodeCanvasProps {
  svg: string;
  isGenerating: boolean;
  error: string | null;
}

export function BarcodeCanvas({ svg, isGenerating, error }: BarcodeCanvasProps) {
  const [bg, setBg] = useState<"white" | "checker" | "dark">("white");

  const bgClass =
    bg === "white"
      ? "bg-white"
      : bg === "dark"
        ? "bg-canvas-surface"
        : "bg-checkerboard";

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-3">
      <div
        className={cn(
          "w-full aspect-[4/3] rounded-xl border border-canvas-border overflow-hidden",
          "flex items-center justify-center relative transition-colors",
          bgClass
        )}
        role="img"
        aria-label="Barcode preview"
      >
        {error ? (
          <div className="text-center px-6">
            <p className="text-scan-bad text-sm font-medium mb-1">Cannot generate</p>
            <p className="text-white/40 text-xs">{error}</p>
          </div>
        ) : svg ? (
          <div
            className="w-[85%] max-h-[85%] [&>svg]:w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <div className="text-4xl font-mono tracking-wider">▐▌▐▐▌▌▐▌</div>
            <p className="text-xs">Enter data to generate</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-brand animate-scan-pulse" />
        )}
      </div>

      {/* Background toggle */}
      <div className="flex items-center gap-1 rounded-md border border-canvas-border p-0.5">
        {(["white", "checker", "dark"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setBg(option)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium rounded transition-colors capitalize",
              bg === option ? "bg-canvas-elevated text-white" : "text-white/50 hover:text-white/80"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <style jsx>{`
        .bg-checkerboard {
          background-image:
            linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
            linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
            linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
          background-color: #1c1c1c;
        }
      `}</style>
    </div>
  );
}
