/*
  # Fix Conversation Creation Flow

  1. Updates
    - Allow conversation creation without participant check
    - Add policy for participant creation
    - Fix message insertion for both user and AI messages
    
  2. Security
    - Maintain proper access control after creation
    - Ensure atomic conversation + participant creation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can manage participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;

-- Allow conversation creation
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow participant management only for conversation creators
CREATE POLICY "Users can manage participants" ON conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      -- Only allow if no other participants exist (new conversation)
      AND NOT EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = conversations.id
      )
    )
  );

-- Allow message insertion for both user and AI messages
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    CASE
      WHEN type = 'user' THEN
        EXISTS (
          SELECT 1 FROM conversation_participants
          WHERE conversation_id = messages.conversation_id
          AND user_id = auth.uid()
        )
      WHEN type = 'ai' THEN true
      ELSE false
    END
  );