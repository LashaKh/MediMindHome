import re

html = open("public/healthycore.html").read()

texts_to_translate = {
    # Cover / Tagline
    "The idea was born ": "იდეა დაიბადა ",
    "here": "აქ",
    "Now ": "ახლა ",
    "own a piece": "ფლობდეთ წილს",
    " of it.": " მისგან.",
    "One hospital. One operating system. The future of healthcare.": "ერთი კლინიკა. ერთი ოპერაციული სისტემა. ჯანდაცვის მომავალი.",
    
    # 2 Liability
    "current EMR works — at a functional level. But it's outdated, it's not secure, and it will not carry this hospital into the next decade. Worse: you don't even have a contract with the vendor, and the database isn't fully in your possession. That's not a software problem, it's an existential operational risk. You can't build the future of this hospital on a foundation that could be pulled out from under you. This gets solved now, on your terms — or later, on someone else's.": "ახლანდელი EMR მუშაობს — ფუნქციურ დონეზე. მაგრამ ის მოძველებულია, არაუსაფრთხოა და ვერ გაუძღვება ამ კლინიკას მომდევნო ათწლეულში. უფრო უარესი: თქვენ კონტრაქტიც კი არ გაქვთ პროვაიდერთან და მონაცემთა ბაზა სრულად არ არის თქვენს მფლობელობაში. ეს არ არის პროგრამული პრობლემა, ეს არის ეგზისტენციალური ოპერაციული რისკი. თქვენ ვერ ააშენებთ კლინიკის მომავალს ფუნდამენტზე, რომელიც შეიძლება ნებისმიერ მომენტში გამოგაცალონ. ეს უნდა მოგვარდეს ახლა, თქვენი პირობებით — ან მოგვიანებით, სხვისი პირობებით.",
    
    # 3 Switch
    "the legacy vendor resists, we route around them. You don't wait on their goodwill, and you don't lose a day of operations. The thing that's kept you stuck is the exact thing we make trivial.": "ძველი ვენდორი წინააღმდეგობას გიწევდეთ, ჩვენ მათ გვერდს ავუვლით. თქვენ არ გჭირდებათ მათი კეთილი ნების ლოდინი და არ კარგავთ არცერთ სამუშაო დღეს. ის, რაც გაფერხებდათ, ჩვენთვის ტრივიალური ამოცანაა.",
    "the old vendor resists, we route around them.": "ძველი ვენდორი წინააღმდეგობას გაგიწევთ, ჩვენ მათ გვერდს ავუვლით.",
    
    # 4 Offer
    "system. With us, all three are one operating system — and they're free, indefinitely. And not a stripped-down free: this is US-level, gold-": "სისტემაში. ჩვენთან, სამივე ერთი ოპერაციული სისტემაა — და ისინი უფასოა, უვადოდ. და ეს არ არის შეზღუდული ვერსია: ეს არის აშშ-ს დონის, ოქროს-",
    "On top of that, free unlimited": "გარდა ამისა, უფასო შეუზღუდავი",
    "development": "დეველოპმენტი",
    ". Any feature you want, we build it — and we're happy to, because every good capability we add for you makes our product stronger for everyone. Concrete proof: we just built our own alternative to 3mensio in-house, for TAVI pre-procedural planning. That tool costs around six thousand dollars a year. With us it's free — and so is the next breakthrough, and the one after that. [CONFIRM: 3mensio/TAVI ~$6,000/yr figure before presenting.]": ". ნებისმიერი ფუნქცია რაც გსურთ, ჩვენ ავაშენებთ — და სიამოვნებით, რადგან ყველა კარგი შესაძლებლობა, რომელსაც ვამატებთ, პროდუქტს ყველასთვის უკეთესს ხდის. კონკრეტული მაგალითი: ჩვენ ახლახან შევქმენით 3mensio-ს ალტერნატივა TAVI პროცედურის დაგეგმვისთვის. ეს პროგრამა დაახლოებით 6,000 დოლარი ჯდება წელიწადში. ჩვენთან ის უფასოა — და ასე იქნება ყველა მომავალი ინოვაცია.",
    
    # 5 Wins
    ", and tools like 3mensio you pay for today — your hundred-thousand-dollar check pays itself back in roughly three-point-seven years. After that, your ongoing software cost is zero, forever. But that's only the floor. You also own equity in one of the first": " და ინსტრუმენტები როგორიცაა 3mensio — თქვენი 100,000 დოლარიანი ინვესტიცია თავს ინაზღაურებს დაახლოებით 3.7 წელიწადში. ამის შემდეგ, თქვენი პროგრამული უზრუნველყოფის ხარჯი ნულია, სამუდამოდ. მაგრამ ეს მხოლოდ დასაწყისია. თქვენ ასევე ფლობთ წილს მსოფლიოში ერთ-ერთ პირველ",
    "hospital operating systems in the": "ჰოსპიტალურ ოპერაციულ სისტემაში",
    "we ever disappear, you keep your EMR running and maintained in-house, so you're never hostage to a vendor again. And no one else on earth offers free, unlimited feature": "თუ ჩვენ გავქრებით, თქვენ აგრძელებთ EMR-ის მართვას შიდა ძალებით, ასე რომ აღარასოდეს იქნებით ვენდორის მძევალი. და სხვა არავინ გთავაზობთ უფასო, შეუზღუდავ",
    "at the scale we do. It is an extremely winning situation. The only losing move is standing still — and on the next slide I'll show you exactly what standing still costs. [CONFIRM: 3.7-yr payback basis (~$27K/yr avoided software spend — confirm the annual figure) · and the source-code escrow terms before committing them in writing.]": "დეველოპმენტს ჩვენი მასშტაბით. ეს არის იდეალური მომგებიანი სიტუაცია. ერთადერთი წაგებული ნაბიჯი ერთ ადგილზე დგომაა — და შემდეგ სლაიდზე ზუსტად გაჩვენებთ, რა ჯდება ეს დგომა.",
    
    # 6 More
    ". A patient — stented two weeks earlier — comes in with stomach pain. A cheap": ". პაციენტი — რომელსაც ორი კვირის წინ სტენტი ჩაუდგეს — შემოდის მუცლის ტკივილით. იაფიანი",
    "test that would have caught what was killing him doesn't get ordered for hours. He goes into septic shock and lands in the ICU. Nobody was incompetent — the hospital simply ran on human attention and memory at two in the morning. An operating system doesn't get tired. A cheap": "ლაბორატორიული ტესტი, რომელიც გამოავლენდა საფრთხეს, საათობით არ ინიშნება. ის გადადის სეპტიურ შოკში და ხვდება რეანიმაციაში. არავინ იყო არაკომპეტენტური — კლინიკა უბრალოდ მუშაობდა ადამიანურ ყურადღებასა და მეხსიერებაზე ღამის 2 საათზე. ოპერაციული სისტემა კი არ იღლება. იაფიანი",
    "test versus twenty hospital days — that asymmetry is the entire reason an": "ლაბორატორიული ტესტი ოცი დღის ჰოსპიტალიზაციის წინააღმდეგ — ეს ასიმეტრია არის მიზეზი, რის გამოც არსებობს",
    "OS exists. We don't just digitize your hospital. We cut the costs you can't even see coming.": "OS. ჩვენ არ ვაკეთებთ მხოლოდ კლინიკის დიგიტალიზაციას. ჩვენ ვამცირებთ იმ ხარჯებს, რომლებსაც წინასწარ ვერც კი ხედავთ.",
    
    # 7 Not EMR
    "hat. What you'd be running isn't an EMR — it's an": "ქუდი და მოირგეთ ინვესტორის. რასაც თქვენ გამოიყენებთ არ არის EMR — ეს არის",
    "operating system for the entire hospital, built ground-up on FHIR. That's a far bigger market and a far bigger company than EMR": "ოპერაციული სისტემა მთლიანი ჰოსპიტლისთვის, აშენებული ნულიდან FHIR-ზე. ეს გაცილებით დიდი ბაზარი და გაცილებით დიდი კომპანიაა, ვიდრე უბრალოდ EMR",
    "'s the part that should matter to a research hospital: we are one of the first in the": "აი, რა არის მთავარი კვლევითი კლინიკისთვის: ჩვენ ვართ ერთ-ერთი პირველი მსოფლიოში, ვისაც აქვს",
    "product in a real hospital. The reason no one in the US or EU has this yet isn't talent — it's regulation. The EU AI Act and FDA clearance keep Western hospitals years behind. You'd be running the product of the future while they're still in the queue. The free software is the floor.": "პროდუქტი რეალურ კლინიკაში. მიზეზი, რის გამოც აშშ-სა და ევროპაში ეს ჯერ არ აქვთ, ტალანტი არ არის — ეს რეგულაციებია. EU AI Act-ი და FDA-ს რეგულაციები დასავლურ კლინიკებს წლებით უკან ხევს. თქვენ გამოიყენებთ მომავლის პროდუქტს, სანამ ისინი რიგში დგანან. უფასო სისტემა მხოლოდ დასაწყისია.",

    # 8 Ambition
    "; that's not a coincidence in this conversation, it's a strategic door you can open. You wouldn't just be backing a": "ეს არ არის დამთხვევა ამ საუბარში, ეს არის სტრატეგიული კარი, რომელიც შეგიძლიათ გააღოთ. თქვენ არ უჭერთ მხარს მხოლოდ",
    "rgia": "ქართულ",
    ", and globally after that. We built this": "და შემდგომ გლობალურად. ჩვენ ავაშენეთ ეს",
    ". The early bet compounds.": ". ადრეული ინვესტიცია მრავლდება.",

    # 9 Deal
    "'s the shape of the deal, side by side. An angel writes a check and gets equity — that's it. You write a check and you get the equity plus the product free forever, plus unlimited free": "აი გარიგების ფორმატი, შედარებისთვის. Angel ინვესტორი დებს თანხას და იღებს წილს — სულ ეს არის. თქვენ დებთ თანხას და იღებთ წილს პლუს უფასო პროდუქტს სამუდამოდ, პლუს შეუზღუდავ უფასო დეველოპმენტს",
    ", plus downside protection no angel gets, plus you become our flagship partner hospital. Same instrument. A categorically better deal — because you're not just money to us, you're the hospital that proves it.": ", პლუს რისკებისგან დაცვას, რასაც სხვა ინვესტორი ვერ იღებს, პლუს ხდებით ჩვენი ფლაგმანი პარტნიორი კლინიკა. იგივე ინსტრუმენტი. მაგრამ კატეგორიულად უკეთესი გარიგება — რადგან თქვენ ჩვენთვის მხოლოდ ინვესტორი არ ხართ, თქვენ ხართ კლინიკა, რომელიც ჩვენს პროდუქტს ამტკიცებს.",
    
    # 10 Partnership
    "you live. Healthycore is a first-in-human research hospital. You already made the decision to be early — to run trials and devices before the rest of the region, because being first is part of who you are. This is the exact same decision, in software and AI. You'd run a clinical operating system that hospitals in the US and EU can't legally deploy yet — and you'd": "იმით, რითაც თქვენ ცხოვრობთ. Healthycore არის კვლევითი კლინიკა. თქვენ უკვე მიიღეთ გადაწყვეტილება იყოთ ადრეულ ეტაპზე — ჩაატაროთ კვლევები და დანერგოთ აპარატურა რეგიონში პირველებმა, რადგან პირველობა თქვენი იდენტობის ნაწილია. ეს არის ზუსტად იგივე გადაწყვეტილება, ოღონდ პროგრამულ უზრუნველყოფასა და AI-ში. თქვენ გამოიყენებთ კლინიკურ ოპერაციულ სისტემას, რომლის ლეგალურად დანერგვაც აშშ-სა და ევროპაში ჯერ არ შეუძლიათ — და თქვენ",
    "of the company building it. You already lead in devices.": "იმ კომპანიაში, რომელიც ამას აშენებს. თქვენ უკვე ხართ ლიდერები აპარატურაში.",
    "That's the partnership.": "ეს არის ჩვენი პარტნიორობა.",

    # End
    "and the system architecture. Happy to dwell on whichever you want to see more of.": "და სისტემის არქიტექტურა. სიამოვნებით გავჩერდები იმაზე, რომლის ნახვაც უფრო დეტალურად გსურთ.",
    "embedded from /": "ჩაშენებულია /-დან",
    "— click play to start. To leave, click outside the": "— დასაწყებად დააჭირეთ play-ს. გასასვლელად დააჭირეთ",
    "rame and press the right arrow (or the on-screen arrow) to continue to the architecture appendix.": "iframe-ის გარეთ და გამოიყენეთ მარჯვენა ისარი (ან ეკრანის ისარი) რათა გადახვიდეთ არქიტექტურის დანართზე.",
    
    # App Arch
    "Brain is AI reasoning across the": "ტვინი არის AI, რომელიც აანალიზებს",
    
    # App Real Case
    ", the early sepsis, the drug clash — before 2&nbsp;a.m. becomes an ICU bed.": ", სეფსისის ადრეულ ნიშნებს, წამლების შეუთავსებლობას — სანამ ღამის 2 საათი რეანიმაციული საწოლი გახდება.",
    ", caught 19 hours too late. One real case — multiplied across every patient.": ", 19 საათით დაგვიანებული. ერთი რეალური შემთხვევა — გამრავლებული თითოეულ პაციენტზე.",
    
    # Fragments
    "25-hospital contract with": "25-კლინიკიანი კონტრაქტი",
    "for a year. We're government-recognized as an": "ერთი წელია. ჩვენ აღიარებული ვართ როგორც",
    "25-hospital chain.": "25-კლინიკიან ქსელში.",
    "stockholders are": "აქციონერები",
    "backyard": "ბაზარი",
    "the margin comes from": "მოდის მარჟა",
    "protects your margin.": "იცავს თქვენს მარჟას.",
    "admin at half the headcount.": "ნახევარი პერსონალით.",
    "for health data, so the AI sees the whole patient as one picture.": "ჯანდაცვის მონაცემებისთვის, რათა AI-მ პაციენტი ერთ მთლიან სურათად დაინახოს.",
    "codebase, built ground-up on FHIR R4.": "კოდი, შექმნილი ნულიდან FHIR R4-ზე.",
    "hospital OS forever, unlimited development, and a": "ჰოსპიტალური OS სამუდამოდ, შეუზღუდავი დეველოპმენტი, და",
    "of a $200K pre-seed SAFE, free product forever.\">": "of a $200K pre-seed SAFE, free product forever.\">",
    "of a $200K pre-seed SAFE · free product forever · a stake in the future of hospital": "of a $200K pre-seed SAFE · free product forever · a stake in the future of hospital",
    "stake in a $200K pre-seed round.\">": "stake in a $200K pre-seed round.\">",
    "stripped-down.": "შეზღუდული.",
    "a promise": "დაპირება",
}

def wrap_text(en_text, ka_text):
    return f'<span class="lang-en">{en_text}</span><span class="lang-ka" style="display:none;">{ka_text}</span>'

# We sort by length descending to replace larger text blocks first.
sorted_keys = sorted(texts_to_translate.keys(), key=lambda x: len(x), reverse=True)

for en_text in sorted_keys:
    ka_text = texts_to_translate[en_text]
    if ka_text == "": continue
    if en_text in html and f'<span class="lang-en">{en_text}</span>' not in html:
        html = html.replace(en_text, wrap_text(en_text, ka_text))

with open("public/healthycore.html", "w") as f:
    f.write(html)
