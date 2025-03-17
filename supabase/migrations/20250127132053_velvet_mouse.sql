/*
  # Final Patient System Fix

  1. Changes
    - Drop and recreate all patient-related RLS policies
    - Add proper status validation
    - Fix user_id handling in RLS policies
    - Add proper indexes for performance

  2. Security
    - Ensures proper user_id checks
    - Validates status values
    - Protects patient data access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable patient read access" ON patients;
DROP POLICY IF EXISTS "Enable patient insert" ON patients;
DROP POLICY IF EXISTS "Enable patient update" ON patients;
DROP POLICY IF EXISTS "Enable patient delete" ON patients;

-- Create simplified RLS policies for patients
CREATE POLICY "Allow patient operations"
ON patients FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Drop and recreate status check constraint
ALTER TABLE patients 
DROP CONSTRAINT IF EXISTS patients_status_check;

ALTER TABLE patients
ADD CONSTRAINT patients_status_check 
CHECK (status IN ('unstable', 'stable', 'discharge-ready'));

-- Update any existing records with invalid status
UPDATE patients 
SET status = 'stable'
WHERE status NOT IN ('unstable', 'stable', 'discharge-ready');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

-- Create function to validate patient data
CREATE OR REPLACE FUNCTION validate_patient_data()
RETURNS trigger AS $$
BEGIN
  -- Ensure user_id is set to authenticated user
  IF TG_OP = 'INSERT' THEN
    NEW.user_id := auth.uid();
  END IF;

  -- Ensure status is valid
  IF NEW.status NOT IN ('unstable', 'stable', 'discharge-ready') THEN
    NEW.status := 'stable';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for data validation
DROP TRIGGER IF EXISTS validate_patient_data_trigger ON patients;
CREATE TRIGGER validate_patient_data_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION validate_patient_data();