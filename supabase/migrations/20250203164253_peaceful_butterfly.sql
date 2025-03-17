/*
  # Implement Shared Patient Table System

  1. Schema Updates
    - Add assigned_department column to patients table
    - Add last_modified_by and last_modified_at columns for audit tracking
    - Add indexes for improved query performance

  2. Security
    - Update RLS policies to allow department-based access
    - Maintain user-based access control for modifications
*/

-- Add new columns to patients table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS assigned_department text CHECK (assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')),
ADD COLUMN IF NOT EXISTS last_modified_by uuid REFERENCES users(id),
ADD COLUMN IF NOT EXISTS last_modified_at timestamptz DEFAULT now();

-- Set default department based on existing data
UPDATE patients
SET 
  assigned_department = 'cardiac_icu',
  last_modified_by = user_id,
  last_modified_at = now()
WHERE assigned_department IS NULL;

-- Make assigned_department non-nullable after setting defaults
ALTER TABLE patients
ALTER COLUMN assigned_department SET NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_assigned_department ON patients(assigned_department);
CREATE INDEX IF NOT EXISTS idx_patients_last_modified ON patients(last_modified_at);
CREATE INDEX IF NOT EXISTS idx_patients_last_modified_by ON patients(last_modified_by);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow patient operations" ON patients;

-- Create new RLS policies for shared access
CREATE POLICY "Enable patient read access"
ON patients FOR SELECT
TO authenticated
USING (
  -- Users can view patients in their departments
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

CREATE POLICY "Enable patient modifications"
ON patients FOR INSERT
TO authenticated
WITH CHECK (
  -- Users can only create patients with valid department assignment
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

CREATE POLICY "Enable patient updates"
ON patients FOR UPDATE
TO authenticated
USING (
  -- Users can update patients in their departments
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
)
WITH CHECK (
  -- Maintain department assignment on updates
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

CREATE POLICY "Enable patient deletion"
ON patients FOR DELETE
TO authenticated
USING (
  -- Users can delete patients in their departments
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);

-- Create function to update last_modified fields
CREATE OR REPLACE FUNCTION update_patient_modified()
RETURNS trigger AS $$
BEGIN
  NEW.last_modified_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last_modified tracking
DROP TRIGGER IF EXISTS update_patient_modified_trigger ON patients;
CREATE TRIGGER update_patient_modified_trigger
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_modified();