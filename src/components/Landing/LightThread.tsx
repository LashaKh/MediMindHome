import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * The Light Thread — the page's spine. The hero's luminescence continues down
 * the left gutter as a single luminous line: a base rail, a glow that fills
 * with scroll progress, and a travelling pulse. Six section ticks double as
 * navigation (labels appear on hover, and always at ≥2xl where the gutter is
 * wide enough). Desktop-only; hidden below lg. Scroll-linked values are
 * transform-only (compositor); reduced-motion renders it fully lit and static.
 */
const TICKS = [
  { id: 'problem', num: '01', label: 'PROBLEM' },
  { id: 'path', num: '02', label: 'PATH' },
  { id: 'platform', num: '03', label: 'PLATFORM' },
  { id: 'ai', num: '04', label: 'AI' },
  { id: 'safety', num: '05', label: 'SAFETY' },
  { id: 'proof', num: '06', label: 'PROOF' },
];

export const LightThread: React.FC = () => {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [trackH, setTrackH] = useState(0);
  const [activeId, setActiveId] = useState<string>('problem');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const dotY = useTransform(progress, (v) => v * trackH);

  // Measure the rail's pixel height so the pulse can travel it exactly.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => setTrackH(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Highlight the tick for whichever section owns the viewport's center band.
  useEffect(() => {
    const els = TICKS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId((e.target as HTMLElement).id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-4 top-28 bottom-12 z-30 hidden lg:block 2xl:left-8"
    >
      <div ref={railRef} className="relative h-full">
        {/* base rail */}
        <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-accent/15" />
        {/* glow fill — grows with scroll progress */}
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-light-accent via-accent to-accent/10"
          style={{ height: '100%', scaleY: reduce ? 1 : progress }}
        />
        {/* travelling pulse */}
        {!reduce && (
          <motion.span
            aria-hidden
            style={{ y: dotY }}
            className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-light-accent shadow-[0_0_12px_3px_rgba(49,130,206,0.85)]"
          />
        )}
        {/* ticks (evenly spaced index markers + click-to-scroll) */}
        {TICKS.map((t, i) => {
          const active = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToId(t.id)}
              aria-label={`Go to ${t.label}`}
              aria-current={active ? 'true' : undefined}
              style={{ top: `${(i / (TICKS.length - 1)) * 100}%` }}
              className="group absolute left-0 flex -translate-y-1/2 items-center py-2"
            >
              <span
                className={cn(
                  '-translate-x-1/2 rounded-full transition-all duration-300',
                  active
                    ? 'h-2 w-2 bg-light-accent shadow-[0_0_8px_2px_rgba(49,130,206,0.6)]'
                    : 'h-1.5 w-1.5 bg-accent/40 group-hover:bg-accent'
                )}
              />
              <span
                className={cn(
                  'ml-3 whitespace-nowrap rounded bg-surface-page/80 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm transition-opacity duration-200',
                  '2xl:bg-transparent 2xl:px-0 2xl:backdrop-blur-none',
                  active ? 'text-light-accent' : 'text-text-subtle group-hover:text-text-muted',
                  'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 2xl:opacity-100'
                )}
              >
                <span className="text-accent">{t.num}</span> {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
