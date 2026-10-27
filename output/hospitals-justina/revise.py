from pathlib import Path
import re

path = Path("public/hospitals.html")
source = path.read_text()
matches = list(re.finditer(r"<section\b[^>]*>.*?</section>", source, re.S))
assert len(matches) == 17
slides = [m.group() for m in matches]
footer = re.search(r'<a class="brand-footer".*?</a>', slides[2], re.S).group()


def bi(en, ka):
    return f'<span class="lang-en">{en}</span><span class="lang-ka" style="display:none;">{ka}</span>'


def replace(i, old, new):
    assert slides[i].count(old) == 1, (i, old, slides[i].count(old))
    slides[i] = slides[i].replace(old, new)


def pair(i, old_en, old_ka, new_en, new_ka):
    replace(i, bi(old_en, old_ka), bi(new_en, new_ka))


def notes(i, en, ka):
    slides[i], count = re.subn(
        r'<aside class="notes">.*?</aside>',
        lambda _: '<aside class="notes">' + bi(en, ka) + "</aside>",
        slides[i], flags=re.S,
    )
    assert count == 1


def label(number, en, ka):
    return f'<div class="slide-label"><span class="label-num">{number}</span>{bi(en, ka)}</div>'


def section(classes, number, en_label, ka_label, en_title, ka_title, en_sub, ka_sub, body, en_notes, ka_notes):
    return f'''<section class="{classes}">
        <div class="slide-inner">
          {label(number, en_label, ka_label)}
          <h2 class="headline-big">{bi(en_title, ka_title)}</h2>
          <p class="headline-sub">{bi(en_sub, ka_sub)}</p>
          {body}
        </div>
        {footer}
        <aside class="notes">{bi(en_notes, ka_notes)}</aside>
      </section>'''


# The original cover image and logo stay in place; the first read is the buyer's benefit.
pair(0, "Hospital Partnership", "პარტნიორობა კლინიკებისთვის",
     "Hospital operating system", "კლინიკის ოპერაციული სისტემა")
pair(0, "The AI-native <em>operating system</em>", "ერთიანი <em>ოპერაციული სისტემა</em>",
     "Less <em>repeat work.</em>", "ნაკლები <em>განმეორებითი სამუშაო.</em>")
pair(0, "for <em>your hospital</em>.", "<em>თქვენი მთელი კლინიკისთვის.</em>",
     "More time <em>for patients.</em>", "მეტი დრო <em>პაციენტებისთვის.</em>")
pair(0, "AI · Clinical care · Laboratory · PACS · Patient Portal.", "AI · მკურნალობა · ლაბორატორია · PACS · პაციენტის პორტალი.",
     "Clinical care, laboratory and billing in one hospital operating system, tailored to the way your teams work.",
     "მკურნალობა, ლაბორატორია და ანგარიშსწორება ერთ ოპერაციულ სისტემაში — თქვენი კლინიკის მუშაობაზე მორგებული.")
notes(0,
      "For hospital owners and directors considering a change of clinical, laboratory and administrative software. The first conversation is about a real process that creates repeat work. MediMind is the hospital operating system that brings that work together. Use this introduction after a warm referral; the next step is a 30-minute conversation.",
      "პრეზენტაცია განკუთვნილია კლინიკის მფლობელებისა და დირექტორებისთვის, რომლებიც სამედიცინო, ლაბორატორიული და ადმინისტრაციული პროგრამების შეცვლას განიხილავენ. საუბარს ვიწყებთ იმ პროცესით, რომელიც თანამშრომლებს განმეორებით მუშაობას უწევს. MediMind ამ საქმიანობას კლინიკის ერთ ოპერაციულ სისტემაში აერთიანებს. შემდეგი ნაბიჯია 30-წუთიანი შეხვედრა.")

