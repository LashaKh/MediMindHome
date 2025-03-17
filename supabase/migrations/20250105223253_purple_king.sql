-- Drop existing policies
DROP POLICY IF EXISTS "Allow conversation creation" ON conversations;
DROP POLICY IF EXISTS "Allow conversation access" ON conversations;
DROP POLICY IF EXISTS "Allow conversation updates" ON conversations;
DROP POLICY IF EXISTS "Allow conversation deletion" ON conversations;
DROP POLICY IF EXISTS "Allow participant management" ON conversation_participants;
DROP POLICY IF EXISTS "Allow message management" ON messages;

-- Create conversation policies
CREATE POLICY "Allow conversation creation"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow conversation access"
ON conversations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow conversation updates"
ON conversations FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow conversation deletion"
ON conversations FOR DELETE
TO authenticated
USING (true);

-- Create participant policies
CREATE POLICY "Allow participant management"
ON conversation_participants FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create message policies
CREATE POLICY "Allow message management"
ON messages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to handle conversation deletion
CREATE OR REPLACE FUNCTION delete_conversation(conversation_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all messages first
  DELETE FROM messages
  WHERE conversation_id = $1;

  -- Delete all participants
  DELETE FROM conversation_participants
  WHERE conversation_id = $1;

  -- Finally delete the conversation
  DELETE FROM conversations
  WHERE id = $1;
END;
$$;