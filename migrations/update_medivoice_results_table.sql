-- Update the medivoice_results table to make it more resilient to null values

-- First check if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medivoice_results') THEN
        -- Drop any existing policies to avoid conflicts
        DROP POLICY IF EXISTS "Users can view their own results" ON public.medivoice_results;
        DROP POLICY IF EXISTS "Users can insert their own results" ON public.medivoice_results;
        DROP POLICY IF EXISTS "Users can update their own results" ON public.medivoice_results;
        DROP POLICY IF EXISTS "Users can delete their own results" ON public.medivoice_results;
        
        -- Drop existing indexes
        DROP INDEX IF EXISTS medivoice_results_user_id_idx;
        DROP INDEX IF EXISTS medivoice_results_created_at_idx;
        
        -- Drop the table completely to rebuild with correct constraints
        DROP TABLE public.medivoice_results;
    END IF;
END
$$;

-- Recreate the table with correct constraints
CREATE TABLE IF NOT EXISTS public.medivoice_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  transcript JSONB NOT NULL DEFAULT '{}'::jsonb,  -- Default empty JSON object
  clinical_summary JSONB,  -- This can be null
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.medivoice_results ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own results
CREATE POLICY "Users can view their own results" 
  ON public.medivoice_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own results
CREATE POLICY "Users can insert their own results" 
  ON public.medivoice_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own results
CREATE POLICY "Users can update their own results" 
  ON public.medivoice_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own results
CREATE POLICY "Users can delete their own results" 
  ON public.medivoice_results 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS medivoice_results_user_id_idx ON public.medivoice_results (user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS medivoice_results_created_at_idx ON public.medivoice_results (created_at DESC); 