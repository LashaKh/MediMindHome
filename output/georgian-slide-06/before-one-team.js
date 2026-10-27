// A clearly illustrative support path, not a timed performance or incident claim.
(() => {
  const slide = document.getElementById('hospital-one-team');
  const opener = slide?.querySelector('[data-hot-open]');
  if (!slide || !opener) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const playIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 4 9 6-9 6Z" fill="currentColor"/></svg>';
  const pauseIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4v12M14 4v12" stroke="currentColor" stroke-width="3"/></svg>';
  const stages = [
    {
      title: ['Report', 'მიმართვა'],
      update: ['One request reaches MediMind. The same team owns the follow-up across the system.', 'ერთი მიმართვა MediMind-ს. ჩვენი სისტემის ფარგლებში საკითხს ბოლომდე ერთი პასუხისმგებელი გუნდი მიჰყვება.'],
      summary: ['Your team contacts the suppliers. With MediMind, you contact one team.', 'ცალკეულ სისტემებში სხვადასხვა მომწოდებელს უკავშირდებით. MediMind-ში ერთი გუნდი გპასუხობთ.'],
      checks: 0
    },
    {
      title: ['Investigate', 'შემოწმება'],
      update: ['Our team checks the laboratory, the data transfer and the patient record together.', 'ჩვენი გუნდი ერთად ამოწმებს ლაბორატორიულ სისტემას, მონაცემის გადაცემასა და პაციენტის ჩანაწერს.'],
      summary: ['You coordinate separate checks. With MediMind, our team coordinates them.', 'ცალკეულ სისტემებში შემოწმებებს თქვენ ათანხმებთ. MediMind-ში ამ სამუშაოს ჩვენი გუნდი აერთიანებს.'],
      checks: 3
    },
    {
      title: ['Follow-up', 'უკუკავშირი'],
      update: ['One team brings you the findings and next action. Your hospital verifies the result.', 'ერთი გუნდი გატყობინებთ, რა შედეგი მოჰყვა შემოწმებას და რა არის შემდეგი ნაბიჯი. საბოლოო შედეგს თქვენი კლინიკა ამოწმებს.'],
      summary: ['One request. One accountable team. Your hospital verifies the outcome.', 'ერთი მიმართვა. ერთი გუნდი აგებს პასუხს. შედეგს თქვენი კლინიკა ამოწმებს.'],
      checks: 3
    }
  ];
  const contacts = [
    ['B', ['Contact the laboratory supplier', 'მიმართეთ ლაბორატორიის მომწოდებელს'], ['Check whether the result left the lab system.', 'გადაამოწმეთ, გაიგზავნა თუ არა შედეგი.']],
    ['A', ['Contact the records supplier', 'მიმართეთ ჩანაწერების მომწოდებელს'], ['Coordinate the check of the receiving record.', 'შეათანხმეთ, როგორ გადაამოწმებთ, მიიღო თუ არა სისტემამ შედეგი.']],
    ['↔', ['Bring the replies together', 'შეაჯერეთ პასუხები'], ['Your team follows up and verifies the outcome.', 'საკითხს თქვენი გუნდი მიჰყვება და შედეგსაც ამოწმებს.']]
  ];
  const dialog = document.createElement('dialog');
  dialog.id = 'hot-support-example';
  dialog.className = 'hot-dialog';
  dialog.setAttribute('aria-labelledby', 'hot-demo-title');
  dialog.setAttribute('aria-describedby', 'hot-demo-note');
  dialog.setAttribute('data-no-advance', '');
  dialog.innerHTML = `<header class="hot-dialog-head"><div><span class="hot-dialog-eyebrow">${copy('Illustrative support example · Who coordinates the work?', 'მაგალითად: ვინ ათანხმებს სამუშაოს?')}</span><h2 id="hot-demo-title">${copy('The lab result is missing from the patient record.', 'კვლევის შედეგი პაციენტის ჩანაწერში არ ჩანს.')}</h2></div><button type="button" class="hot-close" data-hot-close aria-label="Close example / მაგალითის დახურვა">×</button></header>
    <div class="hot-demo-toolbar"><nav class="hot-stepper" aria-label="Support steps / მიმართვის ნაბიჯები">${stages.map((stage, index) => `<button type="button" class="hot-step" data-hot-step="${index}"><span class="hot-step-number">0${index + 1}</span><span>${copy(...stage.title)}</span></button>`).join('')}</nav><button type="button" class="hot-play" data-hot-play aria-pressed="false"></button></div>
    <div class="hot-demo-body"><article class="hot-demo-side"><header class="hot-demo-side-head"><small>${copy('Separate suppliers · illustrative mix', 'სხვადასხვა მომწოდებელი · მაგალითი')}</small><h3>${copy('You coordinate the work.', 'კოორდინაცია თქვენზეა.')}</h3></header><ol class="hot-contact-log">${contacts.map(([icon, title, description], index) => `<li data-hot-contact="${index}"><span class="hot-contact-icon" aria-hidden="true">${icon}</span><div><b>${copy(...title)}</b><p>${copy(...description)}</p></div></li>`).join('')}</ol><footer class="hot-demo-side-foot">${copy('Separate contacts. Your team brings the answers together.', 'სხვადასხვა მომწოდებელს ცალ-ცალკე მიმართავთ და პასუხებს თქვენი გუნდი აჯერებს.')}</footer></article>
    <article class="hot-demo-side hot-demo-side--us"><header class="hot-demo-side-head"><img src="/deck-assets/logo-nine-box-light.svg" alt=""><div><small>MediMind</small><h3>${copy('We coordinate the work.', 'კოორდინაცია ჩვენზეა.')}</h3></div></header><div class="hot-ticket"><div class="hot-ticket-meta"><span>${copy('ONE SHARED REQUEST', 'ერთი მიმართვა')}</span><span>DEMO</span></div><div class="hot-ticket-owner">${copy('Accountable team: MediMind', 'პასუხისმგებელი გუნდი: MediMind')}</div><div class="hot-checks">${[['Lab', 'ლაბორატორია'], ['Data transfer', 'გადაცემა'], ['Patient record', 'ჩანაწერი']].map((title, index) => `<span class="hot-check" data-hot-check="${index}">${copy(...title)}</span>`).join('')}</div><p class="hot-ticket-update" data-hot-update></p></div><footer class="hot-demo-side-foot">${copy('One contact for the system. Follow-up stays with our team.', 'მთელ სისტემაზე ერთ გუნდს მიმართავთ. საკითხს ჩვენ მივყვებით.')}</footer></article></div>
    <p class="hot-demo-summary" data-hot-summary></p><p class="hot-demo-note" id="hot-demo-note">${copy('Illustrative coordination path, not a real incident or a resolution-time promise. Supplier arrangements vary by hospital.', 'ეს კოორდინაციის მაგალითია და არა რეალური შემთხვევა ან კონკრეტულ ვადაში მოგვარების დაპირება. მომწოდებლების განაწილება კლინიკის მიხედვით განსხვავდება.')}</p><span class="hot-demo-status" data-hot-status role="status" aria-live="polite" aria-atomic="true"></span>`;
  document.body.append(dialog);

  const buttons = Array.from(dialog.querySelectorAll('[data-hot-step]'));
  const contactRows = Array.from(dialog.querySelectorAll('[data-hot-contact]'));
  const checks = Array.from(dialog.querySelectorAll('[data-hot-check]'));
  const update = dialog.querySelector('[data-hot-update]');
  const summary = dialog.querySelector('[data-hot-summary]');
  const status = dialog.querySelector('[data-hot-status]');
  const play = dialog.querySelector('[data-hot-play]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  let currentStep = 0;
  let timer;
  let playing = false;
  let priorKeyboard;
  const modules = Array.from(slide.querySelectorAll('[data-hot-module]'));
  const moduleLinks = Array.from(slide.querySelectorAll('[data-hot-link]'));
  const supplierRows = Array.from(slide.querySelectorAll('.hot-supplier-list li'));
  const brainStage = slide.querySelector('.hot-brain-stage');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let pinnedModule = null;

  function highlightModule(index) {
    brainStage.dataset.hotHasActive = String(index !== null);
    [modules, moduleLinks, supplierRows].forEach(group => group.forEach((element, position) => {
      element.dataset.hotActive = String(position === index);
    }));
  }
  modules.forEach((button, index) => {
    button.addEventListener('pointerenter', () => { if (finePointer.matches) highlightModule(index); });
    button.addEventListener('pointerleave', () => { if (finePointer.matches) highlightModule(pinnedModule); });
    button.addEventListener('focus', () => highlightModule(index));
    button.addEventListener('blur', () => highlightModule(pinnedModule));
    button.addEventListener('click', () => {
      pinnedModule = pinnedModule === index ? null : index;
      modules.forEach((module, position) => module.setAttribute('aria-pressed', String(position === pinnedModule)));
      highlightModule(pinnedModule);
    });
  });

  function cancelAnimations() {
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
  }
  function animate(element, frames, duration) {
    if (!element.animate || dialog.dataset.input === 'keyboard') return;
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    activeAnimations.add(animation);
    animation.addEventListener('finish', () => activeAnimations.delete(animation), { once: true });
  }
  function setPlayLabel() {
    play.setAttribute('aria-pressed', String(playing));
    play.innerHTML = (playing ? pauseIcon : playIcon) + `<span>${playing ? copy('Pause', 'პაუზა') : copy('Play the example', 'მაგალითის გაშვება')}</span>`;
  }
  function stop() {
    window.clearTimeout(timer);
    timer = undefined;
    playing = false;
    setPlayLabel();
  }
  function render(index, withMotion = false) {
    cancelAnimations();
    currentStep = index;
    dialog.dataset.step = String(index);
    buttons.forEach((button, position) => {
      if (position === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    contactRows.forEach((row, position) => { row.dataset.reached = String(position <= index); });
    checks.forEach((check, position) => { check.dataset.reached = String(position < stages[index].checks); });
    update.innerHTML = copy(...stages[index].update);
    summary.innerHTML = copy(...stages[index].summary);
    status.textContent = stages[index].summary[document.body.classList.contains('lang-active-ka') ? 1 : 0];
    if (withMotion) {
      const frames = reduceMotion.matches ? [{ opacity: .35 }, { opacity: 1 }] : [{ opacity: .35, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }];
      animate(contactRows[index], frames, 250);
      animate(update, frames, 250);
    }
  }
  function scheduleNext() {
    timer = window.setTimeout(() => {
      if (!dialog.open || !playing || document.hidden) { stop(); return; }
      render(currentStep + 1, true);
      if (currentStep === stages.length - 1) stop();
      else scheduleNext();
    }, 3000);
  }
  function close() { if (dialog.open) dialog.close(); }
  function syncBrainMotion() {
    slide.dataset.hotPaused = String(document.hidden || dialog.open);
  }

  opener.disabled = false;
  opener.addEventListener('click', event => {
    if (dialog.open) return;
    dialog.dataset.input = event.detail === 0 ? 'keyboard' : 'pointer';
    priorKeyboard = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    stop();
    render(0);
    dialog.showModal();
    syncBrainMotion();
    dialog.scrollTop = 0;
    buttons[0].focus({ preventScroll: true });
    animate(dialog, reduceMotion.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(12px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], 250);
  });
  buttons.forEach((button, index) => button.addEventListener('click', event => {
    dialog.dataset.input = event.detail === 0 ? 'keyboard' : 'pointer';
    stop();
    render(index, event.detail !== 0);
  }));
  play.addEventListener('click', event => {
    dialog.dataset.input = event.detail === 0 ? 'keyboard' : 'pointer';
    if (playing) { stop(); return; }
    if (currentStep === stages.length - 1) render(0, event.detail !== 0);
    playing = true;
    setPlayLabel();
    scheduleNext();
  });
  dialog.querySelector('[data-hot-close]').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('keydown', () => {
    dialog.dataset.input = 'keyboard';
    cancelAnimations();
  });
  dialog.addEventListener('close', () => {
    stop();
    cancelAnimations();
    syncBrainMotion();
    window.Reveal.configure({ keyboard: priorKeyboard });
    opener.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => {
    syncBrainMotion();
    if (document.hidden) { stop(); cancelAnimations(); }
  });
  document.addEventListener('keydown', () => { slide.dataset.hotInput = 'keyboard'; });
  document.addEventListener('pointerdown', () => { slide.dataset.hotInput = 'pointer'; });
  window.Reveal.on('slidechanged', () => {
    stop(); cancelAnimations(); close();
    pinnedModule = null;
    modules.forEach(module => module.setAttribute('aria-pressed', 'false'));
    highlightModule(null);
  });
  setPlayLabel();
  syncBrainMotion();
  highlightModule(null);
})();
