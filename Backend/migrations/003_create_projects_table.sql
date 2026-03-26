-- MayaX Projects Table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  room_type TEXT,        -- e.g. 'Living Room', 'Bedroom', 'Kitchen'
  style TEXT,            -- e.g. 'Minimalist', 'Bohemian', 'Scandinavian'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user-based lookups
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (backend uses service_role key)
CREATE POLICY "Service role has full access on projects"
  ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);
