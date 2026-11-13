import React from 'react';
import { Link } from 'react-router-dom';
import { MediMindLogo } from '../ui/MediMindLogo';
import { footerV2 as footer } from '../../content/landing.v2.lane-d';
import { dDisplay, dEdge, dMono } from '../Landing/laneD.styles';
import { cn } from '../../utils/cn';

const linkClass =
  'inline-flex min-h-[44px] items-center text-mm-body underline-offset-4 transition-colors hover:text-mm-ink hover:underline';

/**
 * Footer: the navy tone continues from #contact (daylight in the light
 * theme, the ink canvas in the dark theme). The logo follows the theme. The company line in the display voice, the FHIR line in the
 * system voice, four links (44px targets), copyright.
 */
export const Footer: React.FC = () => (
  <footer className="mm-tone-navy bg-mm-surface text-mm-body">
    <div className={dEdge}>
      <div className="flex flex-col gap-10 border-t border-mm-line py-12 md:flex-row md:items-end md:justify-between md:py-16">
        <div>
          <MediMindLogo variant="icon" size="md" />
          <p className={cn(dDisplay, 'mt-6 text-[1.625rem] leading-tight text-mm-ink md:text-[1.875rem]')}>
            {footer.line.map((sentence, i) => (
              <span key={sentence} className="block sm:inline">
                {i > 0 && <span className="hidden sm:inline"> </span>}
                {sentence}
              </span>
            ))}
          </p>
          <p className={cn(dMono, 'mt-2 text-mm-muted')}>{footer.secondLine}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 text-[0.9375rem] md:justify-end">
            {footer.links.map((link) => {
              const external = /^https?:\/\//.test(link.href);
              return (
                <li key={link.label}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={linkClass}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mm-caption mt-3 md:text-right">{footer.copyright(new Date().getFullYear())}</p>
        </nav>
      </div>
    </div>
  </footer>
);
