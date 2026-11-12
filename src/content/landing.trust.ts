/**
 * Every visible string for the trust and conversion part of the landing page:
 * control and safety, founders, offer, FAQ, the final call to action with the
 * form, the footer, /request-demo and /privacy.
 *
 * Words are the approved copy deck (marketing/landing-level-up-2026-11-12/
 * 06-copy-deck.md, Part 2 sections 8 to 12, Part 3 and Part 5), word for word.
 * Kept in one file so a Georgian version can follow.
 */
import { contactEmail, primaryCta } from './site';

export interface TitledLine {
  title: string;
  text: string;
}

/* ---------- 8. Control and safety (#control) ---------- */

export const control = {
  eyebrow: 'For the people who approve',
  title: 'Your hospital',
  accent: 'stays in control.',
  support: 'What your IT lead, finance lead and medical director will want to know.',
  items: [
    {
      title: 'Your data stays yours.',
      text: 'Stored in FHIR R4, the international standard. Full export at any time. No vendor lock-in.',
    },
    { title: 'On your own servers.', text: 'MediMind runs on servers inside your hospital.' },
    { title: 'Keeps working offline.', text: 'Built so staff keep working when the internet drops.' },
    { title: 'Every action logged.', text: 'Who did what, in which record, and when.' },
    { title: 'AI drafts, people sign.', text: 'No AI draft enters the record until a named person approves it.' },
    {
      title: 'One team, start to finish.',
      text: 'The people who build MediMind install it and support your staff.',
    },
  ] satisfies TitledLine[],
};

/* ---------- 9. Team (#team) ---------- */

export const founders = {
  eyebrow: 'Who builds it',
  title: 'Built by a',
  accent: 'practising cardiologist',
  titleEnd: 'and a product leader.',
  support:
    'Built inside a hospital by a doctor who still practises, not by a software company guessing at hospital work.',
  people: [
    {
      name: 'Dr. Lasha Khoshtaria',
      role: 'Co-founder and CTO',
      proof:
        'Interventional cardiologist, practising in Tbilisi since 2019. Study coordinator on 11+ international device trials.',
    },
    {
      name: 'Irakli Pkhovelishvili',
      role: 'Co-founder, product and strategy',
      proof:
        'Nine years at Riot Games, in strategy and finance for its Hong Kong and Singapore studios. Then led a product team of more than 150 people. Duke MBA.',
    },
  ],
  backers: 'Backed by 500 Global · GITA grant · Innovative Startup status, Government of Georgia',
  /** Image id `team-founders` from public/landing/manifest.json. */
  photo: {
    alt: 'Dr. Lasha Khoshtaria and Irakli Pkhovelishvili, co-founders of MediMind.',
    width: 900,
    height: 846,
    fallback: '/landing/team-founders-900.jpg',
    avif: '/landing/team-founders-800.avif 800w, /landing/team-founders-900.avif 900w',
    webp: '/landing/team-founders-800.webp 800w, /landing/team-founders-900.webp 900w',
    sizes: '(min-width: 1024px) 450px, 100vw',
  },
};

/* ---------- 10. The offer (#offer) ---------- */

export const offer = {
  eyebrow: 'The offer',
  title: 'Founding partner',
  accent: 'terms.',
  support: "What your hospital gets as one of MediMind's founding partners.",
  terms: [
    { title: 'Free implementation and training.', text: 'The first 30 days with no commitment.' },
    {
      title: 'You ask, we build.',
      text: 'An answer in 3 workdays, no development fees. Scope and timing are agreed for each request.',
    },
    {
      title: 'Day 30: you decide. Day 90: you are live.',
      text: 'Go ahead, extend the evaluation or walk away, on the measures you agreed.',
    },
    { title: 'Your data stays yours.', text: 'FHIR R4 and full export at any time.' },
  ] satisfies TitledLine[],
  /** Shown only when `showFoundingPlaces` is true. */
  places: 'Two founding-partner places open.',
  cta: primaryCta,
  underButton:
    '30 minutes with Dr. Lasha Khoshtaria and Irakli Pkhovelishvili. Online or at your hospital. No commitment.',
};

/* ---------- 11. FAQ (#faq) ---------- */

