"""Create the three-page Block 2 sales workshop brief and verify its page count."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output/pdf/MediMind - Acquisition and Sales Foundation.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
FONT_DIR = Path("/System/Library/Fonts/Supplemental")
for name, filename in (("Body", "Arial.ttf"), ("BodyBold", "Arial Bold.ttf"), ("Display", "Georgia.ttf")):
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="BodyBold")
NAVY = colors.HexColor("#1a365d")
BLUE = colors.HexColor("#2b6cb0")
INK = colors.HexColor("#233248")
MUTED = colors.HexColor("#53657a")
LINE = colors.HexColor("#d7e2ef")
PALE = colors.HexColor("#edf5fc")
W, H = A4
M = 42
WIDTH = W - 2 * M


def p(text, size=10.2, leading=14, color=INK, bold=False):
    return Paragraph(text, ParagraphStyle("p", fontName="BodyBold" if bold else "Body",
                     fontSize=size, leading=leading, textColor=color, spaceAfter=0))


def heading(number, text):
    return [Spacer(1, 10), p(f"<font color='#2b6cb0'>{number}</font>  {text}", 13.2, 17, NAVY, True), Spacer(1, 7)]


def card(title, body, fill=PALE):
    inner = [p(title, 11.5, 15, NAVY, True), Spacer(1, 7), p(body, 10.4, 14.4)]
    t = Table([[inner]], colWidths=[WIDTH])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), fill),
                          ("LEFTPADDING", (0, 0), (-1, -1), 13),
                          ("RIGHTPADDING", (0, 0), (-1, -1), 13),
                          ("TOPPADDING", (0, 0), (-1, -1), 11),
                          ("BOTTOMPADDING", (0, 0), (-1, -1), 11)]))
    return t


def table(headers, rows, widths, size=9.6, leading=13):
    data = [[p(x, size, leading, NAVY, True) for x in headers]]
    data += [[p(x, size, leading) for x in row] for row in rows]
    t = Table(data, colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), PALE),
                          ("VALIGN", (0, 0), (-1, -1), "TOP"),
                          ("LEFTPADDING", (0, 0), (-1, -1), 8),
                          ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                          ("TOPPADDING", (0, 0), (-1, -1), 5),
                          ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                          ("LINEBELOW", (0, 0), (-1, -1), .5, LINE)]))
    return t


TITLES = ["Acquisition & sales foundation", "Outreach that opens a conversation", "Turn a conversation into a real test"]
SUBTITLES = ["A realistic first-month plan for hospitals beyond the anchor partner.",
             "Ready-to-adapt drafts. One clear next step; no pressure to switch.",
             "A 25-minute discovery call, followed by a clear decision and owner."]


def decorate(c, doc):
    page = doc.page
    c.setTitle("MediMind | Acquisition & Sales Foundation | Block 2")
    c.setAuthor("MediMind")
    c.setSubject("Lead generation, initial lead sources, outreach drafts and discovery script")
    c.setFillColor(NAVY)
    c.setFont("BodyBold", 17)
    c.drawString(M, H - 40, "MediMind")
    c.setFont("Body", 8.5)
    c.setFillColor(MUTED)
    c.drawRightString(W - M, H - 39, "BLOCK 2  /  02 OCTOBER 2026")
    c.setStrokeColor(LINE)
    c.line(M, H - 52, W - M, H - 52)
    c.setFont("Display", 23)
    c.setFillColor(NAVY)
    c.drawString(M, H - 87, TITLES[min(page - 1, 2)])
    c.setFont("Body", 9.8)
    c.setFillColor(MUTED)
    c.drawString(M, H - 108, SUBTITLES[min(page - 1, 2)])
    c.line(M, 39, W - M, 39)
    c.setFont("Body", 8)
    c.drawString(M, 25, "MediMind  |  Team working brief - proposed plan, not reported results")
    c.drawRightString(W - M, 25, f"{page} / 3")
    c.setFont("Body", 7)
    c.drawString(M, 14, "Basis: Block 2 workshop slide, founder offer and existing MediMind marketing work.")


story = []
story += heading("01", "Lead generation plan: trust first, volume later")
story.append(p("<b>First buyer:</b> a Georgian private hospital/group leader with a recurring cross-team problem and staff willing to test an alternative. Sell the hospital-wide vision; agree a manageable first evaluation."))
story.append(Spacer(1, 9))
story.append(table(["Priority / channel", "Approach + weekly action"], [
    ["<b>1. Warm introductions</b>", "Ask clinicians, advisers and real professional contacts for a specific introduction. Confirm the relationship; do not imply an endorsement."],
    ["<b>2. Targeted founder outreach</b>", "Contact a researched hospital leader by work email or LinkedIn. Ask about one pain using the drafts on page 2."],
    ["<b>3. Follow-up + proof</b>", "Follow up personally with a relevant synthetic-data workflow example. Skip paid ads, purchased lists and broad campaigns for now."],
], [139, WIDTH - 139]))
story.append(Spacer(1, 9))
story.append(p("<b>Budget:</b> 5 team hours/week: research, introductions, outreach, follow-up and review - 1h each. Calls and engineering are additional. Founder owns conversations; a coworker can maintain the list."))

story += heading("02", "Initial lead list: build 15 accounts, not 150 names")
story.append(p("Prioritize <b>private multi-profile hospitals and groups with an accessible sponsor</b>. Rank warm access and a verified reason to talk above size. Several sites may share one buying decision."))
story.append(Spacer(1, 8))
story.append(table(["Where to start", "What to verify before calling it a lead"], [
    ["Founder / clinician network", "Name the hospital, connector and intended buyer. A connector is not automatically an internal champion."],
    ["Official hospital sites + professional profiles", "Confirm services, current leadership, buying group and work contact route. Never infer software problems from a website."],
], [174, WIDTH - 174]))
story.append(Spacer(1, 8))
story.append(p("<b>Four research seeds, not qualified leads:</b> "
    "<link href='https://newhospitals.ge/en' color='#2b6cb0'>New Hospitals</link>; "
    "<link href='https://ahtbilisi.com/en/' color='#2b6cb0'>American Hospital Tbilisi</link>; "
    "<link href='https://cmchospital.ge/en' color='#2b6cb0'>Caucasus Medical Centre</link>; "
    "<link href='https://toduaclinic.ge/en' color='#2b6cb0'>Todua Clinic</link>. "
    "Official sites checked 2 October 2026. Their pain, interest, access and purchasing independence are unconfirmed; deduplicate against existing relationships.", 9.4, 12.8))
story.append(Spacer(1, 8))
story.append(p("<b>One tracker row per buying organization:</b> hospital/group; source + date; fit evidence; buyer; connector; possible champion; pain (hypothesis or confirmed); stage; owner; last touch; next action + date.", 9.4, 12.8))
story.append(Spacer(1, 10))
story.append(card("30-day experiment - planning targets, not a forecast", "<b>Week 1:</b> verify 15 accounts and request 5 introductions. <b>Weeks 2-3:</b> send 10 tailored first messages, avoiding duplicate approaches; follow up and hold discovery calls. <b>Week 4:</b> aim to scope one evaluation.<br/><b>Learning targets:</b> 4 held discovery calls, 2 SQLs, 1 evaluation-ready hospital. Review what blocks progress; a completed test may fall outside this month."))
story.append(PageBreak())

story += heading("03", "Outreach content: three usable drafts")
story.append(p("Send personally, in the recipient's preferred language. If you add a hospital-specific opening, use only a fact you have checked. These are drafts for outreach, not messages that have been sent.", 9.8, 13.5, MUTED))
story.append(Spacer(1, 12))
story.append(card("A. Warm-introduction request - to a real connector", "Do you know a hospital CEO or operations leader whose team is doing too much work between disconnected systems?<br/>MediMind brings that work into one tailored, AI-assisted system. We build a parallel version free for their team to test, with no obligation to buy.<br/>Would you be comfortable introducing us for a 25-minute conversation?"))
story.append(Spacer(1, 12))
story.append(card("B. Direct email - subject: Test the alternative before you switch", "Is your team re-entering information, chasing updates or fixing gaps between hospital systems?<br/><br/>MediMind brings your hospital into one tailored system with AI tools in daily workflows. We build an agreed parallel version free, alongside your current system. Your team tests it before any obligation to buy.<br/><br/>For our next 10 hospital clients, we match their current software price when they switch, under agreed terms.<br/><br/>Could we spend 25 minutes next week choosing one workflow worth testing?"))
story.append(Spacer(1, 12))
story.append(card("C. Short message - LinkedIn or an existing business chat", "When hospital systems do not connect, staff become the connection. Does that sound familiar?<br/>We build a tailored, AI-assisted parallel system free. Test it before any purchase commitment; your current system stays in place.<br/>Open to a 25-minute call to see if this fits?"))
story += heading("", "A simple follow-up rhythm")
story.append(p("<b>Day 4:</b> \"Which would be more useful to improve first: repeated entry, chasing patient information, or billing corrections? If none is a priority, no problem.\"<br/><b>Day 10:</b> \"I will close the loop here. If a parallel comparison becomes useful later, reply and we can pick one workflow.\"<br/>Stop after a decline or opt-out. If they respond, follow the agreed next step rather than this schedule.", 10, 13.7))
story.append(Spacer(1, 10))
story.append(p("<b>Keep the offer accurate:</b> the next-ten-client offer is not a countdown. Record eligibility, matched cost items, duration and development scope in the proposal. Do not promise a launch date before readiness is checked, or proven revenue/clinical gains before they are measured.", 9, 12.2, MUTED))
story.append(PageBreak())

story += heading("04", "Discovery call script - diagnose before demonstrating")
story.append(table(["Time / purpose", "Questions to ask, in order"], [
    ["<b>0-2 min</b><br/>Set the frame", "\"Let's identify one problem worth testing in a free parallel system. No decision to switch today. What would make this call useful?\""],
    ["<b>2-8 min</b><br/>Find the real pain", "\"Describe the last difficult handoff between teams. Where did someone re-enter, call, wait or correct something? How often does it happen, and who deals with it?\""],
    ["<b>8-12 min</b><br/>Find impact + urgency", "\"What did that cost in staff time, delays or billing corrections? What have you tried? Why act now? What improvement would make a test worthwhile?\""],
    ["<b>12-17 min</b><br/>Map the buying path", "\"Who approves software, organizes testing and reviews clinical, finance and IT concerns? When does your contract renew? If the test works, how would budget and approval happen?\""],
    ["<b>17-22 min</b><br/>Check fit + explain offer", "\"We build a separate test free while yours stays in place, with no obligation to buy. Which workflow matters most? What cannot change? Who will test it and approve data use?\""],
    ["<b>22-25 min</b><br/>Agree the next step", "\"Have I understood the problem, desired improvement and constraints correctly? Shall we book a scoping session with your operations/clinical and IT owners? Who joins, and when?\""],
], [104, WIDTH - 104], size=9.8, leading=13.4))
story.append(Spacer(1, 10))
story.append(p("<b>Example test:</b> compare one task on comparable cases in both systems. Measure time, repeated entries and errors against a threshold agreed in advance. This does not prove clinical outcomes or revenue gains.", 9.7, 13.2))

story += heading("", "After the call: advance, nurture or disqualify")
story.append(p("<b>MQL:</b> fits the target, a relevant contact engages, and discovery/another meaningful next step is dated.<br/><b>SQL:</b> pain + reason to act, sponsor + approval path, internal owner, credible budget path, feasible scope and a dated planning step are confirmed.<br/><b>Not ready:</b> agree a specific follow-up trigger. <b>No fit:</b> close the lead with the reason; do not force a demo.", 9.8, 13.4))
story.append(Spacer(1, 10))
story.append(card("The handoff: interest is not permission to build", "<b>SQL → Evaluation-ready:</b> confirm scope, hospital testers, permitted data/access, security approvals, success criteria and dates. <b>Then:</b> build + internal checks → hospital hands-on test → joint results review → explicit buy / revise / stop decision. A purchase leads to a separately agreed rollout.<br/><b>Timing:</b> a two-week build is a planning target only after readiness and feasibility are confirmed - not two weeks from the first email."))
story.append(Spacer(1, 9))
story.append(p("<b>Measure the real milestone:</b> distinct new hospital buying organizations outside the anchor partner completing their first hands-on parallel-system evaluation session in the last 30 days. Track introductions, held calls, SQLs, readiness, build delivery and stalled days to explain that number.", 9.7, 13.2))

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=M, rightMargin=M,
                        topMargin=120, bottomMargin=51)
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
reader = PdfReader(OUTPUT)
assert len(reader.pages) == 3, f"Expected 3 pages, got {len(reader.pages)}; shorten content before publishing."
assert all(page.extract_text().strip() for page in reader.pages)
print(OUTPUT)
