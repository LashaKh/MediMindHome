import React from 'react';
import { belief } from '../../content/landing.v2.b';

/**
 * Reactive hospital beside proactive hospital. The small figures reprise the
 * story's record: on the left the signs stay scattered and the software waits
 * for a question; on the right the system has gathered what is missing into
 * one prepared item, and the warm mark is the person who decides.
 */
export const BeliefContrast: React.FC = () => {
  const { reactive, proactive } = belief;
  return (
    <div className="mt-24 grid gap-px overflow-hidden rounded-[24px] border border-mm-line md:mt-32 md:grid-cols-2" style={{ backgroundColor: 'var(--mm-line)' }}>
      {/* Reactive */}
      <div className="flex flex-col bg-mm-surface p-6 sm:p-10">
        <p className="mm-caption">{reactive.status}</p>
        <p className="lb-serif mt-2 text-[28px] text-mm-ink sm:text-[34px]">{reactive.label}</p>
        <ReactiveFigure note={reactive.figureNote} />
        <ul className="mt-auto flex flex-col gap-3 pt-8">
          {reactive.lines.map((line) => (
            <li key={line} className="lb-serif flex gap-3 text-[20px] text-mm-body sm:text-[24px]">
              <span aria-hidden="true" className="mt-[0.62em] block h-[2px] w-4 shrink-0" style={{ backgroundColor: 'var(--mm-muted)' }} />
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Proactive */}
      <div
        className="relative flex flex-col bg-mm-surface p-6 sm:p-10"
        style={{ backgroundImage: 'radial-gradient(80% 60% at 70% 30%, var(--lb-system-wash), transparent 70%)' }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="mm-caption">{proactive.status}</p>
          <span className="mm-dev-badge">{proactive.marker}</span>
        </div>
        <p className="lb-serif mt-2 text-[28px] text-mm-ink sm:text-[34px]">{proactive.label}</p>
        <ProactiveFigure note={proactive.figureNote} decision={proactive.figureDecision} />
        <ul className="mt-auto flex flex-col gap-3 pt-8">
          {proactive.lines.map((line, i) => (
            <li key={line} className="lb-serif flex gap-3 text-[20px] text-mm-ink sm:text-[24px]">
              <span
                aria-hidden="true"
                className="mt-[0.62em] block h-[2px] w-4 shrink-0"
                style={{ backgroundColor: i === proactive.lines.length - 1 ? 'var(--lb-human)' : 'var(--lb-system)' }}
              />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RECORD = [62, 88, 45, 74, 93, 51, 68, 80, 40, 71, 86, 57];
const SCATTERED = new Set([1, 6, 10]);

const ReactiveFigure: React.FC<{ note: string }> = ({ note }) => (
  <div aria-hidden="true" className="mt-8">
    <div className="flex flex-col gap-[7px]">
      {RECORD.map((w, i) => (
        <span
          key={i}
          className="block h-[5px] rounded-full"
          style={{
            width: `${w}%`,
            backgroundColor: SCATTERED.has(i) ? 'var(--lb-harm)' : 'var(--mm-body)',
            opacity: SCATTERED.has(i) ? 0.75 : 0.22,
          }}
        />
      ))}
    </div>
    <p className="lb-mono mt-6 flex items-center gap-1 text-[13px] text-mm-muted">
      <span>&gt;</span>
      <span className="lb-cursor inline-block h-[14px] w-[7px]" style={{ backgroundColor: 'var(--mm-muted)' }} />
      <span className="ml-2">{note}</span>
    </p>
  </div>
);

const ProactiveFigure: React.FC<{ note: string; decision: string }> = ({ note, decision }) => (
  <div aria-hidden="true" className="mt-8">
    <div
      className="rounded-[14px] border p-4"
      style={{ borderColor: 'var(--lb-system)', boxShadow: '0 18px 50px -20px var(--lb-ink-glow)' }}
    >
      <p className="mm-mark-system">{note}</p>
      <div className="mt-3 flex flex-col gap-[7px]">
        {[78, 64, 86].map((w) => (
          <span key={w} className="block h-[5px] rounded-full" style={{ width: `${w}%`, backgroundColor: 'var(--lb-system)' }} />
        ))}
      </div>
      <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--mm-line)' }}>
        <span className="mm-mark-human">{decision}</span>
      </div>
    </div>
    <div className="mt-4 flex flex-col gap-[7px] opacity-40">
      {[70, 52, 81].map((w) => (
        <span key={w} className="block h-[5px] rounded-full" style={{ width: `${w}%`, backgroundColor: 'var(--mm-body)', opacity: 0.5 }} />
      ))}
    </div>
  </div>
);
