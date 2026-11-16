// Local-only fake data for the test-day portal, so the UI can be built and screenshotted without real staff
// names and without writing ticks into the live test-day tables. Only loaded on the Vite dev server with ?mock
// (see testdayApi.ts); production builds never call it. Names here are invented.
import type { Department, FlowCheck, Issue, Note, State, User, UserCheck } from "./testdayApi";

const flow = (w: string, n: number) => ({ w, steps: Array.from({ length: n }, (_, i) => `ნაბიჯი ${i + 1}: „ეკრანი" → „ღილაკი"`), result: "ეკრანზე ჩანს ახალი ჩანაწერი" });
const FLOWS = ["პაციენტის მოძებნა", "ტრიაჟი და ER-ის საწოლი", "ლაბორატორიული კვლევის დანიშვნა", "მედიკამენტის დანიშვნა", "მედიკამენტის შეყვანა (MAR)", "ვიტალური ნიშნები"];
const dept = (slug: string, title: string, flows: number, extra: Partial<Department> = {}): Department => ({
  slug, title, sort: 0, warn: null, seat_note: null, seats: ["mts.nurse@test.ge"],
  flows: FLOWS.slice(0, flows).map((w, i) => flow(w, 3 + (i % 3))),
  teach: [{ h: "MAR", t: "დოზა იწერება იმ ერთეულში, რომლითაც აფთიაქი გასცემს." }], ...extra,
});
const DEPTS: Department[] = [
  dept("er", "ემერჯენსი", 6, { warn: "ER-ში დილით 08:00-დან 08:30-მდე ცვლის ჩაბარებაა: ამ დროს ნუ შეაწუხებთ." }),
  dept("therapy", "თერაპია", 5),
  dept("surgery", "ქირურგია", 4),
  dept("icu", "ინტენსიური თერაპია", 5),
  dept("reg", "რეგისტრატურა და სალარო", 4),
  dept("cathlab", "კათეტერიზაციის ლაბორატორია და ინტერვენციული კარდიოლოგიის განყოფილება", 3),
  dept("lab", "ლაბორატორია", 3),
  dept("pharm", "აფთიაქი და საწყობი", 2),
  dept("empty", "რენტგენი", 3, { seats: [] }),
];
const FIRST = ["ნინო", "გიორგი", "მარიამ", "ლევან", "თამარ", "დავით", "ეკატერინე", "ალექსანდრე", "ქეთევან", "ნიკოლოზ"];
const LAST = ["ტესტაძე", "ნიმუშიშვილი", "საცდელიძე", "მაგალითური", "ფიქციაშვილი-გამოგონილიძე"];
const ROLES = ["ექთანი", "ექიმი", "უფროსი ექთანი", "რეგისტრატორი", "ლაბორანტი"];
const SIZES: Record<string, number> = { er: 14, therapy: 19, surgery: 9, icu: 12, reg: 8, cathlab: 4, lab: 3, pharm: 2, empty: 0 };
let uid = 1;
const USERS: User[] = DEPTS.flatMap((d) => Array.from({ length: SIZES[d.slug] }, (_, i): User => {
  const id = uid++;
  return {
    id, dept_slug: d.slug, name: `${FIRST[id % FIRST.length]} ${LAST[id % LAST.length]}`, title: i === 0 ? "განყოფილების ხელმძღვანელი" : null,
    logins: id % 9 === 0 ? null : `T${String(1000 + id)}`, how: null, roles: ROLES[id % ROLES.length],
    first_screen: "„პაციენტის ჰაბი\"", spot: ["პაციენტის მოძებნა", "ვიტალური ნიშნები", "MAR"], seat_ok: id % 13 !== 0, sort: i,
  };
}));
const at = (min: number) => new Date(Date.now() - min * 60_000).toISOString();
const check = (u: User, p: Partial<UserCheck>): UserCheck => ({
  user_id: u.id, signed_in: false, sign_in_failed: false, key_screen_ok: false, actions_ok: false, note: null, checked_by: "ტესტერი", checked_at: at(20), ...p,
});
const byDept = (s: string) => USERS.filter((u) => u.dept_slug === s);
const CHECKS: UserCheck[] = [
  ...byDept("er").slice(0, 6).map((u) => check(u, { signed_in: true, key_screen_ok: true, actions_ok: true })),
  check(byDept("er")[6], { sign_in_failed: true, note: "„მომხმარებელი ან პაროლი არასწორია\"" }),
  check(byDept("er")[7], { signed_in: true }),
  ...byDept("lab").map((u) => check(u, { signed_in: true, key_screen_ok: true, actions_ok: true })),
  ...byDept("pharm").map((u) => check(u, { signed_in: true, key_screen_ok: true, actions_ok: true })),
  check(byDept("therapy")[0], { signed_in: true, key_screen_ok: true }),
  check(byDept("icu")[2], { sign_in_failed: true }),
  check(byDept("reg")[1], { signed_in: true, note: "ნაწილი ბარათით, ნაწილი ნაღდით ვერ გავყავი. ამ როლით ამბულატორია არ ჩანს." }),
  ...byDept("reg").slice(2, 6).map((u) => check(u, { signed_in: true })),
];
const FLOW_CHECKS: FlowCheck[] = [
  ...[0, 1, 2, 3].map((i) => ({ dept_slug: "er", flow_idx: i, done: true, note: null, checked_by: "ტესტერი", checked_at: at(30 - i) })),
  ...[0, 1, 2].map((i) => ({ dept_slug: "lab", flow_idx: i, done: true, note: null, checked_by: "ტესტერი", checked_at: at(40) })),
  ...[0, 1].map((i) => ({ dept_slug: "pharm", flow_idx: i, done: true, note: null, checked_by: "ტესტერი", checked_at: at(50) })),
];
let iid = 1;
const issue = (dept_slug: string | null, what: string, status: Issue["status"], extra: Partial<Issue> = {}): Issue => ({
  id: iid++, created_at: at(90 - iid * 7), dept_slug, person: null, screen: null, what, expected: null, pr_url: null, status, reported_by: "ტესტერი", updated_at: at(5), ...extra,
});
const ER = byDept("er"), REG = byDept("reg");
const ISSUES: Issue[] = [
  issue("er", "ტრიაჟის დაფაზე ახალი პაციენტი 2 წუთის შემდეგ გამოჩნდა.", "open", { screen: "ტრიაჟის დაფა", flow_idx: 1, source: "handin:er:roster" }),
  issue("er", "კარდიოლოგი შეტყობინებებში ვერ ხედავს ემერჯენსის კონსულტაციას.", "fixed", { source: "handin:er:roster", fixed_at: at(60), answer: "კონსულტაცია ახლა კარდიოლოგიას და ტრავმატოლოგიას მისდის. სცადეთ: დანიშნეთ კონსულტაცია და ჰკითხეთ კარდიოლოგს, ხედავს თუ არა „ახალში“." }),
  issue("er", "MAR-ში დოზის ერთეული მგ-ში ჩანს, აფთიაქი ამპულით გასცემს.", "work", { pr_url: "https://github.com/example/pr/1", flow_idx: 4 }),
  issue("er", "ფორმა 300-12/ა: ლუმბალური პუნქციის თანხმობა ვერ ვიპოვე.", "answered", { source: "handin:er:roster", closed_at: at(30), answer: "ეს ფორმა ჯერ არ არის. დღეს გამოიყენეთ ქაღალდის თანხმობა, ფორმას მალე დავამატებთ." }),
  issue("er", "4-300/ა: გასაგზავნი ველების პანელი ძალიან პატარაა.", "closed", { user_id: ER[0].id, closed_at: at(20), answer: "პანელი გავადიდეთ." }),
  issue("reg", "ნაწილი ბარათით, ნაწილი ნაღდით: გადახდა ვერ გავყავი.", "fixed", { user_id: REG[1].id, source: `note:user:${REG[1].id}`, fixed_at: at(45), answer: "სალაროში ახლა ორი გადახდის ხაზი შეიძლება. სცადეთ: ჯერ ბარათით ნაწილი, მერე „დამატება“ და ნაღდი." }),
  issue("reg", "ამ როლით ამბულატორიული პაციენტები არ ჩანს.", "open", { user_id: REG[1].id, source: `note:user:${REG[1].id}`, recheck_note: "გვერდი ისევ ცარიელია, 09:40" }),
  issue("icu", "ვერ შევიდა: პაროლის შეცვლის ფანჯარა არ იხურება.", "open"),
  issue(null, "Shadow-ის მისამართი ზოგ კომპიუტერზე სერტიფიკატის გაფრთხილებას აჩვენებს.", "closed", { closed_at: at(60 * 20), answer: "სერტიფიკატი განახლდა." }),
];
const NOTES: Note[] = [
  { dept_slug: "lab", handin: { failed: "არავინ", other: "ყველაფერი გაიარა." }, updated_by: "ტესტერი", updated_at: at(10) },
  { dept_slug: "er", handin: { roster: "1. კარდიოლოგი კონსულტაციას ვერ ხედავს. 2. ტრიაჟის დაფა აგვიანებს. 3. ლუმბალური პუნქციის თანხმობა არ არის." }, updated_by: "ტესტერი", updated_at: at(300) },
];

