import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { resolveLandingRoute } from "./index.ts";

Deno.test("defaults the existing endpoint to investor event tracking", () => {
  assertEquals(
    resolveLandingRoute("https://example.test/functions/v1/track-event"),
    "track-event",
  );
});

Deno.test("routes every consolidated Landing API operation", () => {
  for (const route of [
    "admin-login",
    "admin-data",
    "admin-write",
    "investor-login",
  ] as const) {
    assertEquals(
      resolveLandingRoute(`https://example.test/functions/v1/track-event?route=${route}`),
      route,
    );
  }
});

Deno.test("rejects unknown routes", () => {
  assertEquals(
    resolveLandingRoute("https://example.test/functions/v1/track-event?route=unknown"),
    null,
  );
});
