import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { recognitionTiles } from '../../data/recognition';
import { cn } from '../../utils/cn';

export const RecognitionSection: React.FC = () => {
  return (
    <SectionShell id="proof" variant="gradient" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: ShieldCheck, label: 'Trusted, recognized, deployed', tone: 'light' }}
        title="Backed by doctors."
        highlight="Recognized by government. Deployed in hospitals."
        subhead="From idea to a 25-hospital contract in twelve months."
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {recognitionTiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className={cn(
                'rounded-2xl border p-6 backdrop-blur-sm transition-colors flex flex-col',
                tile.emphasis
                  ? 'border-accent/40 bg-accent/5 sm:col-span-2 lg:col-span-4'
                  : 'border-surface-border bg-surface-card/60 hover:border-accent/30 hover:bg-surface-hover'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'inline-flex flex-shrink-0 rounded-xl p-2.5 ring-1',
                    tile.emphasis
                      ? 'bg-gradient-to-br from-accent/40 to-light-accent/20 ring-accent/40 text-light-accent'
                      : 'bg-gradient-to-br from-accent/20 to-secondary/15 ring-accent/20 text-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className={cn('text-base sm:text-lg font-semibold leading-snug', tile.emphasis ? 'text-secondary dark:text-light-accent' : 'text-text')}>
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">{tile.body}</p>
                  {tile.link && (
                    <a
                      href={tile.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-secondary dark:text-light-accent hover:text-accent"
                    >
                      {tile.link.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
};
