import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { useLanguage } from '../../../contexts/LanguageContext';
import clsx from 'clsx';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();
  
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

  if (!isSupported || disabled) return null;

  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-full mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}

      <button
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            setError(null);
            startRecording();
          }
        }}
        className={clsx(
          'p-2 rounded-lg transition-colors',
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-primary hover:bg-primary/90 text-white'
        )}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {isRecording && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-sm text-gray-500">Recording...</span>
        </div>
      )}
    </div>
  );
};