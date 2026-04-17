/**
 * 2D Code Engine
 *
 * Generates QR codes as structured module data. The modules are returned
 * as a 2D array of booleans (true = dark), which svg-composer uses to
 * draw shape-masked rectangles.
 */

import type { BarcodeType2D } from "@/types/barcode";

export type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRRenderData {
  modules: boolean[][]; // [row][col], true = dark module
  size: number; // Number of modules per side
  type: "QR";
  displayText: string;
}

export interface QRGenerateOptions {
  errorCorrectionLevel?: QRErrorCorrectionLevel;
}

export class QRValidationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "QRValidationError";
  }
}

export function validate2DData(data: string, type: BarcodeType2D): void {
  const trimmed = data.trim();

  if (!trimmed) {
    throw new QRValidationError("Code data cannot be empty.", "EMPTY_DATA");
  }

  const limits: Record<BarcodeType2D, number> = {
    QR: 3000,
    "DATA-MATRIX": 2335,
    PDF417: 1800,
    AZTEC: 3067,
  };

  const limit = limits[type];
  if (trimmed.length > limit) {
    throw new QRValidationError(
      `${type} supports up to ${limit} characters. Input is ${trimmed.length} characters.`,
      "TOO_LONG"
    );
  }
}

/**
 * Render a QR code to a 2D module array.
 * Works in both browser and Node.
 */
export async function renderQRCode(
  data: string,
  options: QRGenerateOptions = {}
): Promise<QRRenderData> {
  validate2DData(data, "QR");

  const QRCode = await import("qrcode");

  const qr = QRCode.create(data.trim(), {
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
  });

  const size = qr.modules.size;
  const modules: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < size; col++) {
      rowData.push(qr.modules.get(row, col) === 1);
    }
    modules.push(rowData);
  }

  return {
    modules,
    size,
    type: "QR",
    displayText: data.trim(),
  };
}

/**
 * Recommended error correction level by use case.
 * Artistic QR codes should always use H (30% restoration).
 */
export function getRecommendedECL(
  useCase: "url" | "text" | "art" | "industrial"
): QRErrorCorrectionLevel {
  switch (useCase) {
    case "url":
      return "M";
    case "text":
      return "L";
    case "art":
      return "H";
    case "industrial":
      return "Q";
  }
}
