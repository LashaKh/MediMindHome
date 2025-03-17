import React from 'react';
import { parseMarkdown } from '../../utils/markdown/parser';
import '../../styles/markdown.css';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ 
  content,
  className = ''
}) => {
  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};