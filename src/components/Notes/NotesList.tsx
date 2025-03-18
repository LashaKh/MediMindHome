import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2, Plus, Tag, Clock, Star, Filter, ChevronDown, CalendarDays, StickyNote } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';
import { useTranslation } from '../../hooks/useTranslation';

interface NotesListProps {
  searchQuery: string;
}

export const NotesList: React.FC<NotesListProps> = ({ searchQuery }) => {
  const { notes, selectNote, deleteNote, createNote } = useNotesStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  const toggleSort = (type: 'date' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  // Get all unique tags from notes
  const allTags = Array.from(
    new Set(
      notes.flatMap(note => note.tags || [])
    )
  );

  let filteredNotes = notes.filter(note => {
    const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = typeof note.content === 'string' 
      ? note.content.toLowerCase().includes(searchQuery.toLowerCase())
      : String(note.content).toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = note.tags?.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Additional filter for selected tag
    const tagFilter = selectedTag ? note.tags?.includes(selectedTag) : true;
    
    return (titleMatch || contentMatch || tagMatch) && tagFilter;
  });

  // Sort the filtered notes
  filteredNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      const titleA = a.title || 'Untitled Note';
      const titleB = b.title || 'Untitled Note';
      return sortOrder === 'asc'
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }
  });

  // Group notes by date if sorting by date
  const groupedNotes: Record<string, typeof filteredNotes> = {};
  
  if (sortBy === 'date') {
    filteredNotes.forEach(note => {
      const dateKey = format(new Date(note.updatedAt), 'yyyy-MM-dd');
      if (!groupedNotes[dateKey]) {
        groupedNotes[dateKey] = [];
      }
      groupedNotes[dateKey].push(note);
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sort and Filter Controls */}
      <div className="px-4 py-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button 
              onClick={() => toggleSort('date')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                sortBy === 'date' 
                  ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Date</span>
              {sortBy === 'date' && (
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? '' : 'rotate-180'}`} />
              )}
            </button>
            
            <button 
              onClick={() => toggleSort('title')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ml-2 ${
                sortBy === 'title' 
                  ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Star className="w-3 h-3" />
              <span>Title</span>
              {sortBy === 'title' && (
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? '' : 'rotate-180'}`} />
              )}
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                selectedTag 
                  ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{selectedTag || "Filter"}</span>
            </button>
            
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-2 w-48 max-h-60 overflow-y-auto z-20"
                >
                  <button 
                    onClick={() => {
                      setSelectedTag(null);
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Show All
                  </button>
                  
                  {allTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1.5 text-primary" />
                      {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <button
          onClick={handleNewNote}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {sortBy === 'date' ? (
          // Display notes grouped by date
          Object.entries(groupedNotes).map(([dateKey, notes]) => (
            <div key={dateKey} className="group mb-2">
              <div className="sticky top-[3.5rem] bg-gray-100 dark:bg-gray-800 backdrop-blur-sm px-4 py-2 text-xs text-gray-500 dark:text-blue-300 font-medium flex items-center z-10 border-b border-gray-200 dark:border-gray-700">
                <CalendarDays className="w-3 h-3 mr-1.5" />
                <span className="truncate">{format(new Date(dateKey), 'MMMM d, yyyy')}</span>
                <span className="ml-auto pl-2 flex-shrink-0 text-xs text-gray-400">{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
              </div>
              <div className="px-4">
                <div className="pt-2 space-y-2 pb-2">
                  {notes.map((note) => renderNoteItem(note))}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Display notes without grouping
          filteredNotes.map((note) => renderNoteItem(note))
        )}
      </div>
      
      {filteredNotes.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-full mb-4">
            <StickyNote className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">No notes found</p>
          <p className="text-sm mt-1">{searchQuery ? "Try a different search" : "Create your first note"}</p>
          {!searchQuery && (
            <button
              onClick={handleNewNote}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              New Note
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Helper function to render a single note item
  function renderNoteItem(note: any) {
    return (
      <motion.div
        key={note.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/note relative rounded-md"
        onClick={() => handleNoteClick(note.id)}
        whileHover={{ scale: 1.005 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium truncate text-sm sm:text-base mr-2">
                {note.title || "Untitled Note"}
              </h3>
              <button
                onClick={(e) => handleDelete(e, note.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover/note:opacity-100 transition-opacity"
                aria-label="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 break-words">
              {typeof note.content === 'string' 
                ? note.content.replace(/<[^>]*>/g, '') 
                : String(note.content).replace(/<[^>]*>/g, '')}
            </div>
            
            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.slice(0, 3).map((tag: string) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-1.5 py-0.5 bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300 rounded-full text-xs"
                  >
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                )}
              </div>
            )}
            
            <div className="text-[10px] sm:text-xs text-gray-400 mt-2 flex items-center">
              <Clock className="w-3 h-3 mr-1 inline" />
              {format(new Date(note.updatedAt), 'MMM d, HH:mm')}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
};