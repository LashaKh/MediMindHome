// Client-side tracking helpers for investor briefing.
// Calls Supabase Edge Functions; never throws.

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://kvsqtolsjggpyvdtdpss.supabase.co";

const TRACK_URL = `${SUPABASE_URL}/functions/v1/track-event`;
const INVESTOR_LOGIN_URL = `${SUPABASE_URL}/functions/v1/track-event?route=investor-login`;

export async function trackEvent(
  token: string,
  event_type: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch(TRACK_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, event_type, metadata: metadata ?? null }),
    });
  } catch {
    /* swallow — tracking must never break UX */
  }
}

export type InvestorLoginResult =
  | { ok: true; full_name: string }
  | { ok: false; error: string; status: number };

export async function investorLogin(
  token: string,
  password: string,
): Promise<InvestorLoginResult> {
  try {
    const res = await fetch(INVESTOR_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();
    if (json.ok) return { ok: true, full_name: json.full_name };
    return { ok: false, error: json.error ?? "invalid", status: res.status };
  } catch {
    return { ok: false, error: "network", status: 0 };
  }
}

// ---------------------------------------------------------------------------
// Landing page events (cta_click, form_start, form_submit_success,
// form_submit_error, deck_request_success). See copy deck Part 3.
//
// SAFE NO-OP ON PURPOSE. The only endpoint, track-event, records an event only
// when the body carries a `token` that exists and is active in
// `investor_invites`, and writes it to `investor_events`. Anonymous landing
// visitors have no token, so the server answers 204 and stores nothing.
// Recording these events needs a backend change first (a separate anonymous
// route and table with its own rate limit; see the trust lane's handoff note
// marketing/landing-level-up-2026-11-12/status/trust.done.md). Until then this
// function only logs in development, and it can never block or break the page.
// When the route exists, send with fetch(..., { keepalive: true }) inside a
// try/catch, exactly like trackEvent above.
// ---------------------------------------------------------------------------

export type LandingEvent =
  | "cta_click"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error"
  | "deck_request_success";

/** `location` for cta_click: header, hero, offer, sticky, final. `reason` for form_submit_error: invalid, rate_limited, network. */
export type LandingEventProps = Record<string, string>;

export function trackLanding(event: LandingEvent, props?: LandingEventProps): void {
  if (import.meta.env.DEV) {
    console.debug("[trackLanding]", event, props ?? {});
  }
}
