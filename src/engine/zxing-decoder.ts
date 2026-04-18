"use client";

/**
 * ZXing WASM barcode decoder.
 *
 * Renders an SVG string to a canvas, extracts ImageData, then calls
 * ZXing to attempt a real decode. Returns the decoded text or null.
 *
 * The WASM file is served from /public/zxing_reader.wasm.
 */

import {
  readBarcodesFromImageData,
  setZXingModuleOverrides,
} from "zxing-wasm/reader";

let initialized = false;

function initZXing() {
  if (initialized) return;
  initialized = true;
  setZXingModuleOverrides({
    locateFile: (path: string) => `/${path}`,
  });
}

export interface DecodeResult {
  decoded: boolean;
  text: string;
  format: string;
}

/**
 * Render an SVG string to an off-screen canvas at the given width,
 * then attempt ZXing decode. Returns null if browser APIs aren't available.
 */
export async function decodeBarcodeSvg(
  svg: string,
  width = 400
): Promise<DecodeResult | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  initZXing();

  try {
    const imageData = await svgToImageData(svg, width);
    const results = await readBarcodesFromImageData(imageData, {
      tryHarder: true,
      formats: [], // empty = try all formats
    });

    if (results.length > 0 && results[0]!.isValid) {
      return {
        decoded: true,
        text: results[0]!.text,
        format: results[0]!.format,
      };
    }
    return { decoded: false, text: "", format: "" };
  } catch {
    return null; // ZXing failure — caller treats as unknown
  }
}

function svgToImageData(svg: string, width: number): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const vbMatch = svg.match(/viewBox="([^"]+)"/);
    let aspectRatio = 4 / 3;
    if (vbMatch) {
      const parts = vbMatch[1]!.split(/\s+/).map(Number);
      const w = parts[2] ?? 400;
      const h = parts[3] ?? 300;
      if (h > 0) aspectRatio = w / h;
    }
    const height = Math.round(width / aspectRatio);

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      // White background so contrast is correct for ZXing
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(imageData);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG failed to load"));
    };
    img.src = url;
  });
}
