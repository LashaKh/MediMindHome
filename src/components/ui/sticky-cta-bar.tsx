import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { primaryCta } from '../../content/site';
import { buttonClass } from './button';

/**
 * Slim sticky call-to-action bar, phones only (hidden from md up), on the
 * ink canvas in both themes so it reads over light and dark sections alike.
 * Appears once the hero has scrolled off the top and hides again when the
 * contact section (the form) reaches the screen. Rendered once by Landing.tsx;
 * section builders do not need to add it.
 *
 *   <StickyCtaBar />                       // site.ts primaryCta, watches #hero and #contact
 *   <StickyCtaBar label="…" href="#contact" afterId="hero" untilId="contact" />
 */
interface StickyCtaBarProps {
  label?: string;
  href?: string;
  afterId?: string;
  untilId?: string;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({
  label = primaryCta.label,
  href = primaryCta.href,
  afterId = 'hero',
  untilId = 'contact',
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const after = document.getElementById(afterId);
      const until = document.getElementById(untilId);
      const pastHero = after ? after.getBoundingClientRect().bottom < 0 : false;
      const beforeForm = until ? until.getBoundingClientRect().top > window.innerHeight : true;
      setVisible(pastHero && beforeForm);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [afterId, untilId]);

  return (
    <div
      className={cn(
        'mm-tone-navy fixed inset-x-0 bottom-0 z-40 border-t border-mm-line bg-mm-surface px-4 pt-2 transition-transform duration-200 ease-out md:hidden',
        'pb-[calc(0.5rem+env(safe-area-inset-bottom))]',
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      )}
      aria-hidden={!visible}
    >
      <a href={href} className={buttonClass('primary', true)} tabIndex={visible ? undefined : -1}>
        {label}
      </a>
    </div>
  );
};
