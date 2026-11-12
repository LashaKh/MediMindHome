import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { EyebrowBadge } from './eyebrow-badge';
import type { HeadingLevel } from '../../content/types';

/**
 * Section heading: eyebrow, Fraunces heading whose optional second clause
 * (`accent`) is set in the quieter --mm-voice2 ink, support line.
 * Left-aligned by default (deck habit). Pass the heading level in; the hero is
 * the only h1. `as="h1"` uses the display size, h2/h3 use the section size.
 *
 *   <SectionHeading as="h2" id="problem-title" eyebrow="The problem"
 *     title="Margins are thin." accent="Fines make them thinner."
 *     support="One line that carries the section." />
 */
interface SectionHeadingProps {
  as: HeadingLevel;
  title: React.ReactNode;
  /** The ONE accent phrase, rendered after the title (or before with accentFirst). */
  accent?: React.ReactNode;
  accentFirst?: boolean;
  eyebrow?: string;
  eyebrowTone?: 'muted' | 'accent';
  support?: React.ReactNode;
  align?: 'left' | 'center';
  /** Put on the heading element; pass the same value to SectionShell `labelledBy`. */
  id?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  as: Tag,
  title,
  accent,
  accentFirst = false,
  eyebrow,
  eyebrowTone = 'muted',
  support,
  align = 'left',
  id,
  className,
}) => {
  const centered = align === 'center';
  const accentNode = accent ? <span className="mm-accent-text">{accent}</span> : null;

  return (
    <div className={cn('max-w-4xl', centered ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && <EyebrowBadge label={eyebrow} tone={eyebrowTone} className="mb-5" />}
      <Tag id={id} className={Tag === 'h1' ? 'mm-display' : 'mm-h2'}>
        {accentFirst && accentNode}
        {accentFirst && accentNode && ' '}
        {title}
        {!accentFirst && accentNode && ' '}
        {!accentFirst && accentNode}
      </Tag>
      {support && <p className={cn('mm-lead mt-6', centered ? 'mx-auto max-w-2xl' : 'max-w-2xl')}>{support}</p>}
    </div>
  );
};

/**
 * @deprecated Older sections' API. Same component as SectionHeading.
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

export const GradientHeading: React.FC<GradientHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  subhead,
  align = 'center',
  level = 'h2',
  className,
}) => (
  <SectionHeading
    as={level}
    eyebrow={eyebrow?.label}
    title={title}
    accent={highlight}
    support={subhead}
    align={align}
    className={className}
  />
);
