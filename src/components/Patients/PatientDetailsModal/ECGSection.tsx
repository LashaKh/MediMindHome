import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { VoiceInput } from '../../Notes/VoiceInput';
import { Image, Upload, X, Loader2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import type { Patient } from '../../../types/patient';

interface ECGSectionProps {
  patient: Patient;
  onECGDataChange: (notes: string) => void;
  onECGImagesChange?: (images: string[]) => void;
}

export const ECGSection: React.FC<ECGSectionProps> = ({ 
  patient, 
  onECGDataChange,
  onECGImagesChange 
}) => {
  const [localNotes, setLocalNotes] = useState(patient.ecgData?.notes || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(patient.ecgData?.images || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<string | null>(null);

  // Get sorted images
  const sortedImages = [...images].sort((a, b) => b.localeCompare(a));

  // Sync with patient data when it changes
  useEffect(() => {
    setLocalNotes(patient.ecgData?.notes || '');
    setImages(patient.ecgData?.images || []);
  }, [patient.ecgData]);

  const handleVoiceTranscript = (text: string) => {
    const newNotes = localNotes 
      ? `${localNotes}\n${text}` 
      : text;
    
    setLocalNotes(newNotes);
    onECGDataChange(newNotes);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    onECGDataChange(newNotes);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB

    try {
      setUploading(true);
      setUploadError(null);

      // Validate file type and size
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
      }

      if (file.size > maxSize) {
        throw new Error('Image size should be less than 5MB');
      }

      // Upload to Supabase Storage
      const fileName = `${patient.id}/${crypto.randomUUID()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('ecg-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ecg-images')
        .getPublicUrl(fileName);

      // Update local state
      const newImages = [...images, publicUrl];
      setImages(newImages);

      // Update parent with both notes and images
      onECGDataChange(localNotes);
      onECGImagesChange?.(newImages);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    setDeleteConfirmImage(null);
    
    try {
      // Extract full path from URL
      const urlPath = new URL(imageUrl).pathname;
      const fileName = urlPath.split('/').slice(-2).join('/'); // Get "patientId/filename"
      if (!fileName) return;

      // Delete from storage
      const { error } = await supabase.storage
        .from('ecg-images')
        .remove([fileName]);

      if (error) throw error;

      // Update local state
      const newImages = images.filter(img => img !== imageUrl);
      setImages(newImages);

      // Update parent with both notes and images
      onECGDataChange(localNotes);
      onECGImagesChange?.(newImages);

      // Close image viewer if the deleted image was being viewed
      if (selectedImage === imageUrl) {
        setSelectedImage(null);
        setImageViewerOpen(false);
      }

    } catch (error) {
      console.error('Failed to remove image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to remove image');
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageViewerOpen(true);
  };

  const handleNavigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = images.indexOf(selectedImage);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    }

    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ECG Images</h3>
          <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
            {uploadError}
          </div>
        )}

        {uploading && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading image...</span>
          </div>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedImages.map((imageUrl, index) => {
              // Extract timestamp from URL or use current time as fallback
              const timestamp = new Date();
              return (
              <div 
                key={index}
                className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(imageUrl)}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={imageUrl}
                    alt={`ECG Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(imageUrl);
                      }}
                      className="p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmImage(imageUrl);
                      }}
                      className="p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    #{images.length - index}
                  </div>
                </div>
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                  {format(timestamp, 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <Image className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No ECG images uploaded yet
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmImage && (
          <div 
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50"
            onClick={() => setDeleteConfirmImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Delete ECG Image</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this ECG image? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmImage(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveImage(deleteConfirmImage)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ECG Notes</h3>
          <VoiceInput
            onTranscript={handleVoiceTranscript}
          />
        </div>
        <textarea
          value={localNotes}
          onChange={handleTextChange}
          className="w-full h-64 p-4 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter ECG notes..."
        />
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {imageViewerOpen && selectedImage && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90"
            onClick={() => setImageViewerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] mx-auto p-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="ECG"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => handleNavigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleNavigateImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Close button */}
              <button
                onClick={() => setImageViewerOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
                {images.indexOf(selectedImage) + 1} / {images.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};