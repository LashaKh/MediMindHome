import React, { useState } from 'react';
import { SearchResult } from './types';
import { 
  X, 
  BookmarkPlus, 
  Share2, 
  FileText, 
  FileCheck,
  Newspaper,
  BarChart2,
  Download,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownContent } from '../markdown/MarkdownContent';

interface DetailPanelProps {
  result: SearchResult;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ result, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'abstract' | 'keypoints' | 'pico'>('abstract');

  // Function to get appropriate icon based on content type
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'paper':
        return <FileCheck className="w-5 h-5" />;
      case 'guideline':
        return <FileText className="w-5 h-5" />;
      case 'news':
        return <Newspaper className="w-5 h-5" />;
      case 'meta':
        return <BarChart2 className="w-5 h-5" />;
      case 'case':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Function to format citation
  const formatCitation = () => {
    const year = new Date(result.publicationDate).getFullYear();
    return `${result.authors.join(', ')}. (${year}). ${result.title}. ${result.source}.`;
  };

  // PICO Framework for clinical studies - this is a placeholder
  const picoFramework = {
    population: "Patients with specific condition described in the paper",
    intervention: "Intervention or exposure being studied",
    comparison: "Comparison or control group details",
    outcome: "Primary and secondary outcomes measured"
  };

  // Function to copy citation to clipboard
  const copyCitation = () => {
    navigator.clipboard.writeText(formatCitation())
      .then(() => {
        alert('Citation copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy citation: ', err);
      });
  };

  return (
    <div className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} h-full flex flex-col`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`mr-3 p-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#1A2333]'} rounded-lg`}>
            {getContentTypeIcon(result.contentType)}
          </div>
          <div>
            <h3 className="text-lg font-medium">{result.title}</h3>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{result.authors.join(', ')}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-1.5 ${theme === 'light' ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/10'} rounded-full`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        <button className={`p-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}>
          <BookmarkPlus className="w-5 h-5" />
        </button>
        <button className={`p-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}>
          <Share2 className="w-5 h-5" />
        </button>
        <button 
          onClick={copyCitation}
          className={`p-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}
        >
          <Copy className="w-5 h-5" />
        </button>
        <button className={`p-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}>
          <Download className="w-5 h-5" />
        </button>
        <a 
          href={result.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`p-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}
          onClick={(e) => {
            // Verify URL format before opening
            if (!result.url.startsWith('http')) {
              e.preventDefault();
              window.open(`https://${result.url}`, '_blank');
            }
          }}
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#121B29] border-white/10'} rounded-lg border mb-4`}>
        <div className={`flex ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-white/10'}`}>
          <button 
            className={`flex-1 py-2.5 text-sm font-medium text-center ${
              activeTab === 'abstract' 
                ? 'text-primary border-b-2 border-primary' 
                : theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('abstract')}
          >
            Abstract
          </button>
          <button 
            className={`flex-1 py-2.5 text-sm font-medium text-center ${
              activeTab === 'keypoints' 
                ? 'text-primary border-b-2 border-primary' 
                : theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('keypoints')}
          >
            Key Points
          </button>
          <button 
            className={`flex-1 py-2.5 text-sm font-medium text-center ${
              activeTab === 'pico' 
                ? 'text-primary border-b-2 border-primary' 
                : theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('pico')}
          >
            PICO
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === 'abstract' && (
            <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} leading-relaxed card-abstract`}>
              <MarkdownContent content={result.abstract} />
            </div>
          )}
          
          {activeTab === 'keypoints' && (
            <ul className="space-y-3">
              {result.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-5 h-5 flex items-center justify-center bg-primary/20 text-primary rounded-full mr-2 flex-shrink-0 text-xs">
                    {index + 1}
                  </span>
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <MarkdownContent content={point} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          
          {activeTab === 'pico' && (
            <div className="space-y-3">
              <div>
                <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>Population</h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{picoFramework.population}</p>
              </div>
              <div>
                <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>Intervention</h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{picoFramework.intervention}</p>
              </div>
              <div>
                <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>Comparison</h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{picoFramework.comparison}</p>
              </div>
              <div>
                <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>Outcome</h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{picoFramework.outcome}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#121B29] border-white/10'} rounded-lg border p-4 mb-4`}>
        <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>Citation</h4>
        <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>{formatCitation()}</p>
        <div className="flex space-x-2">
          <button 
            onClick={copyCitation}
            className={`py-1.5 px-3 text-xs ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg flex items-center`}
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy
          </button>
          <button className={`py-1.5 px-3 text-xs ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}>
            APA
          </button>
          <button className={`py-1.5 px-3 text-xs ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A2333] hover:bg-[#252F41] text-gray-300'} rounded-lg`}>
            MLA
          </button>
        </div>
      </div>

      <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#121B29] border-white/10'} rounded-lg border p-4`}>
        <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3`}>Metadata</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} block`}>Source</span>
            <span className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>{result.source}</span>
          </div>
          <div>
            <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} block`}>Published</span>
            <span className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>{new Date(result.publicationDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} block`}>Citations</span>
            <span className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>{result.citationCount}</span>
          </div>
          <div>
            <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} block`}>Reading Time</span>
            <span className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>{result.readingTimeMinutes} minutes</span>
          </div>
          {result.specialty.length > 0 && (
            <div className="col-span-2">
              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} block`}>Specialty</span>
              <span className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>
                {result.specialty.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPanel; 