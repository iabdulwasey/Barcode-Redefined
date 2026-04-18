/**
 * Batch barcode generation + ZIP assembly.
 * Server-side only — uses archiver to produce a ZIP buffer.
 */

import archiver from "archiver";
import { PassThrough } from "stream";
import { render1DBarcode } from "@/engine/barcode-1d";
import { renderQRCode, validate2DData } from "@/engine/barcode-2d";
import { compose1DSVG, composeQRSVG } from "@/engine/svg-composer";
import { svgToPngBuffer } from "@/engine/export/png-export";
import { is1D, type BarcodeType, type ColorConfig } from "@/types/barcode";
import { getShapeById } from "@/engine/shapes";

export interface BatchItem {
  data: string;
  type?: BarcodeType;
  filename?: string;
}

export interface BatchOptions {
  shapeId?: string;
  color?: ColorConfig;
  formats?: ("svg" | "png")[];
  pngWidth?: number;
}

export interface BatchResult {
  zipBuffer: Buffer;
  successCount: number;
  failCount: number;
  errors: Array<{ row: number; data: string; error: string }>;
}

const DEFAULT_COLOR: ColorConfig = { mode: "solid", primary: "#000000", background: "#FFFFFF" };

export async function generateBatchZip(
  items: BatchItem[],
  options: BatchOptions = {}
): Promise<BatchResult> {
  const formats = options.formats ?? ["svg"];
  const pngWidth = options.pngWidth ?? 400;
  const color = options.color ?? DEFAULT_COLOR;
  const shape = options.shapeId ? getShapeById(options.shapeId) : undefined;

  const errors: BatchResult["errors"] = [];
  let successCount = 0;

  // Collect all generated entries before zipping
  const entries: Array<{ name: string; data: Buffer | string }> = [];

  await Promise.allSettled(
    items.map(async (item, idx) => {
      const type: BarcodeType = item.type ?? "CODE-128";
      const baseName = item.filename ?? `barcode-${String(idx + 1).padStart(3, "0")}`;

      try {
        let svg: string;

        if (is1D(type)) {
          const renderData = await render1DBarcode(item.data, type, { barWidth: 2, height: 100 });
          svg = compose1DSVG(renderData, {
            ...(shape ? { shape } : {}),
            color,
            width: 400,
            height: 260,
            showDigits: true,
          });
        } else {
          validate2DData(item.data, "QR");
          const qrData = await renderQRCode(item.data, { errorCorrectionLevel: "M" });
          svg = composeQRSVG(qrData, {
            ...(shape ? { shape } : {}),
            color,
            width: 320,
            height: 320,
          });
        }

        if (formats.includes("svg")) {
          entries.push({ name: `${baseName}.svg`, data: svg });
        }
        if (formats.includes("png")) {
          const pngBuf = await svgToPngBuffer(svg, { width: pngWidth });
          entries.push({ name: `${baseName}.png`, data: pngBuf });
        }

        successCount++;
      } catch (err) {
        errors.push({
          row: idx + 1,
          data: item.data,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    })
  );

  const zipBuffer = await buildZip(entries);
  return { zipBuffer, successCount, failCount: errors.length, errors };
}

function buildZip(entries: Array<{ name: string; data: Buffer | string }>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 6 } });
    const chunks: Buffer[] = [];
    const passthrough = new PassThrough();

    passthrough.on("data", (chunk: Buffer) => chunks.push(chunk));
    passthrough.on("end", () => resolve(Buffer.concat(chunks)));
    passthrough.on("error", reject);
    archive.on("error", reject);

    archive.pipe(passthrough);

    for (const entry of entries) {
      const buf = typeof entry.data === "string" ? Buffer.from(entry.data, "utf-8") : entry.data;
      archive.append(buf, { name: entry.name });
    }

    archive.finalize();
  });
}

/**
 * Parse a CSV string into BatchItems.
 * Expects columns: data, type (optional), filename (optional)
 * First row is treated as header if it contains the word "data".
 */
export function parseBatchCsv(csv: string): BatchItem[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const firstLine = lines[0]!.toLowerCase();
  const hasHeader = firstLine.includes("data") || firstLine.includes("barcode");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines
    .map((line) => {
      const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      const data = parts[0] ?? "";
      if (!data) return null;
      return {
        data,
        ...(parts[1] ? { type: parts[1] as BarcodeType } : {}),
        ...(parts[2] ? { filename: parts[2] } : {}),
      } satisfies BatchItem;
    })
    .filter((item): item is BatchItem => item !== null);
}
