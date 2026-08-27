// Logs investor activity events. Public endpoint (no auth) — token validation
// is the primary control. Returns 204 silently to never block the deck.
//
// POST body: { token: string, event_type: string, metadata?: object }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders, getClientIp, hashIp } from "../_shared/cors.ts";
import { handleAdminData } from "../admin-data/index.ts";
import { handleAdminLogin } from "../admin-login/index.ts";
import { handleAdminWrite } from "../admin-write/index.ts";
import { handleInvestorLogin } from "../investor-login/index.ts";

export type LandingRoute =
  | "track-event"
  | "admin-login"
  | "admin-data"
  | "admin-write"
  | "investor-login";

const LANDING_ROUTES = new Set<LandingRoute>([
  "track-event",
  "admin-login",
  "admin-data",
  "admin-write",
  "investor-login",
]);

export function resolveLandingRoute(url: string): LandingRoute | null {
  const route = new URL(url).searchParams.get("route") ?? "track-event";
  return LANDING_ROUTES.has(route as LandingRoute) ? route as LandingRoute : null;
}

export async function handleTrackEvent(req: Request): Promise<Response> {
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
}

export async function handleLandingApi(req: Request): Promise<Response> {
  const route = resolveLandingRoute(req.url);
  switch (route) {
    case "admin-login":
      return handleAdminLogin(req);
    case "admin-data":
      return handleAdminData(req);
    case "admin-write":
      return handleAdminWrite(req);
    case "investor-login":
      return handleInvestorLogin(req);
    case "track-event":
      return handleTrackEvent(req);
    default:
      return new Response(JSON.stringify({ error: "route_not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
  }
}

if (import.meta.main) {
  Deno.serve(handleLandingApi);
}
