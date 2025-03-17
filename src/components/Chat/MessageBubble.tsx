import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { Message } from '../../store/useChatStore';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.type === 'ai';

  return (
    <div
      className={clsx(
        'flex gap-2 sm:gap-3 p-3 sm:p-4 animate-fade-in',
        isAI ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
      )}
    >
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        ) : (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary text-white flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm sm:text-base">
            {isAI ? 'MediMind AI' : 'You'}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>
        
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};