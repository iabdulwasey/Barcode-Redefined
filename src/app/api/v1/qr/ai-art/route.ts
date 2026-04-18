/**
 * POST /api/v1/qr/ai-art
 *
 * Generate an AI-styled QR code image via Replicate.
 * Body: { data: string; prompt: string; style?: string; negativePrompt?: string; guidanceScale?: number }
 * Returns: { imageUrl, generationId }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateAIQR } from "@/lib/replicate/ai-qr";

const Schema = z.object({
  data: z.string().min(1).max(2048),
  prompt: z.string().min(2).max(500),
  style: z
    .enum([
      "watercolor",
      "oil-painting",
      "pixel-art",
      "geometric",
      "neon",
      "vintage",
      "minimalist",
      "botanical",
      "custom",
    ])
    .default("geometric"),
  negativePrompt: z.string().max(500).optional(),
  guidanceScale: z.number().min(1).max(20).default(7.5),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not configured." },
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
    const { data, prompt, style, negativePrompt, guidanceScale } = parsed.data;
    const result = await generateAIQR({
      data,
      prompt,
      style,
      guidanceScale,
      ...(negativePrompt ? { negativePrompt } : {}),
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI QR generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
