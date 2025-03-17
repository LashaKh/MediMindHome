-- Drop existing policies
DROP POLICY IF EXISTS "Enable conversation creation" ON conversations;
DROP POLICY IF EXISTS "Enable conversation access" ON conversations;
DROP POLICY IF EXISTS "Enable participant management" ON conversation_participants;
DROP POLICY IF EXISTS "Enable message management" ON messages;

-- Create simplified conversation policies
CREATE POLICY "Allow conversation creation"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow conversation access"
ON conversations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

-- Allow participant management with simplified policy
CREATE POLICY "Allow participant management"
ON conversation_participants FOR ALL
TO authenticated
USING (true)
WITH CHECK (user_id = auth.uid());

-- Allow message management with proper checks
CREATE POLICY "Allow message management"
ON messages FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);