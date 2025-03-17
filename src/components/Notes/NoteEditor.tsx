import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Trash2, Menu, ChevronLeft, Plus, Clock, Tag, Paperclip } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';
import { VoiceInput } from './VoiceInput';
import { useOutletContext } from 'react-router-dom';
import { RichTextEditor } from './RichTextEditor';
import { NoteTemplates } from './NoteTemplates';
import { NoteTags } from './NoteTags';
import { format } from 'date-fns';
import { Note } from '../../types/notes';

interface OutletContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onNewNote: () => void;
}

export const NoteEditor: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote, selectNote } = useNotesStore();
  const [localNote, setLocalNote] = useState({ title: '', content: '', tags: [] as string[] });
  const note = notes.find(n => n.id === noteId);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { isSidebarOpen, toggleSidebar, onNewNote } = useOutletContext<OutletContextType>();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const [showMetadata, setShowMetadata] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const handleVoiceTranscript = (text: string) => {
    if (!note) return;
    
    console.log('Received transcript:', text);
    const currentContent = typeof note.content === 'string' 
      ? note.content 
      : (note.content as any)?.content || '';
    
    const newContent = currentContent ? `${currentContent}\n${text}` : text;
    
    updateNote(note.id, { content: newContent });
  };

  const debouncedUpdate = useCallback((updates: Partial<Note>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (!note) return;
    
    saveTimeoutRef.current = setTimeout(() => {
      updateNote(note.id, updates);
    }, 500);
  }, [note, updateNote]);

  useEffect(() => {
    if (noteId && !note) {
      navigate('/notes');
    } else if (noteId && note) {
      selectNote(noteId);
      setLocalNote({
        title: note.title || '',
        content: note.content || '',
        tags: note.tags || []
      });
    }
  }, [noteId, note, navigate, selectNote]);

  if (!note) return null;

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await updateNote(note.id, {
        title: localNote.title,
        content: localNote.content,
        tags: localNote.tags
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note.id);
      navigate('/notes');
    }
  };

  const handleContentChange = (content: string) => {
    setLocalNote(prev => ({ ...prev, content }));
    debouncedUpdate({ content });
  };

  const handleTemplateSelect = (content: string) => {
    setLocalNote(prev => ({ ...prev, content }));
    debouncedUpdate({ content });
  };

  const handleAddTag = (tag: string) => {
    const updatedTags = [...localNote.tags, tag];
    setLocalNote(prev => ({ ...prev, tags: updatedTags }));
    debouncedUpdate({ tags: updatedTags });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = localNote.tags.filter(tag => tag !== tagToRemove);
    setLocalNote(prev => ({ ...prev, tags: updatedTags }));
    debouncedUpdate({ tags: updatedTags });
  };

  const formattedDate = note.updatedAt ? format(new Date(note.updatedAt), 'MMM d, yyyy h:mm a') : '';

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 flex-shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-14">
        <div className="px-2 sm:px-4 py-2 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1 className="text-lg font-semibold truncate">
            {note.title || 'Untitled Note'}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
                showMetadata ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              title="Show Metadata"
            >
              <Clock className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowTags(!showTags)}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
                showTags ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              title="Manage Tags"
            >
              <Tag className="w-5 h-5" />
            </button>
            <button
              onClick={onNewNote}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg"
              title="New Note"
            >
              <Plus className="w-6 h-6" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              title="Delete Note"
            >
              <Trash2 className="w-6 h-6" />
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg ${
                saveStatus === 'saving'
                  ? 'bg-gray-400'
                  : saveStatus === 'saved'
                  ? 'bg-green-500'
                  : saveStatus === 'error'
                  ? 'bg-red-500'
                  : 'bg-primary'
              } text-white`}
              title="Save Note"
            >
              <Save className="w-5 h-5" />
              {saveStatus === 'saving' 
                ? 'Saving...' 
                : saveStatus === 'saved'
                ? 'Saved!'
                : saveStatus === 'error'
                ? 'Error!'
                : 'Save'}
            </button>
          </div>
        </div>
      </header>

      {/* Metadata Bar */}
      {showMetadata && (
        <div className="bg-gray-50 dark:bg-gray-800 p-2 border-b dark:border-gray-700 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center mr-4">
            <Clock className="w-4 h-4 mr-1" />
            <span>Last updated: {formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            <span>Clinical Note</span>
          </div>
        </div>
      )}

      {/* Tags Management */}
      {showTags && (
        <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
          <NoteTags 
            tags={localNote.tags} 
            onAddTag={handleAddTag} 
            onRemoveTag={handleRemoveTag} 
          />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={localNote.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setLocalNote(prev => ({ ...prev, title: newTitle }));
              debouncedUpdate({ title: newTitle });
            }}
            className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Note title..."
          />
          <div className="ml-2">
            <NoteTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        </div>
        
        {/* Display tags if any */}
        {localNote.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {localNote.tags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <RichTextEditor 
          content={typeof note.content === 'string' ? note.content : (note.content as any)?.content || ''}
          onChange={handleContentChange}
          placeholder="Start writing your clinical note..."
        />
      </main>

      {/* Voice Input */}
      <div className="fixed bottom-4 right-4 z-20">
        <VoiceInput
          onTranscript={handleVoiceTranscript}
        />
      </div>
    </div>
  );
};