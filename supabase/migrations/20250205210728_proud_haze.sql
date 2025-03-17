-- Drop existing RLS policies
DROP POLICY IF EXISTS "Enable patient operations" ON patients;
DROP POLICY IF EXISTS "Enable personal patients read" ON personal_patients;
DROP POLICY IF EXISTS "Enable personal patients insert" ON personal_patients;
DROP POLICY IF EXISTS "Enable personal patients update" ON personal_patients;
DROP POLICY IF EXISTS "Enable personal patients delete" ON personal_patients;

-- Create more permissive RLS policies for patients table
CREATE POLICY "Enable patient operations"
ON patients FOR ALL
TO authenticated
USING (true)  -- Allow all authenticated users to read patients
WITH CHECK (
  -- For inserts and updates, ensure either:
  -- 1. Department is valid, or
  -- 2. Department is null (will be set by trigger)
  assigned_department IS NULL OR
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

-- Create more permissive RLS policies for personal_patients table
CREATE POLICY "Enable personal patients read"
ON personal_patients FOR SELECT
TO authenticated
USING (true);  -- Allow all authenticated users to read personal patients

CREATE POLICY "Enable personal patients insert"
ON personal_patients FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow all authenticated users to insert

CREATE POLICY "Enable personal patients update"
ON personal_patients FOR UPDATE
TO authenticated
USING (true)  -- Allow all authenticated users to update
WITH CHECK (true);

CREATE POLICY "Enable personal patients delete"
ON personal_patients FOR DELETE
TO authenticated
USING (user_id = auth.uid());  -- Only owner can delete

-- Update copy function to handle doctor assignment properly
CREATE OR REPLACE FUNCTION copy_assigned_patients_to_personal()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
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
    v_user_id as user_id,
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
    v_user_id,
    now()
  FROM patients p
  WHERE 
    p.assigned_doctor_id = v_user_id
    AND NOT EXISTS (
      SELECT 1 
      FROM personal_patients pp 
      WHERE 
        pp.user_id = v_user_id AND
        pp.name = p.name AND
        pp.diagnosis = p.diagnosis
    );

  -- Notify about the copy operation
  PERFORM pg_notify(
    'patient_copy_completed',
    json_build_object(
      'user_id', v_user_id,
      'timestamp', now()
    )::text
  );
END;
$$;