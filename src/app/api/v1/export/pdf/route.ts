/**
 * POST /api/v1/export/pdf
 *
 * Body: { svg: string; widthMm?: number; dpi?: number; bleedMm?: number; title?: string }
 * Returns the PDF file as application/pdf.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { svgToPdfBuffer } from "@/engine/export/pdf-export";

const Schema = z.object({
  svg: z.string().min(10),
  widthMm: z.number().min(10).max(500).default(40),
  dpi: z.number().min(72).max(600).default(300),
  bleedMm: z.number().min(0).max(10).default(0),
  title: z.string().max(120).default("SCANVAS Barcode"),
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

  const { svg, widthMm, dpi, bleedMm, title, filename } = parsed.data;

  try {
    const buffer = await svgToPdfBuffer(svg, { widthMm, dpi, bleedMm, title });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF export failed";
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
