/*
  # Fix Conversation RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies to allow conversation creation and management
    - Fix participant management
    - Allow proper message handling

  2. Security
    - Maintain proper user isolation
    - Enable secure conversation creation
    - Allow authorized message access
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;

-- Create new conversation policies
CREATE POLICY "Enable conversation creation" ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable conversation viewing" ON conversations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Enable conversation updates" ON conversations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

-- Fix participant management
CREATE POLICY "Enable participant creation" ON conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Update message policies
CREATE POLICY "Enable message creation" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );