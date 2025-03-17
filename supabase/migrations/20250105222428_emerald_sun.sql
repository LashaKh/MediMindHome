-- Drop existing policies
DROP POLICY IF EXISTS "Allow conversation creation" ON conversations;
DROP POLICY IF EXISTS "Allow conversation access" ON conversations;

-- Create comprehensive conversation policies
CREATE POLICY "Allow conversation management"
ON conversations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
)
WITH CHECK (true);

-- Create a function to handle conversation deletion
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