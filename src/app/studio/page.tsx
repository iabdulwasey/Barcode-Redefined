/**
 * Studio Page — Main Workspace
 *
 * The primary generator interface. Three-panel layout:
 * Left: Input (type selector + data entry)
 * Center: Live preview canvas
 * Right: Style (shape + color + export)
 *
 * This is a client-heavy page — the entire preview renders in-browser.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "Create your artistic barcode or QR code.",
};

export default function StudioPage() {
  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
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

      {/* Studio workspace — three column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Input */}
        <aside className="w-72 border-r border-canvas-border bg-canvas-surface p-4 overflow-y-auto shrink-0">
          <div className="space-y-6">
            {/* Barcode Type Selector */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Code Type
              </h2>
              {/* TypeSelector component goes here — Phase 1 */}
              <div className="h-32 rounded-lg border border-canvas-border border-dashed flex items-center justify-center text-white/20 text-sm">
                TypeSelector Component
              </div>
            </section>

            {/* Data Input */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Barcode Data
              </h2>
              <div className="h-24 rounded-lg border border-canvas-border border-dashed flex items-center justify-center text-white/20 text-sm">
                DataInput Component
              </div>
            </section>

            {/* Format Options */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Options
              </h2>
              <div className="h-20 rounded-lg border border-canvas-border border-dashed flex items-center justify-center text-white/20 text-sm">
                FormatOptions Component
              </div>
            </section>
          </div>
        </aside>

        {/* Center: Preview canvas */}
        <main className="flex-1 flex flex-col items-center justify-center bg-canvas-bg p-8 gap-6">
          {/* Preview area */}
          <div className="w-full max-w-lg aspect-[4/3] rounded-xl border border-canvas-border bg-canvas-surface flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-5xl opacity-20">▐▌▐▐▌▌▐▌</div>
              <p className="text-white/30 text-sm">
                Enter barcode data to see your design
              </p>
            </div>
          </div>

          {/* Scan confidence meter */}
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>Scan Confidence</span>
              <span className="text-white/60">— %</span>
            </div>
            <div className="h-1.5 rounded-full bg-canvas-border overflow-hidden">
              <div className="h-full w-0 scan-meter-good rounded-full transition-all duration-500" />
            </div>
          </div>
        </main>

        {/* Right panel: Style + Export */}
        <aside className="w-80 border-l border-canvas-border bg-canvas-surface p-4 overflow-y-auto shrink-0">
          <div className="space-y-6">
            {/* Shape Selector */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Shape
              </h2>
              <div className="h-48 rounded-lg border border-canvas-border border-dashed flex items-center justify-center text-white/20 text-sm">
                ShapeSelector Component
              </div>
            </section>

            {/* Color System */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Color
              </h2>
              <div className="h-36 rounded-lg border border-canvas-border border-dashed flex items-center justify-center text-white/20 text-sm">
                ColorSystem Component
              </div>
            </section>

            {/* Export */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Export
              </h2>
              <div className="h-28 rounded-lg border border-canvas-border border-dashed flex items-center justify-center text-white/20 text-sm">
                ExportPanel Component
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
