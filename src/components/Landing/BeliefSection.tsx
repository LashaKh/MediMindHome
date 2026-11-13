import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { showPracticeCase } from '../../content/site';
import { belief, type BeliefBeat } from '../../content/landing.v2.b';

/**
 * The belief (#belief), lane B. The 2 a.m. case from Dr. Khoshtaria's
 * practice as one wide night chart (four beats across the page, each with a
 * small chart that fills in once as it comes into view), then the belief
 * itself at display scale. Without the case (showPracticeCase false) a short
 * generic night replaces the beats.
 */
export const BeliefSection: React.FC = () => {
  const beats: readonly BeliefBeat[] = showPracticeCase ? belief.caseBeats : belief.genericBeats;
  const reduce = !!useReducedMotion();
  const stripRef = useRef<HTMLOListElement>(null);
  const [armed, setArmed] = useState(false);
  const [lit, setLit] = useState(true);

  // One orchestrated moment: the charts fill in once, when the strip is in view.
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
          <span className="lb-serif text-[22px] text-mm-ink sm:text-[26px]">{belief.caseIntro}</span>
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
            className={`flex flex-col gap-3 py-5 lg:gap-5 lg:px-8 lg:py-10 lg:first:pl-0 ${
              i > 0 ? 'border-t border-mm-line sm:border-t-0 lg:border-l' : ''
            }`}
          >
            <p className="lb-mono text-[28px] font-medium leading-none text-mm-ink lg:text-[44px]">{beat.marker}</p>
            <BeatChart visual={beat.visual} lit={lit} animate={armed} />
            <p className="lb-serif max-w-[24ch] text-[20px] text-mm-ink lg:text-[26px]">{beat.line}</p>
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
          <p className="lb-serif text-[22px] text-mm-body lg:text-[28px] xl:col-span-2 xl:pb-4 xl:text-right">{belief.caseWhy}</p>
        )}
      </div>
    </SectionShell>
  );
};

/** Deterministic bar widths, so the record looks the same on every render. */
const RECORD = Array.from({ length: 18 }, (_, i) => {
  const h = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return 34 + Math.round((h - Math.floor(h)) * 62);
});
/** The buried warning signs: far apart in a long history. */
const SIGNS = new Set([2, 9, 15]);

/**
 * One small chart per beat (decorative; the words carry every fact): the
 * night's flat line, the record with three buried signs, fourteen hours,
 * twenty days. Red is harm or loss only.
 */
const BeatChart: React.FC<{ visual: BeliefBeat['visual']; lit: boolean; animate: boolean }> = ({ visual, lit, animate }) => {
  const t = animate ? 'transition-opacity duration-500' : '';
  return (
    <div aria-hidden="true" className="flex h-10 items-end lg:h-14">
      {visual === 'night' && (
        <div className="flex w-full items-center gap-3">
          <span className="lb-heartbeat block h-[9px] w-[9px] shrink-0 rounded-full" style={{ backgroundColor: 'var(--lb-system)' }} />
          <span className="block h-px flex-1" style={{ backgroundColor: 'var(--mm-muted)', opacity: 0.6 }} />
        </div>
      )}
      {visual === 'record' && (
        <div className="grid w-full grid-cols-3 gap-x-3 gap-y-[3px] lg:gap-y-[6px]">
          {RECORD.map((w, i) => {
            const sign = SIGNS.has(i);
            return (
              <span
                key={i}
                className={`block h-[4px] rounded-full ${t}`}
                style={{
                  width: `${w}%`,
                  backgroundColor: sign ? 'var(--lb-harm)' : 'var(--mm-muted)',
                  opacity: sign ? (lit ? 1 : 0.25) : 0.35,
                  transitionDelay: animate && sign ? `${200 + i * 30}ms` : undefined,
                }}
              />
            );
          })}
        </div>
      )}
      {visual === 'hours' && (
        <div className="flex h-7 w-full gap-[4px] lg:h-8">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className={`block flex-1 rounded-[3px] ${t}`}
              style={{
                backgroundColor: 'var(--lb-harm)',
                opacity: lit ? 0.3 + (i / 13) * 0.7 : 0.08,
                transitionDelay: animate ? `${500 + i * 45}ms` : undefined,
              }}
            />
          ))}
        </div>
      )}
      {visual === 'days' && (
        <div className="grid w-full grid-cols-10 gap-[4px]">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              className={`block h-[14px] rounded-[3px] ${t}`}
              style={{
                backgroundColor: 'var(--lb-harm)',
                opacity: lit ? 0.6 : 0.08,
                transitionDelay: animate ? `${1100 + i * 30}ms` : undefined,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
