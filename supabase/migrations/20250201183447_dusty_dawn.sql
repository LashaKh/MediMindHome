-- Create ABG results table
CREATE TABLE abg_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  raw_analysis text NOT NULL,
  interpretation text NOT NULL,
  action_plan text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE abg_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their ABG results"
ON abg_results
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_abg_results_user_id ON abg_results(user_id);
CREATE INDEX idx_abg_results_created_at ON abg_results(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_abg_results_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_abg_results_updated_at
  BEFORE UPDATE ON abg_results
  FOR EACH ROW
  EXECUTE FUNCTION update_abg_results_updated_at();