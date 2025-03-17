-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for audio files
CREATE POLICY "Allow authenticated users to upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to read audio files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'audio-files');

CREATE POLICY "Allow users to delete their own audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'audio-files' AND auth.uid() = owner);