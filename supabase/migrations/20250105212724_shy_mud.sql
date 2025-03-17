/*
  # Fix Users Table RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Create new permissive policies for system operations
    - Update user synchronization trigger
    - Ensure proper data access
  
  2. Security
    - Allow reading user records for authenticated users
    - Enable secure system operations
    - Maintain data consistency
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "Enable system operations" ON users;

-- Create a single permissive policy for all operations
CREATE POLICY "Allow authenticated access"
ON users FOR ALL
TO authenticated
USING (true)  -- Allow reading all user records
WITH CHECK (true);  -- Allow system operations

-- Update the trigger function for better synchronization
CREATE OR REPLACE FUNCTION public.handle_auth_user_changes()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO users (id, email, created_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.created_at, now())
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      email = EXCLUDED.email,
      created_at = EXCLUDED.created_at;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE users
    SET 
      email = NEW.email,
      created_at = COALESCE(NEW.created_at, users.created_at)
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure all existing auth users have corresponding records
INSERT INTO users (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  created_at = EXCLUDED.created_at;