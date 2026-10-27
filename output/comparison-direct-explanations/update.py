import hashlib,json,re
from pathlib import Path
out=Path('output/comparison-direct-explanations')
js=Path('public/deck-assets/hospitals-comparison.js');source=js.read_text();assert source==(out/'before-comparison.js').read_text()
def topic(name,title,description,sections):return {'name':name,'title':title,'description':description,'sections':[{'title':h,'text':p} for h,p in sections]}
topics=[
 topic(['Code ownership','კოდის საკუთრება'],
  ['Another team can support your first version.','პირველ ვერსიას სხვა გუნდიც გაუწევს მხარდაჭერას.'],
  ['Your hospital owns the source code of the first delivered base version under contract. If MediMind cannot continue support, or our working relationship runs into problems, you can entrust the maintenance and development of that version to another development team.','პირველი ჩაბარებული საბაზისო ვერსიის საწყისი კოდი ხელშეკრულებით თქვენს კლინიკას ეკუთვნის. თუ MediMind მხარდაჭერას ვერ გააგრძელებს ან თანამშრომლობაში პრობლემა შეიქმნება, ამ ვერსიის მოვლასა და განვითარებას სხვა დეველოპერულ გუნდს გადააბარებთ.'],[
   (['What another team can do','რას გააკეთებს სხვა გუნდი'],['Source code is the program text developers work on. Another team can study it, fix faults and develop the first version, so your hospital is not dependent on MediMind alone for its continued maintenance.','საწყისი კოდი პროგრამის ტექსტია, რომელზეც დეველოპერები მუშაობენ. სხვა გუნდს შეუძლია მისი შესწავლა, შეცდომების გამოსწორება და პირველი ვერსიის განვითარება. ამ ვერსიის შემდგომი მხარდაჭერა მხოლოდ MediMind-ზე აღარ იქნება დამოკიდებული.']),
   (['Which version this covers','რომელ ვერსიას ეხება ეს უფლება'],['This commitment covers the first delivered base version. Rights to later versions are governed by separate contractual terms.','ეს პირობა პირველად ჩაბარებულ საბაზისო ვერსიას ეხება. შემდგომ ვერსიებზე უფლებებს ხელშეკრულების ცალკე პირობები განსაზღვრავს.']),
   (['Code used from other authors','სხვა ავტორებისგან გამოყენებული კოდი'],['Some software parts used in the system may have been created by other authors. Those parts retain their own licence terms. The contract records the ownership and use rights that apply.','სისტემაში გამოყენებული ზოგი პროგრამული ნაწილი შეიძლება სხვა ავტორების შექმნილი იყოს. ასეთ ნაწილებზე მათი ლიცენზიის პირობები მოქმედებს. საკუთრებისა და გამოყენების კონკრეტული უფლებები ხელშეკრულებაში განისაზღვრება.'])]),
 topic(['Ongoing development','უწყვეტი განვითარება'],
  ['We deliver complex requests too.','რთულ მოთხოვნებსაც სრულად ვახორციელებთ.'],
  ['Throughout our partnership, we build and implement every requested software feature and change without additional development fees. The scope reaches beyond a new form or field to complete workflows and specialised clinical tools.','თანამშრომლობის განმავლობაში ყველა მოთხოვნილ პროგრამულ ფუნქციასა და ცვლილებას განვითარების დამატებითი საფასურის გარეშე ვქმნით და ვნერგავთ. ეს მოიცავს როგორც მცირე ცვლილებებს, ისე სრულ სამუშაო პროცესებსა და სპეციალიზებულ კლინიკურ ინსტრუმენტებს.'],[
   (['From a small change to a complex tool','მცირე ცვლილებიდან რთულ პროგრამამდე'],['We can deliver software requests of any complexity, including a complete clinical tool, a new module, connections to other systems or a workflow spanning several departments.','შეგვიძლია ნებისმიერი სირთულის პროგრამული ამოცანის გადაწყვეტა. ეს შეიძლება იყოს სრული კლინიკური ინსტრუმენტი, ახალი მოდული, სხვა სისტემებთან დაკავშირება ან რამდენიმე განყოფილების საერთო სამუშაო პროცესი.']),
   (['Useful tools improve the system for both of us','სასარგებლო ინსტრუმენტები ჩვენს სისტემასაც აუმჯობესებს'],['It is in our interest to give your team more useful, productive tools. Solving real hospital needs makes your work easier and helps us improve MediMind.','ჩვენს ინტერესშიცაა, რომ თქვენმა გუნდმა მეტი სასარგებლო ინსტრუმენტი მიიღოს და უფრო პროდუქტიულად იმუშაოს. კლინიკის რეალური საჭიროებების გადაწყვეტა თქვენს მუშაობას ამარტივებს და MediMind-საც უფრო სრულყოფილს ხდის.'])]),
 topic(['Financial control','ფინანსური კონტროლი'],
  ['See where costs rise and revenue is missed.','ხედავთ, სად იზრდება ხარჯი და იკარგება შემოსავალი.'],
  ['View each department’s revenue and costs together. Compare departments and identify the areas that need attention.','თითოეული განყოფილების შემოსავალსა და ხარჯებს ერთად ხედავთ. შეგიძლიათ შეადაროთ განყოფილებები და გაარკვიოთ, რომელ მიმართულებას სჭირდება ყურადღება.'],[
   (['Understand each department’s financial position','თითოეული განყოფილების ფინანსური სურათი'],['Management can assess what a department earns and spends without piecing those figures together from disconnected reports.','ხელმძღვანელი ხედავს, რამდენი შემოსავალი აქვს თითოეულ განყოფილებას და რა ხარჯი ახლავს მის მუშაობას. ამ სურათის მისაღებად სხვადასხვა ანგარიშის ცალ-ცალკე შეჯერება აღარ სჭირდება.']),
   (['Make decisions using your hospital’s figures','გადაწყვეტილებები კლინიკის მონაცემებზე დაყრდნობით'],['Use the information to plan budgets, investigate growing costs and decide which processes need to change.','ამ ინფორმაციაზე დაყრდნობით გეგმავთ ბიუჯეტს, ამოწმებთ ხარჯის ზრდას და წყვეტთ, რომელ პროცესს სჭირდება ცვლილება.'])]),
 topic(['Tailored to you','თქვენზე მორგება'],
  ['You set the working process. We adapt the software.','თქვენ ადგენთ მუშაობის წესს. ჩვენ პროგრამას ვარგებთ.'],
  ['Together with your team, we define how each department needs to work. We adapt the software to those processes so staff do not have to change their working methods just to accommodate software restrictions.','თქვენს გუნდთან ერთად ვაზუსტებთ, როგორ უნდა მუშაობდეს თითოეული განყოფილება. პროგრამას ამ პროცესებს ვარგებთ, რათა თანამშრომლებს მისი შეზღუდვების გამო მუშაობის წესის შეცვლა არ უწევდეთ.'],[
   (['The whole workflow','მთელი სამუშაო პროცესი'],['Tailoring includes the sequence of tasks, staff roles, forms, reports and the transfer of information between departments.','ვარგებთ სამუშაოს ეტაპებს, თანამშრომლების როლებს, ფორმებს, ანგარიშებსა და განყოფილებებს შორის ინფორმაციის გადაცემას.']),
   (['Your team helps shape the result','თქვენი გუნდის მონაწილეობით'],['Your staff explain their needs and check whether the agreed solution works comfortably in day-to-day practice.','თქვენი თანამშრომლები გვიხსნიან საჭიროებებს და ამოწმებენ, რამდენად მოსახერხებელია შეთანხმებული გადაწყვეტა ყოველდღიურ მუშაობაში.'])]),
 topic(['One system','ერთიანი სისტემა'],
  ['All departments work in one system.','ყველა განყოფილება ერთ სისტემაში მუშაობს.'],
  ['Registration, clinical work, laboratory, imaging and billing are connected in one operating system and use shared information.','რეგისტრაცია, მკურნალობა, ლაბორატორია, რადიოლოგია და ანგარიშსწორება ერთ ოპერაციულ სისტემაშია გაერთიანებული. ყველა მიმართულება საერთო მონაცემებს იყენებს.'],[
   (['One shared patient record','პაციენტის საერთო ჩანაწერი'],['The patient’s record, requested tests, results and delivered services remain connected across the relevant departments.','პაციენტის ჩანაწერი, დანიშნული კვლევები, შედეგები და გაწეული მომსახურება შესაბამის განყოფილებებს შორის ერთმანეთთანაა დაკავშირებული.']),
   (['Less repeated entry and reconciliation','ნაკლები განმეორებითი შეყვანა და გადამოწმება'],['Sharing information reduces the need to enter the same data again or reconcile separate copies as work moves between departments.','საერთო მონაცემები ამცირებს ერთი და იმავე ინფორმაციის ხელახლა შეყვანისა და სხვადასხვა პროგრამაში არსებული ჩანაწერების ერთმანეთთან გადამოწმების საჭიროებას.'])]),
 topic(['Data standards','მონაცემთა სტანდარტი'],
  ['Clinical data follows an international standard.','კლინიკური მონაცემები საერთაშორისო სტანდარტს შეესაბამება.'],
  ['MediMind is built ground-up on FHIR R4, an international standard for describing and exchanging health information.','MediMind თავიდანვე FHIR R4 სტანდარტზეა აგებული. ეს ჯანმრთელობის მონაცემების აღწერისა და გაცვლის საერთაშორისო სტანდარტია.'],[
   (['A consistent way to describe information','ინფორმაციის აღწერის საერთო წესი'],['The standard defines how to describe patients, tests, medications and other clinical information. This provides a foundation for exchanging information with other systems.','სტანდარტი განსაზღვრავს, როგორ აღიწერება პაციენტი, კვლევა, მედიკამენტი და სხვა კლინიკური ინფორმაცია. ეს სხვა სისტემებთან ინფორმაციის გაცვლის საფუძველს ქმნის.']),
   (['Connections are implemented separately','სისტემებს შორის კავშირის გამართვა'],['Actual exchange still requires agreed field mappings and a working connection to the particular system. A common standard does not make every connection automatic.','რეალური გაცვლისთვის მონაცემთა ველების შესაბამისობაც უნდა განისაზღვროს და კონკრეტულ სისტემასთან კავშირიც გაიმართოს. საერთო სტანდარტი ყველა კავშირის ავტომატურად ამუშავებას არ ნიშნავს.'])]),
 topic(['Built for AI','AI-ისთვის შექმნილი'],
  ['AI can build on your hospital’s shared information.','AI კლინიკის საერთო მონაცემებს დაეყრდნობა.'],
  ['The system is designed from the outset to provide a foundation for AI to work with patient records, test results and medications together.','სისტემა თავიდანვე ისეა აგებული, რომ AI-ს პაციენტის ჩანაწერებთან, კვლევის შედეგებსა და დანიშნულებებთან ერთად მუშაობის საფუძველი ჰქონდეს.'],[
   (['Relevant information in one place','საჭირო ინფორმაცია ერთ სივრცეში'],['Instead of assembling information from disconnected programs for each tool, the shared, structured data gives AI applications a foundation for using the relevant hospital information together.','როცა ინფორმაცია სხვადასხვა პროგრამაშია გაფანტული, AI-ის დამატებამდე მისი თავმოყრა და მომზადებაა საჭირო. MediMind-ში ერთიანი, სტრუქტურირებული მონაცემები AI-ის ხელსაწყოებისთვის ამ საფუძველს ქმნის.']),
   (['Your hospital chooses what to add','თქვენ წყვეტთ, რას დაამატებთ'],['AI is optional. We agree each capability, its availability and implementation scope separately. Clinical decisions remain with doctors.','AI-ის დამატება არჩევითია. კონკრეტულ ფუნქციას, მის ხელმისაწვდომობასა და დანერგვის მოცულობას ცალკე ვათანხმებთ. კლინიკურ გადაწყვეტილებებს ექიმი იღებს.'])])
]
a=source.index('  const topics = [');b=source.index('  const dialog =',a)
updated=source[:a]+'  const topics = '+json.dumps(topics,ensure_ascii=False,indent=2)+';\n'+source[b:]
updated=updated.replace('// A readable comparison first; optional visual explanations on demand.','// Clear benefit explanations; navigation opens the topic without a simulated product demo.')
updated=updated.replace('<div class="hcmp-visual-home"></div>','<div class="hcmp-reading"></div>')
updated=updated.replace("const visualHome = dialog.querySelector('.hcmp-visual-home');","const reading = dialog.querySelector('.hcmp-reading');")
a=updated.index('  // Each topic has a different task');b=updated.index('  function select(next, keyboard)',a)
updated=updated[:a]+updated[b:]
old="""    if(!sceneStates.has(topic.visual))sceneStates.set(topic.visual,{});
    sceneState=sceneStates.get(topic.visual);
    refreshScene();"""
