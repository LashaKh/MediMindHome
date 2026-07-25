import React from 'react';
import { cn } from '../../utils/cn';

type Variant = 'light' | 'dark' | 'gradient' | 'transparent';

interface SectionShellProps {
  id: string;
  variant?: Variant;
  /** Retained for API compatibility. Ambient blobs were removed in the redesign. */
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
  className,
  innerClassName,
  children,
}) => {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden py-20 sm:py-24 md:py-28 lg:py-32',
        variantClasses[variant],
        className
      )}
    >
      <div className={cn('relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
};
