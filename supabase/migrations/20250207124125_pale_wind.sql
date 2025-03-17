-- Drop existing policies
DROP POLICY IF EXISTS "Allow note operations" ON patient_notes;

-- Create separate policies for different operations
CREATE POLICY "Enable note read"
ON patient_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
  )
);

CREATE POLICY "Enable note create"
ON patient_notes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
  )
);

CREATE POLICY "Enable note update"
ON patient_notes FOR UPDATE
TO authenticated
USING (
  -- Allow update if user created the note
  created_by = auth.uid()
);

CREATE POLICY "Enable note delete"
ON patient_notes FOR DELETE
TO authenticated
USING (
  -- Allow delete if user created the note
  created_by = auth.uid()
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