/**
 * POST /api/v1/barcode
 *
 * Generate an artistic barcode via the REST API.
 * Requires API key authentication for programmatic access.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { APIResponse } from "@/types/api";

// ─── Request Schema ───────────────────────────────────────────────────────────

const BarcodeRequestSchema = z.object({
  data: z.string().min(1, "data is required"),
  type: z.enum([
    "EAN-13", "EAN-8", "UPC-A", "UPC-E",
    "CODE-128", "CODE-39", "CODE-93",
    "ITF-14", "GS1-128", "CODABAR", "MSI",
    "ISBN", "ISSN", "PHARMACODE",
    "QR", "DATA-MATRIX", "PDF417", "AZTEC",
  ]),
  shapeId: z.string().optional(),
  color: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{3,6}$/, "primary must be a hex color"),
    background: z.string().regex(/^#[0-9a-fA-F]{3,6}$/).default("#FFFFFF"),
    mode: z.enum(["solid", "gradient"]).default("solid"),
    secondary: z.string().regex(/^#[0-9a-fA-F]{3,6}$/).optional(),
  }).default({ primary: "#000000", background: "#FFFFFF", mode: "solid" }),
  format: z.array(z.enum(["svg", "png", "pdf"])).default(["svg"]),
  width: z.number().min(100).max(4000).default(400),
  height: z.number().min(100).max(4000).default(300),
  dpi: z.number().min(72).max(600).default(300),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Parse and validate the request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "INVALID_JSON" } satisfies APIResponse<never>,
      { status: 400 }
    );
  }

  const parsed = BarcodeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
      } satisfies APIResponse<never>,
      { status: 400 }
    );
  }

  const { data, type } = parsed.data;

  try {
    // Phase 1: Return a basic SVG placeholder
    // Phase 2+: Invoke the full barcode engine with shape masking
    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${parsed.data.width} ${parsed.data.height}" width="${parsed.data.width}" height="${parsed.data.height}">
  <rect width="100%" height="100%" fill="${parsed.data.color.background}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-size="14" fill="${parsed.data.color.primary}">
    ${type}: ${data}
  </text>
</svg>`;

    return NextResponse.json(
      {
        data: {
          svg: placeholderSvg,
          scanConfidence: 0,
          warnings: ["Engine not yet connected — placeholder response"],
          metadata: {
            type,
            data,
            width: parsed.data.width,
            height: parsed.data.height,
          },
        },
      } satisfies APIResponse<{
        svg: string;
        scanConfidence: number;
        warnings: string[];
        metadata: { type: string; data: string; width: number; height: number };
      }>,
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: message,
        code: "GENERATION_ERROR",
      } satisfies APIResponse<never>,
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
    },
  });
}
