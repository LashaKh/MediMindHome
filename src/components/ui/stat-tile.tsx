import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatTileProps {
  icon?: LucideIcon;
  value: string;
  label: string;
  caption?: string;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({ icon: Icon, value, label, caption, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm hover:border-accent/30 hover:bg-surface-hover transition-colors',
        className
      )}
    >
      {Icon && (
        <div className="mb-3 inline-flex rounded-lg bg-accent/15 p-2 text-accent">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">{value}</div>
      <div className="mt-1 text-sm font-medium text-text-muted">{label}</div>
      {caption && <div className="mt-2 text-xs text-text-subtle">{caption}</div>}
    </motion.div>
  );
};
