import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Mic, Music, ArrowRight } from 'lucide-react';
import { VoiceInput } from '../../Notes/VoiceInput';
import { TranscriptionStatus } from '../../../hooks/useMediVoiceTranscription';

interface AudioInputProps {
  file: File | null;
  status: TranscriptionStatus;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
  onStartTranscription: () => void;
  onVoiceTranscript?: (text: string) => void;
}

export const AudioInput: React.FC<AudioInputProps> = ({
  file,
  status,
  onFileUpload,
  onRemoveFile,
  onStartTranscription,
  onVoiceTranscript
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      onFileUpload(droppedFile);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <span>Audio Input</span>
        </h2>
        {onVoiceTranscript && (
          <div className="flex items-center">
            <VoiceInput onTranscript={onVoiceTranscript} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-200 ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {isDragging ? 'Drop your audio file here' : 'Drag & drop your audio file here'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports MP3, WAV, OGG, and WebM formats
                </p>
              </div>
              
              <button
                onClick={handleBrowseClick}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                Browse Files
              </button>
            </div>
            
            {/* Animated border effect when dragging */}
            {isDragging && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                style={{ zIndex: 10 }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={onRemoveFile}
                className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {status === 'idle' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-end">
                  <button
                    onClick={onStartTranscription}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <span>Start Transcription</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Audio format information */}
      {!file && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span>Maximum file size: 100MB</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>Optimal quality: 16-bit, 44.1kHz</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
            <span>Clear audio for best results</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 