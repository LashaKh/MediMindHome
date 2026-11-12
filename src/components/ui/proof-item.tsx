import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Proof-strip item: one short proof (bold label + optional detail),
 * optional logo and optional source link. Renders an <li>; wrap items in
 * a <ul>, e.g. <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">.
 *
 *   <ProofItem label="GITA grant" detail="150,000 GEL"
 *     href="https://…" linkLabel="View registry" />
 */
interface ProofItemProps {
  label: React.ReactNode;
  detail?: React.ReactNode;
  /** Small logo; give alt text, or alt="" if the label already names it. */
  logo?: { src: string; alt: string; width: number; height: number };
  href?: string;
  linkLabel?: string;
  className?: string;
}

export const ProofItem: React.FC<ProofItemProps> = ({ label, detail, logo, href, linkLabel, className }) => (
  <li className={cn('flex flex-col gap-1', className)}>
    {logo && (
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        loading="lazy"
        className="mb-2 h-8 w-auto self-start"
      />
    )}
    <span className="text-base font-semibold leading-snug text-mm-ink">{label}</span>
    {detail && <span className="mm-caption">{detail}</span>}
    {href && (
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-quiet self-start text-sm">
        {linkLabel ?? 'Source'}
      </a>
    )}
  </li>
);
