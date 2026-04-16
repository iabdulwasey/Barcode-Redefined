/**
 * Shape Masker
 *
 * Applies an SVG silhouette shape as a clip mask to a barcode SVG.
 *
 * Architecture:
 * - The barcode SVG (bars) is placed inside an <svg> element
 * - A <clipPath> using the shape's SVG path is applied to the bars group
 * - The protected zone (bottom 20% of 1D barcodes) is placed OUTSIDE
 *   the clip path and always renders as plain black bars on white
 *
 * This is the core creative operation of SCANVAS.
 */

import { nanoid } from "@/lib/utils";
import type { ShapeConfig } from "@/types/shapes";
import type { ColorConfig } from "@/types/barcode";

// How much of the barcode height is "art zone" vs "protected scan zone"
const DEFAULT_ART_ZONE_RATIO = 0.8;

export interface MaskedBarcodeOptions {
  barcodeSvg: string;
  shape: ShapeConfig & { svgPath: string; viewBox: string; artZoneRatio?: number };
  color: ColorConfig;
  totalWidth: number;
  totalHeight: number;
  is1D: boolean;
}

export interface MaskedBarcodeResult {
  svg: string;
  artZoneHeight: number;
  protectedZoneHeight: number;
}

/**
 * Apply a shape mask to a barcode SVG.
 *
 * For 1D barcodes:
 *   - Top artZoneRatio * height: shape-masked bars with custom color
 *   - Bottom (1 - artZoneRatio) * height: plain black bars on white (protected)
 *
 * For 2D codes:
 *   - Full area receives the shape mask (QR codes self-correct)
 */
export function applyShapeMask(options: MaskedBarcodeOptions): MaskedBarcodeResult {
  const {
    barcodeSvg,
    shape,
    color,
    totalWidth,
    totalHeight,
    is1D,
  } = options;

  const artZoneRatio = shape.artZoneRatio ?? DEFAULT_ART_ZONE_RATIO;
  const artZoneHeight = is1D
    ? Math.round(totalHeight * artZoneRatio)
    : totalHeight;
  const protectedZoneHeight = totalHeight - artZoneHeight;

  const clipId = `clip-${nanoid(8)}`;
  const [vbX, vbY, vbW, vbH] = (shape.viewBox ?? "0 0 200 150")
    .split(" ")
    .map(Number);

  // Scale the shape path to fit the target art zone dimensions
  const scaleX = totalWidth / (vbW ?? 200);
  const scaleY = artZoneHeight / (vbH ?? 150);

  const colorDefs = buildColorDefs(color, totalWidth, totalHeight, clipId);

  const svg = `<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 ${totalWidth} ${totalHeight}"
  width="${totalWidth}"
  height="${totalHeight}"
>
  <defs>
    ${colorDefs.defs}
    <clipPath id="${clipId}">
      <path
        d="${shape.svgPath}"
        transform="scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)}) translate(${-(vbX ?? 0)}, ${-(vbY ?? 0)})"
      />
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${totalWidth}" height="${totalHeight}" fill="${color.background}" />

  ${is1D ? `
  <!-- Art zone: shape-masked colored bars -->
  <g clip-path="url(#${clipId})">
    <g fill="${colorDefs.fill}" transform="translate(0, 0) scale(1, ${(artZoneHeight / totalHeight).toFixed(4)})">
      ${extractBarGroups(barcodeSvg, color.primary)}
    </g>
  </g>

  <!-- Protected scan zone: plain black bars, always unmasked -->
  <g transform="translate(0, ${artZoneHeight})">
    <rect width="${totalWidth}" height="${protectedZoneHeight}" fill="${color.background}" />
    <g fill="#000000" transform="translate(0, ${-(totalHeight - protectedZoneHeight).toFixed(2)}) scale(1, ${(totalHeight / totalHeight).toFixed(4)})">
      ${extractBarGroups(barcodeSvg, "#000000")}
    </g>
    <!-- Clip to just the protected zone -->
    <rect width="${totalWidth}" height="${protectedZoneHeight}" fill="none" />
  </g>
  ` : `
  <!-- 2D code: full shape mask applied -->
  <g clip-path="url(#${clipId})">
    <g fill="${colorDefs.fill}">
      ${extractBarGroups(barcodeSvg, color.primary)}
    </g>
  </g>
  `}
</svg>`.trim();

  return {
    svg,
    artZoneHeight,
    protectedZoneHeight,
  };
}

/**
 * Extract <rect> elements from a JsBarcode/qrcode SVG output.
 * Returns them as a raw string of SVG elements with overridden fill.
 */
function extractBarGroups(svgString: string, fill: string): string {
  // Match all <rect> elements in the SVG
  const rectMatches = svgString.matchAll(/<rect\s[^/]*/g);
  const rects: string[] = [];

  for (const match of rectMatches) {
    // Override fill and strip background-style rects (full-width, very tall)
    let rect = match[0];
    // Replace existing fill attribute
    rect = rect.replace(/fill="[^"]*"/g, `fill="${fill}"`);
    if (!rect.endsWith("/>")) {
      rect += "/>";
    }
    rects.push(rect);
  }

  return rects.join("\n    ");
}

interface ColorDefs {
  defs: string;
  fill: string;
}

function buildColorDefs(
  color: ColorConfig,
  width: number,
  height: number,
  baseId: string
): ColorDefs {
  if (color.mode === "gradient" && color.secondary) {
    const gradId = `grad-${baseId}`;
    const isRadial = color.gradientDirection === "radial";

    if (isRadial) {
      return {
        defs: `<radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color.primary}" />
          <stop offset="100%" stop-color="${color.secondary}" />
        </radialGradient>`,
        fill: `url(#${gradId})`,
      };
    }

    const angleMap: Record<string, string> = {
      "to-right": "x1='0%' y1='0%' x2='100%' y2='0%'",
      "to-bottom": "x1='0%' y1='0%' x2='0%' y2='100%'",
      "to-br": "x1='0%' y1='0%' x2='100%' y2='100%'",
    };
    const coords =
      angleMap[color.gradientDirection ?? "to-bottom"] ?? angleMap["to-bottom"];

    return {
      defs: `<linearGradient id="${gradId}" ${coords}>
        <stop offset="0%" stop-color="${color.primary}" />
        <stop offset="100%" stop-color="${color.secondary}" />
      </linearGradient>`,
      fill: `url(#${gradId})`,
    };
  }

  return {
    defs: "",
    fill: color.primary,
  };
}
