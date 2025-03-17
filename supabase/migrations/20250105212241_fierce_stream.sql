-- Drop existing policies
DROP POLICY IF EXISTS "Enable user creation and updates" ON users;

-- Create a more permissive policy for the users table
CREATE POLICY "Allow user management"
ON users
FOR ALL TO authenticated
USING (
  -- Users can see their own data
  id = auth.uid() OR
  -- Allow lookup of other users for sharing
  EXISTS (
    SELECT 1 FROM patient_share_requests
    WHERE (sender_id = auth.uid() AND recipient_id = users.id)
    OR (recipient_id = auth.uid() AND sender_id = users.id)
  )
)
WITH CHECK (
  -- Users can only modify their own data
  id = auth.uid()
);

-- Ensure the trigger function exists and is up to date
CREATE OR REPLACE FUNCTION public.handle_user_changes()
RETURNS trigger AS $$
BEGIN
  -- For inserts and updates
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

-- Resynchronize all users
INSERT INTO public.users (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  created_at = EXCLUDED.created_at;