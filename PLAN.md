# SCANVAS — Phase-by-Phase Build Plan

> The master roadmap for building SCANVAS from scaffold to launch.
> Every phase has explicit deliverables, acceptance criteria, and the sub-agent responsible.
>
> **Guiding principle:** Ship each phase to production. Don't build Phase 2 without Phase 1 running live.

---

## Phase Overview

| Phase | Duration | Theme | Status |
|-------|----------|-------|--------|
| **0** | Complete | Scaffold & Bible | ✅ Done |
| **1** | Week 1–2 | Foundation: Engine + 50 Shapes + Studio UI | 🟡 In progress |
| **2** | Week 3 | Export + Scan Validation + Shape Gallery | ⬜ |
| **3** | Week 4 | AI Layer (Claude shapes + Replicate QR art) | ⬜ |
| **4** | Week 5 | Professional Tools (Batch + Mockups + CMYK) | ⬜ |
| **5** | Week 6 | Platform (Auth + Brand Kits + REST API + Stripe) | ⬜ |
| **6** | Week 7 | Ecosystem (Figma plugin + Shopify + Marketplace) | ⬜ |
| **7** | Week 8 | Launch (Landing + SEO + Product Hunt + Analytics) | ⬜ |

---

## Phase 0 — Scaffold & Bible (Complete)

**Owner:** All agents
**Goal:** Ground the project in a shared source of truth before any code gets written.

### Deliverables
- [x] `CLAUDE.md` — project bible (tech stack, architecture, conventions, key decisions)
- [x] `PLAN.md` — this file
- [x] `.claude/agents/` — five specialized sub-agent definitions
- [x] `.claude/settings.json` — Claude Code configuration
- [x] Next.js 15 scaffold (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `vitest.config.ts`)
- [x] Repo structure: `src/app/`, `src/components/`, `src/engine/`, `src/lib/`, `src/types/`, `src/test/`
- [x] Type definitions (`src/types/barcode.ts`, `shapes.ts`, `api.ts`)
- [x] Engine skeleton (`barcode-1d.ts`, `barcode-2d.ts`, `shape-masker.ts`, shape registry with 30+ shapes)
- [x] Initial API routes (`/api/v1/barcode`, `/api/v1/shapes`)
- [x] Studio page shell with three-panel layout
- [x] Design system (Tailwind config + globals.css)
- [x] Test scaffolding with engine tests + utils tests
- [x] `.env.local.example` with all required secrets

### Exit Criteria
- `npm install` succeeds
- `npm run build` succeeds (currently scaffolded, will need real components to fully pass)
- `npm run test` runs and all existing tests pass
- Branch `claude/barkod-studio-platform-2REki` pushed to GitHub

---

## Phase 1 — Foundation: Engine + Studio MVP

**Owner:** barcode-engine + ui-designer
**Duration:** Days 1–10
**Goal:** Ship a working studio where a user can generate a scannable, artistic 1D barcode.

### 1.1 Complete Barcode Engine

**Files:**
- `src/engine/barcode-1d.ts` — enhance JsBarcode wrapper
- `src/engine/barcode-2d.ts` — QR code generation
- `src/engine/shape-masker.ts` — SVG clipPath pipeline
- `src/engine/svg-composer.ts` — final SVG assembly

**Tasks:**
1. Wire up `generate1DSVG` to actually call JsBarcode server-side with xmldom
2. Implement `composeBarcode` in `svg-composer.ts` — combines barcode SVG + shape mask + color
3. Handle the protected zone logic rigorously (test with every 1D type)
4. Implement `extractBarGroups` correctly (current version is a placeholder — needs proper bar extraction)
5. Add gradient + pattern fill support in `shape-masker.ts`
6. Write unit tests for every function (target > 90% coverage)

**Acceptance:**
- Generate an EAN-13 SVG with a palm-tree shape and red color
- Bottom 20% is plain black on white
- Top 80% is red bars clipped to palm silhouette
- SVG string is valid and renders correctly in a browser

### 1.2 Shape Registry Expansion (to 50+ shapes)

