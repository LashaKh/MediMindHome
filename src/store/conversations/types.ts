import type { Conversation } from '../../types/chat';

export interface ConversationState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  loading: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  createConversation: (title?: string) => Promise<string>;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => Promise<void>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
}