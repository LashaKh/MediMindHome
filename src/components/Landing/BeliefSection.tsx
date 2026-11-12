import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { showPracticeCase } from '../../content/site';
import { belief, type BeliefBeat } from '../../content/landing.v2.b';
import { BeliefInstrument } from './BeliefInstrument';
import { BeliefContrast } from './BeliefContrast';

/**
 * The belief (#belief), lane B. The 2 a.m. case from Dr. Khoshtaria's
 * practice as a scroll story, the turn from the reactive to the proactive
 * hospital, and the belief itself. Without the case (showPracticeCase false)
 * a short generic night opens the section instead.
 */
export const BeliefSection: React.FC = () => {
  const beats: readonly BeliefBeat[] = showPracticeCase ? belief.caseBeats : belief.genericBeats;
  const [active, setActive] = useState(0);
  const beatRefs = useRef<(HTMLLIElement | null)[]>([]);

  // The beat crossing the middle of the screen drives the instrument.
  useEffect(() => {
    const nodes = beatRefs.current.filter((n): n is HTMLLIElement => n !== null);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.beat));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [beats]);

  return (
    <SectionShell
      id="belief"
      tone="navy"
      labelledBy="belief-title"
      className="lb-scope"
    >
      {/* Night light: one faint monitor glow, nothing decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 40% at 78% 8%, var(--lb-system-wash), transparent 70%)' }}
      />

      <div className="relative">
        {showPracticeCase && (
          <div className="flex flex-col gap-1 border-l-2 pl-4 sm:pl-5" style={{ borderColor: 'var(--lb-system)' }}>
            <p className="mm-lead text-mm-ink">{belief.caseIntro}</p>
            <p className="mm-caption">
              {belief.caseAuthor}, {belief.caseAuthorRole}
            </p>
          </div>
        )}

        {/* The story. Desktop: a sticky instrument beside the beats. */}
        <div className="mt-8 grid gap-4 lg:mt-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="sticky top-16 z-10 -mx-4 bg-mm-surface px-4 pb-4 pt-3 sm:-mx-6 sm:px-6 md:top-20 lg:static lg:mx-0 lg:bg-transparent lg:p-0">
            <div className="lg:sticky lg:top-[calc(50vh-200px)]">
              <BeliefInstrument visual={beats[active]?.visual ?? 'night'} />
            </div>
          </div>

          <ol className="flex flex-col">
            {beats.map((beat, i) => (
              <li
                key={beat.marker}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                data-beat={i}
                className={`flex min-h-[40svh] flex-col justify-center transition-opacity duration-500 lg:min-h-[68vh] ${
                  active === i ? 'opacity-100' : 'opacity-[0.55]'
                }`}
              >
                <p className="lb-mono text-sm text-mm-link">{beat.marker}</p>
                <div className="mt-3 flex flex-col gap-2">
                  {beat.lines.map((line) => (
                    <p key={line} className="lb-serif lb-beat max-w-[22ch] text-mm-ink">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The turn. */}
        {showPracticeCase && (
          <div className="mx-auto mt-20 max-w-4xl text-center lg:mt-10">
            {belief.caseTurn.map((line) => (
              <p key={line} className="lb-serif lb-statement text-mm-ink">
                {line}
              </p>
            ))}
            <p className="mm-lead mt-6">{belief.caseWhy}</p>
          </div>
        )}

        <BeliefContrast />

        <BeliefStatement />
      </div>
    </SectionShell>
  );
};

/** The belief, large, lit line by line as it rises into view. */
const BeliefStatement: React.FC = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'center 0.55'] });
  const lines = belief.beliefLines;

  return (
    <div className="mt-24 border-t border-mm-line pt-16 md:mt-32 md:pt-24">
      <h2 id="belief-title" ref={ref} className="lb-display lb-belief max-w-[16ch]">
        {lines.map((line, i) => (
          <BeliefLine key={line} progress={scrollYProgress} index={i} count={lines.length} still={!!reduce}>
            {line}
          </BeliefLine>
        ))}
      </h2>
      <p className="lb-mono mt-10 text-sm text-mm-link">{belief.signature}</p>
    </div>
  );
};

const BeliefLine: React.FC<{
  progress: MotionValue<number>;
  index: number;
  count: number;
  still: boolean;
  children: React.ReactNode;
}> = ({ progress, index, count, still, children }) => {
  const start = index / (count + 1);
  const end = (index + 1.4) / (count + 1);
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  return (
    <motion.span className="block" style={still ? undefined : { opacity }}>
      {children}{' '}
    </motion.span>
  );
};
