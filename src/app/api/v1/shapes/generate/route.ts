/**
 * POST /api/v1/shapes/generate
 *
 * Generate an SVG silhouette shape using Claude AI.
 * Body: { prompt: string; style?: "minimal"|"detailed"|"geometric"|"organic"; category?: string }
 * Returns: { svgPath, viewBox, prompt, generatedAt }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateAIShape } from "@/lib/anthropic/shape-generator";

const Schema = z.object({
  prompt: z.string().min(2).max(200),
  style: z.enum(["minimal", "detailed", "geometric", "organic"]).default("minimal"),
  category: z
    .enum([
      "nature",
      "animals",
      "food-drink",
      "people-culture",
      "architecture",
      "transport",
      "tech-objects",
      "abstract",
    ])
    .optional(),
});

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
    const { prompt, style, category } = parsed.data;
    const result = await generateAIShape({
      prompt,
      style,
      ...(category ? { category } : {}),
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Shape generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
