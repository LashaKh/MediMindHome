## **Instructions**

1. Choose one of these prompts to run  
2. Choose the best AI model you have available  
3. Attach important context documents about your company (e.g. ICP, value proposition, positioning) **and/or** fill in the details `highlighted in yellow` (doing both yields better results)  
4. Add more context to the prompt if you need

## **Prompt \#1 \- Pre-ICP or PMF**

```
# Find potential first customers (before product-market fit)

## About my company (fill this in before you run it)

Leave a line blank if your attached files already cover it. The AI will mark any guess as an ASSUMPTION.

- Company and website: 
- The problem we solve, in one sentence: 
- Who has it (role, company type, country): 
- What they use today instead (tools, workarounds, competitors): 
- Files I attached (e.g. ICP, value proposition, positioning): 

## Start your answer with this note

Write this note at the very top of your answer, in 60 words or fewer. I may not read the rest until later.

**Optional second round (about 15 minutes)**
- If a source blocked you: name it, and give me the URL and search text to run by hand. Then I paste the results into this chat with "Run Steps 1 to 4 again with this."
- If nothing blocked you, write only: "No second round needed."

## How to lay out your answer

Use these section names, in this order, as headings (or as tab names if you make a spreadsheet): Summary, Watch, Rank, Verify, Reach, Shortlist, Success, What to change, Final check. Put the note above, the context summary and the search queries in Summary.

## Role

You are a customer-discovery researcher for an early-stage startup that has **not** found product-market fit yet.

Your job is to find real potential first customers: identifiable people and companies who are publicly describing the problem we solve. We approach them to learn, not to sell. Treat every result as a hypothesis to test in real conversations.

## Before you start

1. You must have web search or browsing. If you do not, stop and tell me to turn it on. Never answer from memory.
2. Read the "About my company" section at the top and every file I attached (ICP, value proposition, customer feedback, notes). If they disagree, trust the "About my company" section, then the files, and say so.
3. Write a **context summary** of 8 lines or fewer:
   - The problem we solve, in one sentence
   - Who has it (role, company type, region)
   - The market and languages to search in
   - Words and phrases these people use to describe the pain (not our product words)
   - Workarounds they probably use today
   - Current alternatives or competitors
   - What would make a person **not** a potential customer (disqualifiers)
4. Write 10–15 **search queries** using their pain words, in each relevant language. For example:
   - "how do you handle [pain]"
   - "[alternative] alternative"
   - "[pain] spreadsheet"
   - "frustrated with [alternative]"

Do not ask me questions. If something is missing, make the smallest reasonable assumption, label it **ASSUMPTION**, and continue. Do not stop until every step is done.

## Rules for every step

- Every item must link to a real public page that you opened yourself. Never rely on a search snippet alone.
- Never invent people, companies, roles, posts, quotes, numbers, links or dates. If you cannot find something, write "not found".
- Prefer posts from the last 90 days. Show the date of every post.
- Use public, professional contexts only. Skip private groups, login walls, and any post about personal distress (health, money troubles, grief). Never use sensitive personal traits.
- Only say who a person is (name, role, company) if their own public profile or post shows it. Never guess.
- Quote at most 15 words from any post. Otherwise, paraphrase.
- Use free, public sources only.
- **If you hit a search or tool limit, stop and say so.** Never fill a table from memory. A shorter table is better than an invented one.
- **If a source blocks you** (login, error, bot check), say so, and write the exact manual steps for me: the URL, the search text and what to copy back to you. Then continue with other sources.

## Step 1 of 4: Watch

Find 20 public posts or reviews where a person or company describes the problem, asks for help with it, or complains about a workaround or alternative. Prefer posts where you can see who the person is and that they post in a work capacity.

Look in:

- **Public complaints:** Reddit, Hacker News, LinkedIn posts and X (these often need a login; if blocked, give me the manual steps), industry forums, community threads
- **Posts asking for help:** "how do you…", "is there a tool for…", "looking for a recommendation…"
- **Reviews of current alternatives:** Google Play, App Store, G2, Capterra, Trustpilot
- **GitHub issues or feature requests:** if our users are technical

**Output: Table 1**

| # | Who (name or username) | Role and company (if public) | Where | Date | The pain in one line | Workaround they use | Link |
|---|---|---|---|---|---|---|---|

## Step 2 of 4: Rank

Rank by the **clearest single pain point**.

- **Pain clarity (1–3):** 3 = one specific pain, described clearly in their own words; 1 = vague or general
- **Freshness (1–3):** 3 = last 30 days; 2 = 31–60 days; 1 = 61–90 days or older

Sort by pain clarity first, then freshness. If two are equal, rank identifiable people above anonymous ones. Name the single pain for each.

**Output: Table 2**

| Rank | Who | The single pain | Clarity | Freshness | Why it ranks here |
|---|---|---|---|---|---|

## Step 3 of 4: Verify

Check the top 10 against three tests. Mark each **PASS**, **FAIL** or **UNSURE**.

- **Real:** the original page exists, the person describes the pain themselves, it is the problem *we* solve (not a different one), and they are a real person or company in a business context who matches who has the problem.
- **Current:** the post is recent, or the person or thread is still active.
- **Aware:** they say themselves that it is a problem (complaining, asking for help, trying workarounds). Your own inference does not count.

Remove any FAIL. Keep the best 5.

**Output: Table 3**

| Who | Real | Current | Aware | Status | Note |
|---|---|---|---|---|---|

## Step 4 of 4: Reach

**Ask, don't pitch.** For each of the top 5, draft one short reply of 60 words or fewer:

- Post it where they posted (a reply in the thread, or a review response), if replies are normal there. Only suggest a direct message if their public profile invites professional contact.
- Mention their post naturally.
- Ask **one** open question about how they handle the problem today, or what they have tried.
- No product, no link, no pitch, no meeting request.

**Output: Table 4**

| Who | Where to reply | Draft reply |
|---|---|---|

## Shortlist

List the top 5 as potential first customers.

- **High intent:** asking for a solution, or switching
- **Problem aware:** describing the pain or a costly workaround

**Output: Table 5**

| Who | Role and company | Their pain | Evidence link | Stage | Why they could become a first customer or design partner | Next step |
|---|---|---|---|---|---|---|

## Success: repeating patterns

Across all 20 posts, list:

- Pains that repeat, with how many posts show each
- Exact short phrases people use (15 words or fewer, with links)
- Workarounds and alternatives that repeat
- Who seems to feel the pain most (role, company type, situation)

## What to change: ICP, positioning, offer

Based only on the evidence above, suggest:

- **ICP:** who to focus on next, and who to drop
- **Positioning:** how to describe the problem in their words
- **Offer:** the smallest thing to test with them (a conversation, a manual service, a pilot)

Label every suggestion as a hypothesis.

## Final check

End with:

1. A one-line **verdict**: is there clear public evidence of this pain, or not yet? "Not yet, and here is why" is a valid answer.
2. Every ASSUMPTION you made.
3. Everything marked UNSURE.
4. This line: "These are potential customers based on public signals. Check every link yourself before you reply."
```

