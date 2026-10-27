from pathlib import Path
import re, hashlib
root=Path.cwd()
out=root/'output/georgian-slide-09-ai-offer'
p=root/'public/hospitals.html'
css=root/'public/deck-assets/hospitals-roadmap.css'
original=p.read_text()
for source,name in [(p,'before-hospitals.html'),(css,'before-roadmap.css')]:
    dest=out/name
    if not dest.exists(): dest.write_bytes(source.read_bytes())
start=original.index('      <section class="gw-slide hroad-slide"')
end=original.index('      </section>',start)+len('      </section>')
s=original[start:end]
def bi(en,ka): return f'<span class="lang-en">{en}</span><span class="lang-ka" style="display:none;">{ka}</span>'
def replace(old,new):
    global s
    assert s.count(old)==1,old
    s=s.replace(old,new)
replace(bi('A complete hospital system. <em>Optional AI, step by step.</em>','კლინიკის სრული სისტემა. <em>AI თქვენი არჩევანით.</em>'),bi('Your hospital’s development <em>in 3 stages.</em>','თქვენი კლინიკის განვითარების <em>3 ეტაპი.</em>'))
replace(bi('Help with drafting records, checking information and routine work.','ეხმარება ჩანაწერების მომზადებაში, მონაცემების გადამოწმებასა და რუტინულ საქმეებში.'),bi('Medical AI assistants and tools tailored to each department’s needs.','სამედიცინო AI ასისტენტები და თითოეული განყოფილების საჭიროებებზე მორგებული ინსტრუმენტები.'))
replace(bi('It will coordinate hospital operations and carry out authorised tasks.','კლინიკის მუშაობას დაგეგმავს და ნებადართულ ამოცანებს თავად შეასრულებს.'),bi('It will anticipate needs, coordinate the hospital and act within its authorised scope.','საჭიროებებს წინასწარ განსაზღვრავს, კლინიკის მუშაობას დაგეგმავს და ნებადართულ ფარგლებში იმოქმედებს.'))
# Make research recruitment visible on the overview as well as in the details.
replace(bi('Patients','პაციენტები')+'</strong><small>'+bi('Patient explanations','ინფორმაციის ახსნა'),bi('Research','კვლევები')+'</strong><small>'+bi('Patient matching','პაციენტების შერჩევა'))
def direction(en_title,ka_title,en_body,ka_body):
    return '<div class="hroad-direction"><dt>'+bi(en_title,ka_title)+'</dt><dd>'+bi(en_body,ka_body)+'</dd></div>'
