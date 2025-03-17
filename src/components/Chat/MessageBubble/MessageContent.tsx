import React from 'react';
import { MarkdownContent } from '../../markdown/MarkdownContent';
import { Message } from '../../../types/chat';

interface MessageContentProps {
  message: Message;
}

export const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  if (message.type === 'user') {
    return (
      <p className="whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200">
        {message.content}
      </p>
    );
  }

  return (
    <MarkdownContent 
      content={message.content}
      className="prose-sm sm:prose-base"
    />
  );
};