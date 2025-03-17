-- Create storage bucket for Echo videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('echo-videos', 'echo-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for Echo videos
CREATE POLICY "Allow authenticated users to upload Echo videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'echo-videos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to read Echo videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'echo-videos');

CREATE POLICY "Allow users to delete their own Echo videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'echo-videos' AND auth.uid() = owner);

-- Add videos array to echo_data in patients table
DO $$ 
BEGIN
  -- Check if the column exists and has the correct type
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'patients' 
    AND column_name = 'echo_data'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE patients 
    ADD COLUMN echo_data jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index for echo_data
CREATE INDEX IF NOT EXISTS idx_patients_echo_data 
ON patients USING gin(echo_data);