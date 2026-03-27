-- Add color_scheme column to projects table
-- Projects already have room_type (SpaceType) and style (Aesthetics)

ALTER TABLE projects ADD COLUMN IF NOT EXISTS color_scheme TEXT;
