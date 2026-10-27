"""Make a short lecture study guide plus the complete timestamped draft transcript."""
from pathlib import Path
import json
import re
import shutil
import sys
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
DEST = Path('/Users/toko/Desktop/500 Lectures/01 - 2026-09-28 - Sales and Acquisition')
OUT = ROOT / 'output/pdf/lectures/2026-09-28'
OUT.mkdir(parents=True, exist_ok=True)
NOTES = json.loads((Path(__file__).parents[1] / '2026-09-28-study-notes.json').read_text())
TRANSCRIPT = json.loads((DEST / 'Transcript.json').read_text())
DRAFT_GUIDE = '--draft-guide' in sys.argv
assert DRAFT_GUIDE or TRANSCRIPT['complete'], 'Do not label an incomplete transcript as complete'
FONTS = Path('/System/Library/Fonts/Supplemental')
for name, filename in [('Body', 'Arial.ttf'), ('BodyBold', 'Arial Bold.ttf'), ('Display', 'Georgia.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold')
NAVY, BLUE, INK, MUTED, LINE, PALE = [colors.HexColor(x) for x in ['#183653', '#24718a', '#24384b', '#5b6d7b', '#d5e0e7', '#edf5f7']]
W, H = A4
M = 42
WIDTH = W - 2 * M


def clean(text):
    return re.sub(r'[\u2010-\u2015\u2212]', '-', text)


def p(text, size=10.4, leading=14.5, color=INK, bold=False):
    return Paragraph(clean(text), ParagraphStyle('body', fontName='BodyBold' if bold else 'Body',
        fontSize=size, leading=leading, textColor=color, spaceAfter=6))


def title(text):
    return Paragraph(clean(text), ParagraphStyle('title', fontName='Display', fontSize=25, leading=29, textColor=NAVY, spaceAfter=10))


def heading(text):
    return p(text, 13, 17, NAVY, True)


def stamp(seconds):
    seconds = int(seconds)
    return f'{seconds//3600:02}:{seconds%3600//60:02}:{seconds%60:02}'


def card(label, body):
    t = Table([[[p(label, 11, 15, NAVY, True), p(body)]]], colWidths=[WIDTH])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('LEFTPADDING',(0,0),(-1,-1),12),
        ('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    return t


def table(headers, rows, proportions):
    data = [[p(escape(x),9.2,12.3,NAVY,True) for x in headers]]
    data += [[p(x,9.2,12.3) for x in row] for row in rows]
    t = Table(data, colWidths=[WIDTH*x/sum(proportions) for x in proportions], repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),
        ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),5),
        ('LINEBELOW',(0,0),(-1,-1),.4,LINE)]))
    return t


