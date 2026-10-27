// A readable comparison first; optional visual explanations on demand.
(() => {
  const slide = document.getElementById('hospital-comparison');
  if (!slide) return;
  const openers = Array.from(slide.querySelectorAll('[data-hcmp-open]'));
  if (openers.length !== 7) return;

  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const logo = '<img src="/deck-assets/logo-nine-box-light.svg" alt="">';
  const topics = [
    { name: ['Code ownership', 'კოდის საკუთრება'], symbol: '&lt;/&gt;',
      title: ['The first version belongs to you.', 'პირველი ვერსია თქვენ გეკუთვნით.'],
      description: ['The first delivered base-system source code is yours under contract. Your hospital has a concrete alternative to dependence on one supplier.', 'პირველი ჩაბარებული საბაზისო ვერსიის საწყისი კოდი ხელშეკრულებით თქვენია. კლინიკას ერთ მომწოდებელზე დამოკიდებულების ალტერნატივა აქვს.'],
      visual: 'ownership', nodes: [['First version', 'პირველი ვერსია'], ['Source code', 'საწყისი კოდი'], ['Under contract', 'ხელშეკრულებით']],
      center: ['Your hospital', 'თქვენი კლინიკა'], caption: ['The first delivered base version · under contract', 'პირველი ჩაბარებული საბაზისო ვერსია · ხელშეკრულებით'] },
    { name: ['Ongoing development', 'უწყვეტი განვითარება'], symbol: '∞',
      title: ['Your next idea becomes part of the system.', 'თქვენი შემდეგი იდეა სისტემის ნაწილი ხდება.'],
      description: ['We build and implement every requested feature and change without additional development fees, throughout the partnership.', 'ყველა მოთხოვნილ ფუნქციასა და ცვლილებას ვქმნით და ვნერგავთ დამატებითი განვითარების საფასურის გარეშე — მთელი თანამშრომლობის განმავლობაში.'],
      visual: 'development', nodes: [['You request', 'თქვენ ითხოვთ'], ['We build', 'ჩვენ ვქმნით'], ['We implement', 'ჩვენ ვნერგავთ']],
      center: ['Continuous development', 'უწყვეტი განვითარება'], caption: ['Unlimited requests · no additional development fees', 'შეუზღუდავი მოთხოვნები · დამატებითი განვითარების საფასურის გარეშე'] },
    { name: ['Financial control', 'ფინანსური კონტროლი'], symbol: '₾',
      title: ['See revenue and costs together.', 'შემოსავალი და ხარჯი — ერთ სურათში.'],
      description: ['Departmental reporting brings revenue and costs into one view, so your team can manage and plan with the full financial picture.', 'განყოფილებების მიხედვით ანგარიშგება შემოსავალსა და ხარჯს ერთ ხედში აერთიანებს — კლინიკის მართვისა და დაგეგმვისთვის.'],
      visual: 'finance', nodes: [['Revenue', 'შემოსავალი'], ['Costs', 'ხარჯი'], ['By department', 'განყოფილებით']],
      center: ['One financial picture', 'ერთიანი ფინანსური სურათი'], caption: ['Revenue and costs · grouped by department', 'შემოსავალი და ხარჯი · განყოფილებების მიხედვით'] },
    { name: ['Tailored to you', 'თქვენზე მორგება'], symbol: '⌘',
      title: ['The system adapts to your hospital.', 'სისტემა თქვენს კლინიკას ერგება.'],
      description: ['We shape the capabilities, forms and reports around the way your hospital works, together with your team.', 'თქვენს გუნდთან ერთად ვარგებთ ფუნქციებს, ფორმებსა და ანგარიშებს კლინიკის მუშაობის წესს.'],
      visual: 'tailored', nodes: [['Your workflows', 'თქვენი პროცესები'], ['Your forms', 'თქვენი ფორმები'], ['Your reports', 'თქვენი ანგარიშები']],
      center: ['Built around you', 'თქვენზე მორგებული'], caption: ['Your team’s needs guide what we build', 'თქვენი გუნდის საჭიროებები განსაზღვრავს, რას ვქმნით'] },
    { name: ['One system', 'ერთიანი სისტემა'], symbol: '⊞',
      title: ['Connected work across your hospital.', 'დაკავშირებული მუშაობა მთელ კლინიკაში.'],
      description: ['Shared information connects registration, clinical work, laboratory, imaging and billing in one operating system.', 'საერთო მონაცემები რეგისტრაციას, მკურნალობას, ლაბორატორიას, რადიოლოგიასა და ანგარიშსწორებას ერთ სისტემაში აკავშირებს.'],
      visual: 'unified', nodes: [['EMR', 'EMR'], ['Laboratory', 'ლაბორატორია'], ['PACS', 'PACS'], ['Finance', 'ფინანსები'], ['Registration', 'რეგისტრაცია'], ['Pharmacy', 'აფთიაქი']],
      center: ['MediMind OS', 'MediMind OS'], caption: ['One shared system · connected information', 'ერთი საერთო სისტემა · დაკავშირებული ინფორმაცია'] },
    { name: ['Data standards', 'მონაცემთა სტანდარტი'], symbol: '{ }',
      title: ['A common language for clinical data.', 'საერთო ენა კლინიკური მონაცემებისთვის.'],
      description: ['Built ground-up on FHIR R4, an international standard for structuring and exchanging health information.', 'სისტემის საფუძველი თავიდანვე FHIR R4-ზეა აგებული — ჯანმრთელობის მონაცემების სტრუქტურირებისა და გაცვლის საერთაშორისო სტანდარტზე.'],
      visual: 'standards', nodes: [['Clinical records', 'ჩანაწერები'], ['Lab results', 'კვლევები'], ['Services', 'მომსახურება']],
      center: ['FHIR R4', 'FHIR R4'], caption: ['Structured information for exchange and transfer', 'სტრუქტურირებული ინფორმაცია გაცვლისა და გადატანისთვის'] },
    { name: ['Built for AI', 'AI-ისთვის შექმნილი'], symbol: '✧',
      title: ['AI starts with the right foundation.', 'AI სწორ საფუძველზე იწყება.'],
      description: ['Shared, structured data supports documentation, analysis and future AI services. Availability is agreed by capability; clinical decisions stay with doctors.', 'ერთიანი, სტრუქტურირებული მონაცემები დოკუმენტაციას, ანალიზსა და მომავალ AI სერვისებს ემსახურება. ხელმისაწვდომობა ფუნქციების მიხედვით თანხმდება; კლინიკურ გადაწყვეტილებებს ექიმი იღებს.'],
      visual: 'ai', nodes: [['Structured data', 'სტრუქტურირებული მონაცემები'], ['Shared context', 'ერთიანი კონტექსტი'], ['AI capabilities', 'AI შესაძლებლობები']],
      center: ['Built for AI', 'AI-ისთვის შექმნილი'], caption: ['AI readiness does not mean every future service is live today', 'AI-ისთვის მზადყოფნა არ ნიშნავს, რომ ყველა მომავალი სერვისი უკვე მუშაობს'] }
  ];
  const dialog = document.createElement('dialog');
  dialog.id = 'hcmp-explorer';
  dialog.className = 'hcmp-dialog';
  dialog.setAttribute('aria-labelledby', 'hcmp-explorer-title');
  dialog.setAttribute('aria-describedby', 'hcmp-detail-description');
  dialog.innerHTML = `
    <header class="hcmp-dialog-header">
      <div class="hcmp-dialog-brand">${logo}<span>Medi<span>Mind</span></span></div>
      <span class="hcmp-dialog-eyebrow">${copy('THE DIFFERENCE, EXPLAINED', 'განსხვავება დეტალურად')}</span>
      <button type="button" class="hcmp-dialog-close" data-hcmp-close aria-label="Close / დახურვა">×</button>
    </header>
    <div class="hcmp-dialog-body">
      <nav class="hcmp-topics" aria-label="Comparison topics / შედარების თემები">
        ${topics.map((t, i) => `<button type="button" data-hcmp-topic="${i}" aria-pressed="false"><span class="hcmp-topic-number">0${i + 1}</span><span>${copy(...t.name)}</span><span class="hcmp-topic-arrow" aria-hidden="true">↗</span></button>`).join('')}
      </nav>
      <div class="hcmp-explanation">
        <div class="hcmp-detail-heading"><span class="hcmp-detail-kicker">${copy('YOUR HOSPITAL, WITH MEDIMIND', 'თქვენი კლინიკა, MediMind-თან ერთად')}</span><h2 id="hcmp-explorer-title"></h2><p id="hcmp-detail-description"></p></div>
        <div class="hcmp-visual-home"></div>
        <div class="hcmp-detail-comparison"><div><span class="hcmp-detail-label">${copy('SEPARATE SYSTEMS', 'ცალკეული სისტემებით')}</span><p data-hcmp-before></p></div><span class="hcmp-detail-direction" aria-hidden="true">→</span><div><span class="hcmp-detail-label">MediMind</span><p data-hcmp-after></p></div></div>
        <footer class="hcmp-detail-footer"><button type="button" data-hcmp-prev aria-label="Previous difference / წინა განსხვავება">←</button><span class="hcmp-detail-count" aria-live="polite"></span><button type="button" class="hcmp-detail-next" data-hcmp-next>${copy('Next difference', 'შემდეგი განსხვავება')} <span aria-hidden="true">→</span></button></footer>
      </div>
    </div>`;
  document.body.append(dialog);
  const topicButtons = Array.from(dialog.querySelectorAll('[data-hcmp-topic]'));
  const visualHome = dialog.querySelector('.hcmp-visual-home');
  let index = 0;
  let opener;
  let keyboardBeforeOpen;
  let closing = false;
  let transition;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
  // Measure the drawn cards, so connectors stay attached after wrapping/resizing.
  const connections = new ResizeObserver(() => {
    const field = visualHome.querySelector('.hcmp-visual-field');
    if (!field || !dialog.open) return;
    const bounds = field.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const point = element => {
      const rect = element.getBoundingClientRect();
      return [(rect.left + rect.width / 2 - bounds.left) * field.clientWidth / bounds.width,
        (rect.top + rect.height / 2 - bounds.top) * field.clientHeight / bounds.height];
    };
    const core = point(field.querySelector('.hcmp-visual-core'));
    const nodes = Array.from(field.querySelectorAll('.hcmp-visual-node'), point);
    const svg = field.querySelector('svg');
    svg.setAttribute('viewBox', `0 0 ${field.clientWidth} ${field.clientHeight}`);
    const path = topics[index].visual === 'development'
      ? `M${nodes[0]} L${nodes[1]} L${nodes[2]} M${nodes[1]} L${core}`
      : nodes.map(node => `M${core} L${node}`).join(' ');
    svg.querySelector('path').setAttribute('d', path);
  });

  function select(next, keyboard) {
    index = next;
    dialog.dataset.input = keyboard ? 'keyboard' : 'pointer';
    const topic = topics[index];
    topicButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    dialog.querySelector('#hcmp-explorer-title').innerHTML = copy(...topic.title);
    dialog.querySelector('#hcmp-detail-description').innerHTML = copy(...topic.description);
    dialog.querySelector('[data-hcmp-before]').innerHTML = openers[index].closest('tr').querySelector('.hcmp-before > strong').innerHTML;
    dialog.querySelector('[data-hcmp-after]').innerHTML = openers[index].querySelector('strong').innerHTML;
    dialog.querySelector('.hcmp-detail-count').textContent = `0${index + 1} / 07`;
    dialog.querySelector('[data-hcmp-prev]').disabled = index === 0;
    dialog.querySelector('[data-hcmp-next]').disabled = index === topics.length - 1;
    connections.disconnect();
    visualHome.innerHTML = `<figure class="hcmp-visual hcmp-visual--${topic.visual}" aria-label="${topic.name[0]} / ${topic.name[1]}">
      <div class="hcmp-visual-field" aria-hidden="true"><div class="hcmp-visual-grid"></div><div class="hcmp-visual-orbit"></div><div class="hcmp-visual-orbit hcmp-visual-orbit--outer"></div>
      <svg class="hcmp-visual-lines" viewBox="0 0 640 250" preserveAspectRatio="none"><path d="${topic.visual === 'development' ? 'M100 65 H540 M320 65 V170' : topic.nodes.length === 6 ? 'M100 60 L320 125 L540 60 M100 190 L320 125 L540 190 M320 25 L320 225' : 'M100 60 L320 125 L540 60 M320 125 L320 225'}"/></svg>
      <div class="hcmp-visual-core"><span class="hcmp-visual-symbol">${topic.visual === 'unified' ? logo : topic.symbol}</span><strong>${copy(...topic.center)}</strong></div>
      ${topic.nodes.map((node, i) => `<span class="hcmp-visual-node hcmp-node-${i + 1}"><i aria-hidden="true"></i>${copy(...node)}</span>`).join('')}
      </div><figcaption>${copy(...topic.caption)}</figcaption></figure>`;
    connections.observe(visualHome.querySelector('.hcmp-visual-field'));
    topicButtons[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function show(button, next, keyboard) {
    opener = button;
    closing = false;
    delete dialog.dataset.closing;
    keyboardBeforeOpen = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    select(next, keyboard);
    dialog.showModal();
    dialog.scrollTop = 0;
    topicButtons[next].focus({ preventScroll: true });
    if (!keyboard) {
      transition?.cancel();
      transition = dialog.animate(reduceMotion.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(12px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 250, easing: easeOut });
    }
  }

  function close(keyboard = false) {
    if (!dialog.open || closing) return;
    if (keyboard) { dialog.close(); return; }
    closing = true;
    dialog.dataset.closing = 'true';
    transition?.cancel();
    transition = dialog.animate(reduceMotion.matches ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(12px) scale(.97)' }], { duration: 200, easing: easeOut });
    transition.addEventListener('finish', () => { if (closing) dialog.close(); }, { once: true });
  }

  openers.forEach((button, i) => {
    button.disabled = false;
    button.addEventListener('click', event => show(button, i, event.detail === 0));
  });
  topicButtons.forEach((button, i) => button.addEventListener('click', event => select(i, event.detail === 0)));
  dialog.querySelector('[data-hcmp-prev]').addEventListener('click', event => { if (index > 0) select(index - 1, event.detail === 0); });
  dialog.querySelector('[data-hcmp-next]').addEventListener('click', event => { if (index < topics.length - 1) select(index + 1, event.detail === 0); });
  dialog.querySelector('[data-hcmp-close]').addEventListener('click', event => close(event.detail === 0));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('keydown', event => {
    dialog.dataset.input = 'keyboard';
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    select(Math.max(0, Math.min(topics.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1))), true);
  });
  dialog.addEventListener('close', () => {
    closing = false;
    connections.disconnect();
    transition?.cancel();
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', () => { slide.dataset.hcmpInput = 'keyboard'; });
  slide.addEventListener('pointerdown', () => { slide.dataset.hcmpInput = 'pointer'; });
  window.Reveal.on('slidechanged', () => { if (dialog.open) close(true); });
  slide.classList.add('hcmp-interactive');
})();
