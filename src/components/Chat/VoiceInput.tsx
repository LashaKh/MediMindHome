import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import clsx from 'clsx';

interface VoiceInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onSend, disabled }) => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { isRecording, startRecording, stopRecording, isSupported: isRecordingSupported } = 
    useSpeechRecognition({
      onTranscript: setTranscript,
      onError: setError
    });

  const { speak, stop, isSpeaking, isSupported: isSpeakingSupported } = useSpeechSynthesis();

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setError(null);
      startRecording();
    }
  };

  const handleSend = () => {
    if (transcript.trim()) {
      onSend(transcript.trim());
      setTranscript('');
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleToggleRecording}
          disabled={!isRecordingSupported || disabled}
          className={clsx(
            'p-3 rounded-full transition-colors',
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-primary hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isRecording ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        {isSpeakingSupported && (
          <button
            onClick={() => isSpeaking ? stop() : speak(transcript)}
            disabled={!transcript || disabled}
            className="p-3 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpeaking ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        )}
      </div>

      {transcript && (
        <div className="space-y-2">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={!transcript.trim() || disabled}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Recording...</span>
        </div>
      )}
    </div>
  );
};