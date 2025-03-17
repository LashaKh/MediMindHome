import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, CheckCircle2, Upload, Wand2 } from 'lucide-react';
import { TranscriptionStatus } from '../../../hooks/useMediVoiceTranscription';

interface StatusIndicatorProps {
  status: TranscriptionStatus;
  error: string | null;
  uploadProgress: number;
  onRetry?: () => void;
  fileUrl?: string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  error,
  uploadProgress,
  onRetry,
  fileUrl
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {error ? (
        <motion.div
          key="error"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm"
        >
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 mt-1">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-300">Transcription Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
            
            {fileUrl && (
              <div className="mt-3 p-3 bg-red-50/80 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20 text-xs">
                <p className="font-medium mb-1 text-red-600/80 dark:text-red-400/80">File Reference:</p>
                <code className="block overflow-x-auto whitespace-nowrap text-red-600/70 dark:text-red-400/70">
                  {fileUrl}
                </code>
              </div>
            )}
          </div>
          
          {status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-red-900/40 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/60 transition-colors border border-red-200 dark:border-red-900/30 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}
        </motion.div>
      ) : status === 'uploading' ? (
        <motion.div
          key="uploading"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-5 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
              <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-700 dark:text-blue-300">Uploading Audio File</h3>
              <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                {uploadProgress < 100 
                  ? `Uploading... ${uploadProgress}% complete` 
                  : "Upload complete, preparing file..."}
              </p>
            </div>
          </div>
          
          <div className="relative w-full h-2 bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-500"
            />
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 mx-1 rounded-full bg-blue-400 dark:bg-blue-500"
              />
            ))}
          </div>
        </motion.div>
      ) : status === 'processing' ? (
        <motion.div
          key="processing"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-5 bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2">
                <Wand2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 rounded-full border-2 border-purple-300 dark:border-purple-500 border-dashed"
              />
            </div>
            <div>
              <h3 className="font-medium text-purple-700 dark:text-purple-300">AI Processing</h3>
              <p className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-0.5">
                Analyzing audio and generating transcription...
              </p>
            </div>
          </div>
          
          {/* Processing animation */}
          <div className="mt-4 flex justify-center">
            <div className="relative w-64 h-2 bg-purple-100 dark:bg-purple-900/40 rounded-full overflow-hidden">
              <motion.div 
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400"
              />
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-purple-500 dark:text-purple-400">
            <p>This may take a few minutes depending on the audio length</p>
          </div>
        </motion.div>
      ) : status === 'completed' ? (
        <motion.div
          key="completed"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-5 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-300">Transcription Complete</h3>
              <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-0.5">
                Your audio has been successfully transcribed
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}; 