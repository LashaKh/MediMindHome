#!/usr/bin/env node
// One-shot surgery:
//  1. Extract the isometric `arch-wrapper` (SVG + Data-Flow callout) from deck.html
//     (the rich slide that is data-visibility="hidden" in the original deck).
//  2. In healthycore.html, replace the whole appendix region — slide A (simplified
//     architecture) through slide D (SAFE explained) — with ONE new section: the
//     appendix-framed rich architecture slide. This removes B (AI moments), C
//     (safety), D (SAFE) and swaps A's cards for the rich visual in a single splice.
// Uses content anchors (not line numbers) so it is robust to the live parallel edits.
import { readFileSync, writeFileSync } from 'node:fs';

const DECK = 'public/deck.html';
const HC = 'public/healthycore.html';

const deck = readFileSync(DECK, 'utf8');
const hc = readFileSync(HC, 'utf8');

// ── 1. Extract arch-wrapper from deck.html ───────────────────────────────
const awStart = deck.indexOf('<div class="arch-wrapper">');
const taglinePos = deck.indexOf('<div class="arch-tagline">', awStart);
if (awStart < 0 || taglinePos < 0) throw new Error('deck arch-wrapper/tagline not found');
const awCloseStart = deck.lastIndexOf('</div>', taglinePos);      // arch-wrapper's own close
const archWrapper = deck.slice(awStart, awCloseStart + '</div>'.length);
// sanity: must contain the SVG scene + the callout
if (!archWrapper.includes('class="arch-scene"') || !archWrapper.includes('obj-callout'))
  throw new Error('extracted arch-wrapper looks incomplete');

// ── 2. Locate the appendix region in healthycore.html ────────────────────
const aMark = hc.indexOf('APPENDIX A · the five-layer architecture');   // inside slide A's comment
if (aMark < 0) throw new Error('slide A anchor not found');
const regionStart = hc.lastIndexOf('<!--', aMark);                      // start of slide A's comment block
const dMark = hc.indexOf('APPENDIX · THE SAFE, EXPLAINED');             // inside slide D
if (dMark < 0) throw new Error('slide D anchor not found');
const dClose = hc.indexOf('</section>', dMark);
if (dClose < 0) throw new Error('slide D </section> not found');
const regionEnd = dClose + '</section>'.length;

// guard: region must currently contain the slides we intend to delete
const region = hc.slice(regionStart, regionEnd);
for (const needle of ['APPENDIX · AI MOMENTS', 'APPENDIX · SAFETY', 'APPENDIX · THE SAFE, EXPLAINED', 'body made of']) {
  if (!region.includes(needle)) throw new Error(`region missing expected slide marker: ${needle}`);
}

// ── 3. Build the new single appendix section ─────────────────────────────
const newSection = `      <!-- ═══════════════════════════════════════════════
           APPENDIX A · five-layer architecture (isometric visual)
           ═══════════════════════════════════════════════ -->
      <section>
        <div class="slide-inner">
          <div class="slide-label"><span class="label-num">A</span><span class="lang-en">APPENDIX · ARCHITECTURE</span><span class="lang-ka" style="display:none;">დანართი · არქიტექტურა</span></div>
          <h2 class="headline-big" style="font-size: 1.85em; line-height: 1.05;"><span class="lang-en">A hospital with a body made of <em>software.</em></span><span class="lang-ka" style="display:none;">ჰოსპიტალი, რომლის სხეულიც <em>პროგრამული უზრუნველყოფაა.</em></span></h2>
          <p class="headline-sub" style="margin: 10px 0 14px; max-width: 920px;"><span class="lang-en">Every department. Every workflow. One AI-native codebase, built ground-up on FHIR R4.</span><span class="lang-ka" style="display:none;">ყველა დეპარტამენტი. ყველა სამუშაო პროცესი. ერთიანი AI-ნატიური კოდი, აგებული FHIR R4-ზე.</span></p>

${archWrapper}

          <div class="arch-tagline"><span class="lang-en">Not an EMR. Not an integration layer. <em>The whole thing.</em></span><span class="lang-ka" style="display:none;">არ არის EMR. არ არის ინტეგრაციის შრე. <em>სრული სისტემა.</em></span></div>
        </div>
        <a class="brand-footer" href="https://medimind.md" target="_blank" rel="noopener noreferrer"><img src="/deck-assets/logo-icon-dark.svg" alt=""><span>medimind.md</span></a>
        <aside class="notes">
          <span class="lang-en">Appendix A — the architecture, for the technical stakeholder. Five layers: Heart is the FHIR R4 model, the storage primitive — 80+ resources, one living model, ground-up. Brain is AI reasoning across the Heart. Muscle reaches into MOH, insurance, pharmacy, DICOM, SMS. Skin is every UI a hospital role touches. Nerve carries every event and audit signal. Not an EMR, not an integration layer — the whole thing.</span><span class="lang-ka" style="display:none;">დანართი A — არქიტექტურა ტექნიკური მხარისთვის. ხუთი შრე: გული არის FHIR R4 მოდელი, შენახვის ბაზა — 80+ რესურსი, ერთიანი ცოცხალი მოდელი. ტვინი არის AI, რომელიც აანალიზებს გულს. კუნთი წვდება ჯანდაცვის სამინისტროს, დაზღვევას, აფთიაქს, DICOM-სა და SMS-ს. კანი არის ყველა ინტერფეისი. ნერვი ატარებს ყველა მოვლენასა და აუდიტის სიგნალს. არ არის EMR ან ინტეგრაციის შრე — სრული სისტემა.</span>
        </aside>
      </section>`;

const out = hc.slice(0, regionStart) + newSection + hc.slice(regionEnd);

// ── 4. Report + write ────────────────────────────────────────────────────
console.log('arch-wrapper bytes extracted :', archWrapper.length);
console.log('region replaced (bytes)      :', region.length, '→', newSection.length);
console.log('removed slides               : AI MOMENTS, SAFETY, SAFE EXPLAINED');
console.log('file size                    :', hc.length, '→', out.length);
writeFileSync(HC, out, 'utf8');
console.log('✅ wrote', HC);
