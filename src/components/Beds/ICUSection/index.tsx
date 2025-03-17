import React from 'react';
import { ICUBedGrid } from './ICUBedGrid';
import { ICUStats } from './ICUStats';
import { MonitorIcon } from 'lucide-react';

export const ICUSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MonitorIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Cardiac ICU</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time bed monitoring and management
            </p>
          </div>
        </div>
      </div>
      
      <ICUStats />
      <ICUBedGrid />
    </div>
  );
};