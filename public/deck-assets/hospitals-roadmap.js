// Details are optional. Exploring a stage never changes the hospital's commitments.
(() => {
  const slide = document.getElementById('hospital-ai-path');
  if (!slide) return;
  const openers = Array.from(slide.querySelectorAll('[data-hroad-open]'));
  const templates = Array.from(slide.querySelectorAll('[data-hroad-template]'));
  if (openers.length !== 3 || templates.length !== 3) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const titles = [
    ['Complete system', 'ერთიანი სისტემა'],
    ['AI for every team', 'AI ყველა გუნდისთვის'],
    ['Hospital AI Brain', 'კლინიკის AI ტვინი']
  ];
  const labels = [['System', 'სისტემა'], ['Assistants', 'ასისტენტები'], ['AI Brain', 'AI ტვინი']];
  const dialog = document.createElement('dialog');
  dialog.id = 'hroad-details';
  dialog.className = 'hroad-dialog';
  dialog.setAttribute('aria-labelledby', 'hroad-dialog-title');
  dialog.setAttribute('aria-describedby', 'hroad-dialog-status');
  dialog.setAttribute('data-no-advance', '');
  dialog.innerHTML = `<header class="hroad-dialog-header"><div class="hroad-dialog-heading"><div><h2 id="hroad-dialog-title"></h2><p class="hroad-dialog-status" id="hroad-dialog-status"></p></div><button type="button" class="hroad-close" aria-label="Close details / დეტალების დახურვა">×</button></div><div class="hroad-tabs" role="tablist" aria-label="Development stages / განვითარების ეტაპები">${labels.map((label, index) => `<button type="button" class="hroad-tab" role="tab" id="hroad-tab-${index}" aria-controls="hroad-panel-${index}" aria-selected="false" tabindex="-1"><small>0${index + 1}</small><span>${copy(...label)}</span></button>`).join('')}</div></header><div class="hroad-dialog-body"></div>`;
  const body = dialog.querySelector('.hroad-dialog-body');
  const panels = templates.map((template, index) => {
    const panel = document.createElement('div');
    panel.id = `hroad-panel-${index}`;
    panel.className = 'hroad-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `hroad-tab-${index}`);
    panel.tabIndex = 0;
    panel.hidden = true;
    panel.append(template.content.cloneNode(true));
    body.append(panel);
    return panel;
  });
  document.body.append(dialog);
  const tabs = Array.from(dialog.querySelectorAll('.hroad-tab'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easing = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const video = document.getElementById('hbd-player');
  let activeOpener;
  let priorKeyboard;
  let current = 0;
  let closing = false;
  let panelAnimation;
  let dialogAnimation;

  function syncMotion() {
    slide.dataset.hroadPaused = String(document.hidden || dialog.open || Boolean(video?.open));
  }
  function select(index, keyboard, animate = true) {
    panelAnimation?.cancel();
    current = index;
    dialog.dataset.input = keyboard ? 'keyboard' : 'pointer';
    tabs.forEach((tab, position) => {
      tab.setAttribute('aria-selected', String(position === index));
      tab.tabIndex = position === index ? 0 : -1;
      panels[position].hidden = position !== index;
    });
    dialog.querySelector('#hroad-dialog-title').innerHTML = copy(...titles[index]);
    dialog.querySelector('#hroad-dialog-status').innerHTML = openers[index].querySelector('.hroad-status').innerHTML;
    dialog.scrollTop = 0;
    if (animate && !keyboard && panels[index].animate) {
      panelAnimation = panels[index].animate(reduced.matches ? [{ opacity: .5 }, { opacity: 1 }] : [{ opacity: .5, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200, easing });
    }
  }
  function close(keyboard = false) {
    if (!dialog.open) return;
    if (keyboard || !dialog.animate) { dialog.close(); return; }
    if (closing) return;
    closing = true;
    dialog.dataset.input = 'pointer';
    dialog.dataset.closing = 'true';
    dialogAnimation?.cancel();
    dialogAnimation = dialog.animate(reduced.matches ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(10px) scale(.97)' }], { duration: 200, easing });
    dialogAnimation.addEventListener('finish', () => { if (closing) dialog.close(); }, { once: true });
  }
  openers.forEach((opener, index) => {
    opener.disabled = false;
    opener.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
    });
    opener.addEventListener('click', event => {
      if (dialog.open) return;
      activeOpener = opener;
      closing = false;
      delete dialog.dataset.closing;
      const keyboard = event.detail === 0;
      select(index, keyboard, false);
      priorKeyboard = window.Reveal.getConfig().keyboard;
      window.Reveal.configure({ keyboard: false });
      dialog.showModal();
      syncMotion();
      tabs[index].focus({ preventScroll: true });
      if (!keyboard && dialog.animate) {
        dialogAnimation?.cancel();
        dialogAnimation = dialog.animate(reduced.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(10px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 250, easing });
      }
    });
  });
  slide.querySelector('.hroad-video')?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => select(index, event.detail === 0));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (current + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
      select(next, true);
      tabs[next].focus({ preventScroll: true });
    });
  });
  dialog.querySelector('.hroad-close').addEventListener('click', event => close(event.detail === 0));
  dialog.addEventListener('keydown', () => { dialog.dataset.input = 'keyboard'; });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(true); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    closing = false;
    dialogAnimation?.cancel();
    panelAnimation?.cancel();
    delete dialog.dataset.closing;
    syncMotion();
    window.Reveal.configure({ keyboard: priorKeyboard });
    activeOpener?.focus({ preventScroll: true });
  });
  if (video) new MutationObserver(syncMotion).observe(video, { attributes: true, attributeFilter: ['open'] });
  document.addEventListener('visibilitychange', () => { syncMotion(); if (document.hidden) panelAnimation?.cancel(); });
  document.addEventListener('keydown', () => { slide.dataset.hroadInput = 'keyboard'; });
  document.addEventListener('pointerdown', () => { slide.dataset.hroadInput = 'pointer'; });
  reduced.addEventListener('change', () => { panelAnimation?.cancel(); dialogAnimation?.cancel(); if (closing) dialog.close(); });
  window.Reveal.on('slidechanged', () => { panelAnimation?.cancel(); close(true); });
  syncMotion();
})();
