/*
  # Create personal patients table

  1. New Tables
    - personal_patients: Private patient tracking table for individual users
      - Columns match main patients table structure
      - Separate from shared patient data
      - Personal notes and tracking
  
  2. Security
    - Enable RLS
    - Policies for personal access only
*/

-- Create personal patients table
CREATE TABLE personal_patients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  diagnosis text,
  room_number text,
  status text DEFAULT 'stable' CHECK (status IN ('unstable', 'stable', 'discharge-ready')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  admission_date timestamptz DEFAULT now(),
  echo_data jsonb DEFAULT '{}'::jsonb,
  ecg_data jsonb DEFAULT '{}'::jsonb,
  age integer,
  sex text CHECK (sex IN ('male', 'female')),
  comorbidities text[] DEFAULT ARRAY[]::text[]
);

-- Enable RLS
ALTER TABLE personal_patients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their personal patients"
ON personal_patients
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_personal_patients_user_id ON personal_patients(user_id);
CREATE INDEX idx_personal_patients_created_at ON personal_patients(created_at);
CREATE INDEX idx_personal_patients_status ON personal_patients(status);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_personal_patient_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_personal_patient_timestamp
  BEFORE UPDATE ON personal_patients
  FOR EACH ROW
  EXECUTE FUNCTION update_personal_patient_timestamp();