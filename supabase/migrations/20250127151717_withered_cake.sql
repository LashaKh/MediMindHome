/*
  # Add reminder support to patient notes

  1. Schema Changes
    - Add reminder JSONB column to patient_notes table
    - Add indexes for efficient querying
    - Add constraints for data validation

  2. Functions
    - Create function to handle reminder updates
    - Create function to normalize reminder data

  3. Triggers
    - Add trigger for reminder data validation
*/

-- Add reminder column with proper JSONB type and validation
ALTER TABLE patient_notes
DROP CONSTRAINT IF EXISTS reminder_check;

-- Add check constraint for reminder structure
ALTER TABLE patient_notes
ADD CONSTRAINT reminder_check CHECK (
  reminder IS NULL OR (
    reminder ? 'dueAt' AND
    reminder ? 'status' AND
    reminder->>'status' IN ('pending', 'completed', 'snoozed')
  )
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_patient_notes_reminder_status 
ON patient_notes ((reminder->>'status'))
WHERE reminder IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_patient_notes_reminder_due_at
ON patient_notes ((reminder->>'dueAt'))
WHERE reminder IS NOT NULL;

-- Create function to validate and normalize reminder data
CREATE OR REPLACE FUNCTION normalize_reminder()
RETURNS trigger AS $$
BEGIN
  IF NEW.reminder IS NOT NULL THEN
    -- Ensure all required fields exist
    IF NOT (
      NEW.reminder ? 'dueAt' AND
      NEW.reminder ? 'status'
    ) THEN
      RAISE EXCEPTION 'Invalid reminder format: missing required fields';
    END IF;

    -- Validate status
    IF NOT (NEW.reminder->>'status' IN ('pending', 'completed', 'snoozed')) THEN
      NEW.reminder = jsonb_set(NEW.reminder, '{status}', '"pending"');
    END IF;

    -- Ensure updatedAt is set
    IF NOT (NEW.reminder ? 'updatedAt') THEN
      NEW.reminder = jsonb_set(NEW.reminder, '{updatedAt}', to_jsonb(now()::text));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reminder normalization
DROP TRIGGER IF EXISTS normalize_reminder_trigger ON patient_notes;
CREATE TRIGGER normalize_reminder_trigger
  BEFORE INSERT OR UPDATE ON patient_notes
  FOR EACH ROW
  EXECUTE FUNCTION normalize_reminder();

-- Create function to handle reminder updates
CREATE OR REPLACE FUNCTION update_note_reminder(
  note_id UUID,
  reminder_data JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF NOT (
    reminder_data ? 'dueAt' AND
    reminder_data ? 'status' AND
    reminder_data->>'status' IN ('pending', 'completed', 'snoozed')
  ) THEN
    RAISE EXCEPTION 'Invalid reminder data format';
  END IF;

  -- Update the reminder
  UPDATE patient_notes
  SET reminder = reminder_data || jsonb_build_object('updatedAt', now()::text)
  WHERE id = note_id
  AND (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_notes.patient_id
      AND p.user_id = auth.uid()
    )
  );

  -- Notify clients of the update
  PERFORM pg_notify(
    'reminder_updated',
    json_build_object(
      'note_id', note_id,
      'reminder', reminder_data
    )::text
  );
END;
$$;