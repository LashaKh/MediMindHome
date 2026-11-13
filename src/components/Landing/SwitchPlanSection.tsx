import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../ui';
import { switchPlan as copy } from '../../content/landing.v2.lane-d';
import { dDisplay, dH2, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * The switch (#switch): the fear, answered fast. The 60 days are drawn as
 * two systems running side by side across the full page grid. The current
 * system keeps running and turns into the way back. MediMind starts as a
 * dashed shadow build, then departments light up one by one (separate
 * strands) and braid into one line that carries the hospital by day 60.
 * Day 20 carries the amber mark:
 * a person decides. Only the blue lines animate, once, when the timeline
 * scrolls in; amber never moves; everything is drawn in full under
 * prefers-reduced-motion. All meaning is also real text.
 */

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * Geometry, in px of the measured track width. Days map linearly to x.
 * Rows: the day ruler, the current system, MediMind (with four department
 * strands that leave its line after day 20 and braid back in by day 40).
 */
const H = 212;
const RULER_Y = 22;
const CUR_Y = 74;
const MM_Y = 150;
const STRAND_GAP = 9;
/** Day each department strand leaves the line, and the depth it runs at. */
const STRANDS = [
  { from: 21, depth: 1 },
  { from: 24, depth: 2 },
  { from: 27.5, depth: 3 },
  { from: 31, depth: 4 },
];

const useWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    setW(node.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setW(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, w };
};

const Timeline: React.FC = () => {
  const reduce = useReducedMotion();
  const { ref, w } = useWidth();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const on = reduce || inView;
  const uid = useId().replace(/:/g, '');
  const draw = (delay: number, duration: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: on ? 1 : 0 },
    transition: { duration, delay, ease: EASE },
  });

  // Keep the end caps inside the box.
  const x0 = 1;
  const x1 = Math.max(w - 7, 1);
  const x = (day: number) => x0 + (day / 60) * (x1 - x0);
  const narrow = w > 0 && w < 560;

  return (
    <figure className="mt-12 md:mt-16" aria-labelledby="switch-timeline-label">
      <figcaption id="switch-timeline-label" className="sr-only">
        {copy.timelineLabel}
      </figcaption>

      <div ref={ref} className="relative" style={{ height: H }} aria-hidden="true">
        {w > 0 && (
          <>
            <svg className="absolute inset-0 overflow-visible" width={w} height={H} viewBox={`0 0 ${w} ${H}`} fill="none">
              <defs>
                <linearGradient id={`${uid}-way`} gradientUnits="userSpaceOnUse" x1={x(40)} y1="0" x2={x(60)} y2="0">
                  <stop offset="0" stopColor="var(--mm-muted)" stopOpacity="0.9" />
                  <stop offset="1" stopColor="var(--mm-muted)" stopOpacity="0.15" />
                </linearGradient>
                <filter id={`${uid}-glow`} x="-5%" y="-300%" width="110%" height="700%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              {/* The day ruler: a tick every five days, taller at 0, 20, 40 and 60. */}
              <line x1={x0} y1={RULER_Y} x2={x1} y2={RULER_Y} stroke="var(--mm-line)" />
              {Array.from({ length: 13 }, (_, k) => {
                const major = k % 4 === 0;
                return (
                  <line
                    key={k}
                    x1={x(k * 5)}
                    y1={RULER_Y}
                    x2={x(k * 5)}
                    y2={RULER_Y + (major ? 8 : 4)}
                    stroke={major ? 'var(--mm-muted)' : 'var(--mm-line)'}
                  />
                );
              })}
              {/* Day 40: where the hospital moves over. A quiet hairline through both systems. */}
              <line x1={x(40)} y1={RULER_Y + 12} x2={x(40)} y2={H - 6} stroke="var(--mm-line)" strokeDasharray="2 4" />
              <line x1={x(60)} y1={RULER_Y + 12} x2={x(60)} y2={H - 6} stroke="var(--mm-line)" strokeDasharray="2 4" />

              {/* The current system: solid until day 40, then a fading way back. */}
              <line x1={x0} y1={CUR_Y} x2={x(40)} y2={CUR_Y} stroke="var(--mm-muted)" strokeWidth="2" strokeLinecap="round" />
              <line x1={x(40)} y1={CUR_Y} x2={x1} y2={CUR_Y} stroke={`url(#${uid}-way)`} strokeWidth="2" strokeDasharray="5 6" />
              <circle cx={x(40)} cy={CUR_Y} r="3.5" fill="var(--mm-surface)" stroke="var(--mm-muted)" strokeWidth="1.5" />

              {/* MediMind: the shadow build, dashed, day 0 to 20. */}
              <motion.path
                d={`M${x0} ${MM_Y} L${x(20)} ${MM_Y}`}
                stroke="var(--mm-system)"
                strokeWidth="2"
                strokeDasharray="4 5"
                {...draw(0, 0.9)}
              />
              {/* The line carries on from day 20 to day 40, under the strands. */}
              <motion.path
                d={`M${x(20)} ${MM_Y} L${x(40)} ${MM_Y}`}
                stroke="var(--mm-system)"
                strokeWidth="2"
                strokeLinecap="round"
                {...draw(0.85, 0.7)}
              />
              {/* Departments go live: each strand leaves the line, runs on its own, and braids back in by day 40. */}
              {STRANDS.map((strand, i) => {
                const y = MM_Y + strand.depth * STRAND_GAP;
                const a = x(strand.from);
                const b = x(40);
                const bend = Math.min(36, (b - a) / 3);
                return (
                  <motion.path
                    key={strand.from}
                    d={`M${a} ${MM_Y} C ${a + bend * 0.6} ${MM_Y}, ${a + bend * 0.4} ${y}, ${a + bend} ${y} L${b - bend} ${y} C ${b - bend * 0.4} ${y}, ${b - bend * 0.6} ${MM_Y}, ${b} ${MM_Y}`}
                    stroke="var(--mm-system)"
                    strokeWidth="1.25"
                    strokeOpacity={0.9 - i * 0.12}
                    {...draw(1.1 + i * 0.16, 0.9)}
                  />
                );
              })}
              {/* One line carries the whole hospital from day 40. */}
              <motion.path
                d={`M${x(40)} ${MM_Y} L${x1} ${MM_Y}`}
                stroke="var(--mm-system)"
                strokeWidth="10"
                strokeLinecap="round"
                filter={`url(#${uid}-glow)`}
                className="opacity-25 dark:opacity-60"
                {...draw(1.9, 0.9)}
              />
              <motion.path
                d={`M${x(40)} ${MM_Y} L${x1} ${MM_Y}`}
                stroke="var(--mm-system)"
                strokeWidth="4"
                strokeLinecap="round"
                {...draw(1.9, 0.9)}
              />
              {[0, 20, 40].map((day) => (
                <circle key={day} cx={x(day) + (day === 0 ? 3 : 0)} cy={MM_Y} r="3.5" fill="var(--mm-surface)" stroke="var(--mm-system)" strokeWidth="1.5" />
              ))}
              <motion.g
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 2.7 }}
              >
                <circle cx={x1} cy={MM_Y} r="12" fill="var(--mm-system)" opacity="0.16" />
                <circle cx={x1} cy={MM_Y} r="6" fill="var(--mm-system)" />
                <circle cx={x1} cy={MM_Y} r="2.25" fill="var(--mm-surface)" />
              </motion.g>

              {/* Day 20: a person decides. Amber, still, across both systems. */}
              <line x1={x(20)} y1={RULER_Y + 12} x2={x(20)} y2={H - 6} stroke="var(--mm-human)" strokeWidth="1.5" />
              <rect
                x={x(20) - 5}
                y={RULER_Y - 5}
                width="10"
                height="10"
                fill="var(--mm-human)"
                transform={`rotate(45 ${x(20)} ${RULER_Y})`}
              />
            </svg>

            {/* Day labels above the ruler. */}
            {copy.ticks.map((tick, i) => (
              <span
                key={tick}
                className={cn(
                  dMono,
                  'absolute whitespace-nowrap text-[12px]',
                  i === 1 ? 'font-medium text-mm-human-text' : 'text-mm-muted',
                  i === 0 ? '' : i === copy.ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
                )}
                style={{ left: x([0, 20, 40, 60][i]), top: -8 }}
              >
                {tick}
              </span>
            ))}

            {/* System names, sitting on their lines. */}
            <span className="absolute left-0 bg-mm-surface pr-2 text-[0.875rem] text-mm-muted" style={{ top: CUR_Y - 28 }}>
              {copy.lanes.current}
            </span>
            {!narrow && (
              <span className={cn(dMono, 'absolute text-[12px] text-mm-muted')} style={{ left: x(40) + 14, top: CUR_Y - 24 }}>
                {copy.wayBack}
              </span>
            )}
            <span className="absolute left-0 bg-mm-surface pr-2 text-[0.875rem] font-semibold text-mm-ink" style={{ top: MM_Y - 30 }}>
              {copy.lanes.medimind}
            </span>
          </>
        )}
      </div>

      {/* Milestones: the decision at day 20, live at day 60. Real text. */}
      <div className={cn('relative mt-2', narrow ? 'h-[4.5rem]' : 'h-10')}>
        <p className="absolute top-0" style={{ left: w > 0 ? x(20) + 12 : '33.3%' }}>
          <span className="sr-only">{copy.decide.day}: </span>
          <span className={cn(dDisplay, 'block whitespace-nowrap text-[1.25rem] leading-tight text-mm-human-text sm:text-[1.5rem]')}>
            {copy.decide.text}
          </span>
        </p>
        <p className={cn('absolute right-0 text-right', narrow ? 'top-9' : 'top-0')}>
          <span className="sr-only">{copy.live.day}: </span>
          <span className={cn(dDisplay, 'block whitespace-nowrap text-[1.25rem] leading-tight text-mm-link sm:text-[1.5rem]')}>
            {copy.live.text}
          </span>
        </p>
      </div>

      {/* The three stretches, aligned to their thirds of the track. */}
      <ol className="mt-8 grid gap-y-4 sm:grid-cols-3 sm:gap-x-0">
        {copy.steps.map((step) => (
          <li key={step.range} className="border-t border-mm-line pt-3 sm:pr-8">
            <p className={cn(dMono, 'text-[12px] text-mm-muted')}>{step.range}</p>
            <h3 className="mm-h3 mt-1">{step.title}</h3>
          </li>
        ))}
      </ol>
    </figure>
  );
};

export const SwitchPlanSection: React.FC = () => (
  <SectionShell id="switch" tone="white" labelledBy="switch-title">
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
      <h2 id="switch-title" className={cn(dH2, 'lg:col-span-7')}>
        {copy.title}
      </h2>
      <div className="space-y-4 lg:col-span-5">
        <p className="mm-lead text-pretty text-mm-ink">{copy.support}</p>
        <p className="mm-body flex gap-3 text-pretty">
          <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full border-2 border-mm-system" aria-hidden="true" />
          {copy.faster}
        </p>
        <p className="mm-body flex gap-3 text-pretty">
          <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full border-2 border-mm-system" aria-hidden="true" />
          {copy.data}
        </p>
      </div>
    </div>

    <Timeline />
  </SectionShell>
);
