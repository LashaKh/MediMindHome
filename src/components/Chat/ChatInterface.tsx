import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useConversationStore } from '../../store/useConversationStore';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Bot, Info } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const { messages, loading, error, sendMessage, loadMessages, currentSessionId } = useChatStore();
  const { selectedConversationId } = useConversationStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [loadMessages, selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string | { text: string; imageUrl?: string }) => {
    if (currentSessionId) {
      await sendMessage(content, currentSessionId);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 px-4 text-center">
            <div className="w-16 h-16 mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">MediMind AI Assistant</h2>
            <p className="max-w-md text-gray-500 dark:text-gray-400">Start a conversation with our AI to get medical insights, information, and assistance</p>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-primary">Get medical information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ask about symptoms, treatments, or medical procedures</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-primary">Diagnostic assistance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help understanding test results and medical reports</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-primary">Treatment options</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Learn about different treatment approaches and medications</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-primary">Medical research</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find information about the latest medical studies and research</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
        
        {error && (
          <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-center rounded-lg flex items-center justify-center space-x-2">
            <Info className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <InputArea onSend={handleSendMessage} disabled={loading} />
      
      {loading && (
        <div className="absolute top-4 right-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};