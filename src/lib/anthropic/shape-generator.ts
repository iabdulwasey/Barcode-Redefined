/**
 * AI Shape Generator
 *
 * Uses the Claude API to generate SVG path data from text descriptions.
 * The output is used as a barcode mask shape in the SCANVAS engine.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { AIShapeRequest, AIShapeResponse } from "@/types/shapes";

const SYSTEM_PROMPT = `You are an SVG path data generator specialized in creating clean silhouette shapes
for use as barcode masks in a creative barcode design tool.

Your task: generate SVG path d="" data for a given shape description.

Hard constraints:
1. ViewBox is always "0 0 200 150" (width=200, height=150)
2. The shape should span at least 120px of width (60% of 200)
3. The shape base should sit at or very near y=150 (bottom of viewBox)
4. Return ONLY the SVG path d attribute value — no tags, no quotes, no explanation
5. The path must be a single closed shape (must end with Z)
6. No internal holes, no disconnected subpaths — one solid silhouette
7. Use only M, L, C, Q, A, Z commands (no relative commands like m, l, c)
8. Make the shape recognizable at small sizes (avoid excessive detail)

Style guide by style parameter:
- "minimal": Simple geometric approximation, few anchor points (8-15 points)
- "detailed": More organic, natural curves (15-30 points)
- "geometric": Straight lines and angular corners only (L commands only)
- "organic": Smooth bezier curves throughout (C commands)

Example of a correct "minimal" mountain output:
M0,150 L60,60 L80,85 L100,30 L120,85 L140,55 L200,150 Z

Do not add any other text. Only the path data string.`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export async function generateAIShape(
  request: AIShapeRequest
): Promise<AIShapeResponse> {
  const style = request.style ?? "minimal";
  const userPrompt = `Generate a ${style} SVG silhouette path for: "${request.prompt}"
${request.category ? `Category hint: ${request.category}` : ""}
Return only the path d="" value.`;

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const content = message.content[0];
  if (!content || content.type !== "text") {
    throw new Error("Claude did not return text content for shape generation.");
  }

  const pathData = content.text.trim();

  // Validate the path data looks like SVG path commands
  if (!pathData.startsWith("M") || !pathData.endsWith("Z")) {
    throw new Error(
      `Invalid SVG path returned by Claude: does not start with M or end with Z. Got: ${pathData.slice(0, 100)}`
    );
  }

  return {
    svgPath: pathData,
    viewBox: "0 0 200 150",
    prompt: request.prompt,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate brand-matched color suggestions using Claude.
 * Takes a brand description or extracted colors and returns palette suggestions.
 */
export async function generateBrandColorSuggestions(input: {
  brandName?: string;
  brandDescription?: string;
  extractedColors?: string[]; // Hex colors from logo
}): Promise<Array<{ name: string; primary: string; secondary?: string; background: string }>> {
  const prompt = `A designer is creating an artistic barcode for a brand.
Brand info:
${input.brandName ? `- Name: ${input.brandName}` : ""}
${input.brandDescription ? `- Description: ${input.brandDescription}` : ""}
${input.extractedColors?.length ? `- Extracted brand colors: ${input.extractedColors.join(", ")}` : ""}

Suggest 4 barcode color schemes that match this brand.
Return a JSON array only. Each item: { "name": string, "primary": "#hexcolor", "secondary": "#hexcolor (optional)", "background": "#hexcolor" }
Ensure sufficient contrast for barcode scanning (primary vs background contrast ratio > 3:1).
Return only the JSON array, no markdown, no explanation.`;

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (!content || content.type !== "text") {
    throw new Error("Claude did not return color suggestions.");
  }

  try {
    const parsed = JSON.parse(content.text.trim()) as unknown;
    if (!Array.isArray(parsed)) throw new Error("Not an array");
    return parsed as Array<{ name: string; primary: string; secondary?: string; background: string }>;
  } catch {
    throw new Error(`Failed to parse color suggestions from Claude: ${content.text.slice(0, 200)}`);
  }
}
