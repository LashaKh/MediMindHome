import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2, Plus, Tag } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';

interface NotesListProps {
  searchQuery: string;
}

export const NotesList: React.FC<NotesListProps> = ({ searchQuery }) => {
  const { notes, selectNote, deleteNote, createNote } = useNotesStore();
  const navigate = useNavigate();

  const handleNoteClick = (noteId: string) => {
    selectNote(noteId);
    navigate(`/notes/${noteId}`);
  };

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleNewNote = async () => {
    try {
      await createNote();
      // Navigate to the newly created note will be handled by the store's selectNote
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = typeof note.content === 'string' 
      ? note.content.toLowerCase().includes(searchQuery.toLowerCase())
      : String(note.content).toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = note.tags?.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return titleMatch || contentMatch || tagMatch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <button
          onClick={handleNewNote}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Note</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto divide-y dark:divide-gray-800">
      {filteredNotes.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group relative"
          onClick={() => handleNoteClick(note.id)}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">
                {note.title || 'Untitled Note'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {typeof note.content === 'string' 
                  ? note.content.replace(/<[^>]*>/g, '') 
                  : String(note.content).replace(/<[^>]*>/g, '')}
              </p>
              
              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {note.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-1">
                {format(note.updatedAt, 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(e, note.id)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
      </div>
      {filteredNotes.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p>No notes found</p>
        </div>
      )}
    </div>
  );
};