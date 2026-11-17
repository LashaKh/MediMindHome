import { PILOT_GROUP, PILOT_STEPS } from "./billingPilot.ts";
import { BILLING_GROUPS } from "./billingAcceptance.ts";
import { pilotEvidence } from "./pilotEvidence.ts";

Deno.test("every exercise maps to Billing and accepts its own expected amounts", () => {
  const ids = new Set(BILLING_GROUPS.flatMap((g) => g.cases.map((row) => row[0])));
  if (PILOT_GROUP.cases.length !== 8 || new Set(PILOT_STEPS.map((s) => s.id)).size !== 8) throw Error("pilot steps");
  for (const step of PILOT_STEPS) {
    if (!step.links.length || !step.links.every((id) => ids.has(id))) throw Error(step.id);
    const observed = Object.fromEntries(step.amounts.map((a) => [a.key, a.value]));
    const result = pilotEvidence({ case_id: step.id, observed, outcome: "pass", training_outcome: "independent" }, "საცდელი ჩანაწერი");
    if (!result || step.amounts.some((a) => !result.evidence.includes(a.label))) throw Error(step.id);
  }
});

Deno.test("cash and training discrepancies remain open, unavailable amounts can be recorded", () => {
  const check = (observed: Record<string, number>, outcome: string, training_outcome: string) =>
    pilotEvidence({ case_id: "ER-08", observed, outcome, training_outcome }, "საცდელი ჩანაწერი");
  if (check({}, "pass", "independent") || check({ net: 80 }, "pass", "independent")
    || check({ net: 50 }, "pass", "help") || check({ net: 50, extra: 1 }, "pass", "independent")
    || !check({}, "blocked", "rebook") || !check({ net: 10 }, "fail", "help")) throw Error("invalid result");
});
