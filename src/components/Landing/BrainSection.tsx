import React from 'react';
import { SectionShell } from '../ui';
import { brain as copy } from '../../content/landing.v2.c';
import { CroppedShot } from './ProductPlate';
import { liftShadow } from './ProductPlate.styles';
import { BrainDial } from './BrainDial';

/**
 * The proactive hospital (#brain, lane C), on the ink canvas.
 * 1. What AI does today: drafts, and a person signs (real screen).
 * 2. Next, in development: AI workers preparing work in the staff inbox.
 * 3. The autonomy dial: six steps, the fixed signature line, three limits
 *    that never move and one off switch.
 * Blue is the system working; amber is a person deciding (v2 design language).
 */

const DevBadge: React.FC = () => <span className="mm-dev-badge">{copy.chip}</span>;

export const BrainSection: React.FC = () => {
  const { today, inbox, dial } = copy;

  return (
    <SectionShell id="brain" tone="navy" labelledBy="brain-title">
      {/* ── Opening ─────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2">
            <DevBadge />
            <span className="mm-eyebrow">{copy.label}</span>
          </p>
          <h2 id="brain-title" className="mm-h2 m-0 mt-6">
            {copy.title.map((line) => (
              <span key={line} className="block">
                {line}{' '}
              </span>
            ))}
          </h2>
        </div>
        <p className="mm-lead m-0 max-w-xl lg:col-span-4">{copy.support}</p>
      </div>

      {/* ── 1. Today ────────────────────────────────────── */}
      <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h3 className="mm-h3 m-0 text-balance">{today.title}</h3>
          <ul className="m-0 mt-8 grid list-none gap-6 p-0">
            {today.items.map((item, i) => {
              const human = i === today.items.length - 1;
              return (
                <li key={item.title} className="grid gap-1.5 border-t border-mm-line pt-4">
                  <span className={human ? 'mm-mark-human' : 'mm-mark-system'}>{item.title}</span>
                  <p className="mm-body m-0">{item.body}</p>
                </li>
              );
            })}
          </ul>
          <p className="mm-caption m-0 mt-8 max-w-md">{today.status}</p>
        </div>

        <figure className="m-0 lg:col-span-7 lg:self-center">
          <div className="relative rounded-[18px] border border-mm-line bg-mm-raised p-3 sm:p-5">
            <div className="overflow-hidden rounded-[10px] bg-white" style={{ boxShadow: liftShadow }}>
              <CroppedShot
                image={today.image}
                crop={today.focus}
                sizes={`(min-width: 1024px) ${Math.round(640 / today.focus.w)}px, ${Math.round(94 / today.focus.w)}vw`}
              />
            </div>
          </div>
          <figcaption className="mm-caption mt-4">{today.caption}</figcaption>
        </figure>
      </div>

      {/* ── 2. Next: the inbox ──────────────────────────── */}
      <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <DevBadge />
          <h3 className="mm-h3 m-0 mt-5 text-balance">{inbox.title}</h3>
          <p className="mm-body m-0 mt-4 max-w-md">{inbox.body}</p>
        </div>

        <figure className="m-0 lg:col-span-8">
          <div className="overflow-hidden rounded-[14px] border border-mm-line bg-mm-raised">
            <div className="flex items-center justify-between gap-4 border-b border-mm-line px-5 py-3.5 sm:px-6">
              <span className="mm-data text-mm-ink">{inbox.header}</span>
              <span className="mm-data text-mm-muted">{inbox.tag}</span>
            </div>
            <ul className="m-0 list-none p-0">
              {inbox.items.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-3 border-b border-mm-line px-5 py-5 last:border-b-0 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8"
                >
                  <div className="min-w-0">
                    <span className="mm-mark-system">{item.worker}</span>
                    <p className="m-0 mt-2 text-[1.0625rem] font-semibold leading-snug text-mm-ink">{item.title}</p>
                    <p className="mm-body m-0 mt-1">{item.body}</p>
                  </div>
                  <span className="mm-mark-human md:justify-self-end">{item.release}</span>
                </li>
              ))}
            </ul>
          </div>
          <figcaption className="sr-only">{inbox.tag}</figcaption>
        </figure>
      </div>

      {/* ── 3. The dial ─────────────────────────────────── */}
      <div className="relative mt-24 overflow-hidden rounded-[28px] border border-mm-line bg-mm-raised px-4 py-12 sm:px-8 md:mt-32 md:px-12 md:py-16 lg:px-16 lg:py-20">
        <div className="relative">
          <BrainDial
            intro={
              <>
                <DevBadge />
                <h3 className="m-0 mt-5 font-display text-[clamp(2rem,1.3rem+2.4vw,3rem)] font-normal leading-[1.05] tracking-[-0.025em] text-mm-ink">
                  {dial.title}
                </h3>
                <p className="mm-body m-0 mt-4 max-w-md">{dial.body}</p>
              </>
            }
          />
        </div>
      </div>
    </SectionShell>
  );
};
