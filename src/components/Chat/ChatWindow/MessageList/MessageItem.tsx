import React from 'react';
import { Message } from '../../../../types/chat';
import { Avatar } from './Avatar';
import { MessageContent } from './MessageContent';
import { MessageHeader } from './MessageHeader';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAI = message.type === 'ai';

  return (
    <div className={`flex gap-3 p-4 animate-fade-in ${
      isAI ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
    }`}>
      <Avatar isAI={isAI} />
      <div className="flex-1 space-y-2 min-w-0">
        <MessageHeader message={message} />
        <MessageContent message={message} />
      </div>
    </div>
  );
};