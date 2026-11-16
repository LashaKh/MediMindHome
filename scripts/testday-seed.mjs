// Seeds the Mtskheta test-day portal (medimind.md/admin/testday) from the private staff files on this Mac.
// Departments, flows and teach points come from scripts/testday-content.mjs; people and test seats are read at
// runtime from ~/.medimind and go straight into Supabase. This file carries no names and no password.
// Re-running is safe: it upserts departments, users and seats and never touches ticks, issues or notes.
//
//   zsh -ic 'node scripts/testday-seed.mjs'          # needs SUPABASE_ACCESS_TOKEN (exported in ~/.zshrc)
//   node scripts/testday-seed.mjs --dry               # counts only, sends nothing
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FIRST_SCREEN, ROLE_KA, SEAT_NOTE, SEAT_ROLE_KA, SHEETS, TEST_SEATS, spotFor } from './testday-content.mjs';

const REF = 'kvsqtolsjggpyvdtdpss';
const SEATS = join(homedir(), '.medimind', 'staff-seats-202611');
const DRY = process.argv.includes('--dry');

// Same mapping as the PDF guide (rep-guide-pdf.mjs), so the page and the paper agree.
const shortDept = (name) => String(name).replace(/^\./u, '').replace(/\s*\(მცხეთა - მ\.ს\.ც\.\)\s*$/u, '').trim();
// Shared WebMed logins with no person behind them (AP 129 runs the warehouse, VIEW reads histories) never reach the HR
// roster, so they live in a private extra file: { matrix: [matrix-shaped rows], people: [roster-shaped rows] }.
const EXTRA = join(SEATS, 'extra-users.json');
const extra = existsSync(EXTRA) ? JSON.parse(readFileSync(EXTRA, 'utf8')) : { matrix: [], people: [] };
const matrix = [...JSON.parse(readFileSync(join(SEATS, 'matrix.json'), 'utf8')).rows, ...extra.matrix];
const roster = new Map([...JSON.parse(readFileSync(join(SEATS, 'roster.json'), 'utf8')).people, ...extra.people].map((p) => [String(p.code), p]));
const loginText = (l) => (typeof l === 'string' ? l : l?.username ?? l?.login ?? '');
const titleText = (t) => (typeof t === 'string' ? t : t?.name ?? t?.title ?? '');
const collator = new Intl.Collator('ka');

const users = matrix.map((m) => {
  const r = roster.get(String(m.code)) ?? {};
  const depts = (Array.isArray(r.departments) ? r.departments : []).map((d) => shortDept(d.name ?? d));
  const dept = depts.find((d) => !d.startsWith('ზოგადი') && !/\(/u.test(d)) ?? 'GENERAL';
  const roles = (m.roles || '').split(/\s+/u).filter(Boolean);
  const has = (...rs) => rs.some((x) => roles.includes(x));
  let sheet = SHEETS.find((s) => s.dept === dept)?.slug ?? 'general';
  if (has('billingManager', 'billingHead')) sheet = 'billing';
  else if (has('pharmacist', 'branchWarehouseManager') && !has('nurse', 'physician')) sheet = 'pharmacy';
  else if (dept === 'ადმინისტრაცია არასამედიცინო' && has('registrar', 'cashier', 'ambulatoryRegistrar')) sheet = 'registration';
  const seatOk = m.seat === 'ok';
  return {
    id: Number(m.code),
    dept_slug: sheet,
    name: m.name,
    title: [...new Set((Array.isArray(r.titles) ? r.titles : []).map(titleText).filter(Boolean))][0] ?? null,
    logins: [...new Set((Array.isArray(r.logins) ? r.logins : []).map(loginText).filter(Boolean))].join(', ') || null,
    how: !seatOk ? null : m.loginParity === 'ok' ? 'WebMed-ის მომხმარებლით' : 'ელფოსტით (ბრიფინგის პაკეტი)',
    roles: roles.map((c) => ROLE_KA[c] ?? c).join(', '),
    first_screen: !seatOk ? 'ადგილი არ აქვს, დღეს WebMed-ში რჩება' : (FIRST_SCREEN.find(([x]) => roles.includes(x))?.[1] ?? '„პაციენტის ჰაბი"'),
    spot: seatOk ? spotFor(roles) : ['დღეს WebMed-ში რჩება'],
    seat_ok: seatOk,
  };
});
// Sort inside each department by name, like the PDF.
users.sort((a, b) => collator.compare(a.name, b.name)).forEach((u, i) => { u.sort = i; });

const seatRows = readFileSync(join(homedir(), '.medimind', 'shadow-briefing', 'mtskheta', 'team-seats.csv'), 'utf8')
  .trim().split('\n').slice(1).map((l) => {
    const [email, , , roleCode, , password] = l.split(',');
    return { email, role: SEAT_ROLE_KA[roleCode] ?? roleCode, password };
  });
const seatEmail = (local) => seatRows.find((r) => r.email.startsWith(`${local}@`))?.email;

const departments = SHEETS.map((s, i) => ({
  slug: s.slug,
  title: s.title,
  sort: i,
  warn: s.noRoster ?? s.note ?? null,
  seat_note: SEAT_NOTE[s.slug] ?? null,
  seats: TEST_SEATS[s.slug].map(seatEmail).filter(Boolean),
  flows: s.actions.map(([w, steps, result]) => ({ w, steps, result })),
  teach: s.teach.map(([h, t]) => ({ h, t })),
}));

console.log(`departments ${departments.length} · users ${users.length} · seats ${seatRows.length}`);
if (DRY) process.exit(0);

// Dollar-quoted JSON keeps every Georgian quote and apostrophe intact.
const lit = (v) => `$j$${JSON.stringify(v)}$j$::jsonb`;
const sql = `
insert into testday_departments (slug, title, sort, warn, seat_note, seats, flows, teach)
select slug, title, sort, warn, seat_note, array(select jsonb_array_elements_text(seats)), flows, teach
from jsonb_to_recordset(${lit(departments)}) as x(slug text, title text, sort int, warn text, seat_note text, seats jsonb, flows jsonb, teach jsonb)
on conflict (slug) do update set title = excluded.title, sort = excluded.sort, warn = excluded.warn,
  seat_note = excluded.seat_note, seats = excluded.seats, flows = excluded.flows, teach = excluded.teach;

insert into testday_users (id, dept_slug, name, title, logins, how, roles, first_screen, spot, seat_ok, sort)
select * from jsonb_to_recordset(${lit(users)}) as x(id int, dept_slug text, name text, title text, logins text, how text,
  roles text, first_screen text, spot jsonb, seat_ok boolean, sort int)
on conflict (id) do update set dept_slug = excluded.dept_slug, name = excluded.name, title = excluded.title,
  logins = excluded.logins, how = excluded.how, roles = excluded.roles, first_screen = excluded.first_screen,
  spot = excluded.spot, seat_ok = excluded.seat_ok, sort = excluded.sort;

insert into testday_seats (email, role, password)
select * from jsonb_to_recordset(${lit(seatRows)}) as x(email text, role text, password text)
on conflict (email) do update set role = excluded.role, password = excluded.password;

select (select count(*) from testday_departments) d, (select count(*) from testday_users) u, (select count(*) from testday_seats) s;`;

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) throw new Error('SUPABASE_ACCESS_TOKEN not set (run through zsh -ic)');
const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: sql }),
});
const out = await res.text();
// Print only the counts, never row data.
console.log(res.status, res.ok ? out : out.slice(0, 300));
