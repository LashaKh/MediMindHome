import { useState, useRef } from 'react';

export const useCamera = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      stopCamera();
      setError(null);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      const constraints = {
        video: {
          facingMode: videoDevices.length > 1 ? 'environment' : undefined,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject();
          
          const timeoutId = setTimeout(() => {
            reject(new Error('Camera initialization timeout'));
          }, 10000);

          videoRef.current.onloadedmetadata = () => {
            clearTimeout(timeoutId);
            videoRef.current?.play()
              .then(() => {
                setIsStreamReady(true);
                setIsCameraOpen(true);
                resolve();
              })
              .catch(error => {
                console.error('Failed to play video:', error);
                reject(new Error('Failed to start video stream'));
              });
          };
        });
      }

    } catch (err) {
      let errorMessage = 'Failed to access camera. Please ensure you have granted camera permissions.';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please grant camera permissions and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please ensure your device has a working camera.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is in use by another application. Please close other apps using the camera.';
        }
      }
      
      console.error('Camera access error:', err);
      setError(errorMessage);
      setIsCameraOpen(false);
      setIsStreamReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOpen(false);
    setIsStreamReady(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !isStreamReady) {
      setError('Video stream not ready. Please wait a moment and try again.');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(videoRef.current, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create image blob'));
          },
          'image/jpeg',
          0.95
        );
      });

      const file = new File([blob], `abg-capture-${Date.now()}.jpg`, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      stopCamera();
      setError(null);
      return file;

    } catch (err) {
      console.error('Photo capture error:', err);
      setError(err instanceof Error ? err.message : 'Failed to capture photo');
      return null;
    }
  };

  return {
    isCameraOpen,
    isStreamReady,
    error,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto
  };
};