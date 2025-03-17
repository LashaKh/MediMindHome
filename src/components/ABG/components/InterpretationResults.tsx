import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, FileText, AlertCircle, Share2, BookOpen } from 'lucide-react';
import { ABGResultDisplay } from '../ABGResultDisplay';

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

  // Detect if there are any critical values in the interpretation
  const hasCriticalValues = webhookResponse.toLowerCase().includes('critical') || 
                           webhookResponse.includes('color:red') ||
                           webhookResponse.includes('severe');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-purple-50/50 via-transparent to-transparent dark:from-purple-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 mr-3 text-sm">3</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              Clinical Interpretation
              {hasCriticalValues && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Critical Values
                </span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Reference</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <ABGResultDisplay content={webhookResponse} showExportOptions />
        
        {hasCriticalValues && (
          <div className="mt-6 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-400">Critical Values Detected</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                This blood gas result contains critical values that may require immediate clinical attention.
                Consider urgent clinical review and appropriate intervention.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-500" />
            <span>Interpretation complete. Ready for clinical recommendations.</span>
          </div>
          
          <button
            onClick={onGetActionPlan}
            disabled={isSendingActionPlan}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 shadow-sm flex items-center gap-2"
          >
            {isSendingActionPlan ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Action Plan...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Generate Clinical Recommendations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};