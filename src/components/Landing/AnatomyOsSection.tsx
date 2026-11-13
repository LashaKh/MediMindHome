import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { anatomy, type LayerId } from '../../content/landing.v2.b';
import { AnatomyOsOrganism } from './AnatomyOsOrganism';

/**
 * One operating system (#system), lane B. "A hospital with a body made of
 * software": the headline and a legend of the five parts on the left, the
 * body itself large on the right (on a phone: headline, body, legend).
 * The legend keeps Heart · Brain · Muscle · Skin · Nerve visible and
 * keyboard reachable; hover, focus or tap on a name or on the body lights
 * that part and opens its one line. With nothing chosen the whole body is lit.
 */
export const AnatomyOsSection: React.FC = () => {
  const reduce = !!useReducedMotion();
  const [picked, setPicked] = useState<LayerId | null>(null);
  const [pointed, setPointed] = useState<LayerId | null>(null);
  const shown = pointed ?? picked;
  const toggle = (id: LayerId) => {
    setPicked((cur) => (cur === id ? null : id));
    setPointed(null);
  };

  return (
    <SectionShell id="system" tone="navy" labelledBy="system-title" className="lb-scope overflow-hidden">
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10 [&>*]:min-w-0">
        <h2 id="system-title" className="mm-h2 max-w-[20ch] lg:col-span-5 lg:row-start-1 lg:self-end">
          {anatomy.title}
        </h2>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <AnatomyOsOrganism
            active={shown}
            still={reduce}
            onHover={setPointed}
            onPick={toggle}
            className="mx-auto aspect-square w-[calc(100%+24px)] max-w-[820px] -translate-x-3 sm:w-full sm:translate-x-0 lg:-my-6 xl:w-[calc(100%+48px)] xl:max-w-none"
          />
        </div>

        {/* min-height keeps room for one open line, so nothing above it moves. */}
        <ul className="lg:col-span-5 lg:row-start-2 lg:min-h-[360px] lg:self-start" onMouseLeave={() => setPointed(null)}>
          {anatomy.layers.map((layer) => {
            const isOn = shown === layer.id;
            const quiet = shown !== null && !isOn;
            return (
              <li
                key={layer.id}
                onMouseEnter={() => setPointed(layer.id)}
                className="lb-row border-t border-mm-line last:border-b"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-[2px] origin-left bg-[var(--lb-system)] transition-transform duration-500"
                  style={{ width: '100%', transform: `scaleX(${isOn ? 1 : 0})` }}
                />
                <h3 className="flex min-h-[60px] flex-wrap items-center gap-x-4 gap-y-1 py-3">
                  <LayerGlyph id={layer.id} on={isOn} />
                  <button
                    type="button"
                    className="lb-row-btn lb-serif text-left text-[24px] leading-none transition-colors duration-300 lg:text-[28px]"
                    style={{ color: quiet ? 'var(--mm-muted)' : 'var(--mm-ink)' }}
                    aria-pressed={picked === layer.id}
                    aria-expanded={isOn}
                    onFocus={() => setPointed(layer.id)}
                    onBlur={() => setPointed(null)}
                    onClick={() => toggle(layer.id)}
                  >
                    {layer.name}
                  </button>
                  <span className="lb-mono text-[13px] text-mm-link">{layer.verb}</span>
                  {layer.status && <span className="mm-dev-badge max-sm:ml-11 sm:ml-auto lg:ml-11 xl:ml-auto">{layer.status}</span>}
                </h3>
                <div className="lb-legend-line" data-open={isOn}>
                  <div>
                    <p className="mm-body pb-4 pl-11 text-mm-ink">{layer.line}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
};

/** A small mark per part, drawn in the same language as the body. */
const LayerGlyph: React.FC<{ id: LayerId; on: boolean }> = ({ id, on }) => {
  const s = 'var(--lb-system)';
  return (
    <svg
      viewBox="-14 -14 28 28"
      className="h-7 w-7 shrink-0 transition-opacity duration-300"
      style={{ opacity: on ? 1 : 0.7 }}
      aria-hidden="true"
      fill="none"
      stroke={s}
    >
      {id === 'heart' && (
        <>
          <circle r="3.2" fill={s} stroke="none" />
          <circle r="7" strokeWidth="1.2" />
          <circle r="11" strokeWidth="0.9" strokeOpacity="0.55" />
        </>
      )}
      {id === 'brain' && (
        <>
          <path d="M0 -11 A11 11 0 1 1 -10.4 3.6" strokeWidth="1.3" />
          <path d="M-10.4 3.6 A11 11 0 0 1 0 -11" strokeWidth="1.3" strokeDasharray="1.5 2.5" />
          <path d="M0 0 L0 -11" strokeWidth="1.3" />
          <circle cy="-11" r="2.4" fill={s} stroke="none" />
        </>
      )}
      {id === 'muscle' && (
        <g strokeWidth="1.6" strokeLinecap="round">
          {Array.from({ length: 12 }, (_, i) => i * 30)
            .filter((d) => d !== 120)
            .map((d) => {
              const a = (d * Math.PI) / 180;
              return <path key={d} d={`M${6 * Math.sin(a)} ${-6 * Math.cos(a)} L${11 * Math.sin(a)} ${-11 * Math.cos(a)}`} />;
            })}
        </g>
      )}
      {id === 'skin' && (
        <>
          <circle r="11" strokeWidth="1.3" />
          <circle r="7.5" strokeWidth="0.8" strokeOpacity="0.55" />
          <circle cx="7.8" cy="-7.8" r="2.8" fill="var(--lb-human)" stroke="none" />
        </>
      )}
      {id === 'nerve' && (
        <>
          <path d="M-11 9 C-4 9 -4 -9 4 -9 L11 -9" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="-1" cy="0" r="2.6" fill={s} stroke="none" />
        </>
      )}
    </svg>
  );
};