def decorate(canvas, doc):
    canvas.setTitle(doc.title)
    canvas.setAuthor('MediMind - private learning notes')
    canvas.setFillColor(NAVY)
    canvas.setFont('BodyBold', 11)
    canvas.drawString(M,H-29,'500 LECTURES / LEARNING LIBRARY')
    canvas.setFont('Body',8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(W-M,H-29,'LECTURE 01 / 28 SEPTEMBER 2026')
    canvas.setStrokeColor(LINE)
    canvas.line(M,H-39,W-M,H-39)
    canvas.line(M,34,W-M,34)
    canvas.setFont('Body',7.5)
    canvas.drawString(M,22,'Private study copy | Source recording retained unchanged | Prepared 7 October 2026')
    canvas.drawRightString(W-M,22,str(doc.page))


class Book(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable,'bookmark'):
            key, label = flowable.bookmark
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(label,key,0,False)


guide = []
for index, page in enumerate(NOTES['pages']):
    if index:
        guide.append(PageBreak())
    top = title(page['title'])
    top.bookmark = (f'guide-{index}', page['title'])
    guide.append(top)
    guide.append(p(page['subtitle'],9.4,13,MUTED))
    guide.append(Spacer(1,6))
    for block_index, block in enumerate(page['blocks']):
        kind = block['type']
        if kind == 'card':
            guide.append(card(block['title'],block['body']))
        elif kind == 'table':
            guide.append(table(block['headers'],block['rows'],block['widths']))
        elif kind == 'section':
            guide.append(KeepTogether([heading(block['title']),p(block['body'])]))
        elif kind == 'text':
            guide.append(p(block['body']))
        else:
            raise ValueError(kind)
        if block_index < len(page['blocks']) - 1:
            guide.append(Spacer(1,7))
guide_path = (ROOT / 'tmp/pdfs/lecture-01-guide-draft.pdf') if DRAFT_GUIDE else (OUT / '01 - Fast Study Guide.pdf')
Book(str(guide_path),pagesize=A4,leftMargin=M,rightMargin=M,topMargin=56,bottomMargin=48,
     title=NOTES['title']+' - Fast Study Guide').build(guide,onFirstPage=decorate,onLaterPages=decorate)
assert len(PdfReader(guide_path).pages) == len(NOTES['pages']), 'A study-guide page overflowed; repair before delivery'
if DRAFT_GUIDE:
    print(guide_path)
    sys.exit(0)

story = [title('Full timestamped transcript'),p(NOTES['title'],13,17,NAVY,True),
         p('Brianna Salinas | 500 Eurasia Batch 11 | Recording: 28 September 2026'),
         card('Automatic transcript - use the audio for exact wording',
              'All recording sections were processed locally. This is an unedited speech-recognition draft, '
              'not a certified verbatim record. Room audio, names, accents and overlapping voices can cause errors. '
              'Speaker identities are not assigned. Timestamps refer to the original video.'),Spacer(1,10),
         p('<b>Source:</b> '+escape(Path(TRANSCRIPT['source']).name)),
         p('<b>Full recording:</b> '+stamp(TRANSCRIPT['duration_seconds'])+' | <b>Main lecture:</b> begins around 00:25'),
         p('The short study guide is the reading route. This transcript is the searchable reference. '
           'Short recognized segments are grouped into roughly 45-second reading paragraphs without rewriting the words. '
           'Transcript.txt and Transcript.srt retain finer timestamps for searching or subtitles.'),
         heading('Jump to a recording section')]
for i in range(TRANSCRIPT['total_chunks']):
    start=i*TRANSCRIPT['chunk_seconds']
    story.append(p(f'<link href="#chunk-{i+1}" color="#24718a">{stamp(start)} - {stamp(min(start+600,TRANSCRIPT["duration_seconds"]))}</link>',10,13))
segments = TRANSCRIPT['segments']
for i in range(1,TRANSCRIPT['total_chunks']+1):
    story.append(PageBreak())
    h = title(f'{stamp((i-1)*600)} - {stamp(min(i*600,TRANSCRIPT["duration_seconds"]))}')
    h.bookmark=(f'chunk-{i}',f'{stamp((i-1)*600)} - {stamp(min(i*600,TRANSCRIPT["duration_seconds"]))}')
    story.append(h)
    chunk=[s for s in segments if s['chunk']==i]
    if not chunk:
        story.append(p('No speech was recognized in this section. Check the recording if needed.'))
    groups=[]
    group=[]
    for segment in chunk:
        if group and (segment['start']-group[0]['start']>=45 or segment['start']-group[-1]['end']>8):
            groups.append(group)
            group=[]
        group.append(segment)
    if group:
        groups.append(group)
    for group in groups:
        text=escape(' '.join(s['text'].strip() for s in group))
        line=f'<font color="#24718a"><b>[{stamp(group[0]["start"])} - {stamp(group[-1]["end"])}]</b></font><br/>{text}'
        story.append(p(line,9.6,13.2))
transcript_path=OUT / '02 - Full Timestamped Transcript.pdf'
Book(str(transcript_path),pagesize=A4,leftMargin=M,rightMargin=M,topMargin=56,bottomMargin=48,
     title=NOTES['title']+' - Automatic Transcript').build(story,onFirstPage=decorate,onLaterPages=decorate)
for file in (guide_path,transcript_path):
    shutil.copy2(file,DEST/file.name)
    reader=PdfReader(file)
    assert all(page.extract_text().strip() for page in reader.pages)
    print(f'{file.name}: {len(reader.pages)} pages')
shutil.copy2(Path(__file__).parents[1]/'2026-09-28-study-notes.json',DEST/'Working files/Study notes.json')
quality={
    'processed_chunks':TRANSCRIPT['completed_chunks'],'total_chunks':TRANSCRIPT['total_chunks'],
    'segments':len(segments),'last_recognized_speech_seconds':segments[-1]['end'] if segments else None,
    'review_note':'Automatic diagnostics are review hints, not accuracy measurements.',
    'low_confidence_segments':[{'start':s['start'],'end':s['end'],'text':s['text'],'avg_logprob':s.get('avg_logprob')}
       for s in segments if s.get('avg_logprob',0)<-0.8],
}
(DEST/'Working files/Transcript checks.json').write_text(json.dumps(quality,indent=2,ensure_ascii=False))
