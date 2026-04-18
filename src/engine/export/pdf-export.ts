/**
 * Server-side PDF export via PDFKit.
 * Embeds the barcode as a vector SVG rasterized at 300 DPI.
 */

import PDFDocument from "pdfkit";
import sharp from "sharp";

export interface PdfExportOptions {
  dpi?: number; // default 300
  widthMm?: number; // physical width in mm, default 40mm
  title?: string;
  bleedMm?: number; // bleed in mm, default 0
}

const MM_TO_PT = 2.8346;

export async function svgToPdfBuffer(
  svg: string,
  options: PdfExportOptions = {}
): Promise<Buffer> {
  const dpi = options.dpi ?? 300;
  const widthMm = options.widthMm ?? 40;
  const bleedMm = options.bleedMm ?? 0;
  const title = options.title ?? "SCANVAS Barcode";

  const widthPt = (widthMm + bleedMm * 2) * MM_TO_PT;

  // Parse viewBox for aspect ratio
  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  let aspectRatio = 4 / 3;
  if (vbMatch) {
    const parts = vbMatch[1]!.split(/\s+/).map(Number);
    const w = parts[2] ?? 400;
    const h = parts[3] ?? 300;
    if (h > 0) aspectRatio = w / h;
  }
  const heightPt = widthPt / aspectRatio;

  // Rasterize SVG to PNG at print resolution for embedding
  const pxWidth = Math.round((widthMm / 25.4) * dpi);
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize({ width: pxWidth })
    .png()
    .withMetadata({ density: dpi })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [widthPt, heightPt],
      margin: 0,
      info: { Title: title, Producer: "SCANVAS" },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.image(pngBuffer, 0, 0, { width: widthPt, height: heightPt });
    doc.end();
  });
}
