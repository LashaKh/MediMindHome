import React, { useState } from 'react';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { anatomy, type LayerId } from '../../content/landing.v2.b';
import { AnatomyOsFigure } from './AnatomyOsFigure';

/**
 * One operating system (#system), lane B. "A hospital with a body made of
 * software": the headline beside the figure, then the locked taxonomy,
 * Heart · Brain · Muscle · Skin · Nerve, as five columns across the page.
 * Hover, focus or tap on a part (or the figure) lights it in the body; with
 * nothing chosen the whole body is lit.
 */
export const AnatomyOsSection: React.FC = () => {
  const [picked, setPicked] = useState<LayerId | null>(null);
  const [pointed, setPointed] = useState<LayerId | null>(null);
  const shown = pointed ?? picked;
  const toggle = (id: LayerId) => {
    setPicked((cur) => (cur === id ? null : id));
    setPointed(null);
  };

  return (
    <SectionShell id="system" tone="navy" labelledBy="system-title" className="lb-scope">
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <h2 id="system-title" className="mm-h2 max-w-[18ch] lg:col-span-7">
          {anatomy.title}
        </h2>
        <AnatomyOsFigure
          active={shown}
          onHover={setPointed}
          onPick={toggle}
          className="mx-auto h-[260px] w-full sm:h-[360px] lg:col-span-5 lg:h-[420px]"
        />
      </div>

      <ol
        className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5"
        onMouseLeave={() => setPointed(null)}
      >
        {anatomy.layers.map((layer) => {
          const isOn = shown === layer.id;
          return (
            <li
              key={layer.id}
              onMouseEnter={() => setPointed(layer.id)}
              className="lb-row flex flex-col gap-2 rounded-[14px] border p-4 transition-[background-color,border-color] duration-300 sm:p-5 lg:gap-3 lg:p-6"
              style={{
                borderColor: isOn ? 'var(--lb-system)' : 'var(--mm-line)',
                backgroundColor: isOn ? 'var(--lb-system-wash)' : 'transparent',
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="lb-serif text-[26px] leading-none text-mm-ink sm:text-[32px] lg:text-[36px]">
                  <button
                    type="button"
                    className="lb-row-btn text-left"
                    aria-pressed={picked === layer.id}
                    onFocus={() => setPointed(layer.id)}
                    onBlur={() => setPointed(null)}
                    onClick={() => toggle(layer.id)}
                  >
                    {layer.name}
                  </button>
                </h3>
                <span className="lb-mono text-sm text-mm-link">{layer.verb}</span>
              </div>
              <p className="mm-body text-mm-ink">{layer.line}</p>
              {layer.status && <span className="mm-dev-badge self-start">{layer.status}</span>}
            </li>
          );
        })}
      </ol>
    </SectionShell>
  );
};
