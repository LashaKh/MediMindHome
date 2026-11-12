import React from 'react';
import { SectionShell, ProofItem } from '../ui';
import { showCustomerName } from '../../content/site';
import { proofContent as c } from '../../content/landing.top';
import { useTheme } from '../../hooks/useTheme';

/**
 * Proof strip: four facts a sceptical owner can check, right after the promise.
 * No headline by design (two text levels): the lead line, then the items.
 * `showCustomerName` switches the lead line and shows the customer's logo.
 */
export const ProofStrip: React.FC = () => {
  const theme = useTheme((s) => s.theme);
  const lead = showCustomerName ? c.lead.named : c.lead.unnamed;
  const logo = c.customerLogo;

  return (
    <SectionShell id="proof" tone="pale" labelledBy="proof-lead" className="py-12 md:py-14 lg:py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        {showCustomerName && (
          <img
            src={theme === 'dark' ? logo.dark : logo.light}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            className="h-12 w-auto self-start md:self-center"
          />
        )}
        <p id="proof-lead" className="mm-lead max-w-4xl [text-wrap:balance]">
          <span className="font-semibold text-mm-ink">{lead.strong}</span>
          {lead.rest}
        </p>
      </div>

      <ul className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
        {c.items.map((item) => (
          <ProofItem
            key={item.label}
            label={item.label}
            detail={item.detail}
            href={item.href}
            linkLabel={item.linkLabel}
            className="border-t border-mm-line pt-4"
          />
        ))}
      </ul>
    </SectionShell>
  );
};
