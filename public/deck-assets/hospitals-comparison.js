// A readable comparison first; optional visual explanations on demand.
(() => {
  const slide = document.getElementById('hospital-comparison');
  if (!slide) return;
  const openers = Array.from(slide.querySelectorAll('[data-hcmp-open]'));
  if (openers.length !== 7) return;

  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const logo = '<img src="/deck-assets/logo-nine-box-light.svg" alt="">';
  const topics = [
    { name: ['Code ownership', 'კოდის საკუთრება'],
      title: ['The first version belongs to you.', 'პირველი ვერსია თქვენ გეკუთვნით.'],
      description: ['The first delivered base-system source code is yours under contract. Your hospital has a concrete alternative to dependence on one supplier.', 'პირველი ჩაბარებული საბაზისო ვერსიის საწყისი კოდი ხელშეკრულებით თქვენია. კლინიკას ერთ მომწოდებელზე დამოკიდებულების ალტერნატივა აქვს.'],
      visual: 'ownership' },
    { name: ['Ongoing development', 'უწყვეტი განვითარება'],
      title: ['Your next idea becomes part of the system.', 'თქვენი შემდეგი იდეა სისტემის ნაწილი ხდება.'],
      description: ['We build and implement every requested feature and change without additional development fees, throughout the partnership.', 'ყველა მოთხოვნილ ფუნქციასა და ცვლილებას ვქმნით და ვნერგავთ დამატებითი განვითარების საფასურის გარეშე — მთელი თანამშრომლობის განმავლობაში.'],
      visual: 'development' },
    { name: ['Financial control', 'ფინანსური კონტროლი'],
      title: ['See revenue and costs together.', 'შემოსავალი და ხარჯი — ერთ სურათში.'],
      description: ['Departmental reporting brings revenue and costs into one view, so your team can manage and plan with the full financial picture.', 'განყოფილებების მიხედვით ანგარიშგება შემოსავალსა და ხარჯს ერთ ხედში აერთიანებს — კლინიკის მართვისა და დაგეგმვისთვის.'],
      visual: 'finance' },
    { name: ['Tailored to you', 'თქვენზე მორგება'],
      title: ['The system adapts to your hospital.', 'სისტემა თქვენს კლინიკას ერგება.'],
      description: ['We shape the capabilities, forms and reports around the way your hospital works, together with your team.', 'თქვენს გუნდთან ერთად ვარგებთ ფუნქციებს, ფორმებსა და ანგარიშებს კლინიკის მუშაობის წესს.'],
      visual: 'tailored' },
    { name: ['One system', 'ერთიანი სისტემა'],
      title: ['Connected work across your hospital.', 'დაკავშირებული მუშაობა მთელ კლინიკაში.'],
      description: ['Shared information connects registration, clinical work, laboratory, imaging and billing in one operating system.', 'საერთო მონაცემები რეგისტრაციას, მკურნალობას, ლაბორატორიას, რადიოლოგიასა და ანგარიშსწორებას ერთ სისტემაში აკავშირებს.'],
      visual: 'unified' },
    { name: ['Data standards', 'მონაცემთა სტანდარტი'],
      title: ['A common language for clinical data.', 'საერთო ენა კლინიკური მონაცემებისთვის.'],
      description: ['Built ground-up on FHIR R4, an international standard for structuring and exchanging health information.', 'სისტემის საფუძველი თავიდანვე FHIR R4-ზეა აგებული — ჯანმრთელობის მონაცემების სტრუქტურირებისა და გაცვლის საერთაშორისო სტანდარტზე.'],
      visual: 'standards' },
    { name: ['Built for AI', 'AI-ისთვის შექმნილი'],
      title: ['AI starts with the right foundation.', 'AI სწორ საფუძველზე იწყება.'],
      description: ['Shared, structured data supports documentation, analysis and future AI services. Availability is agreed by capability; clinical decisions stay with doctors.', 'ერთიანი, სტრუქტურირებული მონაცემები დოკუმენტაციას, ანალიზსა და მომავალ AI სერვისებს ემსახურება. ხელმისაწვდომობა ფუნქციების მიხედვით თანხმდება; კლინიკურ გადაწყვეტილებებს ექიმი იღებს.'],
      visual: 'ai' }
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
  // Each topic has a different task and an observable result, not a shared diagram.
  let sceneState = {};
  const sceneStates = new Map();
  const money = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value) + ' ₾';
  const example = (en = 'Interactive example', ka = 'ინტერაქტიული მაგალითი') => `<div class="hcmp-scene-label"><i></i>${copy(en, ka)}</div>`;
  const choice = (action, value, en, ka, selected) => `<button type="button" data-scene-action="${action}" data-value="${value}" aria-pressed="${selected}">${copy(en, ka)}</button>`;
  const fields = [ ['insurance', 'Insurance', 'დაზღვევა'], ['contact', 'Emergency contact', 'სასწრაფო კონტაქტი'], ['referral', 'Referral source', 'მიმართვის წყარო'] ];
  const contextSources = [
    ['Visit note', 'ვიზიტის ჩანაწერი', 'Visit purpose: follow-up consultation.', 'ვიზიტის მიზანი: შემდგომი კონსულტაცია.'],
    ['Lab result', 'კვლევის შედეგი', 'A demonstration result is linked to the record.', 'სადემონსტრაციო შედეგი ჩანაწერს უკავშირდება.'],
    ['Medication list', 'მედიკამენტების სია', 'The medication list is available in the same context.', 'მედიკამენტების სია იმავე კონტექსტშია ხელმისაწვდომი.']
  ];

  function renderScene(type) {
    if (type === 'ownership') {
      const selected = sceneState.ownership || 'base';
      const clauses = {
        base: [ 'First delivered base version', 'პირველი ჩაბარებული საბაზისო ვერსია', 'Your hospital owns this source code under contract.', 'ეს საწყისი კოდი ხელშეკრულებით თქვენს კლინიკას ეკუთვნის.', 'Hospital ownership', 'კლინიკის საკუთრება' ],
        later: [ 'Later versions', 'მომდევნო ვერსიები', 'Rights to later versions have their own contractual terms. They are distinct from the first-version commitment.', 'მომდევნო ვერსიებზე უფლებებს საკუთარი სახელშეკრულებო პირობები აქვს — პირველი ვერსიისგან ცალკე.', 'Separate terms', 'ცალკე პირობები' ],
        third: [ 'Third-party components', 'მესამე მხარის კომპონენტები', 'Third-party code retains its own licence terms.', 'მესამე მხარის კოდზე მოქმედებს შესაბამისი ლიცენზიის პირობები.', 'Respective licences', 'შესაბამისი ლიცენზიები' ]
      };
      const c = clauses[selected];
      return `<section class="hcmp-scene hcmp-scene--ownership">${example('Explore the ownership scope', 'ნახეთ საკუთრების ფარგლები')}<div class="hcmp-scene-choices">${choice('ownership','base','First version','პირველი ვერსია',selected==='base')}${choice('ownership','later','Later versions','შემდეგი ვერსიები',selected==='later')}${choice('ownership','third','Third-party code','მესამე მხარის კოდი',selected==='third')}</div><div class="hcmp-ownership-document"><span class="hcmp-document-symbol" aria-hidden="true">&lt;/&gt;</span><div><span class="hcmp-mini-label">${copy('SOURCE CODE · OWNERSHIP SCOPE','საწყისი კოდი · საკუთრების ფარგლები')}</span><h3>${copy(c[0],c[1])}</h3><p>${copy(c[2],c[3])}</p><strong class="hcmp-ownership-seal">${selected==='base'?'✓':'§'} ${copy(c[4],c[5])}</strong></div></div><p class="hcmp-scene-note">${copy('An explanation of the offer; exact rights are recorded in the contract.','შეთავაზების განმარტება; კონკრეტული უფლებები ხელშეკრულებაში ფიქსირდება.')}</p></section>`;
    }
    if (type === 'development') {
      const selected = sceneState.request || 'report';
      const previews = {
        report: `<table class="hcmp-sample-table"><thead><tr><th>${copy('Department','განყოფილება')}</th><th>${copy('Revenue','შემოსავალი')}</th><th>${copy('Costs','ხარჯი')}</th></tr></thead><tbody><tr><td>${copy('Outpatient','ამბულატორია')}</td><td>120,000 ₾</td><td>90,000 ₾</td></tr><tr class="hcmp-sample-addition"><td colspan="3">＋ ${copy('Department filter added','განყოფილების ფილტრი დაემატა')}</td></tr></tbody></table>`,
        form: `<div class="hcmp-sample-form"><label>${copy('Patient name','პაციენტის სახელი')}<span>${copy('Demonstration patient','სადემონსტრაციო პაციენტი')}</span></label><label class="hcmp-sample-addition">＋ ${copy('Emergency contact','სასწრაფო კონტაქტი')}<span>${copy('New field in your form','ახალი ველი თქვენს ფორმაში')}</span></label></div>`,
        approval: `<ol class="hcmp-approval"><li>✓ ${copy('Prepared','მომზადებულია')}</li><li class="hcmp-sample-addition">＋ ${copy('Department lead review','განყოფილების ხელმძღვანელის შემოწმება')}</li><li>○ ${copy('Confirmed','დადასტურებულია')}</li></ol>`
      };
      return `<section class="hcmp-scene hcmp-scene--development">${example('Choose a sample request — see what changes', 'აირჩიეთ მოთხოვნის მაგალითი — ნახეთ ცვლილება')}<div class="hcmp-scene-choices">${choice('request','report','Department report','განყოფილების ანგარიში',selected==='report')}${choice('request','form','New form field','ახალი ველი',selected==='form')}${choice('request','approval','Approval step','შეთანხმების ეტაპი',selected==='approval')}</div><div class="hcmp-dev-preview"><div class="hcmp-window-bar"><span>● ● ●</span>${copy('Requested change · example preview','მოთხოვნილი ცვლილება · მაგალითი')}<strong>₾0 ${copy('extra development fee','დამატებითი განვითარების საფასური')}</strong></div><div class="hcmp-dev-content">${previews[selected]}</div></div><p class="hcmp-scene-note">${copy('Illustrative screens and amounts. We build and implement requested changes throughout the partnership.','ეკრანები და თანხები საილუსტრაციოა. მოთხოვნილ ცვლილებებს ვქმნით და ვნერგავთ მთელი თანამშრომლობის განმავლობაში.')}</p></section>`;
    }
    if (type === 'finance') {
      return `<section class="hcmp-scene hcmp-scene--finance">${example('Change the amounts — the comparison updates', 'შეცვალეთ თანხები — ნახეთ სხვაობა')}<div class="hcmp-finance-workspace"><div class="hcmp-finance-inputs"><label>${copy('Department','განყოფილება')}<select data-scene-department><option>${copyText('Outpatient','ამბულატორია')}</option><option>${copyText('Laboratory','ლაბორატორია')}</option><option>${copyText('Imaging','რადიოლოგია')}</option></select></label><label>${copy('Revenue · GEL','შემოსავალი · ₾')}<input type="number" min="0" max="1000000000" step="1000" value="${sceneState.revenue ?? 120000}" data-scene-revenue></label><label>${copy('Costs · GEL','ხარჯი · ₾')}<input type="number" min="0" max="1000000000" step="1000" value="${sceneState.cost ?? 90000}" data-scene-cost></label></div><div class="hcmp-finance-result"><p class="hcmp-finance-selected" data-scene-selected-department>${copyText("Outpatient","ამბულატორია")}</p><span class="hcmp-mini-label">${copy('REVENUE MINUS COSTS','შემოსავალი მინუს ხარჯი')}</span><output data-scene-balance>30,000 ₾</output><div class="hcmp-money-bar"><span>${copy('Revenue','შემოსავალი')}</span><b data-scene-revenue-value>120,000 ₾</b><div><i data-scene-revenue-bar></i></div></div><div class="hcmp-money-bar hcmp-money-bar--cost"><span>${copy('Costs','ხარჯი')}</span><b data-scene-cost-value>90,000 ₾</b><div><i data-scene-cost-bar style="transform:scaleX(.75)"></i></div></div></div></div><p class="hcmp-scene-note">${copy('Editable illustrative amounts. This is arithmetic, not a measured hospital result or an ROI forecast.','თანხები საილუსტრაციოა და იცვლება. ეს არის გამოთვლის მაგალითი და არა კლინიკის გაზომილი შედეგი ან სარგებლის პროგნოზი.')}</p></section>`;
    }
    if (type === 'tailored') {
      const enabled = sceneState.fields || { insurance:true, contact:false, referral:false };
      return `<section class="hcmp-scene hcmp-scene--tailored">${example('Choose what your admission form needs', 'აირჩიეთ, რა სჭირდება თქვენს მიღების ფორმას')}<div class="hcmp-form-builder"><fieldset><legend>${copy('Your requirements','თქვენი მოთხოვნები')}</legend>${fields.map(([key,en,ka])=>`<label><input type="checkbox" data-scene-field="${key}" ${enabled[key]?'checked':''}>${copy(en,ka)}</label>`).join('')}<p>${copy('The form changes with your choices.','ფორმა თქვენს არჩევანს მიჰყვება.')}</p></fieldset><div class="hcmp-form-preview"><div class="hcmp-form-preview-title">${copy('Patient admission','პაციენტის მიღება')}<span>${1+Object.values(enabled).filter(Boolean).length} ${copy('fields','ველი')}</span></div><div class="hcmp-sample-form"><label>${copy('Name and surname','სახელი, გვარი')}<span>${copy('Demonstration patient','სადემონსტრაციო პაციენტი')}</span></label>${fields.filter(([key])=>enabled[key]).map(([,en,ka])=>`<label class="hcmp-sample-addition">${copy(en,ka)}<span>${copy('Added to your form','თქვენს ფორმას დაემატა')}</span></label>`).join('')}</div></div></div><p class="hcmp-scene-note">${copy('A customization illustration. Real forms and workflows are shaped with your team.','მორგების ილუსტრაცია. რეალურ ფორმებსა და პროცესებს თქვენს გუნდთან ერთად ვქმნით.')}</p></section>`;
    }
    if (type === 'unified') {
      const department = sceneState.department || 'clinical';
      const ordered = Boolean(sceneState.ordered), resulted = Boolean(sceneState.resulted);
      const screen = department==='clinical'
        ? `<div class="hcmp-patient-activity"><span class="hcmp-activity-icon">＋</span><div><h3>${copy('Request a laboratory test','მოითხოვეთ ლაბორატორიული კვლევა')}</h3><p>${copy('Then open Laboratory to find the same request.','შემდეგ გახსენით ლაბორატორია — იგივე მოთხოვნა იქ დაგხვდებათ.')}</p></div></div><button class="hcmp-scene-primary" type="button" data-scene-action="order" ${ordered?'disabled':''}>${ordered?copy('Request added ✓','მოთხოვნა დაემატა ✓'):copy('Add sample request','დაამატეთ კვლევის მოთხოვნა')}</button>`
        : department==='lab'
          ? `<div class="hcmp-patient-activity"><span class="hcmp-activity-icon">${ordered?'✓':'○'}</span><div><h3>${ordered?copy('Request received from EMR','მოთხოვნა მიღებულია EMR-დან'):copy('No request yet','მოთხოვნა ჯერ არ არის')}</h3><p>${ordered?copy('Same patient. No re-entering the request.','იგივე პაციენტი — მოთხოვნის ხელახალი შეყვანის გარეშე.'):copy('Add a sample request in the EMR tab.','მოთხოვნა EMR-ის ჩანართიდან დაამატეთ.')}</p></div></div><button class="hcmp-scene-primary" type="button" data-scene-action="result" ${!ordered||resulted?'disabled':''}>${resulted?copy('Sample result added ✓','სადემონსტრაციო შედეგი დაემატა ✓'):copy('Add sample result','დაამატეთ სადემონსტრაციო შედეგი')}</button>`
          : `<div class="hcmp-patient-activity"><span class="hcmp-activity-icon">₾</span><div><h3>${ordered?copy('Requested service is visible','მოთხოვნილი მომსახურება ჩანს'):copy('No requested service yet','მოთხოვნილი მომსახურება ჯერ არ არის')}</h3><p>${ordered?copy('Laboratory test · billing review required.','ლაბორატორიული კვლევა · ანგარიშსწორება შესამოწმებელია.'):copy('The same record connects clinical and financial work.','იგივე ჩანაწერი მკურნალობასა და ფინანსურ სამუშაოს აკავშირებს.')}</p></div></div>`;
      return `<section class="hcmp-scene hcmp-scene--unified">${example('Try one patient journey across departments', 'გაიარეთ ერთი პაციენტის პროცესი განყოფილებებს შორის')}<div class="hcmp-patient-header"><span class="hcmp-patient-avatar" aria-hidden="true">D</span><div><strong>${copy('Demonstration patient','სადემონსტრაციო პაციენტი')}</strong><span>DEMO-001 · ${copy('one shared record','ერთი საერთო ჩანაწერი')}</span></div><span class="hcmp-patient-status">${resulted?copy('Result available','შედეგი ხელმისაწვდომია'):ordered?copy('Test requested','კვლევა მოთხოვნილია'):copy('Visit opened','ვიზიტი გახსნილია')}</span></div><div class="hcmp-scene-choices hcmp-department-tabs">${choice('department','clinical','EMR','EMR',department==='clinical')}${choice('department','lab','Laboratory','ლაბორატორია',department==='lab')}${choice('department','finance','Finance','ფინანსები',department==='finance')}</div><div class="hcmp-patient-screen">${screen}${resulted?`<p class="hcmp-shared-result">✓ ${copy('The sample result is available in the shared record.','სადემონსტრაციო შედეგი საერთო ჩანაწერშია ხელმისაწვდომი.')}</p>`:''}</div><p class="hcmp-scene-note">${copy('Workflow illustration with a synthetic record, not a live product session.','პროცესის ილუსტრაცია სინთეტიკური ჩანაწერით — არა პროდუქტის ცოცხალი სესია.')}</p></section>`;
    }
    if (type === 'standards') {
      const selected = sceneState.resource || 'patient';
      const resources = {
        patient: { name:'Patient', label:['Patient name','პაციენტის სახელი'], aliases:['patient_name','სახელი, გვარი','fullName'], target:'Patient.name', value:['Demonstration patient','სადემონსტრაციო პაციენტი'], json:{resourceType:'Patient',id:'demo-patient',name:[{text:'Demonstration patient'}]} },
        result: { name:'Observation',label:['Laboratory result','ლაბორატორიული შედეგი'],aliases:['lab_result','კვლევის შედეგი','result'],target:'Observation.valueString',value:['Demonstration result','სადემონსტრაციო შედეგი'],json:{resourceType:'Observation',status:'final',code:{text:'Demonstration test'},subject:{reference:'Patient/demo-patient'},valueString:'Demonstration result'} },
        service: { name:'ServiceRequest',label:['Requested service','მოთხოვნილი მომსახურება'],aliases:['order','მოთხოვნა','service_request'],target:'ServiceRequest.code',value:['Demonstration test','სადემონსტრაციო კვლევა'],json:{resourceType:'ServiceRequest',status:'draft',intent:'order',code:{text:'Demonstration test'},subject:{reference:'Patient/demo-patient'}} }
      };
      const r=resources[selected];
      return `<section class="hcmp-scene hcmp-scene--standards">${example('See what a common data standard means', 'ნახეთ, რას ნიშნავს მონაცემთა საერთო სტანდარტი')}<div class="hcmp-scene-choices">${choice('resource','patient','Patient','პაციენტი',selected==='patient')}${choice('resource','result','Result','შედეგი',selected==='result')}${choice('resource','service','Service','მომსახურება',selected==='service')}</div><div class="hcmp-standard-example"><div><span class="hcmp-mini-label">${copy('DIFFERENT FIELD NAMES','სხვადასხვა დასახელება')}</span><h3>${copy(...r.label)}</h3><ul>${r.aliases.map(alias=>`<li><code>${alias}</code></li>`).join('')}</ul></div><div class="hcmp-standard-resource"><span class="hcmp-resource-badge">FHIR R4 · ${r.name}</span><code>${r.target}</code><strong>${copy(...r.value)}</strong><span>${copy('One agreed structure for the same information.','ერთი შეთანხმებული სტრუქტურა იმავე ინფორმაციისთვის.')}</span></div></div><details class="hcmp-resource-json"><summary>${copy('View the example structure','იხილეთ მაგალითის სტრუქტურა')}</summary><pre>${JSON.stringify(r.json,null,2)}</pre></details><p class="hcmp-scene-note">${copy('A data-structure example. Actual exchange also requires agreed mappings and connections.','მონაცემთა სტრუქტურის მაგალითი. რეალურ გაცვლას შესაბამისი მიბმა და კავშირებიც სჭირდება.')}</p></section>`;
    }
    const enabled = sceneState.context || [true,false,false];
    return `<section class="hcmp-scene hcmp-scene--ai">${example('Choose the information available to AI', 'აირჩიეთ, რა ინფორმაცია ექნება ხელმისაწვდომი AI-ს')}<div class="hcmp-context-workspace"><fieldset><legend>${copy('Connected sources','დაკავშირებული წყაროები')}</legend>${contextSources.map((source,i)=>`<label><input type="checkbox" data-scene-context="${i}" ${enabled[i]?'checked':''}>${copy(source[0],source[1])}</label>`).join('')}<span class="hcmp-context-count">${enabled.filter(Boolean).length} / 3 ${copy('sources connected','წყარო დაკავშირებულია')}</span></fieldset><div class="hcmp-context-document"><span class="hcmp-mini-label">${copy('CONTEXT ASSEMBLED FOR AI','AI-სთვის შეკრული კონტექსტი')}</span>${contextSources.map((source,i)=>`<div class="hcmp-context-line ${enabled[i]?'is-available':''}"><span aria-hidden="true">${enabled[i]?'✓':'—'}</span><p>${enabled[i]?copy(source[2],source[3]):copy('Source not connected','წყარო არ არის დაკავშირებული')}<small>${copy(source[0],source[1])}</small></p></div>`).join('')}</div></div><p class="hcmp-scene-note">${copy('Context illustration, not a live AI response. Capability availability is agreed separately; clinicians retain decisions.','კონტექსტის ილუსტრაცია — არა AI-ის ცოცხალი პასუხი. ფუნქციების ხელმისაწვდომობა ცალკე თანხმდება; გადაწყვეტილებებს ექიმი იღებს.')}</p></section>`;
  }

  function copyText(en, ka) { return document.documentElement.lang === 'ka' ? ka : en; }
  function updateFinance() {
    const revenue=Math.max(0,Math.min(1e9,Number(visualHome.querySelector('[data-scene-revenue]').value)||0));
    const cost=Math.max(0,Math.min(1e9,Number(visualHome.querySelector('[data-scene-cost]').value)||0));
    sceneState.revenue=revenue;
    sceneState.cost=cost;
    visualHome.querySelector('[data-scene-balance]').textContent=money(revenue-cost);
    visualHome.querySelector('.hcmp-finance-result').classList.toggle('is-negative',cost>revenue);
    visualHome.querySelector('[data-scene-revenue-value]').textContent=money(revenue);
    visualHome.querySelector('[data-scene-cost-value]').textContent=money(cost);
    const max=Math.max(revenue,cost,1);
    visualHome.querySelector('[data-scene-revenue-bar]').style.transform=`scaleX(${revenue/max})`;
    visualHome.querySelector('[data-scene-cost-bar]').style.transform=`scaleX(${cost/max})`;
  }
  function refreshScene(focusSelector) {
    visualHome.innerHTML=renderScene(topics[index].visual);
    if(topics[index].visual==='finance'){
      const department=visualHome.querySelector('[data-scene-department]');
      department.selectedIndex=sceneState.financeDepartment ?? 0;
      visualHome.querySelector('[data-scene-selected-department]').textContent=department.value;
      updateFinance();
    }
    if(focusSelector) visualHome.querySelector(focusSelector)?.focus({preventScroll:true});
  }
  visualHome.addEventListener('click',event=>{
    const button=event.target.closest('[data-scene-action]');
    if(!button)return;
    const action=button.dataset.sceneAction, value=button.dataset.value;
    if(action==='order')sceneState.ordered=true;
    else if(action==='result')sceneState.resulted=true;
    else sceneState[action]=value;
    const focusSelector=action==='order'?'[data-scene-action="department"][data-value="lab"]':action==='result'?'[data-scene-action="department"][data-value="finance"]':`[data-scene-action="${action}"]${value?`[data-value="${value}"]`:''}`;
    refreshScene(focusSelector);
  });
  visualHome.addEventListener('input',event=>{
    if(event.target.matches('[data-scene-revenue],[data-scene-cost]'))updateFinance();
  });
  visualHome.addEventListener('change',event=>{
    if(event.target.matches('[data-scene-department]')){
      sceneState.financeDepartment=event.target.selectedIndex;
      visualHome.querySelector('[data-scene-selected-department]').textContent=event.target.value;
    }
    const field=event.target.dataset.sceneField,context=event.target.dataset.sceneContext;
    if(field){sceneState.fields={insurance:true,contact:false,referral:false,...sceneState.fields,[field]:event.target.checked};refreshScene(`[data-scene-field="${field}"]`);}
    if(context!==undefined){sceneState.context=[...(sceneState.context||[true,false,false])];sceneState.context[Number(context)]=event.target.checked;refreshScene(`[data-scene-context="${context}"]`);}
  });

  function select(next, keyboard) {
    index = next;
    dialog.dataset.input = keyboard ? 'keyboard' : 'pointer';
    const topic = topics[index];
    topicButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    dialog.querySelector('#hcmp-explorer-title').innerHTML = copy(...topic.title);
    dialog.querySelector('#hcmp-detail-description').innerHTML = copy(...topic.description);
    dialog.querySelector('.hcmp-detail-count').textContent = `0${index + 1} / 07`;
    dialog.querySelector('[data-hcmp-prev]').disabled = index === 0;
    dialog.querySelector('[data-hcmp-next]').disabled = index === topics.length - 1;
    if(!sceneStates.has(topic.visual))sceneStates.set(topic.visual,{});
    sceneState=sceneStates.get(topic.visual);
    refreshScene();
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
    if (event.target.closest('.hcmp-scene')) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    select(Math.max(0, Math.min(topics.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1))), true);
  });
  dialog.addEventListener('close', () => {
    closing = false;
    transition?.cancel();
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', () => { slide.dataset.hcmpInput = 'keyboard'; });
  slide.addEventListener('pointerdown', () => { slide.dataset.hcmpInput = 'pointer'; });
  window.Reveal.on('slidechanged', () => { if (dialog.open) close(true); });
  slide.classList.add('hcmp-interactive');
})();
