import { useState, useCallback, FormEvent, useRef } from 'react';

export const useMessageInput = (onSend: (message: string | { text: string; imageUrl?: string }) => void) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedImage) {
      if (selectedImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onSend({
            text: message.trim(),
            imageUrl: reader.result as string
          });
        };
        reader.readAsDataURL(selectedImage);
      } else {
      onSend(message.trim());
      }
      setMessage('');
      setSelectedImage(null);
      setImagePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [message, onSend]);

  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }, []);

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    message,
    setMessage,
    handleSubmit,
    selectedImage,
    imagePreviewUrl,
    handleImageSelect,
    clearImage,
    fileInputRef
  };
};