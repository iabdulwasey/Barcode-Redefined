// ─── API Types ────────────────────────────────────────────────────────────────

export interface APIResponse<T> {
  data?: T;
  error?: string;
  code?: string;
}

export interface APIError {
  error: string;
  code: string;
  details?: unknown;
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

// ─── API v1 Endpoints ─────────────────────────────────────────────────────────

export interface V1BarcodeGenerateRequest {
  data: string;
  type: string;
  shapeId?: string;
  color?: {
    primary: string;
    background?: string;
    mode?: "solid" | "gradient";
    secondary?: string;
  };
  format?: ("svg" | "png" | "pdf")[];
  width?: number;
  height?: number;
  dpi?: number;
}

export interface V1BarcodeGenerateResponse {
  svg?: string;
  pngUrl?: string;
  pdfUrl?: string;
  scanConfidence: number;
  warnings: string[];
}

export interface V1AIQRRequest {
  data: string;
  prompt: string;
  style?: string;
  negativePrompt?: string;
  guidanceScale?: number;
}

export interface V1AIQRResponse {
  imageUrl: string;
  scanConfidence?: number;
  generationId: string;
}

export interface V1BatchRequest {
  items: Array<{
    data: string;
    type?: string;
    filename?: string;
  }>;
  shapeId?: string;
  color?: {
    primary: string;
    background?: string;
  };
  format?: ("svg" | "png" | "pdf")[];
}

export interface V1BatchResponse {
  jobId: string;
  status: "processing" | "complete" | "failed";
  downloadUrl?: string;
  count: number;
}

// ─── Subscription Tiers ───────────────────────────────────────────────────────

export type SubscriptionTier = "free" | "pro" | "team" | "enterprise";

export interface TierLimits {
  barcodesPerMonth: number | null; // null = unlimited
  aiQRPerMonth: number | null;
  batchSizeMax: number | null;
  shapesAccess: "basic" | "all";
  exportsAllowed: ("svg" | "png" | "pdf" | "eps" | "webp")[];
  watermark: boolean;
  apiAccess: boolean;
  seats: number | null;
  brandKits: number | null;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    barcodesPerMonth: 10,
    aiQRPerMonth: 0,
    batchSizeMax: null,
    shapesAccess: "basic",
    exportsAllowed: ["svg"],
    watermark: true,
    apiAccess: false,
    seats: 1,
    brandKits: null,
  },
  pro: {
    barcodesPerMonth: null,
    aiQRPerMonth: 20,
    batchSizeMax: 50,
    shapesAccess: "all",
    exportsAllowed: ["svg", "png", "pdf", "webp"],
    watermark: false,
    apiAccess: false,
    seats: 1,
    brandKits: 3,
  },
  team: {
    barcodesPerMonth: null,
    aiQRPerMonth: 100,
    batchSizeMax: 500,
    shapesAccess: "all",
    exportsAllowed: ["svg", "png", "pdf", "eps", "webp"],
    watermark: false,
    apiAccess: true,
    seats: 5,
    brandKits: null,
  },
  enterprise: {
    barcodesPerMonth: null,
    aiQRPerMonth: null,
    batchSizeMax: null,
    shapesAccess: "all",
    exportsAllowed: ["svg", "png", "pdf", "eps", "webp"],
    watermark: false,
    apiAccess: true,
    seats: null,
    brandKits: null,
  },
};