# A separate problem slide gives the comparison the context Justina found missing.
problems = [
    ("01", "Information", "ინფორმაცია",
     "One patient. Several programs.", "ერთი პაციენტი — რამდენიმე პროგრამა",
     "The history is in one place, results in another. Staff search and cross-check before they can act.",
     "ისტორია ერთგანაა, შედეგები — სხვაგან. თანამშრომლებს ინფორმაციის მოძიება და გადამოწმება უწევთ.",
     "Time spent finding the full picture.", "დრო იხარჯება სრული სურათის აღდგენაზე."),
    ("02", "Staff time", "თანამშრომლების დრო",
     "The same details, entered again.", "იგივე მონაცემები — ხელახლა",
     "Registration, test orders and billing ask staff to type the same patient details more than once.",
     "რეგისტრაციის, კვლევის შეკვეთისა და ანგარიშსწორებისას პაციენტის იგივე მონაცემები ხელახლა შეჰყავთ.",
     "More entry. More checking and correction.", "მეტი შეყვანა, გადამოწმება და გასწორება."),
    ("03", "Control", "მართვა",
     "One change. Several suppliers.", "ერთი ცვლილება — რამდენიმე მომწოდებელი",
     "A department needs a new form. Your team coordinates suppliers, quotes and support requests.",
     "განყოფილებას ახალი ფორმა სჭირდება. თქვენი გუნდი მომწოდებლებთან ათანხმებს მოთხოვნას, ფასსა და მხარდაჭერას.",
     "Staff adapt their work to the software.", "თანამშრომლები საქმეს პროგრამას არგებენ."),
]
problem_cards = "".join(
    f'<article class="hjb-card"><div class="hjb-eyebrow"><b>{n}</b>{bi(e, k)}</div>'
    f'<h3>{bi(et, kt)}</h3><p>{bi(ed, kd)}</p><div class="hjb-result">{bi(er, kr)}</div></article>'
    for n, e, k, et, kt, ed, kd, er, kr in problems
)
problem = section(
    "gw-slide hjb-problems", "01", "THE HOSPITAL’S DAILY WORK", "კლინიკის ყოველდღიური სამუშაო",
    "When software is separate, <em>staff do the connecting.</em>",
    "ცალკეულ პროგრამებს <em>თქვენი გუნდი აკავშირებს</em>",
    "For hospitals managing clinical care, diagnostics and billing in separate programs.",
    "კლინიკებისთვის, სადაც მკურნალობა, დიაგნოსტიკა და ანგარიშსწორება სხვადასხვა პროგრამაში იმართება.",
    f'<div class="hjb-grid">{problem_cards}</div><div class="hjb-bottom">{bi("The extra work sits between departments — where a patient’s information has to be passed on.", "ზედმეტი სამუშაო განყოფილებებს შორის ჩნდება — იქ, სადაც პაციენტის ინფორმაცია უნდა გადაიცეს.")}</div>',
    "These are recognizable situations in a fragmented setup, not survey statistics or a diagnosis of every hospital. Ask which example matches the hospital's recent experience. Start with a process the director and process owner recognize. The three themes are information, staff time and control; the next slide uses exactly the same themes.",
    "ეს მაგალითები ცალკეულ პროგრამებზე მუშაობისას წარმოქმნილ სიტუაციებს აღწერს და არა ყველა კლინიკის დადასტურებულ მდგომარეობას. დააზუსტეთ, რომელი მაგალითი შეესაბამება კლინიკის ახლანდელ გამოცდილებას. სამი თემა — ინფორმაცია, თანამშრომლების დრო და მართვა — მომდევნო სლაიდზეც იმავე თანმიმდევრობით მეორდება.",
)

# Keep the original paired-board design, but use three memorable buyer-level comparisons.
cross = re.search(r'<span class="hxr3-mark".*?</span>', slides[2], re.S).group()
check = re.search(r'<div class="hxr3-cell hxr3-cell--us">(<span class="hxr3-mark".*?</span>)', slides[2], re.S).group(1)
rows = [
    ("Information", "ინფორმაცია",
     "Staff search across clinical, lab and billing programs to assemble the patient’s information.",
     "პაციენტის სრული ინფორმაციისთვის თანამშრომლები სამედიცინო, ლაბორატორიულ და ფინანსურ პროგრამებს ამოწმებენ.",
     "<strong>The same patient information for each team.</strong> Clinical care, results and recorded services in one system.",
     "<strong>ერთიანი ინფორმაცია ყველა გუნდისთვის.</strong> მკურნალობა, შედეგები და აღრიცხული მომსახურება ერთ სისტემაში."),
    ("Staff time", "თანამშრომლების დრო",
     "The same patient details are entered again at registration, ordering and billing.",
     "რეგისტრაციის, შეკვეთისა და ანგარიშსწორებისას პაციენტის მონაცემები ხელახლა შეჰყავთ.",
     "<strong>Enter details once, reuse them.</strong> Information follows the patient through the agreed process.",
     "<strong>შეიყვანეთ ერთხელ, გამოიყენეთ შემდეგ ეტაპზეც.</strong> ინფორმაცია პაციენტს შეთანხმებული პროცესის ყველა ეტაპზე მიჰყვება."),
    ("Control", "მართვა",
     "Your team coordinates separate suppliers for changes, training and support.",
     "ცვლილებების, სწავლებისა და მხარდაჭერისთვის თქვენი გუნდი სხვადასხვა მომწოდებელს უკავშირდება.",
     "<strong>One team takes responsibility.</strong> We implement, train and adapt the agreed base system to staff needs.",
     "<strong>პასუხისმგებელია ერთი გუნდი.</strong> ჩვენ ვნერგავთ, ვასწავლით და შეთანხმებულ სისტემას თანამშრომლების საჭიროებებს ვარგებთ."),
]
board = '''<div class="hxr3-board">
  <span class="hxr3-glow" aria-hidden="true"></span><span class="hxr3-bg hxr3-bg--them" aria-hidden="true"></span>
  <span class="hxr3-bg hxr3-bg--us" aria-hidden="true"></span><span class="hxr3-spine" aria-hidden="true"></span>
  <div class="hxr3-row hxr3-row--head">
    <div class="hxr3-head hxr3-head--them">''' + bi("Working across separate programs", "ცალკეულ პროგრამებში მუშაობა") + '''</div>
    <div class="hxr3-vs" aria-hidden="true">VS</div><div class="hxr3-head hxr3-head--us">MediMind</div>
  </div>'''
