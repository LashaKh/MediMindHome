import React, { useRef, useEffect } from 'react';
import { Message } from '../../../types/chat';
import { MessageBubble } from '../MessageBubble';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {loading && (
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <div ref={messagesEndRef} />
    </div>
  );
};