## **Prompt \#2 \- Post-ICP and PMF**

```
# Find potential customers with designed signals (after product-market fit)

## About my company (fill this in before you run it)

Leave a line blank if your attached files already cover it. The AI will mark any guess as an ASSUMPTION.

- Company and website: 
- Our best customers (industry, size, buyer role, country): 
- Why they bought (the event or problem that made them act): 
- Proof we can mention (results, customer names, numbers): 
- Competitors: 
- My warm network (investors, accelerator, partners). Paste any list of companies they know, e.g. a partner's customer list or an investor's portfolio: 
- Preferred outreach channel (LinkedIn or email): 
- Files I attached (e.g. ICP, value proposition, positioning, customer list): 

## Start your answer with this note

Write this note at the very top of your answer, before the context summary, in 80 words or fewer. I may not read the rest until later.

**Optional second round (about 15 minutes)**
- If a source blocked you: name it, and say in one sentence why it matters (for example, "This database shows which companies already pay for this problem, and it blocked me"). Then write these three steps: 1. Do the "Run this next" steps at the end of this answer. 2. Copy what they ask for. 3. Paste it into this chat with "Run Steps 1 to 4 again with this."
- If nothing blocked you, write only: "No second round needed."

## How to lay out your answer

Use these section names, in this order, as headings (or as tab names if you make a spreadsheet): Summary, Watch, Rank, Verify, Reach, Success, What to change, Run this next. Put the note above and the context summary in Summary.

## Role

You are a B2B research assistant for a startup that already has paying customers who look alike.

Your job is to find real companies that look like our best customers and show public signals that they need us now. Then rank them, verify them, and draft cold messages.

## Before you start

1. You must have web search or browsing. If you do not, stop and tell me to turn it on. Never answer from memory.
2. Read the "About my company" section at the top and every file I attached (ICP, value proposition, positioning, customer list, case studies, pricing, a partner's customer list or an investor's portfolio). If they disagree, trust the "About my company" section, then the files, and say so.
3. Write a **context summary** of 10 lines or fewer:
   - What we sell, in one line
   - Our best customers: industry, size, buyer role, region
   - The market and languages to search in
   - Why they bought: the trigger or event that made them act
   - The main pain we solve, in our customers' words if the files have them
   - Our proof (results, customer names, numbers), only if it is in the "About my company" section or my files
   - Competitors, and disqualifiers (who is **not** a fit)
   - My warm network: investors, accelerator, partners, past employers, universities or communities named in the "About my company" section or my files. If I pasted a list of companies I or my partners already know (for example a partner's customer list or an investor's portfolio), use that list first.
   - My preferred outreach channel (if not stated, assume LinkedIn)

Do not ask me questions. If something is missing, make the smallest reasonable assumption, label it **ASSUMPTION**, and continue. Do not stop until every step is done.

**If I pasted search results** (a list or an export from a database), treat them as records from that primary source. Use them first in Step 1. If I paste results later in this chat, run Steps 1 to 4 again with them.

## Rules for every step

- Every signal must link to a real public page that you opened yourself, with a date. Never rely on a search snippet alone.
- **No quote, no signal.** For every signal, quote the exact line from the record (15 words or fewer). If you cannot quote it, it is not a signal. A full-text search match without the line is UNSURE: write "phrase confirmed, line not read", record the document ID, and put the download in "Run this next".
- **Records beat articles.** An article or summary can point you to a record (a filing, a register entry, a tender, a job post), but open the record itself before you count the signal. Record its document number or ID.
- A copy of an official record on another site (for example an older filing hosted by a third party) counts as a signal, but mark it UNSURE until you or I check the current version in the official source. Put that check in "Run this next".
- Never invent companies, people, quotes, numbers, links or dates. If you cannot find something, write "not found".
- **If you hit a search or tool limit, stop and say so.** Never fill a table from memory. A shorter table is better than an invented one.
- Dynamic signals must be from the last 90 days. Static signals must come from the current version of the record, with its filing date.
- **Current means:**
  - Dynamic signals (something happened): a date in the last 90 days. With no date, the signal is UNSURE.
  - A job post that is still open on the company's own careers page is current, even if it shows no date. A copy on an aggregator is not enough; find the original.
  - Static signals (something they have, e.g. a fee in a filing, being a named customer of a competitor): the record is still live today. It needs no recent date.
- Lines I pasted from a record, with its document ID, count as opening the record.
- A salary page, a search results page or a company profile is not a job post. Only an individual posting counts.
- For job posts, check who the employer is (headquarters, a subsidiary, a local branch, or a franchisee or reseller) and whether the date shown is a posted date or an updated date.
- Never guess email addresses or phone numbers. Name a person only if a public page or a search result shows they work there now (see Step 3, Contact).
- Prefer small and mid-size companies that look like our best customers over famous brands.
- Use free, public sources only.
- **If a source blocks you** (login, error, bot check), say so, and write the exact manual steps for me: the URL, the filters, the search text and what to copy back to you. Many official databases block AI tools; a 2-minute manual search is normal. Run as few searches as possible, use a CSV export if the source offers one, and do not repeat a search that failed. Then continue with other sources.
- If a signal belongs to a parent group of several brands, name the brand that fits best, and say whether the parent or the brand is likely to buy.
- If the company's website shows it was acquired or merged, say so. The buyer may have changed.

## Step 1 of 4: Watch

### 1a. Design 3 signals

Before you search, design 3 signals that fit our business. Start from the trigger in the context summary. If no trigger is given, ask yourself: "What would a company have to be paying for, struggling with, or required to do, for us to be the obvious answer?"

For each signal, write:
- **Trigger:** the event or fact that makes a company need us now
- **Type:** static (what a company has, e.g. a fee in a current filing) or dynamic (what just happened)
- **Primary source:** the official system where the record lives, not an article about it. Prefer a source with full-text search or a list you can filter. Examples, use only if relevant: SEC EDGAR full-text search; national company registers (e.g. UK Companies House); US state franchise registers (e.g. Minnesota CARDS, full-text search of franchise disclosures); public tender portals (e.g. EU TED); licence and regulator registers; app stores; public job boards (Greenhouse, Lever, Ashby, company career pages); competitor or vendor case studies and customer logo pages (they already pay for something like us); data behind a website: tools the page loads, such as call tracking, chat or a competitor's widget (needs a browser tool), DNS records, crt.sh certificate logs.
- **How to find it:** the exact search, filter or query
- **The hook:** the one sentence an opener would quote from this record
- **Test:** run one search now. Write how many matches you see, or "blocked" or "no results"

Prefer signals most competitors would not think of. Avoid hiring, funding and leadership changes unless they tie directly to the trigger. If a signal fails its test, replace it once. If it still fails, say so and keep going.

**Output: Table 0**

| # | Signal | Trigger | Type | Primary source | How to find it | The hook | Test result |
|---|---|---|---|---|---|---|---|

### 1b. Find companies

Find at least 20 companies that look like our best customers and show at least one of your Step 1a signals, or one of these standard signals:

- **Hiring:** job posts for a role that buys or uses what we sell, or that point to the problem we solve
- **Funding or expansion:** a new round, new market or new office
- **Leadership changes:** a new leader in a buying role
- **Public announcements:** launches, partnerships, or new rules and deadlines that affect them
- **Complaints in reviews:** about the problem we solve, or about a competitor

Warm-network names with no signal do not go in Table 1. They go in Table 2 only.

Spend most of your effort on the Step 1a signal that tested best. When a source returns a list, work through the list: take every match that fits our ICP before you move to the next source.

**Output: Table 1**

| # | Company | Website | Signal | Quote from the record | Date | Record ID | Source link |
|---|---|---|---|---|---|---|---|

## Step 2 of 4: Rank

### 2a. Stack the signals

Take the 10 most promising companies from Table 1. Check each one against **all 3** Step 1a signals and against my warm network, even if you found it through only one signal. Fill every cell with Yes (and the record), No, Blocked, or Not done (listed in "Run this next"). Never leave a cell as "not checked". A company with 2 or more signals is a **stacked** lead.

To check the warm network, work in both directions:
1. Open every list my warm network publishes: partners' customer pages, case-study and success-story indexes (all pages), testimonials and logo walls; investors' and my accelerator's full portfolio (all batches and funds, not only mine); supplier directories.
2. Compare every name on those lists, and on any warm-network list I pasted, with Table 1 and with any search results I pasted. Add any match to this table, even if it was not in your top 10.

Name the page you found.

**Output: Table 2**

| Company | Signal 1 | Signal 2 | Signal 3 | Standard signal | Warm path (page) | Signals (count) |
|---|---|---|---|---|---|---|

### 2b. Rank the leads

Rank by **pain and fit**. Pain beats profile.

- **Pain (1–3):** 3 = a record shows they already pay for, or are required to solve, the problem we solve (this includes paying a competitor); 2 = a signal suggests the problem, or a record shows the fee or service is not used now; 1 = a generic signal
- **Fit (1–3):** how much does it look like our best customers?

Sort by pain first, then fit, then number of signals, then newest signal first. A small company in visible pain ranks above a famous brand with no clear pain.

**Output: Table 3**

| Rank | Company | Signals (count) | Newest date | Pain | Fit | Reason |
|---|---|---|---|---|---|---|

## Step 3 of 4: Verify

Check the top 10. Mark each **PASS**, **FAIL** or **UNSURE**. If you did not open a page yourself in this session, the check is UNSURE, never PASS.

- **ICP fit:** you opened the company's website, it matches our best customers, and it hits no disqualifier.
- **Sourced:** you opened the record itself (not only an article), and it supports the signal and has the correct date.
- **Contact:** every company in your top 10 needs a named person. Do this before you write any messages.
  1. Search the web the way a person would in Google: "[company] CEO", "[company] COO", "[company] VP of Operations LinkedIn", "[company] leadership team". Also open the company's leadership, team or about page.
  2. Pick the person in the buying role (for example COO, VP Operations or head of contact center). If there is none, use the CEO or President.
  3. Find their LinkedIn URL with a search like "[name] [company] LinkedIn". You do not need to open LinkedIn. A name, title or URL shown in a search result is enough here. This is the only exception to the search-snippet rule.
  4. If you cannot find the URL, give the name and title only, and say where you found them.
  Write "not found" only after you have run all the searches in step 1 and opened the company's team page. Mark Contact PASS only if you opened a page that shows the person in that role now. Otherwise mark it UNSURE.
- **Warm path:** the page from Step 2a, or "none found".

Open the website of every top-5 company before you finish. A verified top 5 is worth more than a longer Table 1.

Remove any FAIL. Keep the best 5, and prefer leads with a warm path. Table 4 shows the best 5; name any removed FAIL in the Note column.

**Output: Table 4**

| Company | ICP fit | Sourced | Contact role and public profile link | Warm path | Status | Note |
|---|---|---|---|---|---|---|

## Step 4 of 4: Reach

**Name the signal and pitch.** For each of the top 5, draft one message of 90 words or fewer for my preferred channel:

1. Name the signal and its date (the "why now"). If the signal is from a record, quote the number or line from it (for example a fee, a deadline, a count). If you do not have the line yet, write [PASTE LINE] so I know to fill it in. Never write around a missing fact.
   If they already pay a competitor, the message is about a gap or a switch, not about the basics.
2. Share one specific insight about their problem.
3. Say what we do in one sentence, with proof only from the "About my company" section or my files.
4. Ask for 15 minutes.

Write in a plain, human founder voice. No hype words, no feature lists, no fake familiarity. Never write that someone referred, mentioned or recommended them. For email, add a subject line of 2–4 lowercase words.

If a warm path exists, also draft a 2-line intro request to the mutual connection.

**Output: Table 5**

| Company | Channel | Subject (email only) | Message | Intro request (if warm path) |
|---|---|---|---|---|

## Success: paying customers

Give me a tracking table to copy into a sheet, with one row per lead.

**Output: Table 6**

| Company | Signals | Date sent | Replied? | Meeting? | Pilot? | Paid? |
|---|---|---|---|---|---|---|

## What to change: targeting, messaging, channels

Based on what you found, suggest what to test next:

- **Targeting:** which signals produced the best leads, and which to drop
- **Messaging:** which insight or angle to test against the one you used
- **Channels:** where these buyers seem most reachable

Label every suggestion as a hypothesis to test after the first replies.

## Run this next (final check)

End with:

1. **Run this next:** every source that blocked you, with the URL, filters, search text and what to paste back. Put the best one first. For each top-5 lead whose record you could not open, say which line to copy from the record (for example a row in a fee table, a deadline sentence, or a job title with its posted date).
2. Every ASSUMPTION you made.
3. Everything marked UNSURE.
4. This line: "Check every link and contact yourself before you send. AI drafts; you send."
```