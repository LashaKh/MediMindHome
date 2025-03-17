/*
  # Fix reminder functionality

  1. Changes
    - Drop existing triggers and functions
    - Add improved reminder validation
    - Create proper indexes for reminder queries
    - Add RLS policies for reminder updates

  2. Security
    - Ensure proper validation of reminder data
    - Add proper RLS policies
*/

-- First drop all existing objects to avoid conflicts
DROP TRIGGER IF EXISTS validate_reminder_trigger ON patient_notes;
DROP TRIGGER IF EXISTS normalize_reminder_trigger ON patient_notes;
DROP FUNCTION IF EXISTS validate_reminder();
DROP FUNCTION IF EXISTS normalize_reminder();
DROP FUNCTION IF EXISTS update_note_reminder(UUID, JSONB);

-- Drop existing constraints
ALTER TABLE patient_notes
DROP CONSTRAINT IF EXISTS reminder_check;

-- Create improved reminder validation function
CREATE OR REPLACE FUNCTION validate_reminder()
RETURNS trigger AS $$
BEGIN
  IF NEW.reminder IS NOT NULL THEN
    -- Validate reminder structure
    IF NOT (
      jsonb_typeof(NEW.reminder) = 'object' AND
      NEW.reminder ? 'dueAt' AND
      NEW.reminder ? 'status' AND
      NEW.reminder->>'status' IN ('pending', 'completed', 'snoozed')
    ) THEN
      RAISE EXCEPTION 'Invalid reminder structure';
    END IF;

    -- Ensure dueAt is a valid timestamp
    IF NOT (
      NEW.reminder->>'dueAt' ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$'
    ) THEN
      RAISE EXCEPTION 'Invalid dueAt format';
    END IF;

    -- Add updatedAt if missing
    IF NOT (NEW.reminder ? 'updatedAt') THEN
      NEW.reminder = NEW.reminder || jsonb_build_object('updatedAt', now()::text);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reminder validation
CREATE TRIGGER validate_reminder_trigger
  BEFORE INSERT OR UPDATE ON patient_notes
  FOR EACH ROW
  EXECUTE FUNCTION validate_reminder();

-- Create improved reminder update function
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

  -- Return the updated reminder
  RETURN updated_reminder;
END;
$$;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_patient_notes_reminder_status;
DROP INDEX IF EXISTS idx_patient_notes_reminder_due_at;

-- Create indexes for efficient querying
CREATE INDEX idx_patient_notes_reminder_status 
ON patient_notes USING gin ((reminder->'status'));

CREATE INDEX idx_patient_notes_reminder_due_at
ON patient_notes USING gin ((reminder->'dueAt'));

-- Drop existing policies
DROP POLICY IF EXISTS "Enable reminder updates" ON patient_notes;

-- Add RLS policy for reminder updates
CREATE POLICY "Enable reminder updates"
ON patient_notes
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM patients p
    WHERE p.id = patient_id
    AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM patients p
    WHERE p.id = patient_id
    AND p.user_id = auth.uid()
  )
);