-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload documentation images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read documentation images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own documentation images" ON storage.objects;

-- Create storage bucket for documentation images if it doesn't exist
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