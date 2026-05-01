-- Migration: Add pending_lifetime_access table for users who buy before registering

CREATE TABLE IF NOT EXISTS public.pending_lifetime_access (
  email text PRIMARY KEY,
  purchased_at timestamptz NOT NULL DEFAULT now()
);

-- Only service key (admin) can access — no public RLS policies
ALTER TABLE public.pending_lifetime_access ENABLE ROW LEVEL SECURITY;
