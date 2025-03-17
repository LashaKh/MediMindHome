import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript
}) => {
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();
  
  // Track UI state separately from recording state
  const [uiState, setUiState] = useState<'idle' | 'recording'>('idle');

  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    isSupported 
  } = useSpeechRecognition({
    onTranscript,
    onError: setError,
    language: currentLanguage === 'ka' ? 'ka-GE' : 'en-US'
  });

  if (!isSupported) return null;

  const handleToggleRecording = async () => {
    try {
      if (uiState === 'recording') {
        // Update UI state immediately
        setUiState('idle');
        // Then stop recording
        await stopRecording();
      } else {
        // Update UI state immediately
        setUiState('recording');
        setError(null);
        // Then start recording
        await startRecording();
      }
    } catch (error) {
      // Revert UI state if there's an error
      setUiState('idle');
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-lg whitespace-nowrap"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggleRecording}
        className={`p-3 rounded-full transition-colors ${
          uiState === 'recording'
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-primary hover:bg-primary/90 text-white'
        }`}
        title={uiState === 'recording' ? 'Stop recording' : 'Start recording'}
      >
        {uiState === 'recording' ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {uiState === 'recording' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-500">Recording...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};