import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, ExternalLink, User } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SectionShell id="cta" variant="gradient" ambient className="border-t border-surface-border">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.05]"
        >
          See it run.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed"
        >
          A 30-minute demo shows you the live MediScribe in Georgian, the command center, and specialty-routed AI — on the same screen, on the same data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <motion.button
            onClick={() => navigate('/request-demo')}
            className="group rounded-full brand-gradient px-7 py-3.5 text-base font-semibold text-white shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-shadow w-full sm:w-auto"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center justify-center gap-2">
              Book a 30-min demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </motion.button>

          <motion.a
            href="mailto:team@updevoteai.com?subject=MediMind%20%E2%80%94%20Talk%20to%20founders"
            className="rounded-full border border-accent/30 bg-accent/5 px-7 py-3.5 text-base font-semibold text-text hover:border-accent/60 hover:bg-accent/10 transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Mail className="w-4 h-4" />
            Talk to founders
          </motion.a>
        </motion.div>
      </div>

      {/* Slim Expert card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 sm:mt-14 mx-auto max-w-3xl"
      >
        <a
          href="https://medimind.md/expert"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border border-surface-border bg-surface-card/60 p-5 sm:p-6 backdrop-blur-sm hover:border-accent/30 hover:bg-surface-hover transition-colors"
        >
          <div className="inline-flex flex-shrink-0 rounded-xl bg-gradient-to-br from-secondary/30 to-accent/15 p-3 ring-1 ring-secondary/30 text-primary dark:text-light-accent">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-light-accent">Just one physician?</div>
            <h3 className="mt-1 text-base sm:text-lg font-semibold text-text">
              MediMind Expert — $15/mo for individual specialists
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Specialty knowledge bases, voice transcription, calculators, case discussion.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:text-secondary dark:group-hover:text-light-accent whitespace-nowrap">
            medimind.md/expert
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </a>
      </motion.div>

      {/* Investor strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 mx-auto max-w-3xl text-center text-xs text-text-subtle"
      >
        Open pre-seed round · $200k SAFE ($5M cap) ·{' '}
        <a href="mailto:team@updevoteai.com?subject=MediMind%20Pre-Seed%20Inquiry" className="text-text-muted hover:text-accent underline-offset-2 hover:underline">
          investor inquiries
        </a>
      </motion.div>
    </SectionShell>
  );
};
