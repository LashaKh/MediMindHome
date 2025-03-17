/*
  # Update patient status enum

  1. Changes
    - Update patient status check constraint to allow new values
    - Migrate existing data to new status values
    - Add index on status column for better query performance

  2. Security
    - Maintains existing RLS policies
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