for e, k, left_e, left_k, right_e, right_k in rows:
    board += f'''<div class="hxr3-row">
      <div class="hxr3-cell hxr3-cell--them">{cross}<span class="hxr3-cell-t">{bi(left_e, left_k)}</span></div>
      <div class="hxr3-axis"><span class="hxr3-axis-pill">{bi(e, k)}</span></div>
      <div class="hxr3-cell hxr3-cell--us">{check}<span class="hxr3-cell-t">{bi(right_e, right_k)}</span></div>
    </div>'''
board += '</div><div class="hxr3-closer">' + bi(
    "Less searching. Less retyping. <strong>One accountable team.</strong>",
    "ნაკლები ძიება. ნაკლები ხელახალი შეყვანა. <strong>ერთი პასუხისმგებელი გუნდი.</strong>") + "</div>"
slides[2] = section(
    "gw-slide hxr-slide hxr3-slide hjb-comparison", "02", "WHAT CHANGES", "რა იცვლება",
    "The same daily work. <em>Fewer handoffs.</em>",
    "იგივე ყოველდღიური საქმე. <em>ნაკლები ზედმეტი ნაბიჯი.</em>",
    "Three changes your clinical, administrative and IT teams can evaluate together.",
    "სამი ცვლილება, რომელსაც კლინიკური, ადმინისტრაციული და IT გუნდები ერთად შეაფასებენ.",
    board,
    "Show the three paired changes in the same order as the problem slide. The current-state column describes the fragmented setup we are addressing, not a blanket claim about a named competitor. Reuse of information is evaluated for the agreed hospital process. International health-data standards support portability; implementation and data-export arrangements are agreed with the hospital. Do not promise a measured time saving until the evaluation establishes one.",
    "სამი ცვლილება პრობლემების სლაიდის იმავე თანმიმდევრობით აჩვენეთ. მარცხენა სვეტი აღწერს ცალკეულ პროგრამებზე დაფუძნებულ მუშაობას და არა კონკრეტული კონკურენტის შეფასებას. ინფორმაციის ხელახლა გამოყენებას შეთანხმებულ პროცესში ვამოწმებთ. მონაცემების გადატანის პირობები კლინიკასთან თანხმდება. დროის დაზოგვის რიცხვს შეფასებამდე არ ვასახელებთ.",
)

