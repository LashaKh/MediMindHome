import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FeaturePillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
  badge?: string;
  index?: number;
  className?: string;
}

export const FeaturePillarCard: React.FC<FeaturePillarCardProps> = ({
  icon: Icon,
  title,
  description,
  details,
  badge,
  index = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative rounded-2xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm transition-colors hover:border-accent/30 hover:bg-surface-hover flex flex-col',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="inline-flex rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 p-2.5 text-accent ring-1 ring-accent/20">
          <Icon className="h-5 w-5" />
        </div>
        {badge && (
          <span className="rounded-full border border-surface-border bg-surface-hover px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      {details && details.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-xs text-text-subtle">
          {details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
