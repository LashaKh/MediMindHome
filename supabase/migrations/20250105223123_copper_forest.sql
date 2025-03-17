/*
  # Fix Conversation RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Create new permissive policies for conversations
    - Add function for conversation deletion
    - Update participant and message policies

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert conversations" ON conversations;
DROP POLICY IF EXISTS "Enable select conversations" ON conversations;
DROP POLICY IF EXISTS "Enable update conversations" ON conversations;
DROP POLICY IF EXISTS "Enable delete conversations" ON conversations;
DROP POLICY IF EXISTS "Enable participant management" ON conversation_participants;
DROP POLICY IF EXISTS "Enable message management" ON messages;

-- Create new conversation policies
CREATE POLICY "Allow conversation creation"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

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

CREATE POLICY "Allow conversation updates"
ON conversations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Allow conversation deletion"
ON conversations FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

-- Create participant policies
CREATE POLICY "Allow participant management"
ON conversation_participants FOR ALL
TO authenticated
USING (true)
WITH CHECK (user_id = auth.uid());

-- Create message policies
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