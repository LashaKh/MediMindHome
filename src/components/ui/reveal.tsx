import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reveal: a small fade and rise (12px, 250ms) the first time the block
 * scrolls into view. Runs once, never loops. Off under prefers-reduced-motion
 * (shown at once). Do not wrap the hero h1 or the hero image (they must paint
 * immediately).
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

export const Reveal: React.FC<RevealProps> = ({ as: Tag = 'div', delay = 0, className, children }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return React.createElement(
    Tag,
    {
      ref,
      className: cn('mm-reveal', shown && 'is-in', className),
      style: delay ? { transitionDelay: `${Math.min(delay, 150)}ms` } : undefined,
    },
    children
  );
};
