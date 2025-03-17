-- Drop existing view if it exists
DROP VIEW IF EXISTS patient_notes_with_users;

-- Create view with correct column names and joins
CREATE OR REPLACE VIEW patient_notes_with_users AS
SELECT 
  pn.id,
  pn.patient_id,
  pn.content,
  pn.type,
  pn.created_at,
  pn.created_by,
  pn.reminder,
  u.name as created_by_name
FROM patient_notes pn
LEFT JOIN users u ON u.id = pn.created_by;

-- Grant access to the view
GRANT SELECT ON patient_notes_with_users TO authenticated;

-- Update function to handle note creation
CREATE OR REPLACE FUNCTION create_patient_note(
  p_patient_id UUID,
  p_content TEXT,
  p_type TEXT DEFAULT 'general',
  p_reminder JSONB DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  patient_id UUID,
  content TEXT,
  type TEXT,
  created_at TIMESTAMPTZ,
  created_by UUID,
  created_by_name TEXT,
  reminder JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_note_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Insert the note
  INSERT INTO patient_notes (
    patient_id,
    content,
    type,
    created_by,
    reminder
  ) VALUES (
    p_patient_id,
    p_content,
    p_type,
    v_user_id,
    p_reminder
  )
  RETURNING id INTO v_note_id;

  -- Return the complete note data from the view
  RETURN QUERY
  SELECT 
    pnw.id,
    pnw.patient_id,
    pnw.content,
    pnw.type,
    pnw.created_at,
    pnw.created_by,
    pnw.created_by_name,
    pnw.reminder
  FROM patient_notes_with_users pnw
  WHERE pnw.id = v_note_id;
END;
$$;