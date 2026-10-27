from pathlib import Path
import re,json,hashlib
root=Path('public');out=Path('output/georgian-slide-09');h=root/'hospitals.html';s=h.read_text()
(out/'before-hospitals.html').write_text(s)
a=re.search(r'<section\b[^>]*\bid="hospital-ai-path"[^>]*>',s).start();b=s.index('</section>',a)+len('</section>');sec=s[a:b]
ka={
0:'კლინიკის განვითარების 3 ეტაპი',
1:'კლინიკის სრული სისტემა. <em>AI თქვენი არჩევანით.</em>',
3:'კლინიკის ყველა პროგრამა',
4:'თქვენზე მორგებული პროგრამები პაციენტის მიღებიდან ანგარიშსწორებამდე.',
5:'ნახეთ პროგრამები',6:'არჩევითი დამატება',7:'ექიმი',8:'მონაცემების შეფასება',10:'კოდების შემოწმება',12:'ცვლების დაგეგმვა',14:'მარაგის პროგნოზი',16:'მაჩვენებლების ანალიზი',17:'პაციენტები',18:'ინფორმაციის ახსნა',
19:'AI თქვენი გუნდისთვის',20:'ეხმარება ჩანაწერების მომზადებაში, მონაცემების გადამოწმებასა და რუტინულ საქმეებში.',21:'ნახეთ AI ფუნქციები',
24:'კლინიკის მუშაობას დაგეგმავს და ნებადართულ ამოცანებს თავად შეასრულებს.',25:'ნახეთ სამომავლო გეგმა',
27:'პირველივე ეტაპზე იღებთ კლინიკის სრულფასოვან სისტემას. AI-ის დამატებას თქვენ ირჩევთ.',
28:'კლინიკისთვის საჭირო ყველა პროგრამა',29:'მკურნალობა და მართვა',
30:'სამედიცინო ჩანაწერები, ლაბორატორია, რადიოლოგია, ფინანსები და სხვა საჭირო მოდულები ერთ სისტემაში.',
31:'ინფორმაცია ერთ სისტემაში',32:'განყოფილებები ერთ სისტემაში მუშაობს. პაციენტის ჩანაწერები, მომსახურება და ხარჯები ერთმანეთთანაა დაკავშირებული.',
33:'თქვენს მუშაობაზე მორგებული',34:'სისტემას თქვენს სამუშაო პროცესებს ვარგებთ და საჭირო ფუნქციებს ვამატებთ. ყველა მოდულს ერთი საერთო კოდი აქვს.',
35:'პირველივე ეტაპზე კლინიკის სრულფასოვან სისტემას იღებთ. სამედიცინო მონაცემები საერთაშორისო FHIR R4 სტანდარტს შეესაბამება. ყველა მოდულს პროგრამის საერთო კოდი აერთიანებს. AI ფუნქციების დამატებას თქვენთან ცალკე ვათანხმებთ.',
36:'უკვე შექმნილი AI ინსტრუმენტები',37:'კარნახით ჩანაწერის მომზადება',38:'კლინიკური ასისტენტი პაციენტის მონაცემებით',39:'სისხლის გაზების ანალიზის შედეგების ახსნა',40:'პაციენტისთვის სამოქმედო გეგმის მონახაზი',
41:'ეს ინსტრუმენტები უკვე შექმნილია. მათ ხელმისაწვდომობას, დანერგვასა და შემოწმებას თქვენი კლინიკისთვის ცალკე ვათანხმებთ.',
42:'AI-ის განვითარების სხვა მიმართულებები',43:'დოკუმენტების მომზადება',44:'კარნახით ჩანაწერი<br>გაწერა და პაციენტის გადაბარება',45:'დახმარება ექიმისთვის',46:'ისტორიისა და კვლევების განხილვა<br>წამლები და გაიდლაინები',
48:'კოდებისა და მოთხოვნების შემოწმება<br>ანაზღაურების საბუთების გადამოწმება',49:'კადრები და მარაგები',50:'ცვლების დაგეგმვა<br>მარაგის საჭიროების პროგნოზი',51:'მუშაობის ხარისხი',52:'მაჩვენებლებისა და რისკების ანალიზი<br>საყურადღებო ცვლილებების გამოვლენა',53:'კვლევები და პაციენტები',54:'შესაფერისი კლინიკური კვლევის მოძებნა<br>ინფორმაციის პაციენტისთვის ახსნა',
55:'ამ მიმართულებებში ფუნქციებს ეტაპობრივად ვამატებთ და ცალ-ცალკე ვამოწმებთ. ყველა ჩამოთვლილი ფუნქცია ჯერ დანერგილი ან კლინიკურად შემოწმებული არ არის. AI-ის დამატება არჩევითია. ფუნქციებს, ხელმისაწვდომობას, შემოწმებასა და ფასს ცალკე ვათანხმებთ.',
56:'თქვენი კლინიკისთვის ჩვენ ვქმნით და ვნერგავთ.',57:'იცის, როგორ მუშაობს თქვენი კლინიკა',
58:'ერთად იყენებს პაციენტების მონაცემებს, კლინიკის პროტოკოლებსა და ინფორმაციას სამუშაო პროცესებისა და რესურსების შესახებ.',
59:'იღებს გადაწყვეტილებას და მოქმედებს',60:'სამედიცინო და ადმინისტრაციულ გადაწყვეტილებებს თავად მიიღებს და მათ შესაბამისად იმოქმედებს.',
62:'მართავს კლინიკის ყოველდღიურ მუშაობას',63:'რისკებს წინასწარ შეაფასებს, გუნდების მუშაობას შეათანხმებს და დავალებების შესრულებასა და შედეგებს შეამოწმებს.',
64:'ამ მიზანზე ვმუშაობთ. კლინიკაში გამოყენებამდე თითოეული ფუნქცია უნდა შეიქმნას და კლინიკურად შემოწმდეს. წინასწარ ვთანხმდებით, რომელი გადაწყვეტილების მიღება და რომელი მოქმედების შესრულება შეეძლება სისტემას. დანარჩენ საკითხებზე გადაწყვეტილებას თქვენი უფლებამოსილი გუნდი მიიღებს.'
}
en={
0:'THREE STAGES FOR YOUR HOSPITAL',1:'A complete hospital system. <em>Optional AI, step by step.</em>',3:'All your hospital software',4:'Tailored to your hospital, from admission to billing.',5:'Explore the software',6:'Optional addition',7:'Doctor',8:'Data review',10:'Code checks',12:'Shift planning',14:'Stock forecasts',16:'Performance analysis',17:'Patients',18:'Patient explanations',19:'AI for your team',20:'Help with drafting records, checking information and routine work.',21:'Explore AI features',24:'It will coordinate hospital operations and carry out authorised tasks.',25:'Explore the future plan',27:'You receive a complete hospital system at the first stage. You choose whether to add AI.',28:'All the software your hospital needs',30:'Medical records, laboratory, imaging, finance and other required modules in one system.',31:'Information in one system',32:'Departments work in one system, with patient records, services and costs connected.',34:'We tailor the system to your workflows and add the functions you need. The modules share one codebase.',36:'AI tools already built',37:'Draft records from dictation',39:'Explain blood-gas results',42:'Further AI development directions',43:'Document preparation',44:'Dictation to records<br>Discharge and patient handover',45:'Help for doctors',46:'History and test-result review<br>Medicines and guidelines',48:'Coding and claims checks<br>Reimbursement documentation checks',49:'Staff and stock',50:'Shift planning<br>Stock-demand forecasting',51:'Quality of work',52:'Performance and risk analysis<br>Identifying changes needing attention',53:'Research and patients',54:'Find suitable clinical trials<br>Explain information to patients',57:'Understands how your hospital works',58:'Uses patient data, hospital protocols, workflows and resource information together.',59:'Makes decisions and acts',60:'It will make medical and administrative decisions and act on them.',62:'Manages daily hospital operations',63:'It will anticipate risks, coordinate teams and check task completion and outcomes.'
}
pattern=r'(<span class="lang-en"[^>]*>)(.*?)(</span>\s*<span class="lang-ka"[^>]*>)(.*?)(</span>)'
changes=[];counter=[0]
def rewrite(m):
 i=counter[0];counter[0]+=1
 new_en=en.get(i,m[2]);new_ka=ka.get(i,m[4])
 if new_en!=m[2] or new_ka!=m[4]:changes.append({'index':i,'en':[m[2],new_en],'ka':[m[4],new_ka]})
 return m[1]+new_en+m[3]+new_ka+m[5]
sec=re.sub(pattern,rewrite,sec,flags=re.S)
assert counter[0]==66,counter
s=s[:a]+sec+s[b:]
j=root/'deck-assets/hospitals-roadmap.js';js=j.read_text();(out/'before-roadmap.js').write_text(js)
jpairs=[("['Complete system', 'ერთიანი სისტემა']","['All your hospital software', 'კლინიკის ყველა პროგრამა']"),("['AI for every team', 'AI ყველა გუნდისთვის']","['AI for your team', 'AI თქვენი გუნდისთვის']"),("['Assistants', 'ასისტენტები']","['AI tools', 'AI ინსტრუმენტები']")]
for old,new in jpairs:
 assert js.count(old)==1
 js=js.replace(old,new)
j.write_text(js)
s,n=re.subn(r'(hospitals-roadmap\.js\?v=)[^"\s]+',lambda m:m[1]+hashlib.sha256(j.read_bytes()).hexdigest()[:10],s);assert n==1
h.write_text(s)
(out/'rewrites.json').write_text(json.dumps({'html':changes,'js':jpairs},ensure_ascii=False,indent=2))
print(f'Rewrote {len(changes)} bilingual passages across the slide and its three detail panels; kept availability and scope limits.')
