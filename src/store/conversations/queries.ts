import { supabase } from '../../lib/supabase';
import type { Conversation } from '../../types/chat';

export async function fetchConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      conversation_participants!inner(*),
      messages(
        content,
        created_at,
        type
      )
    `)
    .eq('conversation_participants.user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertConversation(userId: string, title?: string) {
  // First create the conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert([{
      title: title || 'New Conversation',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (convError) throw convError;

  // Then create the participant
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([{
      conversation_id: conversation.id,
      user_id: userId
    }]);

  if (partError) {
    // If participant creation fails, clean up the conversation
    await supabase
      .from('conversations')
      .delete()
      .eq('id', conversation.id);
    throw partError;
  }

  return conversation;
}

export async function updateConversationTitle(id: string, title: string) {
  const { error } = await supabase
    .from('conversations')
    .update({
      title,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteConversationRecord(id: string) {
  try {
    // First delete all messages
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', id);

    if (messagesError) throw messagesError;

    // Then delete participants
    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', id);

    if (participantsError) throw participantsError;

    // Finally delete the conversation
    const { error: conversationError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (conversationError) throw conversationError;
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    throw new Error('Failed to delete conversation');
  }
}