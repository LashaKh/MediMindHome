"""Audit, index and assemble the complete saved-deliverables archive."""
from pathlib import Path
from collections import Counter, OrderedDict
from io import BytesIO
from xml.sax.saxutils import escape
import hashlib
import json
import re
import unicodedata

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

ROOT = Path('/Users/toko/Desktop/MediMind Landing Page')
DEST = Path('/Users/toko/Desktop/MediMind - Complete Chat Archive - 2026-10-07')
SCRATCH = ROOT / 'tmp/pdfs/session-archive'
OUTPUT = ROOT / 'output/pdf/session-archive-2026-10-07'
OUTPUT.mkdir(parents=True, exist_ok=True)
DOCS = json.loads((SCRATCH / 'documents.json').read_text())
for item in DOCS:
    if item['group'] == '08 Research, evidence and working notes':
        item['group'] = '08 Research, source notes and earlier text editions'
DOCS.sort(key=lambda d: d['group'])
inventory = json.loads((DEST / 'Archive inventory/source-files.json').read_text())
NAVY = colors.HexColor('#1a365d')
BLUE = colors.HexColor('#2b6cb0')
INK = colors.HexColor('#233248')
PALE = colors.HexColor('#edf5fc')
LINE = colors.HexColor('#d7e2ef')
MUTED = colors.HexColor('#53657a')
for name, filename in [('Body', 'Arial.ttf'), ('BodyBold', 'Arial Bold.ttf'), ('Display', 'Georgia.ttf')]:
    pdfmetrics.registerFont(TTFont(name, '/System/Library/Fonts/Supplemental/' + filename))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold')


def normalized(text):
    text = unicodedata.normalize('NFKC', text).lower()
    return Counter(re.findall(r'[a-z0-9]{3,}', text))


audits = []
for d in DOCS:
    r = PdfReader(d['pdf'])
    d['pages'] = len(r.pages)
    text = '\n'.join(p.extract_text() for p in r.pages)
    audit = {'title': d['title'], 'pages': d['pages'], 'kind': d['kind']}
    if d.get('text'):
        original = normalized(Path(d['text']).read_text())
        actual = normalized(text)
        missing = original - actual
        raw_coverage = 1 - sum(missing.values()) / max(1, sum(original.values()))
        # Long URLs and identifiers split across lines when printed. Check those
        # candidate misses against compact extracted text before flagging a loss.
        compact = re.sub(r'\s+', '', unicodedata.normalize('NFKC', text)).lower()
        missing = Counter({token: max(0, original[token] - compact.count(token)) for token in missing})
        coverage = 1 - sum(missing.values()) / max(1, sum(original.values()))
        audit.update(tokenCoverage=round(coverage, 5), rawWordBoundaryCoverage=round(raw_coverage, 5), missingTokens=missing.most_common(12))
        if coverage < .98:
            print('LOW TEXT COVERAGE', json.dumps(audit))
    if d['kind'] == 'hero':
        assert d['pages'] == 1, (d['title'], d['pages'])
        assert 'parallel' in text.lower(), d['title']
    audits.append(audit)

for record in inventory['files']:
    target = DEST / record['archive']
    assert hashlib.sha256(target.read_bytes()).hexdigest() == record['sha256'], str(target)
    assert hashlib.sha256(Path(record['source']).read_bytes()).hexdigest() == record['sha256'], record['source']

groups = OrderedDict()
for d in DOCS:
    groups.setdefault(d['group'], []).append(d)


def p(text, size=10.2, leading=14.5, color=INK, bold=False):
    return Paragraph(text, ParagraphStyle('p', fontName='BodyBold' if bold else 'Body',
                    fontSize=size, leading=leading, textColor=color, spaceAfter=0))


