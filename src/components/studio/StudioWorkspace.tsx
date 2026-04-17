"use client";

import { useBarcodeState } from "@/hooks/useBarcodeState";
import { BarcodeCanvas } from "./BarcodeCanvas";
import { ColorSystem } from "./ColorSystem";
import { DataInput } from "./DataInput";
import { ExportPanel } from "./ExportPanel";
import { ScanMeter } from "./ScanMeter";
import { ShapeSelector } from "./ShapeSelector";
import { TypeSelector } from "./TypeSelector";
import { is1D } from "@/types/barcode";

export function StudioWorkspace() {
  const state = useBarcodeState();

  const filenameHint = `scanvas-${state.type.toLowerCase()}-${Date.now()}`;
  const canExport = !!state.svg && !state.error;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel: Input */}
      <aside className="w-72 border-r border-canvas-border bg-canvas-surface overflow-y-auto shrink-0">
        <div className="p-4 space-y-6">
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Code Type
            </h2>
            <TypeSelector value={state.type} onChange={state.setType} />
          </section>

          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Barcode Data
            </h2>
            <DataInput
              type={state.type}
              value={state.data}
              onChange={state.setData}
              error={state.error}
            />
          </section>

          {is1D(state.type) && (
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Options
              </h2>
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showDigits}
                  onChange={(e) => state.setShowDigits(e.target.checked)}
                  className="h-4 w-4 rounded border-canvas-border bg-canvas-elevated accent-brand"
                />
                Show digits below barcode
              </label>
            </section>
          )}
        </div>
      </aside>

      {/* Center: Preview canvas */}
      <main className="flex-1 flex flex-col items-center justify-center bg-canvas-bg p-8 gap-5 overflow-y-auto">
        <BarcodeCanvas
          svg={state.svg}
          isGenerating={state.isGenerating}
          error={state.error}
        />

        <div className="w-full max-w-xl">
          <ScanMeter assessment={state.scan} />
        </div>
      </main>

      {/* Right panel: Style + Export */}
      <aside className="w-80 border-l border-canvas-border bg-canvas-surface overflow-y-auto shrink-0">
        <div className="p-4 space-y-6">
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Shape
            </h2>
            <ShapeSelector selectedId={state.shapeId} onSelect={state.setShapeId} />
          </section>

          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Color
            </h2>
            <ColorSystem color={state.color} onChange={state.setColor} />
          </section>

          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Export
            </h2>
            <ExportPanel
              svg={state.svg}
              disabled={!canExport}
              filenameHint={filenameHint}
            />
          </section>
        </div>
      </aside>
    </div>
  );
}
