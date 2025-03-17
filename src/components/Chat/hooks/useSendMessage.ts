import { useChatStore } from '../../../store/useChatStore';

export const useSendMessage = () => {
  const { sendMessage, currentSessionId, loading } = useChatStore();

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) return;
    await sendMessage(content, currentSessionId);
  };

  return { sendMessage: handleSendMessage, loading };
};