-- Drop existing columns if they exist
ALTER TABLE personal_patients
DROP COLUMN IF EXISTS created_at CASCADE,
DROP COLUMN IF EXISTS updated_at CASCADE;

-- Add columns with camelCase names
ALTER TABLE personal_patients
ADD COLUMN "createdAt" timestamptz DEFAULT now(),
ADD COLUMN "updatedAt" timestamptz DEFAULT now();

-- Create indexes for new columns
CREATE INDEX idx_personal_patients_created_at ON personal_patients("createdAt");
CREATE INDEX idx_personal_patients_updated_at ON personal_patients("updatedAt");

-- Update copy function to handle camelCase columns
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
    "createdAt",
    "updatedAt",
    "admissionDate",
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
    COALESCE(p.created_at, now()) as "createdAt",
    COALESCE(p.updated_at, now()) as "updatedAt",
    COALESCE(p.admission_date, now()) as "admissionDate",
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
  NEW."updatedAt" = now();
  NEW.last_modified_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;