**Owner:** barcode-engine
**File:** `src/engine/shapes/index.ts`

Add the remaining shapes to hit 50+:
- Nature: flower, leaf, sun, moon, mushroom (5)
- Animals: dog, horse, fish, penguin, octopus (5)
- Food: banana, avocado, beer, burger, donut (5)
- People: dancer, yoga, skull, peace, hand (5)
- Architecture: castle, bridge, tent, windmill, pyramid (5)
- Transport: boat, train, motorcycle, scooter, hot-air-balloon (5)
- Tech: gear, laptop, phone, lightbulb, key (5)

Each new shape needs:
- SVG path data (single closed shape, 200×150 viewBox)
- Correct metadata (category, tags, recommendedTypes)
- Visual review (render it with real barcode data before committing)

### 1.3 Studio UI Components

**Owner:** ui-designer
**Files:** `src/components/studio/*.tsx`

Build real, interactive versions of:
- `TypeSelector.tsx` — dropdown with 1D / 2D groups + descriptions on hover
- `DataInput.tsx` — smart input with live validation + character count + check digit preview
- `BarcodeCanvas.tsx` — live SVG preview with zoom + background toggle
- `ShapeSelector.tsx` — scrollable thumbnail grid with category tabs + search
- `ColorSystem.tsx` — mode toggle (solid/gradient), native color picker, preset swatches
- `ScanMeter.tsx` — animated confidence bar (color-coded + numeric)
- `ExportPanel.tsx` — format toggles + size selector + download button

All components:
- Client components only where truly needed (event handlers, color picker)
- Framer Motion transitions for panel state changes
- Accessible: keyboard nav, aria labels, focus rings
- Responsive: stack vertically below `md:`

### 1.4 State Management

**File:** `src/hooks/useBarcodeState.ts`

Create a single React hook that manages studio state:
```typescript
const {
  type, setType,
  data, setData,
  shape, setShape,
  color, setColor,
  svg,             // computed
  scanConfidence,  // computed
  warnings,        // computed
} = useBarcodeState();
```

Debounce the regeneration: 150ms after the last keystroke / setting change.

### Exit Criteria
- User can open `/studio`, pick a 1D barcode type, enter valid data, pick a shape, pick a color, and see a live preview
- The SVG is scannable (ZXing decodes it — add minimal validator in this phase)
- Download SVG button works

---

## Phase 2 — Export + Scan Validation + Shape Gallery

**Owner:** barcode-engine + qa-validator + ui-designer
**Duration:** Days 11–17

### 2.1 Full Export Pipeline

**Files:** `src/engine/export/*.ts`

- `png-export.ts` — Sharp-based PNG export at any DPI
- `pdf-export.ts` — PDFKit export with proper metadata
- `webp-export.ts` — WebP for modern web use
- Client export: download individual SVG directly (no server round-trip)
- Server export (for PNG/PDF): POST SVG to `/api/v1/export/png` and stream back

**Acceptance:**
- 400px PNG export looks pixel-perfect
- 300 DPI print PDF exports at correct physical dimensions
- Large exports (2000px) don't block the UI

### 2.2 Scan Validation (ZXing WASM)

**File:** `src/engine/scan-validator.ts`

- Load `zxing-wasm` in the browser
- Render generated SVG to `<canvas>` at 300px width
- Attempt decode
- Compute confidence: decode success + contrast + quiet zone + gradient penalty
- Surface results in `ScanMeter` component in real-time

**Edge cases:**
- SVG with no bars → confidence 0
- Very complex shape → confidence may drop even with valid bars; show specific warnings
- QR codes at error correction H → different confidence formula

### 2.3 Shape Gallery Page

**File:** `src/app/shapes/page.tsx`

- Full-page gallery of all 50+ shapes
- Filters: category tabs, search, "recommended for [barcode type]"
- Hover preview on each shape with real barcode data
- Click → open in studio with that shape pre-selected
- "Upload Custom SVG" CTA (wired in Phase 3)
- "Generate with AI" CTA (wired in Phase 3)

### 2.4 Mobile Responsive

