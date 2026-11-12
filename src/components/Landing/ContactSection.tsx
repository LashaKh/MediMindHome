import React from 'react';
import { ScopingForm } from '../Demo/ScopingForm';
import { ask, foundersPhoto } from '../../content/landing.v2.lane-d';
import { dEdge, dH2, dMono } from './laneD.styles';
import { cn } from '../../utils/cn';

/**
 * The ask: heading, who the visitor meets (two faces cropped from the real
 * founders photo), what they leave with, and the form. Shared by #contact
 * and /request-demo (which needs the heading as its h1). Ink canvas, so the
 * page ends in the same night it began in.
 */
interface ContactContentProps {
  headingAs: 'h1' | 'h2';
  headingId: string;
  location: 'final' | 'request-demo';
  backHref: string;
}

/** Face crops from team-founders (900 x 846): left/top offsets for a 56px circle. */
const FACES = [
  { name: 'Dr. Lasha Khoshtaria', left: -17, top: -6 },
  { name: 'Irakli Pkhovelishvili', left: -103, top: 0 },
];

const Faces: React.FC = () => (
  <span className="flex shrink-0 -space-x-3" aria-hidden="true">
    {FACES.map((face) => (
      <span
        key={face.name}
        className="relative block h-14 w-14 overflow-hidden rounded-full bg-mm-tint ring-2 ring-[var(--mm-surface)]"
      >
        <img
          src={foundersPhoto.fallback}
          alt=""
          width={180}
          height={169}
          loading="lazy"
          decoding="async"
          className="absolute max-w-none"
          style={{ width: 180, height: 169, left: face.left, top: face.top }}
        />
      </span>
    ))}
  </span>
);

export const ContactContent: React.FC<ContactContentProps> = ({ headingAs: Heading, headingId, location, backHref }) => (
  <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
    <div className="lg:col-span-6 lg:pr-4">
      <Heading id={headingId} className={dH2}>
        {ask.title}
      </Heading>

      <div className="mt-8 flex items-center gap-4">
        <Faces />
        <p className="mm-body text-pretty">
          {ask.support} <span className="text-mm-ink">{ask.withLine}.</span>
        </p>
      </div>

      <div className="mt-10 border-t border-mm-line pt-6">
        <p className={cn(dMono, 'text-mm-muted')}>{ask.leaveTitle}</p>
        <ul className="mt-4 space-y-3">
          {ask.leave.map((item) => (
            <li key={item} className="mm-body flex gap-3 text-mm-ink">
              <span className="mt-[0.6em] h-px w-4 shrink-0 bg-mm-accent" aria-hidden="true" />
              <span className="text-pretty">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mm-body mt-6">{ask.commitment}</p>
      </div>
    </div>

    <div className="lg:col-span-6">
      <ScopingForm location={location} backHref={backHref} />
    </div>
  </div>
);

/** Final call to action with the form. Keep id="contact": primaryCta and the sticky bar point here. */
export const ContactSection: React.FC = () => (
  <section
    id="contact"
    aria-labelledby="contact-title"
    className="mm-tone-navy relative scroll-mt-16 bg-mm-surface text-mm-body md:scroll-mt-20"
  >
    <div className={dEdge}>
      <div className="border-t border-mm-line py-20 md:py-28">
        <ContactContent headingAs="h2" headingId="contact-title" location="final" backHref="#hero" />
      </div>
    </div>
  </section>
);
