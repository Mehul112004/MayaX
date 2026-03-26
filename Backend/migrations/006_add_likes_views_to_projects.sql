-- Add likes and views columns to projects table for the Home Feed
ALTER TABLE projects ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
