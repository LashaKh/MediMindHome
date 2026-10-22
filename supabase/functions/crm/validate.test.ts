import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  applyRules,
  cleanAccountFields,
  cleanDemoRequest,
  isIsoDate,
  sameName,
  tbilisiToday,
} from "./validate.ts";

const TODAY = "2026-10-22";

Deno.test("keeps known fields, trims text and turns blanks into null", () => {
  const { patch, errors } = cleanAccountFields({
    name: "  New Hospitals ",
    city: "",
    amount_gel: "30,000",
    next_step_date: "2026-10-28",
    stage: "qualified",
    hacked_column: "DROP TABLE",
  });
  assertEquals(errors, []);
  assertEquals(patch, {
    name: "New Hospitals",
    city: null,
    amount_gel: 30000,
    next_step_date: "2026-10-28",
    stage: "qualified",
  });
});

Deno.test("rejects bad values instead of saving them", () => {
  const { errors } = cleanAccountFields({
    name: "",
    stage: "won-maybe",
    next_step_date: "28/10/2026",
    amount_gel: -5,
    sites: 2.5,
    excluded: "yes",
    notes: "x".repeat(10001),
  });
  assertEquals(errors.length, 7);
});

Deno.test("errors use the names people see in the CRM", () => {
  assertEquals(cleanAccountFields({ amount_gel: "lots" }).errors, [
    "Deal amount must be a number (0 or more), like 30000",
  ]);
  assertEquals(cleanAccountFields({ name: " " }).errors, ["Name is required"]);
});

Deno.test("isIsoDate rejects impossible dates", () => {
  assertEquals(isIsoDate("2026-02-30"), false);
  assertEquals(isIsoDate("2026-02-28"), true);
});

Deno.test("a new deal starts at Discovery, active, with today as stage date", () => {
  const out = applyRules(null, { kind: "deal", name: "X" }, TODAY);
  assertEquals(out.stage, "discovery");
  assertEquals(out.stage_since, TODAY);
  assertEquals(out.status, "active");
});

Deno.test("targets and anchors never carry a stage", () => {
  assertEquals(applyRules(null, { kind: "target", name: "X", stage: "proposal" }, TODAY).stage, null);
  assertEquals(applyRules({ kind: "deal", stage: "qualified" }, { kind: "anchor" }, TODAY).stage, null);
});

Deno.test("moving a stage records its milestone once and restarts the stage clock", () => {
  const current = { kind: "deal", stage: "qualified", stage_since: "2026-09-01", eval_agreed_at: null };
  const out = applyRules(current, { stage: "evaluation_agreed" }, TODAY);
  assertEquals(out.stage_since, TODAY);
  assertEquals(out.eval_agreed_at, TODAY);

  const again = applyRules({ ...current, eval_agreed_at: "2026-09-15" }, { stage: "evaluation_agreed" }, TODAY);
  assertEquals("eval_agreed_at" in again, false);
});

Deno.test("promoting a target sets first contact and Discovery", () => {
  const out = applyRules({ kind: "target", stage: null, first_contact_at: null }, { kind: "deal" }, TODAY);
  assertEquals(out.stage, "discovery");
  assertEquals(out.first_contact_at, TODAY);
});

Deno.test("undo restores the old dates exactly, even when they were empty", () => {
  const current = { kind: "deal", stage: "qualified", stage_since: TODAY, sql_at: TODAY };
  const out = applyRules(current, { stage: "discovery", stage_since: null, sql_at: null }, TODAY);
  assertEquals(out.stage, "discovery");
  assertEquals(out.stage_since, null);
  assertEquals(out.sql_at, null);
});

Deno.test("a deal entered as already lost gets no status; reopening it gets Active", () => {
  const lost = applyRules(null, { kind: "deal", name: "X", stage: "lost", lost_reason: "Bad fit" }, TODAY);
  assertEquals("status" in lost, false);
  const reopened = applyRules({ kind: "deal", stage: "lost", status: null }, { stage: "discovery" }, TODAY);
  assertEquals(reopened.status, "active");
});

Deno.test("an unchanged stage leaves the stage clock alone", () => {
  const out = applyRules({ kind: "deal", stage: "proposal", status: "active" }, { owner: "Irakli" }, TODAY);
  assertEquals("stage_since" in out, false);
});

Deno.test("demo request needs a name, a valid email and an organization", () => {
  assertEquals(cleanDemoRequest({ firstName: "Nino" }).errors.length, 3);
  const { request, errors } = cleanDemoRequest({
    firstName: "Nino",
    lastName: "B",
    email: "nino@hospital.ge",
    companyName: "Test Clinic",
    unknown: "ignored",
  });
  assertEquals(errors, []);
  assertEquals(Object.keys(request).sort(), ["companyName", "email", "firstName", "lastName"]);
  assertEquals(cleanDemoRequest({ firstName: "a", lastName: "b", email: "nope", companyName: "c" }).errors, [
    "email is not valid",
  ]);
});

Deno.test("a website request finds its hospital by name, never by wildcard", () => {
  assertEquals(sameName("  Aversi   clinic ", "Aversi Clinic"), true);
  assertEquals(sameName("*", "Aversi Clinic"), false);
  assertEquals(sameName("50%_Clinic", "500 Clinic"), false);
});

Deno.test("numbers: decimal commas are refused, blanks are empty, sites fit the column", () => {
  assertEquals(cleanAccountFields({ team_hours: "2,5" }).errors, ["Team hours: use a dot for decimals, like 2.5"]);
  assertEquals(cleanAccountFields({ amount_gel: "30,000", team_hours: "   " }).patch, { amount_gel: 30000, team_hours: null });
  assertEquals(cleanAccountFields({ sites: "3000000000" }).errors.length, 1);
});

Deno.test("Tbilisi date is ahead of UTC late in the evening", () => {
  assertEquals(tbilisiToday(new Date("2026-10-22T21:30:00Z")), "2026-10-23");
});
