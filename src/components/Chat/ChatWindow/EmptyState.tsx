import React from 'react';
import { Bot } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

export const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
          {t('chat.selectConversation')}
        </h2>
      </div>
    </div>
  );
};