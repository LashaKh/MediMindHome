import React from 'react';
import { cn } from '../../utils/cn';
import { AmbientBlobs } from './ambient-blobs';

type Variant = 'light' | 'dark' | 'gradient' | 'transparent';

interface SectionShellProps {
  id: string;
  variant?: Variant;
  ambient?: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  light: 'bg-white text-slate-900',
  dark: 'bg-surface-page text-text',
  gradient: 'bg-gradient-to-b from-surface-page via-surface-section to-surface-page text-text',
  transparent: 'text-text',
};

export const SectionShell: React.FC<SectionShellProps> = ({
  id,
  variant = 'transparent',
  ambient = false,
  className,
  innerClassName,
  children,
}) => {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28',
        variantClasses[variant],
        className
      )}
    >
      {ambient && <AmbientBlobs />}
      <div className={cn('relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
};
