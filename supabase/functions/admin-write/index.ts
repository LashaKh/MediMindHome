// Admin-only mutations: create invite, toggle active status.
// Requires admin JWT in Authorization header.
//
// POST body: { action: "create" | "toggle_active" | "update", ...fields }

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

function generateToken(firstName: string): string {
  const slug = firstName.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/o/l/1/i confusion
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const suffix = Array.from(bytes)
    .map((b) => alphabet[b % alphabet.length])
    .join("");
  return `${slug || "guest"}-${suffix}`;
}

// Password format: FirstName + UPPER(first letter of surname).
// "Lasha Khoshtaria" -> "LashaK"; single-word names use the first word.
function generatePassword(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "guest";
  if (parts.length === 1) return parts[0];
  return `${parts[0]}${parts[parts.length - 1][0].toUpperCase()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (!(await verifyAdminJwt(req))) {
    return json({ error: "unauthorized" }, 401);
  }
  if (req.method !== "POST") {
    return json({ error: "method" }, 405);
  }

  try {
    const body = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (body.action === "create") {
      const full_name = String(body.full_name ?? "").trim();
      if (!full_name) return json({ error: "full_name required" }, 400);
      const first_name =
        String(body.first_name ?? full_name.split(/\s+/)[0]).toLowerCase().trim();

      // Generate token + retry on rare collision
      let token = generateToken(first_name);
      for (let i = 0; i < 5; i++) {
        const { data: clash } = await supabase
          .from("investor_invites")
          .select("token")
          .eq("token", token)
          .maybeSingle();
        if (!clash) break;
        token = generateToken(first_name);
      }

      const password = generatePassword(full_name);

      const { data, error } = await supabase
        .from("investor_invites")
        .insert({
          token,
          full_name,
          first_name,
          organization: body.organization ?? null,
          email: body.email ?? null,
          notes: body.notes ?? null,
          password,
        })
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, invite: data }, 200);
    }

    if (body.action === "regenerate_password") {
      if (!body.token) return json({ error: "token required" }, 400);
      const { data: existing } = await supabase
        .from("investor_invites")
        .select("full_name")
        .eq("token", body.token)
        .maybeSingle();
      if (!existing) return json({ error: "not_found" }, 404);

      const password = generatePassword(existing.full_name);
      const { data, error } = await supabase
        .from("investor_invites")
        .update({ password })
        .eq("token", body.token)
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, invite: data }, 200);
    }

    if (body.action === "update_password") {
      if (!body.token) return json({ error: "token required" }, 400);
      const password = String(body.password ?? "").trim();
      if (password.length < 4 || password.length > 64) {
        return json({ error: "password_length" }, 400);
      }
      const { data, error } = await supabase
        .from("investor_invites")
        .update({ password })
        .eq("token", body.token)
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, invite: data }, 200);
    }

    if (body.action === "toggle_active") {
      if (!body.token) return json({ error: "token required" }, 400);
      const { data: existing } = await supabase
        .from("investor_invites")
        .select("active")
        .eq("token", body.token)
        .maybeSingle();
      if (!existing) return json({ error: "not_found" }, 404);

      const { data, error } = await supabase
        .from("investor_invites")
        .update({ active: !existing.active })
        .eq("token", body.token)
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, invite: data }, 200);
    }

    if (body.action === "update") {
      if (!body.token) return json({ error: "token required" }, 400);
      const patch: Record<string, unknown> = {};
      for (const k of ["full_name", "organization", "email", "notes"]) {
        if (k in body) patch[k] = body[k];
      }
      const { data, error } = await supabase
        .from("investor_invites")
        .update(patch)
        .eq("token", body.token)
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, invite: data }, 200);
    }

    return json({ error: "unknown_action" }, 400);
  } catch (err) {
    console.error("admin-write error:", err);
    return json({ error: "server" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
