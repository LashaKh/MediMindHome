/*
  # Add ECG Images Support
  
  1. Changes
    - Create storage bucket for ECG images
    - Add ecg_images column to patients table
    - Create index for efficient querying
    - Update RLS policies
    - Add storage policies
*/

-- Create storage bucket for ECG images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ecg-images', 'ecg-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload ECG images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ecg-images' AND
  auth.role() = 'authenticated'
);

-- Create storage policy to allow authenticated users to read images
CREATE POLICY "Allow authenticated users to read ECG images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'ecg-images');

-- Create storage policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own ECG images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'ecg-images' AND auth.uid() = owner);

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