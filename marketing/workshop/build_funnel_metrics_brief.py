"""Render the Block 3 funnel, dashboard and metric definitions as a short PDF."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output/pdf/MediMind - Funnel Metrics and Tracking.pdf"
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
GREEN = colors.HexColor("#eaf5ef")
W, H = A4
M = 42
WIDTH = W - 2 * M


def p(text, size=10, leading=13.6, color=INK, bold=False):
    return Paragraph(text, ParagraphStyle("p", fontName="BodyBold" if bold else "Body",
                     fontSize=size, leading=leading, textColor=color, spaceAfter=0))


def heading(text):
    return [Spacer(1, 11), p(text, 12.8, 16.5, NAVY, True), Spacer(1, 7)]


def card(title, body, fill=PALE):
    t = Table([[[p(title, 11.5, 15, NAVY, True), Spacer(1, 6), p(body)]]], colWidths=[WIDTH])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), fill),
                          ("LEFTPADDING", (0, 0), (-1, -1), 12),
                          ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                          ("TOPPADDING", (0, 0), (-1, -1), 10),
                          ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    return t


def table(headers, rows, widths, size=9.6, leading=12.7):
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


TITLES = ["Funnel, metrics & tracking", "A dashboard that tells us what to do", "Track the work. Keep the rules simple."]
SUBTITLES = ["From finding the right hospital to a real evaluation and a buying decision.",
             "A proposed structure - no live CRM data or performance figures are assumed.",
             "One shared tracker, milestone dates and a short weekly review."]


def decorate(c, doc):
    page = doc.page
    c.setTitle("MediMind | Funnel, Metrics & Tracking | Block 3")
    c.setAuthor("MediMind")
    c.setSubject("Hospital acquisition funnel, dashboard structure, KPI definitions and tracking rules")
    c.setFillColor(NAVY)
    c.setFont("BodyBold", 17)
    c.drawString(M, H - 40, "MediMind")
    c.setFont("Body", 8.5)
    c.setFillColor(MUTED)
    c.drawRightString(W - M, H - 39, "BLOCK 3  /  02 OCTOBER 2026")
    c.setStrokeColor(LINE)
    c.line(M, H - 52, W - M, H - 52)
    c.setFont("Display", 22)
    c.setFillColor(NAVY)
    c.drawString(M, H - 86, TITLES[min(page - 1, 2)])
    c.setFont("Body", 9.4)
    c.setFillColor(MUTED)
    c.drawString(M, H - 107, SUBTITLES[min(page - 1, 2)])
    c.line(M, 39, W - M, 39)
    c.setFont("Body", 8)
    c.drawString(M, 25, "MediMind  |  Team working brief - definitions and targets, not reported results")
    c.drawRightString(W - M, 25, f"{page} / 3")
    c.setFont("Body", 7)
    c.drawString(M, 14, "Basis: supplied Block 3 slide, Blocks 1-2 and the founder's parallel-evaluation offer.")


story = []
story += heading("01  The funnel: each step needs evidence")
story.append(card("Find the fit → earn trust → prove the alternative", "<b>Acquire:</b> Target + route in → MQL → SQL<br/><b>Prove:</b> Evaluation-ready → Parallel delivered → First hands-on test<br/><b>Convert:</b> Results review → Purchase agreement → Approved rollout"))
story.append(Spacer(1, 10))
story.append(table(["Stage", "What must be true before recording it", "Owner"], [
    ["<b>1. Target + route in</b>", "Hospital/group fits our focus. Map buyer, possible connector and contact route; direct outreach is also valid.", "Founder / researcher"],
    ["<b>2. Engaged / MQL</b>", "A relevant contact responds meaningfully and agrees to discovery or another dated next step.", "Founder"],
    ["<b>3. Qualified / SQL</b>", "Discovery confirms pain, reason to act, sponsor, approval/budget path, internal owner and feasible evaluation scope; next step dated.", "Founder"],
    ["<b>4. Evaluation-ready</b>", "Scope, testers, baseline, success criteria and dates agreed. Required data/security approvals complete and approved data access works.", "Hospital owner + IT + MediMind"],
    ["<b>5. Parallel delivered</b>", "Agreed scope passes internal checks. Test access and instructions reach the named hospital evaluators; existing system stays in place.", "MediMind delivery lead"],
    ["<b>6. First hands-on test</b>", "Hospital staff complete an agreed workflow in the parallel system and feedback is recorded. A founder-only demo does not count.", "Hospital champion + founder"],
    ["<b>7. Results reviewed</b>", "Compare against the agreed baseline; record gaps and a dated buy, revise or stop decision. A first test is not a passed evaluation.", "Buyer + evaluators"],
    ["<b>8. Purchase agreed</b>", "Authorized purchase agreement is signed, with scope, price and rollout terms. Invoice/payment is tracked separately.", "Buyer + founder"],
    ["<b>9. Approved rollout</b>", "Hospital accepts the go-live plan and agreed scope goes live. Training, support and cutover are handled as a separate delivery plan.", "Hospital + delivery lead"],
], [118, WIDTH - 208, 90]))
story.append(Spacer(1, 10))
story.append(p("<b>MQL</b> = marketing-qualified lead. <b>SQL</b> = sales-qualified lead. A connector opens the door; a champion organizes colleagues; a buyer approves spending. They need not be the same person.", 9.4, 12.7))
story.append(Spacer(1, 9))
story.append(p("<b>Branches:</b> no fit → closed with reason; not now → nurture with a review date; test gaps → revise and retest, or stop. Retests never create another first-test count. An introduction alone is not an MQL.", 9.4, 12.7))
story.append(PageBreak())

story += heading("02  The one metric that matters right now")
story.append(card("New hospitals completing their first real parallel-system test", "Count distinct new <b>hospital buying organizations outside the anchor partner</b> whose first hands-on test happened in the last 30 days.<br/>Why this one: it shows a hospital moved beyond interest, our team delivered, and its staff actually tried the alternative. It does <b>not</b> prove clinical benefit, a successful full evaluation or a sale.", GREEN))
story += heading("03  Dashboard layout - review every Monday")
tiles = []
for title, subtitle in [("FIRST REAL TESTS", "Last 30 days - main metric"),
                        ("EVALUATION-READY", "First became ready in last 30 days"),
                        ("PARALLEL DELIVERED", "First delivery in last 30 days"),
                        ("OVERDUE ACTIONS", "Open accounts needing attention now")]:
    tiles.append([p(title, 9, 12, NAVY, True), Spacer(1, 4), p("Not recorded", 15, 19, BLUE, True), p(subtitle, 8.5, 11.5, MUTED)])
grid = Table([[tiles[0], tiles[1]], [tiles[2], tiles[3]]], colWidths=[WIDTH / 2, WIDTH / 2])
grid.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE),
                         ("VALIGN", (0, 0), (-1, -1), "TOP"),
                         ("BOX", (0, 0), (-1, -1), 1, colors.white),
                         ("INNERGRID", (0, 0), (-1, -1), 5, colors.white),
                         ("LEFTPADDING", (0, 0), (-1, -1), 11),
                         ("RIGHTPADDING", (0, 0), (-1, -1), 11),
                         ("TOPPADDING", (0, 0), (-1, -1), 9),
                         ("BOTTOMPADDING", (0, 0), (-1, -1), 9)]))
story.append(grid)
story.append(Spacer(1, 8))
story.append(p("<b>Below the cards:</b> funnel by current stage → stuck-account list (blocker, owner, next action/date) → outcomes (reviewed, revised, stopped, signed). Show last-updated time. Unknown is not zero.", 9.6, 13))
story += heading("04  KPI definitions - tie every number to a stage")
story.append(table(["KPI / stage", "Definition and window", "Decision it supports"], [
    ["<b>First real tests</b><br/>Stage 6", "Distinct eligible organizations with first-test date in the rolling 30-day window.", "Are we winning real evaluations?"],
    ["<b>New SQLs</b><br/>Stage 3", "Distinct organizations first meeting every SQL criterion in the last 30 days.", "Is outreach finding a credible fit?"],
    ["<b>Evaluation-ready</b><br/>Stage 4", "Distinct organizations clearing all readiness gates in the last 30 days; retain data-access date separately.", "Are hospital-side approvals moving?"],
    ["<b>Parallel delivered</b><br/>Stage 5", "Distinct first deliveries in the last 30 days. Also report median calendar days from readiness to delivery; list open-build ages separately.", "Are we keeping our side of the offer?"],
    ["<b>7-day test uptake</b><br/>Stage 5 → 6", "Of first deliveries at least 7 days old, % first tested within 7 calendar days. Use a named delivery cohort; show n/N.", "Are hospital staff actually trying it?"],
    ["<b>Overdue actions</b><br/>Any open stage", "Open organizations whose next-action date has passed. Separately flag missing dates/owners. Snapshot, not a 30-day total.", "What needs attention this week?"],
    ["<b>Reviewed / signed</b><br/>Stages 7 / 8", "Separate counts of first results reviews and signed purchases in the last 30 days. Signed value is not cash collected.", "Do evaluations lead to a decision?"],
], [110, 277, WIDTH - 387], size=9.3, leading=12.4))
story.append(PageBreak())

story += heading("05  One shared tracker is enough to start")
story.append(p("Use one row and stable ID per <b>buying organization</b>, not per contact or demo. Centrally purchased sites count together. Keep the anchor partner and its expansion separate."))
story.append(Spacer(1, 9))
story.append(table(["Keep these fields", "What goes in them"], [
    ["<b>Account + route</b>", "ID; hospital/group; source (warm intro, direct outreach or inbound); connector; buyer; champion; internal owner; anchor/existing flag."],
    ["<b>Current work</b>", "Current stage; active/nurture/closed status; pain and fit evidence; blocker; next action + due date; responsible person."],
    ["<b>First milestone dates</b>", "MQL; SQL; approved data access verified; evaluation-ready; delivery; first hands-on test; first results review; signed agreement; go-live."],
    ["<b>Evidence + decision</b>", "Link to call note, approval, delivery checklist or test feedback. Record baseline, agreed success criteria, review outcome and reason for loss/delay."],
], [137, WIDTH - 137]))
story.append(Spacer(1, 9))
story.append(p("<b>Hospital commitment:</b> verify approved read-only backup access or the agreed data route works. Access alone is <b>not</b> readiness or evaluation. Store approval references, never credentials or patient data, in this tracker.", 9.7, 13.2))
story += heading("06  Counting rules that prevent misleading numbers")
story.append(p("<b>Dates:</b> latest 30 calendar dates, including today, in Asia/Tbilisi; timestamp the report. Count each first milestone once; preserve dates when accounts pause.<br/><b>Do not mix:</b> current-stage counts are a snapshot; milestone counts measure progress during a period.<br/><b>Conversion:</b> use deliveries from the same named week, not unrelated monthly totals. Once every delivery has had 7 days, calculate tests within 7 days / all deliveries in that group. Show n/N, %, and cohort dates. Zero denominator = N/A; immature groups = pending.", 9.8, 13.5))
story += heading("07  Timing: start the clock when the hospital is ready")
story.append(card("Proposed working targets - not a universal launch guarantee", "<b>Ready → delivered:</b> aim for 14 calendar days after all readiness gates pass and scope/feasibility are confirmed.<br/><b>Delivered → first hospital test:</b> aim for the next 7 calendar days. Book the session before delivery.<br/><b>Combined goal:</b> first real test within 21 days of readiness. Track elapsed time and blockers; never rush approvals to meet the date."))
story.append(Spacer(1, 9))
story.append(p("<b>Block 2's first-month targets:</b> 4 held calls, 2 SQLs, 1 ready hospital - not reported results. A first test may fall next month. Establish a baseline before setting a recurring volume target.", 9.6, 13))
story += heading("Weekly review: 15 minutes, three decisions")
story.append(p("<b>Founder:</b> update conversations and next steps. <b>Delivery lead:</b> verify readiness, delivery and test evidence. <b>Tracker owner:</b> refresh the dashboard.<br/>Ask: Where did progress stop? Who owns the next action and date? What did hospital testing prove - and what still needs work? Record one corrective action for the biggest bottleneck.", 9.7, 13.2))

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=M, rightMargin=M,
                        topMargin=120, bottomMargin=51)
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
reader = PdfReader(OUTPUT)
assert len(reader.pages) == 3, f"Expected 3 pages, got {len(reader.pages)}. Adjust layout before publication."
assert all(page.extract_text().strip() for page in reader.pages)
print(OUTPUT)
