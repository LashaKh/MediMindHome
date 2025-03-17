import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle, Edit, Save, Loader2, ClipboardCheck, Lock, Info } from 'lucide-react';
import { ABGResultDisplay } from '../ABGResultDisplay';

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
  const [isEditing, setIsEditing] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState(editedAnalysis || '');
  
  if (!analysis) return null;
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      onAnalysisChange(localAnalysis);
    } else {
      // Start editing
      setLocalAnalysis(editedAnalysis || '');
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mr-3 text-sm">2</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Analysis Results
            </h2>
          </div>
          
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Edits</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start gap-3 mb-4 text-sm text-blue-800 dark:text-blue-300">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p>You're editing the raw analysis text. These edits will be used for interpretation.</p>
            </div>
            
            <textarea
              value={localAnalysis}
              onChange={(e) => setLocalAnalysis(e.target.value)}
              className="w-full h-96 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Edit the analysis results here..."
            />
          </div>
        ) : (
          <div>
            <ABGResultDisplay content={editedAnalysis || ''} showExportOptions />
          </div>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Extracted and processed successfully</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              <span>Data secured and encrypted</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-2 text-gray-500" />
              {isEditing ? 
                "Make any necessary edits to the analysis before interpretation" : 
                "Analysis complete and ready for clinical interpretation"
              }
            </p>
          </div>
          
          {!isEditing && (
            <button
              onClick={onSendToWebhook}
              disabled={isSending}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Continue to Interpretation</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};