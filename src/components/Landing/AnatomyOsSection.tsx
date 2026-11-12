import React, { useEffect, useRef, useState } from 'react';
import './BeliefSection.css';
import { SectionShell } from '../ui';
import { anatomy, type LayerId } from '../../content/landing.v2.b';
import { AnatomyOsFigure } from './AnatomyOsFigure';

/**
 * One operating system (#system), lane B. "A hospital with a body made of
 * software": the locked taxonomy, Heart · Brain · Muscle · Skin · Nerve, as
 * an explorable figure beside five always-visible rows. Scrolling lights the
 * row in view; hover, focus or tap on a row (or the figure) takes over.
 */
export const AnatomyOsSection: React.FC = () => {
  const [scrolled, setScrolled] = useState<LayerId>('heart');
  const [pointed, setPointed] = useState<LayerId | null>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const shown = pointed ?? scrolled;

  useEffect(() => {
    const nodes = rowRefs.current.filter((n): n is HTMLLIElement => n !== null);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setScrolled((e.target as HTMLElement).dataset.layer as LayerId);
        }
      },
      { rootMargin: '-50% 0px -40% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <SectionShell id="system" tone="navy" labelledBy="system-title" className="lb-scope">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
        <h2 id="system-title" className="mm-h2 max-w-[14ch]">
          {anatomy.title}
        </h2>
        <p className="mm-lead max-w-[44ch]">{anatomy.support}</p>
      </div>

      <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* The figure: sticky so it stays in view while the rows scroll. */}
        <div className="sticky top-16 z-10 -mx-4 bg-mm-surface px-4 pb-3 pt-2 sm:-mx-6 sm:px-6 md:top-20 lg:static lg:mx-0 lg:bg-transparent lg:p-0">
          <div className="lg:sticky lg:top-[calc(50vh-300px)]">
            <AnatomyOsFigure
              active={shown}
              onHover={setPointed}
              onPick={(id) => {
                setScrolled(id);
                setPointed(null);
              }}
              className="mx-auto h-[30svh] max-h-[560px] lg:max-h-none min-h-[220px] w-full md:h-[44svh] lg:h-[600px]"
            />
            <p className="mm-caption mt-3 hidden text-center lg:block">{anatomy.interactHint}</p>
          </div>
        </div>

        <ol className="flex flex-col gap-3" onMouseLeave={() => setPointed(null)}>
          {anatomy.layers.map((layer, i) => {
            const isOn = shown === layer.id;
            return (
              <li
                key={layer.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-layer={layer.id}
                onMouseEnter={() => setPointed(layer.id)}
                className="lb-row rounded-[14px] border p-5 transition-[background-color,border-color] duration-300 sm:p-7"
                style={{
                  borderColor: isOn ? 'var(--lb-system)' : 'var(--mm-line)',
                  backgroundColor: isOn ? 'var(--lb-system-wash)' : 'transparent',
                }}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="lb-serif text-[32px] leading-none sm:text-[40px]">
                    <button
                      type="button"
                      className="lb-row-btn text-left transition-colors duration-300"
                      style={{ color: isOn ? 'var(--mm-ink)' : 'var(--mm-muted)' }}
                      aria-pressed={isOn}
                      onFocus={() => setPointed(layer.id)}
                      onBlur={() => setPointed(null)}
                      onClick={() => {
                        setScrolled(layer.id);
                        setPointed(null);
                      }}
                    >
                      {layer.name}
                    </button>
                  </h3>
                  <span className="lb-mono text-sm text-mm-link">{layer.verb}</span>
                  {layer.status && (
                    <span className="mm-dev-badge">{layer.status}</span>
                  )}
                </div>
                <p className="mm-lead mt-4 text-mm-ink">{layer.is}</p>
                <p className="mm-body mt-2 max-w-[58ch]">{layer.means}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-mm-line pt-10 md:mt-24">
        <p className="lb-serif text-[22px] text-mm-ink sm:text-[28px] lg:text-[32px]">{anatomy.memoryLine}</p>
        <p className="mm-caption">{anatomy.closing}</p>
      </div>
    </SectionShell>
  );
};
