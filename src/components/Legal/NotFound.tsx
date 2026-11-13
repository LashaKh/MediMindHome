import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionShell, buttonClass } from '../ui';

/**
 * Shown for any unknown address. Netlify answers every path with the app shell
 * (status 200), so this page also tells search engines not to index it.
 */
export const NotFound: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Page not found · MediMind';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <SectionShell id="not-found" tone="white" narrow labelledBy="not-found-title" innerClassName="min-h-[50vh]">
      <p className="mm-eyebrow">404</p>
      <h1 id="not-found-title" className="mm-h2 mt-3">
        This page does not exist.
      </h1>
      <p className="mm-lead mt-4">The address may be mistyped, or the page has moved.</p>
      <Link to="/" className={`${buttonClass('primary')} mt-8 inline-flex`}>
        Back to the home page
      </Link>
    </SectionShell>
  );
};
