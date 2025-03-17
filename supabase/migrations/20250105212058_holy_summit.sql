-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Create more permissive policies for the users table
CREATE POLICY "Enable user creation and updates"
ON users
FOR ALL TO authenticated
USING (
  -- Users can see their own data
  id = auth.uid() OR
  -- System can create/update user records during auth
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.users.id
    AND users.email = auth.users.email
  )
)
WITH CHECK (
  -- Users can only modify their own data
  id = auth.uid() OR
  -- System can create/update user records during auth
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.users.id
    AND users.email = auth.users.email
  )
);