import React from 'react';
import { FilterOptions, EvidenceLevel, RecencyFilter, ReadingTimeFilter } from './types';
import { Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const { theme } = useTheme();
  
  // Sample specialties for filter options
  const specialties = [
    'Cardiology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Internal Medicine',
    'Emergency Medicine',
    'Surgery',
    'Psychiatry',
    'Dermatology',
    'Orthopedics'
  ];

  // Sample sources for filter options
  const sources = [
    'New England Journal of Medicine',
    'JAMA',
    'The Lancet',
    'BMJ',
    'Nature Medicine',
    'PLOS Medicine',
    'Cochrane Library',
    'Mayo Clinic Proceedings',
    'CDC',
    'WHO'
  ];

  // Handler for evidence level checkbox changes
  const handleEvidenceLevelChange = (level: EvidenceLevel) => {
    const updatedLevels = filters.evidenceLevel.includes(level)
      ? filters.evidenceLevel.filter(l => l !== level)
      : [...filters.evidenceLevel, level];
    
    onFilterChange({ evidenceLevel: updatedLevels });
  };

  // Handler for specialty checkbox changes
  const handleSpecialtyChange = (specialty: string) => {
    const updatedSpecialties = filters.specialty.includes(specialty)
      ? filters.specialty.filter(s => s !== specialty)
      : [...filters.specialty, specialty];
    
    onFilterChange({ specialty: updatedSpecialties });
  };

  // Handler for source checkbox changes
  const handleSourceChange = (source: string) => {
    const updatedSources = filters.source.includes(source)
      ? filters.source.filter(s => s !== source)
      : [...filters.source, source];
    
    onFilterChange({ source: updatedSources });
  };

  // Handler for recency radio button changes
  const handleRecencyChange = (recency: RecencyFilter | null) => {
    onFilterChange({ recency });
  };

  // Handler for reading time radio button changes
  const handleReadingTimeChange = (readingTime: ReadingTimeFilter | null) => {
    onFilterChange({ readingTime });
  };

  return (
    <div className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
      <h3 className="text-lg font-medium mb-4">Filters</h3>

      {/* Evidence Level Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
          <span>Evidence Level</span>
          <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
        </h4>
        <div className="space-y-2">
          {(['high', 'moderate', 'low'] as EvidenceLevel[]).map((level) => (
            <label key={level} className="flex items-center space-x-2 cursor-pointer">
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  filters.evidenceLevel.includes(level) 
                    ? 'bg-primary border-primary' 
                    : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
                }`}
                onClick={() => handleEvidenceLevelChange(level)}
              >
                {filters.evidenceLevel.includes(level) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} capitalize`}>{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recency Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
          <span>Recency</span>
          <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                filters.recency === 'recent' 
                  ? 'border-primary' 
                  : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
              }`}
              onClick={() => handleRecencyChange('recent')}
            >
              {filters.recency === 'recent' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Recent (Last 30 days)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                filters.recency === 'all' || filters.recency === null
                  ? 'border-primary' 
                  : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
              }`}
              onClick={() => handleRecencyChange(null)}
            >
              {(filters.recency === 'all' || filters.recency === null) && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>All Time</span>
          </label>
        </div>
      </div>

      {/* Reading Time Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
          <span>Reading Time</span>
          <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                filters.readingTime === 'short' 
                  ? 'border-primary' 
                  : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
              }`}
              onClick={() => handleReadingTimeChange('short')}
            >
              {filters.readingTime === 'short' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Under 10 minutes</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                filters.readingTime === 'medium' 
                  ? 'border-primary' 
                  : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
              }`}
              onClick={() => handleReadingTimeChange('medium')}
            >
              {filters.readingTime === 'medium' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>10-30 minutes</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                filters.readingTime === 'long' 
                  ? 'border-primary' 
                  : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
              }`}
              onClick={() => handleReadingTimeChange('long')}
            >
              {filters.readingTime === 'long' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Over 30 minutes</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                filters.readingTime === null 
                  ? 'border-primary' 
                  : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
              }`}
              onClick={() => handleReadingTimeChange(null)}
            >
              {filters.readingTime === null && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Any</span>
          </label>
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
          <span>Specialty</span>
          <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {specialties.map((specialty) => (
            <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  filters.specialty.includes(specialty) 
                    ? 'bg-primary border-primary' 
                    : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
                }`}
                onClick={() => handleSpecialtyChange(specialty)}
              >
                {filters.specialty.includes(specialty) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Source Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
          <span>Source</span>
          <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {sources.map((source) => (
            <label key={source} className="flex items-center space-x-2 cursor-pointer">
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  filters.source.includes(source) 
                    ? 'bg-primary border-primary' 
                    : theme === 'light' ? 'border-gray-400' : 'border-gray-500'
                }`}
                onClick={() => handleSourceChange(source)}
              >
                {filters.source.includes(source) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} truncate`}>{source}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={() => onFilterChange({
          evidenceLevel: [],
          recency: null,
          specialty: [],
          source: [],
          readingTime: null
        })}
        className={`w-full py-2 px-4 text-sm rounded-lg transition-colors ${
          theme === 'light'
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-[#1A2333] text-gray-300 hover:bg-[#252F41]'
        }`}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SearchFilters; 