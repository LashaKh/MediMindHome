import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useECGStore } from '../../../store/useECGStore';
import { ECGResultDisplay } from '../ECGResultDisplay';

export const HistoryButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const { results, loadResults, deleteResult } = useECGStore();

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      await deleteResult(id);
      if (selectedResult === id) {
        setSelectedResult(null);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        title="View History"
      >
        <History className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => {
                setIsOpen(false);
                setSelectedResult(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold">ECG Analysis History</h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedResult(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {results.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No analysis history yet</p>
                  </div>
                ) : (
                  results.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(result.created_at, 'PPpp')}
                          </p>
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">Raw Analysis:</p>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                              {result.raw_analysis}
                            </p>
                          </div>
                          {result.interpretation && (
                            <div className="mt-2 text-sm">
                              <p className="font-medium text-gray-900 dark:text-white">Interpretation:</p>
                              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                                {result.interpretation}
                              </p>
                            </div>
                          )}
                          <button
                            onClick={() => setSelectedResult(result.id)}
                            className="mt-2 text-sm text-primary hover:text-primary/90 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold">Analysis Details</h3>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {results.find(r => r.id === selectedResult) && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Raw Analysis</h4>
                      <ECGResultDisplay content={results.find(r => r.id === selectedResult)!.raw_analysis} />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Interpretation</h4>
                      <ECGResultDisplay content={results.find(r => r.id === selectedResult)!.interpretation} />
                    </div>
                    
                    {results.find(r => r.id === selectedResult)?.action_plan && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Action Plan & Recommendations</h4>
                        <ECGResultDisplay content={results.find(r => r.id === selectedResult)!.action_plan!} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};