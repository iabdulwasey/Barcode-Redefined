# SCANVAS

> **AI-powered creative barcode & QR code studio.** Where every scan is a canvas.

SCANVAS transforms functional barcodes and QR codes into scannable works of art. Designed for packaging designers, indie CPG brands, creative agencies, and developers.

## What's Inside

- **20+ barcode symbologies**: EAN-13, UPC-A/E, Code 128/39/93, ITF-14, GS1-128, ISBN, QR, Data Matrix, PDF417, Aztec, and more
- **50+ artistic shapes**: Nature, animals, food, architecture, transport, tech, abstract — plus custom SVG upload
- **AI-powered generation**: Claude generates custom shapes from text prompts. Replicate + Flux ControlNet creates scannable QR art.
- **Professional export**: SVG, PNG, PDF (CMYK + bleed for print), batch ZIP
- **Scan validation**: Real-time ZXing confidence scoring — never ship a broken barcode
- **REST API**: Full programmatic access with API key auth + usage-based billing

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys (Supabase, Anthropic, Replicate, Stripe)

# Run the dev server
npm run dev

# Open http://localhost:3000
```

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for the full architecture and design decisions.
See [PLAN.md](./PLAN.md) for the phase-by-phase build roadmap.

```
src/
├── app/           # Next.js 15 App Router pages + API routes
├── components/    # React UI components
├── engine/        # Barcode generation + shape masking + export
├── lib/           # Integrations (Anthropic, Replicate, Stripe, Supabase)
└── types/         # TypeScript type definitions
```

## Development Commands

```bash
npm run dev         # Start dev server with Turbopack
npm run build       # Production build
npm run type-check  # TypeScript check
npm run lint        # ESLint
npm run test        # Run Vitest unit tests
npm run test:ui     # Vitest UI
npm run db:push     # Push Supabase migrations
```

## Tech Stack

Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS 4 · Supabase · Anthropic Claude · Replicate · Stripe · Vercel

## License

Proprietary. All rights reserved.
