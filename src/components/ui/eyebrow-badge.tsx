import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Eyebrow: small label above a heading in the system's mono voice
 * (IBM Plex Mono 500, 13/14px, sentence case, a short blue tick before it).
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
    <span className={cn('mm-eyebrow inline-flex items-center gap-2', Icon && 'before:hidden', toneText[tone], className)}>
      {Icon && <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
      {label}
    </span>
  );
};
