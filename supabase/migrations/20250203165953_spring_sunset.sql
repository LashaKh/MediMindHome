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
    created_at,
    updated_at,
    admission_date,
    echo_data,
    ecg_data
  )
  SELECT 
    p.assigned_doctor_id as user_id,
    p.name,
    p.diagnosis,
    p.room_number,
    p.status,
    now() as created_at,
    now() as updated_at,
    p.admission_date,
    p.echo_data,
    p.ecg_data
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

-- Execute the function to copy existing assigned patients
SELECT copy_assigned_patients_to_personal();

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
      ecg_data
    ) VALUES (
      NEW.assigned_doctor_id,
      NEW.name,
      NEW.diagnosis,
      NEW.room_number,
      NEW.status,
      NEW.admission_date,
      NEW.echo_data,
      NEW.ecg_data
    )
    ON CONFLICT DO NOTHING; -- Avoid duplicates
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