import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SectionShell id="cta" variant="gradient" className="border-t border-surface-border">
      {/* the Light Thread terminates here — a pool of light rising from the base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(49,130,206,0.28),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-text sm:text-6xl lg:text-7xl"
        >
          See it run.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg"
        >
          A 30-minute demo shows one login, one chart, one patient — the scribe writing in Georgian, the command center live, and AI on the same screens your doctors would use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
        >
          <motion.button
            onClick={() => navigate('/request-demo')}
            className="btn-luminous group w-full px-7 py-3.5 text-base font-semibold sm:w-auto"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center justify-center gap-2">
              Book a 30-min demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.button>

          <motion.a
            href="mailto:team@updevoteai.com?subject=MediMind%20%E2%80%94%20Talk%20to%20founders"
            className="btn-ghost inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-text sm:w-auto"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Mail className="h-4 w-4" />
            Talk to founders
          </motion.a>
        </motion.div>
      </div>
    </SectionShell>
  );
};
