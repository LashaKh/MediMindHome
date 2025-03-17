/*
  # Add Patient Sharing Support

  1. New Tables
    - `patient_share_requests`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references users)
      - `recipient_id` (uuid, references users)
      - `status` (text: pending, accepted, rejected)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on new tables
    - Add policies for share request management
*/

-- Create patient share requests table
CREATE TABLE patient_share_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patient_share_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for patient share requests
CREATE POLICY "Users can create share requests"
  ON patient_share_requests
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can view their share requests"
  ON patient_share_requests
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can update their received share requests"
  ON patient_share_requests
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- Create indexes
CREATE INDEX idx_share_requests_sender ON patient_share_requests(sender_id);
CREATE INDEX idx_share_requests_recipient ON patient_share_requests(recipient_id);
CREATE INDEX idx_share_requests_status ON patient_share_requests(status);

-- Function to copy patient data
CREATE OR REPLACE FUNCTION copy_patient_data(
  share_request_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sender_id uuid;
  v_recipient_id uuid;
BEGIN
  -- Get sender and recipient from share request
  SELECT sender_id, recipient_id INTO v_sender_id, v_recipient_id
  FROM patient_share_requests
  WHERE id = share_request_id AND status = 'accepted';

  -- Copy patients data
  INSERT INTO patients (
    name, diagnosis, room_number, status, 
    admission_date, echo_data, ecg_data, user_id
  )
  SELECT 
    name, diagnosis, room_number, status,
    admission_date, echo_data, ecg_data, v_recipient_id
  FROM patients
  WHERE user_id = v_sender_id;

  -- Update share request status
  UPDATE patient_share_requests
  SET status = 'completed',
      updated_at = now()
  WHERE id = share_request_id;
END;
$$;