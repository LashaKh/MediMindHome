// Logs investor activity events. Public endpoint (no auth) — token validation
// is the primary control. Returns 204 silently to never block the deck.
//
// POST body: { token: string, event_type: string, metadata?: object }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders, getClientIp, hashIp } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: corsHeaders });
  }

  try {
    const { token, event_type, metadata } = await req.json();
    if (!token || !event_type) {
      return new Response(null, { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Validate token exists and is active
    const { data: invite } = await supabase
      .from("investor_invites")
      .select("token, active")
      .eq("token", token)
      .maybeSingle();

    if (!invite || !invite.active) {
      // Silent reject — do not reveal whether the token exists
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const ip_hash = await hashIp(getClientIp(req));
    const user_agent = req.headers.get("user-agent")?.slice(0, 500) ?? null;

    await supabase.from("investor_events").insert({
      token,
      event_type,
      metadata: metadata ?? null,
      ip_hash,
      user_agent,
    });

    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (err) {
    // Never throw — we don't want to break the deck if tracking fails
    console.error("track-event error:", err);
    return new Response(null, { status: 204, headers: corsHeaders });
  }
});
