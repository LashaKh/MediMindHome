-- Add documentation_images to personal_patients table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personal_patients' 
    AND column_name = 'documentation_images'
  ) THEN
    ALTER TABLE personal_patients 
    ADD COLUMN documentation_images jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index for documentation_images
CREATE INDEX IF NOT EXISTS idx_personal_patients_documentation_images 
ON personal_patients USING gin(documentation_images); 