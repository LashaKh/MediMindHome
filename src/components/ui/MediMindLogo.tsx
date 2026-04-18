import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../hooks/useTheme';

type Variant = 'icon' | 'wordmark' | 'horizontal' | 'vertical';
type Size = 'sm' | 'md' | 'lg' | 'hero';

interface MediMindLogoProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  /**
   * Override the gradient. When omitted, the tone follows the current theme:
   * dark theme → bright accent ramp; light theme → navy-to-accent ramp
   * (brandbook light-background logo).
   */
  tone?: 'dark' | 'light';
}

/**
 * MediMind brand mark — Platform Stack (four bars) + wordmark.
 *
 * Source of truth: `medimind-brand/01-logo/svg/`. The horizontal variant is
 * composed in React (icon SVG + HTML text) rather than as one big SVG so
 * proportions track the text font-size — icon height = 0.95em, perfectly
 * balanced against the bold wordmark at every display size.
 *
 * Variants:
 * - `icon`        — just the four-bar Platform Stack (square)
 * - `wordmark`    — "MediMind" text only
 * - `horizontal`  — icon-left + wordmark-right (header / hero / footer)
 * - `vertical`    — icon-top + wordmark-below (splash / cover)
 */
export const MediMindLogo: React.FC<MediMindLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className,
  tone,
}) => {
  const theme = useTheme((s) => s.theme);
  const effectiveTone: 'dark' | 'light' = tone ?? (theme === 'dark' ? 'dark' : 'light');

  const gradId = React.useId().replace(/:/g, '');
  const stackGrad = `mml-stack-${gradId}`;
  const wordGrad = `mml-word-${gradId}`;

  const stops =
    effectiveTone === 'dark'
      ? { from: '#3182ce', mid: '#7eb6e3', to: '#bee3f8' }
      : { from: '#1a365d', mid: '#2b6cb0', to: '#3182ce' };

  const mediColor = effectiveTone === 'dark' ? '#e2e8f0' : '#1a365d';

  // Inline icon SVG renderer — viewBox cropped to bars area exactly.
  // Bars: y=14..88 (74 tall), x=0..100 (100 wide) → tight 100×74, aspect 1.35:1
  // No empty padding: icon visible height = SVG height, sized via em units.
  const renderIconSvg = (heightClass: string) => (
    <svg
      viewBox="0 14 100 74"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      className={cn('w-auto flex-shrink-0', heightClass)}
    >
      <defs>
        <linearGradient id={stackGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={stops.from} />
          <stop offset="50%" stopColor={stops.mid} />
          <stop offset="100%" stopColor={stops.to} />
        </linearGradient>
      </defs>
      <rect x="0" y="14" width="100" height="14" rx="3" fill={`url(#${stackGrad})`} />
      <rect x="0" y="34" width="100" height="14" rx="3" fill={`url(#${stackGrad})`} opacity="0.78" />
      <rect x="0" y="54" width="100" height="14" rx="3" fill={`url(#${stackGrad})`} opacity="0.55" />
      <rect x="0" y="74" width="100" height="14" rx="3" fill={`url(#${stackGrad})`} opacity="0.32" />
    </svg>
  );

  // Stand-alone icon (square viewBox)
  if (variant === 'icon') {
    const heightByIconSize: Record<Size, string> = {
      sm: 'h-5',
      md: 'h-7',
      lg: 'h-9',
      hero: 'h-12',
    };
    return (
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="MediMind"
        className={cn('w-auto', heightByIconSize[size], className)}
      >
        <defs>
          <linearGradient id={stackGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stops.from} />
            <stop offset="50%" stopColor={stops.mid} />
            <stop offset="100%" stopColor={stops.to} />
          </linearGradient>
        </defs>
        <rect x="6" y="14" width="88" height="14" rx="3" fill={`url(#${stackGrad})`} />
        <rect x="6" y="34" width="88" height="14" rx="3" fill={`url(#${stackGrad})`} opacity="0.78" />
        <rect x="6" y="54" width="88" height="14" rx="3" fill={`url(#${stackGrad})`} opacity="0.55" />
        <rect x="6" y="74" width="88" height="14" rx="3" fill={`url(#${stackGrad})`} opacity="0.32" />
      </svg>
    );
  }

  // Wordmark only (svg)
  if (variant === 'wordmark') {
    const heightByWordSize: Record<Size, string> = {
      sm: 'h-5',
      md: 'h-7',
      lg: 'h-9',
      hero: 'h-14',
    };
    return (
      <svg
        viewBox="0 0 400 90"
        role="img"
        aria-label="MediMind"
        className={cn('w-auto', heightByWordSize[size], className)}
      >
        <defs>
          <linearGradient id={wordGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stops.from} />
            <stop offset="100%" stopColor={stops.to} />
          </linearGradient>
        </defs>
        <text
          x="200"
          y="68"
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="68"
          fontWeight="800"
          letterSpacing="-3.4"
        >
          <tspan fill={mediColor}>Medi</tspan>
          <tspan fill={`url(#${wordGrad})`}>Mind</tspan>
        </text>
      </svg>
    );
  }

  // Vertical lockup — single SVG (matches brand vertical-dark.svg)
  if (variant === 'vertical') {
    const heightByVerticalSize: Record<Size, string> = {
      sm: 'h-16',
      md: 'h-24',
      lg: 'h-32',
      hero: 'h-40 sm:h-48 md:h-56',
    };
    return (
      <svg
        viewBox="0 0 360 180"
        role="img"
        aria-label="MediMind — The AI-Native Hospital OS"
        className={cn('w-auto', heightByVerticalSize[size], className)}
      >
        <defs>
          <linearGradient id={stackGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stops.from} />
            <stop offset="50%" stopColor={stops.mid} />
            <stop offset="100%" stopColor={stops.to} />
          </linearGradient>
          <linearGradient id={wordGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stops.from} />
            <stop offset="100%" stopColor={stops.to} />
          </linearGradient>
        </defs>
        <g transform="translate(140 12)">
          <rect x="0" y="0" width="80" height="11" rx="2.5" fill={`url(#${stackGrad})`} />
          <rect x="0" y="15" width="80" height="11" rx="2.5" fill={`url(#${stackGrad})`} opacity="0.78" />
          <rect x="0" y="30" width="80" height="11" rx="2.5" fill={`url(#${stackGrad})`} opacity="0.55" />
          <rect x="0" y="45" width="80" height="11" rx="2.5" fill={`url(#${stackGrad})`} opacity="0.32" />
        </g>
        <text
          x="180"
          y="140"
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="58"
          fontWeight="800"
          letterSpacing="-2.9"
        >
          <tspan fill={mediColor}>Medi</tspan>
          <tspan fill={`url(#${wordGrad})`}>Mind</tspan>
        </text>
      </svg>
    );
  }

  // Horizontal lockup — flex composition for guaranteed proportion.
  // Icon sized as `0.95em` so it visually matches the text cap-height.
  const fontSizeClass: Record<Size, string> = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    hero: 'text-5xl sm:text-6xl md:text-7xl',
  };
  return (
    <span
      role="img"
      aria-label="MediMind — The AI-Native Hospital OS"
      className={cn(
        'inline-flex items-center gap-2 sm:gap-2.5 leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap',
        fontSizeClass[size],
        className
      )}
    >
      {/* Icon sized to match text cap-height (~0.72em) so it sits at the same visual level as the wordmark */}
      {renderIconSvg('h-[0.72em]')}
      <span>
        <span style={{ color: mediColor }}>Medi</span>
        <span
          style={{
            backgroundImage: `linear-gradient(135deg, ${stops.from} 0%, ${stops.to} 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Mind
        </span>
      </span>
    </span>
  );
};
