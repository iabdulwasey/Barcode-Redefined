/**
 * 1D Barcode Engine
 *
 * Browser-native JsBarcode wrapper. Renders to a detached SVG element,
 * extracts the raw bar data, and returns it for composition by svg-composer.
 *
 * All functions here assume a DOM environment (JsBarcode uses browser APIs).
 * Server-side rendering uses the same API via a DOM polyfill (jsdom) in API routes.
 */

import type { BarcodeType1D } from "@/types/barcode";

// JsBarcode format name mapping
const TYPE_TO_JSBARCODE_FORMAT: Record<BarcodeType1D, string> = {
  "EAN-13": "EAN13",
  "EAN-8": "EAN8",
  "UPC-A": "UPC",
  "UPC-E": "UPCE",
  "CODE-128": "CODE128",
  "CODE-39": "CODE39",
  "CODE-93": "CODE93",
  "ITF-14": "ITF14",
  "GS1-128": "CODE128",
  CODABAR: "codabar",
  MSI: "MSI",
  ISBN: "EAN13",
  ISSN: "EAN13",
  PHARMACODE: "pharmacode",
};

// ─── Data Validation ──────────────────────────────────────────────────────────

export class BarcodeValidationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "BarcodeValidationError";
  }
}

export function validate1DData(data: string, type: BarcodeType1D): void {
  const trimmed = data.trim();

  if (!trimmed) {
    throw new BarcodeValidationError("Barcode data cannot be empty.", "EMPTY_DATA");
  }

  switch (type) {
    case "EAN-13":
    case "ISBN":
    case "ISSN": {
      if (!/^\d{12,13}$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "Requires exactly 12 or 13 digits.",
          "INVALID_LENGTH"
        );
      }
      break;
    }
    case "EAN-8": {
      if (!/^\d{7,8}$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "Requires exactly 7 or 8 digits.",
          "INVALID_LENGTH"
        );
      }
      break;
    }
    case "UPC-A": {
      if (!/^\d{11,12}$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "Requires exactly 11 or 12 digits.",
          "INVALID_LENGTH"
        );
      }
      break;
    }
    case "UPC-E": {
      if (!/^\d{6,8}$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "UPC-E requires 6-8 digits.",
          "INVALID_LENGTH"
        );
      }
      break;
    }
    case "ITF-14": {
      if (!/^\d{13,14}$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "ITF-14 requires exactly 13 or 14 digits.",
          "INVALID_LENGTH"
        );
      }
      break;
    }
    case "PHARMACODE": {
      const num = parseInt(trimmed, 10);
      if (isNaN(num) || num < 3 || num > 131070) {
        throw new BarcodeValidationError(
          "Pharmacode requires a number between 3 and 131070.",
          "OUT_OF_RANGE"
        );
      }
      break;
    }
    case "CODE-39": {
      if (!/^[A-Z0-9\-. $/+%*]+$/.test(trimmed.toUpperCase())) {
        throw new BarcodeValidationError(
          "Code 39 supports: A-Z, 0-9, and - . $ / + % * space",
          "INVALID_CHARS"
        );
      }
      break;
    }
    case "CODABAR": {
      if (!/^[A-Da-d][0-9\-$:/.+]*[A-Da-d]$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "Codabar must start/end with A-D and contain 0-9, -, $, :, /, ., + in between.",
          "INVALID_FORMAT"
        );
      }
      break;
    }
    case "MSI": {
      if (!/^\d+$/.test(trimmed)) {
        throw new BarcodeValidationError(
          "MSI Plessey accepts digits only.",
          "INVALID_CHARS"
        );
      }
      break;
    }
    // CODE-128, CODE-93, GS1-128 accept any ASCII — no additional validation
  }
}

// ─── Check Digit ──────────────────────────────────────────────────────────────

export function calculateCheckDigit(
  digits: string,
  type: "EAN-13" | "EAN-8" | "UPC-A"
): number {
  const nums = digits.split("").map(Number);
  const weights =
    type === "EAN-8"
      ? [3, 1, 3, 1, 3, 1, 3]
      : [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];

  const sum = nums
    .slice(0, weights.length)
    .reduce((acc, digit, i) => acc + digit * (weights[i] ?? 1), 0);

  return (10 - (sum % 10)) % 10;
}

// ─── Bar Extraction ───────────────────────────────────────────────────────────

export interface BarRect {
  x: number;
  width: number;
  height: number;
  y: number;
}

export interface BarcodeRenderData {
  bars: BarRect[];
  width: number;
  height: number;
  displayText: string;
  type: BarcodeType1D;
  rawSvg: string;
}

/**
 * Render a 1D barcode using JsBarcode and extract the raw bar geometry.
 *
 * Browser-only. Uses a detached SVG element, so it does NOT mount anything
 * in the DOM. Safe to call inside useEffect with a debounce.
 */
export async function render1DBarcode(
  data: string,
  type: BarcodeType1D,
  options: {
    barWidth?: number;
    height?: number;
    margin?: number;
    displayValue?: boolean;
    fontSize?: number;
  } = {}
): Promise<BarcodeRenderData> {
  if (typeof document === "undefined") {
    throw new Error("render1DBarcode is browser-only. Use renderBarcodeToString for SSR.");
  }

  validate1DData(data, type);

  const JsBarcode = (await import("jsbarcode")).default;

  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  JsBarcode(svgEl, data.trim(), {
    format: TYPE_TO_JSBARCODE_FORMAT[type],
    lineColor: "#000000",
    background: "#FFFFFF",
    width: options.barWidth ?? 2,
    height: options.height ?? 100,
    fontSize: options.fontSize ?? 14,
    displayValue: options.displayValue ?? false,
    margin: options.margin ?? 10,
    valid: () => true,
  });

  const rects = Array.from(svgEl.querySelectorAll("rect"));
  const bars: BarRect[] = [];

  for (const rect of rects) {
    const fill = rect.getAttribute("fill");
    // Skip the background rect (typically has no x/y or full width)
    if (fill === "#FFFFFF" || fill === "#ffffff" || fill === "white") continue;

    const x = parseFloat(rect.getAttribute("x") ?? "0");
    const y = parseFloat(rect.getAttribute("y") ?? "0");
    const width = parseFloat(rect.getAttribute("width") ?? "0");
    const height = parseFloat(rect.getAttribute("height") ?? "0");

    if (width > 0 && height > 0) {
      bars.push({ x, y, width, height });
    }
  }

  const svgWidth = parseFloat(svgEl.getAttribute("width") ?? "200");
  const svgHeight = parseFloat(svgEl.getAttribute("height") ?? "100");

  return {
    bars,
    width: svgWidth,
    height: svgHeight,
    displayText: data.trim(),
    type,
    rawSvg: new XMLSerializer().serializeToString(svgEl),
  };
}