export const faq = {
  eyebrow: 'Questions owners ask',
  title: 'Before you',
  accent: 'book.',
  support: 'Four honest answers.',
  items: [
    {
      question: 'Is the call a sales pitch?',
      answer:
        'No. The 30 minutes are about your hospital: its three biggest problems and what a 90-day plan would look like for it. You leave with that plan whether or not you go further, and nothing is signed on the call.',
    },
    {
      question: 'Is MediMind a fit for a hospital like mine?',
      answer:
        'MediMind is built for private multi-profile hospitals and hospital groups in Georgia, the hospitals big vendors do not serve. Georgian, Russian and English, ministry forms and Georgian personal IDs are built in. A 25-hospital network has already signed to replace every system with it.',
    },
    {
      question: 'How much work is this for my team?',
      answer:
        "In the first 30 days nobody's day changes: your hospital is built beside your current system. Your clinical and finance leads agree the scope and the measures. After day 30, staff are trained by role, one department at a time.",
    },
    {
      question: 'What does it cost?',
      answer:
        'Implementation and training are free, and the first 30 days carry no commitment. The price follows the scope you agree, and you see it before you commit to anything. Requests you make are built with no development fees.',
    },
  ],
};

/* ---------- 12. Final call to action (#contact) ---------- */

export const contact = {
  eyebrow: 'Next step',
  title: 'Leave the call with a',
  accent: '90-day plan',
  titleEnd: 'for your hospital.',
  support:
    '30 minutes, online or at your hospital, with Dr. Lasha Khoshtaria, practising cardiologist, and Irakli Pkhovelishvili, product leader.',
  bulletsTitle: 'On the call you will:',
  bullets: [
    'Map your three biggest problems, in your own numbers.',
    'Get a dated 90-day plan, step by step, for your hospital.',
    'Agree the measures you will judge MediMind on at day 30.',
  ],
  commitment: 'No commitment.',
};

/* ---------- Form microcopy (Part 3) ---------- */

export type FieldName = 'firstName' | 'lastName' | 'companyName' | 'jobTitle' | 'email' | 'phone' | 'useCase';

export interface FieldCopy {
  name: FieldName;
  label: string;
  placeholder: string;
  helper?: string;
  required: boolean;
  /** Same caps as the server (supabase/functions/crm/validate.ts DEMO_LIMITS). */
  max: number;
  autoComplete: string;
  type: 'text' | 'email' | 'tel';
  /** Hidden in deck mode. */
  callOnly?: boolean;
}

export const formFields: FieldCopy[] = [
  { name: 'firstName', label: 'First name', placeholder: 'Nino', required: true, max: 80, autoComplete: 'given-name', type: 'text' },
  { name: 'lastName', label: 'Last name', placeholder: 'Beridze', required: true, max: 80, autoComplete: 'family-name', type: 'text' },
  { name: 'companyName', label: 'Hospital or group', placeholder: 'Hospital name', required: true, max: 200, autoComplete: 'organization', type: 'text' },
  { name: 'jobTitle', label: 'Your role', placeholder: 'Owner, CEO, medical director', required: true, max: 120, autoComplete: 'organization-title', type: 'text' },
  {
    name: 'email',
    label: 'Work email',
    placeholder: 'name@hospital.org',
    helper: 'We reply to this address.',
    required: true,
    max: 200,
    autoComplete: 'email',
    type: 'email',
  },
  {
    name: 'phone',
    label: 'Phone (optional)',
    placeholder: 'With country code',
    helper: 'Only if you prefer a call to an email.',
    required: false,
    max: 40,
    autoComplete: 'tel',
    type: 'tel',
    callOnly: true,
  },
  {
    name: 'useCase',
    label: 'What is the biggest problem you want fixed? (optional)',
    placeholder: 'For example: claims coming back from insurers',
    helper: 'One line is enough.',
    required: false,
    max: 200,
    autoComplete: 'off',
    type: 'text',
    callOnly: true,
  },
];

export const honeypotLabel = 'Leave this field empty';

