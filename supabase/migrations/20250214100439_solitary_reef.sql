-- Add medical_history column to patients table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'patients' 
    AND column_name = 'medical_history'
  ) THEN
    ALTER TABLE patients 
    ADD COLUMN medical_history jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index for medical_history
CREATE INDEX IF NOT EXISTS idx_patients_medical_history 
ON patients USING gin(medical_history);

-- Add validation trigger for medical_history structure
CREATE OR REPLACE FUNCTION validate_medical_history()
RETURNS trigger AS $$
BEGIN
  IF NEW.medical_history IS NOT NULL THEN
    -- Validate structure
    IF NOT (
      jsonb_typeof(NEW.medical_history) = 'object' AND
      (NEW.medical_history->>'anamnesis' IS NULL OR jsonb_typeof(NEW.medical_history->'anamnesis') = 'string') AND
      (NEW.medical_history->>'familyHistory' IS NULL OR jsonb_typeof(NEW.medical_history->'familyHistory') = 'string') AND
      (NEW.medical_history->>'pastConditions' IS NULL OR jsonb_typeof(NEW.medical_history->'pastConditions') = 'array') AND
      (NEW.medical_history->>'allergies' IS NULL OR jsonb_typeof(NEW.medical_history->'allergies') = 'array') AND
      (NEW.medical_history->>'medications' IS NULL OR jsonb_typeof(NEW.medical_history->'medications') = 'array')
    ) THEN
      RAISE EXCEPTION 'Invalid medical_history structure';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for medical_history validation
DROP TRIGGER IF EXISTS validate_medical_history_trigger ON patients;
CREATE TRIGGER validate_medical_history_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION validate_medical_history();