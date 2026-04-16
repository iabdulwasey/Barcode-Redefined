/**
 * 2D Code Engine
 *
 * Handles QR Code generation via the qrcode library.
 * Returns SVG path data for further composition with the shape system.
 */

import type { BarcodeType2D, ColorConfig } from "@/types/barcode";

export type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRGenerateOptions {
  errorCorrectionLevel?: QRErrorCorrectionLevel;
  margin?: number;
  color?: ColorConfig;
  width?: number;
}

/**
 * Generate a QR code as an SVG string.
 */
export async function generateQRSVG(
  data: string,
  options: QRGenerateOptions = {}
): Promise<string> {
  if (!data.trim()) {
    throw new Error("QR code data cannot be empty.");
  }

  const QRCode = await import("qrcode");

  const svg = await QRCode.toString(data.trim(), {
    type: "svg",
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    margin: options.margin ?? 4,
    color: {
      dark: options.color?.primary ?? "#000000",
      light: options.color?.background ?? "#FFFFFF",
    },
    width: options.width ?? 300,
  });

  return svg;
}

/**
 * Validates data length constraints for 2D codes.
 */
export function validate2DData(data: string, type: BarcodeType2D): void {
  const trimmed = data.trim();

  if (!trimmed) {
    throw new Error("Code data cannot be empty.");
  }

  const limits: Record<BarcodeType2D, number> = {
    QR: 3000,
    "DATA-MATRIX": 2335,
    PDF417: 1800,
    AZTEC: 3067,
  };

  const limit = limits[type];
  if (trimmed.length > limit) {
    throw new Error(
      `${type} supports up to ${limit} characters. Input is ${trimmed.length} characters.`
    );
  }
}

/**
 * Get the recommended error correction level based on use case.
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
      // Artistic QR codes need H because the image obscures modules
      return "H";
    case "industrial":
      return "Q";
  }
}