- Stack panels vertically below `md:`
- Bottom sheets for shape picker, color picker, export on mobile
- Touch-friendly hit areas (min 44px)
- Test on iOS Safari + Chrome Android

### Exit Criteria
- All three export formats work reliably
- Scan meter updates in real-time (< 300ms from setting change)
- Shape gallery is usable and performant (no jank scrolling 50+ thumbnails)
- Studio works on mobile

---

## Phase 3 — AI Layer

**Owner:** ai-integration + ui-designer
**Duration:** Days 18–24

### 3.1 AI Shape Generation

**Files:**
- `src/lib/anthropic/shape-generator.ts` (already scaffolded)
- `src/app/api/v1/shapes/generate/route.ts` — API endpoint
- `src/components/studio/AIShapePrompt.tsx` — UI input

**Flow:**
1. User clicks "Generate with AI" in shape browser
2. Modal opens: prompt input + style selector (minimal/detailed/geometric/organic)
3. POST to `/api/v1/shapes/generate` → Claude API → SVG path
4. Preview the generated shape applied to user's current barcode
5. "Accept" saves to user's personal shape library; "Regenerate" re-prompts Claude

**Rate limits:**
- Free: 3 AI shapes total (lifetime preview)
- Pro: 50/month
- Team: 200/month

### 3.2 AI QR Art

**Files:**
- `src/lib/replicate/ai-qr.ts` (already scaffolded)
- `src/app/api/v1/qr/ai-art/route.ts` — API endpoint
- `src/app/studio/ai-qr/page.tsx` — dedicated AI QR studio

**Flow:**
1. User enters URL/data + prompt + style preset
2. POST to `/api/v1/qr/ai-art` → Replicate Flux ControlNet → image URL
3. Show streaming progress (Replicate returns progress events)
4. Validate scannability with ZXing on the returned image
5. Download as PNG (AI QR output is raster, not SVG)

**Style presets:** watercolor, oil painting, pixel art, geometric, neon, vintage, minimalist, botanical + custom prompt

### 3.3 Brand Color Matcher

**Files:**
- `src/lib/anthropic/shape-generator.ts` — add `generateBrandColorSuggestions` (already scaffolded)
- `src/components/studio/BrandMatcher.tsx` — upload logo → Claude analyzes → color palette suggestions

**Flow:**
1. User uploads logo or enters brand name + description
2. Extract dominant colors (color-thief library, client-side)
3. Send to Claude with brand context
4. Claude returns 4 curated palettes that match brand aesthetic
5. User picks one, applied to current barcode

### Exit Criteria
- AI shape generation produces valid, scannable barcodes with custom silhouettes
- AI QR art is genuinely beautiful AND scans reliably
- Brand color matcher returns useful, scan-safe palettes

---

## Phase 4 — Professional Tools

**Owner:** barcode-engine + api-builder
**Duration:** Days 25–31

### 4.1 Batch Generator

**Files:**
- `src/app/batch/page.tsx` — upload UI
- `src/app/api/v1/batch/generate/route.ts` — batch API
- `src/engine/export/batch-export.ts` — ZIP assembly

**Flow:**
1. Upload CSV / Excel (via `papaparse` or `xlsx`)
2. Column mapping UI: which column is data? type? shape? color?
3. Preview grid (first 10 rows)
4. Generate → ZIP download with all barcodes in selected formats
5. Status updates via Server-Sent Events for large batches

**Pro tier:** 50 per job. Team tier: 500 per job. API tier: unlimited.

### 4.2 Product Mockup Generator

**Files:**
- `public/mockups/*.png` — pre-rendered product photos with barcode placement masks
- `src/app/mockups/page.tsx` — mockup preview UI
- `src/engine/mockup-composer.ts` — overlay SVG barcode on mockup

**Mockup templates (launch with 8):**
- Cardboard box (kraft, white, natural)
- Glass bottle (wine, beer, skincare)
- Aluminum can (energy drink, beer)
- Paper bag (coffee, takeaway)
- Flat sticker/label sheet
- Business card
- Magazine page
- T-shirt hang tag

