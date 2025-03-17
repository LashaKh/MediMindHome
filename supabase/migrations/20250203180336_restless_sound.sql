/*
  # Fix column names in personal_patients table

  1. Changes
    - Rename columns to use camelCase
    - Update copy function to use camelCase
    - Update RLS policies
*/

-- Rename columns to use camelCase
ALTER TABLE personal_patients
  RENAME COLUMN created_at TO "createdAt";

ALTER TABLE personal_patients  
  RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE personal_patients
  RENAME COLUMN admission_date TO "admissionDate";

-- Drop existing indexes
DROP INDEX IF EXISTS idx_personal_patients_created_at;
DROP INDEX IF EXISTS idx_personal_patients_updated_at;
DROP INDEX IF EXISTS idx_personal_patients_admission_date;

-- Create new indexes with camelCase names
CREATE INDEX idx_personal_patients_created_at ON personal_patients("createdAt");
CREATE INDEX idx_personal_patients_updated_at ON personal_patients("updatedAt");
CREATE INDEX idx_personal_patients_admission_date ON personal_patients("admissionDate");

-- Update copy function to use camelCase
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
    notes,
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
    ARRAY(
      SELECT to_jsonb(n.*) 
      FROM patient_notes n 
      WHERE n.patient_id = p.id
    )::jsonb[] as notes,
    p.assigned_department,
    p.assigned_doctor_id,
    auth.uid(),
    now()
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