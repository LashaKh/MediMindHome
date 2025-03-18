import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, LayoutGrid, List, Clock, Calendar, Tag, X, ChevronLeft, StickyNote, FileText } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';
import { NotesList } from './NotesList';
import { NotesGrid } from './NotesGrid';
import { useTranslation } from '../../hooks/useTranslation';

export const NotesSidebar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'today' | 'tagged'>('all');
  const { createNote, notes } = useNotesStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Check if screen is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  }, [location.pathname, isMobile]);
  
  // Get counts for filter badges
  const todayNotes = notes.filter(note => {
    const today = new Date();
    const noteDate = new Date(note.updatedAt);
    return (
      noteDate.getDate() === today.getDate() &&
      noteDate.getMonth() === today.getMonth() &&
      noteDate.getFullYear() === today.getFullYear()
    );
  }).length;
  
  const taggedNotes = notes.filter(note => note.tags && note.tags.length > 0).length;

  const handleNewNote = async () => {
    try {
      const noteId = await createNote();
      // If noteId exists, navigate to the new note
      if (typeof noteId === 'string') {
        navigate(`/notes/${noteId}`);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };
  
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };
  
  // Apply filters to search query
  const getFilteredQuery = (): string => {
    if (activeFilter === 'all') return searchQuery;
    // Add more complex filtering logic here
    return searchQuery;
  };

  // Mobile toggle button
  const renderMobileToggle = () => {
    if (!isMobile) return null;
    
    return (
      <button
        onClick={toggleMobileSidebar}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg ${
          showMobileSidebar ? 'bg-red-500' : 'bg-primary'
        } text-white`}
        aria-label={showMobileSidebar ? "Close sidebar" : "Open sidebar"}
      >
        {showMobileSidebar ? <X className="w-5 h-5" /> : <StickyNote className="w-5 h-5" />}
      </button>
    );
  };

  return (
    <>
      {renderMobileToggle()}
      
      <AnimatePresence>
        {(!isMobile || showMobileSidebar) && (
          <>
            {/* Mobile backdrop */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileSidebar(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
              />
            )}
            
            <motion.div
              initial={isMobile ? { x: '100%' } : { opacity: 1 }}
              animate={isMobile ? { x: 0 } : { opacity: 1 }}
              exit={isMobile ? { x: '100%' } : { opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`h-full bg-white dark:bg-gray-800 flex flex-col border-r dark:border-gray-700 ${
                isMobile ? 'fixed right-0 top-0 z-40 w-[85%] max-w-md h-full shadow-xl' : 'relative'
              }`}
            >
              {isMobile && (
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <div className="flex items-center">
                    <StickyNote className="w-5 h-5 text-primary mr-2" />
                    <h2 className="font-semibold text-lg">Notes</h2>
                  </div>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <div className="flex-shrink-0 p-4 border-b dark:border-gray-800">
                <button
                  onClick={handleNewNote}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Note</span>
                </button>
              </div>
              
              <div className="p-4 border-b dark:border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow"
                  />
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter tabs */}
              <div className="p-2 sm:p-3 border-b dark:border-gray-800 grid grid-cols-4 gap-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm flex flex-col items-center justify-center transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-300'
                  }`}
                >
                  <FileText className="w-4 h-4 mb-1" />
                  <span className="hidden xs:block">All</span>
                  <span className="text-xs font-medium">{notes.length}</span>
                </button>
                
                <button
                  onClick={() => setActiveFilter('recent')}
                  className={`p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm flex flex-col items-center justify-center transition-colors ${
                    activeFilter === 'recent' 
                      ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mb-1" />
                  <span className="hidden xs:block">Recent</span>
                </button>
                
                <button
                  onClick={() => setActiveFilter('today')}
                  className={`p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm flex flex-col items-center justify-center transition-colors ${
                    activeFilter === 'today' 
                      ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-300'
                  }`}
                >
                  <Calendar className="w-4 h-4 mb-1" />
                  <span className="hidden xs:block">Today</span>
                  {todayNotes > 0 && <span className="text-xs font-medium">{todayNotes}</span>}
                </button>
                
                <button
                  onClick={() => setActiveFilter('tagged')}
                  className={`p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm flex flex-col items-center justify-center transition-colors ${
                    activeFilter === 'tagged' 
                      ? 'bg-primary/10 text-primary dark:bg-blue-400/20 dark:text-blue-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-300'
                  }`}
                >
                  <Tag className="w-4 h-4 mb-1" />
                  <span className="hidden xs:block">Tagged</span>
                  {taggedNotes > 0 && <span className="text-xs font-medium">{taggedNotes}</span>}
                </button>
              </div>
              
              {/* View toggle */}
              <div className="p-2 sm:p-4 border-b dark:border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">View</span>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-primary dark:text-blue-300' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    } transition-all`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-primary dark:text-blue-300' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    } transition-all`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {viewMode === 'list' ? (
                  <NotesList searchQuery={getFilteredQuery()} />
                ) : (
                  <NotesGrid searchQuery={getFilteredQuery()} />
                )}
              </div>
              
              {notes.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
                    <StickyNote className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                    Create your first note to get started
                  </p>
                  <button
                    onClick={handleNewNote}
                    className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Note
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};