### 4.3 GTIN Validator & Check Digit Calculator

**File:** `src/lib/validators/gtin.ts`

- Validate any GTIN-8, GTIN-12, GTIN-13, GTIN-14
- Auto-calculate check digit on input
- Warn if prefix doesn't match expected country (e.g., 500 = UK)
- Expose as a standalone tool at `/tools/gtin-validator`

### 4.4 CMYK + Print-Ready PDF

**File:** `src/engine/export/pdf-export.ts`

- PDF includes bleed area (3mm default)
- Crop marks at corners
- Color space: CMYK (not RGB)
- Embed font subsets for any text (ISBN barcode with text under it)
- Pantone color picker (optional, premium)

### Exit Criteria
- Batch generation of 50 barcodes from CSV produces valid ZIP in < 30 seconds
- At least 6 mockup templates look professional
- Print PDF output passes a print-shop preflight check (CMYK, bleed, 300 DPI)

---

## Phase 5 — Platform (Auth + Brand Kits + API + Stripe)

**Owner:** api-builder
**Duration:** Days 32–38

### 5.1 Supabase Auth

- Magic link sign-in (passwordless)
- Google OAuth (optional)
- Session handling via `@supabase/ssr`
- Profile creation trigger on `auth.users` insert

### 5.2 Database Schema

Run migrations to create:
- `profiles` (tier, usage, stripe customer id)
- `api_keys` (hashed keys + revocation)
- `brand_kits` (saved colors, shapes, logos)
- `generations` (history for analytics)
- Row Level Security enabled on every table

### 5.3 User Dashboard

**File:** `src/app/dashboard/page.tsx`

- Usage meter (X of Y barcodes this month)
- Recent generations history
- Saved brand kits
- API key management (for Team+ tier)
- Subscription + billing portal link

### 5.4 REST API

**Files:** `src/app/api/v1/*`

Complete all endpoints from the API agent spec:
- `POST /barcode/generate`
- `POST /qr/generate`
- `POST /qr/ai-art`
- `POST /batch/generate`
- `GET /shapes`
- `POST /shapes/generate`
- `POST /export/png`, `/export/pdf`
- `GET /user/usage`
- CRUD for brand kits and API keys

All protected by API key header (`X-API-Key`) OR session cookie.

### 5.5 Stripe Integration

- Checkout for Pro + Team plans
- Customer portal for self-service
- Webhook handler: sync subscription status to profile.tier
- Usage-based metering for API tier (meter billing event on each API call)

### Exit Criteria
- A user can sign up, upgrade to Pro, and their tier reflects correctly
- API keys work for external access
- Stripe webhooks correctly handle subscription lifecycle
- Brand kits are saved and retrievable

---

## Phase 6 — Ecosystem

**Owner:** api-builder + ui-designer
**Duration:** Days 39–45

### 6.1 Figma Plugin

- Plugin UI: type + data + shape + color
- "Insert" button places the generated barcode as vector nodes in Figma
- Uses the SCANVAS REST API under the hood
- Published on Figma Community

### 6.2 Shopify App

- OAuth install flow
- Bulk generate barcodes for all products
- Dashboard: view/regenerate barcode for any product
- Listed on Shopify App Store (free tier available)

### 6.3 Template Marketplace

- Community-submitted shapes and color presets
- Revenue share: 70% to creator, 30% to platform
- Moderation queue for new submissions
- Tags, ratings, downloads counter

### 6.4 Embeddable Widget

- `<script src="https://scanvas.studio/embed.js">` creates a mini generator
- White-label option (Team+)
- iframe-based with postMessage API

### Exit Criteria
- Figma plugin approved and available
- Shopify app passes app store review
- Marketplace has at least 10 launch submissions from team + early users

---

## Phase 7 — Launch

**Owner:** ui-designer + content
**Duration:** Days 46–52

### 7.1 Landing Page

**File:** `src/app/(marketing)/page.tsx`

- Hero: animated barcode → art transformation
- Feature grid: 6 key features with live demos
- Comparison table vs barkod.studio, Canva, QR Diffusion
- Pricing section with tier comparison
- Testimonials (from beta users)
- Final CTA: "Start creating for free"

