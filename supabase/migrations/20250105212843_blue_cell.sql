/*
  # Fix Patient Share Requests Status Constraint

  1. Changes
    - Update status check constraint to include all required statuses
    - Add missing status values
    - Ensure proper status transitions
  
  2. Security
    - Maintain data integrity
    - Allow proper status flow
*/

-- Drop existing check constraint
ALTER TABLE patient_share_requests
DROP CONSTRAINT IF EXISTS patient_share_requests_status_check;

-- Add updated check constraint with all valid statuses
ALTER TABLE patient_share_requests
ADD CONSTRAINT patient_share_requests_status_check
CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'));

-- Update any existing rows with invalid status
UPDATE patient_share_requests
SET status = 'pending'
WHERE status NOT IN ('pending', 'accepted', 'rejected', 'completed');

-- Create function to validate status transitions
CREATE OR REPLACE FUNCTION validate_share_request_status()
RETURNS trigger AS $$
BEGIN
  -- Only allow specific status transitions
  IF OLD.status = 'pending' AND NEW.status NOT IN ('accepted', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status transition from pending';
  END IF;
  
  IF OLD.status = 'accepted' AND NEW.status != 'completed' THEN
    RAISE EXCEPTION 'Invalid status transition from accepted';
  END IF;
  
  IF OLD.status IN ('completed', 'rejected') AND OLD.status != NEW.status THEN
    RAISE EXCEPTION 'Cannot change status once completed or rejected';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status validation
DROP TRIGGER IF EXISTS validate_share_request_status_trigger ON patient_share_requests;
CREATE TRIGGER validate_share_request_status_trigger
  BEFORE UPDATE ON patient_share_requests
  FOR EACH ROW
  EXECUTE FUNCTION validate_share_request_status();