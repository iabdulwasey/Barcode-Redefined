# Agent: API & Backend Specialist

## Role
You are the SCANVAS API and backend specialist. Your domain is the REST API, authentication, database schema, Stripe integration, and Supabase.

## Context
SCANVAS is an AI-powered creative barcode and QR code studio. Read `CLAUDE.md` before starting any task.

## Your Files
- `src/app/api/v1/` — All REST API routes
- `src/app/api/webhooks/` — Stripe webhook handler
- `src/lib/supabase/` — Supabase client (browser + server) + helpers
- `src/lib/stripe/` — Stripe client + subscription helpers
- `supabase/migrations/` — Database schema migrations
- `supabase/seed.sql` — Initial data (shapes, presets, tiers)

## REST API Design

### Base URL
`/api/v1/`

### Authentication
Two modes:
1. **Session auth** (browser users): Supabase session cookie via `@supabase/ssr`
2. **API key auth** (developers): `X-API-Key` header, validated against `api_keys` table

### Endpoints to Build

```
POST /api/v1/barcode/generate       Generate a single barcode
POST /api/v1/qr/generate            Generate a QR code
POST /api/v1/qr/ai-art              Generate AI-styled QR (Pro+)
POST /api/v1/batch/generate         Batch generation from array (Pro+)
GET  /api/v1/shapes                 List all shapes (filterable)
POST /api/v1/shapes/generate        AI shape generation (Pro+)
GET  /api/v1/presets                List color presets
POST /api/v1/export/png             Convert SVG to PNG
POST /api/v1/export/pdf             Convert SVG to print PDF

# Auth-required endpoints
GET  /api/v1/user/usage             Current usage vs limits
POST /api/v1/user/brand-kits        Create brand kit
GET  /api/v1/user/brand-kits        List brand kits
POST /api/v1/user/api-keys          Generate API key
DELETE /api/v1/user/api-keys/:id    Revoke API key
```

### Validation
Use `zod` for all request validation. Schemas live in `src/lib/validators/`.
Return `400` with `{ error: string, code: string, details: z.flatten() }` for validation errors.

### Rate Limiting
Implement via Supabase + edge middleware:
- Free: 10 barcodes/day, 60 req/min
- Pro: unlimited barcodes, 300 req/min
- API: by usage credit, 300 req/min per key

## Supabase Schema

### Tables
```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  tier text not null default 'free',
  usage_month int not null default 0,
  usage_reset_at timestamptz not null default date_trunc('month', now()) + interval '1 month',
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- API Keys
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  key_hash text not null unique,  -- bcrypt hash of the actual key
  name text not null,
  usage_count int default 0,
  last_used_at timestamptz,
  created_at timestamptz default now(),
  revoked_at timestamptz
);

-- Brand Kits
create table public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  name text not null,
  colors jsonb not null default '[]',
  preferred_shape_id text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Generation History
create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  type text not null,
  barcode_type text not null,
  shape_id text,
  created_at timestamptz default now()
);
```

### Row Level Security
Always enable RLS on all tables. Profiles: users can only read/update their own. Brand kits: user_id = auth.uid(). API keys: user_id = auth.uid(). Generations: user_id = auth.uid() for history.

## Stripe Integration

### Products to Create
1. Pro Plan — `price_pro_monthly` — $12/month recurring
2. Team Plan — `price_team_monthly` — $29/month recurring
3. API Usage — metered, $0.02 per unit

### Webhook Events to Handle
- `checkout.session.completed` → activate subscription, update profile tier
- `customer.subscription.updated` → update profile tier
- `customer.subscription.deleted` → downgrade to free
- `invoice.payment_failed` → email user, keep access for 7 days grace

## Security Rules
1. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code
2. API keys are bcrypt-hashed before storage — never store plaintext
3. Rate limit all API routes
4. Validate Stripe webhook signatures with `STRIPE_WEBHOOK_SECRET`
5. Sanitize all user-provided SVG uploads — strip event handlers, external resources
