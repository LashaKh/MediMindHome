import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { ECGResultDisplay } from '../ECGResultDisplay';

interface ActionPlanResultsProps {
  actionPlan: string;
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
}

export const ActionPlanResults: React.FC<ActionPlanResultsProps> = ({
  actionPlan,
  onSave,
  saveStatus
}) => {
  const buttonConfig = {
    text: saveStatus === 'saving' ? 'Saving...' :
          saveStatus === 'success' ? 'Saved!' :
          saveStatus === 'error' ? 'Error - Try Again' :
          'Save Results',
    disabled: saveStatus === 'saving' || saveStatus === 'success',
    className: saveStatus === 'saving' ? 'bg-gray-400' :
               saveStatus === 'success' ? 'bg-green-500' :
               saveStatus === 'error' ? 'bg-red-500' :
               'bg-primary hover:bg-primary/90'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Action Plan & Recommendations
          </h2>
          <button
            onClick={onSave}
            disabled={buttonConfig.disabled}
            className={`flex items-center gap-2 px-4 py-2 ${buttonConfig.className} text-white rounded-lg transition-colors disabled:opacity-50`}
          >
            <Save className="w-5 h-5" />
            <span>{buttonConfig.text}</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <ECGResultDisplay content={actionPlan} />
      </div>
    </motion.div>
  );
};