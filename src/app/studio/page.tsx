/**
 * Studio Page — Main Workspace
 *
 * The primary generator interface. Three-panel layout:
 * Left: Input (type selector + data entry)
 * Center: Live preview canvas
 * Right: Style (shape + color + export)
 *
 * Client-heavy: rendering happens in-browser via useBarcodeState.
 */

import type { Metadata } from "next";
import { StudioWorkspace } from "@/components/studio/StudioWorkspace";

export const metadata: Metadata = {
  title: "Studio",
  description: "Create your artistic barcode or QR code.",
};

export default function StudioPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-canvas-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">SCANVAS</span>
          <span className="text-xs text-white/30 font-mono">STUDIO</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <a href="/studio" className="text-white font-medium">Studio</a>
          <a href="/shapes" className="hover:text-white transition-colors">Shapes</a>
          <a href="/batch" className="hover:text-white transition-colors">Batch</a>
          <a href="/mockups" className="hover:text-white transition-colors">Mockups</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="text-sm px-4 py-1.5 rounded-md border border-canvas-border text-white/60 hover:text-white hover:border-white/30 transition-colors">
            Sign In
          </button>
          <button className="text-sm px-4 py-1.5 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors">
            Get Pro
          </button>
        </div>
      </header>

      <StudioWorkspace />
    </div>
  );
}
