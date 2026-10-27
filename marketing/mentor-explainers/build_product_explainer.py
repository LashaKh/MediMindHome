"""Build a concise mentor-ready PDF from reusable product copy; no network calls."""

import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).with_name("justyna-product-explainer.json")
OUTPUT = ROOT / "output/pdf/mentor-explainers/MediMind - Product Explainer - Justyna - 2026-10-08.pdf"
DATA = json.loads(SOURCE.read_text())
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
W, H = A4
M = 40
CW = W - M * 2
C = canvas.Canvas(str(OUTPUT), pagesize=A4)
C.setTitle(DATA["title"])
C.setAuthor("MediMind")
C.setSubject("Phase 1 hospital system, included parallel evaluation, next-ten offer and later AI phases")


def para(text, x, top, width=CW, size=10.5, leading=14.4, color=INK, font="Body"):
    p = Paragraph(text, ParagraphStyle("p", fontName=font, fontSize=size,
                  leading=leading, textColor=color, alignment=TA_LEFT))
    _, height = p.wrap(width, H)
    assert top - height > 44, f"Content outside safe area: {text[:55]}"
    p.drawOn(C, x, top - height)
    return top - height


def section(label, top):
    return para(label, M, top, size=11, leading=14, color=NAVY, font="BodyBold") - 7


def box(text, top, size=11.2, leading=15, padding=13):
    style = ParagraphStyle("box", fontName="Body", fontSize=size, leading=leading, textColor=NAVY)
    p = Paragraph(text, style)
    _, height = p.wrap(CW - 2 * padding, H)
    bottom = top - height - 2 * padding
    assert bottom > 44, "Box outside safe area"
    C.setFillColor(PALE)
    C.roundRect(M, bottom, CW, height + 2 * padding, 7, fill=1, stroke=0)
    p.drawOn(C, M + padding, top - padding - height)
    return bottom


def header(page, label):
    C.setFont("BodyBold", 17)
    C.setFillColor(NAVY)
    C.drawString(M, H - 39, "Medi")
    C.setFillColor(BLUE)
    C.drawString(M + pdfmetrics.stringWidth("Medi", "BodyBold", 17), H - 39, "Mind")
    C.setFont("Body", 8)
    C.setFillColor(MUTED)
    C.drawRightString(W - M, H - 37, label)
    C.setStrokeColor(LINE)
    C.line(M, H - 51, W - M, H - 51)
    C.line(M, 35, W - M, 35)
    C.setFont("Body", 8)
    C.drawString(M, 21, "Prepared for " + DATA["prepared_for"])
    C.drawRightString(W - M, 21, f"{DATA['date']}  |  {page} / 2")
    return H - 70


top = header(1, "THE PROACTIVE AI HOSPITAL")
top = para(escape(DATA["headline"]).replace("\n", "<br/>"), M, top,
           size=26, leading=30, color=NAVY, font="Display")
top = para(escape(DATA["promise"]), M, top - 10, size=11.3, leading=15.5, color=BLUE)
top = box("<b>What is included now</b><br/>" + escape(DATA["initial_scope"]),
          top - 13, size=10.3, leading=14, padding=11)

top -= 18
for text in DATA["introduction"]:
    top = para(escape(text), M, top, size=11, leading=15) - 8

top = section("Value today. A foundation for tomorrow.", top - 9)
for text in DATA["value"]:
    top = para(escape(text), M, top, size=10.5, leading=14.4) - 8

top = section("Three phases. A clear starting point.", top - 9)
for item in DATA["ai"]:
    top = para(f"<b>{escape(item['title'])}.</b> {escape(item['body'])}",
               M, top, size=10.5, leading=14.4) - 8

top = section("Who it is for", top - 9)
top = para(escape(DATA["customer"]), M, top, size=10.5, leading=14.4)
print(f"Page 1 bottom: {top:.1f} pt")
C.showPage()

top = header(2, "EARLY HOSPITAL PARTNER OFFER")
top = para(escape(DATA["page_two_title"]).replace("\n", "<br/>"), M, top,
           size=25, leading=29, color=NAVY, font="Display")

top = para(escape(DATA["evaluation_promise"]), M, top - 12,
           size=11.3, leading=15.5, color=BLUE) - 19
top = box("<b>" + escape(DATA["offer_title"]) + "</b><br/>" + escape(DATA["offer"]),
          top, size=10.5, leading=14.4, padding=13) - 20
for i, item in enumerate(DATA["evaluation"], 1):
    C.setFillColor(BLUE)
    C.circle(M + 8, top - 7, 8, fill=1, stroke=0)
    C.setFont("BodyBold", 8)
    C.setFillColor(colors.white)
    C.drawCentredString(M + 8, top - 10, str(i))
    top = para(f"<b>{escape(item['title'])}.</b> {escape(item['body'])}",
               M + 25, top, CW - 25, size=10.5, leading=14.4) - 9
top = para(escape(DATA["timing"]), M, top - 3, size=10.2, leading=14, color=MUTED)

top = section("How adoption works", top - 18)
top = para(escape(DATA["delivery_model"]), M, top, size=10.5, leading=14.4)

top = section("Where we are today", top - 19)
top = para(escape(DATA["stage"]), M, top, size=10.5, leading=14.4)
top = para(escape(DATA["difference"]), M, top - 9, size=10.5, leading=14.4)
top = para(escape(DATA["closing"]), M, top - 9, size=10.5, leading=14.4, color=NAVY)

top = para(f"<link href='mailto:{DATA['contact']}' color='#2b6cb0'>{DATA['contact']}</link>",
           M, top - 16, size=9.5, leading=12, color=BLUE)
print(f"Page 2 bottom: {top:.1f} pt")
C.showPage()
C.save()
print(OUTPUT)
