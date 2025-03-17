-- Drop existing policies
DROP POLICY IF EXISTS "Enable note operations" ON patient_notes;
DROP POLICY IF EXISTS "Enable note read access" ON patient_notes;
DROP POLICY IF EXISTS "Enable note insert" ON patient_notes;
DROP POLICY IF EXISTS "Enable note update" ON patient_notes;
DROP POLICY IF EXISTS "Enable note delete" ON patient_notes;

-- Create more permissive policies for patient notes
CREATE POLICY "Allow note operations"
ON patient_notes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND (
      -- Allow access if user can access the patient
      assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
      OR user_id = auth.uid()
      OR assigned_doctor_id = auth.uid()
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND (
      -- Allow access if user can access the patient
      assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
      OR user_id = auth.uid()
      OR assigned_doctor_id = auth.uid()
    )
  )
);

-- Create function to handle note operations
CREATE OR REPLACE FUNCTION handle_note_operation()
RETURNS trigger AS $$
BEGIN
  -- Set created_by if not set (for new notes)
  IF TG_OP = 'INSERT' THEN
    NEW.created_by := auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for note operations
DROP TRIGGER IF EXISTS handle_note_operation_trigger ON patient_notes;
CREATE TRIGGER handle_note_operation_trigger
  BEFORE INSERT OR UPDATE ON patient_notes
  FOR EACH ROW
  EXECUTE FUNCTION handle_note_operation();