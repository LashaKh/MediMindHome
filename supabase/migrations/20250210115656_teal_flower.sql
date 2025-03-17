-- Create ECG results table
CREATE TABLE ecg_results (
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
ALTER TABLE ecg_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their ECG results"
ON ecg_results
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_ecg_results_user_id ON ecg_results(user_id);
CREATE INDEX idx_ecg_results_created_at ON ecg_results(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_ecg_results_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ecg_results_updated_at
  BEFORE UPDATE ON ecg_results
  FOR EACH ROW
  EXECUTE FUNCTION update_ecg_results_updated_at();