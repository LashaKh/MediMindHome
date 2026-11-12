import React from 'react';
import { Link } from 'react-router-dom';
import { MediMindLogo } from '../ui/MediMindLogo';
import { footer } from '../../content/landing.trust';

const linkClass =
  'inline-flex min-h-[44px] items-center text-mm-link underline-offset-4 transition-colors hover:text-mm-ink hover:underline';

export const Footer: React.FC = () => (
  <footer className="mm-tone-white border-t border-mm-line bg-mm-surface py-10">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
      <div className="flex items-start gap-3">
        <MediMindLogo variant="icon" size="sm" />
        <div>
          <p className="mm-caption font-semibold text-mm-ink">{footer.line}</p>
          <p className="mm-caption">{footer.secondLine}</p>
        </div>
      </div>
      <div className="md:text-right">
        <ul className="mm-caption flex flex-wrap gap-x-6 md:justify-end">
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
        <p className="mm-caption mt-2">{footer.copyright(new Date().getFullYear())}</p>
      </div>
    </div>
  </footer>
);
