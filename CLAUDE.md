# SCANVAS — Claude Code Project Bible

> **The world's first AI-powered creative code studio.** Every barcode and QR code becomes a scannable work of art.

---

## Product Name

**SCANVAS** *(Scan + Canvas)*

Tagline: *"Where every scan is a canvas."*

Domain target: `scanvas.studio` / `scanvas.app`
Logo concept: A barcode morphing into a brush stroke.

---

## What We're Building

SCANVAS is a **web-based AI-powered barcode and QR code design studio** that transforms functional data codes into scannable works of art. It targets packaging designers, indie CPG brands, creative agencies, and developers.

### The 10x Gap We Fill

| Competitor Problem | SCANVAS Solution |
|--------------------|-----------------|
| barkod.studio: 3 barcode types, static shapes, SVG only, no AI | 20+ symbologies, AI shapes, all export formats, full AI layer |
| Canva AI QR: No 1D barcodes, no SVG control | Both 1D artistic barcodes AND 2D AI QR codes |
| TEC-IT: Professional but zero design capability | Professional + beautiful by default |
| No one: Scan validation, mockups, batch + API combined | All of it, in one platform |

---

## Tech Stack

```
Frontend:   Next.js 15 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4
UI:         shadcn/ui + Radix UI + Framer Motion + Lucide Icons
Backend:    Next.js API Routes + Edge Functions (Vercel)
Database:   Supabase (PostgreSQL + Auth + Row Level Security + Storage)
AI:         Anthropic Claude API (claude-sonnet-4-20250514) — shape gen, brand matching
            Replicate API (Flux ControlNet) — AI QR art generation
Barcode:    JsBarcode (1D rendering) + qrcode-generator (QR) + custom SVG engine
Export:     Sharp (PNG/WebP), PDFKit (print PDF + CMYK), Archiver (batch ZIP)
Scan Valid: ZXing WASM (in-browser barcode decoder for confidence scoring)
Payments:   Stripe (subscriptions + usage-based API metering)
Analytics:  PostHog (self-hosted or cloud)
Hosting:    Vercel (frontend + serverless) + Supabase + Cloudflare R2 (asset storage)
```

---

## Repository Structure

