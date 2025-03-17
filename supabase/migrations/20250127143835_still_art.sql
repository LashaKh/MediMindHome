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

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_patient_notes_reminder_status 
ON patient_notes ((reminder->>'status'))
WHERE reminder IS NOT NULL;

-- Create function to validate reminder updates
CREATE OR REPLACE FUNCTION validate_reminder()
RETURNS trigger AS $$
BEGIN
  IF NEW.reminder IS NOT NULL THEN
    IF NOT (
      NEW.reminder ? 'dueAt' AND
      NEW.reminder ? 'status' AND
      NEW.reminder->>'status' IN ('pending', 'completed', 'snoozed')
    ) THEN
      RAISE EXCEPTION 'Invalid reminder format';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reminder validation
DROP TRIGGER IF EXISTS validate_reminder_trigger ON patient_notes;
CREATE TRIGGER validate_reminder_trigger
  BEFORE INSERT OR UPDATE ON patient_notes
  FOR EACH ROW
  EXECUTE FUNCTION validate_reminder();