/*
  # Fix column naming consistency

  1. Changes
    - Ensure consistent column naming between database and application
    - Update indexes to match column names
    - Update policies to use correct column names

  2. Security
    - Maintain existing RLS policies
*/

-- Ensure columns use snake_case consistently
ALTER TABLE patients 
  RENAME COLUMN "admissionDate" TO admission_date;

-- Recreate indexes with consistent naming
DROP INDEX IF EXISTS idx_patients_admission_date;
CREATE INDEX idx_patients_admission_date ON patients (admission_date);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow patient management" ON patients;
CREATE POLICY "Allow patient management" ON patients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());