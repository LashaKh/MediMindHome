// Clear benefit explanations; navigation opens the topic without a simulated product demo.
(() => {
  const slide = document.getElementById('hospital-comparison');
  if (!slide) return;
  const openers = Array.from(slide.querySelectorAll('[data-hcmp-open]'));
  if (openers.length !== 7) return;

  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const logo = '<img src="/deck-assets/logo-nine-box-light.svg" alt="">';
  const topics = [
  {
    "name": [
      "Code ownership",
      "კოდის საკუთრება"
    ],
    "title": [
      "You own the code of the first version.",
      "პირველი ვერსიის კოდი თქვენ გეკუთვნით."
    ],
    "description": [
      "We transfer ownership of the first delivered base version’s source code to your hospital under contract. If you are unhappy with MediMind’s work in the future, you can continue maintaining and developing that version with another team.",
      "პირველი ჩაბარებული საბაზისო ვერსიის საწყის კოდს ხელშეკრულებით თქვენს საკუთრებაში გადავცემთ. თუ მომავალში MediMind-ის მუშაობით უკმაყოფილო იქნებით, ამ ვერსიის მოვლა და განვითარება სხვა გუნდთან შეგიძლიათ გააგრძელოთ."
    ],
    "sections": [
      {
        "title": [
          "You choose who continues the work",
          "თქვენ ირჩევთ, ვინ გააგრძელებს მუშაობას"
        ],
        "text": [
          "Developers you choose can study the code, fix faults and develop the first version. You can therefore change development teams without being forced to depend on MediMind for that version’s continued maintenance.",
          "თქვენ მიერ შერჩეული დეველოპერები შეძლებენ კოდის შესწავლას, შეცდომების გამოსწორებასა და პირველი ვერსიის განვითარებას. ამ ვერსიაზე მუშაობის გასაგრძელებლად MediMind-ზე დამოკიდებული აღარ იქნებით."
        ]
      },
      {
        "title": [
          "Other authors’ code and later versions",
          "სხვა ავტორების კოდი და მომდევნო ვერსიები"
        ],
        "text": [
          "Software parts created by other authors retain those authors’ licence terms. Rights to later versions are governed by separate contractual terms.",
          "სისტემაში გამოყენებული, სხვა ავტორების მიერ შექმნილი პროგრამული ნაწილები მათივე ლიცენზიის პირობებს ექვემდებარება. მომდევნო ვერსიებზე უფლებები ხელშეკრულებით ცალკე განისაზღვრება."
        ]
      }
    ]
  },
  {
    "name": [
      "Ongoing development",
      "უწყვეტი განვითარება"
    ],
    "title": [
      "We deliver complex requests too.",
      "რთულ მოთხოვნებსაც სრულად ვახორციელებთ."
    ],
    "description": [
      "Throughout our partnership, we build and implement every requested software feature and change without additional development fees. The scope reaches beyond a new form or field to complete workflows and specialised clinical tools.",
      "თანამშრომლობის განმავლობაში ყველა მოთხოვნილ პროგრამულ ფუნქციასა და ცვლილებას განვითარების დამატებითი საფასურის გარეშე ვქმნით და ვნერგავთ. ეს მოიცავს როგორც მცირე ცვლილებებს, ისე სრულ სამუშაო პროცესებსა და სპეციალიზებულ კლინიკურ ინსტრუმენტებს."
    ],
    "sections": [
      {
        "title": [
          "From a small change to a complex tool",
          "მცირე ცვლილებიდან რთულ პროგრამამდე"
        ],
        "text": [
          "We can deliver software requests of any complexity, including a complete clinical tool, a new module, connections to other systems or a workflow spanning several departments.",
          "შეგვიძლია ნებისმიერი სირთულის პროგრამული ამოცანის გადაწყვეტა. ეს შეიძლება იყოს სრული კლინიკური ინსტრუმენტი, ახალი მოდული, სხვა სისტემებთან დაკავშირება ან რამდენიმე განყოფილების საერთო სამუშაო პროცესი."
        ]
      },
      {
        "title": [
          "Useful tools improve the system for both of us",
          "სასარგებლო ინსტრუმენტები ჩვენს სისტემასაც აუმჯობესებს"
        ],
        "text": [
          "It is in our interest to give your team more useful, productive tools. Solving real hospital needs makes your work easier and helps us improve MediMind.",
          "ჩვენს ინტერესშიცაა, რომ თქვენმა გუნდმა მეტი სასარგებლო ინსტრუმენტი მიიღოს და უფრო პროდუქტიულად იმუშაოს. კლინიკის რეალური საჭიროებების გადაწყვეტა თქვენს მუშაობას ამარტივებს და MediMind-საც უფრო სრულყოფილს ხდის."
        ]
      }
    ]
  },
  {
    "name": [
      "Financial control",
      "ფინანსური კონტროლი"
    ],
    "title": [
      "See where costs rise and revenue is missed.",
      "ხედავთ, სად იზრდება ხარჯი და იკარგება შემოსავალი."
    ],
    "description": [
      "View each department’s revenue and costs together. Compare departments and identify the areas that need attention.",
      "თითოეული განყოფილების შემოსავალსა და ხარჯებს ერთად ხედავთ. შეგიძლიათ შეადაროთ განყოფილებები და გაარკვიოთ, რომელ მიმართულებას სჭირდება ყურადღება."
    ],
    "sections": [
      {
        "title": [
          "Understand each department’s financial position",
          "თითოეული განყოფილების ფინანსური სურათი"
        ],
        "text": [
          "Management can assess what a department earns and spends without piecing those figures together from disconnected reports.",
          "ხელმძღვანელი ხედავს, რამდენი შემოსავალი აქვს თითოეულ განყოფილებას და რა ხარჯი ახლავს მის მუშაობას. ამ სურათის მისაღებად სხვადასხვა ანგარიშის ცალ-ცალკე შეჯერება აღარ სჭირდება."
        ]
      },
      {
        "title": [
          "Make decisions using your hospital’s figures",
          "გადაწყვეტილებები კლინიკის მონაცემებზე დაყრდნობით"
        ],
        "text": [
          "Use the information to plan budgets, investigate growing costs and decide which processes need to change.",
          "ამ ინფორმაციაზე დაყრდნობით გეგმავთ ბიუჯეტს, ამოწმებთ ხარჯის ზრდას და წყვეტთ, რომელ პროცესს სჭირდება ცვლილება."
        ]
      }
    ]
  },
  {
    "name": [
      "Tailored to you",
      "თქვენზე მორგება"
    ],
    "title": [
      "You set the working process. We adapt the software.",
      "თქვენ ადგენთ მუშაობის წესს. ჩვენ პროგრამას ვარგებთ."
    ],
    "description": [
      "When software lacks a needed function, staff have to add extra steps or do part of the work manually. Together with your team, we define the processes you need and build them into the system.",
      "როცა პროგრამას საჭირო ფუნქცია აკლია, თანამშრომლებს დამატებითი ნაბიჯების გავლა ან სამუშაოს ნაწილის ხელით შესრულება უწევთ. თქვენს გუნდთან ერთად ვაზუსტებთ საჭირო პროცესებს და პროგრამაში ვაწყობთ."
    ],
    "sections": [
      {
        "title": [
          "The whole workflow",
          "მთელი სამუშაო პროცესი"
        ],
        "text": [
          "Tailoring includes the sequence of tasks, staff roles, forms, reports and the transfer of information between departments.",
          "ვარგებთ სამუშაოს ეტაპებს, თანამშრომლების როლებს, ფორმებს, ანგარიშებსა და განყოფილებებს შორის ინფორმაციის გადაცემას."
        ]
      },
      {
        "title": [
          "Your team helps shape the result",
          "თქვენი გუნდის მონაწილეობით"
        ],
        "text": [
          "Your staff explain their needs and check whether the agreed solution works comfortably in day-to-day practice.",
          "თქვენი თანამშრომლები გვიხსნიან საჭიროებებს და ამოწმებენ, რამდენად მოსახერხებელია შეთანხმებული გადაწყვეტა ყოველდღიურ მუშაობაში."
        ]
      }
    ]
  },
  {
    "name": [
      "One system",
      "ერთიანი სისტემა"
    ],
    "title": [
      "All departments work in one system.",
      "ყველა განყოფილება ერთ სისტემაში მუშაობს."
    ],
    "description": [
      "Registration, clinical work, laboratory, imaging and billing are connected in one operating system and use shared information.",
      "რეგისტრაცია, მკურნალობა, ლაბორატორია, რადიოლოგია და ანგარიშსწორება ერთ ოპერაციულ სისტემაშია გაერთიანებული. ყველა მიმართულება საერთო მონაცემებს იყენებს."
    ],
    "sections": [
      {
        "title": [
          "One shared patient record",
          "პაციენტის საერთო ჩანაწერი"
        ],
        "text": [
          "The patient’s record, requested tests, results and delivered services remain connected across the relevant departments.",
          "პაციენტის ჩანაწერი, დანიშნული კვლევები, შედეგები და გაწეული მომსახურება შესაბამის განყოფილებებს შორის ერთმანეთთანაა დაკავშირებული."
        ]
      },
      {
        "title": [
          "Less repeated entry and reconciliation",
          "ნაკლები განმეორებითი შეყვანა და გადამოწმება"
        ],
        "text": [
          "Sharing information reduces the need to enter the same data again or reconcile separate copies as work moves between departments.",
          "საერთო მონაცემები ამცირებს ერთი და იმავე ინფორმაციის ხელახლა შეყვანისა და სხვადასხვა პროგრამაში არსებული ჩანაწერების ერთმანეთთან გადამოწმების საჭიროებას."
        ]
      }
    ]
  },
  {
    "name": [
      "Data standards",
      "მონაცემთა სტანდარტი"
    ],
    "title": [
      "Clinical data follows an international standard.",
      "კლინიკური მონაცემები საერთაშორისო სტანდარტს შეესაბამება."
    ],
    "description": [
      "MediMind is built ground-up on FHIR R4, an international standard for describing and exchanging health information.",
      "MediMind თავიდანვე FHIR R4 სტანდარტზეა აგებული. ეს ჯანმრთელობის მონაცემების აღწერისა და გაცვლის საერთაშორისო სტანდარტია."
    ],
    "sections": [
      {
        "title": [
          "A consistent way to describe information",
          "ინფორმაციის აღწერის საერთო წესი"
        ],
        "text": [
          "The standard defines how to describe patients, tests, medications and other clinical information. This provides a foundation for exchanging information with other systems.",
          "სტანდარტი განსაზღვრავს, როგორ აღიწერება პაციენტი, კვლევა, მედიკამენტი და სხვა კლინიკური ინფორმაცია. ეს სხვა სისტემებთან ინფორმაციის გაცვლის საფუძველს ქმნის."
        ]
      },
      {
        "title": [
          "Connections are implemented separately",
          "სისტემებს შორის კავშირის გამართვა"
        ],
        "text": [
          "Actual exchange still requires agreed field mappings and a working connection to the particular system. A common standard does not make every connection automatic.",
          "რეალური გაცვლისთვის მონაცემთა ველების შესაბამისობაც უნდა განისაზღვროს და კონკრეტულ სისტემასთან კავშირიც გაიმართოს. საერთო სტანდარტი ყველა კავშირის ავტომატურად ამუშავებას არ ნიშნავს."
        ]
      }
    ]
  },
  {
    "name": [
      "AI readiness",
      "AI-ისთვის მზადყოფნა"
    ],
    "title": [
      "Ready for AI tools today and tomorrow.",
      "AI-ისთვის მზადყოფნა დღეს და მომავალში."
    ],
    "description": [
      "MediMind’s infrastructure and data structure are designed from the outset to support AI tools. This gives your hospital a foundation for both current AI services and future capabilities.",
      "MediMind-ის ინფრასტრუქტურა და მონაცემთა სტრუქტურა თავიდანვე AI-ის ხელსაწყოების დასამატებლადაა შექმნილი. ეს კლინიკას როგორც დღევანდელი AI სერვისების, ისე მომავალი შესაძლებლობების გამოყენებისთვის ამზადებს."
    ],
    "sections": [
      {
        "title": [
          "First address the infrastructure and data",
          "ჯერ ინფრასტრუქტურა და მონაცემები უნდა მოწესრიგდეს"
        ],
        "text": [
          "Simply adding an AI tool does not resolve the limitations of legacy infrastructure. Data scattered across databases or stored without a consistent structure needs preparation and linking. Inaccurate, duplicated or incomplete records also need checking and correction before reliable integration.",
          "ძველ ინფრასტრუქტურაში მხოლოდ AI-ის დამატება საკმარისი არ არის. სხვადასხვა ბაზაში გაფანტულ და არასტრუქტურირებულ მონაცემებს მომზადება და ერთმანეთთან დაკავშირება სჭირდება. არაზუსტი, დუბლირებული და არასრული ჩანაწერები კი ცალკე უნდა შემოწმდეს და გასწორდეს."
        ]
      },
      {
        "title": [
          "A foundation for today’s tools and future AI",
          "საფუძველი დღევანდელი ხელსაწყოებისა და მომავალი AI-ისთვის"
        ],
        "text": [
          "MediMind brings clinical information into one system using a shared FHIR R4 data structure. This provides a consistent foundation for connecting AI tools to the hospital’s processes and adding new capabilities over time. A common structure still requires data-quality checks.",
          "MediMind კლინიკურ ინფორმაციას ერთ სისტემაში, საერთო FHIR R4 სტრუქტურით აერთიანებს. ეს საფუძველია AI-ის ხელსაწყოების კლინიკის პროცესებთან დასაკავშირებლად და მომავალში ახალი შესაძლებლობების დასამატებლად. მონაცემების ხარისხის შემოწმება ამ შემთხვევაშიც აუცილებელია."
        ]
      },
      {
        "title": [
          "Your hospital chooses the next step",
          "შემდეგ ნაბიჯს თქვენი კლინიკა ირჩევს"
        ],
        "text": [
          "AI readiness does not mean every AI tool is available today. AI is optional, and we agree each capability, its availability and implementation scope separately. Clinical decisions remain with doctors.",
          "AI-ისთვის მზადყოფნა ყველა AI ხელსაწყოს დღესვე ხელმისაწვდომობას არ ნიშნავს. AI-ის დამატება არჩევითია. კონკრეტულ ფუნქციას, მის ხელმისაწვდომობასა და დანერგვის მოცულობას ცალკე ვათანხმებთ. კლინიკურ გადაწყვეტილებებს ექიმი იღებს."
        ]
      }
    ]
  }
];
  const dialog = document.createElement('dialog');
  dialog.id = 'hcmp-explorer';
  dialog.className = 'hcmp-dialog';
  dialog.setAttribute('aria-labelledby', 'hcmp-explorer-title');
  dialog.setAttribute('aria-describedby', 'hcmp-detail-description');
  dialog.innerHTML = `
    <header class="hcmp-dialog-header">
      <div class="hcmp-dialog-brand">${logo}<span>Medi<span>Mind</span></span></div>
      <span class="hcmp-dialog-eyebrow">${copy('THE DIFFERENCE, EXPLAINED', 'განსხვავება უფრო დეტალურად')}</span>
      <button type="button" class="hcmp-dialog-close" data-hcmp-close aria-label="Close / დახურვა">×</button>
    </header>
    <div class="hcmp-dialog-body">
      <nav class="hcmp-topics" aria-label="Comparison topics / შედარების თემები">
        ${topics.map((t, i) => `<button type="button" data-hcmp-topic="${i}" aria-pressed="false"><span class="hcmp-topic-number">0${i + 1}</span><span>${copy(...t.name)}</span><span class="hcmp-topic-arrow" aria-hidden="true">↗</span></button>`).join('')}
      </nav>
      <div class="hcmp-explanation">
        <div class="hcmp-detail-heading"><span class="hcmp-detail-kicker">${copy('YOUR HOSPITAL, WITH MEDIMIND', 'თქვენი კლინიკა, MediMind-თან ერთად')}</span><h2 id="hcmp-explorer-title"></h2><p id="hcmp-detail-description"></p></div>
        <div class="hcmp-reading"></div>
        <footer class="hcmp-detail-footer"><button type="button" data-hcmp-prev aria-label="Previous difference / წინა განსხვავება">←</button><span class="hcmp-detail-count" aria-live="polite"></span><button type="button" class="hcmp-detail-next" data-hcmp-next>${copy('Next difference', 'შემდეგი განსხვავება')} <span aria-hidden="true">→</span></button></footer>
      </div>
    </div>`;
  document.body.append(dialog);
  const topicButtons = Array.from(dialog.querySelectorAll('[data-hcmp-topic]'));
  const reading = dialog.querySelector('.hcmp-reading');
  let index = 0;
  let opener;
  let keyboardBeforeOpen;
  let closing = false;
  let transition;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
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
    reading.innerHTML = topic.sections.map(section => `<section class="hcmp-point"><h3>${copy(...section.title)}</h3><p>${copy(...section.text)}</p></section>`).join('');
    dialog.scrollTop = 0;
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
    transition?.cancel();
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', () => { slide.dataset.hcmpInput = 'keyboard'; });
  slide.addEventListener('pointerdown', () => { slide.dataset.hcmpInput = 'pointer'; });
  window.Reveal.on('slidechanged', () => { if (dialog.open) close(true); });
  slide.classList.add('hcmp-interactive');
})();
