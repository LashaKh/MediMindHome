import React, { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { NewChatButton } from './NewChatButton';
import { ChevronLeft, ChevronRight, X, Settings, LayoutGrid } from 'lucide-react';
import { useConversationStore } from '../../store/useConversationStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import clsx from 'clsx';

export const ChatLayout: React.FC = () => {
  const { loadConversations, selectedConversationId, conversations } = useConversationStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && selectedConversationId) {
      setIsSidebarOpen(false);
    }
  }, [selectedConversationId, isMobile]);

  // Adjust sidebar state based on screen size changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

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
  }, [loadConversations]);

  return (
    <div className="flex relative h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <div
        className={clsx(
          'flex flex-col border-r dark:border-gray-700 transition-all duration-300 z-30 bg-white dark:bg-gray-800 h-full shadow-lg',
          isMobile ? 'fixed inset-y-0 left-0 w-full md:w-80' : 'w-80',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h1>
          
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="p-3 border-b dark:border-gray-700">
          <NewChatButton fullWidth />
        </div>
        
        <div className="flex-1 min-h-0 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <LayoutGrid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start a new conversation to begin chatting with the AI assistant
              </p>
            </div>
          ) : (
            <ConversationList />
          )}
        </div>
        
        <div className="p-3 border-t dark:border-gray-700 flex justify-between">
          <button
            className="px-3 py-2 text-sm flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Toggle button - show on mobile and tablet only */}
        {(isMobile || isTablet) && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 z-10 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        
        <ChatWindow />
      </div>
    </div>
  );
};