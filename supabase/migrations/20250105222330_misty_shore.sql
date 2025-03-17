-- Drop existing policies
DROP POLICY IF EXISTS "Enable conversation operations" ON conversations;
DROP POLICY IF EXISTS "Enable participant operations" ON conversation_participants;
DROP POLICY IF EXISTS "Enable message operations" ON messages;

-- Create a policy that allows all authenticated users to create conversations
CREATE POLICY "Allow conversation creation"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy that allows users to read/update their own conversations
CREATE POLICY "Allow conversation access"
ON conversations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

-- Create a policy that allows users to manage their own participants
CREATE POLICY "Allow participant management"
ON conversation_participants FOR ALL
TO authenticated
USING (true)
WITH CHECK (user_id = auth.uid());

-- Create a policy that allows users to manage messages in their conversations
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

-- Create a function to handle conversation creation atomically
CREATE OR REPLACE FUNCTION create_conversation_with_participant(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Insert conversation
  INSERT INTO conversations (title, status)
  VALUES ('New Conversation', 'active')
  RETURNING id INTO conversation_id;

  -- Insert participant
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (conversation_id, user_id);

  RETURN conversation_id;
END;
$$;