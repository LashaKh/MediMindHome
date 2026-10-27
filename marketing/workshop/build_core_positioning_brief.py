"""Render the short, shareable Block 1 workshop brief. No external data calls."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output/pdf/MediMind - Core Positioning and Customer Brief.pdf"
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
GREEN = colors.HexColor("#22634d")
WIDTH, HEIGHT = A4
MARGIN = 42
CONTENT = WIDTH - 2 * MARGIN
C = canvas.Canvas(str(OUTPUT), pagesize=A4)
C.setTitle("MediMind | Core Positioning & Customer | Block 1")
C.setAuthor("MediMind")
C.setSubject("Workshop brief: value proposition, ideal customer, buyer personas, MQL and SQL")


def para(text, x, top, width, size=10.4, leading=14.2, color=INK, font="Body"):
    style = ParagraphStyle("p", fontName=font, fontSize=size, leading=leading,
                           textColor=color, alignment=TA_LEFT, spaceAfter=0)
    p = Paragraph(text, style)
    _, height = p.wrap(width, HEIGHT)
    p.drawOn(C, x, top - height)
    return top - height


def section(number, title, top):
    C.setFillColor(BLUE)
    C.roundRect(MARGIN, top - 20, 25, 20, 4, fill=1, stroke=0)
    C.setFillColor(colors.white)
    C.setFont("BodyBold", 9)
    C.drawCentredString(MARGIN + 12.5, top - 13, number)
    para(title, MARGIN + 35, top - 1, CONTENT - 35, 13.5, 17, NAVY, "BodyBold")
    return top - 30


def header(page, title, subtitle):
    C.setFillColor(NAVY)
    C.setFont("BodyBold", 18)
    C.drawString(MARGIN, HEIGHT - 44, "Medi")
    C.setFillColor(BLUE)
    C.drawString(MARGIN + pdfmetrics.stringWidth("Medi", "BodyBold", 18), HEIGHT - 44, "Mind")
    C.setFont("Body", 8.5)
    C.setFillColor(MUTED)
    C.drawRightString(WIDTH - MARGIN, HEIGHT - 42, "BLOCK 1  /  02 OCTOBER 2026")
    C.setStrokeColor(LINE)
    C.line(MARGIN, HEIGHT - 57, WIDTH - MARGIN, HEIGHT - 57)
    top = para(title, MARGIN, HEIGHT - 77, CONTENT, 26, 31, NAVY, "Display")
    top = para(subtitle, MARGIN, top - 10, CONTENT, 10.4, 14.2, MUTED)
    C.setStrokeColor(LINE)
    C.line(MARGIN, 39, WIDTH - MARGIN, 39)
    C.setFont("Body", 8)
    C.setFillColor(MUTED)
    C.drawString(MARGIN, 25, "MediMind  |  Team working brief - proposed definitions")
    C.drawRightString(WIDTH - MARGIN, 25, f"{page} / 2")
    return top - 23


def box(text, top, fill=PALE, size=11, leading=15, padding=14):
    p = Paragraph(text, ParagraphStyle("box", fontName="Body", fontSize=size, leading=leading, textColor=NAVY))
    _, h = p.wrap(CONTENT - 2 * padding, HEIGHT)
    total = h + 2 * padding
    C.setFillColor(fill)
    C.roundRect(MARGIN, top - total, CONTENT, total, 7, fill=1, stroke=0)
    p.drawOn(C, MARGIN + padding, top - padding - h)
    return top - total


def cell(text, bold=False, size=9.5):
    return Paragraph(text, ParagraphStyle("cell", fontName="BodyBold" if bold else "Body",
                     fontSize=size, leading=12.9, textColor=NAVY if bold else INK))


top = header(1, "Core positioning & customer", "A clear offer, a focused buyer and a reason to choose MediMind.")
top = section("01", "USP / value proposition - the one-liner", top)
top = box("<b>MediMind replaces disconnected hospital software with one tailored, AI-assisted system - with a free parallel evaluation before you commit to buy.</b>", top, size=13, leading=18)
top = para("<b>The offer:</b> we build the parallel system free; the hospital tests its quality and the improvement before deciding. No obligation to buy. For our next <b>10 hospital clients</b>, we match their current software price when they switch. Ongoing development is included within agreed scope.", MARGIN, top - 12, CONTENT, 10.2, 14)
top = para("<b>Today:</b> connected workflows and AI assistance. <b>Next:</b> the foundation for validated, hospital-wide AI, with clinicians retaining control of medical decisions.", MARGIN, top - 8, CONTENT, 10.2, 14)

top = section("02", "Ideal customer profile (ICP) - who we pursue first", top - 14)
top = para("<b>Initial focus:</b> Georgian private multi-profile hospitals and hospital groups with disconnected clinical and business software, repeated cross-team work, and a leadership reason to improve it.", MARGIN, top, CONTENT)
top = para("<b>Strong fit:</b> a recurring problem we can demonstrate improvement on, an accessible decision sponsor, a potential internal champion, and willingness to allocate staff time to an evaluation. <b>Not the first priority:</b> organizations seeking only a standalone AI chatbot, with no relevant pain, or outside a scope we can support.", MARGIN, top - 8, CONTENT, 10.1, 13.8)

top = section("03", "Buyer personas + customer value propositions", top - 14)
rows = [
    [cell("Person / role", True), cell("Pain they recognize", True), cell("Value we put in front of them", True)],
    [cell("CEO / owner / group operator<br/><font color='#53657a'>Economic buyer</font>", True), cell("Pressure to improve performance without making a disruptive, expensive mistake."), cell("Evaluate a tailored hospital-wide replacement before buying; matched software pricing for the next ten clients.")],
    [cell("Operations or clinical lead<br/><font color='#53657a'>Internal champion</font>", True), cell("Staff repeat work and chase patient information across teams."), cell("Connected workflows and AI assistance in daily work; staff test whether the new system makes the work better.")],
    [cell("Finance lead / CFO<br/><font color='#53657a'>Financial evaluator</font>", True), cell("Billing gaps, corrections and reports that take too much work to reconcile."), cell("Connect clinical activity with financial records and test a specific billing or reporting improvement.")],
    [cell("IT / data owner<br/><font color='#53657a'>Technical approver</font>", True), cell("Migration risk, access concerns and the burden of supporting another system."), cell("A separate, scoped evaluation while the existing system stays in place; agree controls and responsibilities before rollout.")],
]
t = Table(rows, colWidths=[121, 158, CONTENT - 279])
t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), PALE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                       ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                       ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                       ("LINEBELOW", (0, 0), (-1, -1), .5, LINE)]))
_, h = t.wrap(CONTENT, HEIGHT)
t.drawOn(C, MARGIN, top - h)
top -= h
top = para("A <b>connector</b> opens the door. A <b>champion</b> mobilizes hospital colleagues. A <b>buyer</b> authorizes the purchase. These may be different people.", MARGIN, top - 10, CONTENT, 9.1, 12.3, MUTED)
assert top > 48, f"Page 1 content exceeds safe area: {top}"
C.showPage()

top = header(2, "Which leads deserve attention?", "Working MQL and SQL definitions for a founder-led hospital sale.")
top = section("04", "MQL + SQL - clear gates, not vague interest", top)

def lead_card(x, top, width, label, full_name, meaning, points):
    pad = 14
    blocks = [
        (label, 18, 22, NAVY, "BodyBold", 0),
        (full_name, 9, 12, MUTED, "Body", 4),
        (meaning, 11, 15, NAVY, "BodyBold", 11),
        ("<br/>".join(f"<b>{i + 1}.</b> {p}" for i, p in enumerate(points)), 10, 14, INK, "Body", 11),
    ]
    ps = []
    total = 2 * pad
    for text, size, leading, color, font, gap in blocks:
        p = Paragraph(text, ParagraphStyle("card", fontName=font, fontSize=size, leading=leading, textColor=color))
        _, height = p.wrap(width - 2 * pad, HEIGHT)
        ps.append((p, height, gap))
        total += height + gap
    return (x, width, total, ps)

card_width = (CONTENT - 14) / 2
cards = [
    lead_card(MARGIN, top, card_width, "MQL", "Marketing-qualified lead", "A good-fit hospital that has engaged and is ready for discovery.", [
        "Fits our target hospital profile and supportable scope.",
        "A relevant contact is identified and engaged.",
        "The contact agrees to discovery or another dated next step.",
    ]),
    lead_card(MARGIN + card_width + 14, top, card_width, "SQL", "Sales-qualified lead", "Discovery confirms a credible opportunity to plan an evaluation.", [
        "A recurring pain and reason to act are confirmed.",
        "The buyer/sponsor and approval path are identified.",
        "An internal owner will coordinate the evaluation.",
        "A credible budget path exists if the test succeeds.",
        "Scope is feasible; evaluation planning has a date.",
    ]),
]
card_height = max(c[2] for c in cards)
for x, width, _, ps in cards:
    C.setFillColor(colors.HexColor("#f5f8fc"))
    C.roundRect(x, top - card_height, width, card_height, 7, fill=1, stroke=0)
    C.setStrokeColor(LINE)
    C.roundRect(x, top - card_height, width, card_height, 7, fill=0, stroke=1)
    cursor = top - 14
    for p, height, gap in ps:
        cursor -= gap
        p.drawOn(C, x + 14, cursor - height)
        cursor -= height
top -= card_height
top = para("<b>Does not count:</b> a page visit, content download, unaccepted introduction or friendly reply with no meaningful next step. Missing SQL criteria stay in discovery or nurture; they do not become a forecasted sale.", MARGIN, top - 12, CONTENT, 9.8, 13.3)

top = section("05", "Keep qualification separate from evaluation", top - 20)
labels = [("Target account", "Fit + route in"), ("MQL", "Discovery next"), ("SQL", "Plan the evaluation"), ("Evaluation-ready", "Scope + team + approvals"), ("First real test", "Hospital staff test it")]
gap = 10
node_width = (CONTENT - gap * 4) / 5
for i, (label, detail) in enumerate(labels):
    x = MARGIN + i * (node_width + gap)
    C.setFillColor(PALE if i < 4 else colors.HexColor("#eaf5ef"))
    C.roundRect(x, top - 51, node_width, 51, 5, fill=1, stroke=0)
    para(label, x + 7, top - 9, node_width - 14, 8.8, 11, NAVY, "BodyBold")
    para(detail, x + 7, top - 26, node_width - 14, 8, 10.5, MUTED)
    if i < 4:
        ax = x + node_width + 1
        C.setStrokeColor(BLUE)
        C.line(ax, top - 25, ax + 7, top - 25)
        C.line(ax + 4, top - 28, ax + 7, top - 25)
        C.line(ax + 4, top - 22, ax + 7, top - 25)
top -= 64
top = para("A SQL is <b>not</b> a granted-access milestone or a paying customer. Agree evaluation scope, hospital participants, permitted data, success criteria and dates before building. Count one buying organization once, not each contact or each site in a centrally purchasing group.", MARGIN, top, CONTENT, 9.8, 13.3)
top = para("<b>Current priority metric:</b> new hospital buying organizations outside the anchor partner completing their first hands-on parallel-system evaluation session in the last 30 days. SQLs feed this metric; they are not the metric itself.", MARGIN, top - 9, CONTENT, 9.8, 13.3)

top = section("06", "What we should agree together", top - 19)
top = para("<b>1.</b> Confirm the target segment and strongest buyer pain. <b>2.</b> Approve these MQL/SQL gates and one follow-up owner. <b>3.</b> Finalize the free-evaluation scope, next-ten-client price-match terms and development boundaries.", MARGIN, top, CONTENT, 10.1, 14)
top = para("<b>Basis:</b> the supplied Block 1 workshop slide, MediMind marketing work and founder offer. Buyer pains and these qualification rules are working hypotheses to validate; no clinical or financial uplift is claimed as proven.", MARGIN, top - 15, CONTENT, 8.6, 11.5, MUTED)
assert top > 48, f"Page 2 content exceeds safe area: {top}"
C.showPage()
C.save()
print(OUTPUT)