export const formCopy = {
  submitCall: primaryCta.label,
  submitDeck: 'Email me the deck',
  sending: 'Sending…',
  softPathLead: 'Not ready for a call?',
  softPathButton: 'Get the hospital deck by email',
  deckTitle: 'Get the hospital deck by email',
  deckLine: 'A short deck for your board: the problems, the 90-day plan and the terms.',
  deckBack: 'Book the 30-minute call instead',
  deckUseCase: '[Deck request]',
  privacy: 'Your details are used only to arrange the call. No mailing list. Never shared or sold.',
  next: 'We reply within one working day with two time options.',
};

export const formErrors = {
  required: {
    firstName: 'Enter your first name.',
    lastName: 'Enter your last name.',
    companyName: "Enter your hospital's name.",
    jobTitle: 'Enter your role.',
    email: 'Enter your work email.',
  } as Partial<Record<FieldName, string>>,
  emailFormat: 'Check your email address. It should look like name@hospital.org.',
  phoneFormat: 'Check the phone number, or leave it empty.',
  tooLong: 'This is longer than the form accepts. Please shorten it.',
  summary: 'Please fix the marked fields.',
  /** Server answers. The email address inside is rendered as a mailto link. */
  invalid: 'Some details could not be accepted. Check the marked fields and send again.',
  rateLimited: `This connection has sent several requests today. Please email ${contactEmail} and we will reply within one working day.`,
  network: `Your request did not send. Check your connection and try again, or email ${contactEmail}.`,
};

export const successCopy = {
  call: {
    title: (firstName: string) => `Thank you, ${firstName}. Your request is in.`,
    body: 'We reply within one working day with two time options for your 30-minute call.',
    detail: `Watch for an email from ${contactEmail}.`,
  },
  deck: {
    title: (firstName: string) => `Thank you, ${firstName}.`,
    body: 'We email you the hospital deck within one working day.',
    detail: `It comes from ${contactEmail}.`,
  },
  back: 'Back to the page',
};

/* ---------- Footer (Part 3) ---------- */

export const footer = {
  line: 'One hospital. One operating system.',
  secondLine: 'Built ground-up on FHIR R4.',
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: `mailto:${contactEmail}` },
    { label: 'Innovative Startup status', href: 'https://innovationstatus.gov.ge/ka/awarded-companies/11464' },
    { label: 'MediMind Expert', href: 'https://medimind.md/expert' },
  ],
  copyright: (year: number) => `© ${year} MediMind.`,
};

/* ---------- Privacy notice (Part 5, draft for lawyer review) ---------- */

export const privacy = {
  title: 'Privacy notice: medimind.md',
  draftLabel: 'Draft',
  draftNote: 'Draft for lawyer review. Not yet approved for publication.',
  sections: [
    {
      title: 'Who we are.',
      text: `MediMind [legal entity name and registered address to be filled]. Contact: ${contactEmail}.`,
    },
    {
      title: 'What the form collects.',
      text: "When you ask for a call or for the hospital deck, the form collects your first name, last name, hospital or group, role and work email. You may also give a phone number and one line about the problem you want fixed. To stop automated abuse, the server also records a scrambled (hashed) form of your connection's IP address.",
    },
    {
      title: 'Why.',
      text: 'To reply to your request: to arrange the 30-minute call, or to email you the hospital deck. The scrambled IP address is used only to limit repeated requests.',
    },
    {
      title: 'Who sees it.',
      text: 'The MediMind team who answer requests. We do not sell your details, add you to a mailing list or share them with anyone else. Our service providers store and process the data for us: Netlify hosts the website and Supabase hosts the database.',
    },
    {
      title: 'Where it is stored.',
      text: "In MediMind's request database, hosted by Supabase. [Data centre region to be confirmed.]",
    },
    {
      title: 'How long.',
      text: '[Retention period to be decided, for example: until you ask us to delete it, or 24 months after our last contact, whichever comes first.]',
    },
    {
      title: 'Your choices.',
      text: `You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email ${contactEmail} from the address you used, and we will reply within [number] working days.`,
    },
    {
      title: 'Analytics.',
      text: '[If the build adds page analytics or cookies, describe them here before launch. Today the page sets no analytics cookies.]',
    },
    {
      title: 'Changes.',
      text: 'We will update this page if anything above changes. Last updated: [date].',
    },
  ],
};
