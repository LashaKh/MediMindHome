import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Big-stat block: one large number, one short line under it, optional source.
 * One highlighted number per section. tone="alert" (red) is for the loss
 * number only; tone="accent" for the one number to remember.
 *
 *   <StatTile value="2.4%" label="median margin" tone="accent"
 *     source="MediMind analysis of audited accounts of 68 mid-size Georgian hospitals" />
 */
interface StatTileProps {
  value: string;
  label: React.ReactNode;
  source?: React.ReactNode;
  tone?: 'ink' | 'accent' | 'alert';
  className?: string;
}

const toneClass = {
  ink: 'text-mm-ink',
  accent: 'text-mm-accent',
  alert: 'text-mm-alert',
};

export const StatTile: React.FC<StatTileProps> = ({ value, label, source, tone = 'ink', className }) => (
  <div className={cn('max-w-sm', className)}>
    <p className={cn('mm-stat', toneClass[tone])}>{value}</p>
    <p className="mm-body mt-3">{label}</p>
    {source && <p className="mm-caption mt-2">{source}</p>}
  </div>
);
