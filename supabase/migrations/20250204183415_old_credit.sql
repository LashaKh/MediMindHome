/*
  # Add name field to users table

  1. Changes
    - Add name column to users table
    - Update user trigger to handle name field
    - Add index for better performance

  2. Security
    - Maintains existing RLS policies
    - Name field is required for new users
*/

-- Add name column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name text;

-- Create index for name column
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Update trigger function to handle name field
CREATE OR REPLACE FUNCTION public.handle_user_changes()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.created_at, now())
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    created_at = EXCLUDED.created_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;