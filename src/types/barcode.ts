// ─── Barcode Types ────────────────────────────────────────────────────────────

export type BarcodeType1D =
  | "EAN-13"
  | "EAN-8"
  | "UPC-A"
  | "UPC-E"
  | "CODE-128"
  | "CODE-39"
  | "CODE-93"
  | "ITF-14"
  | "GS1-128"
  | "CODABAR"
  | "MSI"
  | "ISBN"
  | "ISSN"
  | "PHARMACODE";

export type BarcodeType2D =
  | "QR"
  | "DATA-MATRIX"
  | "PDF417"
  | "AZTEC";

export type BarcodeType = BarcodeType1D | BarcodeType2D;

export const BARCODE_TYPE_LABELS: Record<BarcodeType, string> = {
  "EAN-13": "EAN-13",
  "EAN-8": "EAN-8",
  "UPC-A": "UPC-A",
  "UPC-E": "UPC-E",
  "CODE-128": "Code 128",
  "CODE-39": "Code 39",
  "CODE-93": "Code 93",
  "ITF-14": "ITF-14",
  "GS1-128": "GS1-128",
  CODABAR: "Codabar",
  MSI: "MSI Plessey",
  ISBN: "ISBN",
  ISSN: "ISSN",
  PHARMACODE: "Pharmacode",
  QR: "QR Code",
  "DATA-MATRIX": "Data Matrix",
  PDF417: "PDF417",
  AZTEC: "Aztec Code",
};

export const BARCODE_TYPE_DESCRIPTIONS: Record<BarcodeType, string> = {
  "EAN-13": "13-digit retail product code. Global standard.",
  "EAN-8": "8-digit compact retail code for small packages.",
  "UPC-A": "12-digit North American retail standard.",
  "UPC-E": "6-digit compressed UPC for small packages.",
  "CODE-128": "High-density alphanumeric. Most versatile 1D.",
  "CODE-39": "Alphanumeric. Common in industrial/logistics.",
  "CODE-93": "Compact alphanumeric. Successor to Code 39.",
  "ITF-14": "14-digit shipping/carton code on corrugated.",
  "GS1-128": "GS1 application identifier barcode.",
  CODABAR: "Numeric. Used in blood banks and libraries.",
  MSI: "Numeric only. Used in warehouse management.",
  ISBN: "International Standard Book Number.",
  ISSN: "International Standard Serial Number.",
  PHARMACODE: "Pharmaceutical packaging code.",
  QR: "2D matrix code. Stores URLs, text, data.",
  "DATA-MATRIX": "2D matrix. Used in electronics, healthcare.",
  PDF417: "Stacked 2D. Used in IDs, shipping labels.",
  AZTEC: "2D matrix. Used in transport tickets.",
};

export const is1D = (type: BarcodeType): type is BarcodeType1D =>
  !["QR", "DATA-MATRIX", "PDF417", "AZTEC"].includes(type);

export const is2D = (type: BarcodeType): type is BarcodeType2D =>
  ["QR", "DATA-MATRIX", "PDF417", "AZTEC"].includes(type);

// ─── Color System ─────────────────────────────────────────────────────────────

export type ColorMode = "solid" | "gradient" | "pattern";
export type PatternType = "stripes" | "dots" | "crosshatch";
export type GradientDirection = "to-right" | "to-bottom" | "to-br" | "radial";

export interface ColorConfig {
  mode: ColorMode;
  primary: string;
  secondary?: string;
  gradientDirection?: GradientDirection;
  patternType?: PatternType;
  background: string;
  cmyk?: { c: number; m: number; y: number; k: number };
}

export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  mode: "solid",
  primary: "#000000",
  background: "#FFFFFF",
};

export interface ColorPreset {
  id: string;
  name: string;
  config: ColorConfig;
  isPremium: boolean;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportFormat = "svg" | "png" | "pdf" | "webp";

export interface ExportConfig {
  formats: ExportFormat[];
  width: number;
  height: number;
  dpi: number;
  transparent: boolean;
  includeQuietZone: boolean;
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  formats: ["svg"],
  width: 400,
  height: 300,
  dpi: 300,
  transparent: false,
  includeQuietZone: true,
};

// ─── Generation Request/Response ─────────────────────────────────────────────

export interface BarcodeGenerateRequest {
  data: string;
  type: BarcodeType;
  shapeId?: string;
  customSvgPath?: string;
  color: ColorConfig;
  export: ExportConfig;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"; // QR only
}

export interface BarcodeGenerateResponse {
  svg: string;
  scanConfidence: number; // 0-100
  warnings: string[];
  metadata: {
    type: BarcodeType;
    data: string;
    width: number;
    height: number;
    shapeName?: string;
  };
}

// ─── Scan Validation ──────────────────────────────────────────────────────────

export interface ScanValidationResult {
  decoded: boolean;
  decodedData?: string;
  confidence: number; // 0-100
  quietZoneOK: boolean;
  contrastRatio: number;
  minimumPrintSizeMm: { width: number; height: number };
  warnings: ScanWarning[];
}

export type ScanWarningCode =
  | "LOW_CONTRAST"
  | "QUIET_ZONE_TOO_SMALL"
  | "DECODE_FAILED"
  | "SIZE_TOO_SMALL"
  | "GRADIENT_MAY_AFFECT_SCAN";

export interface ScanWarning {
  code: ScanWarningCode;
  message: string;
  severity: "error" | "warning" | "info";
}
