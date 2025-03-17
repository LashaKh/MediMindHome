/*
  # Fix patients table schema

  1. Changes
    - Ensure admission_date column exists with proper default
    - Create index on admission_date
    - Update RLS policies
*/

-- Ensure admission_date column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'patients' 
    AND column_name = 'admission_date'
  ) THEN
    ALTER TABLE patients 
    ADD COLUMN admission_date timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing rows to have admission_date if null
UPDATE patients 
SET admission_date = created_at 
WHERE admission_date IS NULL;

-- Make admission_date non-nullable
ALTER TABLE patients 
ALTER COLUMN admission_date SET NOT NULL;

-- Create index for admission_date
DROP INDEX IF EXISTS idx_patients_admission_date;
CREATE INDEX idx_patients_admission_date ON patients (admission_date);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow patient management" ON patients;
CREATE POLICY "Allow patient management" ON patients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());