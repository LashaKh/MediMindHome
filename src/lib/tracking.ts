// Client-side tracking helpers for investor briefing.
// Calls Supabase Edge Functions; never throws.

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://kvsqtolsjggpyvdtdpss.supabase.co";

const TRACK_URL = `${SUPABASE_URL}/functions/v1/track-event`;
const INVESTOR_LOGIN_URL = `${SUPABASE_URL}/functions/v1/investor-login`;

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
