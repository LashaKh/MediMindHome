-- First check if columns exist and drop them if needed
DO $$ 
BEGIN
  -- Drop snake_case columns if they exist
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE personal_patients DROP COLUMN created_at;
  END IF;

  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE personal_patients DROP COLUMN updated_at;
  END IF;

  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'admission_date'
  ) THEN
    ALTER TABLE personal_patients DROP COLUMN admission_date;
  END IF;

  -- Add camelCase columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE personal_patients ADD COLUMN "createdAt" timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE personal_patients ADD COLUMN "updatedAt" timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'admissionDate'
  ) THEN
    ALTER TABLE personal_patients ADD COLUMN "admissionDate" timestamptz DEFAULT now();
  END IF;
END $$;

-- Create or replace indexes
DROP INDEX IF EXISTS idx_personal_patients_created_at;
DROP INDEX IF EXISTS idx_personal_patients_updated_at;
DROP INDEX IF EXISTS idx_personal_patients_admission_date;

CREATE INDEX idx_personal_patients_created_at ON personal_patients("createdAt");
CREATE INDEX idx_personal_patients_updated_at ON personal_patients("updatedAt");
CREATE INDEX idx_personal_patients_admission_date ON personal_patients("admissionDate");

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