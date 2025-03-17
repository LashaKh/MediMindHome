import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ImageIcon, Camera, Image, FileImage, X } from 'lucide-react';

interface ImageUploadProps {
  isDragging: boolean;
  selectedImage: File | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onStartCamera: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  isDragging,
  selectedImage,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemoveImage,
  onStartCamera
}) => {
  // Get image preview URL if an image is selected
  const previewUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;
  
  // Cleanup preview URL on component unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  
  return (
    <motion.div
      className={`
        border-2 border-dashed rounded-xl p-6
        flex flex-col items-center justify-center
        transition-colors
        ${isDragging 
          ? 'border-primary bg-primary/5 dark:bg-primary/10' 
          : selectedImage 
            ? 'border-gray-300 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700' 
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
        }
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      animate={{ 
        scale: isDragging ? 1.02 : 1,
        borderColor: isDragging ? 'var(--color-primary)' : 'var(--color-border)' 
      }}
      transition={{ duration: 0.2 }}
    >
      {selectedImage ? (
        <div className="w-full text-center">
          <div className="relative max-w-sm mx-auto mb-4 group">
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
                <img 
                  src={previewUrl} 
                  alt="ABG result preview" 
                  className="max-h-64 max-w-full object-contain mx-auto"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/30 transition-colors duration-200"></div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
                <FileImage className="w-16 h-16 text-primary mx-auto" />
              </div>
            )}
            <button
              onClick={onRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900/80 rounded-full text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedImage.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(selectedImage.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Upload your ABG result
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
            Drag and drop your blood gas result image here, or use one of the options below to upload
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Camera button */}
            <button
              onClick={onStartCamera}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Camera className="w-5 h-5" />
              <span>Use Camera</span>
            </button>
            
            {/* Gallery upload button */}
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer shadow-sm">
              <Image className="w-5 h-5" />
              <span>Browse Files</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileSelect}
              />
            </label>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: JPG, PNG, HEIC • Max size: 10MB
          </p>
        </>
      )}
    </motion.div>
  );
};