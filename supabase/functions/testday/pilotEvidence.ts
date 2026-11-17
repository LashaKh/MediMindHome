import { PILOT_STEPS } from "./billingPilot.ts";

import { CASE_STEPS } from "./caseWalkthrough.ts";

const trainingLabels = {
  independent: "დამოუკიდებლად", help: "დახმარებით", rebook: "სწავლება ხელახლა დაიგეგმა",
};

export function pilotEvidence(body: Record<string, unknown>, note: string, walkthrough = false) {
  const step = (walkthrough ? CASE_STEPS : PILOT_STEPS).find((s) => s.id === body.case_id);
  const observed = body.observed;
  if (!step || note.length > 1100 || !observed || typeof observed !== "object" || Array.isArray(observed)) return null;
  const amounts = new Map(Object.entries(observed));
  if ([...amounts.keys()].some((key) => !step.amounts.some((a) => a.key === key))) return null;

  const lines: string[] = [];
  if (walkthrough) {
    const value = (v: unknown, max: number) => typeof v === "string" && !/[\r\n]/.test(v) && v.trim().length <= max ? v.trim() : "";
    const visit = value(body.visit, 100);
    const ref = value(body.reference, 200);
    const seat = value(body.seat, 160);
    if (body.outcome === "pass" && (!visit || !ref || !/^[\p{L}\p{N}._@+-]+$/u.test(seat))) return null;
    lines.push(`ვიზიტი: ${visit}`, `ჩანაწერი: ${ref}`, `ანგარიში: ${seat}`);
  }
  lines.push(note);
  for (const { key, label, value } of step.amounts) {
    const actual = amounts.get(key);
    if (actual === undefined && body.outcome !== "pass") continue;
    if (typeof actual !== "number" || !Number.isFinite(actual) || Math.abs(actual) > 1e9
      || (body.outcome === "pass" && actual !== value)) return null;
    lines.push(`${label}: ${actual} ₾ (მოსალოდნელი: ${value} ₾)`);
  }
  if (step.id === "ER-08" || ("training" in step && step.training && (body.outcome === "pass" || body.training_outcome))) {
    const key = body.training_outcome;
    if (key !== "independent" && key !== "help" && key !== "rebook") return null;
    if (body.outcome === "pass" && key !== "independent") return null;
    lines.push(`სწავლება: ${trainingLabels[key]}`);
  }
  if (body.origin_build) lines.push(`საწყისი ვერსია: ${body.origin_build}`);
  if (lines.join("\n").length > 2000) return null;
  return { step, evidence: lines.join("\n") };
}
