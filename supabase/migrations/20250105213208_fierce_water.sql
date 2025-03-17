/*
  # Fix Patient Data Sharing

  1. Changes
    - Update copy_patient_data function to properly handle patient data copying
    - Add proper error handling and validation
    - Ensure patient notes are copied
    - Add proper status transitions
  
  2. Security
    - Maintain RLS policies
    - Ensure data integrity during copying
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS copy_patient_data(uuid);

-- Create improved copy_patient_data function
CREATE OR REPLACE FUNCTION copy_patient_data(
  share_request_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_id uuid;
  v_recipient_id uuid;
  v_request_status text;
  v_patient record;
  v_new_patient_id uuid;
BEGIN
  -- Get share request details and validate
  SELECT 
    sender_id, 
    recipient_id,
    status
  INTO 
    v_sender_id,
    v_recipient_id,
    v_request_status
  FROM patient_share_requests
  WHERE id = share_request_id;

  -- Validate request exists and status
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Share request not found';
  END IF;

  IF v_request_status != 'accepted' THEN
    RAISE EXCEPTION 'Share request must be accepted to copy data';
  END IF;

  -- Copy each patient and their related data
  FOR v_patient IN 
    SELECT * FROM patients 
    WHERE user_id = v_sender_id
  LOOP
    -- Insert patient
    INSERT INTO patients (
      name,
      diagnosis,
      room_number,
      status,
      admission_date,
      echo_data,
      ecg_data,
      user_id,
      created_at,
      updated_at
    ) VALUES (
      v_patient.name,
      v_patient.diagnosis,
      v_patient.room_number,
      v_patient.status,
      v_patient.admission_date,
      v_patient.echo_data,
      v_patient.ecg_data,
      v_recipient_id,
      now(),
      now()
    ) RETURNING id INTO v_new_patient_id;

    -- Copy patient notes
    INSERT INTO patient_notes (
      patient_id,
      content,
      type,
      created_at,
      created_by
    )
    SELECT 
      v_new_patient_id,
      content,
      type,
      now(),
      v_recipient_id
    FROM patient_notes
    WHERE patient_id = v_patient.id;
  END LOOP;

  -- Update share request status
  UPDATE patient_share_requests
  SET 
    status = 'completed',
    updated_at = now()
  WHERE id = share_request_id;

  -- Notify the recipient of completed transfer
  PERFORM pg_notify(
    'patient_share_completed',
    json_build_object(
      'recipient_id', v_recipient_id,
      'request_id', share_request_id
    )::text
  );
END;
$$;