import React from 'react';
import { SectionShell } from '../ui';
import { product as copy } from '../../content/landing.v2.c';
import { HeroScene, SceneStage } from './ProductPlate';
import { cn } from '../../utils/cn';

/**
 * The product (#product, lane C). The headline, one line, then one large
 * composed scene (the clinical record in front of every hospital area,
 * with two thin callouts on the telling detail), then three supporting
 * scenes: pharmacy and stock, laboratory, billing. Real screens only, a
 * name and one short tag each, a quiet demo-data note.
 */

/** Where each supporting scene sits: its classes and its share of the grid on wide screens. */
const PLACE: Record<string, { className: string; span: number }> = {
  stock: { className: 'md:col-span-2 lg:col-span-7 lg:row-span-2 max-lg:aspect-[16/11] max-md:aspect-[4/5]', span: 7 / 12 },
  lab: { className: 'lg:col-span-5 max-lg:aspect-[5/6] max-md:aspect-[4/5]', span: 5 / 12 },
  billing: { className: 'lg:col-span-5 max-lg:aspect-[5/6] max-md:aspect-[4/5]', span: 5 / 12 },
};

export const ProductSection: React.FC = () => (
  <SectionShell id="product" tone="white" labelledBy="product-title">
    <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
      <h2 id="product-title" className="mm-h2 m-0 text-balance lg:col-span-8">
        {copy.title.map((line, i) => (
          <span key={line} className={cn('block', i === 1 && 'mm-accent-text')}>
            {line}{' '}
          </span>
        ))}
      </h2>
      <div className="grid gap-2 lg:col-span-4 lg:pb-1.5">
        <p className="mm-lead m-0 text-pretty">{copy.support}</p>
        <p className="m-0 font-mono text-[12px] text-mm-muted">{copy.demoData}</p>
      </div>
    </div>

    <div className="mt-10 md:mt-14">
      <HeroScene />
    </div>

    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:mt-6 lg:auto-rows-[clamp(19rem,24vw,22.5rem)] lg:grid-cols-12 lg:gap-6">
      {copy.scenes.map((scene) => {
        const place = PLACE[scene.id];
        return <SceneStage key={scene.id} scene={scene} span={place.span} className={place.className} />;
      })}
    </div>
  </SectionShell>
);
