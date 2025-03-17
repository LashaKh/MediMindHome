import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Volume1, VolumeX, SkipBack, SkipForward, Headphones } from 'lucide-react';
import { AudioPlayerProps } from './types';
import { formatTime } from './transcriptionUtils';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile, onTimeUpdate }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create object URL for the audio file when it changes
  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setObjectUrl(url);
      
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [audioFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => console.error('Error playing audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progress = progressRef.current;
    if (!audio || !progress) return;

    const rect = progress.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !isMuted;
    audio.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, currentTime - 10);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.min(duration, currentTime + 10);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={objectUrl || undefined}
        className="hidden"
      />
      
      {!isLoaded ? (
        <div className="flex items-center justify-center h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
          <Headphones className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading audio...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          {/* Progress bar */}
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 cursor-pointer relative overflow-hidden"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentTime / duration) * 100}%` }}
              transition={{ type: "tween" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Skip backward button */}
              <button 
                onClick={skipBackward}
                className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Skip back 10 seconds"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              {/* Play/Pause button */}
              <button 
                onClick={togglePlayPause}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              {/* Skip forward button */}
              <button 
                onClick={skipForward}
                className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Skip forward 10 seconds"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              {/* Time display */}
              <div className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Volume controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 