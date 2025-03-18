import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-headings:font-bold prose-headings:mb-3 
      prose-p:mb-3 prose-p:text-gray-700 dark:prose-p:text-gray-300
      prose-ul:pl-5 prose-ul:space-y-1 prose-ul:mb-4 prose-ul:list-disc
      prose-ol:pl-5 prose-ol:space-y-1 prose-ol:mb-4 prose-ol:list-decimal
      prose-li:pl-1
      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:hover:underline
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 
      prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic
      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-table:border-collapse prose-table:table-auto prose-table:w-full prose-table:mb-4
      prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:px-4 prose-th:py-2 prose-th:text-left
      prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-2
      dark:prose-invert max-w-none ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 