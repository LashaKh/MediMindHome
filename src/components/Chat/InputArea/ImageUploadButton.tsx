import React from 'react';
import { ImagePlus } from 'lucide-react';

interface ImageUploadButtonProps {
  onSelect: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onSelect,
  fileInputRef
}) => {
  return (
    <label className="p-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-blue-300 dark:hover:bg-primary/30 rounded-lg transition-colors flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
        className="hidden"
      />
      <ImagePlus className="w-5 h-5" />
      <span className="hidden sm:inline">Image</span>
    </label>
  );
};