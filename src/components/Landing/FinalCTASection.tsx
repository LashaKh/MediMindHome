import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
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
          A 30-minute demo shows you one login, one chart, one data model — the live MediScribe in Georgian, the command center, and specialty-routed AI, all on the same screen, on the same patient.
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

    </SectionShell>
  );
};
