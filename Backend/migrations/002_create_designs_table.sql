-- MayaX Designs Table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (backend uses service_role key)
CREATE POLICY "Service role has full access on designs"
  ON designs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow public read access to designs
CREATE POLICY "Public read access to designs"
  ON designs
  FOR SELECT
  USING (true);
