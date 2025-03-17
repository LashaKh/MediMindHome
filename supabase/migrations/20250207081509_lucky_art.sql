-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their secure notes" ON secure_notes;

-- Drop and recreate secure notes table to ensure correct schema
DROP TABLE IF EXISTS secure_notes;

CREATE TABLE secure_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE secure_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Enable secure notes management"
ON secure_notes
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_secure_notes_user_id ON secure_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_secure_notes_patient_id ON secure_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_secure_notes_created_at ON secure_notes(created_at);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_secure_note_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_secure_note_timestamp ON secure_notes;
CREATE TRIGGER update_secure_note_timestamp
  BEFORE UPDATE ON secure_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_secure_note_timestamp();