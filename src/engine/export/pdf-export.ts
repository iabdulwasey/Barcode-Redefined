/**
 * Server-side PDF export via PDFKit.
 *
 * Supports:
 * - Standard PDF at any DPI
 * - Print-ready PDF with bleed + crop marks
 */

import PDFDocument from "pdfkit";
import sharp from "sharp";

export interface PdfExportOptions {
  dpi?: number;        // default 300
  widthMm?: number;   // physical barcode width in mm, default 40
  title?: string;
  bleedMm?: number;   // bleed margin in mm, default 0
  cropMarks?: boolean; // draw crop marks when bleed > 0
}

const MM_TO_PT = 2.8346;
const CROP_MARK_LENGTH_PT = 14; // 5mm crop marks
const CROP_MARK_OFFSET_PT = 6;  // gap between bleed edge and mark

export async function svgToPdfBuffer(
  svg: string,
  options: PdfExportOptions = {}
): Promise<Buffer> {
  const dpi = options.dpi ?? 300;
  const widthMm = options.widthMm ?? 40;
  const bleedMm = options.bleedMm ?? 0;
  const title = options.title ?? "SCANVAS Barcode";
  const cropMarks = (options.cropMarks ?? true) && bleedMm > 0;

  // Parse viewBox for aspect ratio
  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  let aspectRatio = 4 / 3;
  if (vbMatch) {
    const parts = vbMatch[1]!.split(/\s+/).map(Number);
    const w = parts[2] ?? 400;
    const h = parts[3] ?? 300;
    if (h > 0) aspectRatio = w / h;
  }

  const bleedPt = bleedMm * MM_TO_PT;
  const artWidthPt = widthMm * MM_TO_PT;
  const artHeightPt = artWidthPt / aspectRatio;

  // Page size = art + bleed on all sides
  const pageWidthPt = artWidthPt + bleedPt * 2;
  const pageHeightPt = artHeightPt + bleedPt * 2;

  // Rasterize at print resolution (art + bleed area)
  const pxWidth = Math.round(((widthMm + bleedMm * 2) / 25.4) * dpi);
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize({ width: Math.max(pxWidth, 100) })
    .png()
    .withMetadata({ density: dpi })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [pageWidthPt, pageHeightPt],
      margin: 0,
      info: {
        Title: title,
        Producer: "SCANVAS",
        Subject: `Print-ready barcode — ${widthMm}mm × ${artHeightPt / MM_TO_PT}mm, bleed ${bleedMm}mm`,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Draw barcode image filling the full page (including bleed area)
    doc.image(pngBuffer, 0, 0, { width: pageWidthPt, height: pageHeightPt });

    // Crop marks (drawn outside bleed, in the page margins)
    if (cropMarks) {
      doc.save();
      doc.strokeColor("#000000").lineWidth(0.5);

      const x0 = bleedPt; // left art edge
      const x1 = bleedPt + artWidthPt; // right art edge
      const y0 = bleedPt; // top art edge
      const y1 = bleedPt + artHeightPt; // bottom art edge

      // Top-left corner marks
      drawCropMark(doc, x0 - CROP_MARK_OFFSET_PT, y0, x0 - CROP_MARK_OFFSET_PT - CROP_MARK_LENGTH_PT, y0);
      drawCropMark(doc, x0, y0 - CROP_MARK_OFFSET_PT, x0, y0 - CROP_MARK_OFFSET_PT - CROP_MARK_LENGTH_PT);

      // Top-right corner marks
      drawCropMark(doc, x1 + CROP_MARK_OFFSET_PT, y0, x1 + CROP_MARK_OFFSET_PT + CROP_MARK_LENGTH_PT, y0);
      drawCropMark(doc, x1, y0 - CROP_MARK_OFFSET_PT, x1, y0 - CROP_MARK_OFFSET_PT - CROP_MARK_LENGTH_PT);

      // Bottom-left corner marks
      drawCropMark(doc, x0 - CROP_MARK_OFFSET_PT, y1, x0 - CROP_MARK_OFFSET_PT - CROP_MARK_LENGTH_PT, y1);
      drawCropMark(doc, x0, y1 + CROP_MARK_OFFSET_PT, x0, y1 + CROP_MARK_OFFSET_PT + CROP_MARK_LENGTH_PT);

      // Bottom-right corner marks
      drawCropMark(doc, x1 + CROP_MARK_OFFSET_PT, y1, x1 + CROP_MARK_OFFSET_PT + CROP_MARK_LENGTH_PT, y1);
      drawCropMark(doc, x1, y1 + CROP_MARK_OFFSET_PT, x1, y1 + CROP_MARK_OFFSET_PT + CROP_MARK_LENGTH_PT);

      doc.restore();
    }

    doc.end();
  });
}

function drawCropMark(
  doc: InstanceType<typeof PDFDocument>,
  x1: number, y1: number, x2: number, y2: number
) {
  doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
}
