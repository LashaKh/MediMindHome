// Hospital proposal: desktop presentation, phone reading, translation and print.
(function () {
  'use strict';
  const slides = Array.from(document.querySelectorAll('.slide'));
  const deck = document.getElementById('deck');
  const counter = document.getElementById('counter');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const progress = document.getElementById('prog');
  const params = new URLSearchParams(location.search);
  const isPrint = params.has('print-pdf');
  const phone = () => window.matchMedia('(max-width: 820px)').matches;
  const dictionaries = window.PARTNER_I18N;
  let index = 0;
  let navTimer;
  let swipe;
  if (isPrint) document.body.classList.add('print');
  function storageGet(key) {
    try { return sessionStorage.getItem(key); }
    catch (error) { console.warn('Proposal preferences are unavailable.', error); return null; }
  }
  function storageSet(key, value) {
    try { sessionStorage.setItem(key, value); }
    catch (error) { console.warn('Proposal preference could not be saved.', error); }
  }
  function fit() {
    if (phone() || isPrint) return;
    const scale = Math.min(innerWidth / 1280, innerHeight / 720);
    deck.style.setProperty('--s', String(scale));
    deck.style.setProperty('--cw', (innerWidth / scale) + 'px');
    deck.style.setProperty('--ch', (innerHeight / scale) + 'px');
  }
  function showNav() {
    document.body.classList.add('show-nav');
    clearTimeout(navTimer);
    navTimer = setTimeout(() => document.body.classList.remove('show-nav'), 3000);
  }
  function go(number, updateUrl = true) {
    index = Math.max(0, Math.min(slides.length - 1, number));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      // Every page is readable in the continuous phone layout and PDF.
      slide.inert = !phone() && !isPrint && i !== index;
    });
    counter.textContent = `${index + 1} / ${slides.length}`;
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    progress.style.width = `${(index + 1) / slides.length * 100}%`;
    if (updateUrl) history.replaceState(null, '', location.pathname + location.search + '#' + (index + 1));
    showNav();
  }
  function setLang(language) {
    const lang = dictionaries[language] ? language : 'ka';
    const words = dictionaries[lang];
    document.documentElement.lang = lang;
    document.body.classList.remove('lang-en', 'lang-ka', 'lang-ru');
    document.body.classList.add('lang-' + lang);
    document.querySelectorAll('[data-t]').forEach((element) => {
      const value = words[element.dataset.t];
      if (value !== undefined) element.innerHTML = value;
    });
    // Mobile comparisons repeat the translated column labels above each value.
    document.querySelectorAll('.comparison, .scorecard').forEach(table => {
      const labels = Array.from(table.querySelectorAll('th'), header => header.textContent);
      table.querySelectorAll('tbody tr').forEach(row => {
        Array.from(row.cells).forEach((cell, column) => { cell.dataset.label = labels[column]; });
      });
    });
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const selected = button.dataset.lang === lang;
      button.classList.toggle('on', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    ['pdfBtn', 'pdfBtn2'].forEach((id) => {
      document.getElementById(id).href = `/share/medimind-partner-${lang}.pdf`;
    });
    prev.setAttribute('aria-label', words['ui.prev']);
    next.setAttribute('aria-label', words['ui.next']);
    document.title = words['ui.title'];
    storageSet('mmp_lang', lang);
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    fit();
  }
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLang(button.dataset.lang)));
  document.addEventListener('mousemove', showNav);
  document.addEventListener('keydown', async event => {
    if (phone() || isPrint || document.getElementById('mmp-gate')) return;
    if (event.target.closest('input, textarea, button, a, select, [contenteditable="true"]')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(index + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); go(index - 1); }
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(slides.length - 1);
    else if (event.key.toLowerCase() === 'f') {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      } catch (error) { console.warn('Fullscreen is unavailable in this browser.', error); }
    }
  });
  deck.addEventListener('click', event => {
    if (phone() || isPrint || event.target.closest('a,button') || getSelection().toString()) return;
    const x = event.clientX / innerWidth;
    if (x > .7) go(index + 1);
    else if (x < .15) go(index - 1);
  });
  deck.addEventListener('touchstart', event => {
    if (!phone()) swipe = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  deck.addEventListener('touchend', event => {
    if (!swipe || phone()) return;
    const dx = event.changedTouches[0].clientX - swipe.x;
    const dy = event.changedTouches[0].clientY - swipe.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
    swipe = null;
  }, { passive: true });
  // Ignore the generic placeholder from the earlier preview URL.
  const name = params.get('name') || storageGet('mmp_name');
  if (name && !['კლინიკა', 'clinic', 'hospital', 'clinic example'].includes(name.trim().toLowerCase())) {
    ['prepName1', 'prepName3'].forEach(id => { document.getElementById(id).textContent = name; });
    ['coverPrep', 'nextPrep'].forEach(id => document.getElementById(id).classList.add('show'));
  }
  window.addEventListener('resize', () => { fit(); go(index, false); });
  window.addEventListener('hashchange', () => go((parseInt(location.hash.slice(1), 10) || 1) - 1, false));
  setLang(params.get('lang') || storageGet('mmp_lang') || 'ka');
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, false);
  fit();
  window.mmpGo = go;
  window.mmpSetLang = setLang;
  window.mmpTotal = slides.length;
  window.mmpFit = fit;
})();
