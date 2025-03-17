import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInput } from '../../Notes/VoiceInput';
import { supabase } from '../../../lib/supabase';
import { Upload, Video, X, Loader2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Patient } from '../../../types/patient';
import { format } from 'date-fns';

interface EchoSectionProps {
  patient: Patient;
  onEchoDataChange: (field: keyof Patient['echoData'], value: string) => void;
}

interface EchoVideo {
  url: string;
  timestamp: Date;
}

export const EchoSection: React.FC<EchoSectionProps> = ({ patient, onEchoDataChange }) => {
  const [localNotes, setLocalNotes] = useState(patient.echoData?.notes || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videos, setVideos] = useState<EchoVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoViewerOpen, setVideoViewerOpen] = useState(false);
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<string | null>(null);

  useEffect(() => {
    if (patient.echoData?.videos) {
      setVideos(patient.echoData.videos.map((url: string) => ({
        url,
        timestamp: new Date()
      })));
    }
  }, [patient.echoData?.videos]);

  // Sync with patient data when it changes
  useEffect(() => {
    setLocalNotes(patient.echoData?.notes || '');
  }, [patient.echoData?.notes]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 100 * 1024 * 1024; // 100MB

    try {
      setUploading(true);
      setUploadError(null);

      // Validate file type and size
      const validTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime', // For MOV files
        'video/x-m4v'      // For M4V files
      ];
      
      if (!validTypes.includes(file.type)) {
        throw new Error('Please upload a valid video file (MP4, MOV, WebM, M4V or OGG)');
      }

      if (file.size > maxSize) {
        throw new Error('Video size should be less than 100MB');
      }

      // Upload to Supabase Storage
      const fileName = `${patient.id}/${crypto.randomUUID()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('echo-videos')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('echo-videos')
        .getPublicUrl(fileName);

      // Update local state and parent
      const newVideos = [...videos, { url: publicUrl, timestamp: new Date() }];
      setVideos(newVideos);
      onEchoDataChange('videos', newVideos.map(v => v.url));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveVideo = async (videoUrl: string) => {
    setDeleteConfirmVideo(null);
    
    try {
      // Extract full path from URL
      const urlPath = new URL(videoUrl).pathname;
      const fileName = urlPath.split('/').slice(-2).join('/'); // Get "patientId/filename"
      if (!fileName) return;

      // Delete from storage
      const { error } = await supabase.storage
        .from('echo-videos')
        .remove([fileName]);

      if (error) throw error;

      // Update local state
      const newVideos = videos.filter(v => v.url !== videoUrl);
      setVideos(newVideos);
      onEchoDataChange('videos', newVideos.map(v => v.url));

      // Close video viewer if the deleted video was being viewed
      if (selectedVideo === videoUrl) {
        setSelectedVideo(null);
        setVideoViewerOpen(false);
      }

    } catch (error) {
      console.error('Failed to remove video:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to remove video');
    }
  };

  const handleVoiceTranscript = (text: string) => {
    console.log('Received ECHO transcript:', text);
    const newNotes = localNotes 
      ? `${localNotes}\n${text}` 
      : text;
    
    // Update both local state and parent
    setLocalNotes(newNotes);
    onEchoDataChange('notes', newNotes);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    onEchoDataChange('notes', newNotes);
  };

  return (
    <div className="space-y-6">
      {/* Video Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Echo Videos</h3>
          <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            <span>Upload Video</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
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
            <span>Uploading video...</span>
          </div>
        )}

        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {videos.map((video, index) => (
              <div 
                key={video.url}
                className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedVideo(video.url);
                  setVideoViewerOpen(true);
                }}
              >
                <div className="aspect-video relative">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(video.url);
                        setVideoViewerOpen(true);
                      }}
                      className="p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmVideo(video.url);
                      }}
                      className="p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    #{videos.length - index}
                  </div>
                </div>
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                  {format(video.timestamp, 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <Video className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No echo videos uploaded yet
            </p>
          </div>
        )}
      </div>

      {/* Video Viewer Modal */}
      <AnimatePresence>
        {videoViewerOpen && selectedVideo && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90"
            onClick={() => setVideoViewerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] mx-auto p-4"
              onClick={e => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                className="max-w-full max-h-[80vh] rounded-lg"
                controls
                autoPlay
              />
              
              {/* Navigation buttons */}
              {videos.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const currentIndex = videos.findIndex(v => v.url === selectedVideo);
                      const newIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
                      setSelectedVideo(videos[newIndex].url);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = videos.findIndex(v => v.url === selectedVideo);
                      const newIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
                      setSelectedVideo(videos[newIndex].url);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              <button
                onClick={() => setVideoViewerOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
                {videos.findIndex(v => v.url === selectedVideo) + 1} / {videos.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmVideo && (
          <div 
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50"
            onClick={() => setDeleteConfirmVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Delete Echo Video</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this echo video? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmVideo(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveVideo(deleteConfirmVideo)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">IVS (cm)</label>
          <input
            type="text"
            value={patient.echoData?.ivs || ''}
            onChange={(e) => onEchoDataChange('ivs', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LVEDD (cm)</label>
          <input
            type="text"
            value={patient.echoData?.lvedd || ''}
            onChange={(e) => onEchoDataChange('lvedd', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">EF (%)</label>
          <input
            type="text"
            value={patient.echoData?.ef || ''}
            onChange={(e) => onEchoDataChange('ef', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LA (cm)</label>
          <input
            type="text"
            value={patient.echoData?.la || ''}
            onChange={(e) => onEchoDataChange('la', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ao. asc. (cm)</label>
          <input
            type="text"
            value={patient.echoData?.aoAsc || ''}
            onChange={(e) => onEchoDataChange('aoAsc', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ao. arch. (cm)</label>
          <input
            type="text"
            value={patient.echoData?.aoArch || ''}
            onChange={(e) => onEchoDataChange('aoArch', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ao. ab. (cm)</label>
          <input
            type="text"
            value={patient.echoData?.aoAb || ''}
            onChange={(e) => onEchoDataChange('aoAb', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">RV (cm)</label>
          <input
            type="text"
            value={patient.echoData?.rv || ''}
            onChange={(e) => onEchoDataChange('rv', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">TR (/4+)</label>
          <input
            type="text"
            value={patient.echoData?.tr || ''}
            onChange={(e) => onEchoDataChange('tr', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MR (/4+)</label>
          <input
            type="text"
            value={patient.echoData?.mr || ''}
            onChange={(e) => onEchoDataChange('mr', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IVC (% collapsed)</label>
          <input
            type="text"
            value={patient.echoData?.ivcCollapsed || ''}
            onChange={(e) => onEchoDataChange('ivcCollapsed', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IVC (cm)</label>
          <input
            type="text"
            value={patient.echoData?.ivcCm || ''}
            onChange={(e) => onEchoDataChange('ivcCm', e.target.value)}
            className="w-full p-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Additional Notes</h3>
          <VoiceInput
            onTranscript={handleVoiceTranscript}
          />
        </div>
        <textarea
          value={localNotes}
          onChange={handleNotesChange}
          className="w-full h-24 p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter additional echo notes..."
        />
      </div>
    </div>
  );
};