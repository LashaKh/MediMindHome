-- Drop existing table and recreate with consistent snake_case columns
DROP TABLE IF EXISTS personal_patients CASCADE;

CREATE TABLE personal_patients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  diagnosis text,
  room_number text,
  status text DEFAULT 'stable' CHECK (status IN ('unstable', 'stable', 'discharge-ready')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  admission_date timestamptz DEFAULT now(),
  echo_data jsonb DEFAULT '{}'::jsonb,
  ecg_data jsonb DEFAULT '{}'::jsonb,
  age integer,
  sex text CHECK (sex IN ('male', 'female')),
  comorbidities text[] DEFAULT ARRAY[]::text[],
  notes jsonb[] DEFAULT ARRAY[]::jsonb[],
  assigned_department text,
  assigned_doctor_id uuid REFERENCES users(id),
  last_modified_by uuid REFERENCES users(id),
  last_modified_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE personal_patients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with snake_case column names
CREATE POLICY "Enable read access for personal patients"
ON personal_patients FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  assigned_doctor_id = auth.uid()
);

CREATE POLICY "Enable insert for personal patients"
ON personal_patients FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "Enable update for personal patients"
ON personal_patients FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR
  assigned_doctor_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid() OR
  assigned_doctor_id = auth.uid()
);

CREATE POLICY "Enable delete for personal patients"
ON personal_patients FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);

-- Create indexes with snake_case names
CREATE INDEX idx_personal_patients_user_id ON personal_patients(user_id);
CREATE INDEX idx_personal_patients_created_at ON personal_patients(created_at);
CREATE INDEX idx_personal_patients_updated_at ON personal_patients(updated_at);
CREATE INDEX idx_personal_patients_admission_date ON personal_patients(admission_date);
CREATE INDEX idx_personal_patients_status ON personal_patients(status);
CREATE INDEX idx_personal_patients_assigned_doctor ON personal_patients(assigned_doctor_id);

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
    COALESCE(p.created_at, now()) as created_at,
    COALESCE(p.updated_at, now()) as updated_at,
    COALESCE(p.admission_date, now()) as admission_date,
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
  NEW.updated_at = now();
  NEW.last_modified_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_personal_patient_timestamp ON personal_patients;
CREATE TRIGGER update_personal_patient_timestamp
  BEFORE UPDATE ON personal_patients
  FOR EACH ROW
  EXECUTE FUNCTION update_personal_patient_timestamp();