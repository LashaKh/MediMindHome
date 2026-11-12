import React, { useId, useRef, useState } from 'react';
import { submitDemoRequest } from '../../lib/crmApi';
import { trackLanding } from '../../lib/tracking';
import { contactEmail } from '../../content/site';
import {
  formCopy,
  formErrors,
  formFields,
  honeypotLabel,
  successCopy,
  type FieldCopy,
  type FieldName,
} from '../../content/landing.trust';
import { Button, ButtonLink } from '../ui';
import { cn } from '../../utils/cn';

/**
 * The scoping-call form, used by #contact on the landing page and by
 * /request-demo. Posts through the existing submitDemoRequest (no backend
 * change). Two modes: "call" (default) and "deck" (the soft path: same form,
 * phone and question hidden, useCase sent as "[Deck request]").
 *
 * Accessibility: every label is tied to its input; helper and error text are
 * tied with aria-describedby; invalid fields get aria-invalid; the summary and
 * server answers are announced (role="alert"); focus moves to the first
 * invalid field. The submit is guarded so it cannot fire twice.
 */
type Mode = 'call' | 'deck';
type ServerError = 'invalid' | 'rate_limited' | 'network';
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { firstName: '', lastName: '', companyName: '', jobTitle: '', email: '', phone: '', useCase: '' };
// Same rule as the server (supabase/functions/crm/validate.ts).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits with optional +, spaces, dots, dashes and brackets; at least 6 digits.
const PHONE_RE = /^\+?[\d\s().-]+$/;
const USE_CASE_MAX = 200;

function visibleFields(mode: Mode): FieldCopy[] {
  return formFields.filter((f) => mode === 'call' || !f.callOnly);
}

function validate(values: Values, mode: Mode): Errors {
  const errors: Errors = {};
  for (const field of visibleFields(mode)) {
    const value = values[field.name].trim();
    if (!value) {
      if (field.required) errors[field.name] = formErrors.required[field.name];
      continue;
    }
    if (value.length > field.max) errors[field.name] = formErrors.tooLong;
    else if (field.name === 'email' && !EMAIL_RE.test(value)) errors.email = formErrors.emailFormat;
    else if (field.name === 'phone' && (!PHONE_RE.test(value) || value.replace(/\D/g, '').length < 6)) {
      errors.phone = formErrors.phoneFormat;
    }
  }
  return errors;
}

/** " [src: source/medium/campaign]" when the page URL carries any utm_* value; otherwise "". */
function sourceTag(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const part = (key: string) => (params.get(key) ?? '').trim().slice(0, 40);
    const source = part('utm_source');
    const medium = part('utm_medium');
    const campaign = part('utm_campaign');
    if (!source && !medium && !campaign) return '';
    return ` [src: ${source}/${medium}/${campaign}]`;
  } catch {
    return ''; // no URL to read: send without a source tag
  }
}

/** The useCase the server receives: the visitor's words (or the deck flag), plus the source tag if it fits the 200-character cap. */
function buildUseCase(text: string, mode: Mode): string {
  const base = mode === 'deck' ? formCopy.deckUseCase : text.trim();
  const withTag = `${base}${sourceTag()}`.trim();
  return withTag.length <= USE_CASE_MAX ? withTag : base;
}

/** Renders copy that contains the contact address with the address as a mailto link. */
function withMailLink(text: string): React.ReactNode {
  const at = text.indexOf(contactEmail);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <a href={`mailto:${contactEmail}`} className="font-semibold text-mm-link underline underline-offset-2">
        {contactEmail}
      </a>
      {text.slice(at + contactEmail.length)}
    </>
  );
}

interface ScopingFormProps {
  /** Where the form sits, sent with tracking events: 'final' (landing #contact) or 'request-demo'. */
  location: 'final' | 'request-demo';
  /** Where "Back to the page" goes after success. */
  backHref: string;
}

const inputClass =
  'block min-h-[48px] w-full scroll-mt-28 rounded-md border bg-mm-page px-3 py-2 text-[1rem] text-mm-ink placeholder:text-mm-muted md:text-[1.0625rem]';

