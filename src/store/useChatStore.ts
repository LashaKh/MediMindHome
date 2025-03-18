import { create } from 'zustand';
import { fetchAIResponse } from '../lib/api/chat';
import { supabase } from '../lib/supabase';
import type { Message } from '../types/chat';

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentSessionId: string | null;
  streamingMessage: Message | null;
  sendMessage: (content: string | { text: string; imageUrl?: string }, sessionId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  setSessionId: (sessionId: string) => void;
  cleanup: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  currentSessionId: null,
  streamingMessage: null,

  setSessionId: (sessionId: string) => {
    set({ currentSessionId: sessionId });
  },

  sendMessage: async (content: string | { text: string; imageUrl?: string }, sessionId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user?.id || !sessionId) {
      throw new Error('Invalid message parameters');
      return;
    }

    const messageId = crypto.randomUUID();
    const aiMessageId = crypto.randomUUID();
    const isSystemMessage = typeof content === 'string' && content.startsWith('System:');
    const messageContent = typeof content === 'string' ? content : content.text;
    const imageUrl = typeof content === 'object' ? content.imageUrl : undefined;

    try {
      set({ loading: true, error: null });
      
      // Only add user message if it's not a system message
      if (!isSystemMessage) {
        const { error: insertError } = await supabase
          .from('messages')
          .insert([{
            id: messageId,
            conversation_id: sessionId,
            content: messageContent,
            image_url: imageUrl,
            type: 'user',
            status: 'sent'
          }]);

        if (insertError) throw insertError;
        
        // Add message to local state
        set(state => ({
          messages: [...state.messages, {
            id: messageId,
            conversationId: sessionId,
            content: messageContent,
            imageUrl,
            type: 'user',
            timestamp: new Date(),
            status: 'sent'
          }]
        }));
      }

      // Get AI response
      const aiResponse = await fetchAIResponse(content, sessionId);
      
      const metadata = {
        imageAnalysis: aiResponse.imageAnalysis,
        sources: aiResponse.sources
      };

      // Add AI message to database
      const { error: aiInsertError } = await supabase
        .from('messages')
        .insert([{
          id: aiMessageId,
          conversation_id: sessionId,
          content: aiResponse.text,
          type: 'ai',
          status: 'delivered',
          metadata
        }]);

      if (aiInsertError) throw aiInsertError;

      // Add AI message to local state
      set(state => ({
        messages: [...state.messages, {
          id: aiMessageId,
          conversationId: sessionId,
          content: aiResponse.text,
          type: 'ai',
          timestamp: new Date(),
          status: 'delivered',
          metadata
        }]
      }));

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loadMessages: async (conversationId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user?.id) {
      console.error('No authenticated user found');
      return;
    }

    try {
      set({ loading: true, error: null, currentSessionId: conversationId });
      
      // Subscribe to message changes
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes', { 
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, async () => {
          // Fetch latest messages
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Error fetching messages:', error);
            return;
          }

          const messages = data.map(msg => ({
            id: msg.id,
            conversationId: msg.conversation_id,
            content: msg.content,
            imageUrl: msg.image_url,
            type: msg.type,
            timestamp: new Date(msg.created_at),
            status: msg.status,
            metadata: msg.metadata
          }));

          set({ messages });
        })
        .subscribe();

      // Initial messages load
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages = data.map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        content: msg.content,
        imageUrl: msg.image_url,
        type: msg.type,
        timestamp: new Date(msg.created_at),
        status: msg.status,
        metadata: msg.metadata
      }));

      set({ messages, loading: false });

      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load messages',
        loading: false 
      });
    }
  },

  cleanup: () => {
    set({
      messages: [],
      loading: false,
      error: null,
      currentSessionId: null,
      streamingMessage: null
    });
  }
}));