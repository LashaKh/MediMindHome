import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../ui';
import { switchPlan as copy } from '../../content/landing.v2.lane-d';
import { dDisplay, dH2, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * The switch (#switch): the fear, answered fast. The 90 days are drawn as
 * two systems running side by side. The current system keeps running and
 * turns into the way back. MediMind starts as a dashed shadow build, then
 * departments light up one by one (separate strands) and braid into one
 * line that carries the hospital by day 90. Day 30 carries the amber mark:
 * a person decides. Only the blue lines animate, once, when the timeline
 * scrolls in; amber never moves; everything is drawn in full under
 * prefers-reduced-motion. All meaning is also real text.
 */

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Positions on the 90-day track, in percent. */
const AT = { d0: 0, d30: 100 / 3, d60: 200 / 3, d90: 100 };
/** Departments going live between day 30 and day 60: start point of each strand. */
const STRANDS = [AT.d30, AT.d30 + 6, AT.d30 + 13, AT.d30 + 21];

const Timeline: React.FC = () => {
  const reduce = useReducedMotion();
  // One observer on the whole track; each line draws from it.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const draw = (delay: number, duration: number) => ({
    initial: reduce ? false : { scaleX: 0 },
    animate: { scaleX: reduce || inView ? 1 : 0 },
    transition: { duration, delay, ease: EASE },
  });

  return (
    <figure className="mt-14 md:mt-20" aria-labelledby="switch-timeline-label">
      <figcaption id="switch-timeline-label" className="sr-only">
        {copy.timelineLabel}
      </figcaption>

      {/* Day ticks */}
      <div className={cn(dMono, 'relative h-5 text-mm-muted')} aria-hidden="true">
        {copy.ticks.map((tick, i) => (
          <span
            key={tick}
            className={cn(
              'absolute top-0 whitespace-nowrap',
              i === 0 ? '' : i === copy.ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
            )}
            style={{ left: `${[AT.d0, AT.d30, AT.d60, AT.d90][i]}%` }}
          >
            {tick}
          </span>
        ))}
      </div>

      {/* The track: two systems, one above the other */}
      <div ref={ref} className="relative mt-3 h-[168px] [--strand-top:126px] md:h-[184px] md:[--strand-top:134px]" aria-hidden="true">
        {/* day lines */}
        <span className="absolute inset-y-0 w-px bg-mm-line" style={{ left: `${AT.d60}%` }} />
        <span className="absolute inset-y-0 left-0 w-px bg-mm-line" />
        <span className="absolute inset-y-0 right-0 w-px bg-mm-line" />
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-mm-human" style={{ left: `${AT.d30}%` }} />
        <span
          className="absolute -top-1 h-3 w-3 -translate-x-1/2 rotate-45 bg-mm-human"
          style={{ left: `${AT.d30}%` }}
        />

        {/* Current system */}
        <span className="absolute left-3 top-4 z-[1] bg-mm-surface pr-2 text-[0.9375rem] text-mm-muted">{copy.lanes.current}</span>
        <span className="absolute top-[52px] h-[2px] bg-mm-muted" style={{ left: 0, width: `${AT.d60}%` }} />
        <span
          className="absolute top-[52px] border-t-2 border-dashed border-mm-muted"
          style={{ left: `${AT.d60}%`, right: 0 }}
        />
        <span
          className={cn(dMono, 'absolute top-[62px] hidden text-mm-muted sm:block')}
          style={{ left: `calc(${AT.d60}% + 0.75rem)` }}
        >
          {copy.wayBack}
        </span>

        {/* MediMind */}
        <span className="absolute left-3 top-[90px] z-[1] bg-mm-surface pr-2 text-[0.9375rem] font-semibold text-mm-ink md:top-[96px]">
          {copy.lanes.medimind}
        </span>
        {/* shadow build */}
        <motion.span
          className="absolute top-[133px] origin-left border-t-2 border-dashed border-mm-system md:top-[141px]"
          style={{ left: 0, width: `${AT.d30}%` }}
          {...draw(0, 0.8)}
        />
        <span
          className={cn(dMono, 'absolute top-[146px] hidden text-mm-link sm:block md:top-[154px]')}
          style={{ left: '0.75rem' }}
        >
          {copy.shadow}
        </span>
        {/* departments go live, one strand each */}
        {STRANDS.map((start, i) => (
          <motion.span
            key={start}
            className="absolute h-[2px] origin-left rounded-full bg-mm-system"
            style={{ left: `${start}%`, width: `${AT.d60 - start}%`, top: `calc(${i * 5}px + var(--strand-top))` }}
            {...draw(0.7 + i * 0.18, 0.9 - i * 0.12)}
          />
        ))}
        {/* the whole hospital on one line */}
        <motion.span
          className="absolute h-[8px] origin-left rounded-r-full bg-mm-system shadow-[0_0_18px_var(--mm-system)]"
          style={{ left: `${AT.d60}%`, right: 0, top: 'calc(var(--strand-top) + 3.5px)' }}
          {...draw(1.6, 0.9)}
        />
      </div>

      {/* Milestones under the track */}
      <div className="relative mt-3 h-12">
        <p className="absolute top-0 -translate-x-[2px]" style={{ left: `${AT.d30}%` }}>
          <span className="sr-only">{copy.decide.day}: </span>
          <span className={cn(dDisplay, 'block whitespace-nowrap text-[1.25rem] text-mm-human-text leading-tight sm:text-[1.625rem]')}>
            {copy.decide.text}
          </span>
        </p>
        <p className="absolute right-0 top-0 text-right">
          <span className="sr-only">{copy.live.day}: </span>
          <span className={cn(dDisplay, 'block whitespace-nowrap text-[1.25rem] leading-tight text-mm-link sm:text-[1.625rem]')}>
            {copy.live.text}
          </span>
        </p>
      </div>

      {/* The three stretches, aligned under the track */}
      <ol className="mt-10 grid gap-y-7 sm:grid-cols-3 sm:gap-x-0">
        {copy.steps.map((step) => (
          <li key={step.range} className="border-t border-mm-line pt-4 sm:pr-8">
            <p className={cn(dMono, 'text-mm-muted')}>{step.range}</p>
            <h3 className="mm-h3 mt-2">{step.title}</h3>
            <p className="mm-body mt-1.5 max-w-[34ch] text-pretty">{step.body}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
};

export const SwitchPlanSection: React.FC = () => (
  <SectionShell id="switch" tone="white" labelledBy="switch-title">
    <div className="max-w-4xl">
      <h2 id="switch-title" className={dH2}>
        {copy.title}
      </h2>
      <p className="mm-lead mt-6 max-w-2xl text-pretty">{copy.support}</p>
    </div>

    <Timeline />

    <div className="mt-16 grid gap-10 border-t border-mm-line pt-10 md:mt-20 md:grid-cols-2 md:gap-16 md:pt-12">
      <div>
        <h3 className={cn(dDisplay, 'text-[1.75rem] leading-tight text-mm-ink md:text-[2rem]')}>{copy.data.title}</h3>
        <p className="mm-body mt-3 max-w-md text-pretty">{copy.data.body}</p>
      </div>
      <p className="max-w-md text-pretty text-[1.125rem] leading-relaxed text-mm-body md:text-[1.1875rem]">
        <span className={cn(dDisplay, 'mr-2 align-[-0.08em] text-[2.75rem] leading-none text-mm-ink md:text-[3.25rem]')}>
          {copy.proof.figure}
        </span>
        {copy.proof.text}
      </p>
    </div>
  </SectionShell>
);
