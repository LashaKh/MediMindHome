-- Create function to normalize note content
CREATE OR REPLACE FUNCTION normalize_note_content()
RETURNS trigger AS $$
BEGIN
  -- If content is a JSON string containing a content field, extract it
  IF NEW.content IS NOT NULL AND 
     NEW.content::text LIKE '{%' AND 
     (NEW.content::json->>'content') IS NOT NULL THEN
    NEW.content := NEW.content::json->>'content';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for content normalization
DROP TRIGGER IF EXISTS normalize_note_content_trigger ON patient_notes;
CREATE TRIGGER normalize_note_content_trigger
  BEFORE INSERT OR UPDATE ON patient_notes
  FOR EACH ROW
  EXECUTE FUNCTION normalize_note_content();

-- Update existing notes to normalize content
UPDATE patient_notes
SET content = content::json->>'content'
WHERE content::text LIKE '{%' AND (content::json->>'content') IS NOT NULL;