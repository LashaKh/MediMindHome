// Turns the test-day feedback register into portal issue items (needs migration 0007).
// Reads the private export ~/.medimind/testday-feedback-1116/items.json (made by the feedback lane; never in git):
//   [{ ref, dept_slug, user_id|null, source, flow_idx|null, what, status, answer|null, class }]
// Each item is inserted once, keyed by ref; re-running skips refs already there, so a state the team or a tester
// changed in the portal is never overwritten. The original person notes and hand-in texts are not touched.
//
//   zsh -ic 'node scripts/testday-feedback-seed.mjs'          # needs SUPABASE_ACCESS_TOKEN (exported in ~/.zshrc)
//   node scripts/testday-feedback-seed.mjs --dry               # checks the file, sends nothing
//   node scripts/testday-feedback-seed.mjs --file <path>       # another export
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const REF = 'kvsqtolsjggpyvdtdpss';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const FILE = args.includes('--file') ? args[args.indexOf('--file') + 1] : join(homedir(), '.medimind', 'testday-feedback-1116', 'items.json');
const STATUSES = new Set(['open', 'work', 'fixed', 'closed', 'answered']);

const raw = JSON.parse(readFileSync(FILE, 'utf8'));
const items = (Array.isArray(raw) ? raw : raw.items).map((x, n) => {
  const bad = (why) => { throw new Error(`item ${n + 1} (${x.ref ?? 'no ref'}): ${why}`); };
  if (!x.ref) bad('ref missing');
  if (!x.what?.trim()) bad('what missing');
  if (!STATUSES.has(x.status)) bad(`status "${x.status}"`);
  if (/[—–]/u.test(`${x.what} ${x.answer ?? ''}`)) bad('em or en dash in Georgian text');
  if ((x.status === 'fixed' || x.status === 'answered') && !x.answer?.trim()) bad(`${x.status} needs an answer`);
  return {
    ref: String(x.ref), dept_slug: x.dept_slug || null, user_id: x.user_id ?? null, flow_idx: x.flow_idx ?? null,
    source: x.source || null, what: x.what.trim(), status: x.status, answer: x.answer?.trim() || null,
    reported_by: 'პირველი ტესტ-დღე',
  };
});
console.log(`${items.length} items in ${FILE}`);
const by = {};
for (const i of items) by[i.status] = (by[i.status] ?? 0) + 1;
console.log('by status:', by);
if (DRY) process.exit(0);

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) { console.error('BLOCKED: no SUPABASE_ACCESS_TOKEN (run through zsh -ic)'); process.exit(2); }
async function sql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}
// The JSON travels inside a dollar-quoted literal, so no value is ever spliced into the SQL text.
const payload = JSON.stringify(items);
if (payload.includes('$tdseed$')) throw new Error('payload contains the quote tag');
const rows = await sql(`
  with src as (select * from json_to_recordset($tdseed$${payload}$tdseed$::json)
    as x(ref text, dept_slug text, user_id bigint, flow_idx int, source text, what text, status text, answer text, reported_by text))
  insert into public.testday_issues (ref, dept_slug, user_id, flow_idx, source, what, status, answer, reported_by, fixed_at, closed_at)
  select ref, dept_slug, user_id, flow_idx, source, what, status, answer, reported_by,
         case when status = 'fixed' then now() end, case when status in ('closed', 'answered') then now() end
  from src
  on conflict (ref) where ref is not null do nothing
  returning ref`);
console.log(`inserted ${rows.length}, skipped ${items.length - rows.length} (already there)`);
