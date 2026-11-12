import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { MediMindLogo } from '../ui/MediMindLogo';
import { buttonClass } from '../ui';
import { useTheme } from '../../hooks/useTheme';
import { primaryCta } from '../../content/site';
import { headerContent } from '../../content/landing.v2.a';
import { cn } from '../../utils/cn';
import { trackLanding } from '../../lib/tracking';

/**
 * Site header: logo, five section links, the primary button, theme toggle and
 * a phone menu.
 *
 * At the top of the landing page it is transparent on the ink hero, so the
 * hero reads as one uninterrupted screen. As soon as the page scrolls it turns
 * solid with one hairline: ink while the hero is under it, then the page tone
 * (white in the light theme, ink in the dark theme). No blur, no shadow.
 *
 * On `/` the links are plain fragment links (#belief), so the browser scrolls
 * and the sections' scroll-margin keeps the heading clear of this bar. On any
 * other route they go to `/#id`, and the effect below scrolls once the landing
 * page has rendered.
 */
const navLinkClass =
  'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-md px-3 text-[15px] font-medium text-mm-body transition-colors duration-150 hover:text-mm-ink';

/**
 * Where the header sits: `overHero` while the landing hero is still under it,
 * `atTop` before the page has scrolled (only then is it transparent).
 */
const useHeaderPosition = (enabled: boolean) => {
  const [position, setPosition] = useState({ overHero: enabled, atTop: true });
  useEffect(() => {
    if (!enabled) {
      setPosition({ overHero: false, atTop: window.scrollY < 8 });
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById('hero');
      const headerHeight = window.innerWidth >= 768 ? 80 : 64;
      const overHero = hero ? hero.getBoundingClientRect().bottom > headerHeight : false;
      const atTop = window.scrollY < 8;
      setPosition((prev) => (prev.overHero === overHero && prev.atTop === atTop ? prev : { overHero, atTop }));
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
  }, [enabled]);
  return position;
};

export const Header: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { overHero, atTop } = useHeaderPosition(isLanding);

  // Arriving on `/#id` from another route: scroll to that section once it exists (retries briefly while the page renders).
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    let tries = 0;
    let timer = 0;
    const scroll = () => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ block: 'start' });
      else if (tries++ < 20) timer = window.setTimeout(scroll, 50);
    };
    timer = window.setTimeout(scroll, 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, location.key]);

  // Close the phone menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Phone menu: focus the first link on open; Escape closes and returns focus to the button.
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const isDark = theme === 'dark';
  // Transparent ink over the top of the hero; solid ink while the hero scrolls
  // under it (or with the menu open there); solid page tone after the hero.
  const inkTone = overHero && atTop && !menuOpen;
  const logoTone: 'dark' | 'light' = isDark || overHero ? 'dark' : 'light';

  /** Link to a section: a real fragment link on `/`, a router link to `/#id` elsewhere. */
  const sectionLink = (hash: string, className: string, children: React.ReactNode, onClick?: () => void) =>
    isLanding ? (
      <a href={hash} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <Link to={`/${hash}`} className={className} onClick={onClick}>
        {children}
      </Link>
    );

  const onCtaClick = () => {
    trackLanding('cta_click', { location: 'header' });
    closeMenu();
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200',
        inkTone
          ? 'mm-tone-navy border-transparent bg-transparent'
          : overHero
            ? 'mm-tone-navy border-mm-line bg-mm-surface'
            : 'mm-tone-white border-mm-line bg-mm-surface'
      )}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6 md:h-20 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center rounded-md" aria-label={headerContent.logoLabel}>
          <MediMindLogo variant="horizontal" size="md" tone={logoTone} />
        </Link>

        <nav aria-label={headerContent.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {headerContent.nav.map((item) => (
              <li key={item.id}>{sectionLink(`#${item.id}`, navLinkClass, item.label)}</li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          {sectionLink(
            primaryCta.href,
            cn(buttonClass('primary'), 'hidden min-h-[44px] whitespace-nowrap px-4 text-[15px] md:inline-flex'),
            primaryCta.label,
            onCtaClick
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? headerContent.themeToLightLabel : headerContent.themeToDarkLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-mm-body transition-colors hover:bg-mm-tint hover:text-mm-ink"
          >
            {isDark ? <Sun className="h-[18px] w-[18px]" aria-hidden="true" /> : <Moon className="h-[18px] w-[18px]" aria-hidden="true" />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? headerContent.menuCloseLabel : headerContent.menuOpenLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-mm-ink transition-colors hover:bg-mm-tint lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="site-menu"
          ref={menuRef}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-mm-line bg-mm-surface lg:hidden"
        >
          <nav aria-label={headerContent.navLabel} className="mx-auto max-w-page px-4 pb-6 pt-1 sm:px-6">
            <ul className="divide-y divide-mm-line">
              {headerContent.nav.map((item) => (
                <li key={item.id}>
                  {sectionLink(
                    `#${item.id}`,
                    '-mx-2 flex min-h-[56px] items-center rounded-md px-2 font-display text-[26px] leading-none tracking-[-0.02em] text-mm-ink',
                    item.label,
                    closeMenu
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              {sectionLink(primaryCta.href, buttonClass('primary', true), primaryCta.label, onCtaClick)}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
