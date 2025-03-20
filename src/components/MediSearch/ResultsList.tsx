import React from 'react';
import { SearchResult } from './types';
import { 
  Calendar, 
  Clock, 
  FileCheck, 
  FileText, 
  Newspaper, 
  BarChart2, 
  BookmarkPlus, 
  Share2, 
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownContent } from '../markdown/MarkdownContent';

interface ResultsListProps {
  results: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
  selectedResultId?: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ 
  results, 
  onResultSelect,
  selectedResultId
}) => {
  const { theme } = useTheme();

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
        <FileText className={`w-16 h-16 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} mb-4`} />
        <h3 className={`text-xl font-medium ${theme === 'light' ? 'text-black' : 'text-white'} mb-2`}>No results found</h3>
        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} max-w-md`}>
          Try adjusting your search query or filters to find more relevant medical literature.
        </p>
      </div>
    );
  }

  // Function to get appropriate icon based on content type
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'paper':
        return <FileCheck className="w-4 h-4" />;
      case 'guideline':
        return <FileText className="w-4 h-4" />;
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      case 'meta':
        return <BarChart2 className="w-4 h-4" />;
      case 'case':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Function to get appropriate color based on evidence level
  const getEvidenceLevelColor = (level: string) => {
    if (theme === 'light') {
      switch (level) {
        case 'high':
          return 'bg-green-100 text-green-700 border-green-300';
        case 'moderate':
          return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'low':
          return 'bg-red-100 text-red-700 border-red-300';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-300';
      }
    } else {
      switch (level) {
        case 'high':
          return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'moderate':
          return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'low':
          return 'bg-red-500/20 text-red-400 border-red-500/30';
        default:
          return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
        Found {results.length} results
      </div>
      
      {results.map((result) => (
        <div 
          key={result.id}
          onClick={() => onResultSelect(result)}
          className={`
            p-4 rounded-lg border cursor-pointer transition-all
            ${selectedResultId === result.id 
              ? theme === 'light'
                ? 'bg-blue-50 border-primary shadow-md' 
                : 'bg-[#1A2333] border-primary shadow-md'
              : theme === 'light'
                ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                : 'bg-[#121B29] border-white/10 hover:border-white/30'
            }
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <span className={`
                flex items-center space-x-1 px-2 py-0.5 text-xs rounded-full border
                ${getEvidenceLevelColor(result.evidenceLevel)}
              `}>
                {getContentTypeIcon(result.contentType)}
                <span className="capitalize">{result.contentType}</span>
              </span>
              
              <span className={`mx-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
              
              <span className={`flex items-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {formatDate(result.publicationDate)}
              </span>
              
              <span className={`mx-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
              
              <span className={`flex items-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                <Clock className="w-3.5 h-3.5 mr-1" />
                {result.readingTimeMinutes} min read
              </span>
            </div>
            
            <div className="flex space-x-1">
              <button className={`p-1.5 ${theme === 'light' ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/10'} rounded-full`}>
                <BookmarkPlus className="w-4 h-4" />
              </button>
              <button className={`p-1.5 ${theme === 'light' ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/10'} rounded-full`}>
                <Share2 className="w-4 h-4" />
              </button>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-1.5 ${theme === 'light' ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/10'} rounded-full`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Verify URL format before opening
                  if (!result.url.startsWith('http')) {
                    e.preventDefault();
                    window.open(`https://${result.url}`, '_blank');
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>{result.title}</h3>
          
          <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
            {result.authors.join(', ')} • {result.source}
          </div>
          
          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} line-clamp-2 mb-3 card-abstract`}>
            <MarkdownContent content={result.abstract} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {result.keyPoints.slice(0, 3).map((point, index) => (
              <span 
                key={index}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                  theme === 'light' 
                    ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                    : 'bg-[#1E293B] text-gray-300 border border-white/10'
                }`}
              >
                <MarkdownContent content={point} className="inline" />
              </span>
            ))}
            {result.keyPoints.length > 3 && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-transparent ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                +{result.keyPoints.length - 3} more
              </span>
            )}
          </div>
          
          <div className={`flex justify-between items-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-2`}>
            <div className="flex items-center">
              <span className="mr-4 flex items-center">
                <Citation className="w-3.5 h-3.5 mr-1" />
                {result.citationCount} citations
              </span>
              
              {result.specialty.length > 0 && (
                <span>
                  Specialty: {result.specialty.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                </span>
              )}
            </div>
            
            {selectedResultId === result.id && (
              <span className="text-primary">Selected</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Custom Citation icon since it's not in lucide-react
const Citation = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 3v7a6 6 0 006 6 6 6 0 01-3-5.2V3M18 3v7a6 6 0 01-6 6 6 6 0 006-5.2V3" />
  </svg>
);

export default ResultsList; 