-- Drop existing RLS policies for patients table
DROP POLICY IF EXISTS "Enable patient read access" ON patients;
DROP POLICY IF EXISTS "Enable patient modifications" ON patients;
DROP POLICY IF EXISTS "Enable patient updates" ON patients;
DROP POLICY IF EXISTS "Enable patient deletion" ON patients;

-- Create new RLS policies for patients table
CREATE POLICY "Allow patient read access"
ON patients FOR SELECT
TO authenticated
USING (true);  -- Allow all authenticated users to read patients

CREATE POLICY "Allow patient insert"
ON patients FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insert if department is valid
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

CREATE POLICY "Allow patient update"
ON patients FOR UPDATE
TO authenticated
USING (
  -- Allow update if department is valid
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
)
WITH CHECK (
  -- Maintain valid department on updates
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

CREATE POLICY "Allow patient delete"
ON patients FOR DELETE
TO authenticated
USING (
  -- Allow delete if department is valid
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

-- Create index for department if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_patients_department 
ON patients(assigned_department);