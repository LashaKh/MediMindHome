// The partner offer opens its actual terms, rather than another decorative demo.
(() => {
  const slide = document.getElementById('hospital-partnership');
  const openers = Array.from(slide?.querySelectorAll('[data-hpo2-open]') || []);
  if (!slide || !openers.length) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const terms = [
    { key: 'system', title: ['Hospital operating system', 'კლინიკის ოპერაციული სისტემა'], status: ['Within your current budget', 'მიმდინარე ბიუჯეტით'], description: ['One operating system for clinical care and hospital management, tailored to the way your hospital works. The module overview explains each capability.', 'ერთი ოპერაციული სისტემა მკურნალობისა და კლინიკის მართვისთვის, თქვენი მუშაობის წესზე მორგებული. მოდულების მიმოხილვაში ნახავთ, რას აკეთებს თითოეული ნაწილი.'] },
    { key: 'tailoring', title: ['Tailored to your hospital', 'თქვენს კლინიკაზე მორგება'], status: ['Included', 'შედის'], description: ['Capabilities, forms and reports shaped around your team’s needs, together with your team.', 'ფუნქციებს, ფორმებსა და ანგარიშებს თქვენს გუნდთან ერთად, თქვენი საჭიროებების მიხედვით ვარგებთ.'] },
    { key: 'implementation', title: ['Implementation and training', 'დანერგვა და სწავლება'], status: ['Free', 'უფასო'], description: ['We configure the system, prepare it for your hospital and train your team. You keep using your current system during the parallel evaluation.', 'სისტემას ვაწყობთ თქვენი კლინიკისთვის და გუნდს გამოყენებას ვასწავლით. MediMind-ის გამოცდისას თქვენ ისევ არსებული პროგრამით მუშაობთ.'] },
    { key: 'development', title: ['Ongoing development', 'უწყვეტი განვითარება'], status: ['No extra development fees', 'განვითარების დამატებითი საფასურის გარეშე'], description: ['Every software feature and change you request is built and implemented without additional development fees, throughout the entire partnership.', 'თანამშრომლობის განმავლობაში ყველა ფუნქციასა და ცვლილებას, რომელსაც მოითხოვთ, განვითარების დამატებითი საფასურის გარეშე ვქმნით და ვნერგავთ.'] },
    { key: 'evaluation', title: ['Parallel evaluation', 'პარალელური გამოცდა'], status: ['Free', 'უფასო'], description: ['Your current system and processes stay in place. Your team tests and compares MediMind in your hospital. You commit only after you are convinced it is clearly better for your hospital.', 'თქვენ ისევ არსებული სისტემითა და პროცესებით მუშაობთ. თქვენი გუნდი MediMind-ს კლინიკაში ცდის და ადარებს. პარტნიორობაზე მხოლოდ მაშინ თანხმდებით, როცა დარწმუნდებით, რომ MediMind თქვენი კლინიკისთვის აშკარად უკეთესია.'] },
    { key: 'code', title: ['First-version source code', 'პირველი ვერსიის საწყისი კოდი'], status: ['Yours, under contract', 'თქვენია, ხელშეკრულებით'], description: ['Your hospital owns the first delivered base-system source code under contract. Third-party licences and later-version rights have their own terms.', 'პირველად ჩაბარებული საბაზისო ვერსიის საწყისი კოდი ხელშეკრულებით თქვენს კლინიკას ეკუთვნის. მესამე მხარის ლიცენზიებსა და შემდგომ ვერსიებზე უფლებებს ცალკე პირობები განსაზღვრავს.'] }
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'hpo2-dialog';
  dialog.id = 'hpo2-details';
  dialog.setAttribute('aria-labelledby', 'hpo2-dialog-title');
  dialog.setAttribute('aria-describedby', 'hpo2-dialog-description');
  dialog.innerHTML = `<header class="hpo2-dialog-head"><div><h2 id="hpo2-dialog-title">${copy('What your partner terms include', 'რას მოიცავს პარტნიორობა')}</h2><p id="hpo2-dialog-description">${copy('Premium hospital software, within your current software budget.', 'პრემიუმ კლასის სისტემა იმ ბიუჯეტის ფარგლებში, რომელსაც ახლა მოქმედ პროგრამაზე ხარჯავთ.')}</p></div><button type="button" class="hpo2-dialog-close" data-hpo2-close aria-label="Close offer details / პირობების დახურვა">×</button></header><div class="hpo2-dialog-body"><div class="hpo2-receipt">${terms.map((term, i) => `<details class="hpo2-term" data-hpo2-term="${term.key}"><summary><span class="hpo2-term-number">0${i + 1}</span><span>${copy(...term.title)}</span><span class="hpo2-term-status">${copy(...term.status)}</span></summary><p>${copy(...term.description)}</p></details>`).join('')}</div><footer class="hpo2-dialog-footer"><p>${copy('3 partner places · 1 taken · 2 available. These special terms apply to these three partnerships.', 'პარტნიორობის 3 ადგილი · 1 დაკავებულია · 2 თავისუფალია. განსაკუთრებული პირობები ამ სამ პარტნიორობაზე ვრცელდება.')}</p><a class="hpo2-route" href="#/hospital-parallel-evaluation" data-hpo2-route>${copy('See the rollout path', 'როგორ ხდება დანერგვა')} <span aria-hidden="true">→</span></a></footer></div>`;
  document.body.append(dialog);
  const rows = Array.from(dialog.querySelectorAll('[data-hpo2-term]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let opener;
  let keyboardBeforeOpen;
  let animation;
  let closing = false;
  const easing = 'cubic-bezier(0.23, 1, 0.32, 1)';

  function show(button, keyboard) {
    opener = button;
    closing = false;
    delete dialog.dataset.closing;
    dialog.dataset.input = keyboard ? 'keyboard' : 'pointer';
    keyboardBeforeOpen = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    const target = rows.find(row => row.dataset.hpo2Term === button.dataset.hpo2Open) || rows[0];
    rows.forEach(row => { row.open = row === target; });
    dialog.showModal();
    dialog.scrollTop = 0;
    target.querySelector('summary').focus({ preventScroll: true });
    target.scrollIntoView({ block: 'nearest' });
    if (!keyboard) {
      animation?.cancel();
      animation = dialog.animate(reduceMotion.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(12px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 250, easing });
    }
  }
  function close(keyboard = false) {
    if (!dialog.open || closing) return;
    if (keyboard) { dialog.close(); return; }
    closing = true;
    dialog.dataset.input = 'pointer';
    dialog.dataset.closing = 'true';
    animation?.cancel();
    animation = dialog.animate(reduceMotion.matches ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(12px) scale(.97)' }], { duration: 200, easing });
    animation.addEventListener('finish', () => { if (closing) dialog.close(); }, { once: true });
  }
  openers.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', event => show(button, event.detail === 0));
  });
  dialog.querySelector('[data-hpo2-close]').addEventListener('click', event => close(event.detail === 0));
  dialog.addEventListener('keydown', () => { dialog.dataset.input = 'keyboard'; });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    closing = false;
    animation?.cancel();
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    opener?.focus({ preventScroll: true });
  });
  dialog.querySelector('[data-hpo2-route]').addEventListener('click', event => {
    const slides = Array.from(document.querySelectorAll('.reveal .slides > section'));
    const targetIndex = slides.findIndex(section => section.id === 'hospital-parallel-evaluation');
    if (targetIndex < 0) return;
    event.preventDefault();
    close(true);
    window.Reveal.slide(targetIndex);
  });
  document.addEventListener('keydown', () => { slide.dataset.hpo2Input = 'keyboard'; });
  document.addEventListener('pointerdown', () => { slide.dataset.hpo2Input = 'pointer'; });
  window.Reveal.on('slidechanged', () => { if (dialog.open) close(true); });
})();
