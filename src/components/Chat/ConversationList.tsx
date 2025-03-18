import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversationStore } from '../../store/useConversationStore';
import { 
  Search, MessageSquare, Trash2, MoreHorizontal, 
  Calendar, Clock, Filter, Bookmark
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConversationTitle } from './ConversationTitle';
import { useTranslation } from '../../hooks/useTranslation';
import { Tooltip } from '../common/Tooltip';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const ConversationList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { 
    conversations,
    loading,
    error,
    selectedConversationId,
    selectConversation,
    deleteConversation
  } = useConversationStore();

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorite-conversations');
      if (savedFavorites) {
        setFavoriteIds(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (ids: Set<string>) => {
    try {
      localStorage.setItem('favorite-conversations', JSON.stringify([...ids]));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavorites = new Set(favoriteIds);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    saveFavorites(newFavorites);
  };

  const handleConversationClick = (conversationId: string) => {
    selectConversation(conversationId);
    navigate(`/chat/${conversationId}`);
  };

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    // Hardcode the confirmation message for now, add to translations later
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(conversationId);
        if (selectedConversationId === conversationId) {
          navigate('/chat');
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  // Group conversations by date
  const getTimeLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return 'This Week';
    if (isThisMonth(date)) return 'This Month';
    return format(date, 'MMMM yyyy');
  };

  // Filter and sort conversations
  let filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeFilter === 'favorites') {
    filteredConversations = filteredConversations.filter(c => favoriteIds.has(c.id));
  } else if (activeFilter === 'today') {
    filteredConversations = filteredConversations.filter(c => isToday(c.updatedAt));
  } else if (activeFilter === 'week') {
    filteredConversations = filteredConversations.filter(c => isThisWeek(c.updatedAt));
  }

  // Sort conversations
  filteredConversations = [...filteredConversations].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
  });

  // Group conversations by date
  const groupedConversations: Record<string, typeof filteredConversations> = {};
  filteredConversations.forEach(conversation => {
    const groupKey = getTimeLabel(conversation.updatedAt);
    if (!groupedConversations[groupKey]) {
      groupedConversations[groupKey] = [];
    }
    groupedConversations[groupKey].push(conversation);
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary transition-all"
            aria-label="Search conversations"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="px-4 py-2 flex-shrink-0 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-md flex items-center text-xs gap-1 ${
              showFilters 
              ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-accent' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            aria-label={sortOrder === 'newest' ? 'Sort by newest' : 'Sort by oldest'}
          >
            <Clock className="w-4 h-4" />
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 flex gap-2 pb-2 overflow-x-auto scrollbar-thin">
            <button
              onClick={() => setActiveFilter(activeFilter === 'favorites' ? null : 'favorites')}
              className={`px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5 whitespace-nowrap
                ${activeFilter === 'favorites' 
                  ? 'bg-primary/10 border-primary text-primary dark:bg-accent/20 dark:border-accent dark:text-accent' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Bookmark className="w-3 h-3" />
              Favorites
            </button>
            
            <button
              onClick={() => setActiveFilter(activeFilter === 'today' ? null : 'today')}
              className={`px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5 whitespace-nowrap
                ${activeFilter === 'today' 
                  ? 'bg-primary/10 border-primary text-primary dark:bg-accent/20 dark:border-accent dark:text-accent' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Calendar className="w-3 h-3" />
              Today
            </button>
            
            <button
              onClick={() => setActiveFilter(activeFilter === 'week' ? null : 'week')}
              className={`px-3 py-1.5 text-xs rounded-full border flex items-center gap-1.5 whitespace-nowrap
                ${activeFilter === 'week' 
                  ? 'bg-primary/10 border-primary text-primary dark:bg-accent/20 dark:border-accent dark:text-accent' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Calendar className="w-3 h-3" />
              This Week
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 text-red-500 text-center rounded-lg mx-4 my-2 bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {Object.entries(groupedConversations).map(([dateGroup, groupConversations]) => (
          <div key={dateGroup} className="mt-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {dateGroup}
            </div>
            
            {groupConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 group 
                  ${selectedConversationId === conversation.id 
                    ? 'bg-gray-100 dark:bg-gray-600' 
                    : ''}
                  relative transition-colors`}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(e, conversation.id)}
                        className="text-gray-400 hover:text-amber-400 active:scale-110 transition-all"
                        aria-label={favoriteIds.has(conversation.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${favoriteIds.has(conversation.id) ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
                      </button>
                      <ConversationTitle conversation={conversation} />
                    </div>
                    
                    {conversation.lastMessage && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate line-clamp-1">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(conversation.updatedAt, 'HH:mm')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-1">
                    <Tooltip content="Delete" position="left">
                      <button
                        onClick={(e) => handleDelete(e, conversation.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    
                    <div className="relative group">
                      <Tooltip content="More options" position="left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle dropdown menu
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      
                      {/* Dropdown implementation can be added here */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {loading && (
          <div className="p-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!loading && filteredConversations.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">
              {searchQuery
                ? 'No conversations found'
                : activeFilter
                  ? 'No conversations match the filter'
                  : 'No conversations yet'}
            </p>
            <p className="mt-2 text-sm max-w-xs mx-auto">
              {searchQuery
                ? 'Try a different search term'
                : activeFilter
                  ? 'Try clearing your filters'
                  : 'Start a new conversation to get going'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};