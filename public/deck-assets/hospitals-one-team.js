// One software partner for the hospital’s modules, support and development.
(() => {
  const slide = document.getElementById('hospital-one-team');
  const opener = slide?.querySelector('[data-hot-open]');
  if (!slide || !opener) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const today = [
    ['You pay separate companies for their software.', 'სხვადასხვა კომპანიას ცალ-ცალკე უხდით.'],
    ['You arrange support and changes with each supplier separately.', 'მხარდაჭერასა და ცვლილებებს თითოეულ მომწოდებელთან ცალკე ათანხმებთ.'],
    ['Your team also has to coordinate the connections between their programs.', 'პროგრამების ერთმანეთთან დაკავშირებასაც თქვენ უწევთ ორგანიზებას.']
  ];
  const offer = [
    ['MediMind provides all the software your hospital needs.', 'MediMind გაწვდით კლინიკისთვის საჭირო ყველა პროგრამას.'],
    ['You agree payments and service terms with one company.', 'გადახდებსა და მომსახურების პირობებს ერთ კომპანიასთან ათანხმებთ.'],
    ['One coordinated team handles implementation, support and development across the system.', 'დანერგვას, მხარდაჭერასა და განვითარებას მთელ სისტემაში ჩვენი გუნდი უძღვება.']
  ];
  const capabilities = [
    ['EMR · Medical records', 'EMR · სამედიცინო ჩანაწერები'],
    ['Laboratory', 'ლაბორატორია'],
    ['PACS · Imaging', 'PACS · რადიოლოგია'],
    ['Billing & finance', 'ბილინგი და ფინანსები'],
    ['HR & payroll', 'პერსონალი და ხელფასები'],
    ['Pharmacy & stock', 'აფთიაქი და მარაგები'],
    ['Patient portal', 'პაციენტის პორტალი'],
    ['Other modules you need', 'თქვენთვის საჭირო სხვა მოდულები']
  ];
  const dialog = document.createElement('dialog');
  dialog.id = 'hot-support-example';
  dialog.className = 'hot-dialog';
  dialog.setAttribute('aria-labelledby', 'hot-demo-title');
  dialog.setAttribute('aria-describedby', 'hot-demo-note');
  dialog.setAttribute('data-no-advance', '');
  dialog.innerHTML = `<header class="hot-dialog-head"><div><span class="hot-dialog-eyebrow">${copy('One company for all your hospital software', 'ერთი კომპანია კლინიკის ყველა პროგრამისთვის')}</span><h2 id="hot-demo-title">${copy('All the software you need. One coordinated team.', 'ყველა საჭირო პროგრამა და ერთი პასუხისმგებელი გუნდი.')}</h2></div><button type="button" class="hot-close" data-hot-close aria-label="Close details / დეტალების დახურვა">×</button></header>
    <div class="hot-examples"><div class="hot-example-grid"><section class="hot-example-card"><h3>${copy('Today: several suppliers', 'დღეს: რამდენიმე მომწოდებელი')}</h3><ul class="hot-offer-points">${today.map(point => `<li>${copy(...point)}</li>`).join('')}</ul></section><section class="hot-example-card hot-example-card--us"><h3>${copy('Our offer: one partner', 'ჩვენი შეთავაზება: ერთი პარტნიორი')}</h3><ul class="hot-offer-points">${offer.map(point => `<li>${copy(...point)}</li>`).join('')}</ul></section></div>
    <section class="hot-offer-modules"><h3>${copy('Everything your hospital needs to work', 'ყველა პროგრამა, რომელიც თქვენს კლინიკას სჭირდება')}</h3><ul>${capabilities.map(item => `<li>${copy(...item)}</li>`).join('')}</ul><p>${copy('We also build additional modules for your hospital. Our team coordinates the work, so you do not have to find and manage a separate supplier for every new need.', 'თქვენი კლინიკისთვის დამატებით მოდულებსაც ვქმნით. სამუშაოს ჩვენი გუნდი ათანხმებს და ასრულებს. ყოველი ახალი საჭიროებისთვის სხვა კომპანიის მოძებნა და მასთან ცალკე მუშაობა აღარ გიწევთ.')}</p></section></div>
    <p class="hot-demo-note" id="hot-demo-note">${copy('We agree the required modules, rollout scope and service terms with your hospital. Product availability is shown in the module catalogue later in the deck.', 'საჭირო მოდულებს, დანერგვის მოცულობასა და მომსახურების პირობებს თქვენთან ვათანხმებთ. პროგრამების მზადყოფნა მოგვიანებით, მოდულების კატალოგშია ნაჩვენები.')}</p>`;
  document.body.append(dialog);
  let priorKeyboard;
  const modules = Array.from(slide.querySelectorAll('[data-hot-module]'));
  const moduleLinks = Array.from(slide.querySelectorAll('[data-hot-link]'));
  const brainStage = slide.querySelector('.hot-brain-stage');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let pinnedModule = null;

  function highlightModule(index) {
    brainStage.dataset.hotHasActive = String(index !== null);
    [modules, moduleLinks].forEach(group => group.forEach((element, position) => {
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
