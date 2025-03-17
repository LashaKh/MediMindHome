import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ECGResultDisplayProps {
  content: string;
}

export const ECGResultDisplay: React.FC<ECGResultDisplayProps> = ({ content }) => {
  // Extract sections from the markdown content
  const allSections = content
    .split(/(?=###\s|##\s)/)
    .filter(section => section.trim())
    .map(section => section.trim());
  
  // Extract most important details
  const importantDetailsSection = allSections.find(section => 
    section.toLowerCase().includes('most important') ||
    section.toLowerCase().includes('key findings')
  );
  
  const importantDetails = importantDetailsSection
    ?.split('\n')
    .filter(line => /^\d+\./.test(line.trim()))
    .map(detail => {
      // Extract the title and points while preserving the original formatting
      const lines = detail.split('\n');
      const title = lines[0].replace(/^\d+\.\s+/, '');
      const points = lines.slice(1).filter(line => /^[-•*]\s/.test(line.trim()));

      return {
        title,
        points: points.map(p => p.trim().replace(/^[-•*]\s+/, ''))
      };
    }) || [];

  const formatContent = (text: string) => {
    return text
      .replace(/^#+\s*$/gm, '')  // Remove standalone # characters
      .replace(/\n#+\s*$/gm, '') // Remove # at the end of sections
      .replace(/^Image Quality:.*$/gm, (match) => {
        const quality = match.toLowerCase().includes('good') ? 'green' :
                       match.toLowerCase().includes('poor') ? 'red' : 'yellow';
        return `<div class="mb-4 p-3 bg-${quality}-50 dark:bg-${quality}-900/20 text-${quality}-600 dark:text-${quality}-400 rounded-lg text-sm">${match}</div>`;
      })
      .replace(
        /\*\*(Critical|Warning|Normal):\*\*\s*(.*?)(?=\*\*|$)/g,
        (_, severity, content) => {
          const color = severity === 'Critical' ? 'red' : 
                       severity === 'Warning' ? 'yellow' : 'green';
          return `<span class="text-${color}-500">${content.trim()}</span>`;
        }
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />')
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 prose prose-lg dark:prose-invert max-w-none"
    >
      {/* Most Important Details */}
      {importantDetails.length > 0 && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4"
          >
            Most Important Details
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {importantDetails.map((detail, index) => {
              // Extract color from span tag if present
              const colorMatch = detail.title.match(/<span style="color:(yellow|red|green)">/);
              const color = colorMatch ? colorMatch[1] : 'gray';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {color === 'yellow' && (
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      )}
                      {color === 'green' && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {color === 'red' && (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      {color === 'gray' && (
                        <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold"
                        dangerouslySetInnerHTML={{ __html: formatContent(detail.title) }}
                      />
                      <ul className="mt-2 space-y-1.5 list-none">
                        {detail.points.map((point, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative">
                            <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* Detailed Analysis Sections */}
      {allSections.map((section, index) => {
        if (!section.trim() || section.startsWith('### **Most Important Details**') || section.startsWith('## **Most Important Details**')) return null;
        
        const [title, ...contentLines] = section
          .replace(/^#+\s*/, '')  // Remove leading #
          .trim()
          .split('\n');
        const sectionContent = contentLines.join('\n').trim();

        if (!title || !sectionContent) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700 prose-headings:mt-0"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {title.replace(/\*\*/g, '')}
            </h3>
            <div 
              className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatContent(sectionContent)
              }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};