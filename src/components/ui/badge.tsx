import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-navy',
  {
    variants: {
      variant: {
        default: 'bg-accent/15 text-accent border border-accent/30',
        secondary: 'bg-secondary/15 text-light-accent border border-secondary/30',
        outline: 'border border-surface-border text-text-muted hover:bg-surface-hover',
        success: 'bg-success/15 text-success border border-success/30',
        warning: 'bg-warning/15 text-warning border border-warning/30',
        info: 'bg-accent/15 text-accent border border-accent/30',
        destructive: 'bg-error/15 text-error border border-error/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
