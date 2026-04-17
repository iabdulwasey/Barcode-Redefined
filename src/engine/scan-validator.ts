/**
 * Scan Validator (Phase 1: heuristic-based)
 *
 * Estimates scan confidence without running a full ZXing decode.
 * Phase 2 will replace this with real ZXing WASM decoding.
 *
 * Factors considered:
 * - Color contrast (WCAG ratio between primary and background)
 * - Barcode type (2D codes with error correction are more forgiving)
 * - Gradient presence (gradients reduce scanner reliability)
 * - Shape complexity (complex shapes can interfere with bars)
 */

import { contrastRatio } from "@/lib/utils";
import { is1D } from "@/types/barcode";
import type { BarcodeType, ColorConfig, ScanWarning } from "@/types/barcode";
import type { Shape } from "@/types/shapes";

export interface ScanAssessment {
  confidence: number; // 0-100
  contrastRatio: number;
  warnings: ScanWarning[];
  level: "good" | "warn" | "bad";
}

export function assessScanability(input: {
  type: BarcodeType;
  color: ColorConfig;
  shape?: Shape;
  dataValid: boolean;
}): ScanAssessment {
  const warnings: ScanWarning[] = [];

  if (!input.dataValid) {
    return {
      confidence: 0,
      contrastRatio: 0,
      level: "bad",
      warnings: [
        {
          code: "DECODE_FAILED",
          message: "Invalid barcode data — cannot decode.",
          severity: "error",
        },
      ],
    };
  }

  // Effective "dark color" for contrast check — use primary for solid,
  // or the darker of the gradient stops for gradient mode
  const effectiveDark =
    input.color.mode === "gradient" && input.color.secondary
      ? darkerOf(input.color.primary, input.color.secondary)
      : input.color.primary;

  const ratio = contrastRatio(effectiveDark, input.color.background);

  let confidence = 100;

  // Contrast penalties (WCAG-inspired thresholds adapted for barcode scanning)
  if (ratio < 2.0) {
    confidence -= 60;
    warnings.push({
      code: "LOW_CONTRAST",
      message: `Contrast ratio ${ratio.toFixed(1)}:1 is too low. Scanners need at least 3:1.`,
      severity: "error",
    });
  } else if (ratio < 3.0) {
    confidence -= 30;
    warnings.push({
      code: "LOW_CONTRAST",
      message: `Contrast ratio ${ratio.toFixed(1)}:1 is marginal. Recommend 4.5:1 or higher for reliability.`,
      severity: "warning",
    });
  } else if (ratio < 4.5) {
    confidence -= 10;
    warnings.push({
      code: "LOW_CONTRAST",
      message: `Contrast ratio ${ratio.toFixed(1)}:1 works but could be stronger.`,
      severity: "info",
    });
  }

  // Gradient penalty — scanners prefer solid colors
  if (input.color.mode === "gradient") {
    confidence -= 5;
    warnings.push({
      code: "GRADIENT_MAY_AFFECT_SCAN",
      message: "Gradients slightly reduce scan reliability on cheaper scanners.",
      severity: "info",
    });
  }

  // 2D codes with artistic masks have error correction to fall back on
  // 1D codes rely entirely on the protected zone — well-maintained by engine
  if (!is1D(input.type) && input.shape) {
    // For 2D + art, assume H-level error correction handles up to 30% loss
    // We don't penalize here but we'd warn if the shape covers > 50% of modules
  }

  // Clamp and bucketize
  confidence = Math.max(0, Math.min(100, confidence));
  const level: ScanAssessment["level"] =
    confidence >= 75 ? "good" : confidence >= 45 ? "warn" : "bad";

  return {
    confidence,
    contrastRatio: ratio,
    warnings,
    level,
  };
}

function darkerOf(a: string, b: string): string {
  // Rough: return whichever has lower luminance approximation
  const lumA = roughLuminance(a);
  const lumB = roughLuminance(b);
  return lumA < lumB ? a : b;
}

function roughLuminance(hex: string): number {
  const cleaned = hex.replace("#", "");
  const norm =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const r = parseInt(norm.substring(0, 2), 16);
  const g = parseInt(norm.substring(2, 4), 16);
  const b = parseInt(norm.substring(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
