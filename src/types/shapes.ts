// ─── Shape System Types ───────────────────────────────────────────────────────

import type { BarcodeType } from "./barcode";

export type ShapeCategory =
  | "nature"
  | "animals"
  | "food-drink"
  | "people-culture"
  | "architecture"
  | "transport"
  | "tech-objects"
  | "abstract"
  | "custom"
  | "ai-generated";

export const SHAPE_CATEGORY_LABELS: Record<ShapeCategory, string> = {
  nature: "Nature",
  animals: "Animals",
  "food-drink": "Food & Drink",
  "people-culture": "People & Culture",
  architecture: "Architecture",
  transport: "Transport",
  "tech-objects": "Tech & Objects",
  abstract: "Abstract",
  custom: "Custom",
  "ai-generated": "AI Generated",
};

export interface Shape {
  id: string;
  name: string;
  category: ShapeCategory;
  tags: string[];
  // SVG path data — the d="" attribute value only
  svgPath: string;
  // Viewbox the path was designed for
  viewBox: string;
  // Which barcode types this shape works best with
  recommendedTypes: BarcodeType[];
  isCustom: boolean;
  isPremium: boolean;
  thumbnailUrl?: string;
  // Vertical trim: how much of the shape height should be the "art zone"
  // The rest becomes the protected plain-bar zone
  artZoneRatio: number; // 0.0 - 1.0, default 0.8
}

export interface ShapeConfig {
  id: string;
  customSvgPath?: string; // For user-uploaded shapes
  aiPrompt?: string; // For AI-generated shapes (stored for regeneration)
  scale: number; // Default: 1.0
  verticalAlign: "top" | "center" | "bottom";
}

export const DEFAULT_SHAPE_CONFIG: ShapeConfig = {
  id: "none",
  scale: 1,
  verticalAlign: "bottom",
};

// ─── AI Shape Generation ──────────────────────────────────────────────────────

export interface AIShapeRequest {
  prompt: string;
  style?: "minimal" | "detailed" | "geometric" | "organic";
  category?: ShapeCategory;
}

export interface AIShapeResponse {
  svgPath: string;
  viewBox: string;
  prompt: string;
  generatedAt: string;
}
