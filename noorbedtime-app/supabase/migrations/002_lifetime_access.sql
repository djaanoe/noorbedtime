-- Migration: Replace credit/subscription model with lifetime_access
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Drop policies that depend on old columns FIRST
DROP POLICY IF EXISTS "story_pages_select" ON public.story_pages;
DROP POLICY IF EXISTS "users_select" ON public.users;
DROP POLICY IF EXISTS "users_update" ON public.users;

-- 2. Add lifetime_access column
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS lifetime_access BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Drop old columns (safe now that policies are gone)
ALTER TABLE public.users
  DROP COLUMN IF EXISTS credits_balance,
  DROP COLUMN IF EXISTS subscription_status,
  DROP COLUMN IF EXISTS subscription_plan;

-- 4. Drop credit transactions table (no longer needed)
DROP TABLE IF EXISTS public.credit_transactions;

-- 5. Recreate RLS policy using lifetime_access
CREATE POLICY "story_pages_select" ON public.story_pages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.stories s
    WHERE s.id = story_id AND s.is_free = true
  )
  OR
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.lifetime_access = true
  )
);
