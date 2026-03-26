-- Create Camera Preferences Categories Table
CREATE TABLE IF NOT EXISTS camera_preference_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  display_label TEXT NOT NULL,
  icon_name TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE camera_preference_categories ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (backend uses service_role key)
CREATE POLICY "Service role has full access"
  ON camera_preference_categories
  FOR ALL
  USING (true)
  WITH CHECK (true);
