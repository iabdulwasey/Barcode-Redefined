/**
 * POST /api/v1/export/png
 *
 * Body: { svg: string; width?: number; dpi?: number }
 * Returns the PNG file as application/octet-stream.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { svgToPngBuffer } from "@/engine/export/png-export";

const Schema = z.object({
  svg: z.string().min(10),
  width: z.number().min(50).max(4000).default(400),
  dpi: z.number().min(72).max(600).default(144),
  filename: z.string().max(120).default("scanvas-barcode"),
});

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

  const { svg, width, dpi, filename } = parsed.data;

  try {
    const buffer = await svgToPngBuffer(svg, { width, dpi });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${filename}.png"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PNG export failed";
    return NextResponse.json({ error: message }, { status: 500 });
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
