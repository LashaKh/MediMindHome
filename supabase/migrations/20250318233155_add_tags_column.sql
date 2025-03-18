/*
  # Add tags column to notes table

  1. Changes
    - Add tags JSONB column to notes table to support note tagging
    - Update index for better query performance
*/

-- Add tags column to notes table
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Create index for tags column
CREATE INDEX IF NOT EXISTS idx_notes_tags
ON notes USING gin (tags); 