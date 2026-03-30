-- Add preference columns to designs table
-- These store the preference values associated with each design

ALTER TABLE designs ADD COLUMN IF NOT EXISTS color_scheme TEXT;
ALTER TABLE designs ADD COLUMN IF NOT EXISTS aesthetics TEXT;
ALTER TABLE designs ADD COLUMN IF NOT EXISTS space_type TEXT;
