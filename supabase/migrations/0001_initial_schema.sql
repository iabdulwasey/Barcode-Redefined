-- SCANVAS Initial Schema
-- Creates profiles, api_keys, brand_kits, generations tables with RLS enabled

-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  tier text not null default 'free' check (tier in ('free', 'pro', 'team', 'enterprise')),
  usage_month int not null default 0,
  usage_reset_at timestamptz not null default (date_trunc('month', now()) + interval '1 month'),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── API Keys ─────────────────────────────────────────────────────────────────
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  key_hash text not null unique,
  key_prefix text not null, -- First 8 chars for display (sk_scanvas_abc12345...)
  name text not null,
  usage_count bigint not null default 0,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index api_keys_user_id_idx on public.api_keys(user_id);
create index api_keys_key_hash_idx on public.api_keys(key_hash) where revoked_at is null;

alter table public.api_keys enable row level security;

create policy "Users can view own API keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can create own API keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can revoke own API keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

-- ─── Brand Kits ───────────────────────────────────────────────────────────────
create table if not exists public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  colors jsonb not null default '[]'::jsonb,
  preferred_shape_id text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index brand_kits_user_id_idx on public.brand_kits(user_id);

alter table public.brand_kits enable row level security;

create policy "Users can manage own brand kits"
  on public.brand_kits for all
  using (auth.uid() = user_id);

-- ─── Generations History ──────────────────────────────────────────────────────
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  api_key_id uuid references public.api_keys(id) on delete set null,
  type text not null, -- 'barcode' | 'qr' | 'ai-qr' | 'ai-shape' | 'batch'
  barcode_type text,
  shape_id text,
  data_preview text, -- First 50 chars of input data (for history display)
  export_format text, -- 'svg' | 'png' | 'pdf'
  created_at timestamptz not null default now()
);

create index generations_user_id_created_at_idx on public.generations(user_id, created_at desc);
create index generations_api_key_id_idx on public.generations(api_key_id);

alter table public.generations enable row level security;

create policy "Users can view own generations"
  on public.generations for select
  using (auth.uid() = user_id);

-- ─── AI Shape Cache ───────────────────────────────────────────────────────────
-- Cache AI-generated shapes by prompt hash to avoid re-billing for identical prompts
create table if not exists public.ai_shape_cache (
  prompt_hash text primary key,
  prompt text not null,
  style text not null,
  svg_path text not null,
  view_box text not null,
  generation_count int not null default 1,
  last_used_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ─── Helper Functions ─────────────────────────────────────────────────────────
create or replace function public.increment_usage(user_id_input uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set usage_month = usage_month + 1,
      updated_at = now()
  where id = user_id_input;
end;
$$;

create or replace function public.reset_monthly_usage()
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set usage_month = 0,
      usage_reset_at = date_trunc('month', now()) + interval '1 month'
  where usage_reset_at <= now();
end;
$$;