const store: State = {
  departments: DEPTS.map((d, i) => ({ ...d, sort: i })), users: USERS, userChecks: CHECKS, flowChecks: FLOW_CHECKS,
  issues: ISSUES, seats: [{ email: "mts.nurse@test.ge", role: "ექთანი", password: "test-only" }], notes: NOTES, at: new Date().toISOString(),
};

const mode = () => new URLSearchParams(window.location.search).get("mock") ?? sessionStorage.getItem("td-mock") ?? "";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockState(): Promise<State> {
  const m = mode();
  await wait(m === "slow" ? 60_000 : 250);
  if (m === "error") throw Object.assign(new Error("network"), { status: 0 });
  return { ...store, at: new Date().toISOString() };
}

export async function mockWrite(action: string, p: Record<string, unknown>): Promise<unknown> {
  await wait(200);
  const by = String(p.by ?? "");
  const now = new Date().toISOString();
  if (action === "tick_user") {
    const id = Number(p.user_id);
    const prev = store.userChecks.find((c) => c.user_id === id) ?? check({ id } as User, {});
    const row = { ...prev, [String(p.field)]: p.value, checked_by: by, checked_at: now };
    store.userChecks = [...store.userChecks.filter((c) => c.user_id !== id), row];
    return row;
  }
  if (action === "tick_flow") {
    const prev = store.flowChecks.find((f) => f.dept_slug === p.dept && f.flow_idx === p.idx);
    const row: FlowCheck = { dept_slug: String(p.dept), flow_idx: Number(p.idx), done: false, note: null, ...prev, ...(p.done !== undefined ? { done: !!p.done } : {}), ...(p.note !== undefined ? { note: p.note as string | null } : {}), checked_by: by, checked_at: now };
    store.flowChecks = [...store.flowChecks.filter((f) => f !== prev), row];
    return row;
  }
  if (action === "issue_add") {
    const row = issue((p.dept as string) || null, String(p.what), "open", { person: (p.person as string) || null, screen: (p.screen as string) || null, expected: (p.expected as string) || null, pr_url: (p.pr_url as string) || null, reported_by: by, created_at: now, user_id: (p.user_id as number) ?? null, flow_idx: (p.flow_idx as number) ?? null });
    store.issues = [row, ...store.issues];
    return row;
  }
  if (action === "issue_update") {
    const prev = store.issues.find((i) => i.id === p.id)!;
    const st = p.status as Issue["status"] | undefined;
    const row = {
      ...prev, ...(st ? { status: st } : {}), ...(p.pr_url !== undefined ? { pr_url: p.pr_url } : {}),
      ...(p.answer !== undefined ? { answer: p.answer } : {}), ...(p.recheck_note !== undefined ? { recheck_note: p.recheck_note } : {}),
      ...(st === "fixed" ? { fixed_at: now } : {}), ...(st === "closed" || st === "answered" || st === "wontfix" ? { closed_at: now } : {}),
      ...(st === "open" || st === "work" ? { closed_at: null } : {}), updated_at: now,
    } as Issue;
    store.issues = store.issues.map((i) => (i.id === row.id ? row : i));
    return row;
  }
  if (action === "handin") {
    const row: Note = { dept_slug: String(p.dept), handin: p.handin as Record<string, string>, updated_by: by, updated_at: now };
    store.notes = [...store.notes.filter((n) => n.dept_slug !== row.dept_slug), row];
    return row;
  }
  throw new Error("unknown_action");
}
