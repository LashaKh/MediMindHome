import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileCheck, Award } from 'lucide-react';
import { LampContainer } from '../ui/lamp';

const trustChips = [
  { icon: FileCheck, label: 'Contracted with 25-hospital chain' },
  { icon: Award, label: '“Innovative Startup” status — Government of Georgia' },
];

export const LampHeroSection: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <LampContainer className="bg-gradient-to-br from-surface-page via-surface-section to-surface-page">
      <div className="text-center max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-8">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0.5, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent leading-[1.05] mb-6 sm:mb-8"
        >
          One hospital.
          <br />
          <span className="brand-gradient-text">One operating system.</span>
        </motion.h1>

        {/* Subhead — one line */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          One of the first hospital operating systems built ground-up on FHIR R4 — every clinical, operational, and financial workflow in a single codebase, a single login, a single data model. Built by doctors. Live in Georgia.
        </motion.p>

        {/* Trust chips */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10"
        >
          {trustChips.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-text-muted backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => navigate('/request-demo')}
            className="group relative overflow-hidden rounded-full brand-gradient px-7 py-3.5 text-base font-semibold text-white shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-shadow w-full sm:w-auto"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Book a 30-min demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            onClick={() => scrollTo('platform')}
            className="rounded-full border border-accent/30 bg-accent/5 px-7 py-3.5 text-base font-semibold text-text hover:border-accent/60 hover:bg-accent/10 transition-colors w-full sm:w-auto"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            See the operating system
          </motion.button>
        </motion.div>
      </div>
    </LampContainer>
  );
};
