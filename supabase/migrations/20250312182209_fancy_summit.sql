/*
  # Add chat image support

  1. Changes
    - Add image_url column to messages table
    - Add metadata column for image analysis
    - Create storage bucket for chat images
    - Add storage policies if they don't exist

  2. Security
    - Check for existing policies before creating new ones
    - Maintain proper access control
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

-- Create storage policies if they don't exist
DO $$ 
BEGIN
  -- Check and create upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload chat images'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload chat images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'chat-images' AND
      auth.role() = 'authenticated'
    );
  END IF;

  -- Check and create read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to read chat images'
  ) THEN
    CREATE POLICY "Allow authenticated users to read chat images"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'chat-images');
  END IF;

  -- Check and create delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow users to delete their own chat images'
  ) THEN
    CREATE POLICY "Allow users to delete their own chat images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'chat-images' AND auth.uid() = owner);
  END IF;
END $$;