# Today's operating system must stand on its own; it is not the first instalment of an unfinished product.
scope_rows = [
    ("01", "Clinical teams", "კლინიკური გუნდი", "From registration to treatment", "რეგისტრაციიდან მკურნალობამდე",
     ["Patient registration and visit history", "Doctor’s notes, forms and orders", "Results available in the patient’s chart"],
     ["პაციენტის რეგისტრაცია და ვიზიტების ისტორია", "ექიმის ჩანაწერები, ფორმები და დანიშნულებები", "შედეგები პაციენტის სამედიცინო ჩანაწერში"]),
    ("02", "Diagnostics", "დიაგნოსტიკა", "Orders, results and images", "შეკვეთები, შედეგები და გამოსახულებები",
     ["Laboratory orders and result management", "Medical-image storage and viewing", "Information shared with the treating team"],
     ["ლაბორატორიული შეკვეთები და შედეგების მართვა", "სამედიცინო გამოსახულებების შენახვა და ნახვა", "ინფორმაციის მიწოდება მკურნალ გუნდთან"]),
    ("03", "Administration", "ადმინისტრაცია", "From service to billing", "მომსახურებიდან ანგარიშსწორებამდე",
     ["Record the services delivered", "Prepare billing and required documents", "Review activity and operational reports"],
     ["გაწეული მომსახურების აღრიცხვა", "ანგარიშსწორება და საჭირო დოკუმენტები", "საქმიანობისა და საოპერაციო ანგარიშების ნახვა"]),
]
scope_cards = "".join(
    f'<article class="hjb-card"><div class="hjb-eyebrow"><b>{n}</b>{bi(e,k)}</div><h3>{bi(et,kt)}</h3>'
    + '<ul>' + ''.join(f'<li>{bi(a,b)}</li>' for a,b in zip(el,kl)) + '</ul></article>'
    for n,e,k,et,kt,el,kl in scope_rows
)
slides[3] = section(
    "gw-slide hjb-scope", "03", "WHAT YOUR TEAM CAN USE", "რით იმუშავებს თქვენი გუნდი",
    "The hospital work <em>included today.</em>", "კლინიკის საქმე <em>ერთ სისტემაში</em>",
    "One operating system for clinical care, diagnostics and administration. We agree your exact scope before rollout.",
    "მკურნალობა, დიაგნოსტიკა და ადმინისტრირება ერთ ოპერაციულ სისტემაში. ზუსტ მოცულობას დანერგვამდე შევათანხმებთ.",
    f'<div class="hjb-grid">{scope_cards}</div><div class="hjb-bottom">{bi("<strong>Useful on its own.</strong> AI services are a separate choice, with their own scope and price.", "<strong>ამ სისტემას დამოუკიდებლად იყენებთ.</strong> AI სერვისებს ცალკე მოცულობა და ფასი აქვს.")}</div>',
    "The base hospital operating system is the offer being evaluated. It covers agreed clinical, laboratory, imaging and administrative work and has value without purchasing future AI services. Confirm hospital-specific device connections, forms, data migration and delivered scope before implementation. The product appendix shows availability per product; a product marked MVP or building is not implied to be part of today's delivered scope. FHIR R4 is an international health-data standard at the core, supporting structured data and agreed exports.",
    "შეფასების საგანია კლინიკის საბაზისო ოპერაციული სისტემა. იგი შეთანხმებულ კლინიკურ, ლაბორატორიულ, რადიოლოგიურ და ადმინისტრაციულ საქმიანობას მოიცავს და მომავალი AI სერვისების შეძენას არ მოითხოვს. აპარატების კავშირებს, ფორმებს, მონაცემთა გადატანასა და ჩასაბარებელ მოცულობას დანერგვამდე ვათანხმებთ. დანართში თითოეული პროდუქტის მზადყოფნა ცალკეა მითითებული. მონაცემები საერთაშორისო ჯანდაცვის სტანდარტზე, FHIR R4-ზეა აგებული; ექსპორტის პირობები წინასწარ თანხმდება.",
)

pair(4, "One signed network agreement. <em>25 hospitals.</em>", "ერთი ქსელური ხელშეკრულება. <em>25 კლინიკა.</em>",
     "Already in use. <em>Speak to the hospital team.</em>",
     "უკვე მუშაობს კლინიკაში. <em>გაესაუბრეთ მის გუნდს.</em>")

# Price and value stay together. Do not repeat the fragmented-vendor problem a fourth time.
old_list = re.search(r'<ul class="hxo2-old-list">.*?</ul>', slides[10], re.S).group()
budget = '<div class="hjb-budget">' + bi(
    '<b>Same monthly software spend</b><p>We review your current software costs and agree which services the matched price covers.</p><p>The scope and price are written down before you decide.</p>',
    '<b>იგივე ყოველთვიური პროგრამული ხარჯი</b><p>განვიხილავთ თქვენს მიმდინარე ხარჯს და შევათანხმებთ, რომელ მომსახურებას მოიცავს შესაბამისი ფასი.</p><p>მოცულობა და ფასი გადაწყვეტილებამდე წერილობით განისაზღვრება.</p>') + '</div>'
replace(10, old_list, budget)
pair(10, "What your money buys today", "რაში იხდით დღეს", "Your price", "თქვენი ფასი")
pair(10, "What the same money buys with us", "რას მიიღებთ იმავე ბიუჯეტით",
     "Included for our next 5 partners", "მომდევნო 5 პარტნიორისთვის")
pair(10, "More for your hospital. <em>The same software budget.</em>", "მეტი შესაძლებლობა. <em>იგივე პროგრამული ბიუჯეტი.</em>",
     "Your current software budget. <em>Implementation included.</em>",
     "თქვენი მიმდინარე პროგრამული ბიუჯეტი. <em>დანერგვა უფასოა.</em>")
