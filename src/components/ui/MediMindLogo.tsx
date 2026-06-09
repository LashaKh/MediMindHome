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
 * MediMind brand mark — AI-Brain Aura + wordmark.
 *
 * The mark is a centered 4×4 node grid wrapped in five concentric, fading
 * gradient rings — a "neural aura" that reads as intelligence radiating from a
 * structured core. The horizontal variant is composed in React (icon SVG + HTML
 * text) rather than as one big SVG so proportions track the text font-size —
 * the aura disc reads ~1.48× the bold wordmark cap-height (icon height = 1.05em).
 *
 * The `icon` variant uses a SIMPLIFIED mark (solid tile + one bold white ring +
 * white 2×2 grid) because the faint 5-ring aura turns to mush at ~20px (footer).
 *
 * Variants:
 * - `icon`        — simplified small mark (square, footer-safe)
 * - `wordmark`    — "MediMind" text only
 * - `horizontal`  — aura-left + wordmark-right (header / hero)
 * - `vertical`    — aura-top + wordmark-below (splash / cover)
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

  // Gradient def for the aura — userSpaceOnUse so ring STROKES paint correctly
  // (percentage objectBoundingBox units mis-paint thin strokes around a circle).
  const auraGradient = (id: string) => (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
      <stop offset="0%" stopColor={stops.from} />
      <stop offset="50%" stopColor={stops.mid} />
      <stop offset="100%" stopColor={stops.to} />
    </linearGradient>
  );

  // Full AI-Brain Aura (viewBox 0 0 100 100, center 50,50): 5 fading rings + 4×4 node grid.
  const auraCells = [34.4, 42.8, 51.2, 59.6];
  // On dark backgrounds the aura is solid WHITE (crisp, matches the deck cover);
  // on light it uses the brand gradient. Dark cubes get brighter opacities so they pop.
  const rowOpacity = effectiveTone === 'dark' ? [1, 0.92, 0.84, 0.76] : [1, 0.845, 0.69, 0.535];
  const renderAura = (id: string) => {
    const paint = effectiveTone === 'dark' ? '#ffffff' : `url(#${id})`;
    const stroke = paint;
    const fill = paint;
    return (
      <>
        <circle cx="50" cy="50" r="26" fill="none" stroke={stroke} strokeWidth="2" opacity="0.9" />
        <circle cx="50" cy="50" r="32" fill="none" stroke={stroke} strokeWidth="1.7" opacity="0.6" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.42" />
        <circle cx="50" cy="50" r="44" fill="none" stroke={stroke} strokeWidth="1.1" opacity="0.26" />
        <circle cx="50" cy="50" r="49" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.14" />
        {auraCells.map((y, row) =>
          auraCells.map((x) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="6"
              height="6"
              rx="1.32"
              fill={fill}
              opacity={rowOpacity[row]}
            />
          ))
        )}
      </>
    );
  };

  // Inline icon SVG renderer for the horizontal lockup — FULL aura on a square viewBox.
  const renderIconSvg = (heightClass: string) => (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      className={cn('w-auto flex-shrink-0', heightClass)}
    >
      <defs>{auraGradient(stackGrad)}</defs>
      {renderAura(stackGrad)}
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
        <defs>{auraGradient(stackGrad)}</defs>
        <rect x="6" y="6" width="88" height="88" rx="20" fill={`url(#${stackGrad})`} />
        <circle cx="50" cy="50" r="33" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.9" />
        <rect x="37" y="37" width="11" height="11" rx="2.5" fill="#ffffff" />
        <rect x="52" y="37" width="11" height="11" rx="2.5" fill="#ffffff" />
        <rect x="37" y="52" width="11" height="11" rx="2.5" fill="#ffffff" />
        <rect x="52" y="52" width="11" height="11" rx="2.5" fill="#ffffff" />
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
          {auraGradient(stackGrad)}
          <linearGradient id={wordGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stops.from} />
            <stop offset="100%" stopColor={stops.to} />
          </linearGradient>
        </defs>
        <g transform="translate(137 8) scale(0.86)">{renderAura(stackGrad)}</g>
        <text
          x="180"
          y="148"
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
  // Aura disc sized as `1.05em` so it reads ~1.48× the bold wordmark cap-height.
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
      {/* Aura disc reads clearly larger than the bold wordmark — the approved EMR balance
          (icon box ≈ 1.45× the font-size, so the disc is ~2× the wordmark cap-height) */}
      {renderIconSvg('h-[1.45em]')}
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
