import type { Conversation } from '../../types/chat';

export function mapConversationFromDB(data: any): Conversation {
  const lastMessage = data.messages?.[0];
  
  return {
    id: data.id,
    title: data.title,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    participantIds: data.conversation_participants?.map((p: any) => p.user_id) || [],
    status: data.status,
    lastMessage: lastMessage ? {
      content: lastMessage.content,
      timestamp: new Date(lastMessage.created_at),
      senderId: lastMessage.type === 'user' ? data.conversation_participants[0].user_id : 'ai'
    } : undefined
  };
}