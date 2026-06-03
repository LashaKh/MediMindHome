#!/usr/bin/env node
// Weave 8 strategic signals into healthycore.html via exact-string replacements.
// Each edit asserts its anchor was present (guards against the live parallel editor).
// Bilingual: every edit updates both lang-en and the hidden lang-ka twin.
import { readFileSync, writeFileSync } from 'node:fs';

const HC = 'public/healthycore.html';
let hc = readFileSync(HC, 'utf8');
let applied = 0;

function sub(label, oldStr, newStr, { fatal = true } = {}) {
  const n = hc.split(oldStr).length - 1;
  if (n === 0) { const m = `✗ NOT FOUND: ${label}`; if (fatal) throw new Error(m); console.warn(m); return; }
  if (n > 1)  { const m = `✗ AMBIGUOUS (${n}×): ${label}`; if (fatal) throw new Error(m); console.warn(m); return; }
  hc = hc.replace(oldStr, newStr);
  applied++; console.log(`✓ ${label}`);
}

// 1 · Slide 01 PROOF — add "FHIR R4 standard" trust chip (after Government-recognized)
sub('01 trust chip',
  `            <span class="chip"><span class="lang-en">Government-recognized</span><span class="lang-ka" style="display:none;">სახელმწიფოს მიერ აღიარებული</span></span>`,
  `            <span class="chip"><span class="lang-en">Government-recognized</span><span class="lang-ka" style="display:none;">სახელმწიფოს მიერ აღიარებული</span></span>\n            <span class="chip"><span class="lang-en">FHIR R4 standard</span><span class="lang-ka" style="display:none;">FHIR R4 სტანდარტი</span></span>`);

// 2 · Slide 02 LIABILITY — sharpen "Outdated & insecure" description
sub('02 must-replace',
  `<div class="hc-risk-desc"><span class="lang-en">Runs today. Can't carry you into the next decade.</span><span class="lang-ka" style="display:none;">დღეს მუშაობს. ვერ გაგიყვანთ მომდევნო ათწლეულში.</span></div>`,
  `<div class="hc-risk-desc"><span class="lang-en">~15 years behind · weak security · not on any global standard.</span><span class="lang-ka" style="display:none;">~15 წლით ჩამორჩენილი · სუსტი დაცვა · არ შეესაბამება გლობალურ სტანდარტს.</span></div>`);

// 3 · Slide 04 OFFER — add the GEL 10,000/mo system-level anchor into the sub
sub('04 price anchor',
  `<p class="headline-sub"><span class="lang-en">US-level, gold-standard — not a stripped-down free.</span><span class="lang-ka" style="display:none;">აშშ-ს დონის, ოქროს სტანდარტი — და არა შეზღუდული ვერსია.</span></p>`,
  `<p class="headline-sub"><span class="lang-en">A modern replacement runs ~GEL 10,000/month. Ours is free — gold-standard, not stripped-down.</span><span class="lang-ka" style="display:none;">თანამედროვე ჩანაცვლება ~GEL 10,000/თვეში ჯდება. ჩვენი უფასოა — ოქროს სტანდარტი, და არა შეზღუდული ვერსია.</span></p>`);

// 5 · Slide 07 NOT AN EMR — sharpen "First in the world" → only one built FHIR-native
sub('07 no-competitor',
  `<p><span class="lang-en">One of the first live, AI-native hospital systems running anywhere.</span><span class="lang-ka" style="display:none;">ერთ-ერთი პირველი ცოცხალი, AI-ნატიური ჰოსპიტალური სისტემა მსოფლიოში.</span></p>`,
  `<p><span class="lang-en">Others bolt FHIR on as an export. We're the only one built FHIR-native, ground-up.</span><span class="lang-ka" style="display:none;">სხვები FHIR-ს ზემოდან აბამენ. ჩვენ ერთადერთები ვართ, ვინც ნულიდან FHIR-ზე ავაშენეთ.</span></p>`);

// 6 · Slide 08 AMBITION — Stage 1 reframed to national standard-setting
sub('08 national standard',
  `<div class="stage-subtitle"><span class="lang-en">Dominate the home market</span><span class="lang-ka" style="display:none;">ადგილობრივი ბაზრის დომინაცია</span></div>`,
  `<div class="stage-subtitle"><span class="lang-en">Set the national standard</span><span class="lang-ka" style="display:none;">ეროვნული სტანდარტის დაწესება</span></div>`);

// 7a · Slide 09 PARTNER DEAL — tag "flagship" → "founding partner"
sub('09 founding-partner tag',
  `<span class="pp-tag"><span class="lang-en">flagship partner</span><span class="lang-ka" style="display:none;">ფლაგმანი პარტნიორი</span></span>`,
  `<span class="pp-tag"><span class="lang-en">founding partner</span><span class="lang-ka" style="display:none;">დამფუძნებელი პარტნიორი</span></span>`);

// 7b · Slide 09 — 4th list item → total dedication
sub('09 dedication item',
  `<li class="pp-yes"><span class="lang-en"><strong>Flagship partner</strong> — not just a backer</span><span class="lang-ka" style="display:none;"><strong>ფლაგმანი პარტნიორი</strong> — და არა უბრალოდ ინვესტორი</span></li>`,
  `<li class="pp-yes"><span class="lang-en"><strong>Total dedication</strong> — every resource, one hospital, a decade.</span><span class="lang-ka" style="display:none;"><strong>სრული თავდადება</strong> — ყველა რესურსი, ერთი კლინიკა, ათწლეული.</span></li>`);

// 8 · Slide 10 CLOSE — add "Founding partner" close-term chip
sub('10 founding-partner chip',
  `              <span class="hc-close-term"><span class="lang-en">A stake in what's next</span><span class="lang-ka" style="display:none;">წილი მომავალში</span></span>`,
  `              <span class="hc-close-term"><span class="lang-en">A stake in what's next</span><span class="lang-ka" style="display:none;">წილი მომავალში</span></span>\n              <span class="hc-close-term"><span class="lang-en">Founding partner</span><span class="lang-ka" style="display:none;">დამფუძნებელი პარტნიორი</span></span>`);

// 6b · Slide 08 speaker notes — fuller national-FHIR-mission vision (soft: notes only)
sub('08 notes (national mission)',
  `The early bet compounds.`,
  `And at home the ambition is bigger than market share — the roadmap is one universal, government-backed product that puts every hospital in the country on the FHIR standard. The early bet compounds.`,
  { fatal: false });

writeFileSync(HC, hc, 'utf8');
console.log(`\n${applied} edits applied → ${HC}`);
