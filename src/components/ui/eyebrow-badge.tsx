import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Section eyebrow — the "system voice." A mono, uppercase, letter-spaced label
 * (no pill, no backdrop-blur). Variation comes from tone (text color), all in
 * the brand palette except `success`.
 */
type Tone = 'accent' | 'light' | 'navy' | 'success';

interface EyebrowBadgeProps {
  icon?: LucideIcon;
  label: string;
  tone?: Tone;
  className?: string;
}

const toneText: Record<Tone, string> = {
  accent: 'text-accent',
  light: 'text-secondary dark:text-light-accent',
  navy: 'text-secondary dark:text-light-accent',
  success: 'text-success',
};

export const EyebrowBadge: React.FC<EyebrowBadgeProps> = ({ icon: Icon, label, tone = 'accent', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em]',
        toneText[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
      {label}
    </span>
  );
};
