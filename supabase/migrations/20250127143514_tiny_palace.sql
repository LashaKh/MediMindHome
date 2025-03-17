/*
  # Add reminder column to patient_notes table

  1. Changes
    - Add reminder JSONB column to patient_notes table
    - Add index on reminder column for better query performance
*/

-- Add reminder column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'patient_notes' 
    AND column_name = 'reminder'
  ) THEN
    ALTER TABLE patient_notes
    ADD COLUMN reminder JSONB;
  END IF;
END $$;

-- Create index for reminder column
CREATE INDEX IF NOT EXISTS idx_patient_notes_reminder 
ON patient_notes USING gin (reminder);

-- Update RLS policies
DROP POLICY IF EXISTS "Enable note read access" ON patient_notes;
DROP POLICY IF EXISTS "Enable note insert" ON patient_notes;
DROP POLICY IF EXISTS "Enable note update" ON patient_notes;
DROP POLICY IF EXISTS "Enable note delete" ON patient_notes;

-- Create comprehensive RLS policies for patient notes
CREATE POLICY "Enable note operations"
ON patient_notes FOR ALL
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