import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string | null;
  onClear: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onClear }) => {
  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-32 h-32"
      >
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={onClear}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};