pair(10, "Clinical care, laboratory, imaging and administration — connected in one operating system.", "მკურნალობა, ლაბორატორია, რადიოლოგია და მართვა ერთ ოპერაციულ სისტემაში.",
     "For the agreed base system. AI services, hardware and third-party costs are agreed separately.",
     "შეთანხმებული საბაზისო სისტემისთვის. AI სერვისები, აპარატურა და მესამე მხარის ხარჯები ცალკე თანხმდება.")
pair(10, "EMR + Lab (LIS) + PACS + Patient Portal", "EMR + ლაბორატორია (LIS) + PACS + პაციენტის პორტალი",
     "Clinical care · Lab · Imaging · Administration", "მკურნალობა · ლაბორატორია · რადიოლოგია · მართვა")
pair(10, "One system · one codebase", "ერთი სისტემა · ერთიანი კოდი", "One hospital operating system", "კლინიკის ერთი ოპერაციული სისტემა")
for old_e, old_k, new_e, new_k in [
    ("The agreed Phase 1 scope, on one hospital operating system", "შეთანხმებული ეტაპი 1 კლინიკის ერთიან ოპერაციულ სისტემაში",
     "Free setup, data migration and key-user training", "გამართვა, მონაცემთა გადატანა და ძირითადი მომხმარებლების სწავლება უფასოა"),
    ("Ongoing tailored development within the agreed base scope", "განვითარება და მორგება შეთანხმებულ საბაზისო ფარგლებში",
     "Development, updates and support within the agreed base scope", "განვითარება, განახლებები და მხარდაჭერა შეთანხმებული მოცულობით"),
    ("Base-system updates and team support", "საბაზისო სისტემის განახლებები და გუნდის მხარდაჭერა",
     "Free parallel evaluation before a purchase decision", "უფასო პარალელური შეფასება შეძენის გადაწყვეტილებამდე"),
    ("One contract, one phone number", "ერთი ხელშეკრულება, ერთი საკონტაქტო ნომერი",
     "Your first delivered base source code belongs to the hospital, under contract", "პირველი საბაზისო ვერსიის საწყისი კოდი ხელშეკრულებით კლინიკას ეკუთვნის"),
    ("Bring us a process you want to improve", "გვითხარით, რომელი პროცესის გაუმჯობესება გსურთ",
     "Your team’s feedback shapes the system", "სისტემა თქვენი გუნდის საჭიროებებს ერგება"),
    ("Real hospital needs guide development. We agree the base scope together and build within it at no extra charge. Our TAVI planner began with a hospital request.",
     "განვითარებას კლინიკის რეალური საჭიროებები განსაზღვრავს. საბაზისო მოცულობას ერთად შევათანხმებთ და მის ფარგლებში დამატებითი საფასურის გარეშე ვმუშაობთ. TAVI-ის დამგეგმავი კლინიკის მოთხოვნიდან შეიქმნა.",
     "Show us what slows your staff down. We agree the changes within the included scope. Our TAVI planner began with a hospital request.",
     "გვაჩვენეთ, რა აფერხებს თანამშრომლების მუშაობას. ფასში შემავალ ცვლილებებს ერთად შევათანხმებთ. TAVI-ის დამგეგმავიც კლინიკის მოთხოვნიდან შეიქმნა.")
]:
    pair(10, old_e, old_k, new_e, new_k)

# Concrete comparison criteria, with no invented pilot results.
metric_rows = [
    ("Staff time", "თანამშრომლის დრო", "Minutes to complete the same agreed task", "ერთი და იმავე დავალების შესრულების წუთები"),
    ("Repeated entry", "განმეორებითი შეყვანა", "Patient fields typed again per case", "ერთ შემთხვევაზე ხელახლა შეყვანილი მონაცემების რაოდენობა"),
    ("Billing completeness", "ანგარიშის სისრულე", "Delivered services missing from the bill", "გაწეული, მაგრამ ანგარიშში გამორჩენილი მომსახურების რაოდენობა"),
]
table = '<div class="hjb-scorecard"><table><thead><tr><th>' + bi("What we measure", "რას ვზომავთ") + '</th><th>' + bi("The same measure in both systems", "ერთნაირი საზომი ორივე სისტემაში") + '</th></tr></thead><tbody>'
table += ''.join(f'<tr><th scope="row">{bi(e,k)}</th><td>{bi(ed,kd)}</td></tr>' for e,k,ed,kd in metric_rows)
table += '</tbody></table></div>'
table += '<div class="hjb-eval-steps">' + bi(
    "<b>Agree the sample + targets</b><span>Run the same process</span><b>Review together, then decide</b>",
    "<b>ვათანხმებთ შემთხვევებსა და მიზნებს</b><span>ვამოწმებთ ერთსა და იმავე პროცესს</span><b>ერთად ვაფასებთ, შემდეგ წყვეტთ</b>") + '</div>'
