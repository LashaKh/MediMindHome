import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronDown, Printer, CheckCircle, Loader2, XCircle, BookmarkIcon, AlertCircle, FileCheck, ExternalLink } from 'lucide-react';
import { MarkdownContent } from '../../markdown/MarkdownContent';
import clsx from 'clsx';

interface ActionPlanResultsProps {
  actionPlan: string | null;
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  autoSaved?: boolean;
}

interface Section {
  title: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
}

const parseSections = (markdown: string): Section[] => {
  const sections: Section[] = [];
  let currentTitle = '';
  let currentContent: string[] = [];

  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('# ')) {
      // If we have a previous section, save it
      if (currentTitle) {
        // Determine priority based on content
        let priority: Section['priority'] = undefined;
        const contentStr = currentContent.join('\n').toLowerCase();
        if (contentStr.includes('urgent') || contentStr.includes('critical') || contentStr.includes('immediate')) {
          priority = 'high';
        } else if (contentStr.includes('recommended') || contentStr.includes('advised') || contentStr.includes('consider')) {
          priority = 'medium';
        } else if (contentStr.includes('optional') || contentStr.includes('may consider')) {
          priority = 'low';
        }
        
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim(),
          priority
        });
      }
      currentTitle = line.substring(2);
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Add the last section
  if (currentTitle) {
    // Determine priority based on content
    let priority: Section['priority'] = undefined;
    const contentStr = currentContent.join('\n').toLowerCase();
    if (contentStr.includes('urgent') || contentStr.includes('critical') || contentStr.includes('immediate')) {
      priority = 'high';
    } else if (contentStr.includes('recommended') || contentStr.includes('advised') || contentStr.includes('consider')) {
      priority = 'medium';
    } else if (contentStr.includes('optional') || contentStr.includes('may consider')) {
      priority = 'low';
    }
    
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim(),
      priority
    });
  }

  return sections;
};

export const ActionPlanResults: React.FC<ActionPlanResultsProps> = ({
  actionPlan,
  onSave,
  saveStatus,
  autoSaved = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState<boolean>(false);
  
  if (!actionPlan) return null;

  const sections = parseSections(actionPlan);
  
  // Auto expand high priority sections
  React.useEffect(() => {
    const highPrioritySections = sections
      .filter(section => section.priority === 'high')
      .map(section => section.title);
      
    if (highPrioritySections.length > 0) {
      setExpandedSections(new Set(highPrioritySections));
    } else if (sections.length > 0) {
      // If no high priority sections, expand the first one
      setExpandedSections(new Set([sections[0].title]));
    }
  }, [actionPlan]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(sections.map(s => s.title)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const handlePrint = () => {
    window.print();
  };

  const getPriorityBadge = (priority?: 'high' | 'medium' | 'low') => {
    if (!priority) return null;
    
    const config = {
      high: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: <AlertCircle className="w-3 h-3 mr-1" />
      },
      medium: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <AlertCircle className="w-3 h-3 mr-1" />
      },
      low: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: <BookmarkIcon className="w-3 h-3 mr-1" />
      }
    };
    
    const { color, icon } = config[priority];
    
    return (
      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {priority === 'high' ? 'Urgent' : priority === 'medium' ? 'Recommended' : 'Optional'}
      </span>
    );
  };

  const buttonConfig = {
    text: saveStatus === 'saving' ? 'Saving...' :
          saveStatus === 'success' ? 'Saved!' :
          saveStatus === 'error' ? 'Error - Try Again' :
          'Save Results',
    disabled: saveStatus === 'saving' || autoSaved,
    className: saveStatus === 'saving' ? 'bg-gray-400' :
               saveStatus === 'success' ? 'bg-green-500' :
               saveStatus === 'error' ? 'bg-red-500' :
               'bg-primary hover:bg-primary/90',
    icon: saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> :
          saveStatus === 'success' ? <CheckCircle className="w-5 h-5" /> :
          saveStatus === 'error' ? <XCircle className="w-5 h-5" /> :
          <Save className="w-5 h-5" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-green-50/50 via-transparent to-transparent dark:from-green-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mr-3 text-sm">4</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Clinical Recommendations
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            {autoSaved ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span>Auto-Saved</span>
              </div>
            ) : (
              <button
                onClick={onSave}
                disabled={buttonConfig.disabled}
                className={`flex items-center gap-2 px-4 py-2 ${buttonConfig.className} text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm`}
              >
                {buttonConfig.icon}
                <span>{buttonConfig.text}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Action Plan & Recommendations</h3>
          <div className="flex gap-2">
            <button 
              onClick={expandAll}
              className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Expand All
            </button>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <button 
              onClick={collapseAll}
              className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Collapse All
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={clsx(
                "border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm",
                section.priority === 'high' ? 'border-red-200 dark:border-red-700' : '',
                section.priority === 'medium' ? 'border-yellow-200 dark:border-yellow-700' : '',
                section.priority === 'low' ? 'border-blue-200 dark:border-blue-700' : ''
              )}
            >
              <button
                onClick={() => toggleSection(section.title)}
                className={clsx(
                  "w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                  section.priority === 'high' ? 'bg-red-50/50 dark:bg-red-900/10' : '',
                  section.priority === 'medium' ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : '',
                  section.priority === 'low' ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-gray-50 dark:bg-gray-700/50'
                )}
              >
                <div className="flex items-center">
                  <h3 className="text-base font-medium text-left">{section.title}</h3>
                  {getPriorityBadge(section.priority)}
                </div>
                <ChevronDown 
                  className={clsx(
                    "w-5 h-5 transition-transform duration-200",
                    expandedSections.has(section.title) ? "rotate-180" : ""
                  )}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has(section.title) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-t dark:border-gray-700">
                      <MarkdownContent content={section.content} />
                      
                      {/* External resources link for relevant sections */}
                      {(section.title.includes('Medication') || section.title.includes('Treatment')) && (
                        <div className="mt-4 pt-4 border-t dark:border-gray-700">
                          <a
                            href="#"
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium"
                            onClick={(e) => e.preventDefault()}
                          >
                            View relevant clinical guidelines <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <FileCheck className="w-4 h-4 mr-2 text-gray-500" />
            <span>All recommendations are based on clinical guidelines and expert consensus.</span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last generated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};