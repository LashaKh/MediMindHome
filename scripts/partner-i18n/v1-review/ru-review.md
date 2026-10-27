# RU copy review — partner-i18n.js (`ru` dictionary)

Scope: 348 `ru` keys checked against `en`. Key parity is clean (no missing/extra keys). HTML tags identical in every fix. 63 keys changed; the rest read as native copy and were left alone.

Severity: **M** = meaning / factual, **A** = ambiguity or calque a native reader stumbles on, **G** = grammar / punctuation, **S** = style polish (safe to skip).

## Changes

- **of.u5** — M: RU added «и русском» (support in Russian); EN and KA both say support in Georgian only. Matched to EN. Confirm with the founder before shipping either way.
- **ai.foot** — M: «оценивается отдельно» reads as "evaluated separately" (and «оценка» = the parallel evaluation in this deck); EN says *priced* separately. Now «Объём и цена согласовываются отдельно», same wording as f.2b. Also «проведённом в каждый кабинет» → plain «которое уже есть в каждом кабинете».
- **ai.8** — M: «готовые апелляции» overclaims (ready vs. *drafted*); now «черновики апелляций».
- **ai.10** — M: «Честные смены» = *honest* shifts; "fair" is «справедливые».
- **t.iB** — M: the "scaling … now scaling care" parallel was lost; restored «масштабировал продукт … Теперь масштабирует медицину».
- **wr.closer** — A: «Мы делаем уход лёгким» reads as "we make nursing care easy" in a hospital («уход» = patient care). Now «От нас легко уйти — …».
- **f.1b** — A/G: «Старый набор программ заменяет одна система» is genuinely ambiguous (who replaces whom). Rebuilt around «Вместо старого набора программ — одна система…»; «бизнес-работы» → «бизнес-задач».
- **p.5b** — A: «проверяют её» — «её» can point to «оценка» or «вашей системой», both feminine; now «проверяют нашу в реальной работе». «Никаких обязательств купить» → «Без обязательства купить».
- **a2.1b** — A: «запись пациента» also means "patient's appointment"; now «картой пациента», matching a2.1t «Одна карта».
- **w.r3** — A: «счёт: платный, с задержкой или с отказом» (an invoice "with refusal") is a calque; now «оплатите, подождёте или получите отказ».
- **p.4b** — A: «уравниваем цену с расходами» is stiff; now «Наша цена равна вашим текущим расходам на ПО — для согласованного объёма».
- **a3.p1** — A: same «уравниваем» fix; also removes the double «для … для».
- **a3.h1** — A: «Что уравнивается» is not something a CFO says; now «Какая цена, что включено и что — нет».
- **ch.3b** — A: «Один ввод питает всё» ("feeds") and «погони по телефону» ("phone chasing") are calques; now «Один ввод — данные везде. Ни перепечатки, ни выяснений по телефону».
- **ch.3t** — A: «Меньше рук на бумагах» is a calque of "fewer hands"; now «Меньше людей в бумагах» (+1 char).
- **s.r2** — A: «врач, который к нему прикасается» is physical "touches him"; now «который с ним работает».
- **ch.1b** — A: «фиксируется» = recorded, EN says *billed*; now «попадает в счёт в момент оказания».
- **pr.sub** — A: «задача … происходит» (a task doesn't "happen"); now «Всё, что делает ваша клиника, происходит в одном месте».
- **f.rail** — A: «FHIR R4 под всем» is word-for-word "under everything"; now «в основе всего».
- **f.sub** — A: «администрирование» reads as sysadmin work; now «административную работу». «Именно туда мы идём» → «К этому мы и идём».
- **f.2b** — A: «Голос в документацию» → «Документация голосом».
- **pr.c15** — A: «Голос в запись — AI-скрайб» → «AI-скрайб: запись голосом».
- **a2.5b** — A: bare «Скрайб» → «AI-скрайб» (matches pr.c15; a reader may not know the word).
- **pr.spec** — A: «сосудистые отчёты» ("vascular reports") would make a vascular surgeon wince; now «протоколы сосудистых исследований» (+15 chars — the one fix that is clearly longer).
- **ai.4** — A: «поток коек» is a calque; «оборот коек» is the native hospital term, same length.
- **a3.n2** — A: «Сторонние позиции» → «Сторонние закупки».
- **a4.f1** — A: «интерфейсов на поддержке» (slang; «интерфейс» reads as UI); now «интеграций, которые нужно поддерживать».
- **a4.l5b / a4.f3** — A: «аудиторский след» → «журнал аудита», the standard IT term.
- **a4.l2b** — A: «AI-рассуждение по всей записи» → «AI-анализ всей истории болезни» (consistent with f.2b and the chosen term).
- **t.quote** — A: «„сброшенная“ в Грузию» with scare quotes → «завезённая в Грузию».
- **t.advK** — A: «ломают её и формируют» dangles; → «ломают и формируют её».
- **t.bK** — A: «Ресурсы, чтобы выполнить» (execute *what*?) → «…выполнить обещанное», matching t.h1 (+9 chars on a label).
- **pf.ref** — A: «Вас не просят быть первыми» (impersonal passive) and «референс-звонок» (startup jargon) → «Мы не просим вас быть первыми. Хотите — организуем вам звонок с GeoHospitals».
- **pf.l4** — A: «выездов на объект» sounds like a construction site → «выездов в клинику».
- **a2.4t** — A: «не замолкает» → «не обрывается».
- **a2.4b** — A: «ответственный и часы» ("a clock") → «ответственный и срок».
- **h.3t** — A: «проверяют на реальной работе» has no object → «проверяют систему в деле».
- **h.3b** — A: «Проведите … случай» → «Оформите один и тот же случай»; «измеримый выигрыш» → «измеримый эффект».
- **wr.sub** — A: «не писали на бумаге» → «не фиксировали на бумаге» (the idiomatic verb).
- **wr.3b** — A: trailing «…, в договоре» mimics EN; now «…цена зафиксирована на несколько лет — всё в договоре».
- **wr.label** — A: bare «Письменно» as a section label → «Письменные гарантии» (+10 chars; check layout).
- **of.label** — M (minor): "Reserved for" was dropped; «только для следующих 10 клиник», same length.
- **of.todayK / of.usK** — A: «деньги покупают» is a calque → «За что вы платите сегодня» / «Что вы получаете за те же деньги».
- **of.t5** — A: «Никакого AI нигде» → «Никакого AI — нигде».
- **of.t1** — S: «программа историй болезни» → «программа для историй болезни».
- **of.u4** — S: «Каждое обновление включено, автоматически» → «Все обновления включены — автоматически».
- **of.bandT** — A: «даже самая большая» (big idea = calque) → «даже самая масштабная».
- **n.thanks** — A: «Спасибо за ваше время» is a calque → «Спасибо за уделённое время».
- **n.cK** — G: «два удобных вам времени» is grammatical but odd → «два удобных варианта времени».
- **a1.label** — A: «директору» is ambiguous next to «Медицинскому директору» (a2); → «Владельцу и CEO» (RU already uses «CEO» in t.iR).
- **a1.r3** — A: «Деньги быстрее» → «Деньги приходят быстрее».
- **a1.c2** — A: «Платных доработок — никогда.» → «Никаких платных доработок — никогда.»
- **ai.label** — S: «по вашему слову» is archaic → «включается, когда скажете» (shorter; matches ai.foot).
- **ai.cB** — S: «обновляющиеся вместе с работой клиники» → «по ходу работы клиники».
- **s.r1t** — G: no comma after «Сегодня» in Russian.
- **a3.p3** — G: «только если» needs a comma; rebuilt as «Оплата начинается, только если вы переходите: после оценки, никогда до неё».
- **h.afterK** — G: conditional takes the future → «Если вы скажете «да»».
- **h.note** — G: «на всё время оценки» (duration needs «на»).
- **w.sub** — S: «не разговаривают друг с другом» → «не общаются между собой» (the usual phrase for systems).
- **p.label** — S: «Всё предложение — сразу» → «Все условия — сразу».

## Left as-is but worth a second look

- **c.chip4 / p.6t** «Ваши данные и код — письменно» — terse but mirrors EN/KA; «на бумаге» would carry a "only on paper" undertone, so not changed.
- **p.6b / wr.2t** «Эскроу исходного кода» — «эскроу» is known from banking; the formal contract term is «депонирование исходного кода». Keep for brevity unless legal readers object.
- **w.one** «Одна правда» — "one truth" is rhythm, not idiom; «единая версия правды» is the native phrase but longer. Left.
- **pf.f1** «в боевом режиме» — IT slang for "in production"; understood, slightly informal for a CEO.
- **ai.2** «Раннее предупреждение — за часы» — elliptical in both languages; left.
- **t.a1r / t.a2r** «Руководитель …» — a Russian reader expects «Заведующий отделением …», but the real org structure is unknown, so not retitled.
- **of.excl / a3.n1** «если и когда вы захотите» — mild calque of "if and when", acceptable in business Russian.