table += '<div class="hjb-bottom">' + bi(
    "<strong>Your numbers, your value.</strong> Cases per month × minutes saved per case ÷ 60 = staff hours saved.",
    "<strong>შედეგი თქვენი მონაცემებით.</strong> შემთხვევები თვეში × დაზოგილი წუთები ერთ შემთხვევაზე ÷ 60 = დაზოგილი სამუშაო საათები.") + '</div>'
slides[11] = section(
    "gw-slide hjb-evaluation", "06", "FREE PARALLEL EVALUATION", "უფასო პარალელური შეფასება",
    "One process. <em>Three agreed measures.</em>", "ერთი პროცესი. <em>სამი შეთანხმებული საზომი.</em>",
    "Your current system stays in use. We agree the cases, targets and review date before starting.",
    "მოქმედი სისტემა მუშაობას აგრძელებს. დაწყებამდე ვათანხმებთ შესამოწმებელ შემთხვევებს, მიზნებსა და შედეგების განხილვის თარიღს.",
    table,
    "Choose one process, for example registration through a laboratory order to billing. Agree a comparable case sample, the participating staff, data permissions, baseline, success threshold and review date before setup. Record minutes spent on the agreed administrative task, the number of repeated fields, and delivered services omitted from billing in both systems. Use the same task definitions and case mix. Multiply measured minutes saved per case by the hospital's monthly case volume and divide by 60 to estimate hours. Finance can value those hours using its own staff costs; saved capacity is not automatically cash savings. The hospital validates any recovered service value separately. The evaluation is free and carries no purchase obligation; transition follows acceptance.",
    "ავირჩიოთ ერთი პროცესი, მაგალითად რეგისტრაციიდან ლაბორატორიულ შეკვეთამდე და ანგარიშსწორებამდე. გამართვამდე შევათანხმოთ შესადარებელი შემთხვევები, მონაწილე თანამშრომლები, მონაცემებზე წვდომა, საწყისი მაჩვენებლები, წარმატების ზღვარი და განხილვის თარიღი. ორივე სისტემაში გავზომოთ შეთანხმებულ ადმინისტრაციულ დავალებაზე დახარჯული წუთები, ხელახლა შეყვანილი მონაცემები და ანგარიშში გამორჩენილი მომსახურება. დაზოგილი წუთები გავამრავლოთ თვიურ შემთხვევებზე და გავყოთ 60-ზე. ფინანსური გუნდი ამ საათებს საკუთარი ხარჯით შეაფასებს; გამოთავისუფლებული დრო ავტომატურად ფულად დანაზოგს არ ნიშნავს. შეფასება უფასოა და შეძენას არ გავალდებულებთ. გადასვლა შედეგის მიღების შემდეგ იგეგმება.",
)

# A first conversation has a clear, useful outcome and one direct next step.
pair(13, "Same spend. <em>A generation ahead.</em>", "იგივე ბიუჯეტი. <em>ახალი შესაძლებლობები.</em>",
     "Let’s meet for <em>30 minutes.</em>", "შევხვდეთ <em>30 წუთით</em>")
pair(13, "We are allocating implementation and development capacity to our next five hospital partners.",
     "დანერგვისა და განვითარების რესურსს მომდევნო ხუთი პარტნიორი კლინიკისთვის გამოვყოფთ.",
     "Your director and process lead, with the MediMind founders. At your hospital or online.",
     "თქვენი დირექტორი და პროცესის ხელმძღვანელი — MediMind-ის დამფუძნებლებთან. კლინიკაში ან ონლაინ.")
pair(13, "Let’s see what changes for your hospital.", "ვნახოთ, რას შეცვლის MediMind თქვენს კლინიკაში.",
     "Leave knowing what would change — and how to test it.",
     "გაიგეთ, რა შეიცვლება და როგორ შეამოწმებთ შედეგს")
chips = re.search(r'<div class="hxv-chips">.*?</div>', slides[13], re.S).group()
replace(13, chips, '<p class="hjb-meeting-intro">' + bi(
    "Bring one process that costs your team time. We’ll work through it together.",
    "შეარჩიეთ ერთი პროცესი, რომელზეც თქვენი გუნდი ზედმეტ დროს ხარჯავს. ერთად განვიხილოთ.") + '</p>')
