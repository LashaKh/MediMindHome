import re

def apply_translations():
    with open("public/healthycore.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. SPLIT HEAD AND BODY TO PROTECT META TAGS
    head_match = re.search(r'(<head>.*?</head>)', html, re.DOTALL | re.IGNORECASE)
    if not head_match:
        print("Error: Could not find <head>")
        return
    head_html = head_match.group(1)
    
    body_match = re.search(r'(<body.*?>.*</body>)', html, re.DOTALL | re.IGNORECASE)
    if not body_match:
        print("Error: Could not find <body>")
        return
    body_html = body_match.group(1)

    # 2. PROPER SEMANTIC TRANSLATION DICTIONARY
    # We must only translate exact, complete sentences or phrases to avoid literal garbage.
    texts_to_translate = {
        # Cover
        "The idea was born <em>here</em>.": "იდეა <em>აქ</em> დაიბადა.",
        "Now <em>own a piece</em> of it.": "ახლა კი გახდით <em>მისი ნაწილი</em>.",
        "One hospital. One operating system. The future of healthcare.": "ერთი კლინიკა. ერთი ოპერაციული სისტემა. ჯანდაცვის მომავალი.",
        "Partner Proposal · Pre-seed": "პარტნიორობის შეთავაზება · Pre-seed",
        "Lasha Khoshtaria": "ლაშა ხოშტარია",
        "Confidential &nbsp;·&nbsp; 2026": "კონფიდენციალური &nbsp;·&nbsp; 2026",
        "We've spent a year proving this inside your walls. Today isn't a demo — it's a proposal to make Healthycore a partner in what comes next.": "ჩვენ ერთი წელი დავხარჯეთ ამის დასამტკიცებლად თქვენს კედლებში. დღეს არ არის დემო — ეს არის შეთავაზება, რომ Healthycore გახდეს პარტნიორი იმაში, რაც მომავალში გველის.",

        # 1 Proof
        "PROOF · WE DELIVER": "დადასტურებული · ჩვენ ვასრულებთ",
        "Signed. Tested.": "ხელმოწერილია. ტესტირებულია.",
        "<em>Live this summer.</em>": "<em>ეშვება ამ ზაფხულს.</em>",
        "This isn't a concept — the product is <strong>already built and tested in daily clinical use.</strong> Validation now rolls out across a signed 25-hospital chain.": "ეს არ არის კონცეფცია — პროდუქტი <strong>უკვე შექმნილია და ტესტირებულია ყოველდღიურ კლინიკურ მოხმარებაში.</strong> ახლა ის ინერგება 25-კლინიკიან ქსელში.",
        "Pilot went live": "პილოტი ჩაეშვა",
        "GeoHospitals signed": "ჯეოჰოსპიტალსის კონტრაქტი გაფორმდა",
        "Today": "დღეს",
        "Our partner proposal": "ჩვენი პარტნიორობის შეთავაზება",
        "Signed": "ხელმოწერილია",
        "Hospitals": "კლინიკა",
        "GeoHospitals chain · validating this summer": "ჯეოჰოსპიტალსის ქსელი · ტესტირდება ამ ზაფხულს",
        "In daily use": "ყოველდღიურ მოხმარებაშია",
        "Live at Healthycore": "დანერგილია Healthycore-ში",
        "Doctors use it daily — and love it": "ექიმები ყოველდღიურად იყენებენ — და მოსწონთ",
        "Innovative Startup": "ინოვაციური სტარტაპი",
        "GITA GEL 150K grant": "GITA-ს 150,000 ლარიანი გრანტი",
        "Government-recognized": "სახელმწიფოს მიერ აღიარებული",
        "FHIR R4 standard": "FHIR R4 სტანდარტი",
        "Start with what's real. We have a signed 25-hospital contract with GeoHospitals going live this summer — not a prototype, a tested product. You've had it running here for a year. We're government-recognized as an Innovative Startup and backed by a GITA grant. We don't pitch slideware. We ship. Everything I'm about to propose is built on that track record.": "დავიწყოთ რეალური ფაქტებით. გვაქვს გაფორმებული 25-კლინიკიანი კონტრაქტი ჯეოჰოსპიტალსთან, რომელიც ზაფხულში ეშვება — ეს არ არის პროტოტიპი, ეს გამოცდილი პროდუქტია. თქვენთან ის უკვე ერთი წელია მუშაობს. ჩვენ აღიარებული ვართ როგორც ინოვაციური სტარტაპი და მხარდაჭერილი ვართ GITA-ს გრანტით. ჩვენ არ ვყიდით მხოლოდ პრეზენტაციებს. ჩვენ ვქმნით რეალურ პროდუქტს. ყველაფერი, რასაც შემოგთავაზებთ, სწორედ ამ გამოცდილებას ეფუძნება.",

        # 2 Liability
        "THE LIABILITY": "რისკი / პასუხისმგებლობა",
        "Your legacy EMR is a <em>liability</em> you haven't been billed for yet.": "თქვენი ძველი EMR არის <em>რისკი</em>, რომლის ფასიც ჯერ არ გადაგიხდიათ.",
        "Outdated &amp; insecure": "მოძველებული და არაუსაფრთხო",
        "~15 years behind · weak security · not on any global standard.": "~15 წლით უკან · სუსტი უსაფრთხოება · არ შეესაბამება გლობალურ სტანდარტებს.",
        "It's <em>when</em>, not <em>if</em>": "საკითხია <em>როდის</em> და არა <em>თუ</em>",
        "Fix it now — or be forced to later, on worse terms.": "მოაგვარეთ ეს ახლა — ან მოგიწევთ მოგვიანებით, გაცილებით ცუდ პირობებში.",
        "The hostage problem": "მძევლის პრობლემა",
        "You don't even hold a contract with your EMR vendor — <strong>your database isn't fully in your possession.</strong> If they walk, your data walks with them.": "თქვენ არც კი გაქვთ კონტრაქტი ძველ პროვაიდერთან — <strong>მონაცემთა ბაზას სრულად არ ფლობთ.</strong> თუ ისინი წავლენ, თქვენი მონაცემებიც მათ გაჰყვება.",
        "Let's be honest about the thing nobody puts on a balance sheet. Your current EMR works — at a functional level. But it's outdated, it's not secure, and it will not carry this hospital into the next decade. Worse: you don't even have a contract with the vendor, and the database isn't fully in your possession. That's not a software problem, it's an existential operational risk. You can't build the future of this hospital on a foundation that could be pulled out from under you. This gets solved now, on your terms — or later, on someone else's.": "მოდით ვიყოთ გულწრფელები იმაზე, რასაც არავინ წერს ბალანსში. თქვენი ახლანდელი EMR მუშაობს — ფუნქციურ დონეზე. მაგრამ ის მოძველებულია, არაუსაფრთხოა და ვერ გაუძღვება ამ კლინიკას მომდევნო ათწლეულში. უფრო უარესი: თქვენ კონტრაქტიც კი არ გაქვთ პროვაიდერთან და მონაცემთა ბაზა სრულად არ არის თქვენს მფლობელობაში. ეს არ არის პროგრამული პრობლემა, ეს არის ეგზისტენციალური ოპერაციული რისკი. თქვენ ვერ ააშენებთ კლინიკის მომავალს ფუნდამენტზე, რომელიც შეიძლება ნებისმიერ მომენტში გამოგაცალონ. ეს უნდა მოგვარდეს ახლა, თქვენი პირობებით — ან მოგვიანებით, სხვისი პირობებით.",

        # 3 Switch
        "THE SWITCH": "გადასვლა",
        "From legacy to us in <em>one day.</em> We handle the data.": "ძველი სისტემიდან ჩვენზე გადმოსვლა <em>ერთ დღეში.</em> მონაცემებზე ჩვენ ვზრუნავთ.",
        "The only reason to stay on a system you know is broken is the fear of switching — so we removed it.": "ერთადერთი მიზეზი, დარჩეთ სისტემაზე, რომელიც იცით რომ გაფუჭებულია, გადასვლის შიშია — ამიტომ ჩვენ ეს შიში მოვხსენით.",
        "One-day transition": "ერთდღიანი ტრანზიცია",
        "Seamless cut-over — you don't lose a single day of operations.": "უმტკივნეულო გადასვლა — არ კარგავთ არცერთ სამუშაო დღეს.",
        "We migrate your data": "ჩვენ გადმოგვაქვს თქვენი მონაცემები",
        "We move every record ourselves — and if the old vendor resists, we route around them.": "ჩვენ თავად გადმოგვაქვს ყველა ჩანაწერი — და თუ ძველი ვენდორი წინააღმდეგობას გაგიწევთ, ჩვენ მათ გვერდს ავუვლით.",
        "Coexistence path": "პარალელური რეჟიმი",
        "Nervous? Run both systems in parallel and cut over only when you're ready.": "ნერვიულობთ? ამუშავეთ ორივე სისტემა პარალელურად და გადადით მხოლოდ მაშინ, როცა მზად იქნებით.",
        "Legacy EMR": "ძველი EMR",
        "we handle the entire move": "ჩვენ უზრუნველვყოფთ სრულ გადასვლას",
        "Live on MediMind": "გაეშვა MediMind-ზე",
        "The only real reason to stay on a system you know is broken is that switching feels dangerous. So we take that off the table. We move you in a single day. We scrape and migrate your data ourselves — even if the legacy vendor resists, we route around them. You don't wait on their goodwill, and you don't lose a day of operations. The thing that's kept you stuck is the exact thing we make trivial.": "ერთადერთი რეალური მიზეზი, დარჩეთ სისტემაზე, რომელიც იცით რომ გაფუჭებულია, გადასვლის შიშია. ჩვენ ამ შიშს ვხსნით. გადაგვყავხართ ერთ დღეში. ჩვენ თავად ვიღებთ და გადმოგვაქვს თქვენი მონაცემები — თუნდაც ძველი ვენდორი წინააღმდეგობას გიწევდეთ, ჩვენ მათ გვერდს ავუვლით. თქვენ არ გჭირდებათ მათი კეთილი ნების ლოდინი და არ კარგავთ არცერთ სამუშაო დღეს. ის, რაც გაფერხებდათ, ჩვენთვის ტრივიალური ამოცანაა.",

        # 4 Offer
        "THE OFFER": "შეთავაზება",
        "Today you pay for EMR, PACS &amp; lab. <em>With us, all three are free</em> — and better.": "დღეს თქვენ იხდით EMR, PACS და ლაბორატორიულ სისტემებში. <em>ჩვენთან, სამივე უფასოა</em> — და უკეთესიც.",
        "A modern replacement runs ~GEL 10,000/month. Ours is free — gold-standard, not stripped-down.": "თანამედროვე ალტერნატივა თვეში ~10,000 ლარი ჯდება. ჩვენი უფასოა — ოქროს სტანდარტი, და არა შეზღუდული.",
        "Free, forever": "უფასო, სამუდამოდ",
        "EMR, PACS &amp; lab — one system, $0 license.": "EMR, PACS და ლაბორატორია — ერთი სისტემა, $0 ლიცენზია.",
        "Unlimited development": "შეუზღუდავი დეველოპმენტი",
        "Any feature you need — we build it.": "ნებისმიერი ფუნქცია რაც გჭირდებათ — ჩვენ ვაშენებთ.",
        "Every breakthrough": "ყველა ინოვაცია",
        "Every new AI tool lands in your hospital — free.": "ყოველი ახალი AI ინსტრუმენტი ინერგება თქვენს კლინიკაში — უფასოდ.",
        "Proof, not a promise": "დადასტურება, და არა დაპირება",
        "A 3mensio-class TAVI tool — built in-house.": "3mensio-ს კლასის TAVI ინსტრუმენტი — შექმნილი ჩვენს მიერ.",
        "what that tool costs you today — <span class=\"hc-free\">free with us</span>": "რაც დღეს ეს პროგრამა გიჯდებათ — <span class=\"hc-free\">ჩვენთან უფასოა</span>",
        "Right now you pay separately for your EMR, your PACS, your lab system. With us, all three are one operating system — and they're free, indefinitely. And not a stripped-down free: this is US-level, gold-standard software. On top of that, free unlimited development. Any feature you want, we build it — and we're happy to, because every good capability we add for you makes our product stronger for everyone. Concrete proof: we just built our own alternative to 3mensio in-house, for TAVI pre-procedural planning. That tool costs around six thousand dollars a year. With us it's free — and so is the next breakthrough, and the one after that. [CONFIRM: 3mensio/TAVI ~$6,000/yr figure before presenting.]": "ამჟამად თქვენ ცალ-ცალკე იხდით EMR-ში, PACS-ში და ლაბორატორიულ სისტემაში. ჩვენთან, სამივე ერთი ოპერაციული სისტემაა — და ისინი უფასოა, უვადოდ. და ეს არ არის შეზღუდული ვერსია: ეს არის აშშ-ს დონის, ოქროს სტანდარტის პროგრამა. გარდა ამისა, უფასო შეუზღუდავი დეველოპმენტი. ნებისმიერი ფუნქცია რაც გსურთ, ჩვენ ავაშენებთ — და სიამოვნებით, რადგან ყველა კარგი შესაძლებლობა, რომელსაც ვამატებთ, პროდუქტს ყველასთვის უკეთესს ხდის. კონკრეტული მაგალითი: ჩვენ ახლახან შევქმენით 3mensio-ს ალტერნატივა TAVI პროცედურის დაგეგმვისთვის. ეს პროგრამა დაახლოებით 6,000 დოლარი ჯდება წელიწადში. ჩვენთან ის უფასოა — და ასე იქნება ყველა მომავალი ინოვაცია.",

        # 5 Wins
        "WHY THIS WINS": "რატომ არის ეს მომგებიანი",
        "The math only runs <em>one way.</em>": "მათემატიკა მხოლოდ <em>ერთ მხარესაა.</em>",
        "Your $100K pays for itself in under 4 years. The rest is pure upside.": "თქვენი $100K თავს ინაზღაურებს 4 წელზე ნაკლებ დროში. დანარჩენი კი სუფთა მოგებაა.",
        "To full payback": "სრულ ამოღებამდე",
        "Software you stop paying for: EMR · PACS · lab": "პროგრამები, რომლებშიც ფულს აღარ იხდით: EMR · PACS · ლაბი",
        "Ongoing software cost": "მიმდინარე პროგრამული ხარჯი",
        "Every current &amp; future build — free, forever": "ყველა ამჟამინდელი და მომავალი ფუნქცია — უფასო, სამუდამოდ",
        "Equity in a pioneer OS": "წილი პიონერულ ოპერაციულ სისტემაში",
        "You own a piece — that's the real upside.": "თქვენ ფლობთ წილს — ეს არის რეალური პრიზი.",
        "Source-code safety net": "კოდის უსაფრთხოების გარანტია",
        "You get the codebase. Never hostage to a vendor.": "თქვენ იღებთ სისტემის კოდს. აღარ იქნებით ვენდორის მძევალი.",
        "Free development": "უფასო დეველოპმენტი",
        "Features built for you — at our pace, $0.": "ფუნქციები, რომლებიც თქვენთვის შენდება — ჩვენი ტემპით, $0.",
        "Step back and look at the shape of this for you. On software costs alone — the EMR, PACS, lab, and tools like 3mensio you pay for today — your hundred-thousand-dollar check pays itself back in roughly three-point-seven years. After that, your ongoing software cost is zero, forever. But that's only the floor. You also own equity in one of the first AI-native hospital operating systems in the world. You get the first version of the codebase, licence-free, as a safety net — if we ever disappear, you keep your EMR running and maintained in-house, so you're never hostage to a vendor again. And no one else on earth offers free, unlimited feature development at the scale we do. It is an extremely winning situation. The only losing move is standing still — and on the next slide I'll show you exactly what standing still costs. [CONFIRM: 3.7-yr payback basis (~$27K/yr avoided software spend — confirm the annual figure) · and the source-code escrow terms before committing them in writing.]": "შევხედოთ ამას თქვენი პერსპექტივიდან. მხოლოდ პროგრამულ ხარჯებზე — EMR, PACS, ლაბი და ინსტრუმენტები როგორიცაა 3mensio — თქვენი 100,000 დოლარიანი ინვესტიცია თავს ინაზღაურებს დაახლოებით 3.7 წელიწადში. ამის შემდეგ, თქვენი პროგრამული უზრუნველყოფის ხარჯი ნულია, სამუდამოდ. მაგრამ ეს მხოლოდ დასაწყისია. თქვენ ასევე ფლობთ წილს მსოფლიოში ერთ-ერთ პირველ AI-ნატიურ ჰოსპიტალურ ოპერაციულ სისტემაში. თქვენ იღებთ კოდის პირველ ვერსიას, ლიცენზიის გარეშე, როგორც უსაფრთხოების გარანტიას — თუ ჩვენ გავქრებით, თქვენ აგრძელებთ EMR-ის მართვას შიდა ძალებით, ასე რომ აღარასოდეს იქნებით ვენდორის მძევალი. და სხვა არავინ გთავაზობთ უფასო, შეუზღუდავ დეველოპმენტს ჩვენი მასშტაბით. ეს არის იდეალური მომგებიანი სიტუაცია. ერთადერთი წაგებული ნაბიჯი ერთ ადგილზე დგომაა — და შემდეგ სლაიდზე ზუსტად გაჩვენებთ, რა ჯდება ეს დგომა.",

        # 6 More Than An EMR
        "MORE THAN AN EMR": "მეტს ვიდრე უბრალოდ EMR",
        "You're not buying an EMR. You're installing an <em>AI brain</em> for the hospital.": "თქვენ არ ყიდულობთ EMR-ს. თქვენ აყენებთ <em>AI ტვინს</em> კლინიკისთვის.",
        "It reads every patient and every workflow in real time — and optimizes two things humans can't, at scale:": "ის კითხულობს თითოეულ პაციენტს და სამუშაო პროცესს რეალურ დროში — და აუმჯობესებს ორ რამეს, რაც ადამიანებს მასშტაბურად არ შეუძლიათ:",
        "Safer care": "უფრო უსაფრთხო მკურნალობა",
        "Catches the missed lab, the early sepsis, the drug clash — before 2&nbsp;a.m. becomes an ICU bed.": "პოულობს გამორჩენილ ლაბორატორიულ ანალიზს, სეფსისის ადრეულ ნიშნებს, წამლების შეუთავსებლობას — სანამ ღამის 2 საათი რეანიმაციული საწოლი გახდება.",
        "More profitable": "უფრო მომგებიანი",
        "Strips out the avoidable bed-days, complications and waste you never see coming.": "აქრობს თავიდან აცილებად დაყოვნების დღეებს, გართულებებს და დანაკარგებს, რომლებსაც წინასწარ ვერ ხედავთ.",
        "Clinical case · de-identified": "კლინიკური შემთხვევა · დეიდენტიფიცირებული",
        "The 14-hour silence": "14-საათიანი სიჩუმე",
        "A $20 lab, caught 19 hours too late. One real case — multiplied across every patient.": "$20-იანი ლაბ. ტესტი, 19 საათით დაგვიანებული. ერთი რეალური შემთხვევა — გამრავლებული თითოეულ პაციენტზე.",
        "Read the full case": "სრული შემთხვევის წაკითხვა",
        "Business case · the full picture": "ბიზნეს შემთხვევა · სრული სურათი",
        "Where the margin comes from": "საიდან მოდის მარჟა",
        "Cost down, revenue up — 12 concrete ways the AI brain protects your margin.": "ხარჯები ქვევით, შემოსავალი ზევით — 12 კონკრეტული გზა, რითიც AI ტვინი იცავს თქვენს მარჟას.",
        "See the business case": "ბიზნეს შემთხვევის ნახვა",
        "Here's the point most software vendors will never make, because their product can't deliver it. The free software saves you a little each year. That's not the real money. The real money is here. A patient — stented two weeks earlier — comes in with stomach pain. A cheap lab test that would have caught what was killing him doesn't get ordered for hours. He goes into septic shock and lands in the ICU. Nobody was incompetent — the hospital simply ran on human attention and memory at two in the morning. An operating system doesn't get tired. A cheap lab test versus twenty hospital days — that asymmetry is the entire reason an AI-native OS exists. We don't just digitize your hospital. We cut the costs you can't even see coming.": "ეს არის ის, რასაც პროგრამული ვენდორების უმეტესობა ვერასოდეს გეტყვით, რადგან მათი პროდუქტი ამას ვერ უზრუნველყოფს. უფასო პროგრამული უზრუნველყოფა ყოველწლიურად ცოტას გიზოგავთ. ეს არ არის მთავარი თანხა. მთავარი ფული აქ არის. პაციენტი — რომელსაც ორი კვირის წინ სტენტი ჩაუდგეს — შემოდის მუცლის ტკივილით. იაფიანი ლაბორატორიული ტესტი, რომელიც გამოავლენდა საფრთხეს, საათობით არ ინიშნება. ის გადადის სეპტიურ შოკში და ხვდება რეანიმაციაში. არავინ იყო არაკომპეტენტური — კლინიკა უბრალოდ მუშაობდა ადამიანურ ყურადღებასა და მეხსიერებაზე ღამის 2 საათზე. ოპერაციული სისტემა კი არ იღლება. იაფიანი ლაბორატორიული ტესტი ოცი დღის ჰოსპიტალიზაციის წინააღმდეგ — ეს ასიმეტრია არის მიზეზი, რის გამოც არსებობს AI-ნატიური OS. ჩვენ არ ვაკეთებთ მხოლოდ კლინიკის დიგიტალიზაციას. ჩვენ ვამცირებთ იმ ხარჯებს, რომლებსაც წინასწარ ვერც კი ხედავთ.",

        # 7 Not An EMR
        "NOT AN EMR": "ეს არ არის EMR",
        "We don't build EMRs. We build the hospital's <em>AI-native operating system.</em>": "ჩვენ არ ვქმნით EMR-ებს. ჩვენ ვქმნით კლინიკის <em>AI-ნატიურ ოპერაციულ სისტემას.</em>",
        "The free software is just the start — we're building something the world doesn't have yet.": "უფასო პროგრამა მხოლოდ დასაწყისია — ჩვენ ვქმნით იმას, რაც მსოფლიოს ჯერ არ აქვს.",
        "Global standard": "გლობალური სტანდარტი",
        "FHIR R4 — the world's standard for health data, so the AI sees the whole patient as one picture.": "FHIR R4 — მსოფლიო სტანდარტი ჯანდაცვის მონაცემებისთვის, რათა AI-მ პაციენტი ერთ მთლიან სურათად დაინახოს.",
        "First in the world": "პირველი მსოფლიოში",
        "Others bolt FHIR on as an export. We're the only one built FHIR-native, ground-up.": "სხვები FHIR-ს გარედან ამატებენ. ჩვენ ერთადერთები ვართ, ვინც ნულიდან FHIR-ნატიური ავაშენეთ.",
        "A regulatory moat": "რეგულატორული უპირატესობა",
        "The West can't deploy this yet — the EU AI Act &amp; FDA keep them years behind.": "დასავლეთი ამას ჯერ ვერ ნერგავს — EU AI Act-ი და FDA მათ წლებით უკან ტოვებს.",
        "The real prize": "რეალური პრიზი",
        "Set the free software aside — <strong>owning a piece of this company is the prize.</strong>": "გადავდოთ უფასო პროგრამა გვერდზე — <strong>ამ კომპანიის წილის ფლობა არის ნამდვილი პრიზი.</strong>",
        "Now take off the customer hat and put on the investor hat. What you'd be running isn't an EMR — it's an AI-native operating system for the entire hospital, built ground-up on FHIR. That's a far bigger market and a far bigger company than EMR software. And here's the part that should matter to a research hospital: we are one of the first in the world with a live, AI-native product in a real hospital. The reason no one in the US or EU has this yet isn't talent — it's regulation. The EU AI Act and FDA clearance keep Western hospitals years behind. You'd be running the product of the future while they're still in the queue. The free software is the floor. The real prize is owning a piece of the company building it.": "ახლა მოიხსენით მომხმარებლის ქუდი და მოირგეთ ინვესტორის. რასაც თქვენ გამოიყენებთ არ არის EMR — ეს არის AI-ნატიური ოპერაციული სისტემა მთლიანი ჰოსპიტლისთვის, აშენებული ნულიდან FHIR-ზე. ეს გაცილებით დიდი ბაზარი და გაცილებით დიდი კომპანიაა, ვიდრე უბრალოდ EMR. და აი, რა არის მთავარი კვლევითი კლინიკისთვის: ჩვენ ვართ ერთ-ერთი პირველი მსოფლიოში, ვისაც აქვს AI-ნატიური პროდუქტი რეალურ კლინიკაში. მიზეზი, რის გამოც აშშ-სა და ევროპაში ეს ჯერ არ აქვთ, ტალანტი არ არის — ეს რეგულაციებია. EU AI Act-ი და FDA-ს რეგულაციები დასავლურ კლინიკებს წლებით უკან ხევს. თქვენ გამოიყენებთ მომავლის პროდუქტს, სანამ ისინი რიგში დგანან. უფასო სისტემა მხოლოდ დასაწყისია. რეალური პრიზი ამ კომპანიის წილის ფლობაა.",

        # 8 Ambition
        "AMBITION": "ამბიცია",
        "Georgia is just the testing ground. We're building for the <em>world</em>": "საქართველო მხოლოდ სატესტო მოედანია. ჩვენ ვქმნით <em>მსოფლიოსთვის</em>",
        "Stage 1 · Home": "ეტაპი 1 · საქართველო",
        "Georgia": "საქართველო",
        "Set the national standard": "ეროვნული სტანდარტის დაწესება",
        "25 hospitals": "25 კლინიკა",
        "already signed": "უკვე ხელმოწერილია",
        "Stage 2 · Expansion": "ეტაპი 2 · ექსპანსია",
        "Region": "რეგიონი",
        "Post-Soviet + CEE": "პოსტ-საბჭოთა + CEE",
        "1 playbook": "1 მიდგომა",
        "copies region-wide": "მეორდება მთელ რეგიონში",
        "Stage 3 · Israel": "ეტაპი 3 · ისრაელი",
        "Israel": "ისრაელი",
        "Explicitly on the map": "მკაფიოდ გეგმაში",
        "Your backyard": "თქვენი ბაზარი",
        "you're the wedge in": "თქვენ ხართ კარიბჭე",
        "Stage 4 · Global": "ეტაპი 4 · გლობალური",
        "Global": "გლობალური",
        "U.S. + E.U.": "აშშ + ევროკავშირი",
        "Arrive battle-tested": "შესვლა უკვე გამოცდილი პროდუქტით",
        "FHIR-native": "ბაზირებული FHIR-ზე",
        "built to travel": "შექმნილია გლობალური მასშტაბისთვის",
        "Back us early — <strong>your bet compounds with every market we enter</strong>, all the way into your own backyard.": "დაგვიჭირეთ მხარი ადრეულ ეტაპზე — <strong>თქვენი ინვესტიცია იზრდება ყველა ახალ ბაზარზე შესვლისას</strong>, პირდაპირ თქვენს საკუთარ ბაზრამდე.",
        "And our ambition is not a regional one. We expand from Georgia across the post-Soviet and Central-Eastern European region — but the map doesn't stop there. Israel is explicitly on it. Your stockholders are Israeli investors; that's not a coincidence in this conversation, it's a strategic door you can open. You wouldn't just be backing a Georgian software company — you'd be early in something that scales into your own investors' backyard, and globally after that. We built this FHIR-native from day one precisely so it travels. And at home the ambition is bigger than market share — the roadmap is one universal, government-backed product that puts every hospital in the country on the FHIR standard. The early bet compounds.": "ჩვენი ამბიცია არ არის მხოლოდ რეგიონალური. ჩვენ ვფართოვდებით საქართველოდან პოსტ-საბჭოთა და ცენტრალურ-აღმოსავლეთ ევროპის რეგიონში — მაგრამ რუკა აქ არ მთავრდება. ისრაელი მკაფიოდ არის გეგმაში. თქვენი აქციონერები ისრაელელი ინვესტორები არიან; ეს არ არის დამთხვევა ამ საუბარში, ეს არის სტრატეგიული კარი, რომელიც შეგიძლიათ გააღოთ. თქვენ არ უჭერთ მხარს მხოლოდ ქართულ პროგრამულ კომპანიას — თქვენ ხართ ადრეულ ეტაპზე იმაში, რაც გაიზრდება თქვენივე ინვესტორების ბაზარზე, და შემდგომ გლობალურად. ჩვენ ავაშენეთ ეს FHIR-ზე პირველივე დღიდან ზუსტად იმისთვის, რომ მარტივად გავიდეთ გლობალურ ბაზარზე. და ადგილობრივ ბაზარზეც, ამბიცია საბაზრო წილზე მეტია — ჩვენი მიზანია ერთიანი, მთავრობის მიერ მხარდაჭერილი პროდუქტი, რომელიც ქვეყნის ყველა კლინიკას FHIR სტანდარტზე გადაიყვანს. ადრეული ინვესტიცია მრავლდება.",

        # 9 Partner Deal
        "THE PARTNER DEAL": "პარტნიორის გარიგება",
        "Same check as an angel. <em>A partner's deal.</em>": "იგივე თანხა, რასაც ინვესტორი დებს. <em>პარტნიორის გარიგება.</em>",
        "We ask for half the round — on your terms. You get far more than equity.": "ჩვენ გთხოვთ რაუნდის ნახევარს — თქვენივე პირობებით. თქვენ იღებთ ბევრად მეტს, ვიდრე წილს.",
        "The ask": "შეთავაზება",
        "$100K": "$100K",
        "of the $200K pre-seed round": "$200K pre-seed რაუნდიდან",
        "SAFE · $5M cap · 20% discount": "SAFE · $5M cap · 20% discount",
        "Pay your way": "მოქნილი გადახდა",
        "<strong>$30K now</strong> — the rest within 6 months": "<strong>$30K ახლა</strong> — დანარჩენი 6 თვის განმავლობაში",
        "What you get": "რას იღებთ",
        "founding partner": "დამფუძნებელი პარტნიორი",
        "Equity": "წილი",
        "— with a guaranteed floor, 2–5%": "— გარანტირებული მინიმუმით, 2-5%",
        "Free software, forever": "უფასო პროგრამა, სამუდამოდ",
        "— EMR + PACS + lab": "— EMR + PACS + ლაბი",
        "Unlimited free development": "შეუზღუდავი უფასო დეველოპმენტი",
        "Total dedication": "სრული მზაობა",
        "— every resource, one hospital, a decade.": "— ყველა რესურსი, ერთი კლინიკა, მომდევნო ათწლეული.",
        "So here's the shape of the deal, side by side. An angel writes a check and gets equity — that's it. You write a check and you get the equity plus the product free forever, plus unlimited free development, plus downside protection no angel gets, plus you become our flagship partner hospital. Same instrument. A categorically better deal — because you're not just money to us, you're the hospital that proves it.": "აი გარიგების ფორმატი, შედარებისთვის. Angel ინვესტორი დებს თანხას და იღებს წილს — სულ ეს არის. თქვენ დებთ თანხას და იღებთ წილს პლუს უფასო პროდუქტს სამუდამოდ, პლუს შეუზღუდავ უფასო დეველოპმენტს, პლუს რისკებისგან დაცვას, რასაც სხვა ინვესტორი ვერ იღებს, პლუს ხდებით ჩვენი ფლაგმანი პარტნიორი კლინიკა. იგივე ინსტრუმენტი. მაგრამ კატეგორიულად უკეთესი გარიგება — რადგან თქვენ ჩვენთვის მხოლოდ ინვესტორი არ ხართ, თქვენ ხართ კლინიკა, რომელიც ჩვენს პროდუქტს ამტკიცებს.",

        # 10 Partnership
        "THE PARTNERSHIP": "პარტნიორობა",
        "You already run first-in-human device trials. <em>Lead in software too.</em>": "თქვენ უკვე ატარებთ პირველად კლინიკურ კვლევებს. <em>იყავით ლიდერი პროგრამულ უზრუნველყოფაშიც.</em>",
        "Being first is who you are — this is the same choice, now in software and AI.": "პირველობა თქვენი ბუნებაა — ეს ზუსტად იგივე არჩევანია, ახლა პროგრამულ უზრუნველყოფასა და AI-ში.",
        "Partner with us.": "გახდით ჩვენი პარტნიორი.",
        "$100K, flexible": "$100K, მოქნილი პირობები",
        "Free product, forever": "უფასო პროდუქტი, სამუდამოდ",
        "A stake in what's next": "წილი მომავალში",
        "Founding partner": "დამფუძნებელი პარტნიორი",
        "Let me close where you live. Healthycore is a first-in-human research hospital. You already made the decision to be early — to run trials and devices before the rest of the region, because being first is part of who you are. This is the exact same decision, in software and AI. You'd run a clinical operating system that hospitals in the US and EU can't legally deploy yet — and you'd own a piece of the company building it. You already lead in devices. Lead in software too. That's the partnership.": "მოდით დავასრულოთ იმით, რითაც თქვენ ცხოვრობთ. Healthycore არის კვლევითი კლინიკა. თქვენ უკვე მიიღეთ გადაწყვეტილება იყოთ ადრეულ ეტაპზე — ჩაატაროთ კვლევები და დანერგოთ აპარატურა რეგიონში პირველებმა, რადგან პირველობა თქვენი იდენტობის ნაწილია. ეს არის ზუსტად იგივე გადაწყვეტილება, ოღონდ პროგრამულ უზრუნველყოფასა და AI-ში. თქვენ გამოიყენებთ კლინიკურ ოპერაციულ სისტემას, რომლის ლეგალურად დანერგვაც აშშ-სა და ევროპაში ჯერ არ შეუძლიათ — და თქვენ გექნებათ წილი იმ კომპანიაში, რომელიც ამას აშენებს. თქვენ უკვე ხართ ლიდერები აპარატურაში. იყავით ლიდერები პროგრამულ უზრუნველყოფაშიც. ეს არის ჩვენი პარტნიორობა.",

        # End
        "End of the proposal": "შეთავაზების დასასრული",
        "Thank you.": "გმადლობთ.",
        "Up next": "შემდეგ",
        "Live walkthrough": "ცოცხალი დემონსტრაცია",
        "Architecture": "არქიტექტურა",
        "End of the main proposal. Thank you. What follows is a live product walkthrough and the system architecture. Happy to dwell on whichever you want to see more of.": "ეს არის ძირითადი შეთავაზების დასასრული. მადლობა. შემდეგ მოდის პროდუქტის ცოცხალი დემონსტრაცია და სისტემის არქიტექტურა. სიამოვნებით გავჩერდები იმაზე, რომლის ნახვაც უფრო დეტალურად გსურთ.",
        "Continue": "გაგრძელება",
        "Live product walkthrough embedded from /walkthrough — click play to start. To leave, click outside the iframe and press the right arrow (or the on-screen arrow) to continue to the architecture appendix.": "პროდუქტის ცოცხალი დემონსტრაცია /walkthrough-დან — დასაწყებად დააჭირეთ play-ს. გასასვლელად დააჭირეთ iframe-ის გარეთ და გამოიყენეთ მარჯვენა ისარი (ან ეკრანის ისარი) რათა გადახვიდეთ არქიტექტურის დანართზე.",

        # Appendix Arch
        "APPENDIX · ARCHITECTURE": "დანართი · არქიტექტურა",
        "A hospital with a body made of <em>software.</em>": "ჰოსპიტალი, რომლის სხეულიც <em>პროგრამული უზრუნველყოფაა.</em>",
        "Every department. Every workflow. One AI-native codebase, built ground-up on FHIR R4.": "ყველა დეპარტამენტი. ყველა პროცესი. ერთი AI-ნატიური კოდი, შექმნილი ნულიდან FHIR R4-ზე.",
        "CLINICIANS": "კლინიცისტები",
        "doctors &amp; nurses": "ექიმები და ექთნები",
        "COORDINATORS": "კოორდინატორები",
        "admin &amp; operations": "ადმინისტრაცია და ოპერაციები",
        "PATIENTS": "პაციენტები",
        "portal &amp; notifications": "პორტალი და შეტყობინებები",
        "SKIN — THE SURFACES OF THE HOSPITAL": "კანი — კლინიკის ზედაპირები",
        "— view · edit · write —": "— ნახვა · რედაქტირება · ჩაწერა —",
        "Patient": "პაციენტი",
        "Encounter": "ვიზიტი",
        "Bed": "საწოლი",
        "Medication": "მედიკამენტი",
        "Claim": "მოთხოვნა (Claim)",
        "Coverage": "დაზღვევა",
        "Specimen": "ნიმუში",
        "Order": "დანიშნულება",
        "HEART — THE LIVING HOSPITAL MODEL": "გული — ჰოსპიტლის ცოცხალი მოდელი",
        "80+ FHIR R4 resources  ·  one living model  ·  ground-up, not an API layer": "80+ FHIR R4 რესურსი · ერთი ცოცხალი მოდელი · ნულიდან შექმნილი, არა API შრე",
        "— reason · act · remember —": "— ანალიზი · მოქმედება · დამახსოვრება —",
        "AI-BRAIN": "AI ტვინი",
        "AI reasons &amp; writes": "AI აანალიზებს და წერს",
        "MUSCLE": "კუნთი",
        "acts on the real world": "მოქმედებს რეალურ სამყაროში",
        "NERVE": "ნერვი",
        "feels every change": "გრძნობს ყველა ცვლილებას",
        "Data Flow": "მონაცემთა ნაკადი",
        "Live": "ცოცხალი",
        "Skin": "კანი",
        "people read &amp; write": "ადამიანები კითხულობენ და წერენ",
        "AI-Brain": "AI ტვინი",
        "Muscle": "კუნთი",
        "sends actions out": "აგზავნის ქმედებებს გარეთ",
        "Nerve": "ნერვი",
        "records every change": "იწერს ყველა ცვლილებას",
        "Heart": "გული",
        "is the center.": "არის ცენტრი.",
        "Everything else flows through it.": "ყველაფერი დანარჩენი გადის მასში.",
        "Not an EMR. Not an integration layer.": "არ არის EMR. არ არის ინტეგრაციის შრე.",
        "The whole thing.": "ეს არის ერთიანი მთლიანობა.",
        "Appendix A — the architecture, for the technical stakeholder. Five layers: Heart is the FHIR R4 model, the storage primitive — 80+ resources, one living model, ground-up. Brain is AI reasoning across the Heart. Muscle reaches into MOH, insurance, pharmacy, DICOM, SMS. Skin is every UI a hospital role touches. Nerve carries every event and audit signal. Not an EMR, not an integration layer — the whole thing.": "დანართი A — არქიტექტურა, ტექნიკური მხარისთვის. 5 შრე. გული არის FHIR R4 მოდელი, შენახვის ბაზა — 80+ რესურსი, ერთი ცოცხალი მოდელი, ნულიდან შექმნილი. ტვინი არის AI, რომელიც აანალიზებს გულს. კუნთი მოქმედებს ჯანდაცვის სამინისტროში, დაზღვევაში, აფთიაქში, DICOM-სა და SMS-ში. კანი არის ყველა ინტერფეისი, რომელსაც ეხება პერსონალი. ნერვი ატარებს ყველა მოვლენას და აუდიტის სიგნალს. ეს არ არის უბრალოდ EMR, ან ინტეგრაციის შრე — ეს არის ერთი მთლიანობა.",

        # App Real Case
        "Real case · de-identified": "რეალური შემთხვევა · დეიდენტიფიცირებული",
        "The 14-hour silence": "14-საათიანი სიჩუმე",
        "What happened": "რა მოხდა",
        "Two weeks post-stent, a high-risk patient returned with stomach pain. The team anchored on his heart — and for <strong>14 hours</strong>, no one ordered the <strong>~$20 lab</strong> that would've caught the real cause: acute pancreatitis. By then: septic shock, ICU.": "სტენტირებიდან ორი კვირის შემდეგ, მაღალი რისკის პაციენტი დაბრუნდა მუცლის ტკივილით. გუნდმა ყურადღება გულზე გადაიტანა — და <strong>14 საათის</strong> განმავლობაში, არავის დაუნიშნავს <strong>~$20-იანი ლაბ. ტესტი</strong> რაც გამოავლენდა რეალურ მიზეზს: მწვავე პანკრეატიტი. შედეგად: სეპტიური შოკი, რეანიმაცია.",
        "No one was incompetent — the hospital just ran on memory at 2&nbsp;a.m.": "არავინ იყო არაკომპეტენტური — კლინიკა უბრალოდ მუშაობდა მეხსიერებაზე ღამის 2 საათზე.",
        "What the OS does instead": "რას აკეთებს OS ამის ნაცვლად",
        "High-acuity pathway auto-applied.": "მაღალი სიმწვავის პროტოკოლი ავტომატურად ირთვება.",
        "<strong>Parallel</strong> cardiac + GI panel — lipase from minute one.": "<strong>პარალელურად</strong> გულის + GI პანელი — ლიპაზა პირველივე წუთიდან.",
        "Cardiology + surgery paged <strong>together</strong>.": "კარდიოლოგია + ქირურგია გამოძახებულია <strong>ერთად</strong>.",
        "Pancreatitis caught <strong>~19 hrs earlier</strong> — before sepsis.": "პანკრეატიტი გამოვლინდა <strong>~19 საათით ადრე</strong> — სეფსისამდე.",
        "Caught early, every time — by a system that never gets tired.": "ადრეული გამოვლენა, ყოველ ჯერზე — სისტემის მიერ, რომელიც არასდროს იღლება.",

        # App Op Impact
        "Operating impact · the full picture": "ოპერაციული გავლენა · სრული სურათი",
        "Where the margin comes from": "საიდან მოდის მარჟა",
        "Everything automated and tracked — that becomes money two ways:": "ყველაფერი ავტომატიზებული და კონტროლირებული — ეს იქცევა ფულად ორი გზით:",
        "Revenue you stop losing": "შემოსავალი, რომელსაც აღარ კარგავთ",
        "Clean claims, first time": "სუფთა მოთხოვნები, პირველივე ცდაზე",
        "Coded right at the point of care — nothing bounces back.": "კოდირებულია ზუსტად მკურნალობის მომენტში — არაფერი ბრუნდება უკან.",
        "Nothing filed late": "არაფერი იგზავნება დაგვიანებით",
        "Every filing inside the payer's deadline, automatically.": "ყველა გაგზავნა ჯდება სადაზღვევოს ვადაში, ავტომატურად.",
        "Capture every billable": "ყველა სერვისის ასახვა",
        "Every service and supply billed — nothing slips.": "ყველა სერვისი და მასალა დარიცხულია — არაფერი იკარგება.",
        "Denials become recoverable": "უარყოფები აღდგენადი ხდება",
        "Appeal packets built automatically — write-offs recovered.": "აპელაციის პაკეტები იქმნება ავტომატურად — ჩამოწერილი თანხები ბრუნდება.",
        "Audit-ready by default": "აუდიტისთვის მზადყოფნა ყოველთვის",
        "Every action traceable — audits become painless.": "ყოველი ქმედება მიკვლევადია — აუდიტი ხდება უმტკივნეულო.",
        "Faster cash": "უფრო სწრაფი ფულადი ნაკადი",
        "Clean, on-time claims get paid faster.": "სუფთა, დროული მოთხოვნები უფრო სწრაფად ანაზღაურდება.",
        "Cost you stop carrying": "ხარჯები, რომლებსაც აღარ იხდით",
        "See every leak": "ხედავთ ყველა დანაკარგს",
        "AI tracks every cost and flags overspend.": "AI აკონტროლებს ყველა ხარჯს და აფიქსირებს ზედმეტ ხარჯვას.",
        "More patients, same doctors": "მეტი პაციენტი, იგივე ექიმები",
        "Less time on notes — more patients per day.": "ნაკლები დრო ჩანაწერებზე — მეტი პაციენტი დღეში.",
        "Mistakes blocked at the source": "შეცდომები იბლოკება საწყისშივე",
        "Obvious errors stopped before they cost you.": "აშკარა შეცდომები ჩერდება მანამ, სანამ ზარალს მოგიტანთ.",
        "Back-office, halved": "ბექ-ოფისი, განახევრებული",
        "QA, stock and lab admin at half the headcount.": "ხარისხის კონტროლი, მარაგები და ლაბის ადმინისტრაცია ნახევარი პერსონალით.",
        "Predictive stock": "პროგნოზირებადი მარაგები",
        "Ordered to real demand — less waste, fewer rush buys.": "შეკვეთები რეალური მოთხოვნით — ნაკლები დანაკარგი და სასწრაფო შესყიდვები.",
        "Lower burnout &amp; turnover": "ნაკლები გადაწვა და კადრების დენადობა",
        "Lighter workload — less churn, lower hiring cost.": "მსუბუქი სამუშაო — ნაკლები დენადობა, დაქირავების დაბალი ხარჯი.",
        "Fewer denials · on-time filing · half the back office": "ნაკლები უარყოფა · დროული გაგზავნა · ბექ-ოფისის განახევრება",
        "— a margin that compounds, every single month.": "— მარჟა, რომელიც იზრდება ყოველთვიურად."
    }

    # Helper function to wrap text without destroying structure
    def wrap_text(match, ka_text):
        en_text = match.group(0)
        return f'<span class="lang-en">{en_text}</span><span class="lang-ka" style="display:none;">{ka_text}</span>'

    # Apply translations ONLY to the body to protect the <head> section
    sorted_keys = sorted(texts_to_translate.keys(), key=lambda x: len(x), reverse=True)
    for en_text in sorted_keys:
        ka_text = texts_to_translate[en_text]
        # Using exact string replacement ensures we don't accidentally match HTML attributes.
        # But we only do this inside body_html.
        body_html = body_html.replace(en_text, f'<span class="lang-en">{en_text}</span><span class="lang-ka" style="display:none;">{ka_text}</span>')

    # Re-apply the units
    units_translations = {
        '>YRS<': '>წელი<',
        '>DAYS<': '>დღე<',
        '>/yr<': '>/წელ<',
        '>mo<': '>თვე<',
        '>$20–50K<': '>$20–50K<'
    }
    for en, ka in units_translations.items():
        en_inner = en[1:-1]
        ka_inner = ka[1:-1]
        body_html = body_html.replace(en, f'><span class="lang-en">{en_inner}</span><span class="lang-ka" style="display:none;">{ka_inner}</span><')

    # 3. ADD TOGGLE BUTTON AND CSS (IF MISSING)
    if 'class="btn-lang btn-en"' not in body_html:
        toggle_html = """  <div style="position:absolute; top:40px; right:40px; z-index:999; display:flex; gap:8px; background:rgba(190,227,248,0.1); padding:4px; border-radius:100px; backdrop-filter:blur(12px); border:1px solid rgba(190,227,248,0.2);">
    <button onclick="document.body.classList.remove('lang-active-ka'); document.body.classList.add('lang-active-en');" style="border:none; background:transparent; color:rgba(255,255,255,0.7); font-weight:600; cursor:pointer; padding:4px 12px; border-radius:100px; font-size:14px; transition:all 0.2s;" class="btn-lang btn-en">ENG</button>
    <button onclick="document.body.classList.remove('lang-active-en'); document.body.classList.add('lang-active-ka');" style="border:none; background:transparent; color:rgba(255,255,255,0.7); font-weight:600; cursor:pointer; padding:4px 12px; border-radius:100px; font-size:14px; transition:all 0.2s;" class="btn-lang btn-ka">ქარ</button>
  </div>
  <style>
    body.lang-active-en .lang-en { display: inherit !important; }
    body.lang-active-en .lang-ka { display: none !important; }
    body.lang-active-ka .lang-ka { display: inherit !important; }
    body.lang-active-ka .lang-en { display: none !important; }
    body.lang-active-en .btn-en { background: rgba(255,255,255,0.95) !important; color: #1a365d !important; }
    body.lang-active-ka .btn-ka { background: rgba(255,255,255,0.95) !important; color: #1a365d !important; }

    /* Georgian Text Fitting Rules */
    body.lang-active-ka { word-break: break-word; hyphens: auto; }
    body.lang-active-ka .headline-big { font-size: 2.0em !important; line-height: 1.1 !important; }
    body.lang-active-ka .headline-sub { font-size: 0.72em !important; max-width: 100% !important; margin-bottom: 10px !important; }
    body.lang-active-ka .cover .tagline { font-size: 1.25em !important; }
    body.lang-active-ka .slide-label { font-size: 0.48em !important; }
    
    body.lang-active-ka .gw-cards { gap: 10px !important; }
    body.lang-active-ka .gw-card { padding: 12px 14px !important; }
    body.lang-active-ka .gw-card h3 { font-size: 0.68em !important; margin-bottom: 6px !important; }
    body.lang-active-ka .gw-card p { font-size: 0.55em !important; line-height: 1.3 !important; margin: 0 !important; }
    
    body.lang-active-ka .hc-points { gap: 8px !important; margin-top: 10px !important; }
    body.lang-active-ka .hc-point { font-size: 0.65em !important; line-height: 1.3 !important; }
    body.lang-active-ka .hc-point span strong { font-weight: 700 !important; }
    body.lang-active-ka .hc-point-mark { flex-shrink: 0 !important; margin-top: 2px !important; }
    
    body.lang-active-ka .hc-callout-red { padding: 10px 14px !important; }
    body.lang-active-ka .hc-callout-red p { font-size: 0.68em !important; line-height: 1.3 !important; margin-top: 4px !important; }
    body.lang-active-ka .hc-callout-red .hc-callout-tag { font-size: 0.48em !important; }
    
    body.lang-active-ka .ambition-headline { font-size: 1.4em !important; }
    body.lang-active-ka .ambition-card { padding: 12px 14px !important; }
    body.lang-active-ka .stage-title { font-size: 1.0em !important; margin-bottom: 4px !important; }
    body.lang-active-ka .stage-subtitle { font-size: 0.55em !important; }
    body.lang-active-ka .stage-stat-value { font-size: 0.65em !important; }
    body.lang-active-ka .stage-stat-label { font-size: 0.5em !important; }
    
    body.lang-active-ka .gw-stat-num { font-size: 1.25em !important; }
    body.lang-active-ka .gw-stat-label { font-size: 0.4em !important; line-height: 1.2 !important; }
    body.lang-active-ka .gw-stat-sub { font-size: 0.4em !important; line-height: 1.2 !important; }
    
    body.lang-active-ka .hc-cmp-row { padding: 0 !important; }
    body.lang-active-ka .hc-cmp-cell { font-size: 0.5em !important; padding: 4px 6px !important; line-height: 1.2 !important; }
    
    body.lang-active-ka .hc-safe-strip { font-size: 0.52em !important; line-height: 1.3 !important; padding: 10px 14px !important; }
    body.lang-active-ka .hc-terms { gap: 6px !important; margin-top: 12px !important; }
    body.lang-active-ka .hc-term { font-size: 0.52em !important; padding: 6px 10px !important; }
    
    body.lang-active-ka .gallery-headline { font-size: 1.5em !important; }
    body.lang-active-ka .gallery-sub { font-size: 0.6em !important; }
    body.lang-active-ka .gallery-caption-desc { font-size: 0.55em !important; line-height: 1.2 !important; }
    
    body.lang-active-ka .hc-ask-line { font-size: 1.3em !important; }
    body.lang-active-ka .hc-ask-sub { font-size: 0.65em !important; }
    
    body.lang-active-ka .chip { font-size: 0.48em !important; padding: 4px 8px !important; }
    body.lang-active-ka .bm-arr-num { font-size: 1.3em !important; }
    body.lang-active-ka .bm-arr-label, body.lang-active-ka .bm-arr-sub { font-size: 0.45em !important; line-height: 1.2 !important; }
  </style>
  <script>document.body.classList.add('lang-active-en');</script>
"""
        body_html = body_html.replace('<section class="cover">', f'<section class="cover">\n{toggle_html}')

    # Combine back
    final_html = html[:body_match.start()] + body_html
    
    with open("public/healthycore.html", "w", encoding="utf-8") as f:
        f.write(final_html)

apply_translations()
