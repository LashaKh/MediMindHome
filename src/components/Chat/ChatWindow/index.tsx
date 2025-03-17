import React from 'react';
import { MessageList } from './MessageList';
import { InputArea } from '../InputArea';
import { useConversationStore } from '../../../store/useConversationStore';
import { useChatStore } from '../../../store/useChatStore';
import { EmptyState } from './EmptyState';

export const ChatWindow: React.FC = () => {
  const { selectedConversationId } = useConversationStore();
  const { messages, loading, error, sendMessage, loadMessages, cleanup, currentSessionId } = useChatStore();

  React.useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
    return () => cleanup();
  }, [selectedConversationId]);

  const handleSendMessage = async (content: string | { text: string; imageUrl?: string }) => {
    if (currentSessionId) {
      await sendMessage(content, currentSessionId);
    }
  };

  if (!selectedConversationId) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList messages={messages} loading={loading} error={error} />
      </div>
      <div className="flex-shrink-0">
        <InputArea onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};