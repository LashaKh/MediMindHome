import React, { useEffect } from 'react';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ChevronRight, ChevronLeft } from 'lucide-react';
import { NotesSidebar } from './NotesSidebar';
import { useNotesStore } from '../../store/useNotesStore';

export const NotesLayout: React.FC = () => {
  const { loadNotes, cleanup, createNote } = useNotesStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isNoteOpen = location.pathname.includes('/notes/');

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

  useEffect(() => {
    loadNotes();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (isNoteOpen && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [isNoteOpen]);

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`relative z-30 w-72 transform transition-transform duration-300 bg-white dark:bg-gray-800 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NotesSidebar />
      </div>
      
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full relative">
        {/* Toggle Button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-4 top-20 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="fixed left-72 top-20 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <Outlet context={{ 
            isSidebarOpen,
            toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
            onNewNote: handleNewNote
          }} />
        </div>
      </div>
    </div>
  );
};