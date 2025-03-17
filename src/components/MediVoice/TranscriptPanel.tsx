import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle, Play, Search, Clock, User, UserRound, Stethoscope, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { SpeakerSegment } from './types';
import { formatTime } from './transcriptionUtils';

interface TranscriptPanelProps {
  transcriptItems: SpeakerSegment[];
  currentTime: number;
  selectedSummaryText: string | null;
  matchedTranscriptIndices: number[];
  onPlaySegment: (time: number) => void;
  transcriptContainerRef: React.RefObject<HTMLDivElement>;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcriptItems,
  currentTime,
  selectedSummaryText,
  matchedTranscriptIndices,
  onPlaySegment,
  transcriptContainerRef
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    doctor: true,
    patient: true
  });
  
  // Filter and search transcript items
  const filteredItems = transcriptItems.filter(segment => {
    // Apply role filters
    if (!filters.doctor && (segment.role.startsWith('CLINICIAN') || segment.role === 'DOCTOR')) {
      return false;
    }
    if (!filters.patient && !(segment.role.startsWith('CLINICIAN') || segment.role === 'DOCTOR')) {
      return false;
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      return segment.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleFilter = (filterName: 'doctor' | 'patient') => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-full border border-gray-100 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Transcript</h2>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {transcriptItems.length} segments
            </span>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-1.5 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search transcript..."
                      className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFilter('doctor')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filters.doctor 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <Stethoscope className="w-3 h-3" />
                      <span>Doctor</span>
                    </button>
                    <button
                      onClick={() => toggleFilter('patient')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filters.patient 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <UserRound className="w-3 h-3" />
                      <span>Patient</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div 
        ref={transcriptContainerRef}
        className="p-4 space-y-4 max-h-[600px] overflow-y-auto"
      >
        {filteredItems.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            {searchQuery ? (
              <>
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No transcript content available</p>
                {!filters.doctor || !filters.patient ? (
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                ) : null}
              </>
            )}
          </div>
        ) : (
          filteredItems.map((segment: SpeakerSegment, index: number) => {
            const isMatched = matchedTranscriptIndices.includes(
              transcriptItems.findIndex(item => item === segment)
            );
            const isDoctor = segment.role.startsWith('CLINICIAN') || segment.role === 'DOCTOR';
            const isCurrentlyPlaying = 
              currentTime >= segment.startTime && 
              currentTime <= (segment.items[segment.items.length - 1]?.time || segment.startTime + 10);
            
            return (
              <motion.div
                id={`transcript-segment-${transcriptItems.findIndex(item => item === segment)}`}
                key={`${segment.startTime}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isMatched ? [1, 1.02, 1] : 1,
                  transition: {
                    scale: isMatched ? { duration: 0.5, repeat: 0, repeatType: "reverse" } : {}
                  }
                }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={`relative group rounded-xl overflow-hidden transition-all duration-200 ${
                  isCurrentlyPlaying ? 'shadow-md' : 'hover:shadow-sm'
                } ${
                  isMatched 
                    ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-lg' 
                    : selectedSummaryText && !isCurrentlyPlaying ? 'opacity-80' : ''
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isDoctor 
                    ? 'bg-blue-400 dark:bg-blue-600' 
                    : 'bg-green-400 dark:bg-green-600'
                }`} />
                
                <div className={`px-4 py-3 ${
                  isDoctor
                    ? 'bg-blue-50/70 dark:bg-blue-900/20'
                    : 'bg-green-50/70 dark:bg-green-900/20'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${
                        isDoctor 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' 
                          : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                      }`}>
                        {isDoctor ? <Stethoscope className="w-3.5 h-3.5" /> : <UserRound className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-sm font-medium ${
                        isDoctor 
                          ? 'text-blue-800 dark:text-blue-300' 
                          : 'text-green-800 dark:text-green-300'
                      }`}>
                        {isDoctor
                          ? (segment.role.includes('_') ? `Doctor ${segment.role.split('_')[1]}` : 'Doctor')
                          : (segment.role.includes('_') ? `Patient ${segment.role.split('_')[1]}` : 'Patient')
                        }
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(segment.startTime)}</span>
                      </div>
                      {isMatched && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                          Match
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onPlaySegment(segment.startTime)}
                      className={`p-1.5 rounded-full transition-all duration-200 ${
                        isDoctor 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800/50 dark:text-blue-300 dark:hover:bg-blue-800' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800/50 dark:text-green-300 dark:hover:bg-green-800'
                      } ${isCurrentlyPlaying ? 'animate-pulse' : 'opacity-0 group-hover:opacity-100'}`}
                      title="Play from this point"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className={`px-5 py-3 ${
                  isCurrentlyPlaying ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                }`}>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {searchQuery ? (
                      highlightSearchTerms(segment.content, searchQuery)
                    ) : (
                      segment.content
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Helper function to highlight search terms
const highlightSearchTerms = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/70 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}; 