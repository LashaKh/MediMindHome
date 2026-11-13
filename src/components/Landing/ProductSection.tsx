import React from 'react';
import { SectionShell } from '../ui';
import { product as copy } from '../../content/landing.v2.c';
import { ProductTileView } from './ProductPlate';
import { plateGrid } from './ProductPlate.styles';

/**
 * The product (#product, lane C). The headline, one line, then the real
 * screens laid out across the whole grid like prints on a light table:
 * the clinical record large, the other areas around it, each with its
 * name and one short tag. No paragraphs, no status marks.
 */

/**
 * Where each tile sits on wide screens (12 columns), its share of the grid,
 * and (`screen`) its shape below lg, chosen so the capture never runs out.
 */
const LAYOUT: Record<string, { className: string; span: number; screen: string }> = {
  record: { className: 'md:col-span-2 lg:col-span-7 lg:row-span-2', span: 7 / 12, screen: 'max-lg:aspect-[3/2]' },
  lab: { className: 'lg:col-span-5', span: 5 / 12, screen: 'max-lg:aspect-[8/3]' },
  stock: { className: 'lg:col-span-5', span: 5 / 12, screen: 'max-lg:aspect-[2/1]' },
  billing: { className: 'lg:col-span-7', span: 7 / 12, screen: 'max-lg:aspect-[5/2]' },
  management: { className: 'md:col-span-2 lg:col-span-5', span: 5 / 12, screen: 'max-lg:aspect-[4/3]' },
};

export const ProductSection: React.FC = () => (
  <SectionShell id="product" tone="white" labelledBy="product-title">
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
      <h2 id="product-title" className="mm-h2 m-0 text-balance lg:col-span-8">
        {copy.title.map((line) => (
          <span key={line} className="block">
            {line}{' '}
          </span>
        ))}
      </h2>
      <div className="grid gap-3 lg:col-span-4 lg:pb-2">
        <p className="mm-lead m-0 text-pretty">{copy.support}</p>
        <p className="mm-caption m-0 font-mono text-mm-muted">{copy.demoData}</p>
      </div>
    </div>

    <div
      className="mt-10 rounded-[24px] border border-mm-line bg-mm-pale p-3 sm:p-5 md:mt-14 lg:p-6"
      style={plateGrid}
    >
      <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:auto-rows-[clamp(15rem,17vw,21rem)] lg:grid-cols-12 lg:gap-x-5 lg:gap-y-6">
        {copy.tiles.map((tile) => {
          const place = LAYOUT[tile.id];
          return (
            <ProductTileView
              key={tile.id}
              tile={tile}
              span={place.span}
              className={place.className}
              screenClassName={place.screen}
            />
          );
        })}
      </div>
    </div>
  </SectionShell>
);
