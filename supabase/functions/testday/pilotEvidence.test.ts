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

Deno.test("Mtskheta role handoffs bind a visit, a reference and an actual login to each pass", async () => {
  const { CASE_STEPS, caseSeatOptions, casePeopleOptions } = await import("./caseWalkthrough.ts");
  const ids = new Set(BILLING_GROUPS.flatMap((g) => g.cases.map((r) => r[0])));
  if (CASE_STEPS.length !== 22 || new Set(CASE_STEPS.map((s) => s.id)).size !== 22) throw Error("chronology");
  for (const s of CASE_STEPS) {
    const body = { case_id:s.id, observed:Object.fromEntries(s.amounts.map((a) => [a.key,a.value])),
      seat:"test.cashier",visit:s.training?"TEST-B":"TEST-A",reference:"REF-01",outcome:"pass",training_outcome:"independent" };
    if (s.links.some((id) => !ids.has(id)) || !pilotEvidence(body,"ნახა საკუთარი ანგარიშით",true)?.evidence.startsWith("ვიზიტი: "+body.visit+"\nჩანაწერი: REF-01\nანგარიში: test.cashier\n")
      || pilotEvidence({...body,seat:""},"test",true) || pilotEvidence({...body,reference:""},"test",true)
      || pilotEvidence({...body,visit:""},"test",true) || (s.training && pilotEvidence({...body,training_outcome:"help"},"test",true))) throw Error(s.id);
    if (!pilotEvidence({...body,seat:"",observed:{},outcome:"blocked",training_outcome:""},"seat missing",true)) throw Error("block "+s.id);
  }
  const roster = { departments:[{slug:"registration",seats:["test.hospital@unit.test","mts.clinic.registry@unit.test"]}],
    seats:["test.hospital@unit.test","mts.clinic.registry@unit.test"].map(email => ({email,role:"რეგისტრატორი"})),
    users:[{id:1,name:"საცდელი",dept_slug:"registration",roles:"რეგისტრატორი, მოლარე",seat_ok:true}] };
  if (caseSeatOptions("cashier",roster).length || caseSeatOptions("registrar",roster).length !== 1 || casePeopleOptions("cashier",roster).length !== 1) throw Error("seat vs person");
});
