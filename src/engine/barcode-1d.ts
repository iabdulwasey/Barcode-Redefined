/**
 * 1D Barcode Engine
 *
 * Wraps JsBarcode to generate SVG, then post-processes the output
 * to extract individual bar data for shape masking.
 */

import type { BarcodeType1D, ColorConfig } from "@/types/barcode";

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
  "GS1-128": "GS1128",
  CODABAR: "codabar",
  MSI: "MSI",
  ISBN: "EAN13",  // ISBN renders as EAN-13
  ISSN: "EAN13",  // ISSN renders as EAN-13 with addon
  PHARMACODE: "pharmacode",
};

export interface Bar {
  x: number;
  y: number;
  width: number;
  height: number;
  isBar: boolean; // true = bar (dark), false = space (light)
}

export interface Barcode1DData {
  bars: Bar[];
  totalWidth: number;
  totalHeight: number;
  text: string;
  type: BarcodeType1D;
  quietZoneWidth: number;
}

/**
 * Validates that the given data is a valid value for the barcode type.
 * Throws a descriptive error if invalid.
 */
export function validate1DData(data: string, type: BarcodeType1D): void {
  const trimmed = data.trim();

  if (!trimmed) {
    throw new Error("Barcode data cannot be empty.");
  }

  switch (type) {
    case "EAN-13":
    case "ISBN": {
      if (!/^\d{12,13}$/.test(trimmed)) {
        throw new Error("EAN-13/ISBN requires exactly 12 or 13 digits.");
      }
      break;
    }
    case "EAN-8": {
      if (!/^\d{7,8}$/.test(trimmed)) {
        throw new Error("EAN-8 requires exactly 7 or 8 digits.");
      }
      break;
    }
    case "UPC-A": {
      if (!/^\d{11,12}$/.test(trimmed)) {
        throw new Error("UPC-A requires exactly 11 or 12 digits.");
      }
      break;
    }
    case "UPC-E": {
      if (!/^\d{6,8}$/.test(trimmed)) {
        throw new Error("UPC-E requires 6-8 digits.");
      }
      break;
    }
    case "ITF-14": {
      if (!/^\d{13,14}$/.test(trimmed)) {
        throw new Error("ITF-14 requires exactly 13 or 14 digits.");
      }
      break;
    }
    case "PHARMACODE": {
      const num = parseInt(trimmed, 10);
      if (isNaN(num) || num < 3 || num > 131070) {
        throw new Error("Pharmacode requires a number between 3 and 131070.");
      }
      break;
    }
    case "CODE-39": {
      if (!/^[A-Z0-9\-. $/+%*]+$/.test(trimmed.toUpperCase())) {
        throw new Error(
          "Code 39 supports: A-Z, 0-9, and - . $ / + % * space"
        );
      }
      break;
    }
    // CODE-128 and CODE-93 accept any ASCII — no specific validation needed
    // CODABAR, MSI, GS1-128, ISSN — basic checks
    case "CODABAR": {
      if (!/^[A-Da-d][0-9\-$:/.+]*[A-Da-d]$/.test(trimmed)) {
        throw new Error(
          "Codabar must start and end with A-D and contain 0-9, -, $, :, /, ., + in between."
        );
      }
      break;
    }
    case "MSI": {
      if (!/^\d+$/.test(trimmed)) {
        throw new Error("MSI Plessey accepts digits only.");
      }
      break;
    }
  }
}

/**
 * Generate a raw SVG string for a 1D barcode using JsBarcode.
 * This is a server-safe function — JsBarcode supports Node via xmldom.
 */
export async function generate1DSVG(
  data: string,
  type: BarcodeType1D,
  color: ColorConfig,
  options: {
    width?: number;
    height?: number;
    fontSize?: number;
    displayValue?: boolean;
    margin?: number;
  } = {}
): Promise<string> {
  validate1DData(data, type);

  // Dynamic import — JsBarcode uses DOM APIs, ensure server compat
  const JsBarcode = (await import("jsbarcode")).default;
  const { DOMImplementation, XMLSerializer } = await import("xmldom");

  const xmlDoc = new DOMImplementation().createDocument(null, "svg", null);
  const svgNode = xmlDoc.documentElement;

  JsBarcode(svgNode, data.trim(), {
    format: TYPE_TO_JSBARCODE_FORMAT[type],
    lineColor: color.primary,
    background: color.background,
    width: options.width ? Math.round(options.width / 100) : 2,
    height: options.height ?? 100,
    fontSize: options.fontSize ?? 14,
    displayValue: options.displayValue ?? true,
    margin: options.margin ?? 10,
    valid: () => true,
  });

  return new XMLSerializer().serializeToString(svgNode);
}

/**
 * Calculate the GS1 check digit for EAN/UPC barcodes.
 */
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
