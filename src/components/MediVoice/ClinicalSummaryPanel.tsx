import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, AlertCircle, X, Search, ChevronDown, ChevronUp, Copy, CheckCircle, FileText, Link2, ArrowRight } from 'lucide-react';
import { SectionIcon } from './SectionIcon';
import { formatSectionName } from './transcriptionUtils';

interface ClinicalSummaryPanelProps {
  clinicalSummary: any;
  selectedSummaryText: string | null;
  matchedTranscriptIndices: number[];
  onSummaryItemClick: (text: string) => void;
  onClearSelection: () => void;
}

export const ClinicalSummaryPanel: React.FC<ClinicalSummaryPanelProps> = ({
  clinicalSummary,
  selectedSummaryText,
  matchedTranscriptIndices,
  onSummaryItemClick,
  onClearSelection
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Detect the format of the clinical summary
  const summaryFormat = React.useMemo(() => {
    if (clinicalSummary?.ClinicalDocumentation?.Sections) {
      return 'aws-medical-scribe';
    }
    if (clinicalSummary?.summary) {
      return 'simple';
    }
    return 'unknown';
  }, [clinicalSummary]);

  // Extract sections from clinical summary based on detected format
  const sections = React.useMemo(() => {
    if (summaryFormat === 'aws-medical-scribe') {
      return clinicalSummary?.ClinicalDocumentation?.Sections || [];
    }
    
    // For simple format, create a synthetic section
    if (summaryFormat === 'simple') {
      return [{
        SectionName: 'SUMMARY',
        Summary: [{
          SummarizedSegment: clinicalSummary.summary || 'No summary available'
        }]
      }];
    }
    
    return [];
  }, [clinicalSummary, summaryFormat]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };
  
  const handleCopySection = (sectionName: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };
  
  const getSectionContent = (section: any) => {
    if (!section.Summary || section.Summary.length === 0) return '';
    
    return section.Summary.map((item: any) => 
      item.SummarizedSegment || item
    ).join('\n\n');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-full border border-gray-100 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Clinical Summary</h2>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              AI Generated
            </span>
          </div>
          {selectedSummaryText && (
            <button 
              onClick={onClearSelection}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {sections.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No clinical summary available</p>
            <p className="text-sm mt-1">{clinicalSummary?.error || "The AI couldn't generate a summary for this audio."}</p>
          </div>
        ) : (
          <>
            {selectedSummaryText && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 mt-0.5">
                    <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Linking summary to transcript</p>
                    <p className="mt-1 text-blue-700/80 dark:text-blue-300/80">
                      {matchedTranscriptIndices.length > 0 
                        ? `Found ${matchedTranscriptIndices.length} potential match${matchedTranscriptIndices.length !== 1 ? 'es' : ''} in the transcript.`
                        : 'Click on any text in the summary to find matching content in the transcript.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence>
              {sections.map((section: any, index: number) => {
                if (!section.Summary || section.Summary.length === 0) return null;
                
                const sectionName = section.SectionName || 'Summary';
                const formattedName = formatSectionName(sectionName);
                const isExpanded = expandedSections[sectionName] !== false; // Default to expanded
                const sectionContent = getSectionContent(section);

                return (
                  <motion.div
                    key={sectionName || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => toggleSection(sectionName)}
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon name={sectionName} />
                        <h3 className="font-medium">
                          {formattedName}
                        </h3>
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                          {section.Summary.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopySection(sectionName, sectionContent);
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Copy section"
                        >
                          {copiedSection === sectionName ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 space-y-2 bg-white dark:bg-gray-800">
                            {section.Summary.map((item: any, i: number) => {
                              const summaryText = item.SummarizedSegment || item;
                              const isSelected = selectedSummaryText === summaryText;
                              
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.03 }}
                                  onClick={() => onSummaryItemClick(summaryText)}
                                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-300 dark:ring-blue-700' 
                                      : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                  }`}
                                >
                                  <p className="text-gray-700 dark:text-gray-300 pr-6">
                                    {summaryText}
                                  </p>
                                  <div className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                  }`}>
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {selectedSummaryText && matchedTranscriptIndices.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4 text-sm text-yellow-800 dark:text-yellow-200 border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-3"
              >
                <Search className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">No exact matches found</p>
                  <p className="mt-0.5 text-yellow-700/80 dark:text-yellow-300/80">
                    Try selecting a different part of the summary or check the transcript manually.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 