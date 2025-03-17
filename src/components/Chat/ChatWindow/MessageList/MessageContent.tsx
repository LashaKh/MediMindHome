import React from 'react';
import { Message } from '../../../../types/chat';
import { useMessageFormatter } from '../../hooks/useMessageFormatter';

interface MessageContentProps {
  message: Message;
}

export const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  const formattedContent = useMessageFormatter(message.content, message.type === 'ai');

  return (
    <div 
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};