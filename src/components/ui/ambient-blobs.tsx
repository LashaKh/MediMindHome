import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AmbientBlobsProps {
  className?: string;
  /** Reserved for future variation; current brand uses one palette only. */
  palette?: 'brand';
}

/**
 * Ambient background blobs — three drifting, slowly-rotating gradient orbs
 * in the brand blue palette (accent + light-accent). Replaces previous
 * cyan/violet/mixed options to stay on-brand.
 */
export const AmbientBlobs: React.FC<AmbientBlobsProps> = ({ className }) => {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <motion.div
        className="absolute -top-20 -left-20 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-accent/15 to-transparent blur-3xl"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tl from-secondary/20 to-transparent blur-3xl"
        animate={{ rotate: -360, scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-light-accent/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};
