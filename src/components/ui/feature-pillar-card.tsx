import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FeaturePillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
  /** Mono index shown top-left, e.g. "S-01". Falls back to the numeric index. */
  badge?: string;
  index?: number;
  className?: string;
}

/**
 * Protocol card — a numbered clinical-spec entry. Flat surface, hairline
 * border, mono index + rule, serif title. Reads like an OR checklist line,
 * not a glassy marketing tile. Hover raises a thin accent bar on the left edge.
 */
export const FeaturePillarCard: React.FC<FeaturePillarCardProps> = ({
  icon: Icon,
  title,
  description,
  details,
  badge,
  index = 0,
  className,
}) => {
  const reduce = useReducedMotion();
  const label = badge ?? String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card p-6 transition-colors duration-300 hover:border-accent/50',
        className
      )}
    >
      {/* left-edge illuminate bar (grows on hover) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent/70 transition-transform duration-300 group-hover:scale-y-100"
      />

      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-xs font-semibold tracking-[0.15em] text-accent">{label}</span>
        <span className="h-px flex-1 bg-surface-border" />
        <Icon className="h-4 w-4 flex-shrink-0 text-text-subtle transition-colors duration-300 group-hover:text-accent" strokeWidth={1.75} />
      </div>

      <h3 className="font-serif text-lg font-semibold leading-snug text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>

      {details && details.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-xs text-text-subtle">
          {details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 bg-accent" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