```
/
├── CLAUDE.md                    # This file — primary context for Claude Code
├── PLAN.md                      # Phase-by-phase build roadmap
├── .claude/
│   ├── agents/
│   │   ├── barcode-engine.md    # Sub-agent: barcode rendering engine
│   │   ├── ui-designer.md       # Sub-agent: UI/UX components
│   │   ├── ai-integration.md    # Sub-agent: AI features (Claude + Replicate)
│   │   ├── api-builder.md       # Sub-agent: REST API + auth
│   │   └── qa-validator.md      # Sub-agent: testing + scan validation
│   └── settings.json
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (studio)/            # Main studio routes
│   │   │   ├── page.tsx         # Generator studio (main workspace)
│   │   │   ├── shapes/page.tsx  # Shape gallery
│   │   │   ├── batch/page.tsx   # Batch generator
│   │   │   └── mockups/page.tsx # Product mockup preview
│   │   ├── (marketing)/         # Landing + pricing pages
│   │   │   ├── page.tsx         # Landing page
│   │   │   └── pricing/page.tsx
│   │   ├── (auth)/              # Auth flows
│   │   ├── dashboard/           # User dashboard
│   │   ├── api/                 # API routes
│   │   │   ├── v1/
│   │   │   │   ├── barcode/route.ts
│   │   │   │   ├── qr/route.ts
│   │   │   │   ├── qr/ai-art/route.ts
│   │   │   │   ├── batch/route.ts
│   │   │   │   └── shapes/route.ts
│   │   │   └── webhooks/stripe/route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── studio/              # Studio workspace components
│   │   │   ├── BarcodeCanvas.tsx
│   │   │   ├── ShapeSelector.tsx
│   │   │   ├── ColorSystem.tsx
│   │   │   ├── ExportPanel.tsx
│   │   │   ├── ScanValidator.tsx
│   │   │   └── TypeSelector.tsx
│   │   ├── ui/                  # shadcn/ui primitives
│   │   └── shared/              # Shared layout components
│   ├── engine/                  # Core barcode rendering logic
│   │   ├── barcode-1d.ts        # JsBarcode wrapper + SVG post-processing
│   │   ├── barcode-2d.ts        # QR/DataMatrix generation
│   │   ├── shape-masker.ts      # Apply SVG shapes to bar patterns
│   │   ├── svg-composer.ts      # Final SVG assembly + layering
│   │   ├── scan-validator.ts    # ZXing confidence scoring
│   │   ├── shapes/
│   │   │   ├── index.ts         # Shape registry
│   │   │   └── paths/           # SVG path data by category
│   │   └── export/
│   │       ├── svg-export.ts
│   │       ├── png-export.ts
│   │       ├── pdf-export.ts
│   │       └── batch-export.ts
│   ├── lib/
│   │   ├── supabase/            # Supabase client + server helpers
│   │   ├── stripe/              # Stripe client + webhook handlers
│   │   ├── anthropic/           # Claude API client + prompts
│   │   ├── replicate/           # Replicate AI client
│   │   └── utils.ts
│   └── types/
│       ├── barcode.ts           # Barcode type definitions
│       ├── shapes.ts            # Shape type definitions
│       └── api.ts               # API request/response types
├── public/
│   ├── shapes/                  # Shape preview thumbnails
│   └── mockups/                 # Product mockup templates
├── supabase/
│   ├── migrations/              # Database schema migrations
│   └── seed.sql                 # Initial shape/preset seed data
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Core Data Models

### Barcode Generation Request

```typescript
interface BarcodeRequest {
  // Data
  data: string;                  // The barcode content
  type: BarcodeType;             // 'EAN-13' | 'EAN-8' | 'UPC-A' | 'CODE-128' | 'QR' | etc.

  // Design
  shape: ShapeConfig;            // Shape mask to apply
  color: ColorConfig;            // Color system config
  background: string;            // Background color (default: transparent)

  // Export
  format: ExportFormat[];        // ['svg', 'png', 'pdf']
  width?: number;                // Output width in px (default: 400)
  height?: number;               // Output height in px (default: 300)
  dpi?: number;                  // For print export (default: 300)

