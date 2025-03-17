-- Create the table for MediVoice transcription results
CREATE TABLE IF NOT EXISTS medivoice_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  transcript JSONB NOT NULL,
  clinical_summary JSONB,
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE medivoice_results ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own results
CREATE POLICY "Users can view their own results" 
  ON medivoice_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own results
CREATE POLICY "Users can insert their own results" 
  ON medivoice_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own results
CREATE POLICY "Users can update their own results" 
  ON medivoice_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own results
CREATE POLICY "Users can delete their own results" 
  ON medivoice_results 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS medivoice_results_user_id_idx ON medivoice_results (user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS medivoice_results_created_at_idx ON medivoice_results (created_at DESC); 