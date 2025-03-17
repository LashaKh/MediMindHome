import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import { ConversationState } from './conversations/types';
import { 
  fetchConversations, 
  insertConversation, 
  updateConversationTitle as updateTitle,
  deleteConversationRecord
} from './conversations/queries';
import { mapConversationFromDB } from './conversations/mappers';

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      selectedConversationId: null,
      loading: false,
      error: null,

      loadConversations: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return;

        try {
          set({ loading: true, error: null });
          
          // Clear existing conversations first
          set({ conversations: [], selectedConversationId: null });
          
          // Subscribe to conversation changes
          const channel = supabase
            .channel('conversations_changes')
            .on('postgres_changes', {
              event: '*',
              schema: 'public',
              table: 'conversations',
              filter: `conversation_participants.user_id=eq.${user.id}`
            }, async () => {
              const data = await fetchConversations(user.id);
              const conversations = data.map(mapConversationFromDB);
              set({ conversations });
            })
            .subscribe();

          // Initial load
          const data = await fetchConversations(user.id);
          const conversations = data.map(mapConversationFromDB);
          
          set({ conversations, loading: false });

          return () => {
            channel.unsubscribe();
          };
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load conversations',
            loading: false 
          });
        }
      },

      createConversation: async (title?: string) => {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('User not authenticated');
        try {
          set({ loading: true, error: null });
          const data = await insertConversation(user.id);
          const conversation = mapConversationFromDB(data);
          
          // Update title if provided
          if (title) {
            await updateTitle(conversation.id, title);
            conversation.title = title;
          }
          
          
          // Update title if provided
          if (title) {
            await updateTitle(conversation.id, title);
            conversation.title = title;
          }
          
          set(state => ({
            conversations: [conversation, ...state.conversations],
            selectedConversationId: conversation.id,
            loading: false
          }));
          return conversation.id;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create conversation',
            loading: false 
          });
          throw error;
        }
      },

      deleteConversation: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await deleteConversationRecord(id);
          set(state => ({
            conversations: state.conversations.filter(c => c.id !== id),
            selectedConversationId: state.selectedConversationId === id ? null : state.selectedConversationId,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete conversation',
            loading: false 
          });
          throw error;
        }
      },

      selectConversation: (id: string) => {
        set({ selectedConversationId: id });
      },

      updateConversationTitle: async (id: string, title: string) => {
        try {
          set({ loading: true, error: null });
          await updateTitle(id, title);
          
          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
            ),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update conversation title',
            loading: false 
          });
        }
      }
    }),
    {
      name: 'conversation-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        selectedConversationId: state.selectedConversationId
      })
    }
  )
);