import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { recognitionTiles } from '../../data/recognition';
import { cn } from '../../utils/cn';

export const RecognitionSection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <SectionShell id="proof" variant="gradient" className="border-t border-surface-border">
      <GradientHeading
        align="left"
        eyebrow={{ icon: ShieldCheck, label: 'Proof', tone: 'light' }}
        title="Backed by doctors."
        highlight="Recognized by government. Live in hospitals."
        subhead="From idea to a 25-hospital network in 13 months."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {recognitionTiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.id}
              initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative flex flex-col rounded-lg border p-6',
                tile.emphasis
                  ? 'border-accent/40 bg-accent/[0.05] sm:col-span-2 lg:col-span-4'
                  : 'border-surface-border bg-surface-card'
              )}
            >
              {tile.emphasis ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-accent/40 bg-surface-page text-secondary dark:text-light-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold leading-snug text-text sm:text-2xl">{tile.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">{tile.body}</p>
                    {tile.link && (
                      <a
                        href={tile.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-medium tracking-wide text-secondary hover:text-accent dark:text-light-accent"
                      >
                        {tile.link.label}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-surface-border bg-surface-page text-accent">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-text">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{tile.body}</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
};
