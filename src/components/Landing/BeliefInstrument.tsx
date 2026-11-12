import React from 'react';
import type { BeliefBeat } from '../../content/landing.v2.b';

/**
 * The night-shift instrument beside the 2 a.m. story. One quiet panel that
 * changes with the beat the reader is on: the clock, the long record with
 * the buried signs, the fourteen hours, the twenty days. Decorative reprise
 * of the text (aria-hidden); every fact is also in the words.
 */

type Visual = BeliefBeat['visual'];

const COLUMNS = 3;
const ROWS = 16;
/** The buried warning signs: far apart in a long history. */
const SIGNS = new Set([5, 22, 41]);

/** Deterministic bar widths, so the record looks the same on every render. */
const widths = Array.from({ length: COLUMNS * ROWS }, (_, i) => {
  const h = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return 30 + Math.round((h - Math.floor(h)) * 66);
});

const bigMarker: Record<Visual, string> = {
  night: '02:00',
  record: '02:00',
  hours: '+14 h',
  days: 'Day 20',
};
const caption: Record<Visual, string> = {
  night: 'Night shift',
  record: 'Patient record',
  hours: 'Signs not yet connected',
  days: 'Days in intensive care',
};

export const BeliefInstrument: React.FC<{ visual: Visual; className?: string }> = ({ visual, className }) => {
  const showSigns = visual !== 'night';
  const recordDim = visual === 'night' ? 0.28 : visual === 'record' ? 0.55 : 0.22;

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-[22px] border border-mm-line p-5 sm:p-7 ${className ?? ''}`}
      style={{ background: 'linear-gradient(180deg, var(--lb-system-wash), transparent)' }}
    >
      <div className="flex items-end justify-between gap-4">
        <span className="lb-mono min-w-0 text-[12px] text-mm-muted sm:text-[13px]">{caption[visual]}</span>
        <span
          key={bigMarker[visual]}
          className="lb-mono shrink-0 whitespace-nowrap text-[34px] font-medium leading-none text-mm-ink sm:text-[56px]"
          style={{ textShadow: '0 0 28px var(--lb-ink-glow)' }}
        >
          {bigMarker[visual]}
        </span>
      </div>

      {/* The long history: three columns of record entries. */}
      <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-[4px] sm:mt-6 sm:gap-y-[7px]">
        {widths.map((w, i) => {
          const sign = SIGNS.has(i);
          const lit = sign && showSigns;
          return (
            <span
              key={i}
              className="block h-[4px] rounded-full transition-[opacity,background-color] duration-700 sm:h-[5px]"
              style={{
                width: `${w}%`,
                backgroundColor: lit ? 'var(--lb-harm)' : 'var(--mm-body)',
                opacity: lit ? 1 : recordDim,
                boxShadow: lit ? '0 0 10px var(--lb-harm)' : undefined,
              }}
            />
          );
        })}
      </div>

      {/* The meter: fourteen hours, then twenty days. */}
      <div className="mt-4 min-h-[30px] sm:mt-7 sm:min-h-[46px]">
        {visual === 'hours' && (
          <div className="flex gap-[5px]">
            {Array.from({ length: 14 }, (_, i) => (
              <span
                key={i}
                className="h-[22px] flex-1 rounded-[4px] transition-opacity duration-500 sm:h-[30px]"
                style={{ backgroundColor: 'var(--lb-harm)', opacity: 0.25 + (i / 13) * 0.75, transitionDelay: `${i * 35}ms` }}
              />
            ))}
          </div>
        )}
        {visual === 'days' && (
          <div className="grid grid-cols-10 gap-[5px]">
            {Array.from({ length: 20 }, (_, i) => (
              <span
                key={i}
                className="h-[12px] rounded-[3px] border sm:h-[18px]"
                style={{ borderColor: 'var(--lb-harm)', backgroundColor: 'var(--lb-harm)', opacity: 0.55 }}
              />
            ))}
          </div>
        )}
        {(visual === 'night' || visual === 'record') && (
          <div className="flex items-center gap-3">
            <span className="lb-heartbeat block h-[9px] w-[9px] rounded-full" style={{ backgroundColor: 'var(--lb-system)' }} />
            <span className="block h-px flex-1" style={{ backgroundColor: 'var(--mm-line)' }} />
          </div>
        )}
      </div>
    </div>
  );
};
