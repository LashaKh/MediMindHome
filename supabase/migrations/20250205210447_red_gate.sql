-- Drop existing RLS policies for patients table
DROP POLICY IF EXISTS "Allow patient read access" ON patients;
DROP POLICY IF EXISTS "Allow patient insert" ON patients;
DROP POLICY IF EXISTS "Allow patient update" ON patients;
DROP POLICY IF EXISTS "Allow patient delete" ON patients;

-- Create new RLS policies for patients table
CREATE POLICY "Enable patient operations"
ON patients FOR ALL
TO authenticated
USING (true)  -- Allow all authenticated users to read patients
WITH CHECK (
  -- For inserts and updates, ensure department is valid
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

-- Create index for department if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_patients_department 
ON patients(assigned_department);

-- Create index for user_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_patients_user_id
ON patients(user_id);

-- Create index for assigned_doctor if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor
ON patients(assigned_doctor_id);