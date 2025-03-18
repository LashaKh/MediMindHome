export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  participantIds: string[];
  status: 'active' | 'archived';
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  imageUrl?: string;
  type: 'user' | 'ai';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'error' | 'streaming';
  metadata?: {
    error?: string;
    aiModel?: string;
    tokens?: number;
    imageAnalysis?: string;
    sources?: any[];
  };
}