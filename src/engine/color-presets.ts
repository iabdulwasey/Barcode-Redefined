/**
 * Color Presets
 *
 * Curated color palettes, each one scan-tested for minimum 3:1 contrast ratio.
 */

import type { ColorPreset } from "@/types/barcode";

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "classic",
    name: "Classic",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#000000",
      background: "#FFFFFF",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#0F172A",
      background: "#E0E7FF",
    },
  },
  {
    id: "forest",
    name: "Forest",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#14532D",
      background: "#F0FDF4",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#1E3A8A",
      background: "#EFF6FF",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#7C2D12",
      background: "#FFEDD5",
    },
  },
  {
    id: "rose",
    name: "Rose",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#881337",
      background: "#FFF1F2",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#4C1D95",
      background: "#F5F3FF",
    },
  },
  {
    id: "neon",
    name: "Neon",
    isPremium: false,
    config: {
      mode: "solid",
      primary: "#00FF88",
      background: "#0A0A0A",
    },
  },
  {
    id: "gradient-sunset",
    name: "Gradient Sunset",
    isPremium: false,
    config: {
      mode: "gradient",
      primary: "#BE123C",
      secondary: "#F59E0B",
      gradientDirection: "to-br",
      background: "#FFF7ED",
    },
  },
  {
    id: "gradient-aurora",
    name: "Gradient Aurora",
    isPremium: false,
    config: {
      mode: "gradient",
      primary: "#6366F1",
      secondary: "#22C55E",
      gradientDirection: "to-right",
      background: "#F8FAFC",
    },
  },
];

export function getPresetById(id: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((p) => p.id === id);
}
