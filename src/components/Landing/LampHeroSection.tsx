import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileCheck, Award } from 'lucide-react';
import { LampContainer } from '../ui/lamp';

const trustChips = [
  { icon: FileCheck, label: 'Live in 25 hospitals' },
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
    <LampContainer className="bg-surface-page">
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-20 md:px-8 md:pt-24 md:pb-24 lg:pt-28">
        {/* Headline — the human voice (serif) and the system voice (mono). */}
        <motion.h1
          initial={{ opacity: 0.5, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="mb-6 leading-[1.02] sm:mb-8"
        >
          <span className="block font-serif text-5xl font-semibold tracking-[-0.02em] text-text sm:text-6xl lg:text-7xl">
            One hospital.
          </span>
          <span className="mt-2 block font-mono text-2xl font-medium tracking-tight text-secondary sm:text-3xl lg:text-5xl dark:text-light-accent">
            One operating system.
          </span>
        </motion.h1>

        {/* Subhead — one line */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-text-muted sm:mb-10 sm:text-lg md:text-xl"
        >
          Hospitals run on dozens of programs that don’t talk to each other. MediMind replaces them all — every department, every workflow, one system with AI at its core. Built by doctors. Live across Georgia’s second-largest hospital chain.
        </motion.p>

        {/* Trust chips — squared, mono */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10 sm:gap-3"
        >
          {trustChips.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 border border-accent/25 bg-accent/[0.06] px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTAs — squared luminous language */}
        <motion.div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
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

          <motion.button
            onClick={() => scrollTo('path')}
            className="btn-ghost w-full px-7 py-3.5 text-base font-semibold text-text sm:w-auto"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            See the path
          </motion.button>
        </motion.div>
      </div>
    </LampContainer>
  );
};
