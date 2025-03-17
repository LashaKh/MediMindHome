import React from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { useMessageInput } from './useMessageInput';
import { useTranslation } from '../../../hooks/useTranslation';
import { MessageInputProps } from './types';
import { motion, AnimatePresence } from 'framer-motion';

export const InputArea: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const { 
    message, 
    setMessage, 
    handleSubmit,
    selectedImage,
    imagePreviewUrl,
    handleImageSelect,
    clearImage,
    fileInputRef 
  } = useMessageInput(onSend);
  const { t } = useTranslation();

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence>
            {imagePreviewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative w-32 h-32"
              >
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t('chat.typeMessage')}
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white disabled:opacity-50"
          />

          <div className="flex-shrink-0 flex items-center gap-2">
            <label className="p-2 sm:px-4 sm:py-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-blue-300 dark:hover:bg-primary/30 rounded-lg transition-colors flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                className="hidden"
              />
              <ImageIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Image</span>
            </label>

            <VoiceInput
              onTranscript={(text) => setMessage(prev => prev + text)}
              disabled={disabled}
            />

            <button
              type="submit"
              disabled={(!message.trim() && !selectedImage) || disabled}
              className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};