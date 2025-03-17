import React, { useRef, useEffect } from 'react';
import { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useChatStore } from '../../store/useChatStore';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessage = useChatStore(state => state.streamingMessage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage?.content]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {streamingMessage && (
        <MessageBubble message={streamingMessage} />
      )}
      {loading && (
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-center rounded-lg">
          {error}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};