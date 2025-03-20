import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchFilters from './SearchFilters';
import ResultTabs from './ResultTabs';
import ResultsList from './ResultsList';
import DetailPanel from './DetailPanel';
import { SearchResult, ContentType, FilterOptions, TabCounts } from './types';
import { Loader2 } from 'lucide-react';
import { searchMedicalLiterature } from './MediSearchAPI';
import { testSimpleAPI } from './SimpleAPI';
import { useTheme } from '../../hooks/useTheme';

const MediSearchPage: React.FC = () => {
  const { theme } = useTheme();
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [filters, setFilters] = useState<FilterOptions>({
    evidenceLevel: [],
    recency: null,
    specialty: [],
    source: [],
    readingTime: null
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [resultCounts, setResultCounts] = useState<TabCounts>({});
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    console.log(`🔍 Starting search for: "${searchQuery}"`);
    setQuery(searchQuery);
    setIsSearching(true);
    setSearchError(null);
    setSelectedResult(null); // Clear any selected result when starting a new search
    
    try {
      const response = await searchMedicalLiterature({
        query: searchQuery,
        filters: filters,
        page: 1,
        limit: 20
      });
      
      console.log(`🎯 Search complete - found ${response.results.length} results`);
      setResults(response.results);
      
      // Calculate result counts by content type
      const counts: TabCounts = { all: response.results.length };
      response.results.forEach(result => {
        const type = result.contentType;
        counts[type] = (counts[type] || 0) + 1;
      });
      setResultCounts(counts);
      
      // Add to recent searches
      setRecentSearches((prev: string[]) => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        localStorage.setItem('recentMediSearches', JSON.stringify(updated));
        return updated;
      });
      
      // If API returned errors but still has some results, show a warning
      if (response.errors && response.errors.length > 0 && response.results.length > 0) {
        console.warn('⚠️ Search completed with some errors:', response.errors);
        const errorSummary = response.errors.length > 1 
          ? `Some search sources encountered errors (${response.errors.length}). Results may be limited.` 
          : response.errors[0];
        setSearchError(errorSummary);
      }
      // If no results found, provide a helpful message
      else if (response.results.length === 0) {
        console.log(`❌ No results found for "${searchQuery}"`);
        const errorMessage = response.errors && response.errors.length > 0
          ? `No results found. ${response.errors[0]}`
          : `No results found for "${searchQuery}". Try different keywords or fewer filters.`;
        setSearchError(errorMessage);
      }
    } catch (error) {
      console.error('🚨 Search error:', error);
      
      // Provide more specific error message
      let errorMessage = 'An error occurred while searching. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network') || error.message.includes('CORS')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          errorMessage = 'Search timed out. Please try again or refine your search query.';
        } else if (error.message.includes('API')) {
          errorMessage = 'Search service temporarily unavailable. Please try again later.';
        } else {
          errorMessage = `Search error: ${error.message}`;
        }
        
        console.error(`🚨 Error details: ${error.message}`);
      }
      
      setSearchError(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTabChange = (tab: ContentType | 'all') => {
    setActiveTab(tab);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
  };

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentMediSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Run test on mounting
  useEffect(() => {
    console.log('Testing Simple API module...');
    try {
      const result = testSimpleAPI();
      console.log('Simple API test result:', result);
    } catch (error) {
      console.error('Error testing Simple API module:', error);
    }
  }, []);

  // Filter results based on activeTab
  const filteredResults = results.filter(result => {
    if (activeTab !== 'all' && result.contentType !== activeTab) {
      return false;
    }
    return true;
  });

  return (
    <div className={`flex flex-col h-full max-h-[calc(100vh-4rem)] ${theme === 'light' ? 'bg-white' : 'bg-[#0D111B]'}`}>
      <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-[#121B29]'}`}>
        <h1 className={`text-xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'} mb-4`}>Medi Search</h1>
        <SearchBar 
          onSearch={handleSearch} 
          initialValue={query} 
          recentSearches={recentSearches}
          isSearching={isSearching}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Filters */}
        <div className={`w-64 border-r p-4 overflow-y-auto hidden md:block ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs for result categories */}
          <div className={`border-b ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-[#121B29]'}`}>
            <ResultTabs activeTab={activeTab} onTabChange={handleTabChange} resultCounts={resultCounts} />
          </div>
          
          {/* Results list */}
          <div className="flex-1 overflow-hidden flex">
            <div className={`${selectedResult ? 'w-1/2 md:w-3/5' : 'w-full'} overflow-y-auto p-4`}>
              {isSearching ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className={`ml-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Searching medical literature...</span>
                </div>
              ) : searchError ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                  <div className={`mb-4 p-3 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#1A2333]'} rounded-full ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-medium ${theme === 'light' ? 'text-black' : 'text-white'} mb-2`}>
                    Search Error
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-400'} max-w-md`}>
                    {searchError}
                  </p>
                  <button 
                    onClick={() => setSearchError(null)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : query ? (
                <ResultsList 
                  results={filteredResults} 
                  onResultSelect={handleResultSelect} 
                  selectedResultId={selectedResult?.id}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                  <div className={`mb-4 p-3 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#1A2333]'} rounded-full`}>
                    <Loader2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className={`text-xl font-medium ${theme === 'light' ? 'text-black' : 'text-white'} mb-2`}>
                    Begin your medical literature search
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-400'} max-w-md`}>
                    Enter a search query to find relevant medical papers, guidelines, news, and more.
                  </p>
                </div>
              )}
            </div>
            
            {/* Detail panel */}
            {selectedResult && (
              <div className={`w-1/2 md:w-2/5 border-l overflow-y-auto p-4 hidden md:block ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                <DetailPanel result={selectedResult} onClose={() => setSelectedResult(null)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediSearchPage; 