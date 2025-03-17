/*
  # Update patient status system

  1. Changes
    - Update status values to new system:
      - 'unstable' (red)
      - 'stable' (yellow)
      - 'discharge-ready' (green)
    
  2. Updates
    - Drop existing status check constraint
    - Add new constraint with updated values
    - Update existing data to match new status values
    - Create index for performance
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