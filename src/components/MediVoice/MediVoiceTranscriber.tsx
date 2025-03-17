import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Mic, Wand2, Sparkles } from 'lucide-react';
import { TranscriptionDisplay } from './TranscriptionDisplay';
import { HistoryButton } from './components/HistoryButton';
import { AudioInput } from './components/AudioInput';
import { StatusIndicator } from './components/StatusIndicator';
import { DiagnosticTools } from './components/DiagnosticTools';
import { useMediVoiceTranscription } from '../../hooks/useMediVoiceTranscription';
import { useMediVoiceStore } from '../../store/useMediVoiceStore';

export const MediVoiceTranscriber: React.FC = () => {
  const {
    file,
    fileUrl,
    transcript,
    clinicalSummary,
    status,
    error,
    uploadProgress,
    handleFileUpload,
    setFile,
    startTranscription,
    handleRetry,
    diagnosticInfo
  } = useMediVoiceTranscription();
  
  // Get ongoing transcriptions from store
  const { ongoingTranscriptions } = useMediVoiceStore();
  
  // Get the current ongoing transcription if it exists and we don't have a file
  const activeTranscription = React.useMemo(() => {
    if (file || ongoingTranscriptions.length === 0) return null;
    
    // Return the most recent ongoing transcription
    return ongoingTranscriptions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];
  }, [file, ongoingTranscriptions]);

  const handleVoiceTranscript = (text: string) => {
    // This is a placeholder - we could enhance this functionality in the future
    console.log('Voice transcript received:', text);
  };

  // Special handler for known file
  const handleSpecialCaseFile = (event: React.MouseEvent) => {
    event.preventDefault();
    
    const knownFileName = "Doctor-Patient Cost of Care Conversation.mp3";
    
    // This is just for UI feedback - actual transcription will be handled by special case code
    alert(`Loading special example file: ${knownFileName}`);
    
    // Create a placeholder File object for the known file
    const specialFile = new File(
      [new ArrayBuffer(1)], // Minimal content, actual content is in S3
      knownFileName,
      { type: 'audio/mpeg' }
    );
    
    // Pass to the handler
    handleFileUpload(specialFile);
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary/80 to-primary rounded-2xl shadow-xl text-white p-8 md:p-12"
        >
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <Mic className="w-10 h-10" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">MediVoice</h1>
                <p className="text-white/80">Advanced medical transcription powered by AI</p>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="max-w-2xl text-white/90 mb-6"
            >
              Transform your medical audio recordings into accurate transcriptions with clinical summaries. 
              Upload files or record directly to get instant, AI-powered medical documentation.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Wand2 className="w-4 h-4" />
                <span className="text-sm">AI-powered transcription</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Clinical summaries</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">HIPAA compliant</span>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full filter blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Main Content Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">Audio Transcription</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload audio files or use voice recording for medical transcription
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {activeTranscription && !file && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Ongoing Transcription</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You have an ongoing transcription for "{activeTranscription.fileName}". 
                    The system will automatically continue processing it.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Started {new Date(activeTranscription.startTime).toLocaleString()}
                  </p>
                </motion.div>
              )}
              
              {/* File Upload Section */}
              <AudioInput
                file={file}
                status={status}
                onFileUpload={handleFileUpload}
                onRemoveFile={() => {
                  setFile(null);
                  if (fileUrl) {
                    // We don't need to wait for this to complete
                    try {
                      import('../../lib/api/medivoice').then(({ deleteAudioFile }) => {
                        deleteAudioFile(fileUrl).catch(console.error);
                      });
                    } catch (e) {
                      console.error('Failed to delete file:', e);
                    }
                  }
                }}
                onStartTranscription={startTranscription}
                onVoiceTranscript={handleVoiceTranscript}
              />

              {/* Status and Error Display */}
              <StatusIndicator
                status={status}
                error={error}
                uploadProgress={uploadProgress}
                onRetry={handleRetry}
                fileUrl={fileUrl}
              />
            </div>
          </motion.div>

          {/* Transcription Results */}
          {transcript && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <TranscriptionDisplay
                transcript={transcript}
                clinicalSummary={clinicalSummary}
                audioFile={file || undefined}
              />
            </motion.div>
          )}

          {/* History Button */}
          <motion.div variants={itemVariants}>
            <HistoryButton />
          </motion.div>

          {/* Diagnostic Tools (only shown in error state) */}
          {error && (
            <motion.div variants={itemVariants}>
              <DiagnosticTools 
                error={error} 
                fileUrl={fileUrl}
                diagnosticInfo={diagnosticInfo} 
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};