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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Main chat area */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {/* Center the message list with a visible container */}
        <div className="w-full px-0 md:px-4 lg:px-8 py-2">
          <div className="w-full mx-auto">
            <MessageList messages={messages} loading={loading} error={error} />
          </div>
        </div>
      </div>
      
      {/* Input area */}
      <div className="flex-shrink-0 sticky bottom-0 w-full border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md">
        <InputArea onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};