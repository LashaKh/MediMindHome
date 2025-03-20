import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Clock, Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  recentSearches: string[];
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  initialValue = '', 
  recentSearches,
  isSearching
}) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(initialValue);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    try {
      // This is just a placeholder - actual implementation would require proper voice recognition
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputValue(prev => `${prev} sample voice input`.trim());
      }, 2000);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsRecording(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isSearching) {
      onSearch(inputValue.trim());
      setShowRecentSearches(false);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setInputValue(search);
    onSearch(search);
    setShowRecentSearches(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => recentSearches.length > 0 && setShowRecentSearches(true)}
            placeholder="Search medical literature, guidelines, news..."
            className={`w-full py-2.5 pl-10 pr-12 ${
              theme === 'light' 
                ? 'bg-white border-gray-300 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500' 
                : 'bg-[#1A2333] border-white/20 focus:ring-primary focus:border-primary text-white placeholder-gray-400'
            } border rounded-lg`}
            disabled={isSearching}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            {isSearching ? (
              <div className="mr-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`mr-2 p-1.5 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : theme === 'light'
                      ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                disabled={isSearching}
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Recent searches dropdown */}
      {showRecentSearches && recentSearches.length > 0 && (
        <div 
          ref={dropdownRef}
          className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg border py-2 ${
            theme === 'light' 
              ? 'bg-white border-gray-200' 
              : 'bg-[#1A2333] border-white/20'
          }`}
        >
          <div className={`px-3 py-1.5 text-xs font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Recent Searches</div>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className={`px-3 py-2 flex items-center cursor-pointer ${
                theme === 'light' 
                  ? 'hover:bg-gray-100' 
                  : 'hover:bg-white/10'
              }`}
              onClick={() => handleRecentSearchClick(search)}
            >
              <Clock className={`h-4 w-4 mr-2 flex-shrink-0 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{search}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 