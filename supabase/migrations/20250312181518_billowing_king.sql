/*
  # Add image support to messages table

  1. Changes
    - Add image_url column to messages table
    - Add metadata column for storing image analysis results
    - Create storage bucket for chat images
    - Add storage policies for image management
*/

-- Add image_url column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS image_url text;

-- Add metadata column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE messages ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create storage bucket for chat images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload chat images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to read chat images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chat-images');

CREATE POLICY "Allow users to delete their own chat images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'chat-images' AND auth.uid() = owner);