### 7.2 SEO

- `sitemap.xml` + `robots.txt`
- Per-page metadata (already scaffolded in layout.tsx)
- Blog section: `/blog` with 5 launch articles
  - "The complete guide to artistic barcodes"
  - "Why your QR codes should be beautiful"
  - "How to design a scannable barcode"
  - "EAN-13 vs UPC-A: which to use"
  - "AI QR codes: the science behind scannable art"
- Structured data: SoftwareApplication schema

### 7.3 Analytics

- PostHog: page views, feature usage, funnel from landing → first barcode
- Stripe: MRR, churn, tier distribution
- Custom events: barcode type popularity, shape popularity, AI usage

### 7.4 Launch Day

- Product Hunt submission (scheduled Tuesday 12:01am PST)
- Hacker News "Show HN" post
- X/Twitter thread: 10 artistic barcode examples
- LinkedIn post targeting CPG brand managers
- Reddit: r/graphic_design, r/packaging, r/entrepreneur
- Designer communities: Dribbble, Behance showcase
- Email to waitlist (if we built one during Phase 6)

### Exit Criteria
- Landing page has 90+ Lighthouse score
- Launch hits Product Hunt top 5 Product of the Day (stretch: #1)
- 1,000+ signups in first week
- At least 20 paying customers by end of launch week

---

## Continuous Quality Gates

Applied to every phase before merging:

### Required Checks
```bash
npm run type-check  # Must pass
npm run lint        # Must pass
npm run test        # Must pass with no flaky tests
npm run build       # Must succeed
```

### Manual Checks
- [ ] Does the feature actually work end-to-end in the browser?
- [ ] Are there unit tests for the new engine code?
- [ ] Are there API tests for the new endpoints?
- [ ] Accessibility: can you use it with keyboard only?
- [ ] Mobile: does it work on iOS Safari?
- [ ] Does the scan validation pass? (never ship a broken barcode)

### Performance Budgets
- Studio page load: < 2 seconds (LCP)
- Barcode regeneration: < 150ms
- PNG export: < 500ms for 400×300
- Batch of 50: < 30 seconds end-to-end

---

## Risk Register

| Risk | Mitigation |
|------|-----------|
| ZXing WASM is too heavy for mobile | Lazy-load only when Scan Meter is visible; fallback to server-side validation |
| Replicate costs spike from free tier abuse | Hard caps in code + require auth for AI features |
| Complex shapes fail to scan reliably | Protected zone (20% plain bars) is our safety net; add shape-by-shape scan testing |
| JsBarcode doesn't support some symbology we promised | Write custom renderer for that symbology; fallback to TEC-IT API if truly needed |
| Stripe webhook race conditions | Idempotency keys + upsert on webhook handler |
| AI-generated SVG paths are malformed | Validate every returned path (starts with M, ends with Z, closes cleanly); retry once, fallback to static shape |

---

## Decision Log

### 2026-04-16 — Product name: SCANVAS
Chose SCANVAS (Scan + Canvas) over alternatives (BARDOT, KODEX, MARKODE). Reasons: clean association with both the utility (scan) and creativity (canvas), works for both 1D and 2D codes, domain likely available (.studio, .app), easy to pronounce, memorable.

### 2026-04-16 — Protected zone = 20%
Chose 20% over alternatives (10%, 30%). Reasons: 20% gives enough plain-bar area for reliable scanning across all major scanners while maximizing artistic canvas. Can be adjusted per shape via `artZoneRatio` metadata for shapes that need more or less.

### 2026-04-16 — SVG-first, no canvas for preview
Every preview is SVG. Canvas is only used inside ZXing validation and Sharp export. Rationale: SVG is resolution-independent, infinitely zoomable, and the natural output format for a vector-first product.

### 2026-04-16 — Claude Sonnet 4 for shape generation
Using `claude-sonnet-4-20250514`. Sonnet has enough reasoning capability for SVG path understanding without the latency/cost of Opus.

---

*This is a living document. Update it as decisions are made and phases complete.*