export const ScopingForm: React.FC<ScopingFormProps> = ({ location, backHref }) => {
  const uid = useId();
  const [mode, setMode] = useState<Mode>('call');
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [done, setDone] = useState<{ mode: Mode; firstName: string } | null>(null);

  const sendingRef = useRef(false);
  const startedRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const deckTitleRef = useRef<HTMLParagraphElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const id = (name: string) => `${uid}-${name}`;
  const fields = visibleFields(mode);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackLanding('form_start', { location, mode });
  };

  const onChange = (name: FieldName) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    // After a failed attempt, clear or update errors as the visitor fixes them.
    if (attempted) setErrors(validate(next, mode));
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setAttempted(false);
    setServerError(null);
    // Move focus so keyboard and screen-reader users land in the changed form.
    setTimeout(() => {
      if (next === 'deck') deckTitleRef.current?.focus();
      else fieldRefs.current.firstName?.focus();
    }, 0);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendingRef.current) return; // never double-submit
    markStarted();
    setServerError(null);

    const found = validate(values, mode);
    setErrors(found);
    setAttempted(true);
    const firstInvalid = fields.find((f) => found[f.name]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid.name]?.focus();
      return;
    }

    const payload: Record<string, string> = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      email: values.email.trim(),
      website: honeypotRef.current?.value ?? '',
    };
    if (mode === 'call' && values.phone.trim()) payload.phone = values.phone.trim();
    const useCase = buildUseCase(values.useCase, mode);
    if (useCase) payload.useCase = useCase;

    sendingRef.current = true;
    setSending(true);
    const result = await submitDemoRequest(payload);
    sendingRef.current = false;
    setSending(false);

    if (result === 'ok') {
      trackLanding(mode === 'deck' ? 'deck_request_success' : 'form_submit_success', { location });
      setDone({ mode, firstName: payload.firstName });
      setTimeout(() => successRef.current?.focus(), 0);
      return;
    }
    const reason: ServerError = result === 'invalid' ? 'invalid' : result === 'rate_limited' ? 'rate_limited' : 'network';
    trackLanding('form_submit_error', { location, mode, reason });
    setServerError(reason); // the visitor's words stay in the fields
    setTimeout(() => alertRef.current?.focus(), 0);
  };

  if (done) {
    const copy = done.mode === 'deck' ? successCopy.deck : successCopy.call;
    return (
      <div className="rounded-lg border border-mm-line bg-mm-page p-6 sm:p-8">
        <h3 ref={successRef} tabIndex={-1} className="mm-h2 scroll-mt-28 focus:outline-none">
          {copy.title(done.firstName)}
        </h3>
        <p className="mm-lead mt-4">{copy.body}</p>
        <p className="mm-body mt-3">{withMailLink(copy.detail)}</p>
        <ButtonLink href={backHref} variant="secondary" className="mt-6">
          {successCopy.back}
        </ButtonLink>
      </div>
    );
  }

  const errorCount = fields.filter((f) => errors[f.name]).length;
  const serverMessage =
    serverError === 'invalid' ? formErrors.invalid : serverError === 'rate_limited' ? formErrors.rateLimited : formErrors.network;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocus={markStarted}
      aria-labelledby={mode === 'deck' ? id('deck-title') : undefined}
      className="relative rounded-lg border border-mm-line bg-mm-page p-5 sm:p-8"
    >
      {mode === 'deck' && (
        <div className="mb-6">
          <p id={id('deck-title')} ref={deckTitleRef} tabIndex={-1} className="mm-body scroll-mt-28 font-semibold text-mm-ink focus:outline-none">
            {formCopy.deckTitle}
          </p>
          <p className="mm-body mt-1">{formCopy.deckLine}</p>
        </div>
      )}

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          const helperId = field.helper ? id(`${field.name}-help`) : undefined;
          const errorId = error ? id(`${field.name}-error`) : undefined;
          const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
          const half = field.name === 'firstName' || field.name === 'lastName';
          const shared = {
            id: id(field.name),
            name: field.name,
            autoComplete: field.autoComplete,
            placeholder: field.placeholder,
            value: values[field.name],
            onChange: onChange(field.name),
            required: field.required,
            'aria-required': field.required || undefined,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': describedBy,
          };
          return (
            <div key={field.name} className={half ? '' : 'sm:col-span-2'}>
              <label htmlFor={id(field.name)} className="mm-body block font-semibold text-mm-ink">
                {field.label}
              </label>
              {field.helper && (
                <p id={helperId} className="mm-caption mt-1">
                  {field.helper}
                </p>
              )}
              {field.name === 'useCase' ? (
                // Two lines so the long example wraps on phones instead of being cut off.
                <textarea
                  ref={(el) => {
                    fieldRefs.current[field.name] = el;
                  }}
                  rows={2}
                  {...shared}
                  className={cn(inputClass, 'mt-2 resize-y', error ? 'border-2 border-mm-alert' : 'border-mm-muted')}
                />
              ) : (
                <input
                  ref={(el) => {
                    fieldRefs.current[field.name] = el;
                  }}
                  type={field.type}
                  inputMode={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : undefined}
                  {...shared}
                  className={cn(inputClass, 'mt-2', error ? 'border-2 border-mm-alert' : 'border-mm-muted')}
                />
              )}
              {error && (
                <p id={errorId} className="mm-body mt-2 font-semibold text-mm-alert">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot: invisible to people and screen readers; bots fill it and the server drops the request. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>{honeypotLabel}</label>
        <input ref={honeypotRef} id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {attempted && errorCount > 0 && (
        <p role="alert" className="mm-body mt-6 font-semibold text-mm-alert">
          {formErrors.summary}
        </p>
      )}

      {serverError && (
        <div
          ref={alertRef}
          role="alert"
          tabIndex={-1}
          className="mm-body mt-6 scroll-mt-28 rounded-md border-l-4 border-mm-alert bg-mm-tint px-4 py-3 text-mm-ink focus:outline-none"
        >
          {withMailLink(serverMessage)}
        </div>
      )}

      <div className="mt-6">
        <Button
          type="submit"
          full
          aria-disabled={sending || undefined}
          className={cn('sm:w-auto', sending && 'cursor-wait opacity-70')}
        >
          {sending ? formCopy.sending : mode === 'deck' ? formCopy.submitDeck : formCopy.submitCall}
        </Button>
        <p className="sr-only" role="status" aria-live="polite">
          {sending ? formCopy.sending : ''}
        </p>
      </div>

      {mode === 'call' ? (
        <>
          <p className="mm-caption mt-4">{formCopy.privacy}</p>
          <p className="mm-caption mt-1">{formCopy.next}</p>
          <p className="mm-caption mt-5 flex flex-wrap items-center gap-x-2 border-t border-mm-line pt-4">
            <span>{formCopy.softPathLead}</span>
            <button type="button" className="btn-quiet" onClick={() => switchMode('deck')}>
              {formCopy.softPathButton}
            </button>
          </p>
        </>
      ) : (
        <p className="mt-5 border-t border-mm-line pt-4">
          <button type="button" className="btn-quiet" onClick={() => switchMode('call')}>
            {formCopy.deckBack}
          </button>
        </p>
      )}
    </form>
  );
};
