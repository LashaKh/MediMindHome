import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';
import { NotesList } from './NotesList';
import { NotesGrid } from './NotesGrid';
import { useTranslation } from '../../hooks/useTranslation';

export const NotesSidebar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const { createNote } = useNotesStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNewNote = async () => {
    try {
      const noteId = await createNote();
      if (noteId) {
        navigate(`/notes/${noteId}`);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 flex flex-col border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-800">
        <button
          onClick={handleNewNote}
          className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>{t('notes.newNote')}</span>
        </button>
      </div>

      <div className="p-4 border-b dark:border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder={t('notes.searchNotes')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="p-2 sm:p-4 border-b dark:border-gray-800 flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {viewMode === 'list' ? (
          <NotesList searchQuery={searchQuery} />
        ) : (
          <NotesGrid searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
};