for old_e, old_k, new_e, new_k in [
    ("30 minutes: director + process lead", "30 წუთი: დირექტორი და პროცესის ხელმძღვანელი",
     "Map the work and where time is lost", "ვნახოთ, სად იხარჯება დრო"),
    ("Map the process &amp; agree measures", "პროცესი და შეფასების საზომები",
     "See the relevant part of MediMind", "გაჩვენოთ შესაბამისი შესაძლებლობა"),
    ("Send two times that work for you", "მოგვწერეთ შეხვედრისთვის ორი დრო",
     "Define a comparison your team can trust", "შევათანხმოთ, როგორ შეადარებთ შედეგს"),
]:
    pair(13, old_e, old_k, new_e, new_k)
seal = '<div class="hc-close-seal" aria-hidden="true">'
replace(13, seal, '<p class="hjb-reply">' + bi(
    "<strong>Reply to the person who sent this deck with two times that work for you.</strong>",
    "<strong>პრეზენტაციის გამომგზავნს უპასუხეთ და შესთავაზეთ შეხვედრისთვის ორი დრო.</strong>") + '</p>\n          ' + seal)
notes(13,
      "The requested next step is a 30-minute meeting, not a purchase or immediate deployment. Invite the director and the person responsible for the selected process. The founders map current work, demonstrate only the relevant capability and propose a measurable comparison. The hospital leaves knowing what would change, what participation is needed and how an evaluation could work. Ask the recipient to reply to the person who shared the deck with two suitable times.",
      "შემდეგი ნაბიჯია 30-წუთიანი შეხვედრა. მოვიწვიოთ დირექტორი და შერჩეულ პროცესზე პასუხისმგებელი პირი. დამფუძნებლები განიხილავენ დღევანდელ მუშაობას, აჩვენებენ მხოლოდ შესაბამის შესაძლებლობას და შესთავაზებენ გაზომვად შედარებას. კლინიკას ეცოდინება, რა შეიცვლება, რა მონაწილეობა იქნება საჭირო და როგორ ჩატარდება შეფასება. შეხვედრისთვის პრეზენტაციის გამომგზავნს ორი მოსახერხებელი დრო შესთავაზონ.")

# The existing rich material remains available after the meeting invitation.
pair(14, "End of the proposal", "პრეზენტაციის დასასრული", "APPENDIX", "დანართი")
pair(14, "Thank you.", "გმადლობთ.", "Explore the details.", "გაეცანით დეტალებს")
pair(14, "Up next", "შემდეგ", "Choose what matters to your team", "აირჩიეთ თქვენი გუნდისთვის საჭირო თემა")
chips = re.search(r'<div class="divider-chips">.*?</div>', slides[14], re.S).group()
replace(14, chips, '<div class="divider-chips hjb-appendix-links">' + ''.join(
    f'<a class="divider-chip" href="#/{target}" data-no-advance>{bi(e,k)}</a>'
    for target,e,k in [
        ("partner-details", "Partner terms", "პარტნიორობის პირობები"),
        ("protection", "Data & continuity", "მონაცემები და უწყვეტობა"),
        ("team", "The team", "გუნდი"),
        ("products", "Product demos", "პროდუქტების დემოები"),
        ("ai-options", "AI options & future vision", "AI შესაძლებლობები და სამომავლო ხედვა"),
        ("walkthrough", "Live walkthrough", "სისტემის დემონსტრაცია"),
        ("architecture", "Architecture", "არქიტექტურა"),
    ]) + '</div>')
notes(14, "Optional detail after the meeting invitation. Use the links to open a specific topic.",
      "შეხვედრის მოწვევის შემდეგ დამატებითი დეტალებია მოცემული. შესაბამის თემაზე გადასასვლელად გამოიყენეთ ბმულები.")

# Explain protection as a benefit before naming the legal/technical mechanism.
pair(12, "Your data. <em>Your first version.</em>", "თქვენი მონაცემები. <em>თქვენი პირველი ვერსია.</em>",
     "Keep control <em>if your supplier changes.</em>", "შეინარჩუნეთ კონტროლი <em>მომწოდებლის შეცვლისას</em>")
pair(12, "Your data is yours", "თქვენი მონაცემები თქვენია",
     "Take your data with you", "მონაცემები თან მიგაქვთ")
