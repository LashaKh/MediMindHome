/*
  # Fix patient status validation

  1. Changes
    - Drop and recreate status check constraint with correct values
    - Add trigger for status validation
    - Create helper function for status validation
    - Add performance index

  2. Security
    - Ensure data integrity with check constraint
    - Add validation trigger for data safety
*/

-- Drop existing check constraint and trigger
ALTER TABLE patients 
DROP CONSTRAINT IF EXISTS patients_status_check;
DROP TRIGGER IF EXISTS validate_patient_status_trigger ON patients;
DROP FUNCTION IF EXISTS validate_patient_status();

-- Add new check constraint with updated values
ALTER TABLE patients
ADD CONSTRAINT patients_status_check 
CHECK (status IN ('unstable', 'stable', 'discharge-ready'));

-- Update any existing records with invalid status
UPDATE patients 
SET status = 'stable'
WHERE status NOT IN ('unstable', 'stable', 'discharge-ready');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_patients_status 
ON patients(status);

-- Create function to validate status changes
CREATE OR REPLACE FUNCTION validate_patient_status()
RETURNS trigger AS $$
BEGIN
  -- Ensure status is one of the allowed values
  IF NEW.status IS NULL OR NEW.status NOT IN ('unstable', 'stable', 'discharge-ready') THEN
    NEW.status := 'stable';  -- Set default if invalid or null
  END IF;
  
  -- Set updated_at timestamp
  NEW.updated_at := CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate status before insert or update
CREATE TRIGGER validate_patient_status_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION validate_patient_status();