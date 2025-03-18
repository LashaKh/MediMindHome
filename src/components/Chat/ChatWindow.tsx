import React from 'react';
import { MessageList } from './MessageList/index';
import { InputArea } from './InputArea';
import { useConversationStore } from '../../store/useConversationStore';
import { supabase } from '../../lib/supabase';
import { useChatStore } from '../../store/useChatStore';
import { Bot, BrainCircuit, FileSearch, Info, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';

export const ChatWindow: React.FC = () => {
  const { selectedConversationId } = useConversationStore();
  const { messages, loading, error, sendMessage, loadMessages, cleanup, currentSessionId } = useChatStore();
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    // Clean up on unmount and auth changes
    const handleSignOut = () => {
      cleanup();
    };
    
    window.addEventListener('auth:signout', handleSignOut);
    
    return () => {
      window.removeEventListener('auth:signout', handleSignOut);
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    if (selectedConversationId && session?.user) {
      loadMessages(selectedConversationId);
    } else {
      cleanup();
    }
    return () => cleanup();
  }, [selectedConversationId, session?.user]);

  const handleSendMessage = async (content: string | { text: string; imageUrl?: string }) => {
    if (currentSessionId && session?.user) {
      await sendMessage(content, currentSessionId);
    }
  };

  if (!selectedConversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="text-center max-w-md mx-auto p-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Welcome to MediMind AI
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Select an existing conversation or start a new one to receive personalized medical insights and assistance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <MessageSquare className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-medium mb-1 text-gray-800 dark:text-gray-200">New conversation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start from scratch with a specific question</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <FileSearch className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-medium mb-1 text-gray-800 dark:text-gray-200">Previous chats</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Continue a previous medical discussion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full z-50">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg animate-slide-up">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto pt-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <MessageList messages={messages} loading={loading} error={error} />
      </div>
      
      <div className="sticky bottom-0 w-full z-10">
        <InputArea onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};