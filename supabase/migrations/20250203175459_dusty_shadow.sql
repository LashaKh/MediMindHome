-- Drop existing columns to avoid conflicts
ALTER TABLE personal_patients
DROP COLUMN IF EXISTS created_at CASCADE,
DROP COLUMN IF EXISTS updated_at CASCADE,
DROP COLUMN IF EXISTS admission_date CASCADE,
DROP COLUMN IF EXISTS "createdAt" CASCADE,
DROP COLUMN IF EXISTS "updatedAt" CASCADE,
DROP COLUMN IF EXISTS "admissionDate" CASCADE;

-- Add columns with snake_case names (PostgreSQL convention)
ALTER TABLE personal_patients
ADD COLUMN created_at timestamptz DEFAULT now(),
ADD COLUMN updated_at timestamptz DEFAULT now(),
ADD COLUMN admission_date timestamptz DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personal_patients_created_at ON personal_patients(created_at);
CREATE INDEX IF NOT EXISTS idx_personal_patients_updated_at ON personal_patients(updated_at);
CREATE INDEX IF NOT EXISTS idx_personal_patients_admission_date ON personal_patients(admission_date);

-- Update copy function to use snake_case columns
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
    updated_at,
    admission_date,
    echo_data,
    ecg_data,
    age,
    sex,
    comorbidities,
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
    COALESCE(p.updated_at, now()) as updated_at,
    COALESCE(p.admission_date, now()) as admission_date,
    p.echo_data,
    p.ecg_data,
    p.age,
    p.sex,
    COALESCE(p.comorbidities, ARRAY[]::text[]),
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

-- Update trigger function for timestamps
CREATE OR REPLACE FUNCTION update_personal_patient_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_modified_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_personal_patient_timestamp ON personal_patients;
CREATE TRIGGER update_personal_patient_timestamp
  BEFORE UPDATE ON personal_patients
  FOR EACH ROW
  EXECUTE FUNCTION update_personal_patient_timestamp();