def footer(c, doc):
    w, h = A4
    c.setStrokeColor(LINE)
    c.line(42, 42, w - 42, 42)
    c.setFillColor(MUTED)
    c.setFont('Body', 8)
    c.drawString(42, 28, 'MediMind / Saved work archive / 7 October 2026')
    c.drawRightString(w - 42, 28, f'Guide {doc.page}')


def make_guide(offset):
    story = []
    story += [p('MEDIMIND / COMPLETE CHAT WORK ARCHIVE', 10, 14, BLUE, True), Spacer(1, 22)]
    story.append(Paragraph('Everything we built.<br/>One place to find it.', ParagraphStyle('cover', fontName='Display', fontSize=31, leading=38, textColor=NAVY)))
    story += [Spacer(1, 16), p('Marketing, positioning, landing-page copy, research, customer journeys and workshop briefs.', 13, 18, MUTED), Spacer(1, 23)]
    count_pages = sum(d['pages'] for d in DOCS) + offset
    story.append(p(f'<b>{inventory["sourceFiles"]} original files preserved</b> | <b>{len(DOCS)} indexed sections</b> | <b>{count_pages} pages in the complete PDF</b>', 11, 16, NAVY))
    story += [Spacer(1, 21), p('Start here', 16, 21, NAVY, True), Spacer(1, 9)]
    story.append(p('<b>01 ALL SESSION WORK.pdf</b> contains the complete reading archive, including this guide. Open its bookmarks/sidebar to jump to a section, or search the text. The table of contents below uses that PDF\'s page numbers.'))
    story += [Spacer(1, 10), p('<b>Original files/</b> keeps the HTML, editable Markdown, workshop PDFs, supplied libraries, technical files and visual QA images. These are byte-for-byte copies. Nothing was moved, deleted, deployed or published for this archive.')]
    story += [Spacer(1, 10), p('<b>Archive inventory/</b> records original locations, checksums, PDF section/page mappings and the coverage check. Some Desktop files were found in Trash and copied here; the originals remain there.')]
    story += [Spacer(1, 20), p('What to read first', 16, 21, NAVY, True), Spacer(1, 9)]
    story.append(p('<b>Current working framework:</b> the three October workshop briefs.<br/><b>Copy choices:</b> the latest five HTML additions and the ten full-screen hero previews. Option 5 preserves your preferred proof-led opening.<br/><b>Deep strategy:</b> all 20 B11 prompt answers, followed by earlier copy and research versions.'))
    story += [Spacer(1, 20), p('Read historical material as historical', 16, 21, NAVY, True), Spacer(1, 9)]
    story.append(p('Dates, assumptions, evidence warnings and proposed offers are preserved. Earlier drafts can conflict with later decisions. In particular, the later focus metric is the first hospital hands-on test; older chapters still discuss qualified demos. Archived claims are not newly validated or approved for publication.'))
    story += [Spacer(1, 10), p('Scope: all recoverable saved deliverables identified for this chat, plus the original B11 inputs and supporting source snapshots. This is not a verbatim conversation transcript or an export of unrelated repositories. Duplicate copies are retained in originals; distinct versions remain in the PDF.', 9.4, 13.1, MUTED)]
    story.append(PageBreak())
    story += [p('Contents & page finder', 24, 30, NAVY, True), Spacer(1, 8), p('Page numbers refer to 01 ALL SESSION WORK.pdf. Use its PDF bookmarks for direct navigation.', 10, 14, MUTED), Spacer(1, 12)]
    for group, documents in groups.items():
        rows = []
        for d in documents:
            page_range = str(d['start']) if d['pages'] == 1 else f"{d['start']}-{d['start'] + d['pages'] - 1}"
            rows.append([p(escape(d['title'].replace('—', '-').replace('–', '-')), 9.3, 12.5), p(page_range, 9.3, 12.5, BLUE, True)])
        label = p(escape(group), 12.2, 17, NAVY, True)
        t = Table(rows, colWidths=[450, 61], hAlign='LEFT')
        t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), .4, LINE),
                               ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                               ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
        label.keepWithNext = True
        story += [label, Spacer(1, 6), t, Spacer(1, 15)]
    story.append(PageBreak())
    story += [p('Coverage & preservation notes', 24, 30, NAVY, True), Spacer(1, 16)]
    for title, text in [
        ('All 25 consolidated HTML chapters', 'The 20 prompt answers and five later additions are included in full. Hidden tabs were expanded so the copy alternatives are not lost in print. Navigation and copy/print controls are omitted from the reading edition.'),
        ('All ten website-style screens', 'Each original hero preview has its own landscape page. The copy is also present in the text edition and saved Markdown. A logo rasterization is used for reliable PDF rendering; original HTML remains unchanged.'),
        ('Earlier drafts, notes and alternate editions', 'The original favorite, ten earlier alternatives, UVP/JTBD strategy, live-copy snapshot, pain-led draft, evidence register, interview guide, first-week guide, positioning snapshots and prior HTML/Markdown versions are included.'),
        ('Workshops and source inputs', 'Blocks 1, 2 and 3 are included as their original PDFs. The two supplied B11 libraries appear in a separately labelled reference section; they are not presented as work authored here.'),
        ('Technical and visual appendix', 'Build scripts, JSON catalogs, audit records and saved visual QA images are preserved. Very long embedded image data in code listings is represented by a note, with the complete bytes retained in the original file. Text extractions of the supplied libraries are covered by the full reference PDFs.'),
        ('Private by default', 'This folder is local on your Desktop. No new share link was created. It contains internal strategy and source notes; review it before sharing publicly.'),
    ]:
        story += [p(title, 12, 16, NAVY, True), Spacer(1, 5), p(text), Spacer(1, 13)]
    guide = OUTPUT / '00 START HERE - Archive Guide.pdf'
    doc = SimpleDocTemplate(str(guide), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=45, bottomMargin=57,
                             title='MediMind | Complete Chat Work Archive - Guide', author='MediMind')
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return guide, len(PdfReader(guide).pages)


