/**
 * SVG Composer
 *
 * Assembles the final SVG output from raw barcode render data + shape + color.
 *
 * This is the core creative operation of SCANVAS. The pipeline:
 *   render data → [this function] → composed SVG with shape mask + protected zone
 *
 * Key rule: the bottom 20% of 1D barcodes (the "protected zone") is ALWAYS
 * rendered as plain black bars on white background, ignoring shape and color.
 */

import { nanoid } from "@/lib/utils";
import type { BarcodeRenderData } from "./barcode-1d";
import type { QRRenderData } from "./barcode-2d";
import type { Shape } from "@/types/shapes";
import type { ColorConfig } from "@/types/barcode";

const DEFAULT_ART_ZONE_RATIO = 0.8;

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ComposeOptions {
  shape?: Shape;
  color: ColorConfig;
  width?: number; // Target output width in SVG units
  height?: number; // Target output height in SVG units
  showDigits?: boolean;
  transparent?: boolean;
}

/**
 * Compose a 1D barcode with shape masking + protected zone.
 */
export function compose1DSVG(
  data: BarcodeRenderData,
  options: ComposeOptions
): string {
  const width = options.width ?? data.width;
  const height = options.height ?? data.height;
  const artZoneRatio = options.shape?.artZoneRatio ?? DEFAULT_ART_ZONE_RATIO;

  // Reserve space at the bottom for digits if enabled
  const digitsHeight = options.showDigits ? 16 : 0;
  const barcodeHeight = height - digitsHeight;

  const artZoneHeight = options.shape
    ? barcodeHeight * artZoneRatio
    : barcodeHeight;
  const protectedZoneHeight = barcodeHeight - artZoneHeight;

  const scaleX = width / data.width;
  const backgroundFill = options.transparent ? "none" : options.color.background;

  const instanceId = nanoid(6);
  const clipId = `shape-clip-${instanceId}`;
  const fillRef = buildColorFillRef(options.color, instanceId);

  const defs: string[] = [];
  if (fillRef.defs) defs.push(fillRef.defs);

  // Build the shape clip path (scaled to barcode width × artZoneHeight)
  if (options.shape) {
    const [vbX, vbY, vbW, vbH] = options.shape.viewBox
      .split(/\s+/)
      .map(Number);
    const shapeScaleX = width / (vbW || 200);
    const shapeScaleY = artZoneHeight / (vbH || 150);
    defs.push(
      `<clipPath id="${clipId}">
        <path d="${options.shape.svgPath}" transform="translate(${-(vbX ?? 0) * shapeScaleX}, ${-(vbY ?? 0) * shapeScaleY}) scale(${shapeScaleX.toFixed(4)}, ${shapeScaleY.toFixed(4)})"/>
      </clipPath>`
    );
  }

  // Render art zone bars (colored, shape-masked, full-height within art zone)
  const artBars = data.bars
    .map((bar) => {
      const barX = (bar.x * scaleX).toFixed(3);
      const barW = (bar.width * scaleX).toFixed(3);
      return `<rect x="${barX}" y="0" width="${barW}" height="${artZoneHeight}" fill="${fillRef.fill}"/>`;
    })
    .join("");

  // Render protected zone bars (always plain black on white)
  const protectedBars = data.bars
    .map((bar) => {
      const barX = (bar.x * scaleX).toFixed(3);
      const barW = (bar.width * scaleX).toFixed(3);
      return `<rect x="${barX}" y="${artZoneHeight}" width="${barW}" height="${protectedZoneHeight}" fill="#000000"/>`;
    })
    .join("");

  // Optional human-readable digits under the barcode
  const digitsText = options.showDigits
    ? `<text x="${width / 2}" y="${height - 4}" text-anchor="middle" font-family="monospace" font-size="12" fill="#000000">${escapeXml(data.displayText)}</text>`
    : "";

  const clipAttr = options.shape ? ` clip-path="url(#${clipId})"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${defs.join("\n    ")}
  </defs>
  <rect width="${width}" height="${height}" fill="${backgroundFill}"/>
  <g${clipAttr}>
    ${artBars}
  </g>
  ${options.shape ? `<rect x="0" y="${artZoneHeight}" width="${width}" height="${protectedZoneHeight}" fill="${options.color.background}"/>` : ""}
  <g>
    ${protectedBars}
  </g>
  ${digitsText}
</svg>`;
}

