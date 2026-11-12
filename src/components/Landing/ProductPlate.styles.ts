import type React from 'react';

/** Shared looks for lane C's screen compositions (kept apart so the component files only export components). */

/** Light-table backdrop: a faint drafting grid. */
export const plateGrid: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, color-mix(in srgb, var(--mm-line) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--mm-line) 60%, transparent) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
  backgroundPosition: '-1px -1px',
};

export const liftShadow =
  '0 1px 0 var(--mm-line), 0 30px 60px -30px rgb(8 18 36 / 0.5), 0 12px 24px -14px rgb(8 18 36 / 0.28)';
