/*
  # Fix Patient RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create comprehensive RLS policies for patients table
    - Create RLS policies for patient notes
    - Add proper user_id checks

  2. Security
    - Ensures users can only access their own patient data
    - Allows proper CRUD operations with user_id validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow patient management" ON patients;
DROP POLICY IF EXISTS "Users can manage their patients" ON patients;

-- Create comprehensive RLS policies for patients
CREATE POLICY "Enable patient read access"
ON patients FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Enable patient insert"
ON patients FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable patient update"
ON patients FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable patient delete"
ON patients FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Drop existing policies for patient notes
DROP POLICY IF EXISTS "Users can manage patient notes" ON patient_notes;

-- Create comprehensive RLS policies for patient notes
CREATE POLICY "Enable note read access"
ON patient_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Enable note insert"
ON patient_notes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Enable note update"
ON patient_notes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Enable note delete"
ON patient_notes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND user_id = auth.uid()
  )
);