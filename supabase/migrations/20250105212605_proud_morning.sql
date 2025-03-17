/*
  # Fix User Synchronization and RLS Policies

  1. Changes
    - Drop existing policies and recreate with proper permissions
    - Update user synchronization trigger
    - Add automatic user creation on auth signup
    - Fix RLS policies for public.users table
  
  2. Security
    - Allow system-level operations for user synchronization
    - Enable secure user lookup
    - Maintain data consistency between auth and public users
*/

-- Drop existing policies and triggers
DROP POLICY IF EXISTS "Allow all user operations" ON users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create a more permissive policy for the users table
CREATE POLICY "Enable read access"
ON users FOR SELECT
TO authenticated
USING (true);  -- Allow reading all user records

CREATE POLICY "Enable system operations"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.users.id
    AND users.email = auth.users.email
  )
);

-- Update the trigger function for user synchronization
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

-- Recreate triggers with proper permissions
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_changes();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_changes();

-- Ensure all existing auth users have corresponding records
INSERT INTO users (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  created_at = EXCLUDED.created_at;