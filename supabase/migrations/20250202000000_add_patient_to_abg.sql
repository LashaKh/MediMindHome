-- Add patient and type columns to abg_results table
ALTER TABLE abg_results 
  ADD COLUMN IF NOT EXISTS patient JSONB NULL,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Arterial Blood Gas'; 