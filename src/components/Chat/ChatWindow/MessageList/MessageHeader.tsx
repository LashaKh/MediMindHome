import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../../../types/chat';

interface MessageHeaderProps {
  message: Message;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">
        {message.type === 'ai' ? 'MediMind AI' : 'You'}
      </span>
      <span className="text-sm text-gray-500">
        {format(message.timestamp, 'HH:mm')}
      </span>
    </div>
  );
};