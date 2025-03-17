import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { useConversationStore } from '../../store/useConversationStore';
import { useTranslation } from '../../hooks/useTranslation';
import type { Conversation } from '../../types/chat';

interface ConversationTitleProps {
  conversation: Conversation;
}

export const ConversationTitle: React.FC<ConversationTitleProps> = ({ conversation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateConversationTitle } = useConversationStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(conversation.title);
  }, [conversation.title]);

  const handleSave = async () => {
    if (editedTitle.trim() && editedTitle !== conversation.title) {
      try {
        await updateConversationTitle(conversation.id, editedTitle.trim());
      } catch (error) {
        console.error('Failed to update conversation title:', error);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(conversation.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-sm rounded border dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
          placeholder={t('chat.untitledConversation')}
        />
        <button
          onClick={handleSave}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
        >
          <Check className="w-4 h-4 text-green-500" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
        >
          <X className="w-4 h-4 text-red-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h3 className="text-sm font-medium truncate flex-1">
        {conversation.title || t('chat.untitledConversation')}
      </h3>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};