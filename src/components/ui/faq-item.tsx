import React from 'react';
import { cn } from '../../utils/cn';

/**
 * FAQ item: native <details>, OPEN by default so nothing essential hides
 * behind a click (the reader can still fold it). Works without JavaScript.
 *
 *   <FaqItem question="Will this put pressure on my team?">
 *     <p>Answer in one or two sentences.</p>
 *   </FaqItem>
 *
 * `as` sets the question's heading level (h3 under the FAQ section h2).
 */
interface FaqItemProps {
  question: React.ReactNode;
  as?: 'h3' | 'h4';
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FaqItem: React.FC<FaqItemProps> = ({ question, as: Tag = 'h3', defaultOpen = true, children, className }) => (
  <details open={defaultOpen} className={cn('group border-t border-mm-line py-5', className)}>
    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
      <Tag className="mm-h3">{question}</Tag>
      <span
        aria-hidden="true"
        className="shrink-0 text-xl font-semibold leading-none text-mm-muted transition-transform group-open:rotate-45"
      >
        +
      </span>
    </summary>
    <div className="mm-body mt-3 max-w-2xl">{children}</div>
  </details>
);
