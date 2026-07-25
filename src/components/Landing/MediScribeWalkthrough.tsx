import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, FileText, Tags, Database, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

const stages = [
  {
    id: 'capture',
    icon: Mic,
    title: 'Capture',
    caption: 'The visit is recorded live — in Georgian or English.',
  },
  {
    id: 'structure',
    icon: FileText,
    title: 'Structure',
    caption: 'AI turns the conversation into a structured clinical note.',
  },
  {
    id: 'code',
    icon: Tags,
    title: 'Code',
    caption: 'Diagnosis codes are generated automatically — no manual lookup.',
  },
  {
    id: 'persist',
    icon: Database,
    title: 'Persist',
    caption: 'Saved to the patient’s record with a full audit trail — government form drafted in parallel.',
  },
] as const;

const Waveform: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex h-24 w-full items-center justify-center gap-1.5">
    {Array.from({ length: 24 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 rounded-full bg-gradient-to-t from-accent to-light-accent"
        animate={active ? { height: [6, 22 + (i % 5) * 8, 12, 30 - (i % 4) * 5, 8] } : { height: 6 }}
        transition={{ duration: 1.2, repeat: active ? Infinity : 0, ease: 'easeInOut', delay: i * 0.05 }}
      />
    ))}
  </div>
);

const SoapCard: React.FC = () => {
  const lines = [
    { tag: 'S', text: '47 y/o male, intermittent chest tightness ×3 weeks…' },
    { tag: 'O', text: 'BP 154/96, HR 92, glucose 11.2 mmol/L (fasting)' },
    { tag: 'A', text: 'Likely uncontrolled hypertension, suspected new T2DM' },
    { tag: 'P', text: 'Start ACEi, fasting lipid panel, HbA1c, follow-up 2w' },
  ];
  return (
    <div className="space-y-2.5">
      {lines.map((line, i) => (
        <motion.div
          key={line.tag}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.25 }}
          className="flex items-start gap-2"
        >
          <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-accent/20 font-mono text-[10px] font-bold text-accent ring-1 ring-accent/30">
            {line.tag}
          </span>
          <p className="text-xs leading-relaxed text-text sm:text-sm">{line.text}</p>
        </motion.div>
      ))}
    </div>
  );
};

const IcdChips: React.FC = () => {
  const codes = [
    { code: 'I10', label: 'Essential hypertension' },
    { code: 'E11.9', label: 'Type 2 diabetes mellitus' },
    { code: 'R07.9', label: 'Chest pain, unspecified' },
  ];
  return (
    <div className="space-y-2">
      {codes.map((c, i) => (
        <motion.div
          key={c.code}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.2 }}
          className="flex items-center gap-3 rounded-md border border-accent/20 bg-accent/5 px-3 py-2"
        >
          <span className="rounded-sm bg-accent/25 px-2 py-0.5 font-mono text-xs font-bold text-secondary dark:text-light-accent">{c.code}</span>
          <span className="text-xs text-text sm:text-sm">{c.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const FhirJson: React.FC = () => {
  const json = `{
  "resourceType": "Composition",
  "status": "final",
  "type": { "coding": [{ "system": "loinc",
    "code": "11506-3", "display": "SOAP" }] },
  "section": [
    { "title": "Assessment",
      "entry": [{ "reference": "Condition/I10" },
                { "reference": "Condition/E11.9" }] }
  ],
  "extension": [{
    "url": "gov-reporting-form",
    "valueReference": { "reference": "DocumentReference/f100-…" }
  }]
}`;
  return (
    <motion.pre
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-x-auto rounded-md border border-success/30 bg-surface-page/80 p-3 text-[10px] leading-relaxed text-success/90 sm:text-xs"
    >
      <code>{json}</code>
    </motion.pre>
  );
};

export const MediScribeWalkthrough: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStage((s) => (s + 1) % stages.length), 4500);
    return () => clearTimeout(t);
  }, [stage, playing]);

  const StageIcon = stages[stage].icon;

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-card">
      {/* console status bar */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-2.5 sm:px-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
          MediScribe · Live simulation
        </span>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
          <span className={cn('h-1.5 w-1.5 rounded-full', playing ? 'animate-pulse bg-success' : 'bg-text-subtle')} />
          {playing ? 'Running' : 'Paused'}
        </span>
      </div>

      {/* segmented steps + live progress */}
      <div className="border-b border-surface-border">
        <div className="flex flex-wrap items-stretch">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const active = stage === i;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setStage(i);
                  setPlaying(false);
                }}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors sm:px-5',
                  active ? 'bg-accent/[0.06] text-accent' : 'text-text-subtle hover:text-text'
                )}
              >
                <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-1 px-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle transition-colors hover:bg-surface-hover hover:text-accent"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => {
                setStage(0);
                setPlaying(true);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle transition-colors hover:bg-surface-hover hover:text-accent"
              aria-label="Restart"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {/* progress segment under the active step (fills over the 4.5s auto-advance) */}
        <div className="relative h-0.5 w-full bg-surface-border/50">
          <motion.div
            key={`${stage}-${playing}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: playing ? 1 : 0 }}
            transition={{ duration: playing ? 4.5 : 0.25, ease: 'linear' }}
            className="absolute top-0 h-full origin-left bg-accent"
            style={{ left: `${(100 / stages.length) * stage}%`, width: `${100 / stages.length}%` }}
          />
        </div>
      </div>

      {/* stage content */}
      <div className="p-5 sm:p-8">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-md border border-accent/30 bg-accent/10 p-2.5 text-secondary dark:text-light-accent">
                <StageIcon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-text sm:text-2xl">{stages[stage].title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-text-muted sm:text-base">{stages[stage].caption}</p>
          </div>

          <div className="min-h-[200px] rounded-lg border border-surface-border bg-surface-page/60 p-5 sm:min-h-[260px] sm:p-6 lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {stage === 0 && <Waveform active={playing} />}
                {stage === 1 && <SoapCard />}
                {stage === 2 && <IcdChips />}
                {stage === 3 && <FhirJson />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
