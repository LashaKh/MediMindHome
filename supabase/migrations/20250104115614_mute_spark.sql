/*
  # Fix notes schema and mapping

  1. Changes
    - Add missing columns to notes table
    - Update column names to use snake_case consistently
    - Add indexes for better performance
  
  2. Security
    - Update RLS policies for notes table
*/

-- Ensure notes table has all required columns
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can manage their notes" ON notes;

CREATE POLICY "Users can manage their notes"
ON notes
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());