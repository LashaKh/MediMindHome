import React from 'react';
import { format } from 'date-fns';
import { Bot, User, Image as ImageIcon } from 'lucide-react';
import { Message } from '../../../types/chat';
import { formatAIResponse, sanitizeHTML } from '../../../utils/messageFormatter';
import { MessageContent } from './MessageContent';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.type === 'ai';
  const isStreaming = message.status === 'streaming';

  return (
    <div
      className={clsx(
        'flex gap-3 p-4 animate-fade-in',
        isAI ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
      )}
    >
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {isAI ? 'MediMind AI' : 'You'}
          </span>
          <span className="text-sm text-gray-500">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>
        
        {message.imageUrl && (
          <div className="relative group">
            <img
              src={message.imageUrl}
              alt="Uploaded content"
              className="max-w-sm rounded-lg shadow-sm"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
          </div>
        )}

        <MessageContent 
          content={isAI ? formatAIResponse(message.content) : message.content}
          isAI={isAI}
        />
        
        {message.metadata?.imageAnalysis && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-2 text-primary dark:text-blue-400">
              <ImageIcon className="w-4 h-4" />
              <span className="font-medium">Image Analysis</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {message.metadata.imageAnalysis}
            </p>
          </div>
        )}
        
        {isStreaming && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Typing...</span>
          </div>
        )}
      </div>
    </div>
  );
};