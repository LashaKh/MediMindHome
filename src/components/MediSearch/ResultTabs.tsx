import React from 'react';
import { ContentType, TabCounts } from './types';
import { File, FileCheck, Newspaper, BarChart2, FileText } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ResultTabsProps {
  activeTab: ContentType | 'all';
  onTabChange: (tab: ContentType | 'all') => void;
  resultCounts: Partial<TabCounts>;
}

const ResultTabs: React.FC<ResultTabsProps> = ({ 
  activeTab, 
  onTabChange,
  resultCounts
}) => {
  const { theme } = useTheme();
  
  const tabs = [
    { 
      id: 'all', 
      label: 'All', 
      icon: File,
      count: resultCounts.all || 0
    },
    { 
      id: 'paper', 
      label: 'Papers', 
      icon: FileCheck,
      count: resultCounts.paper || 0
    },
    { 
      id: 'guideline', 
      label: 'Guidelines', 
      icon: FileText,
      count: resultCounts.guideline || 0
    },
    { 
      id: 'news', 
      label: 'News', 
      icon: Newspaper,
      count: resultCounts.news || 0
    },
    { 
      id: 'meta', 
      label: 'Meta-Analyses', 
      icon: BarChart2,
      count: resultCounts.meta || 0
    },
    { 
      id: 'case', 
      label: 'Case Studies', 
      icon: FileText,
      count: resultCounts.case || 0
    }
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-hide py-2 px-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const TabIcon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as ContentType | 'all')}
            className={`
              flex items-center whitespace-nowrap px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-primary text-white' 
                : theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#1A2333] text-gray-300 hover:bg-[#252F41]'
              }
            `}
          >
            <TabIcon className="w-4 h-4 mr-2" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : theme === 'light'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gray-700 text-gray-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ResultTabs; 