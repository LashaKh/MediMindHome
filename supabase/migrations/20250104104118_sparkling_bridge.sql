/*
  # Update Patient Indexes and Policies
  
  1. Create index on admissionDate column
  2. Update RLS policies for patient management
*/

-- Create index for admissionDate if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_patients_admission_date ON patients ("admissionDate");

-- Update RLS policies
DROP POLICY IF EXISTS "Allow patient management" ON patients;
CREATE POLICY "Allow patient management" ON patients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());