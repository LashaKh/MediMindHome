/**
 * The privacy notice at /privacy, in plain words, for the contact form on medimind.md.
 *
 * Facts and where they come from:
 * - Controller: LLC Medimind (შპს მედიმაინდ), identification number 405783095,
 *   National Agency of Public Registry of Georgia (founder's Brain note "Legal Entity").
 * - Form fields: src/components/Demo/ScopingForm.tsx. Hashed IP for rate limiting:
 *   supabase/functions/crm/index.ts (hashIp).
 * - Storage region: Supabase project kvsqtolsjggpyvdtdpss, AWS eu-central-1 (Frankfurt),
 *   the project the site's VITE_SUPABASE_URL and src/lib/crmApi.ts point at.
 * - Browser storage: only the theme choice (src/hooks/useTheme.ts). Landing events are a
 *   no-op (src/lib/tracking.ts). Fonts are self-hosted. No analytics, no ad cookies.
 *
 * Anything in [CONFIRM: ...] is not verified and is shown on the page as a marked blank
 * until the founder answers it.
 */
import { contactEmail } from './site';

export interface PrivacySection {
  title: string;
  text: string;
}

export const privacy = {
  title: 'Privacy notice',
  intro:
    'This notice explains what happens to the details you give us through the contact form on medimind.md.',
  updated: 'Last updated: 13 November 2026.',
  sections: [
    {
      title: 'Who we are',
      text: `The website medimind.md is run by LLC Medimind (შპს მედიმაინდ), identification number 405783095, registered with the National Agency of Public Registry of Georgia, [CONFIRM: registered address to publish]. We decide how your details are used (we are the "controller"). Contact: ${contactEmail}.`,
    },
    {
      title: 'What we collect',
      text: 'When you ask for a call or for the hospital deck, the form collects your first and last name, your hospital or group, your role and your work email. A phone number and a short message are optional. To stop automated abuse, our server also keeps a scrambled (hashed) form of your connection\'s IP address, never the address itself.',
    },
    {
      title: 'Why we use it',
      text: 'Only to answer your request: to arrange the call or send you the deck, and to follow up on that conversation. The scrambled IP address is used only to limit repeated requests. We do not send newsletters, add you to a mailing list or sell your details.',
    },
    {
      title: 'Legal basis',
      text: 'You ask us to contact you, so we use your details to take the steps you asked for. Limiting abuse of the form is our legitimate interest in keeping the service safe.',
    },
    {
      title: 'Where it is stored',
      text: "In MediMind's request database, run for us by Supabase in its Frankfurt, Germany data centre (European Union). Netlify hosts the website itself and, like any web host, briefly handles connection data such as IP addresses to deliver the pages.",
    },
    {
      title: 'Who can see it',
      text: 'Only the MediMind team members who answer requests. Supabase and Netlify process the data on our behalf as service providers. We share it with no one else unless the law requires us to.',
    },
    {
      title: 'How long we keep it',
      text: '[CONFIRM: retention period, for example until you ask us to delete it or 24 months after our last contact, whichever comes first.]',
    },
    {
      title: 'Your rights',
      text: `You can ask to see what we hold about you, to correct it, to delete it, or to stop us using it. Email ${contactEmail} from the address you used in the form and we will reply within [CONFIRM: number of days, for example 30]. You can also complain to the Personal Data Protection Service of Georgia or to the data protection authority where you live.`,
    },
    {
      title: 'Cookies and analytics',
      text: 'The site uses no analytics, no advertising cookies and no tracking pixels. Fonts are served from our own site. If you use the light or dark switch, your browser remembers that one choice in its local storage; it never leaves your device.',
    },
    {
      title: 'Changes',
      text: 'If anything above changes, we update this page and the date at the top.',
    },
  ] satisfies PrivacySection[],
};
