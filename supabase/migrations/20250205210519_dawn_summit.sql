-- Drop existing RLS policies for patients table
DROP POLICY IF EXISTS "Enable patient operations" ON patients;

-- Create new RLS policies for patients table
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

-- Create function to set default department
CREATE OR REPLACE FUNCTION set_default_department()
RETURNS trigger AS $$
BEGIN
  -- Set default department if not provided
  IF NEW.assigned_department IS NULL THEN
    NEW.assigned_department := 'cardiac_icu';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set default department
DROP TRIGGER IF EXISTS set_default_department_trigger ON patients;
CREATE TRIGGER set_default_department_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_default_department();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_department 
ON patients(assigned_department);

CREATE INDEX IF NOT EXISTS idx_patients_user_id
ON patients(user_id);

CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor
ON patients(assigned_doctor_id);