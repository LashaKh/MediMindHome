import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { showPracticeCase } from '../../content/site';
import { belief, type BeliefBeat } from '../../content/landing.v2.b';

/**
 * The belief (#belief), lane B. The 2 a.m. case from Dr. Khoshtaria's
 * practice as one wide night chart (four beats across the page on one time
 * axis, each with a small chart that draws in once as it comes into view),
 * then the belief itself at display scale. Without the case
 * (showPracticeCase false) a short generic night replaces the beats.
 */
export const BeliefSection: React.FC = () => {
  const beats: readonly BeliefBeat[] = showPracticeCase ? belief.caseBeats : belief.genericBeats;
  const reduce = !!useReducedMotion();
  const stripRef = useRef<HTMLOListElement>(null);
  const [armed, setArmed] = useState(false);
  const [lit, setLit] = useState(true);

  // One orchestrated moment: the charts draw in once, when the strip is in view.
  // Without IntersectionObserver or with reduced motion they are simply full.
  useEffect(() => {
    const el = stripRef.current;
    if (reduce || !el || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    setArmed(true);
    setLit(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <SectionShell id="belief" tone="navy" labelledBy="belief-title" className="lb-scope" innerClassName="relative">
      {showPracticeCase && (
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="lb-serif text-[20px] text-mm-ink sm:text-[22px]">{belief.caseIntro}</span>
          <span className="mm-caption">{belief.caseAuthor}</span>
        </p>
      )}

      <ol
        ref={stripRef}
        className={`mt-8 grid border-y border-mm-line sm:grid-cols-2 sm:gap-x-10 lg:mt-10 lg:gap-x-0 ${beats.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
      >
        {beats.map((beat, i) => (
          <li
            key={beat.marker}
            className={`flex flex-col gap-4 py-6 lg:gap-5 lg:px-8 lg:py-9 lg:first:pl-0 ${
              i > 0 ? 'border-t border-mm-line sm:border-t-0 lg:border-l' : ''
            }`}
          >
            <p className="lb-mono text-[26px] font-medium leading-none text-mm-ink lg:text-[34px]">{beat.marker}</p>
            <BeatChart visual={beat.visual} lit={lit} animate={armed} />
            <p className="lb-serif max-w-[24ch] text-[19px] text-mm-ink lg:text-[22px]">{beat.line}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-6 lg:mt-16 xl:grid-cols-12 xl:items-end xl:gap-8">
        <h2 id="belief-title" className="lb-display lb-belief xl:col-span-10">
          {belief.beliefLines.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h2>
        {showPracticeCase && (
          <p className="lb-serif text-[20px] text-mm-body lg:text-[24px] xl:col-span-2 xl:pb-3 xl:text-right">{belief.caseWhy}</p>
        )}
      </div>
    </SectionShell>
  );
};

/** Deterministic noise in [0, 1), so the record looks the same on every render. */
const rnd = (i: number, salt = 0) => {
  const h = Math.sin(i * 12.9898 + 78.233 + salt * 37.719) * 43758.5453;
  return h - Math.floor(h);
};
/** A long record: three columns of entries, each a line of uneven length. */
const RECORD = Array.from({ length: 27 }, (_, i) => 30 + Math.round(rnd(i) * 66));
/** The buried warning signs: far apart in a long history. */
const SIGNS = new Set([4, 13, 23]);
/** Fourteen hours, the gap widening: each hour taller than the last. */
const HOURS = Array.from({ length: 14 }, (_, i) => 22 + (i / 13) * 78);

/**
 * One small chart per beat (decorative; the words carry every fact), all on
 * the same 56px stage with a hairline time axis under it, so the four read
 * as one night: a quiet monitor trace, the record with three buried signs,
 * fourteen hours stacking up, twenty days in intensive care. Red is harm or
 * loss only.
 */
const BeatChart: React.FC<{ visual: BeliefBeat['visual']; lit: boolean; animate: boolean }> = ({ visual, lit, animate }) => {
  const t = animate ? 'transition-[opacity,transform] duration-500 ease-out' : '';
  return (
    <div aria-hidden="true" className="relative">
      <div className="relative flex h-14 items-end">
        {visual === 'night' && (
          <>
            <svg viewBox="0 0 240 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
              <path
                d="M0 40 H52 l5 -3 l4 3 h6 l4 -22 l5 32 l4 -10 h8 H150 l5 -3 l4 3 h6 l4 -22 l5 32 l4 -10 h8 H240"
                stroke="var(--lb-system)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                style={{
                  strokeDashoffset: lit ? 0 : 1,
                  transition: animate ? 'stroke-dashoffset 1400ms cubic-bezier(.2,.7,.2,1)' : undefined,
                }}
              />
            </svg>
            <span
              className="lb-heartbeat absolute right-0 block h-[7px] w-[7px] rounded-full"
              style={{ bottom: 'calc(16px - 3.5px)', backgroundColor: 'var(--lb-system)' }}
            />
          </>
        )}
        {visual === 'record' && (
          <div className="grid w-full grid-cols-3 gap-x-4 gap-y-[4px] self-center">
            {RECORD.map((w, i) => {
              const sign = SIGNS.has(i);
              return (
                <span key={i} className="flex h-[3px] items-center" style={{ width: `${w}%` }}>
                  <span
                    className={`block h-full w-full rounded-full ${t}`}
                    style={{
                      backgroundColor: sign ? 'var(--lb-harm)' : 'var(--mm-ink)',
                      opacity: sign ? (lit ? 1 : 0.2) : 0.2,
                      transitionDelay: animate && sign ? `${300 + i * 40}ms` : undefined,
                    }}
                  />
                </span>
              );
            })}
          </div>
        )}
        {visual === 'hours' && (
          <div className="flex h-full w-full items-end gap-[3px]">
            {HOURS.map((h, i) => (
              <span
                key={i}
                className={`block flex-1 origin-bottom rounded-t-[2px] ${t}`}
                style={{
                  height: `${h}%`,
                  backgroundColor: 'var(--lb-harm)',
                  opacity: 0.28 + (i / 13) * 0.72,
                  transform: `scaleY(${lit ? 1 : 0.04})`,
                  transitionDelay: animate ? `${500 + i * 50}ms` : undefined,
                }}
              />
            ))}
          </div>
        )}
        {visual === 'days' && (
          <div className="grid w-full grid-cols-10 gap-[5px]">
            {Array.from({ length: 20 }, (_, i) => (
              <span
                key={i}
                className={`block h-[18px] rounded-[3px] border ${t}`}
                style={{
                  borderColor: 'color-mix(in srgb, var(--lb-harm) 70%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--lb-harm) 26%, transparent)',
                  opacity: lit ? 1 : 0.06,
                  transitionDelay: animate ? `${1200 + i * 35}ms` : undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
      {/* The shared time axis: one hairline with a tick per step. */}
      <div
        className="mt-3 h-[5px] border-t border-mm-line"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, var(--mm-line) 0 1px, transparent 1px 12px)',
        }}
      />
    </div>
  );
};