/**
 * Compose a 2D (QR) code with shape masking.
 * 2D codes don't have a protected zone — error correction handles partial occlusion.
 */
export function composeQRSVG(
  data: QRRenderData,
  options: ComposeOptions
): string {
  const width = options.width ?? 300;
  const height = options.height ?? 300;
  const margin = 4; // QR quiet zone in modules

  const modulesPerSide = data.size + margin * 2;
  const moduleSize = Math.min(width, height) / modulesPerSide;

  const instanceId = nanoid(6);
  const clipId = `qr-shape-clip-${instanceId}`;
  const fillRef = buildColorFillRef(options.color, instanceId);

  const defs: string[] = [];
  if (fillRef.defs) defs.push(fillRef.defs);

  if (options.shape) {
    const [vbX, vbY, vbW, vbH] = options.shape.viewBox
      .split(/\s+/)
      .map(Number);
    const shapeScaleX = width / (vbW || 200);
    const shapeScaleY = height / (vbH || 150);
    defs.push(
      `<clipPath id="${clipId}">
        <path d="${options.shape.svgPath}" transform="translate(${-(vbX ?? 0) * shapeScaleX}, ${-(vbY ?? 0) * shapeScaleY}) scale(${shapeScaleX.toFixed(4)}, ${shapeScaleY.toFixed(4)})"/>
      </clipPath>`
    );
  }

  // Draw dark modules
  const moduleRects: string[] = [];
  for (let row = 0; row < data.size; row++) {
    for (let col = 0; col < data.size; col++) {
      const rowData = data.modules[row];
      if (!rowData) continue;
      if (rowData[col]) {
        const x = (col + margin) * moduleSize;
        const y = (row + margin) * moduleSize;
        moduleRects.push(
          `<rect x="${x.toFixed(3)}" y="${y.toFixed(3)}" width="${moduleSize.toFixed(3)}" height="${moduleSize.toFixed(3)}" fill="${fillRef.fill}"/>`
        );
      }
    }
  }

  const clipAttr = options.shape ? ` clip-path="url(#${clipId})"` : "";
  const backgroundFill = options.transparent ? "none" : options.color.background;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${defs.join("\n    ")}
  </defs>
  <rect width="${width}" height="${height}" fill="${backgroundFill}"/>
  <g${clipAttr}>
    ${moduleRects.join("")}
  </g>
</svg>`;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

interface ColorFillRef {
  fill: string;
  defs: string;
}

function buildColorFillRef(
  color: ColorConfig,
  instanceId: string
): ColorFillRef {
  if (color.mode === "gradient" && color.secondary) {
    const gradId = `grad-${instanceId}`;
    const isRadial = color.gradientDirection === "radial";

    if (isRadial) {
      return {
        fill: `url(#${gradId})`,
        defs: `<radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color.primary}"/>
          <stop offset="100%" stop-color="${color.secondary}"/>
        </radialGradient>`,
      };
    }

    const coords =
      color.gradientDirection === "to-right"
        ? 'x1="0%" y1="0%" x2="100%" y2="0%"'
        : color.gradientDirection === "to-br"
          ? 'x1="0%" y1="0%" x2="100%" y2="100%"'
          : 'x1="0%" y1="0%" x2="0%" y2="100%"';

    return {
      fill: `url(#${gradId})`,
      defs: `<linearGradient id="${gradId}" ${coords}>
        <stop offset="0%" stop-color="${color.primary}"/>
        <stop offset="100%" stop-color="${color.secondary}"/>
      </linearGradient>`,
    };
  }

  return { fill: color.primary, defs: "" };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
