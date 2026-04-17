"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { COLOR_PRESETS } from "@/engine/color-presets";
import type { ColorConfig, GradientDirection } from "@/types/barcode";

interface ColorSystemProps {
  color: ColorConfig;
  onChange: (next: ColorConfig) => void;
}

export function ColorSystem({ color, onChange }: ColorSystemProps) {
  const isGradient = color.mode === "gradient";

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 rounded-md border border-canvas-border p-0.5">
        <button
          type="button"
          onClick={() => onChange({ ...color, mode: "solid" })}
          className={cn(
            "flex-1 text-[11px] font-medium py-1 rounded transition-colors",
            !isGradient ? "bg-canvas-elevated text-white" : "text-white/50 hover:text-white/80"
          )}
        >
          Solid
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...color,
              mode: "gradient",
              secondary: color.secondary ?? "#6366F1",
              gradientDirection: color.gradientDirection ?? "to-br",
            })
          }
          className={cn(
            "flex-1 text-[11px] font-medium py-1 rounded transition-colors",
            isGradient ? "bg-canvas-elevated text-white" : "text-white/50 hover:text-white/80"
          )}
        >
          Gradient
        </button>
      </div>

      {/* Color pickers */}
      <div className="space-y-2">
        <ColorField
          label="Primary"
          value={color.primary}
          onChange={(next) => onChange({ ...color, primary: next })}
        />
        {isGradient && (
          <ColorField
            label="Secondary"
            value={color.secondary ?? "#6366F1"}
            onChange={(next) => onChange({ ...color, secondary: next })}
          />
        )}
        <ColorField
          label="Background"
          value={color.background}
          onChange={(next) => onChange({ ...color, background: next })}
        />
      </div>

      {/* Gradient direction */}
      {isGradient && (
        <div className="flex items-center gap-1 rounded-md border border-canvas-border p-0.5">
          {(
            [
              { id: "to-right", label: "→" },
              { id: "to-bottom", label: "↓" },
              { id: "to-br", label: "↘" },
              { id: "radial", label: "◉" },
            ] as const
          ).map((dir) => (
            <button
              key={dir.id}
              type="button"
              onClick={() =>
                onChange({ ...color, gradientDirection: dir.id as GradientDirection })
              }
              className={cn(
                "flex-1 text-sm py-1 rounded transition-colors",
                color.gradientDirection === dir.id
                  ? "bg-canvas-elevated text-white"
                  : "text-white/50 hover:text-white/80"
              )}
              aria-label={`Gradient direction ${dir.id}`}
            >
              {dir.label}
            </button>
          ))}
        </div>
      )}

      {/* Presets */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">
          Presets
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.config)}
              title={preset.name}
              className="h-8 rounded-md border border-canvas-border overflow-hidden hover:border-white/40 transition-colors relative group"
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    preset.config.mode === "gradient" && preset.config.secondary
                      ? preset.config.gradientDirection === "radial"
                        ? `radial-gradient(circle, ${preset.config.primary}, ${preset.config.secondary})`
                        : `linear-gradient(${preset.config.gradientDirection === "to-right" ? "90deg" : preset.config.gradientDirection === "to-br" ? "135deg" : "180deg"}, ${preset.config.primary}, ${preset.config.secondary})`
                      : preset.config.primary,
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{ backgroundColor: preset.config.background }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40 w-16 shrink-0">
        {label}
      </span>
      <label
        className="h-7 w-7 shrink-0 rounded border border-canvas-border cursor-pointer overflow-hidden relative"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={`${label} color`}
        />
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 text-xs font-mono uppercase flex-1"
        maxLength={7}
      />
    </div>
  );
}
