import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ChatInterface: React.FC = () => {
  const { messages, loading, error, sendMessage, loadMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Start a conversation with MediMind AI</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto divide-y dark:divide-gray-800">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-center">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <InputArea onSend={sendMessage} disabled={loading} />
      
      {loading && (
        <div className="absolute top-4 right-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};