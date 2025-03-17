-- Drop existing policies
DROP POLICY IF EXISTS "Allow conversation creation" ON conversations;
DROP POLICY IF EXISTS "Allow conversation access" ON conversations;
DROP POLICY IF EXISTS "Allow participant management" ON conversation_participants;
DROP POLICY IF EXISTS "Allow message management" ON messages;

-- Create more permissive conversation policies
CREATE POLICY "Enable conversation creation"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable conversation access"
ON conversations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

-- Allow participant management
CREATE POLICY "Enable participant management"
ON conversation_participants FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow message management
CREATE POLICY "Enable message management"
ON messages FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);