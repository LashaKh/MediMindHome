import React from 'react';
import { MessageList } from './MessageList/index';
import { InputArea } from './InputArea';
import { useConversationStore } from '../../store/useConversationStore';
import { supabase } from '../../lib/supabase';
import { useChatStore } from '../../store/useChatStore';
import { Bot } from 'lucide-react';
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
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
            Select a conversation or start a new one
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 relative">
      <div className="flex-1 overflow-y-auto pt-2">
        <MessageList messages={messages} loading={loading} error={error} />
      </div>
      <div className="sticky bottom-0 w-full">
        <InputArea onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};