offset = 8
for _ in range(5):
    current = offset + 1
    for d in DOCS:
        d['start'] = current
        current += d['pages']
    guide, actual = make_guide(offset)
    if actual == offset:
        break
    offset = actual
else:
    raise RuntimeError('Contents page count did not stabilize')

writer = PdfWriter()
writer.append(str(guide), import_outline=False)
writer.add_outline_item('00 Start here / contents / preservation notes', 0)
for group, documents in groups.items():
    parent = writer.add_outline_item(group, documents[0]['start'] - 1)
    for d in documents:
        assert len(writer.pages) == d['start'] - 1
        writer.append(d['pdf'], import_outline=False)
        writer.add_outline_item(d['title'], d['start'] - 1, parent=parent)
writer.add_metadata({'/Title': 'MediMind - Complete Chat Work Archive', '/Author': 'MediMind', '/Subject': 'Complete saved marketing deliverables; archived 7 October 2026'})
writer.page_mode = '/UseOutlines'
writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
complete = OUTPUT / '01 ALL SESSION WORK.pdf'
with complete.open('wb') as stream:
    writer.write(stream)
for source in [guide, complete]:
    (DEST / source.name).write_bytes(source.read_bytes())

report = {'date': '2026-10-07', 'sourceFileCount': inventory['sourceFiles'], 'sectionCount': len(DOCS),
          'guidePages': offset, 'totalPages': len(writer.pages), 'sourceChecksumsVerified': True,
          'lowestReadingTokenCoverage': min(a.get('tokenCoverage', 1) for a in audits),
          'readingChecks': audits, 'sections': DOCS}
(DEST / 'Archive inventory/pdf-coverage.json').write_text(json.dumps(report, indent=2))
print(json.dumps({k:report[k] for k in ['sourceFileCount','sectionCount','guidePages','totalPages','lowestReadingTokenCoverage']}))
print(complete)
