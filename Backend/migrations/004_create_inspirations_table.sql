-- MayaX Inspirations Table (liked projects from other users)
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS inspirations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate likes
  UNIQUE (user_id, project_id)
);

-- Index for fast user-based lookups
CREATE INDEX idx_inspirations_user_id ON inspirations(user_id);

-- Enable Row Level Security
ALTER TABLE inspirations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (backend uses service_role key)
CREATE POLICY "Service role has full access on inspirations"
  ON inspirations
  FOR ALL
  USING (true)
  WITH CHECK (true);
