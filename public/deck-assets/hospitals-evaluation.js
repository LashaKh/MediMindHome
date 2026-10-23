// Selecting a stage explains the rollout; it never approves a transition or purchase.
(() => {
  const slide = document.getElementById('hospital-parallel-evaluation');
  if (!slide) return;
  const board = slide.querySelector('[data-heval2-stage]');
  const tabs = Array.from(slide.querySelectorAll('[data-heval2-step]'));
  const panels = Array.from(slide.querySelectorAll('.heval2-panel'));
  const opener = slide.querySelector('[data-heval2-open]');
  if (!board || tabs.length !== 3 || panels.length !== 3 || !opener) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easing = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const terms = [
    {
      title: ['Your data belongs to your hospital', 'მონაცემები თქვენს კლინიკას ეკუთვნის'],
      description: ['Your hospital owns its data. Export arrangements are agreed in advance, in writing.', 'მონაცემები თქვენს კლინიკას ეკუთვნის. ექსპორტის წესს წინასწარ, წერილობით ვათანხმებთ.']
    },
    {
      title: ['The first version’s source code is yours', 'პირველი ვერსიის საწყისი კოდი თქვენია'],
      description: ['Your hospital owns the source code of the first delivered base system under its contract. Third-party components retain their own licences. Rights to later versions and optional AI services are defined separately.', 'პირველი ჩაბარებული საბაზისო სისტემის საწყისი კოდი ხელშეკრულებით თქვენს კლინიკას ეკუთვნის. მესამე მხარის კომპონენტებს საკუთარი ლიცენზიები უნარჩუნდება. მომდევნო ვერსიებსა და არჩევით AI სერვისებზე უფლებები ცალკე განისაზღვრება.']
    },
    {
      title: ['Terms agreed before proceeding', 'პირობები წინასწარ, წერილობით'],
      description: ['Price, support, service scope and any agreed service-level or price-lock terms are documented together before proceeding. The partner offer’s commitment to unlimited ongoing feature delivery remains unchanged.', 'გაგრძელებამდე ერთად წერილობით ვადგენთ ფასს, მხარდაჭერას, მომსახურების მოცულობასა და შეთანხმებულ მომსახურების დონეს თუ ფასის ფიქსირების პირობებს. პარტნიორობის შეთავაზებით გათვალისწინებული შეუზღუდავი შემდგომი განვითარების ვალდებულება უცვლელია.']
    }
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'heval2-dialog';
  dialog.id = 'heval2-terms-dialog';
  dialog.setAttribute('aria-labelledby', 'heval2-dialog-title');
  dialog.setAttribute('aria-describedby', 'heval2-dialog-description');
  dialog.setAttribute('data-no-advance', '');
  dialog.innerHTML = `<header class="heval2-dialog-head"><div><h2 id="heval2-dialog-title">${copy('Your rights &amp; terms', 'თქვენი უფლებები და პირობები')}</h2><p id="heval2-dialog-description">${copy('Agreed in writing, before proceeding.', 'გაგრძელებამდე შეთანხმებული, წერილობით.')}</p></div><button type="button" class="heval2-dialog-close" data-heval2-close aria-label="Close terms / პირობების დახურვა">×</button></header><div class="heval2-dialog-body">${terms.map((term, index) => `<details class="heval2-term"${index === 0 ? ' open' : ''}><summary><span class="heval2-term-number">0${index + 1}</span><span>${copy(...term.title)}</span></summary><p>${copy(...term.description)}</p></details>`).join('')}<p class="heval2-dialog-note">${copy('Setup, tailoring, training and parallel evaluation are free, with no obligation to buy. Your hospital commits only after its own team is convinced MediMind is clearly better for it. Your hospital decides whether and when to transition.', 'გამართვა, მორგება, სწავლება და პარალელური შეფასება უფასოა, შეძენის ვალდებულების გარეშე. პარტნიორობაზე კლინიკა მხოლოდ მაშინ თანხმდება, როცა საკუთარი გუნდი დარწმუნდება, რომ MediMind მისთვის აშკარად უკეთესია. გადასვლასა და მის დროს კლინიკა წყვეტს.')}</p></div>`;
  document.body.append(dialog);
  let current = 0;
  let panelAnimation;
  let dialogAnimation;
  let closing = false;
  let priorKeyboard;

  function select(index, keyboard) {
    panelAnimation?.cancel();
    current = index;
    slide.dataset.heval2Input = keyboard ? 'keyboard' : 'pointer';
    board.dataset.heval2Stage = String(index);
    tabs.forEach((tab, position) => {
      tab.setAttribute('aria-selected', String(position === index));
      tab.tabIndex = position === index ? 0 : -1;
      panels[position].hidden = position !== index;
    });
    if (!keyboard && panels[index].animate) {
      panelAnimation = panels[index].animate(reduced.matches ? [{ opacity: .5 }, { opacity: 1 }] : [{ opacity: .5, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200, easing });
    }
  }
  function syncMotion() { slide.dataset.heval2Paused = String(document.hidden || dialog.open); }
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
  tabs.forEach((tab, index) => {
    tab.disabled = false;
    tab.addEventListener('click', event => select(index, event.detail === 0));
    tab.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.stopPropagation(); return; }
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(next, true);
      tabs[next].focus({ preventScroll: true });
    });
  });
  opener.disabled = false;
  opener.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') event.stopPropagation(); });
  opener.addEventListener('click', event => {
    if (dialog.open) return;
    closing = false;
    delete dialog.dataset.closing;
    dialog.dataset.input = event.detail === 0 ? 'keyboard' : 'pointer';
    priorKeyboard = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    dialog.querySelectorAll('details').forEach((detail, index) => { detail.open = index === 0; });
    dialog.showModal();
    dialog.scrollTop = 0;
    syncMotion();
    dialog.querySelector('summary').focus({ preventScroll: true });
    if (event.detail !== 0 && dialog.animate) {
      dialogAnimation?.cancel();
      dialogAnimation = dialog.animate(reduced.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(10px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 250, easing });
    }
  });
  dialog.querySelector('[data-heval2-close]').addEventListener('click', event => close(event.detail === 0));
  dialog.addEventListener('keydown', () => { dialog.dataset.input = 'keyboard'; });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    closing = false;
    dialogAnimation?.cancel();
    syncMotion();
    window.Reveal.configure({ keyboard: priorKeyboard });
    opener.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => { syncMotion(); if (document.hidden) panelAnimation?.cancel(); });
  document.addEventListener('keydown', () => { slide.dataset.heval2Input = 'keyboard'; });
  document.addEventListener('pointerdown', () => { slide.dataset.heval2Input = 'pointer'; });
  window.Reveal.on('slidechanged', () => { panelAnimation?.cancel(); close(true); });
  syncMotion();
})();
