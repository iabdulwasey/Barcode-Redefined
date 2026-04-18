/**
 * POST /api/v1/batch/generate
 *
 * Generate multiple barcodes and return a ZIP file.
 * Body: { items: BatchItem[]; shapeId?: string; color?: ColorConfig; formats?: string[]; pngWidth?: number }
 * Returns: application/zip
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateBatchZip } from "@/engine/export/batch-export";

const ItemSchema = z.object({
  data: z.string().min(1).max(2048),
  type: z.string().optional(),
  filename: z.string().max(120).optional(),
});

const ColorSchema = z.object({
  mode: z.enum(["solid", "gradient"]).default("solid"),
  primary: z.string().default("#000000"),
  background: z.string().default("#FFFFFF"),
  secondary: z.string().optional(),
  gradientDirection: z.enum(["to-right", "to-bottom", "to-br", "radial"]).optional(),
});

const Schema = z.object({
  items: z.array(ItemSchema).min(1).max(500),
  shapeId: z.string().optional(),
  color: ColorSchema.optional(),
  formats: z.array(z.enum(["svg", "png"])).default(["svg"]),
  pngWidth: z.number().min(100).max(2000).default(400),
});

export const maxDuration = 60; // seconds — batch can take a while

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items, shapeId, color, formats, pngWidth } = parsed.data;

  try {
    const result = await generateBatchZip(
      items.map((item) => ({
        data: item.data,
        ...(item.type ? { type: item.type as import("@/types/barcode").BarcodeType } : {}),
        ...(item.filename ? { filename: item.filename } : {}),
      })),
      {
        ...(shapeId ? { shapeId } : {}),
        ...(color ? { color: { mode: color.mode, primary: color.primary, background: color.background, ...(color.secondary ? { secondary: color.secondary } : {}), ...(color.gradientDirection ? { gradientDirection: color.gradientDirection } : {}) } } : {}),
        formats,
        pngWidth,
      }
    );

    const filename = `scanvas-batch-${Date.now()}.zip`;

    return new NextResponse(new Uint8Array(result.zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(result.zipBuffer.length),
        "X-Batch-Success": String(result.successCount),
        "X-Batch-Fail": String(result.failCount),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Batch generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
