-- ============================================================
-- NoorBedtime — Initial Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
create table if not exists public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  name                text,
  credits_balance     integer not null default 0,
  subscription_status text not null default 'free'
                        check (subscription_status in ('free','active','cancelled','expired')),
  subscription_plan   text check (subscription_plan in ('yearly')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- STORIES
-- ────────────────────────────────────────────────────────────
create table if not exists public.stories (
  id                      uuid primary key default uuid_generate_v4(),
  title                   text not null,
  slug                    text not null unique,
  age_tier                text not null check (age_tier in ('little_stars','rising_moons','young_explorers')),
  age_range               text not null,
  category                text,
  source_reference        text,
  source_detail           text,
  theme                   text,
  description             text,
  reading_time_minutes    integer,
  is_free                 boolean not null default false,
  cover_image_url         text,
  created_at              timestamptz not null default now()
);

create index if not exists stories_slug_idx on public.stories(slug);
create index if not exists stories_age_tier_idx on public.stories(age_tier);
create index if not exists stories_is_free_idx on public.stories(is_free);

-- ────────────────────────────────────────────────────────────
-- STORY PAGES
-- ────────────────────────────────────────────────────────────
create table if not exists public.story_pages (
  id                uuid primary key default uuid_generate_v4(),
  story_id          uuid not null references public.stories(id) on delete cascade,
  page_number       integer not null,
  text_content      text,
  illustration_url  text,
  unique (story_id, page_number)
);

create index if not exists story_pages_story_id_idx on public.story_pages(story_id);

-- ────────────────────────────────────────────────────────────
-- USER LIBRARY  (unlocked stories)
-- ────────────────────────────────────────────────────────────
create table if not exists public.user_library (
  user_id     uuid not null references public.users(id) on delete cascade,
  story_id    uuid not null references public.stories(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

create index if not exists user_library_user_id_idx on public.user_library(user_id);

-- ────────────────────────────────────────────────────────────
-- CREDIT TRANSACTIONS
-- ────────────────────────────────────────────────────────────
create table if not exists public.credit_transactions (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid not null references public.users(id) on delete cascade,
  amount                    integer not null,
  type                      text not null check (type in ('purchase','spend','refund','bonus')),
  description               text,
  lemon_squeezy_payment_id  text,
  created_at                timestamptz not null default now()
);

create index if not exists credit_transactions_user_id_idx on public.credit_transactions(user_id);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

alter table public.users enable row level security;
alter table public.stories enable row level security;
alter table public.story_pages enable row level security;
alter table public.user_library enable row level security;
alter table public.credit_transactions enable row level security;

-- Users: can only read/update their own row
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- Stories: anyone can read (public catalog)
create policy "stories_select_all" on public.stories for select using (true);

-- Story pages: free pages always readable; paid pages only for subscribers/unlockers
create policy "story_pages_select" on public.story_pages for select using (
  exists (select 1 from public.stories s where s.id = story_id and s.is_free = true)
  or auth.uid() in (
    select ul.user_id from public.user_library ul where ul.story_id = story_id
  )
  or auth.uid() in (
    select u.id from public.users u
    where u.id = auth.uid() and u.subscription_status = 'active'
  )
);

-- User library: users see only their own unlocked stories
create policy "user_library_select_own" on public.user_library for select using (auth.uid() = user_id);
create policy "user_library_insert_own" on public.user_library for insert with check (auth.uid() = user_id);

-- Credit transactions: own only
create policy "credit_tx_select_own" on public.credit_transactions for select using (auth.uid() = user_id);