pair(12, "Your hospital owns its data. FHIR R4 keeps it portable, with export arrangements agreed before rollout.",
     "მონაცემები თქვენს კლინიკას ეკუთვნის. FHIR R4 მათი გადატანის საშუალებას იძლევა. ექსპორტის წესს დანერგვამდე შევათანხმებთ.",
     "Your data uses the international FHIR R4 health-data standard. Export arrangements are agreed before rollout.",
     "მონაცემები ჯანდაცვის საერთაშორისო სტანდარტზე, FHIR R4-ზეა აგებული. მათი გადატანის პირობებს დანერგვამდე შევათანხმებთ.")
pair(12, "First-version source-code ownership", "პირველი ვერსიის საწყისი კოდი",
     "Keep the first system we deliver", "პირველი ჩაბარებული სისტემა თქვენია")

# The current-product diagram keeps its real availability labels; it no longer suggests all are included/live.
pair(7, "Phase 1 · live", "ეტაპი 1 · აქტიური", "PRODUCT DEMOS", "პროდუქტების დემოები")
pair(7, "One clinical core. <em>Many connected products.</em>", "ერთი კლინიკური საფუძველი. <em>დაკავშირებული პროდუქტები.</em>",
     "See the products <em>your team can evaluate.</em>", "ნახეთ პროდუქტები, <em>რომლებსაც თქვენი გუნდი შეაფასებს</em>")
pair(7, "Phase 1 in depth: connected products on one FHIR R4 core. <strong>Tap any product to see it in action.</strong>",
     "ეტაპი 1 დეტალურად: დაკავშირებული პროდუქტები ერთ FHIR R4 საფუძველზე. <strong>აირჩიეთ პროდუქტი და ნახეთ მოქმედებაში.</strong>",
     "Open a demo. Each product shows its availability; the delivered scope is agreed separately.",
     "გახსენით დემო. თითოეული პროდუქტის მზადყოფნა მითითებულია; ჩასაბარებელ მოცულობას ცალკე შევათანხმებთ.")

# Remove the phase framing and distinguish examples from deployed capabilities.
for i in [8,9]:
    slides[i] = slides[i].replace("Phase 2 · optional", "SEPARATE AI SERVICES").replace("ეტაპი 2 · არჩევითი", "AI სერვისები ცალკე")
    slides[i] = slides[i].replace("Phase 3 · future vision", "FUTURE VISION").replace("ეტაპი 3 · სამომავლო ხედვა", "სამომავლო ხედვა")
slides[8] = slides[8].replace("Phase 2 brings AI assistants into department workflows and a shared management view for the director.",
    "Examples of AI assistance to discuss for your hospital. Availability, validation and price are agreed for each use.")
slides[8] = slides[8].replace("BUILDS ON THE PHASE 1 CORE · OPTIONAL, PRICED SEPARATELY",
    "SEPARATE SCOPE · VALIDATION · PRICING")
slides[8] = slides[8].replace("FOR MANAGEMENT · LIVE", "FOR MANAGEMENT · PROPOSED USES")
slides[8] = slides[8].replace("Early warning, hours ahead", "Concerns flagged for clinical review")
slides[8] = slides[8].replace("Optional · when ready", "On request · scope agreed")
slides[8] = slides[8].replace("The shared Phase 1 core provides the foundation. Choose the department, then agree scope, validation and pricing.",
    "Start with one task: for example, drafting a clinical note for a doctor to review. Wider AI use is scoped separately.")

# Publish one coherent order and stable, descriptive links.
ordered = [
    (slides[0], "overview", None),
    (problem, "daily-work", "01"),
    (slides[2], "comparison", "02"),
    (slides[3], "included-today", "03"),
    (slides[4], "proof", "04"),
    (slides[10], "offer", "05"),
    (slides[11], "evaluation", "06"),
    (slides[13], "meeting", "07"),
    (slides[14], "details", None),
    (slides[1], "partner-details", "A1"),
    (slides[12], "protection", "A2"),
    (slides[5], "team", "A3"),
    (slides[6], "shared-system", "A4"),
    (slides[7], "products", "A5"),
    (slides[8], "ai-options", "A6"),
    (slides[9], "future-brain", "A7"),
    (slides[15], "walkthrough", None),
    (slides[16], "architecture", "A8"),
]
output = []
for html, slide_id, number in ordered:
    html = html.replace("<section", f'<section id="{slide_id}"', 1)
    if number:
        html, count = re.subn(r'<span class="label-num">.*?</span>', f'<span class="label-num">{number}</span>', html, count=1, flags=re.S)
        assert count == 1, slide_id
    output.append(html)
path.write_text(source[:matches[0].start()] + "\n\n      ".join(output) + source[matches[-1].end():])
print("Updated original hospital deck: 8 main slides + 10 appendix/detail slides.")
