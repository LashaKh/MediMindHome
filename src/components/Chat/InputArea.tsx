import React, { useState } from 'react';
import { useMessageInput } from './InputArea/useMessageInput';
import { useTranslation } from '../../hooks/useTranslation';
import { MessageInputProps } from './InputArea/types';
import { VoiceInput } from './InputArea/VoiceInput';
import { TextArea } from './InputArea/TextArea';
import { SendButton } from './InputArea/SendButton';
import { ImageUploadButton } from './InputArea/ImageUploadButton';
import { ImagePreview } from './InputArea/ImagePreview';

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
          <ImagePreview 
            imageUrl={imagePreviewUrl} 
            onClear={clearImage} 
          />
          
          <div className="flex gap-2">
            <TextArea
              value={message}
              onChange={setMessage}
              onSubmit={handleSubmit}
              placeholder={t('chat.typeMessage')}
              disabled={disabled}
            />

            <div className="flex-shrink-0 flex items-center gap-2">
              <ImageUploadButton
                onSelect={handleImageSelect}
                fileInputRef={fileInputRef}
              />

              <VoiceInput
                onTranscript={(text) => setMessage(prev => prev + ' ' + text)}
                disabled={disabled}
              />

              <SendButton
                disabled={(!message.trim() && !selectedImage) || disabled}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};