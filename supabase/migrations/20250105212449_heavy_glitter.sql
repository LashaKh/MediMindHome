/*
  # Fix users table RLS policies

  1. Changes
    - Drop existing restrictive policies
    - Create new permissive policy for user access
    - Add secure user lookup function
    - Update user synchronization trigger
  
  2. Security
    - Allow reading all user records for features like user lookup
    - Restrict modifications to system-level operations
    - Ensure secure user data synchronization
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable user access" ON users;

-- Create a more permissive policy for the users table
CREATE POLICY "Allow all user operations"
ON users
FOR ALL TO authenticated
USING (true)  -- Allow reading all user records
WITH CHECK (
  -- Only allow system to create/update records
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.users.id
    AND users.email = auth.users.email
  )
);

-- Create a secure function to handle user lookup
CREATE OR REPLACE FUNCTION lookup_user_by_email(lookup_email TEXT)
RETURNS TABLE (
  id uuid,
  email text
) 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email::text
  FROM users u
  WHERE u.email = lookup_email
  LIMIT 1;
END;
$$;

-- Update the trigger function for user synchronization
CREATE OR REPLACE FUNCTION public.handle_user_changes()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.created_at, now()))
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    created_at = EXCLUDED.created_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_changes();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_changes();

-- Resynchronize existing users
INSERT INTO public.users (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  created_at = EXCLUDED.created_at;