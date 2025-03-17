/*
  # Fix Conversation Creation Flow
  
  1. Changes
    - Add stored procedure for atomic conversation creation
    - Simplify RLS policies
    - Ensure proper transaction handling
*/

-- Create a function to handle conversation creation atomically
CREATE OR REPLACE FUNCTION create_conversation(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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