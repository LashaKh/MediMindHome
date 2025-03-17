import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';

interface NotesGridProps {
  searchQuery: string;
}

export const NotesGrid: React.FC<NotesGridProps> = ({ searchQuery }) => {
  const { notes, selectedNoteId, selectNote, deleteNote } = useNotesStore();
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

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {filteredNotes.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`p-4 rounded-lg border dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow ${
            selectedNoteId === note.id ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
          }`}
          onClick={() => handleNoteClick(note.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium truncate">{note.title || 'Untitled Note'}</h3>
            <button
              onClick={(e) => handleDelete(e, note.id)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{note.content}</p>
            <p className="text-xs text-gray-400">
              {format(note.updatedAt, 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};