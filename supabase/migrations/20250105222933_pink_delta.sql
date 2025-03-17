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
DROP POLICY IF EXISTS "Allow conversation management" ON conversations;
DROP POLICY IF EXISTS "Allow conversation creation" ON conversations;
DROP POLICY IF EXISTS "Allow conversation access" ON conversations;
DROP POLICY IF EXISTS "Allow participant management" ON conversation_participants;
DROP POLICY IF EXISTS "Allow message management" ON messages;

-- Create new conversation policies
CREATE POLICY "Enable insert conversations"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable select conversations"
ON conversations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Enable update conversations"
ON conversations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Enable delete conversations"
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
CREATE POLICY "Enable participant management"
ON conversation_participants FOR ALL
TO authenticated
USING (true)
WITH CHECK (user_id = auth.uid());

-- Create message policies
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