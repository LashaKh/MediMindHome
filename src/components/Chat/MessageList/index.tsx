import React, { useRef, useEffect } from 'react';
import { Message } from '../../../types/chat';
import { MessageBubble } from '../MessageBubble';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { useChatStore } from '../../../store/useChatStore';
import { Bot } from 'lucide-react';
import clsx from 'clsx';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessage = useChatStore(state => state.streamingMessage);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessage?.content]);

  const isEmpty = messages.length === 0 && !streamingMessage;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className={clsx(
        "flex flex-col p-4",
        isEmpty ? "h-full items-center justify-center" : "space-y-1"
      )}>
        {isEmpty ? (
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Ask MediMind AI Assistant</h2>
            <p className="text-gray-500 dark:text-gray-400">Type your first message below to start a conversation</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {streamingMessage && (
              <MessageBubble message={streamingMessage} />
            )}
          </>
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

        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};