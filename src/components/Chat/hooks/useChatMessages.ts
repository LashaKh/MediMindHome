import { useEffect } from 'react';
import { useChatStore } from '../../../store/useChatStore';

export const useChatMessages = (conversationId: string | null) => {
  const { messages, loading, error, loadMessages, cleanup } = useChatStore();

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    }
    return () => cleanup();
  }, [conversationId]);

  return { messages, loading, error };
};