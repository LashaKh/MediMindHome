import React, { useRef } from 'react';
import { Loader2, Camera, CheckSquare, X, RotateCcw, FlipHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreamReady: boolean;
  onCapture: () => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  videoRef,
  isStreamReady,
  onCapture,
  onCancel
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-lg overflow-hidden bg-black shadow-lg"
    >
      <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
        <Camera className="w-4 h-4" />
        <span>{isStreamReady ? "Camera Active" : "Initializing..."}</span>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={onCancel}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full min-h-[320px] object-cover rounded-lg"
      />
      
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between gap-4 mb-3">
          <button
            className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!isStreamReady}
            aria-label="Flip camera"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>
          
          <button
            onClick={onCapture}
            disabled={!isStreamReady}
            className={`
              p-4 rounded-full transition-transform active:scale-95
              ${isStreamReady 
                ? 'bg-white text-primary hover:bg-white/90' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'}
            `}
            aria-label="Capture image"
          >
            <CheckSquare className="w-7 h-7" />
          </button>
          
          <button
            className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!isStreamReady}
            aria-label="Reset camera"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-white/80 text-sm text-center max-w-md">
          Position your ABG result in the frame and ensure good lighting for best results
        </p>
      </div>
      
      {!isStreamReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-white text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
            <p className="font-medium">Initializing camera...</p>
            <p className="text-white/70 text-sm mt-2 max-w-xs">
              Please allow camera access when prompted by your browser
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};