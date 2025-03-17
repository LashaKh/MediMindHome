import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Upload, X, Loader2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import type { Patient } from '../../../types/patient';

interface DocumentationSectionProps {
  patient: Patient;
  onDocumentationChange: (images: Array<{ url: string; description: string; uploadedAt: Date }>) => void;
}

export const DocumentationSection: React.FC<DocumentationSectionProps> = ({ 
  patient, 
  onDocumentationChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState('');

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Current user:', user);
      console.log('Auth error:', error);
    };
    checkAuth();
  }, []);

  const images = patient.documentationImages?.images || [];
  const sortedImages = [...images].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 10 * 1024 * 1024; // 10MB

    try {
      setUploading(true);
      setUploadError(null);

      // Validate file type and size
      if (!file.type.match(/^image\/(jpeg|png|gif|webp|pdf)$/)) {
        throw new Error('Please upload a valid file (JPEG, PNG, GIF, WEBP, or PDF)');
      }

      if (file.size > maxSize) {
        throw new Error('File size should be less than 10MB');
      }

      // Check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check:', { user, error: authError });
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error: ' + authError.message);
      }
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Try to upload directly without checking bucket existence
      const fileName = `${patient.id}/${crypto.randomUUID()}-${file.name}`;
      console.log('Attempting to upload file:', fileName);
      
      let uploadData = null;
      const { data, error } = await supabase.storage
        .from('documentation-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error details:', {
          message: error.message,
          name: error.name
        });
        
        // If the error is about bucket not existing, try to create it
        if (error.message.includes('bucket not found')) {
          console.log('Attempting to create bucket...');
          const { error: createBucketError } = await supabase.storage.createBucket('documentation-images', {
            public: true
          });
          
          if (createBucketError) {
            console.error('Bucket creation error:', createBucketError);
            throw new Error('Failed to create storage bucket. Please contact support.');
          }
          
          // Retry upload after bucket creation
          const { data: retryData, error: retryError } = await supabase.storage
            .from('documentation-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (retryError) {
            throw retryError;
          }
          
          uploadData = retryData;
        } else {
          throw error;
        }
      } else {
        uploadData = data;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documentation-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      // Update local state
      const newImage = {
        url: publicUrl,
        description: newDescription || file.name,
        uploadedAt: new Date()
      };
      const newImages = [...images, newImage];

      // Update parent
      onDocumentationChange(newImages);
      setNewDescription('');

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
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
        .from('documentation-images')
        .remove([fileName]);

      if (error) throw error;

      // Update local state and parent
      const newImages = images.filter(img => img.url !== imageUrl);
      onDocumentationChange(newImages);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documentation Images</h3>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newDescription || ''}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Image description"
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
          {uploadError}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Uploading file...</span>
        </div>
      )}

      {sortedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedImages.map((image, index) => (
            <div 
              key={image.url}
              className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={image.url}
                  alt={image.description}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setSelectedImage(image.url);
                    setImageViewerOpen(true);
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedImage(image.url);
                      setImageViewerOpen(true);
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmImage(image.url)}
                    className="p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate">{image.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(image.uploadedAt, 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No documentation images uploaded yet
          </p>
        </div>
      )}

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
                alt="Documentation"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const currentIndex = images.findIndex(img => img.url === selectedImage);
                      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                      setSelectedImage(images[newIndex].url);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = images.findIndex(img => img.url === selectedImage);
                      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                      setSelectedImage(images[newIndex].url);
                    }}
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
                {images.findIndex(img => img.url === selectedImage) + 1} / {images.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <h3 className="text-lg font-semibold mb-4">Delete Documentation Image</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this documentation image? This action cannot be undone.
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
    </div>
  );
};