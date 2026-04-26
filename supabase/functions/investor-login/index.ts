// Validates a per-investor token + first-name password.
// Logs attempt + success/fail. Rate-limits 3 failures in 5 minutes.
//
// POST body: { token: string, password: string }
// Response: { ok: boolean, full_name?: string }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders, getClientIp, hashIp } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { token, password } = await req.json();
    if (!token || typeof password !== "string") {
      return json({ ok: false, error: "missing" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate-limit: count fails in last 5 minutes for this token
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    const { count: failCount } = await supabase
      .from("investor_events")
      .select("id", { count: "exact", head: true })
      .eq("token", token)
      .eq("event_type", "password_fail")
      .gte("occurred_at", fiveMinAgo);

    if ((failCount ?? 0) >= 3) {
      return json({ ok: false, error: "rate_limit" }, 429);
    }

    const ip_hash = await hashIp(getClientIp(req));
    const user_agent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const baseEvent = { token, ip_hash, user_agent };

    // Always log the attempt
    await supabase.from("investor_events").insert({
      ...baseEvent,
      event_type: "password_attempt",
      metadata: { value_length: password.length },
    });

    // Look up invite
    const { data: invite } = await supabase
      .from("investor_invites")
      .select("token, full_name, first_name, password, active")
      .eq("token", token)
      .maybeSingle();

    if (!invite || !invite.active) {
      await supabase.from("investor_events").insert({
        ...baseEvent,
        event_type: "password_fail",
        metadata: { reason: "unknown_or_inactive_token" },
      });
      return json({ ok: false, error: "invalid" }, 401);
    }

    const matches =
      password.trim().toLowerCase() ===
      String(invite.password ?? "").trim().toLowerCase();

    if (!matches) {
      await supabase.from("investor_events").insert({
        ...baseEvent,
        event_type: "password_fail",
        metadata: { reason: "name_mismatch" },
      });
      return json({ ok: false, error: "invalid" }, 401);
    }

    await supabase.from("investor_events").insert({
      ...baseEvent,
      event_type: "password_success",
    });

    return json({ ok: true, full_name: invite.full_name }, 200);
  } catch (err) {
    console.error("investor-login error:", err);
    return json({ ok: false, error: "server" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
