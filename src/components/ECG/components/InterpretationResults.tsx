import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { ECGResultDisplay } from '../ECGResultDisplay';

interface InterpretationResultsProps {
  webhookResponse: string | null;
  isSendingActionPlan: boolean;
  onGetActionPlan: () => void;
}

export const InterpretationResults: React.FC<InterpretationResultsProps> = ({
  webhookResponse,
  isSendingActionPlan,
  onGetActionPlan
}) => {
  if (!webhookResponse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Interpretation Results
        </h2>
      </div>
      <div className="p-6">
        <ECGResultDisplay content={webhookResponse} />
        <div className="mt-6 flex justify-end">
          <button
            onClick={onGetActionPlan}
            disabled={isSendingActionPlan}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSendingActionPlan ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Getting Action Plan...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Get Action Plan & Recommendations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};