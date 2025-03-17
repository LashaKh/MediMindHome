import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: string | null;
  editedAnalysis: string | null;
  isSending: boolean;
  onAnalysisChange: (value: string) => void;
  onSendToWebhook: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  editedAnalysis,
  isSending,
  onAnalysisChange,
  onSendToWebhook
}) => {
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Analysis Results
        </h2>
      </div>
      <div className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          <textarea
            value={editedAnalysis || ''}
            onChange={(e) => onAnalysisChange(e.target.value)}
            className="w-full h-64 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSendToWebhook}
            disabled={isSending || !editedAnalysis}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send to System</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};