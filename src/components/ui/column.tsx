import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Column block, the deck's signature: 4px navy top rule, bold title,
 * one or two sentences. No box, no shadow. Put two or three in a grid.
 *
 *   <div className="grid gap-10 md:grid-cols-3">
 *     <Column title="Fines and returned claims">One sentence on the consequence.</Column>
 *   </div>
 *
 * `as` sets the title level (h3 under a section h2; h4 if nested deeper).
 * `label` is an optional small line above the title (e.g. "Days 0 to 30").
 */
interface ColumnProps {
  title: React.ReactNode;
  as?: 'h3' | 'h4';
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Column: React.FC<ColumnProps> = ({ title, as: Tag = 'h3', label, children, className }) => (
  <div className={cn('border-t-4 border-mm-rule pt-5', className)}>
    {label && <p className="mm-eyebrow mb-2">{label}</p>}
    <Tag className="mm-h3">{title}</Tag>
    {children && <div className="mm-body mt-2">{children}</div>}
  </div>
);
