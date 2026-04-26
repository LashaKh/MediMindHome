// Validates admin password against ADMIN_PASSWORD env secret.
// On success, returns a short-lived JWT (1 hour) signed with ADMIN_JWT_SECRET.
//
// POST body: { password: string }
// Response: { ok: boolean, token?: string, exp?: number }

import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const enc = new TextEncoder();

async function getSigningKey(): Promise<CryptoKey> {
  const secret = Deno.env.get("ADMIN_JWT_SECRET");
  if (!secret) throw new Error("ADMIN_JWT_SECRET not set");
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "method" }, 405);
  }

  try {
    const { password } = await req.json();
    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected) {
      return json({ ok: false, error: "not_configured" }, 500);
    }
    if (typeof password !== "string" || password !== expected) {
      // Constant-time compare not critical here — single-secret system
      return json({ ok: false, error: "invalid" }, 401);
    }

    const key = await getSigningKey();
    const exp = getNumericDate(60 * 60); // 1 hour
    const jwt = await create(
      { alg: "HS256", typ: "JWT" },
      { role: "admin", exp },
      key,
    );

    return json({ ok: true, token: jwt, exp }, 200);
  } catch (err) {
    console.error("admin-login error:", err);
    return json({ ok: false, error: "server" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
