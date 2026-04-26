// Shared CORS + helper utilities for investor tracking Edge Functions.

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

/** Hash an IP address with a daily-rotating salt so we can correlate
 *  visits within a day without ever persisting the raw IP. */
export async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const salt = Deno.env.get("IP_HASH_SALT") ?? "default-salt";
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${ip}|${day}|${salt}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Extract the first IP from x-forwarded-for, falling back to direct headers. */
export function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    null;
}

/** Build a Supabase service-role client (bypasses RLS). */
export function getAdminClient() {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any).createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}
