import React, { useState } from 'react';
import { format } from 'date-fns';
import { Bot, User, ChevronDown, ChevronRight, BookOpen, Copy, CheckCheck } from 'lucide-react';
import { Message } from '../../types/chat';
import clsx from 'clsx';
import MarkdownRenderer from '../common/MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.type === 'ai';
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasSources = isAI && message.metadata?.sources && message.metadata.sources.length > 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        'animate-fade-in border-b dark:border-gray-800 transition-colors',
        isAI 
          ? 'p-4 sm:p-6 bg-gray-50/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-800/50' 
          : 'py-3 sm:py-4 px-4 sm:px-6 bg-white dark:bg-gray-900 hover:bg-gray-50/30 dark:hover:bg-gray-800/30'
      )}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            {isAI ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-secondary to-accent text-white flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className={clsx(
                "font-medium",
                isAI 
                  ? "text-gray-800 dark:text-gray-200 text-base" 
                  : "text-gray-700 dark:text-gray-300 text-sm"
              )}>
                {isAI ? 'MediMind AI' : 'You'}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <time dateTime={message.timestamp.toISOString()}>
                  {format(message.timestamp, 'MMM d, h:mm a')}
                </time>
                
                {isAI && (
                  <button 
                    onClick={copyToClipboard}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? 
                      <CheckCheck className="w-4 h-4 text-green-500" /> : 
                      <Copy className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                )}
              </span>
            </div>
            
            <div className={clsx(
              "prose dark:prose-invert max-w-none",
              isAI 
                ? "prose-gray prose-sm sm:prose-base" 
                : "prose-gray prose-sm"
            )}>
              <MarkdownRenderer content={message.content} />
            </div>
            
            {hasSources && (
              <div className="mt-4 pt-3 border-t dark:border-gray-700">
                <button 
                  onClick={() => setShowSources(!showSources)}
                  className="flex items-center text-sm text-primary dark:text-accent hover:underline font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {showSources ? 'Hide sources' : 'Show sources'}
                  {showSources ? 
                    <ChevronDown className="w-4 h-4 ml-1" /> : 
                    <ChevronRight className="w-4 h-4 ml-1" />
                  }
                </button>
                
                {showSources && (
                  <div className="mt-3 p-4 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-primary dark:text-accent" />
                      Sources
                    </h4>
                    <ul className="space-y-3">
                      {message.metadata?.sources?.map((source, index) => (
                        <li key={index} className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary dark:before:bg-accent">
                          {source.pageContent ? (
                            <div className="hover:bg-white dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                              <div className="font-medium text-primary dark:text-accent mb-1">{source.metadata?.source || 'Source'}</div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm">{source.pageContent}</p>
                            </div>
                          ) : (
                            <pre className="whitespace-pre-wrap overflow-x-auto bg-white dark:bg-gray-700 p-3 rounded-md text-xs">
                              {JSON.stringify(source, null, 2)}
                            </pre>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};