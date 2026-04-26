// Returns dashboard data: invite list + per-invite event aggregates + recent events.
// Requires admin JWT in Authorization header.
//
// GET → { invites: [...], events: [...], summary_by_token: {...} }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const enc = new TextEncoder();

async function verifyAdminJwt(req: Request): Promise<boolean> {
  const auth = req.headers.get("authorization") ?? "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const secret = Deno.env.get("ADMIN_JWT_SECRET");
  if (!secret) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
    const payload = await verify(m[1], key);
    return payload?.role === "admin";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (!(await verifyAdminJwt(req))) {
    return json({ error: "unauthorized" }, 401);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: invites, error: invitesErr } = await supabase
      .from("investor_invites")
      .select("*")
      .order("created_at", { ascending: false });
    if (invitesErr) throw invitesErr;

    // Pull recent events (last 14 days) for charts
    const since = new Date(Date.now() - 14 * 86400_000).toISOString();
    const { data: events, error: eventsErr } = await supabase
      .from("investor_events")
      .select("*")
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: false })
      .limit(2000);
    if (eventsErr) throw eventsErr;

    // Aggregate summary per token (cheap to do here; small data)
    const summary_by_token: Record<string, {
      total_events: number;
      open_count: number;
      total_dwell_seconds: number;
      last_seen_at: string | null;
      unique_ip_hashes: number;
      unique_user_agents: number;
      top_slides: Array<{ slide_index: number; slide_label: string; dwell: number }>;
    }> = {};

    for (const e of events ?? []) {
      const t = e.token ?? "_orphan";
      const s = (summary_by_token[t] ??= {
        total_events: 0,
        open_count: 0,
        total_dwell_seconds: 0,
        last_seen_at: null,
        unique_ip_hashes: 0,
        unique_user_agents: 0,
        top_slides: [],
      });
      s.total_events++;
      if (e.event_type === "deck_opened" || e.event_type === "link_opened") {
        s.open_count++;
      }
      if (e.event_type === "slide_view" && e.metadata?.dwell_seconds) {
        s.total_dwell_seconds += Number(e.metadata.dwell_seconds);
      }
      if (!s.last_seen_at || e.occurred_at > s.last_seen_at) {
        s.last_seen_at = e.occurred_at;
      }
    }

    // Compute unique IPs/UAs + top slides per token
    for (const t of Object.keys(summary_by_token)) {
      const tokenEvents = (events ?? []).filter((e) => e.token === t);
      summary_by_token[t].unique_ip_hashes =
        new Set(tokenEvents.map((e) => e.ip_hash).filter(Boolean)).size;
      summary_by_token[t].unique_user_agents =
        new Set(tokenEvents.map((e) => e.user_agent).filter(Boolean)).size;

      const slideMap = new Map<number, { slide_label: string; dwell: number }>();
      for (const e of tokenEvents) {
        if (e.event_type !== "slide_view") continue;
        const idx = Number(e.metadata?.slide_index ?? -1);
        if (idx < 0) continue;
        const cur = slideMap.get(idx) ??
          { slide_label: e.metadata?.slide_label ?? `slide_${idx}`, dwell: 0 };
        cur.dwell += Number(e.metadata?.dwell_seconds ?? 0);
        slideMap.set(idx, cur);
      }
      summary_by_token[t].top_slides = Array.from(slideMap.entries())
        .map(([slide_index, v]) => ({ slide_index, ...v }))
        .sort((a, b) => b.dwell - a.dwell)
        .slice(0, 5);
    }

    return json({ invites, events, summary_by_token }, 200);
  } catch (err) {
    console.error("admin-data error:", err);
    return json({ error: "server" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
