import React, { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { NewChatButton } from './NewChatButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConversationStore } from '../../store/useConversationStore';
import clsx from 'clsx';

export const ChatLayout: React.FC = () => {
  const { loadConversations, selectedConversationId, conversations } = useConversationStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (window.innerWidth < 1024 && selectedConversationId) {
      setIsSidebarOpen(false);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    // Load conversations when component mounts
    loadConversations();

    // Listen for auth changes
    const handleAuthChange = () => {
      loadConversations();
    };
    
    window.addEventListener('auth:signout', handleAuthChange);
    return () => {
      window.removeEventListener('auth:signout', handleAuthChange);
    };
  }, []);

  return (
    <div className="flex relative h-[calc(100vh-5rem)]">
      <div
        className={clsx(
          'flex flex-col border-r dark:border-gray-700 transition-all duration-300 absolute lg:relative z-30 bg-white dark:bg-gray-800 h-full overflow-hidden',
          isSidebarOpen ? 'w-full lg:w-80' : 'w-0 -translate-x-full lg:translate-x-0'
        )}
      >
        <div className={clsx('flex-shrink-0 p-4 border-b dark:border-gray-700', !isSidebarOpen && 'hidden')}>
          <NewChatButton />
        </div>
        <div className={clsx('flex-1 min-h-0', !isSidebarOpen && 'hidden')}>
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No conversations yet
            </div>
          ) : (
            <ConversationList />
          )}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-4 z-10 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors lg:hidden"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
        <ChatWindow />
      </div>
    </div>
  );
};