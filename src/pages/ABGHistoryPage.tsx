import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import { useABGStore } from '../store/useABGStore';
import type { ABGResult } from '../store/useABGStore';

const ABGResultDisplay = ({ result }: { result: ABGResult }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        {/* Analysis Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add your analysis details here */}
        </div>
      </div>
      
      {/* Notes Section */}
      {result.notes && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Notes:</h3>
          <MarkdownRenderer 
            content={result.notes} 
            className="text-gray-600 dark:text-gray-300"
          />
        </div>
      )}
      
      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-2">
        {/* Add your action buttons here */}
      </div>
    </div>
  );
};

export default ABGResultDisplay; 