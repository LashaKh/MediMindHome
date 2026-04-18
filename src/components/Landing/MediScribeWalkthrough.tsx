import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, FileText, Tags, Database, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

const stages = [
  {
    id: 'capture',
    icon: Mic,
    title: 'Capture',
    caption: 'Live consultation, dual-STT race: Enagram (fast) vs. Google Chirp 2 (accurate). Fastest valid result wins.',
  },
  {
    id: 'structure',
    icon: FileText,
    title: 'Structure',
    caption: 'Gemini 2.0 Flash structures the transcript into Subjective / Objective / Assessment / Plan with confidence scoring.',
  },
  {
    id: 'code',
    icon: Tags,
    title: 'Code',
    caption: 'ICD-10 codes generated directly, not narrative prose: I10 — Essential hypertension, E11.9 — Type 2 diabetes.',
  },
  {
    id: 'persist',
    icon: Database,
    title: 'Persist',
    caption: 'Composable FHIR. Provenance logged. Form 100/ა drafted in parallel. Ready to submit to MOH.',
  },
] as const;

const Waveform: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex h-24 w-full items-center justify-center gap-1.5">
    {Array.from({ length: 24 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 rounded-full bg-gradient-to-t from-accent to-light-accent"
        animate={
          active
            ? { height: [6, 22 + (i % 5) * 8, 12, 30 - (i % 4) * 5, 8] }
            : { height: 6 }
        }
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
          <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-accent/20 text-[10px] font-bold text-accent ring-1 ring-accent/30">
            {line.tag}
          </span>
          <p className="text-xs sm:text-sm text-text leading-relaxed">{line.text}</p>
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
          className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2"
        >
          <span className="rounded bg-accent/25 px-2 py-0.5 text-xs font-bold text-secondary dark:text-light-accent">{c.code}</span>
          <span className="text-xs sm:text-sm text-text">{c.label}</span>
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
    "url": "moh-form-100",
    "valueReference": { "reference": "DocumentReference/f100-…" }
  }]
}`;
  return (
    <motion.pre
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-success/30 bg-surface-page/80 p-3 text-[10px] sm:text-xs text-success/90 leading-relaxed overflow-x-auto"
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
    <div className="rounded-3xl border border-surface-border bg-gradient-to-br from-surface-card/80 to-surface-page/80 p-5 sm:p-8 backdrop-blur-md">
      {/* Stage tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => {
                setStage(i);
                setPlaying(false);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors',
                stage === i
                  ? 'bg-accent/20 text-secondary dark:text-light-accent ring-1 ring-accent/40'
                  : 'text-text-subtle hover:text-text'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>
                <span className="text-text-subtle mr-1">{i + 1}.</span>
                {s.title}
              </span>
            </button>
          );
        })}
        <div className="ml-1 flex items-center gap-1">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-subtle hover:bg-surface-hover hover:text-accent"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => {
              setStage(0);
              setPlaying(true);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-subtle hover:bg-surface-hover hover:text-accent"
            aria-label="Restart"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stage content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-xl bg-gradient-to-br from-accent/30 to-secondary/20 p-2.5 ring-1 ring-accent/30">
              <StageIcon className="h-5 w-5 text-secondary dark:text-light-accent" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-text">{stages[stage].title}</h3>
          </div>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">{stages[stage].caption}</p>
        </div>

        <div className="lg:col-span-3 min-h-[200px] sm:min-h-[260px] rounded-2xl border border-surface-border bg-surface-page/60 p-5 sm:p-6">
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
  );
};
