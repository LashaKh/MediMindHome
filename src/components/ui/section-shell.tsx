import React from 'react';
import { cn } from '../../utils/cn';
import type { SectionTone } from '../../content/types';

/**
 * Section wrapper: full-width band with a tone and a fixed content grid.
 * The tone re-points the text tokens (text-mm-ink etc.), so the same
 * markup reads correctly on white, pale and navy.
 *
 *   <SectionShell id="problem" tone="pale" labelledBy="problem-title">
 *     <SectionHeading as="h2" id="problem-title" title="…" />
 *   </SectionShell>
 */
type LegacyVariant = 'light' | 'dark' | 'gradient' | 'transparent';

interface SectionShellProps {
  id: string;
  tone?: SectionTone;
  /** id of the section's heading, for aria-labelledby. */
  labelledBy?: string;
  /** Narrow column for reading-heavy sections (FAQ, privacy). */
  narrow?: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
  /** @deprecated older sections only; use `tone`. */
  variant?: LegacyVariant;
  /** @deprecated no effect. */
  ambient?: boolean;
}

const legacyTone: Record<LegacyVariant, SectionTone> = {
  light: 'white',
  dark: 'white',
  gradient: 'pale',
  transparent: 'white',
};

export const SectionShell: React.FC<SectionShellProps> = ({
  id,
  tone,
  labelledBy,
  narrow = false,
  className,
  innerClassName,
  children,
  variant,
}) => {
  const resolved = tone ?? (variant ? legacyTone[variant] : 'white');
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        `mm-tone-${resolved}`,
        'relative scroll-mt-16 bg-mm-surface py-16 text-mm-body md:scroll-mt-20 md:py-24 lg:py-28',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          narrow ? 'max-w-3xl' : 'max-w-6xl',
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
};
