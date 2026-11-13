import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildDemoEmails, buildIcs } from "./notify.ts";

const BASE = { firstName: "Nino", lastName: "Beridze", email: "nino@hospital.ge", companyName: "Test <Clinic>" };

Deno.test("a request without a time sends two plain emails, team first", () => {
  const [team, visitor] = buildDemoEmails(BASE, "team@medimind.md", "Name: Nino Beridze");
  assertEquals(team.to, "team@medimind.md");
  assertEquals(team.replyTo, "nino@hospital.ge");
  assertEquals(visitor.to, "nino@hospital.ge");
  assertEquals(visitor.replyTo, "team@medimind.md");
  assertEquals(team.ics, undefined);
  assertEquals(visitor.ics, undefined);
  assertStringIncludes(team.text, "No time picked");
  // The visitor's words never reach the page as markup.
  assertEquals(team.html.includes("<Clinic>"), false);
});

Deno.test("a picked time adds a calendar request for the team and a tentative entry for the visitor", () => {
  const r = { ...BASE, preferredTime: "2026-12-01T09:00:00.000Z", timezone: "Europe/Berlin" };
  const [team, visitor] = buildDemoEmails(r, "team@medimind.md", "Name: Nino Beridze");
  assertEquals(team.ics?.method, "REQUEST");
  assertEquals(visitor.ics?.method, "PUBLISH");
  assertStringIncludes(team.text, "13:00 Tbilisi time");
  assertStringIncludes(visitor.text, "Europe/Berlin");
  const ics = buildIcs(r, "team@medimind.md", true, "uid-1@medimind.md", new Date("2026-11-13T00:00:00Z"));
  assertStringIncludes(ics, "DTSTART:20261201T090000Z");
  assertStringIncludes(ics, "DTEND:20261201T093000Z");
  assertStringIncludes(ics, "ORGANIZER;CN=Nino Beridze:mailto:nino@hospital.ge");
  assertStringIncludes(ics.replace(/\r\n /g, ""), "RSVP=TRUE:mailto:team@medimind.md");
  for (const line of ics.split("\r\n")) assertEquals(new TextEncoder().encode(line).length <= 75, true);
});
