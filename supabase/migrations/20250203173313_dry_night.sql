-- Add sex column to patients table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'patients' 
    AND column_name = 'sex'
  ) THEN
    ALTER TABLE patients 
    ADD COLUMN sex text CHECK (sex IN ('male', 'female'));
  END IF;
END $$;

-- Update copy function to handle missing fields gracefully
CREATE OR REPLACE FUNCTION copy_assigned_patients_to_personal()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Copy patients where user is the assigned doctor
  INSERT INTO personal_patients (
    user_id,
    name,
    diagnosis,
    room_number,
    status,
    created_at,
    echo_data,
    ecg_data,
    age,
    assigned_department,
    assigned_doctor_id,
    last_modified_by,
    last_modified_at
  )
  SELECT 
    p.assigned_doctor_id as user_id,
    p.name,
    p.diagnosis,
    p.room_number,
    p.status,
    COALESCE(p.created_at, now()) as created_at,
    p.echo_data,
    p.ecg_data,
    p.age,
    p.assigned_department,
    p.assigned_doctor_id,
    p.last_modified_by,
    p.last_modified_at
  FROM patients p
  WHERE 
    p.assigned_doctor_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 
      FROM personal_patients pp 
      WHERE 
        pp.user_id = p.assigned_doctor_id
        AND pp.name = p.name
        AND pp.diagnosis = p.diagnosis
    );
END;
$$;