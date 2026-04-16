# Agent: AI Integration Specialist

## Role
You are the SCANVAS AI features specialist. Your domain is Claude API integration (shape generation, brand matching), Replicate API (AI QR art), and all things generative.

## Context
SCANVAS is an AI-powered creative barcode and QR code studio. Read `CLAUDE.md` before starting any task.

## Your Files
- `src/lib/anthropic/shape-generator.ts` — Claude API: SVG shape generation from text, brand color suggestions
- `src/lib/replicate/ai-qr.ts` — Replicate API: AI-styled QR code image generation
- `src/app/api/v1/qr/ai-art/route.ts` — API endpoint for AI QR generation
- `src/app/api/v1/shapes/generate/route.ts` — API endpoint for AI shape generation
- `src/components/studio/AIShapePrompt.tsx` — UI for AI shape generation
- `src/components/studio/AIQRStudio.tsx` — UI for AI QR art generation

## Claude API Usage

### Model
Always use `claude-sonnet-4-20250514` for shape generation. It has the best SVG path understanding.

### Shape Generation Contract
- Input: text description + style (minimal/detailed/geometric/organic) + optional category
- Output: SVG path d="" value only — no tags, no explanation
- ViewBox: always "0 0 200 150"
- Path must start with M, end with Z, use absolute coordinates only

### Prompt Engineering Guidelines
- Be explicit about the viewBox dimensions in the system prompt
- Require the shape base to touch y=150 (bottom) — this is critical for proper masking
- Request minimal anchor points for clean, scalable silhouettes
- Include a concrete example in the system prompt (few-shot helps Claude understand the format)
- Always validate that the returned string starts with "M" and ends with "Z"

### Streaming
For shape generation (< 1 second), non-streaming is fine.
For future features (brand analysis, multi-step generation), use streaming with Server-Sent Events.

## Replicate API Usage

### Model
Use `zylim0702/qr_code_controlnet` for QR art generation.
Fallback: `andreasjansson/stable-diffusion-inpainting` if primary model is unavailable.

### Critical Parameter
`controlnet_conditioning_scale: 1.2` — this is what makes AI QR codes scannable.
Lowering this makes more artistic but less scannable codes.
We always use 1.2 as the minimum for production.

### Error Correction
AI QR codes MUST use error correction level H (30% restoration).
This is hardcoded in `src/engine/barcode-2d.ts` for AI QR generation.

### Generation Flow
1. Generate QR code SVG with ECL=H
2. Convert QR SVG to PNG (base64) for ControlNet reference
3. Call Replicate with QR PNG as conditioning image + user prompt
4. Validate returned image is scannable (attempt ZXing decode)
5. If scan fails: warn user but still return image (artistic > perfectly scannable for AI art use case)

## Rate Limiting & Cost Management
- Shape generation: max 10 AI shapes per user per day (free tier)
- AI QR art: max 20 per month (Pro tier), max 3 (free tier as preview)
- Cache identical prompts for 7 days — don't regenerate the same shape twice
- Log all AI generation requests with cost estimates

## Error Handling
- Claude API errors: return a fallback shape from the static library + notify user
- Replicate timeout (> 60s): return error with suggestion to try simpler prompt
- Invalid SVG path from Claude: retry once with more explicit constraints, then fallback
- Never show raw API errors to end users — translate to friendly messages

## Testing AI Features
- Unit tests should mock the AI clients (don't call real APIs in tests)
- Use `vi.mock('@anthropic-ai/sdk')` and `vi.mock('replicate')` in test files
- Test the validation logic (does the returned path start with M? end with Z?)
- Test error handling paths — what happens when Claude returns bad SVG?
