/**
 * Server-side PNG export via Sharp.
 * Converts an SVG string to a PNG Buffer at the requested width/DPI.
 */

import sharp from "sharp";

export interface PngExportOptions {
  width?: number; // output width in px, default 400
  dpi?: number; // metadata DPI, default 144
}

export async function svgToPngBuffer(
  svg: string,
  options: PngExportOptions = {}
): Promise<Buffer> {
  const width = options.width ?? 400;
  const dpi = options.dpi ?? 144;

  const buffer = await sharp(Buffer.from(svg))
    .resize({ width, withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .withMetadata({ density: dpi })
    .toBuffer();

  return buffer;
}