new="""    reading.innerHTML = topic.sections.map(section => `<section class="hcmp-point"><h3>${copy(...section.title)}</h3><p>${copy(...section.text)}</p></section>`).join('');
    dialog.scrollTop = 0;"""
assert updated.count(old)==1;updated=updated.replace(old,new)
updated=updated.replace("    if (event.target.closest('.hcmp-scene')) return;\n",'')
assert 'renderScene' not in updated and 'data-scene-' not in updated and 'sceneState' not in updated
css=Path('public/deck-assets/hospitals-comparison.css');css_before=css.read_text();assert css_before==(out/'before-comparison.css').read_text()
marker='/* Seven different, useful examples:';cut=css_before.index(marker)
css_after=css_before[:cut]+'''/* Plain explanations replace the simulated product controls. */
.hcmp-reading { margin-bottom: 22px; }
.hcmp-point { padding: 18px 0; border-top: 1px solid #e1eaf2; }
.hcmp-point h3 { margin: 0 0 7px; color: #234c73; font-size: 17px; line-height: 1.45; font-weight: 700; }
.hcmp-point p { margin: 0; color: #536d84; font-size: 15px; line-height: 1.7; }
.hcmp-detail-heading > p { font-size: 15px; }
'''
hp=Path('public/hospitals.html');html_before=hp.read_text();assert html_before==(out/'before-hospitals.html').read_text()
start=html_before.index('<section id="hospital-comparison"');end=html_before.index('</section>',start)+len('</section>');section=html_before[start:end]
changes=[
 ('ერთ მომწოდებელზე ხართ დამოკიდებული.','პროგრამის მხარდაჭერას სხვა გუნდს ვერ გადასცემთ.'),
 ('Dependence on one supplier.','You cannot hand software maintenance to another team.'),
 ('პირველი ვერსიის კოდი ხელშეკრულებით თქვენია.','პირველ ვერსიას სხვა გუნდიც გაუწევს მხარდაჭერას.'),
 ('Your first version’s code is yours, under contract.','Another team can support your first version.'),
 ('გუნდი პროგრამის შეზღუდვებს ერგება.','პროგრამის გამო მუშაობის წესს ცვლით.'),
 ('Staff adapt their workflow to software limitations.','You change your workflow because of software restrictions.'),
 ('ძველი, დაუკავშირებელი პროგრამები AI-ისთვის მზად არ არის.','AI-ს მონაცემებს ერთიანად ვერ აწვდით.'),
 ('Legacy, disconnected systems are not ready for AI.','You cannot provide AI with information across your systems.')
]
for old,new in changes:
 count=section.count(old)
 # English strings are read from the current source below if their older wording differs.
 if count!=1:print('NOT APPLIED:',repr(old),count);continue
 section=section.replace(old,new,1)
html_after=html_before[:start]+section+html_before[end:]
for file,content in [(js,updated),(css,css_after)]:
 digest=hashlib.sha256(content.encode()).hexdigest()[:10]
 pattern=r'(/deck-assets/'+re.escape(file.name)+r'\?v=)[^"\s]+'
 html_after,n=re.subn(pattern,lambda m:m[1]+digest,html_after);assert n==1
assert js.read_text()==source and css.read_text()==css_before and hp.read_text()==html_before
js.write_text(updated);css.write_text(css_after);hp.write_text(html_after)
(out/'topics.json').write_text(json.dumps(topics,ensure_ascii=False,indent=2)+'\n')
print('Replaced all seven mini demos with readable explanations. Removed their state, handlers and styles.')
