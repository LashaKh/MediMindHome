"""Render the source-labelled customer-discovery exercise; no external writes."""
import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
OUT = REPO / "output/pdf/MediMind - AI-Powered Customer Discovery - 2026-10-12.pdf"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")
for name, filename in (("Body", "Arial.ttf"), ("BodyBold", "Arial Bold.ttf"), ("Display", "Georgia.ttf")):
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFont(TTFont("Georgian", "/System/Library/Fonts/SFGeorgianRounded.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="BodyBold")

NAVY = colors.HexColor("#193554")
BLUE = colors.HexColor("#2b6cb0")
INK = colors.HexColor("#283b50")
MUTED = colors.HexColor("#576b7e")
PALE = colors.HexColor("#edf5fb")
LINE = colors.HexColor("#d8e3ee")
WIDTH, HEIGHT = A4
CONTENT = WIDTH - 84

STYLES = {
    "body": ParagraphStyle("body", fontName="Body", fontSize=9.5, leading=12.7, textColor=INK),
    "small": ParagraphStyle("small", fontName="Body", fontSize=8.5, leading=11.5, textColor=MUTED),
    "title": ParagraphStyle("title", fontName="Display", fontSize=24, leading=28, textColor=NAVY),
    "heading": ParagraphStyle("heading", fontName="BodyBold", fontSize=13, leading=17, textColor=NAVY),
    "cell": ParagraphStyle("cell", fontName="Body", fontSize=8.4, leading=10.8, textColor=INK),
    "cellhead": ParagraphStyle("cellhead", fontName="BodyBold", fontSize=8.4, leading=10.8, textColor=NAVY),
}


def p(text, style="body"):
    return Paragraph(text.replace("\n", "<br/>"), STYLES[style])


def block(item):
    kind = item["type"]
    if kind == "heading":
        return [Spacer(1, 7), p(item["title"], "heading"), Spacer(1, 7)]
    if kind == "text":
        return [p(item["body"]), Spacer(1, 8)]
    if kind == "section":
        return [KeepTogether([p(item["title"], "heading"), Spacer(1, 5), p(item["body"]), Spacer(1, 12)])]
    if kind == "card":
        table = Table([[p(item["title"], "heading")], [p(item["body"])]], colWidths=[CONTENT])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PALE),
            ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, 0), 8), ("BOTTOMPADDING", (0, 0), (-1, 0), 3),
            ("TOPPADDING", (0, 1), (-1, 1), 3), ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
        ]))
        return [KeepTogether([table, Spacer(1, 12)])]
    if kind == "table":
        rows = [[p(text, "cellhead") for text in item["headers"]]]
        rows += [[p(text, "cell") for text in row] for row in item["rows"]]
        widths = [CONTENT * fraction for fraction in item["widths"]]
        table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), PALE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ]))
        return [table, Spacer(1, 10)]
    if kind == "sources":
        return [p(f'<link href="{escape(url, quote=True)}" color="#2b6cb0">{escape(label)}</link>', "small")
                for label, url in item["items"]] + [Spacer(1, 10)]
    raise ValueError(f"Unsupported block: {kind}")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.setFont("BodyBold", 13)
    canvas.drawString(42, HEIGHT - 37, "MediMind")
    canvas.setFillColor(MUTED)
    canvas.setFont("Body", 8)
    canvas.drawRightString(WIDTH - 42, HEIGHT - 35, "CUSTOMER DISCOVERY / 12 OCTOBER 2026")
    canvas.setStrokeColor(LINE)
    canvas.line(42, HEIGHT - 48, WIDTH - 42, HEIGHT - 48)
    canvas.line(42, 38, WIDTH - 42, 38)
    canvas.drawString(42, 24, "Working research | Not a verified sales pipeline")
    canvas.drawRightString(WIDTH - 42, 24, str(doc.page))
    canvas.restoreState()


def main():
    data = json.loads((ROOT / "exercise.json").read_text())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    story = []
    for index, page in enumerate(data["pages"]):
        if index:
            story.append(PageBreak())
        story.extend([p(page["title"], "title"), Spacer(1, 9), p(page["subtitle"], "small"), Spacer(1, 14)])
        for item in page["blocks"]:
            story.extend(block(item))
    doc = SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=42, rightMargin=42,
                            topMargin=68, bottomMargin=55, title=data["title"], author="MediMind")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUT)


if __name__ == "__main__":
    main()
