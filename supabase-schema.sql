-- ==============================================================================
-- Supabase Schema for Adhitya Hermawan Portfolio & CMS
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create table for portfolio content (JSON storage)
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can read portfolio data
DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_content;
CREATE POLICY "Allow public read access" ON public.portfolio_content
  FOR SELECT USING (true);

-- 4. Policy: Allow insert/update (or service role / anon update)
DROP POLICY IF EXISTS "Allow public insert/update" ON public.portfolio_content;
CREATE POLICY "Allow public insert/update" ON public.portfolio_content
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Create Storage Bucket for asset uploads (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies: Allow public read and authenticated/anon uploads
DROP POLICY IF EXISTS "Public Read Assets" ON storage.objects;
CREATE POLICY "Public Read Assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Public Upload Assets" ON storage.objects;
CREATE POLICY "Public Upload Assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Public Update Assets" ON storage.objects;
CREATE POLICY "Public Update Assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-assets');
