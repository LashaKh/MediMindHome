import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
  language?: string;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscript,
  onError,
  className = ''
}) => {
  const [isRecording, setIsRecording] = React.useState(false);

  const handleClick = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`p-3 rounded-full transition-colors ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-primary hover:bg-primary/90 text-white'
        } ${className}`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {isRecording && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex items-center gap-2 whitespace-nowrap">
          <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-sm text-gray-500">Recording...</span>
        </div>
      )}
    </div>
  );
};