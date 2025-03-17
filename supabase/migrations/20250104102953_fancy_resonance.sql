/*
  # Fix Conversation RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow proper conversation creation flow
    - Fix participant management
    - Update conversation access controls
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable conversation creation" ON conversations;
DROP POLICY IF EXISTS "Enable conversation viewing" ON conversations;
DROP POLICY IF EXISTS "Enable conversation updates" ON conversations;
DROP POLICY IF EXISTS "Enable participant creation" ON conversation_participants;
DROP POLICY IF EXISTS "Enable message creation" ON messages;

-- Create more permissive conversation policies
CREATE POLICY "Allow conversation creation" ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow conversation access" ON conversations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

-- Allow users to manage their own participants
CREATE POLICY "Allow participant management" ON conversation_participants
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Allow message management in conversations
CREATE POLICY "Allow message management" ON messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );