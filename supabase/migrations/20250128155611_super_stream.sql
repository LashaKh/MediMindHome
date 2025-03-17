-- Add role column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Add assigned_doctor_id to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS assigned_doctor_id uuid REFERENCES users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor ON patients(assigned_doctor_id);

-- Create function to assign doctor
CREATE OR REPLACE FUNCTION assign_doctor(
  patient_id UUID,
  doctor_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify doctor exists and has doctor role
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = doctor_id AND role = 'doctor'
  ) THEN
    RAISE EXCEPTION 'Invalid doctor ID or user is not a doctor';
  END IF;

  -- Update patient assignment
  UPDATE patients
  SET 
    assigned_doctor_id = doctor_id,
    updated_at = now()
  WHERE id = patient_id
  AND user_id = auth.uid();

  -- Notify about assignment
  PERFORM pg_notify(
    'doctor_assigned',
    json_build_object(
      'patient_id', patient_id,
      'doctor_id', doctor_id
    )::text
  );
END;
$$;