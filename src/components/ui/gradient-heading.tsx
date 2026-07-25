import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { EyebrowBadge } from './eyebrow-badge';

/**
 * Section heading — editorial serif in solid ink (no gradient-clip). The
 * highlight phrase rests at brand-accent ink and is swept once by a band of
 * light on first view. Eyebrow is a mono "system" label flanked by hairlines.
 * Children reveal with an orchestrated blur-in stagger.
 *
 * Name kept as `GradientHeading` for API stability across all call sites.
 */
interface GradientHeadingProps {
  eyebrow?: { label: string; icon?: LucideIcon; tone?: 'accent' | 'light' | 'navy' | 'success' };
  title: React.ReactNode;
  highlight?: React.ReactNode;
  subhead?: React.ReactNode;
  align?: 'left' | 'center';
  level?: 'h1' | 'h2';
  className?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    transitionEnd: { filter: 'none' },
  },
};

export const GradientHeading: React.FC<GradientHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  subhead,
  align = 'center',
  level = 'h2',
  className,
}) => {
  const Tag = level;
  const reduce = useReducedMotion();
  const [swept, setSwept] = useState(false);
  const centered = align === 'center';

  return (
    <motion.div
      variants={container}
      initial={reduce ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      onViewportEnter={() => setSwept(true)}
      className={cn('max-w-4xl space-y-5', centered ? 'mx-auto text-center' : 'text-left', className)}
    >
      {eyebrow && (
        <motion.div variants={item} className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <span className="h-px w-8 bg-accent/50" />
          <EyebrowBadge icon={eyebrow.icon} label={eyebrow.label} tone={eyebrow.tone} />
          {centered && <span className="h-px w-8 bg-accent/50" />}
        </motion.div>
      )}

      <motion.div variants={item}>
        <Tag className="font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-text sm:text-5xl lg:text-6xl">
          {title}
          {highlight && ' '}
          {highlight && <span className={cn('heading-highlight', swept && !reduce && 'sweep')}>{highlight}</span>}
        </Tag>
      </motion.div>

      {subhead && (
        <motion.p
          variants={item}
          className={cn(
            'text-base leading-relaxed text-text-muted sm:text-lg md:text-xl',
            centered ? 'mx-auto max-w-3xl' : 'max-w-2xl'
          )}
        >
          {subhead}
        </motion.p>
      )}
    </motion.div>
  );
};
