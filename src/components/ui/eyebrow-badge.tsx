import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Eyebrow: small uppercase label above a heading (Inter 600, 14px, muted).
 * Usually rendered for you by SectionHeading's `eyebrow` prop.
 *
 *   <EyebrowBadge label="In development" tone="accent" />
 */
type Tone = 'muted' | 'accent' | 'light' | 'navy' | 'success';

interface EyebrowBadgeProps {
  label: string;
  /** muted (default) or accent. Older values map to these. */
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
}

const toneText: Record<Tone, string> = {
  muted: 'text-mm-muted',
  accent: 'text-mm-link',
  light: 'text-mm-muted',
  navy: 'text-mm-muted',
  success: 'text-mm-muted',
};

export const EyebrowBadge: React.FC<EyebrowBadgeProps> = ({ icon: Icon, label, tone = 'muted', className }) => {
  return (
    <span className={cn('mm-eyebrow inline-flex items-center gap-2', toneText[tone], className)}>
      {Icon && <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
      {label}
    </span>
  );
};