phase2='<template data-hroad-template="1"><h3>'+bi('An AI assistant for every department','თითოეულ განყოფილებას თავისი AI ასისტენტი')+'</h3><p class="hroad-purpose">'+bi('Medical-grade clinical assistants and specialised assistants for other departments, adapted to your team’s tasks, workflows and hospital protocols.','სამედიცინო AI ასისტენტები ექიმებისთვის და სპეციალიზებული ასისტენტები სხვა განყოფილებებისთვის. მათ თქვენი გუნდის ამოცანებს, სამუშაო წესებსა და კლინიკის პროტოკოლებს ვარგებთ.')+'</p><dl class="hroad-directions">'
items=[
('Clinical assistance','დახმარება ექიმისთვის','Review patient history and test results, including blood gases. Draft action plans using the patient’s context and hospital protocols.','პაციენტის ისტორიისა და კვლევების, მათ შორის სისხლის გაზების ანალიზის შეფასება. პაციენტის მონაცემებისა და კლინიკის პროტოკოლების მიხედვით სამოქმედო გეგმის მონახაზის მომზადება.'),
('Less time on paperwork','ნაკლები დრო დოკუმენტებზე','Draft records from dictation, prepare discharge and handover documents, and explain information to patients in plain language.','კარნახით ჩანაწერის მომზადება, გაწერისა და პაციენტის გადაბარების დოკუმენტების შედგენა. პაციენტისთვის ინფორმაციის გასაგები ენით ახსნა.'),
('Finance and reimbursement','ფინანსები და ანაზღაურება','Check service codes, reimbursement claims and supporting documents to help identify omissions before submission.','მომსახურების კოდების, ანაზღაურების მოთხოვნებისა და საბუთების გადამოწმება. გამოტოვებული ინფორმაციისა და ხარვეზების აღმოჩენა გაგზავნამდე.'),
('Staffing and stock','პერსონალი და მარაგები','Help plan shifts and forecast medicine and supply needs, with less manual coordination.','ცვლების დაგეგმვა და წამლებისა თუ მასალების საჭიროების პროგნოზი. ნაკლები დრო გრაფიკების შედგენასა და მარაგების ხელით შემოწმებაზე.'),
('Management and quality','მართვა და ხარისხი','Analyse workload, financial performance and risks. Highlight where attention and changes are needed.','დატვირთვის, ფინანსური მაჩვენებლებისა და რისკების ანალიზი. გამოვლენა, სად არის საჭირო ყურადღება და რა უნდა შეიცვალოს.'),
('Recruitment for clinical studies','პაციენტების მოძიება კვლევებისთვის','Compare patient data with study eligibility criteria and help the research team find and match suitable candidates.','პაციენტების მონაცემების შედარება კვლევაში ჩართვის კრიტერიუმებთან. მკვლევართა გუნდის დახმარება შესაფერისი პაციენტების მოძიებასა და შერჩევაში.')]
phase2+=''.join(direction(*item) for item in items)+'</dl><p class="hroad-detail-note">'+bi('AI is optional. We agree on the functions, availability, evaluation and price with your hospital. Capabilities are introduced in stages; not every listed function is deployed or clinically validated. Clinical outputs are reviewed by the responsible clinician.','AI-ის დამატება არჩევითია. ფუნქციებს, ხელმისაწვდომობას, შემოწმებასა და ფასს თქვენს კლინიკასთან ვათანხმებთ. ფუნქციებს ეტაპობრივად ვნერგავთ. ყველა ჩამოთვლილი ფუნქცია ჯერ დანერგილი ან კლინიკურად შემოწმებული არ არის. კლინიკურ პასუხებს პასუხისმგებელი ექიმი ამოწმებს.')+'</p></template>'
s,n=re.subn(r'<template data-hroad-template="1">.*?</template>',lambda m:phase2,s,flags=re.S); assert n==1
replace(bi('Built and integrated by us, around your hospital.','თქვენი კლინიკისთვის ჩვენ ვქმნით და ვნერგავთ.'),bi('Our goal is a proactive AI Brain that plans and runs daily hospital operations better than people can through manual coordination. We will build and integrate it for your hospital.','ჩვენი მიზანია პროაქტიული AI ტვინი, რომელიც კლინიკის ყოველდღიურ მუშაობას ადამიანებზე უკეთ დაგეგმავს და მართავს. მას თქვენი კლინიკისთვის ჩვენ შევქმნით და დავნერგავთ.'))
vision='<div class="hroad-vision"><h3>'+bi('The goal: better care and a more profitable hospital','მიზანი: უკეთესი მკურნალობა და უფრო მომგებიანი კლინიკა')+'</h3><dl class="hroad-directions">'
vision+=''.join(direction(*item) for item in [
('Lean, effective departments','ნაკლები რუტინა და პერსონალის ხარჯი','Automate unnecessary manual steps so departments can do more with fewer staff needed for routine work and lower payroll costs.','ავტომატიზაცია შეამცირებს რუტინულ საქმეს. განყოფილებებს იმავე სამუშაოსთვის ნაკლები თანამშრომელი დასჭირდება, კლინიკას კი პერსონალის ხარჯი შეუმცირდება.'),
('Quality and capacity','უკეთესი მკურნალობა და მეტი პაციენტი','Give clinicians the full patient picture and the tools they need. Reduce avoidable workload and delays, improve care and create capacity for more patients.','ექიმს პაციენტის სრული სურათი და საჭირო ინსტრუმენტები ექნება. ნაკლები გადატვირთვა და შეფერხება უკეთესი მკურნალობისა და მეტი პაციენტის მიღების საშუალებას შექმნის.'),
('Stronger financial performance','შემოსავლის ზრდა და ნაკლები დანახარჯი','Better use of staff, rooms and equipment, fewer unrecorded services and less waste. The aim is substantial revenue growth and lower operating costs.','პერსონალის, ოთახებისა და აპარატურის უკეთ გამოყენება. ნაკლები აღურიცხავი მომსახურება და ზედმეტი ხარჯი. მიზანია შემოსავლის მნიშვნელოვანი ზრდა და კლინიკის მუშაობის ხარჯების შემცირება.')])+'</dl></div>'
needle='</ul><p class="hroad-detail-note hroad-future-note">'
replace(needle,'</ul>'+vision+'<p class="hroad-detail-note hroad-future-note">')
# Keep speaker notes consistent with the visible offer.
notes=re.search(r'<aside class="notes">(.*?)</aside>',s,re.S)
assert notes
newnotes='<aside class="notes">'+bi(
'Phase 1 supplies a complete hospital operating system on shared FHIR R4 data and one codebase. Phase 2 offers medical-grade clinical assistants and department-specific assistants adapted to hospital workflows and protocols, including documentation, clinical review, finance, staffing, stock, quality, patient communication and research recruitment by matching patient data with study criteria. There is one value-led catalogue, not a separate built-tools inventory. Availability, evaluation and price are agreed individually; listed capabilities are not all deployed or clinically validated. Phase 3 is the future proactive hospital AI Brain, built and integrated by us. It uses patient data, protocols, workflows and resource information, anticipates needs and risks, makes medical and administrative decisions and acts within an agreed, validated, pre-authorised scope, and checks completion and outcomes. Beyond that scope the authorised hospital team decides. The ambition is to outperform manual human coordination, run leaner departments with fewer routine staffing needs, improve care and capacity, and substantially grow revenue while reducing costs. These are development goals, not measured or guaranteed results. The current system remains independently valuable and AI is optional.',
'პირველ ეტაპზე კლინიკა იღებს სრულფასოვან სისტემას, საერთო FHIR R4 მონაცემებითა და პროგრამის ერთიანი კოდით. მეორე ეტაპი მოიცავს სამედიცინო AI ასისტენტებსა და თითოეული განყოფილების სამუშაოზე მორგებულ ასისტენტებს. შეთავაზება აერთიანებს დოკუმენტებს, კლინიკურ დახმარებას, ფინანსებს, პერსონალს, მარაგებს, ხარისხს, პაციენტთან კომუნიკაციასა და კვლევებისთვის შესაფერისი პაციენტების მოძიებას. ცალკე არ გამოვყოფთ უკვე შექმნილ ინსტრუმენტებს. ხელმისაწვდომობას, შემოწმებასა და ფასს ინდივიდუალურად ვათანხმებთ. ყველა ფუნქცია ჯერ დანერგილი ან კლინიკურად შემოწმებული არ არის. მესამე ეტაპი არის კლინიკის პროაქტიული AI ტვინის სამომავლო ხედვა. მას თქვენი კლინიკისთვის ჩვენ ვქმნით და ვნერგავთ. ის აერთიანებს პაციენტის მონაცემებს, პროტოკოლებს, სამუშაო პროცესებსა და რესურსებს, წინასწარ აფასებს საჭიროებებსა და რისკებს, იღებს სამედიცინო და ადმინისტრაციულ გადაწყვეტილებებს და მოქმედებს წინასწარ შეთანხმებულ, შემოწმებულ და ნებადართულ ფარგლებში. აკონტროლებს შესრულებასა და შედეგებს. დანარჩენ საკითხებზე გადაწყვეტილებას უფლებამოსილი გუნდი იღებს. მიზანია კლინიკის მუშაობის ადამიანებზე უკეთ დაგეგმვა და მართვა, ნაკლები რუტინა და პერსონალის ხარჯი, უკეთესი მკურნალობა, მეტი პაციენტის მიღება და შემოსავლის მნიშვნელოვანი ზრდა. ეს განვითარების მიზნებია და არა უკვე გაზომილი შედეგები ან გარანტია. პირველი ეტაპის სისტემა დამოუკიდებლად სრულფასოვანია, AI-ის დამატება კი არჩევითია.')+'</aside>'
s=s[:notes.start()]+newnotes+s[notes.end():]
assert not re.search('[—–]',s)
p.write_text(original[:start]+s+original[end:])
# The removed inventory has no remaining consumers.
c=css.read_text()
c='\n'.join(line for line in c.split('\n') if not line.lstrip().startswith('.hroad-existing'))
c=c.replace('.hroad-loop {','.hroad-vision { margin-top: 28px; }\n.hroad-loop {',1)
css.write_text(c)
h=p.read_text(); digest=hashlib.sha256(css.read_bytes()).hexdigest()[:10]
h=re.sub(r'hospitals-roadmap\.css\?v=[a-f0-9]+','hospitals-roadmap.css?v='+digest,h)
p.write_text(h)
print('Updated slide 09 title, phase 2 offer and phase 3 vision. Removed unused inventory styles. No JS changes.')