  // QR-specific
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

type BarcodeType =
  | 'EAN-13' | 'EAN-8' | 'UPC-A' | 'UPC-E'
  | 'CODE-128' | 'CODE-39' | 'CODE-93'
  | 'ITF-14' | 'GS1-128' | 'CODABAR' | 'MSI'
  | 'ISBN' | 'ISSN' | 'PHARMACODE'
  | 'QR' | 'DATA-MATRIX' | 'PDF417' | 'AZTEC';

interface ShapeConfig {
  id: string;                    // Shape ID from registry
  customSvgPath?: string;        // For custom uploaded shapes
  aiPrompt?: string;             // For AI-generated shapes
  scale?: number;                // Shape scale factor (default: 1)
  verticalAlign?: 'top' | 'center' | 'bottom';
}

interface ColorConfig {
  mode: 'solid' | 'gradient' | 'pattern';
  primary: string;               // Hex color
  secondary?: string;            // Gradient end / pattern secondary
  gradientAngle?: number;        // Degrees (0-360)
  patternType?: 'stripes' | 'dots' | 'crosshatch';
  background: string;            // Background color
  cmyk?: { c: number; m: number; y: number; k: number };
}

type ExportFormat = 'svg' | 'png' | 'pdf' | 'eps' | 'webp';
```

### Shape Registry Entry

```typescript
interface Shape {
  id: string;                    // e.g., 'palm-tree'
  name: string;                  // Display name: 'Palm Tree'
  category: ShapeCategory;
  tags: string[];
  svgPath: string;               // The d="" attribute value
  viewBox: string;               // e.g., '0 0 200 150'
  recommendedTypes: BarcodeType[];
  isCustom: boolean;
  isPremium: boolean;
  thumbnailUrl?: string;
}

type ShapeCategory =
  | 'nature' | 'animals' | 'food-drink' | 'people-culture'
  | 'architecture' | 'transport' | 'tech-objects' | 'abstract'
  | 'custom' | 'ai-generated';
```

---

## Engine Architecture

### The Barcode Masking Pipeline

```
Input Data → Barcode Renderer → Raw SVG Bars
                                      ↓
                              Shape SVG Path
                                      ↓
                           SVG Clip Mask Composer
                                      ↓
                            Color System Applier
                                      ↓
                           Protected Zone Merger  ← (bottom scannable strip)
                                      ↓
                             Final SVG Output
                                      ↓
                    ┌─────────────────┼─────────────────┐
                   SVG              PNG (Sharp)       PDF (PDFKit)
```

**Key Rule — Protected Zone:** The bottom 20% of every 1D barcode must always render as plain black bars on white background, unmasked. This is the "guaranteed scan zone." The artistic shape mask applies only to the top 80%.

### Scanability Confidence Score

Uses ZXing compiled to WASM. After generation:
1. Render barcode to canvas at 300px width
2. Run ZXing decode attempt
3. If decoded: confidence = 100
4. If not decoded: confidence = 0, show warning
5. Also check: quiet zone width >= spec minimum, contrast ratio >= 3:1

---

## Design System

### Visual Language

- **Theme:** Dark-first, editorial-luxury. Think Stripe meets a creative studio.
- **Primary font:** Geist (Next.js default) or Inter — clean, modern
- **Accent font:** For headings — use font-feature-settings with tabular nums for barcode digit display
- **Primary color:** `#0A0A0A` (near-black background)
- **Accent:** `#6366F1` (indigo-500) — primary CTA
- **Success:** `#22C55E` (green-500) — scan confidence indicator
- **Warning:** `#F59E0B` (amber-500)
- **Error:** `#EF4444` (red-500)

### Key UI Components

1. **Studio Canvas** — Center workspace. Large preview area. Real-time rendering via requestAnimationFrame debounce.
2. **Panel System** — Left (input) / Center (preview) / Right (style + export) three-column layout on desktop, stacked on mobile.
3. **Shape Browser** — Filterable grid with category tabs. 4-column grid of shape thumbnails with hover preview. "Upload Custom" and "Generate with AI" CTAs sticky at bottom.
4. **Scan Meter** — Animated confidence bar at bottom of preview. Green = safe, yellow = marginal, red = will not scan.
5. **Export Drawer** — Bottom sheet/drawer with format toggle buttons, size selector, DPI for print, download/copy options.

---

## AI Integration Details

### Claude API — Shape Generation

```typescript
// src/lib/anthropic/shape-generator.ts
const SHAPE_SYSTEM_PROMPT = `You are an SVG path generator specialized in creating
clean silhouette shapes for use as barcode masks. Generate simple, bold, recognizable
SVG path data with these constraints:
- ViewBox: 0 0 200 150 (barcode aspect ratio)
- Shape should span most of the width and 70-80% of the height
- Path must be a single closed shape (no holes, no disconnected paths)
- Style: flat silhouette, no internal details, just the outer profile
- The shape base should align with the bottom of the viewbox for clean masking
Return ONLY the SVG path d="" value, nothing else.`;
```

### Replicate API — AI QR Art

Use `black-forest-labs/flux-1.1-pro-ultra` with ControlNet for QR conditioning.

```typescript
// src/lib/replicate/ai-qr.ts
interface AIQRRequest {
  url: string;                   // QR code content
  prompt: string;                // Art style prompt
  style: AIQRStyle;              // Preset style category
  negativePrompt?: string;
  guidanceScale?: number;        // Default: 7.5
  controlnetScale?: number;      // Default: 1.2 (higher = more scannable)
}

type AIQRStyle =
  | 'watercolor' | 'oil-painting' | 'pixel-art'
  | 'geometric' | 'neon' | 'vintage' | 'minimalist'
  | 'custom';
```

---

## Environment Variables

```bash
# .env.local (never commit this file)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SCANVAS

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Replicate (for AI QR art)
REPLICATE_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage (Cloudflare R2 or Supabase Storage)
STORAGE_BUCKET=scanvas-assets
```

---

## Monetization Tiers

| Tier | Price | Limits |
|------|-------|--------|
| **Free** | $0/mo | 10 barcodes/mo, basic shapes, SVG only, watermark on PNG |
| **Pro** | $12/mo | Unlimited barcodes, all shapes, all exports, 20 AI QRs/mo, batch (50/job), mockups |
| **Team** | $29/mo | Everything in Pro + 5 seats, brand kits, shared library |
| **API** | $0.02/req | REST API, usage-based, bulk discounts |
| **Enterprise** | Custom | White-label, custom shapes, SLA, on-prem |

---

## Development Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test

# Build
npm run build

# Supabase local
npx supabase start
npx supabase db push

# Generate Supabase types
npx supabase gen types typescript --local > src/types/database.ts
```

---

## Code Conventions

### TypeScript
- Strict mode always on
- No `any` — use `unknown` and narrow properly
- Export types from `src/types/` — never inline complex types in component files
- Prefer `interface` for public API shapes, `type` for unions/intersections

### React / Next.js
- Use Server Components by default — only add `'use client'` when genuinely needed (event handlers, browser APIs, animation)
- Co-locate component state with the smallest component that needs it
- API routes in `src/app/api/` — validate all inputs with Zod
- Streaming responses for long-running AI generation

### Engine Code
- Pure functions wherever possible — the barcode engine should have zero side effects
- All SVG manipulation: work with strings or DOM, never with innerHTML
- Validate barcode data before attempting to render — throw descriptive errors
- Protected zone rule: NEVER mask the bottom 20% of 1D barcodes

### Testing
- Unit tests for all engine functions (barcode generation, shape masking, color application)
- Integration tests for API routes
- Visual regression tests for SVG output using snapshots

---

## Key Product Decisions (Don't Reverse Without Good Reason)

1. **Protected zone is 20%** — enough for reliable scanning while maximizing art area.
2. **SVG-first rendering** — everything starts as SVG, rasterize only on export. Never rasterize for preview.
3. **Client-side preview** — barcode preview renders in the browser, not via API. API is for final export only. This makes the studio feel instantaneous.
4. **ZXing validation is mandatory** — we never ship a download without first confirming the barcode decodes.
5. **Shape masking uses SVG clipPath** — not canvas masking, not pixel manipulation. SVG clipPath is resolution-independent and clean.
6. **Dark theme default** — matches our premium positioning. Light mode available in settings.
7. **Supabase for auth + DB** — avoid building auth from scratch. RLS handles multi-tenancy.
8. **No server-side rendering for the studio** — the studio is a client-heavy SPA route. Use `loading.tsx` for the shell.

---

## Phase Checklist (See PLAN.md for Full Detail)

- [ ] Phase 1: Foundation — Project scaffold + barcode engine + 50 shapes + color system + studio UI
- [ ] Phase 2: Export + Validation — PNG/PDF export + scan validator + shape gallery + mobile responsive
- [ ] Phase 3: AI Layer — Claude shape gen + Replicate AI QR + brand color extraction
- [ ] Phase 4: Professional Tools — Batch gen + product mockups + GTIN validator + CMYK/print PDF
- [ ] Phase 5: Platform — Supabase auth + saved projects + brand kits + REST API + Stripe
- [ ] Phase 6: Ecosystem — Figma plugin + Shopify app + template marketplace + embeddable widget
- [ ] Phase 7: Launch — Landing page + Product Hunt + SEO + analytics

---

*This document is the ground truth for SCANVAS. Every Claude Code session starts here. Update this file whenever architectural decisions change.*
