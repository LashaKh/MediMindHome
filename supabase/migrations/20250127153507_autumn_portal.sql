/*
  # Fix reminder queries and indexing

  1. Changes
    - Drop existing GIN indexes
    - Create proper B-tree indexes for status and dueAt
    - Add proper constraints for JSONB validation

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Drop existing indexes
DROP INDEX IF EXISTS idx_patient_notes_reminder_status;
DROP INDEX IF EXISTS idx_patient_notes_reminder_due_at;

-- Create proper B-tree indexes for efficient querying
CREATE INDEX idx_patient_notes_reminder_status 
ON patient_notes (((reminder->>'status')));

CREATE INDEX idx_patient_notes_reminder_due_at
ON patient_notes (((reminder->>'dueAt')));

-- Add constraint to ensure proper JSONB structure
ALTER TABLE patient_notes
DROP CONSTRAINT IF EXISTS reminder_check;

ALTER TABLE patient_notes
ADD CONSTRAINT reminder_check CHECK (
  reminder IS NULL OR (
    jsonb_typeof(reminder) = 'object' AND
    reminder ? 'dueAt' AND
    reminder ? 'status' AND
    reminder->>'status' IN ('pending', 'completed', 'snoozed')
  )
);

-- Create function to handle reminder updates
CREATE OR REPLACE FUNCTION update_note_reminder(
  note_id UUID,
  reminder_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_reminder JSONB;
BEGIN
  -- Validate input
  IF NOT (
    jsonb_typeof(reminder_data) = 'object' AND
    reminder_data ? 'dueAt' AND
    reminder_data ? 'status' AND
    reminder_data->>'status' IN ('pending', 'completed', 'snoozed')
  ) THEN
    RAISE EXCEPTION 'Invalid reminder data';
  END IF;

  -- Add updatedAt timestamp
  updated_reminder = reminder_data || jsonb_build_object('updatedAt', now()::text);

  -- Update the reminder
  UPDATE patient_notes
  SET reminder = updated_reminder
  WHERE id = note_id
  AND (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_notes.patient_id
      AND p.user_id = auth.uid()
    )
  )
  RETURNING reminder INTO updated_reminder;

  RETURN updated_reminder;
END;
$$;