/**
 * GET /api/v1/shapes
 *
 * Returns the full shape registry.
 * Used by external API consumers and the Figma plugin.
 */

import { NextResponse } from "next/server";
import { SHAPES, getShapesByCategory } from "@/engine/shapes";
import type { APIResponse } from "@/types/api";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let shapes = SHAPES;

  if (category) {
    shapes = getShapesByCategory(category as Parameters<typeof getShapesByCategory>[0]);
  }

  if (q) {
    const query = q.toLowerCase();
    shapes = shapes.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.tags.some((t) => t.includes(query))
    );
  }

  return NextResponse.json(
    {
      data: {
        shapes: shapes.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          tags: s.tags,
          isPremium: s.isPremium,
          recommendedTypes: s.recommendedTypes,
          ...(s.thumbnailUrl ? { thumbnailUrl: s.thumbnailUrl } : {}),
        })),
        total: shapes.length,
      },
    } satisfies APIResponse<{
      shapes: Array<{
        id: string;
        name: string;
        category: string;
        tags: string[];
        isPremium: boolean;
        recommendedTypes: string[];
        thumbnailUrl?: string;
      }>;
      total: number;
    }>
  );
}
