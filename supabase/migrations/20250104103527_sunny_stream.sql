/*
  # Fix Column Names
  
  1. Changes
    - Rename admission_date to admissionDate for consistency
    - Update related policies
*/

-- Rename the column
ALTER TABLE patients 
  RENAME COLUMN admission_date TO "admissionDate";

-- Recreate the patients table index
DROP INDEX IF EXISTS idx_patients_admission_date;
CREATE INDEX idx_patients_admission_date ON patients ("admissionDate");

-- Update RLS policies to use the new column name
DROP POLICY IF EXISTS "Allow patient management" ON patients;
CREATE POLICY "Allow patient management" ON patients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());