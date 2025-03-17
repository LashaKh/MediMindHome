-- Create storage bucket for documentation images
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentation-images', 'documentation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for documentation images
CREATE POLICY "Allow authenticated users to upload documentation images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentation-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to read documentation images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documentation-images');

CREATE POLICY "Allow users to delete their own documentation images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documentation-images' AND auth.uid() = owner);

-- Add documentation_images to patients table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'patients' 
    AND column_name = 'documentation_images'
  ) THEN
    ALTER TABLE patients 
    ADD COLUMN documentation_images jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index for documentation_images
CREATE INDEX IF NOT EXISTS idx_patients_documentation_images 
ON patients USING gin(documentation_images);