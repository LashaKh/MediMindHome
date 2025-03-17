/*
  # Add user name to patient notes view

  1. Changes
    - Create a view to join patient notes with user names
    - Update RLS policies to use the new view
*/

-- Create a view that joins patient notes with user names
CREATE OR REPLACE VIEW patient_notes_with_users AS
SELECT 
  pn.*,
  u.name as created_by_name
FROM patient_notes pn
LEFT JOIN users u ON pn.created_by = u.id;

-- Grant access to the view
GRANT SELECT ON patient_notes_with_users TO authenticated;