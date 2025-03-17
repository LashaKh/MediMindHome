/*
  # Update patient notes RLS policies

  1. Changes
    - Allow all authenticated users to read notes for patients they can access
    - Maintain write restrictions (only note creator can edit/delete)
    - Add proper indexes for performance

  2. Security
    - Users can read all notes for patients they can access
    - Users can only edit/delete their own notes
    - Users can only create notes for patients they can access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable note read access" ON patient_notes;
DROP POLICY IF EXISTS "Enable note insert" ON patient_notes;
DROP POLICY IF EXISTS "Enable note update" ON patient_notes;
DROP POLICY IF EXISTS "Enable note delete" ON patient_notes;

-- Create new RLS policies
CREATE POLICY "Enable note read access"
ON patient_notes FOR SELECT
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
);

CREATE POLICY "Enable note insert"
ON patient_notes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients
    WHERE id = patient_notes.patient_id
    AND (
      -- Allow insert if user can access the patient
      assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
      OR user_id = auth.uid()
      OR assigned_doctor_id = auth.uid()
    )
  )
);

CREATE POLICY "Enable note update"
ON patient_notes FOR UPDATE
TO authenticated
USING (
  -- Only note creator can update
  created_by = auth.uid()
)
WITH CHECK (
  -- Only note creator can update
  created_by = auth.uid()
);

CREATE POLICY "Enable note delete"
ON patient_notes FOR DELETE
TO authenticated
USING (
  -- Only note creator can delete
  created_by = auth.uid()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_notes_patient_id ON patient_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_notes_created_by ON patient_notes(created_by);