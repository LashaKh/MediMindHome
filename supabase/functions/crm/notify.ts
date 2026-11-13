// Email alerts for the public "Book a founder call" form (?route=demo-request).
//
// Every accepted request sends two emails through Resend (the medimind.md sender domain):
//   1. to the team inbox, with the visitor's details and Reply-To set to the visitor;
//   2. to the visitor, a short confirmation.
// When the visitor picked a time, both carry a calendar file: the team gets a real
// calendar request (accept or decline; the answer goes to the visitor), the visitor gets
// a tentative entry. A failed email never fails the request: the CRM row is already saved.

import type { DemoRequest } from "./validate.ts";

const RESEND_API_URL = "https://api.resend.com/emails";
const CALL_MINUTES = 30;
const SEND_TIMEOUT_MS = 8000;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "20261120T090000Z" for calendar files. */
const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

/** Escape text for a calendar file, and keep each line under the 75-byte limit. */
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/([,;])/g, "\\$1");
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 73) return line;
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (new TextEncoder().encode(cur + ch).length > 73) {
      out.push(cur);
      cur = " " + ch;
    } else cur += ch;
  }
  out.push(cur);
  return out.join("\r\n");
}

/** The time the visitor asked for, written for a person: Tbilisi time first, then their own. */
export function describeTime(r: DemoRequest): string {
  if (!r.preferredTime) return "";
  const when = new Date(r.preferredTime);
  const fmt = (timeZone: string) =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).format(when);
  let own = "";
  if (r.timezone && r.timezone !== "Asia/Tbilisi") {
    try {
      own = ` (${fmt(r.timezone)} in ${r.timezone})`;
    } catch {
      own = ""; // an unknown zone name: Tbilisi time alone is still correct
    }
  }
  return `${fmt("Asia/Tbilisi")} Tbilisi time${own}`;
}

/** A calendar file for the requested slot. `forTeam` makes it a request the team can accept. */
export function buildIcs(r: DemoRequest, teamEmail: string, forTeam: boolean, uid: string, now = new Date()): string {
  const start = new Date(r.preferredTime);
  const end = new Date(start.getTime() + CALL_MINUTES * 60_000);
  const name = `${r.firstName} ${r.lastName}`.trim();
  const summary = forTeam
    ? `Founder call: ${r.companyName} (${name})`
    : "MediMind founder call (requested time, to be confirmed)";
  const description = forTeam
    ? [`${name}${r.jobTitle ? `, ${r.jobTitle}` : ""}`, r.companyName, r.email, r.phone, r.useCase]
      .filter(Boolean)
      .join("\n")
    : "30 minutes with the MediMind founders. We will confirm this time or offer another by email.";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MediMind//Website form//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${forTeam ? "REQUEST" : "PUBLISH"}`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsStamp(now)}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsText(summary)}`,
    `DESCRIPTION:${icsText(description)}`,
    `STATUS:TENTATIVE`,
    ...(forTeam
      ? [
        `ORGANIZER;CN=${icsText(name)}:mailto:${r.email}`,
        `ATTENDEE;CN=MediMind founders;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${teamEmail}`,
      ]
      : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

const toBase64 = (s: string) => {
  let bin = "";
  for (const b of new TextEncoder().encode(s)) bin += String.fromCharCode(b);
  return btoa(bin);
};

type Email = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  ics?: { content: string; method: "REQUEST" | "PUBLISH" };
};

/** The two emails for one request. Pure, so the wording and the calendar file can be tested. */
export function buildDemoEmails(r: DemoRequest, teamEmail: string, summary: string, now = new Date()): Email[] {
  const name = `${r.firstName} ${r.lastName}`.trim();
  const when = describeTime(r);
  const uid = `${crypto.randomUUID()}@medimind.md`;

  const teamText = [
    "New request from the website form.",
    "",
    summary,
    when ? `Requested time: ${when}` : "No time picked: offer two options.",
    "",
    "Reply to this email to answer the visitor directly.",
    "The request is also saved in the CRM (/admin/crm).",
  ].join("\n");

  const visitorText = [
    `Hello ${r.firstName},`,
    "",
    "Thank you. We received your request for a 30-minute call with the MediMind founders,",
    "Dr. Lasha Khoshtaria and Irakli Pkhovelishvili.",
    "",
    when
      ? `You asked for ${when}. We will confirm this time, or offer another, within one working day.`
      : "We will reply within one working day with two time options.",
    "",
    "You can answer this email with anything you want us to prepare.",
    "",
    "MediMind",
    "https://medimind.md",
  ].join("\n");

  const html = (text: string) =>
    `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.55;color:#0b1b33">${
      esc(text).replace(/\n/g, "<br>")
    }</div>`;

  return [
    {
      to: teamEmail,
      subject: `New founder call request: ${r.companyName} (${name})`,
      text: teamText,
      html: html(teamText),
      replyTo: r.email,
      ics: when ? { content: buildIcs(r, teamEmail, true, uid, now), method: "REQUEST" } : undefined,
    },
    {
      to: r.email,
      subject: "We received your request · MediMind",
      text: visitorText,
      html: html(visitorText),
      replyTo: teamEmail,
      ics: when ? { content: buildIcs(r, teamEmail, false, uid, now), method: "PUBLISH" } : undefined,
    },
  ];
}

async function send(apiKey: string, from: string, email: Email): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SEND_TIMEOUT_MS);
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email.to],
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(email.ics
          ? {
            attachments: [{
              filename: "medimind-founder-call.ics",
              content: toBase64(email.ics.content),
              content_type: `text/calendar; charset=utf-8; method=${email.ics.method}`,
            }],
          }
          : {}),
      }),
    });
    const body = await res.text();
    if (!res.ok) throw new Error(`resend ${res.status}: ${body.slice(0, 200)}`);
    return body;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Send the team alert and the visitor's confirmation. Returns what happened to each, for the
 * CRM timeline. Never throws: the request is already saved when this runs.
 */
export async function notifyDemoRequest(r: DemoRequest, summary: string): Promise<{ team: boolean; visitor: boolean }> {
  const apiKey = Deno.env.get("RESEND_API_KEY") ?? "";
  if (!apiKey) {
    console.error("demo-request notify: RESEND_API_KEY is not set, no email sent");
    return { team: false, visitor: false };
  }
  // Not EMAIL_FROM_ADDRESS: other functions in this project may carry a hospital's brand there.
  const from = Deno.env.get("DEMO_FROM_ADDRESS") ?? "MediMind <noreply@medimind.md>";
  const teamEmail = Deno.env.get("DEMO_NOTIFY_TO") ?? "team@medimind.md";
  const [team, visitor] = await Promise.allSettled(
    buildDemoEmails(r, teamEmail, summary).map((email) => send(apiKey, from, email)),
  );
  if (team.status === "rejected") console.error("demo-request notify (team) failed:", team.reason);
  if (visitor.status === "rejected") console.error("demo-request notify (visitor) failed:", visitor.reason);
  return { team: team.status === "fulfilled", visitor: visitor.status === "fulfilled" };
}
