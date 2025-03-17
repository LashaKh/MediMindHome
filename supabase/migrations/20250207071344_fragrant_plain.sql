-- Create secure notes table
CREATE TABLE secure_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE secure_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their secure notes"
ON secure_notes
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_secure_notes_user_id ON secure_notes(user_id);
CREATE INDEX idx_secure_notes_created_at ON secure_notes(created_at);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_secure_note_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_secure_note_timestamp
  BEFORE UPDATE ON secure_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_secure_note_timestamp();