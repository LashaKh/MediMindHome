import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversationStore } from '../../store/useConversationStore';
import { Search, MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConversationTitle } from './ConversationTitle';
import { useTranslation } from '../../hooks/useTranslation';

export const ConversationList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    conversations,
    loading,
    error,
    selectedConversationId,
    selectConversation,
    deleteConversation
  } = useConversationStore();

  const handleConversationClick = (conversationId: string) => {
    selectConversation(conversationId);
    navigate(`/chat/${conversationId}`);
  };

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(conversationId);
        if (selectedConversationId === conversationId) {
          navigate('/chat');
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder={t('chat.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-500 text-center">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 group ${
              selectedConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-600' : ''
            } relative`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <ConversationTitle conversation={conversation} />
                {conversation.lastMessage && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {format(conversation.updatedAt, 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, conversation.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="p-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!loading && filteredConversations.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              {searchQuery
                ? t('chat.noConversationsFound')
                : t('chat.noConversations')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};