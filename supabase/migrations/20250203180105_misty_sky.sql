/*
  # Fix personal patients RLS policies

  1. Changes
    - Drop existing restrictive RLS policy
    - Add more granular policies for different operations
    - Allow doctor assignment updates
*/

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can manage their personal patients" ON personal_patients;

-- Create more granular RLS policies
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

-- Update copy function to handle doctor assignment properly
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