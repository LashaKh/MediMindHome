/*
  # Add ECG Images Support
  
  1. Changes
    - Add ecg_images column to patients table to store ECG image URLs
    - Add index for efficient querying
    - Update RLS policies
*/

-- Add ecg_images column to patients table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS ecg_images text[] DEFAULT ARRAY[]::text[];

-- Create index for ecg_images
CREATE INDEX IF NOT EXISTS idx_patients_ecg_images 
ON patients USING gin(ecg_images);

-- Update RLS policies to allow image management
DROP POLICY IF EXISTS "Enable patient operations" ON patients;

CREATE POLICY "Enable patient operations"
ON patients FOR ALL
TO authenticated
USING (true)
WITH CHECK (
  assigned_department IS NULL OR
  assigned_department IN ('cardiac_icu', 'cardiac_surgery_icu')
);