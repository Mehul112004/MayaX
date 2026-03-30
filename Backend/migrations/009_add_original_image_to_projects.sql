-- Add original_image column to projects table
-- A project is a final AI-generated image from a base image (user's home space)

ALTER TABLE projects ADD COLUMN IF NOT EXISTS original_image TEXT;
