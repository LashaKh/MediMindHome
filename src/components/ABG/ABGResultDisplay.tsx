import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, ChevronDown, Copy, Check, ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface ABGResultDisplayProps {
  content: string;
  showExportOptions?: boolean;
}

type DetailSeverity = 'normal' | 'warning' | 'critical' | 'info';

interface DetailItem {
  title: string;
  points: string[];
  severity: DetailSeverity;
}

export const ABGResultDisplay: React.FC<ABGResultDisplayProps> = ({ 
  content,
  showExportOptions = false
}) => {
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Extract sections from the markdown content
  const allSections = content
    .split(/(?=###\s|##\s)/)
    .filter(Boolean)
    .map(section => section.trim());
  
  // Extract most important details
  const importantDetailsSection = allSections.find(section => 
    section.startsWith('### **Most Important Details**') || 
    section.startsWith('## **Most Important Details**')
  );
  
  const importantDetails: DetailItem[] = importantDetailsSection
    ?.split('\n')
    .filter(line => line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.'))
    .map(detail => {
      // Extract the title and points while preserving the original formatting
      const lines = detail.split('\n');
      const title = lines[0].replace(/^\d+\.\s+/, '');
      const points = lines.slice(1).filter(line => line.trim().startsWith('-'));

      // Determine severity from color spans
      let severity: DetailSeverity = 'info';
      if (title.includes('color:green')) severity = 'normal';
      else if (title.includes('color:yellow')) severity = 'warning';
      else if (title.includes('color:red')) severity = 'critical';

      return {
        title,
        points: points.map(p => p.trim().replace(/^-\s+/, '')),
        severity
      };
    }) || [];

  const formatContent = (text: string) => {
    return text
      .replace(/^#\s*$/gm, '')  // Remove standalone # characters
      .replace(/\n#+\s*$/gm, '') // Remove # at the end of sections
      .replace(
        /<span style="color:(green|yellow|red)">(.*?)<\/span>/g, 
        (_, color, content) => `<span class="text-${color}-500">${content}</span>`
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

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

  const getSeverityIcon = (severity: DetailSeverity): typeof AlertCircle => {
    switch (severity) {
      case 'normal': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getSeverityColors = (severity: DetailSeverity) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'critical':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getSeverityTextColors = (severity: DetailSeverity) => {
    switch (severity) {
      case 'normal': return 'text-green-700 dark:text-green-400';
      case 'warning': return 'text-yellow-700 dark:text-yellow-400';
      case 'critical': return 'text-red-700 dark:text-red-400';
      default: return 'text-blue-700 dark:text-blue-400';
    }
  };

  const getSeverityIconColors = (severity: DetailSeverity) => {
    switch (severity) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showExportOptions && (
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handleCopyContent}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copied!' : 'Copy'}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <ArrowDownToLine className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      )}

      {/* Most Important Details */}
      {importantDetails.length > 0 && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Most Important Details
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {importantDetails.map((detail, index) => {
              const IconComponent = getSeverityIcon(detail.severity);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`rounded-xl p-5 shadow-sm border ${getSeverityColors(detail.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <IconComponent className={`w-5 h-5 ${getSeverityIconColors(detail.severity)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-semibold ${getSeverityTextColors(detail.severity)}`}
                        dangerouslySetInnerHTML={{ 
                          __html: formatContent(detail.title)
                            .replace(/<span class="text-(green|yellow|red)-500">(.*?)<\/span>/g, '$2')
                        }}
                      />
                      {detail.points.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {detail.points.map((point, i) => (
                            <li key={i} className={`text-sm pl-4 relative ${getSeverityTextColors(detail.severity)}`}>
                              <span className={`absolute left-0 top-2 w-1.5 h-1.5 rounded-full ${getSeverityIconColors(detail.severity)}`}></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* Detailed Analysis Sections */}
      <div className="mt-8 space-y-4">
        {allSections.map((section, index) => {
          if (!section.trim() || section.startsWith('### **Most Important Details**') || section.startsWith('## **Most Important Details**')) return null;
          
          const [title, ...contentLines] = section
            .replace(/^#+\s*/, '')  // Remove leading #
            .trim()
            .split('\n');
          const sectionContent = contentLines.join('\n').trim();
          
          if (!title || !sectionContent) return null;
          
          const cleanTitle = title.replace(/\*\*/g, '');
          const isExpanded = expandedSections.has(cleanTitle);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(cleanTitle)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {cleanTitle}
                </h3>
                <ChevronDown className={clsx(
                  "w-5 h-5 text-gray-500 transition-transform duration-200",
                  isExpanded ? "rotate-180" : ""
                )} />
              </button>
              
              {isExpanded && (
                <div className="p-5 border-t dark:border-gray-700">
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatContent(sectionContent)
                    }}
                  />
                  
                  {/* External resources link for specific sections */}
                  {(cleanTitle.includes('Interpretation') || cleanTitle.includes('Reference')) && (
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <a
                        href="#"
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium"
                        onClick={(e) => e.preventDefault()}
                      >
                        View clinical guidelines <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};