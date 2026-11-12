import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Buttons and link-buttons. Pill shape, 48px tall (text variant 44px),
 * visible focus outline, colours follow the section tone (white button on navy).
 *
 *   <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
 *   <ButtonLink href="#switch" variant="secondary">See the 90-day plan</ButtonLink>
 *   <Button type="submit" disabled={busy}>Send</Button>
 *
 * variant: 'primary' (one per section) | 'secondary' (outline) | 'text' (link-button).
 * External links (http…) open in a new tab with rel="noopener noreferrer".
 */
export type ButtonVariant = 'primary' | 'secondary' | 'text';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-luminous',
  secondary: 'btn-ghost',
  text: 'btn-quiet',
};

export const buttonClass = (variant: ButtonVariant = 'primary', full = false) =>
  cn(variantClass[variant], full && variant !== 'text' && 'w-full');

interface CommonProps {
  variant?: ButtonVariant;
  /** Full width (phones, sticky bar). */
  full?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', full = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonClass(variant, full), 'disabled:cursor-not-allowed disabled:opacity-60', className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, CommonProps {
  href: string;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = 'primary', full = false, href, target, rel, ...props }, ref) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        ref={ref}
        href={href}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
        className={cn(buttonClass(variant, full), className)}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = 'ButtonLink';
