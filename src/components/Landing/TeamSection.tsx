import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Users } from 'lucide-react';
import { SectionShell } from '../ui/section-shell';
import { GradientHeading } from '../ui/gradient-heading';
import { founders, advisors } from '../../data/team';

export const TeamSection: React.FC = () => {
  return (
    <SectionShell id="team" variant="gradient" ambient className="border-t border-surface-border">
      <GradientHeading
        eyebrow={{ icon: Stethoscope, label: 'Built by Doctors', tone: 'accent' }}
        title="We are doctors."
        highlight="We build for doctors."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 mx-auto max-w-3xl text-center"
      >
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          MediMind exists because we lived the problem. As physicians, we watched our colleagues spend more time on documentation than on patients. We watched critical lab values get buried in twelve disconnected systems. We watched patients arrive better-informed by ChatGPT than by us. We didn't pivot into healthcare from another industry — we pivoted out of clinical practice to fix it.
        </p>
        <p className="mt-5 text-sm sm:text-base text-accent font-medium">
          Beta-tested with 50 cardiologists in our first three months. Every UX decision is reviewed by a practicing clinician.
        </p>
      </motion.div>

      {/* Founder cards */}
      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {founders.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl border border-surface-border bg-surface-card/60 p-6 backdrop-blur-sm text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-secondary/40 text-2xl font-bold text-white ring-1 ring-accent/30">
              {f.initials}
            </div>
            <h3 className="text-lg font-semibold text-text">{f.name}</h3>
            <p className="mt-1 text-sm text-accent font-medium">{f.role}</p>
            <p className="mt-1 text-xs text-text-subtle">{f.credential}</p>
          </motion.div>
        ))}
      </div>

      {/* Advisors */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 sm:mt-12"
      >
        <div className="flex items-center justify-center gap-2 mb-5">
          <Users className="h-4 w-4 text-secondary dark:text-light-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-light-accent">Advisory Board</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {advisors.map((a) => (
            <div
              key={a.id}
              className="rounded-full border border-surface-border bg-surface-card/60 px-4 py-2 text-sm text-text-muted"
            >
              <span className="font-medium text-text">{a.name}</span>
              <span className="text-text-subtle"> · {a.affiliation}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </SectionShell>
  );
};
