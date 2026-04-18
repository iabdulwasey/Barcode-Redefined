/**
 * POST /api/v1/brand/colors
 *
 * Generate brand-matched color palette suggestions via Claude.
 * Body: { brandName?: string; brandDescription?: string; extractedColors?: string[] }
 * Returns: { palettes: Array<{ name, primary, secondary?, background }> }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateBrandColorSuggestions } from "@/lib/anthropic/shape-generator";

const Schema = z.object({
  brandName: z.string().max(100).optional(),
  brandDescription: z.string().max(500).optional(),
  extractedColors: z.array(z.string().regex(/^#[0-9a-fA-F]{3,6}$/)).max(10).optional(),
}).refine(
  (d) => d.brandName ?? d.brandDescription ?? d.extractedColors?.length,
  { message: "Provide at least one of brandName, brandDescription, or extractedColors." }
);

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
      { status: 503 }
    );
  }

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

  try {
    const { brandName, brandDescription, extractedColors } = parsed.data;
    const palettes = await generateBrandColorSuggestions({
      ...(brandName ? { brandName } : {}),
      ...(brandDescription ? { brandDescription } : {}),
      ...(extractedColors ? { extractedColors } : {}),
    });
    return NextResponse.json({ data: { palettes } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Color generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
