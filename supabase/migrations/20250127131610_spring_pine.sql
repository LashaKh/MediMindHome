/*
  # Fix patient status constraint

  1. Changes
    - Drop existing status check constraint
    - Add new status check constraint with correct values
    - Update existing data to use new status values
    - Add index on status column for better performance

  2. Status Values
    - 'unstable'
    - 'stable'
    - 'discharge-ready'
*/

-- Drop existing check constraint
ALTER TABLE patients 
DROP CONSTRAINT IF EXISTS patients_status_check;

-- Add new check constraint with updated values
ALTER TABLE patients
ADD CONSTRAINT patients_status_check 
CHECK (status IN ('unstable', 'stable', 'discharge-ready'));

-- Update existing data to match new status values
UPDATE patients 
SET status = CASE 
  WHEN status = 'critical' THEN 'unstable'
  WHEN status = 'monitoring' THEN 'stable'
  ELSE status 
END;

-- Create index on status column
CREATE INDEX IF NOT EXISTS idx_patients_status 
ON patients(status);