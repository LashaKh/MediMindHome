import React from 'react';
import { SectionShell } from '../ui';
import { product as copy } from '../../content/landing.v2.c';
import { HeroScene, OpsTileView } from './ProductPlate';
import { ImagingStage } from './ProductImaging';
import { ProductBridge } from './ProductBridge';
import { cn } from '../../utils/cn';

/**
 * The product (#product, lane C). The headline and one line, then three
 * movements: the imaging display (a CT scan in 3D beside heart-valve
 * planning), the clinical record in front of every hospital area, and a
 * row of operations tiles, then the bridge into the brain (the AI
 * proposing next steps, a doctor deciding). Real screens
 * only, a name and one short tag each, a quiet demo-data note.
 */

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
      <ImagingStage />
    </div>

    <div className="mt-6 lg:mt-8">
      <HeroScene />
    </div>

    {/* Two or three tiles: three share a row on wide screens, two split it */}
    <div className={cn('mt-6 grid gap-5 md:grid-cols-2 lg:mt-8 lg:gap-6', copy.tiles.length > 2 && 'lg:grid-cols-3')}>
      {copy.tiles.map((tile, i) => (
        <OpsTileView
          key={tile.id}
          tile={tile}
          className={cn(i === 2 && 'md:max-lg:col-span-2')}
          windowClassName={cn(i === 2 && 'md:max-lg:w-[66%]')}
        />
      ))}
    </div>

    <div className="mt-6 lg:mt-8">
      <ProductBridge />
    </div>
  </SectionShell>
);
