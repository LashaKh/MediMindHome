import React, { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reveal: a 16px rise and fade (600ms) the first time a block scrolls into
 * view. Runs once, never loops.
 *
 * Content is never left invisible: the block renders visible, and only a
 * block that starts BELOW the fold is armed (hidden) before first paint, then
 * shown as soon as it enters the screen. Blocks already on screen, reduced
 * motion, no IntersectionObserver and print all show at once.
 * Do not wrap the hero h1 or the hero visual.
 *
 *   <Reveal><Column title="…">…</Column></Reveal>
 *   <Reveal as="li" delay={100}>…</Reveal>
 *
 * delay is capped at 150ms so staggered items never feel slow.
 */
type RevealTag = 'div' | 'li' | 'article' | 'figure';

interface RevealProps {
  as?: RevealTag;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

type Phase = 'static' | 'armed' | 'in';

export const Reveal: React.FC<RevealProps> = ({ as: Tag = 'div', delay = 0, className, children }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<Phase>('static');

  // Layout effect: decide before the first paint, so nothing flashes.
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return; // already on screen: stay visible

    setPhase('armed');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase('in');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return React.createElement(
    Tag,
    {
      ref,
      className: cn('mm-reveal', phase !== 'static' && 'is-armed', phase === 'in' && 'is-in', className),
      style: delay && phase !== 'static' ? { transitionDelay: `${Math.min(delay, 150)}ms` } : undefined,
    },
    children
  );
};
