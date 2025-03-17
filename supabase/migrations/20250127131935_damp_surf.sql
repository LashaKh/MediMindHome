/*
  # Final patient status fix

  1. Changes
    - Drop and recreate status check constraint with correct values
    - Update any existing invalid statuses
    - Create index for performance
    - Add trigger to validate status changes

  2. Security
    - Ensures data integrity for patient status
*/

-- Drop existing check constraint
ALTER TABLE patients 
DROP CONSTRAINT IF EXISTS patients_status_check;

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
  IF NEW.status NOT IN ('unstable', 'stable', 'discharge-ready') THEN
    NEW.status := 'stable';  -- Set default if invalid
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate status before insert or update
DROP TRIGGER IF EXISTS validate_patient_status_trigger ON patients;
CREATE TRIGGER validate_patient_status_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION validate_patient_status();