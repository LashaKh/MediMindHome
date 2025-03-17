import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversationStore } from '../../store/useConversationStore';
import { useEffect } from 'react';

export const NewChatButton: React.FC = () => {
  const navigate = useNavigate();
  const { createConversation, selectConversation } = useConversationStore();

  const handleNewChat = async () => {
    try {
      const conversationId = await createConversation();
      selectConversation(conversationId);
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error('Failed to create new conversation:', error);
    }
  };

  return (
    <button
      onClick={handleNewChat}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <PlusCircle className="w-5 h-5" />
      <span>New Chat</span>
    </button>
  );
};