import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { LampContainer } from '../ui/lamp';

const benefits = [
  {
    title: 'A better hospital today.',
    description: 'Connected information, simpler work, and AI that helps your people make better decisions.',
  },
  {
    title: 'Your own AI brain tomorrow.',
    description: 'Built around your hospital’s needs—progressing toward AI that anticipates risks and coordinates care and business decisions, with your team in control.',
  },
  {
    title: 'A team that keeps building for you.',
    description: 'Unlimited future development included. New features ready to test in three business days.',
  },
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
    <LampContainer
      className="min-h-0 bg-surface-page"
      contentClassName="w-full translate-y-0 px-0 sm:translate-y-0 md:translate-y-0"
    >
      <section aria-labelledby="hero-heading" className="mx-auto w-full max-w-6xl px-5 py-8 text-center sm:px-8 lg:px-12">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0.5, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="mb-4 font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-text sm:text-5xl lg:text-[3.5rem]"
        >
          <span className="block">
            Your hospital deserves a future.
          </span>
          <span className="mt-2 block text-secondary dark:text-light-accent">
            Your patients deserve better today.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg"
        >
          Replace disconnected software with one intelligent hospital system—built for better care, more revenue, and less waste.
        </motion.p>

        <motion.ul
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          viewport={{ once: true }}
          className="my-5 grid gap-5 border-y border-surface-border py-5 text-left md:grid-cols-3 md:gap-6"
        >
          {benefits.map(({ title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <div>
                <h2 className="text-base font-semibold leading-snug text-text">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
              </div>
            </li>
          ))}
        </motion.ul>

        <div className="mx-auto mb-5 max-w-3xl">
          <p className="text-xl font-semibold leading-snug text-text sm:text-2xl">
            Move first. At the software price you already pay.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            We match your current software price for early hospital partners. This offer won’t be available indefinitely.
          </p>
          <p className="mt-4 text-sm font-medium leading-relaxed text-text sm:text-base">
            Test it beside your current system in two weeks. Keep running. Commit after you see the difference.
          </p>
        </div>

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
              Build my hospital’s future
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
      </section>
    </LampContainer>
  );
};
