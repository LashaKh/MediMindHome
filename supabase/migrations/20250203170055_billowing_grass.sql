-- Create personal patients table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'personal_patients') THEN
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
      notes jsonb[] DEFAULT ARRAY[]::jsonb[]
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE personal_patients ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
DROP POLICY IF EXISTS "Users can manage their personal patients" ON personal_patients;
CREATE POLICY "Users can manage their personal patients"
ON personal_patients
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create function to copy assigned patients to personal tracking
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
    admission_date,
    echo_data,
    ecg_data,
    notes
  )
  SELECT 
    p.assigned_doctor_id as user_id,
    p.name,
    p.diagnosis,
    p.room_number,
    p.status,
    p.admission_date,
    p.echo_data,
    p.ecg_data,
    ARRAY(
      SELECT to_jsonb(n.*) 
      FROM patient_notes n 
      WHERE n.patient_id = p.id
    )::jsonb[] as notes
  FROM patients p
  WHERE 
    p.assigned_doctor_id IS NOT NULL
    -- Avoid duplicates
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

-- Create trigger to automatically copy newly assigned patients
CREATE OR REPLACE FUNCTION handle_patient_assignment()
RETURNS trigger AS $$
BEGIN
  -- If doctor is being assigned
  IF NEW.assigned_doctor_id IS NOT NULL AND 
     (OLD.assigned_doctor_id IS NULL OR OLD.assigned_doctor_id != NEW.assigned_doctor_id) THEN
    -- Copy to personal tracking
    INSERT INTO personal_patients (
      user_id,
      name,
      diagnosis,
      room_number,
      status,
      admission_date,
      echo_data,
      ecg_data,
      notes
    )
    SELECT
      NEW.assigned_doctor_id,
      NEW.name,
      NEW.diagnosis,
      NEW.room_number,
      NEW.status,
      NEW.admission_date,
      NEW.echo_data,
      NEW.ecg_data,
      ARRAY(
        SELECT to_jsonb(n.*) 
        FROM patient_notes n 
        WHERE n.patient_id = NEW.id
      )::jsonb[] as notes;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic copying
DROP TRIGGER IF EXISTS patient_assignment_trigger ON patients;
CREATE TRIGGER patient_assignment_trigger
  AFTER UPDATE OF assigned_doctor_id ON patients
  FOR EACH ROW
  EXECUTE FUNCTION handle_patient_assignment();