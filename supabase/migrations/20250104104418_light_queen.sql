/*
  # Fix patients table schema

  1. Changes
    - Add admission_date column if it doesn't exist
    - Create index on admission_date
    - Update RLS policies
*/

DO $$ 
BEGIN
  -- Add admission_date column if it doesn't exist
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

-- Create index for admission_date
DROP INDEX IF EXISTS idx_patients_admission_date;
CREATE INDEX idx_patients_admission_date ON patients (admission_date);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow patient management" ON patients;
CREATE POLICY "Allow patient management" ON patients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());