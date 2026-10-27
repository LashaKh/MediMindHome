// Everyday examples of the unified offer, not reported hospital outcomes.
(() => {
  const slide = document.getElementById('hospital-one-team');
  const opener = slide?.querySelector('[data-hot-open]');
  if (!slide || !opener) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const examples = [
    {
      title: ['You change a service price.', 'მომსახურების ფასს ცვლით.'],
      today: ['Reception and finance use separate programs. You update the price in both, then check that the amounts match.', 'რეგისტრატურასა და ფინანსებში სხვადასხვა პროგრამაა. ახალ ფასს ორივეგან ცვლით და შემდეგ ამოწმებთ, რომ თანხები ემთხვევა.'],
      offer: ['We set up services and prices in one system. Reception and finance use the same service price.', 'მომსახურებებსა და ფასებს ერთ სისტემაში ვაწყობთ. ორივე განყოფილებისთვის მომსახურების ფასი ერთია.']
    },
    {
      title: ['You record medication used for a patient.', 'პაციენტისთვის გამოყენებულ წამალს აღრიცხავთ.'],
      today: ['Medication dispensing is recorded in one program and patient charges in another. Staff have to reconcile the records.', 'წამლის გაცემა ერთ პროგრამაში ფიქსირდება, პაციენტის ხარჯი მეორეში. თანამშრომლებს ამ ჩანაწერების ერთმანეთთან შედარება უწევთ.'],
      offer: ['In one system, you record which medication was dispensed to the patient, how stock changed and what was added to their charges.', 'ერთ სისტემაში აღრიცხავთ, რომელი წამალი გაიცა პაციენტისთვის, რამდენით შემცირდა მარაგი და რა დაემატა მის ხარჯს.']
    },
    {
      title: ['You open a new department.', 'ახალ განყოფილებას ხსნით.'],
      today: ['You ask each supplier what they will add, what the change will cost and who will connect the programs.', 'არკვევთ, რას დაამატებს თითოეული მომწოდებელი, რა დაჯდება ცვლილება და ვინ დააკავშირებს პროგრამებს ერთმანეთთან.'],
      offer: ['You agree the new department’s workflow with our team. We set up its records, services and financial tracking in the shared system.', 'ჩვენს გუნდთან ათანხმებთ, როგორ უნდა იმუშაოს ახალმა განყოფილებამ. საჭირო ჩანაწერებს, მომსახურებებსა და ფინანსურ აღრიცხვას საერთო სისტემაში ვაწყობთ.']
    }
  ];
  const dialog = document.createElement('dialog');
  dialog.id = 'hot-support-example';
  dialog.className = 'hot-dialog';
  dialog.setAttribute('aria-labelledby', 'hot-demo-title');
  dialog.setAttribute('aria-describedby', 'hot-demo-note');
  dialog.setAttribute('data-no-advance', '');
  dialog.innerHTML = `<header class="hot-dialog-head"><div><span class="hot-dialog-eyebrow">${copy('Three everyday hospital tasks', 'სამი მაგალითი კლინიკის ყოველდღიური მუშაობიდან')}</span><h2 id="hot-demo-title">${copy('What changes when your software works as one system?', 'რას ცვლის ერთიანი სისტემა ყოველდღიურ მუშაობაში?')}</h2></div><button type="button" class="hot-close" data-hot-close aria-label="Close example / მაგალითის დახურვა">×</button></header>
    <div class="hot-examples">${examples.map((example, index) => `<article class="hot-example"><h3><span class="hot-example-number" aria-hidden="true">0${index + 1}</span>${copy(...example.title)}</h3><div class="hot-example-grid"><section class="hot-example-card"><h4>${copy('Today: separate companies’ programs', 'დღეს: სხვადასხვა კომპანიის პროგრამები')}</h4><p>${copy(...example.today)}</p></section><section class="hot-example-card hot-example-card--us"><h4>${copy('Our offer: MediMind', 'ჩვენი შეთავაზება: MediMind')}</h4><p>${copy(...example.offer)}</p></section></div></article>`).join('')}</div>
    <p class="hot-demo-note" id="hot-demo-note">${copy('Illustrative workflows. Your current setup may differ. We agree the required functions and rollout scope with your hospital.', 'ეს სამუშაო პროცესების მაგალითებია. თქვენს კლინიკაში პროგრამების განაწილება შეიძლება განსხვავდებოდეს. საჭირო ფუნქციებსა და დანერგვის მოცულობას თქვენთან ვათანხმებთ.')}</p>`;
  document.body.append(dialog);
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

  function close() { if (dialog.open) dialog.close(); }
  function syncBrainMotion() {
    slide.dataset.hotPaused = String(document.hidden || dialog.open);
  }
  opener.disabled = false;
  opener.addEventListener('click', () => {
    if (dialog.open) return;
    priorKeyboard = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    dialog.showModal();
    syncBrainMotion();
    dialog.scrollTop = 0;
    dialog.querySelector('[data-hot-close]').focus({ preventScroll: true });
  });
  dialog.querySelector('[data-hot-close]').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    syncBrainMotion();
    window.Reveal.configure({ keyboard: priorKeyboard });
    opener.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', syncBrainMotion);
  document.addEventListener('keydown', () => { slide.dataset.hotInput = 'keyboard'; });
  document.addEventListener('pointerdown', () => { slide.dataset.hotInput = 'pointer'; });
  window.Reveal.on('slidechanged', () => {
    close();
    pinnedModule = null;
    modules.forEach(module => module.setAttribute('aria-pressed', 'false'));
    highlightModule(null);
  });
  syncBrainMotion();
  highlightModule(null);
})();
