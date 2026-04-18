import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { EyebrowBadge } from './eyebrow-badge';

interface GradientHeadingProps {
  eyebrow?: { label: string; icon?: LucideIcon; tone?: 'accent' | 'light' | 'navy' | 'success' };
  title: React.ReactNode;
  highlight?: React.ReactNode;
  subhead?: React.ReactNode;
  align?: 'left' | 'center';
  level?: 'h1' | 'h2';
  className?: string;
}

export const GradientHeading: React.FC<GradientHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  subhead,
  align = 'center',
  level = 'h2',
  className,
}) => {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const Tag = level;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('max-w-4xl space-y-5', alignClass, className)}
    >
      {eyebrow && (
        <div className={align === 'center' ? 'flex justify-center' : ''}>
          <EyebrowBadge icon={eyebrow.icon} label={eyebrow.label} tone={eyebrow.tone} />
        </div>
      )}
      <Tag className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.05]">
        {title}{' '}
        {highlight && <span className="brand-gradient-text">{highlight}</span>}
      </Tag>
      {subhead && (
        <p className="text-base sm:text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl mx-auto">
          {subhead}
        </p>
      )}
    </motion.div>
  );
};
