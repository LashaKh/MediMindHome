import { createPreview } from './hospitals-motion-preview.js?v=45052f0d82';

// The chosen comparison becomes the ordinary slide, with normal deck navigation.
export function connectJourneys(slide, reveal, env = window) {
  const doc = slide.ownerDocument;
  const printExport = new URLSearchParams(env.location.search).has('print-pdf');
  const experience = createPreview(slide, env, {
    comparison: false, mode: 'journeys', startImmediately: false, static: printExport
  });
  let keyboard = false;
  const language = () => doc.documentElement.lang;
  function onSlide({ currentSlide }) {
    experience.setLanguage(language());
    if (currentSlide === slide) experience.setMode('journeys', !keyboard && !printExport);
    else experience.suspend();
  }
  const onKeyboard = () => { keyboard = true; };
  const onPointer = () => { keyboard = false; };
  const onPageShow = event => { if (event.persisted) onSlide({ currentSlide: reveal.getCurrentSlide() }); };
  const observer = new env.MutationObserver(() => experience.setLanguage(language()));
  observer.observe(doc.body, { attributes: true, attributeFilter: ['class'] });
  reveal.on('slidechanged', onSlide);
  env.addEventListener('keydown', onKeyboard, true);
  env.addEventListener('pointerdown', onPointer, true);
  env.addEventListener('pageshow', onPageShow);
  onSlide({ currentSlide: reveal.getCurrentSlide() });
  function destroy() {
    observer.disconnect();
    reveal.off('slidechanged', onSlide);
    env.removeEventListener('keydown', onKeyboard, true);
    env.removeEventListener('pointerdown', onPointer, true);
    env.removeEventListener('pageshow', onPageShow);
    experience.destroy();
  }
  return { ...experience, destroy };
}

async function start() {
  const slide = document.querySelector('[data-hai-experience="journeys"]');
  if (!slide || !window.Reveal || new URLSearchParams(location.search).has('motion-preview')) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/deck-assets/hospitals-motion-preview.css?v=3a881c782a';
  const stylesReady = new Promise((resolve, reject) => {
    stylesheet.addEventListener('load', resolve, { once: true });
    stylesheet.addEventListener('error', () => reject(new Error('Could not load outcome journey styles.')), { once: true });
  });
  document.head.append(stylesheet);
  const revealReady = window.Reveal.isReady() ? Promise.resolve() : new Promise(resolve => window.Reveal.on('ready', resolve));
  await Promise.all([stylesReady, revealReady, document.fonts.ready, slide.querySelector('.hai-hospital-art img').decode()]);
  const experience = connectJourneys(slide, window.Reveal);
  window.addEventListener('pagehide', event => {
    if (event.persisted) experience.suspend();
    else experience.destroy();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  start().catch(error => console.error('Could not initialize hospital outcome journeys.', error));
}
