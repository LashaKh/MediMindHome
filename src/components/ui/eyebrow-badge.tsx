import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Brand tones — all map to brand blues except `success` which uses the
 * semantic success token from the brand book. Variation comes from
 * intensity (accent vs light-accent), not hue.
 */
type Tone = 'accent' | 'light' | 'navy' | 'success';

interface EyebrowBadgeProps {
  icon?: LucideIcon;
  label: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  accent: 'border-accent/30 bg-accent/10 text-accent',
  light: 'border-secondary/40 bg-secondary/10 text-secondary dark:border-light-accent/30 dark:bg-light-accent/10 dark:text-light-accent',
  navy: 'border-secondary/40 bg-secondary/10 text-secondary dark:text-light-accent',
  success: 'border-success/30 bg-success/10 text-success',
};

export const EyebrowBadge: React.FC<EyebrowBadgeProps> = ({ icon: Icon, label, tone = 'accent', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur',
        toneClasses[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
};
