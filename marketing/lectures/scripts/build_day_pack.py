"""Build a consolidated study guide and transcript reference for one lecture day."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import shutil
from html.parser import HTMLParser
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[3]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--notes', type=Path, default=Path(__file__).parents[1] / 'week2day1-study-notes.json')
parser.add_argument('--preview-guide', action='store_true', help='Render only a marked draft guide into tmp/')
args = parser.parse_args()
NOTES_PATH = args.notes
NOTES = json.loads(NOTES_PATH.read_text())
assert NOTES.get('ready', True) or args.preview_guide, 'Study notes still require source review before publication'
META = NOTES.get('meta', {})
DAY = META.get('day', 'Week 2 Day 1')
DATE = META.get('date', '28 September 2026')
SLUG = META.get('slug', 'week2day1')
DEST = Path(META.get('destination', '/Users/toko/Desktop/500 Lectures/Week 2 Day 1 - 2026-09-28'))
OUT = ROOT / 'output/pdf/lectures' / SLUG
if args.preview_guide:
    OUT = ROOT / 'tmp/pdfs' / SLUG / 'preview'
OUT.mkdir(parents=True, exist_ok=True)
TRANSCRIPTS = DEST / 'Transcripts' if (DEST / 'Transcripts').exists() else DEST
LABELS = META.get('sessions', ['Sales process and prospecting', 'Fundraising planning', 'Customer value propositions and workshops'])

for name, filename in [('Body','Arial.ttf'),('Bold','Arial Bold.ttf'),('Display','Georgia.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('/System/Library/Fonts/Supplemental') / filename)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold')
NAVY, TEAL, INK, MUTED, LINE, PALE = [colors.HexColor(s) for s in ('#183653','#24718a','#24384b','#5b6d7b','#d5e0e7','#edf5f7')]
W,H=A4
M=42
WIDTH=W-2*M


def clean(text):
    return re.sub(r'[\u2010-\u2015\u2212]', '-', text).replace('\ufffd', '?')


def p(text, size=10.4, leading=14.5, color=INK, bold=False):
    return Paragraph(clean(text), ParagraphStyle('body',fontName='Bold' if bold else 'Body',fontSize=size,
        leading=leading,textColor=color,spaceAfter=6))


def title(text):
    return Paragraph(clean(text),ParagraphStyle('title',fontName='Display',fontSize=25,leading=29,textColor=NAVY,spaceAfter=10))


def card(label, body):
    t=Table([[[p(label,11,15,NAVY,True),p(body)]]],colWidths=[WIDTH])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('LEFTPADDING',(0,0),(-1,-1),12),
        ('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    return t


def table(headers, rows, widths):
    data=[[p(escape(x),9.2,12.3,NAVY,True) for x in headers]]
    data += [[p(x,9.2,12.3) for x in row] for row in rows]
    t=Table(data,colWidths=[WIDTH*x/sum(widths) for x in widths],repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),
        ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),5),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]))
    return t


def decorate(canvas,doc):
    canvas.setTitle(doc.title)
    canvas.setAuthor('MediMind - private learning notes')
    canvas.setFont('Bold',11)
    canvas.setFillColor(NAVY)
    canvas.drawString(M,H-29,'500 LECTURES / '+DAY.upper())
    canvas.setFont('Body',8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(W-M,H-29,DATE.upper())
    canvas.setStrokeColor(LINE)
    canvas.line(M,H-39,W-M,H-39)
    canvas.line(M,34,W-M,34)
    canvas.setFont('Body',7.5)
    prepared_date = META.get('prepared_date', '7 October 2026')
    footer = 'DRAFT PREVIEW - source review in progress' if args.preview_guide else f'Private study copy | Recordings and decks | Prepared {prepared_date}'
    canvas.drawString(M,22,footer)
    canvas.drawRightString(W-M,22,str(doc.page))


class Book(SimpleDocTemplate):
    def afterFlowable(self,flowable):
        if hasattr(flowable,'bookmark'):
            key,label,level=flowable.bookmark
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(label,key,level,False)


def build(path,story,name):
    Book(str(path),pagesize=A4,leftMargin=M,rightMargin=M,topMargin=56,bottomMargin=48,title=name).build(
        story,onFirstPage=decorate,onLaterPages=decorate)
    reader=PdfReader(path)
    assert all(page.extract_text().strip() for page in reader.pages)
    return reader


def stamp(seconds):
    n=int(seconds)
    return f'{n//3600:02}:{n%3600//60:02}:{n%60:02}'


guide=[]
for i,page in enumerate(NOTES['pages']):
    if i:
        guide.append(PageBreak())
    h=title(page['title'])
    h.bookmark=(f'guide-{i}',page['title'],0)
    guide += [h,p(page['subtitle'],9.4,13,MUTED),Spacer(1,6)]
    for j,block in enumerate(page['blocks']):
        kind=block['type']
        if kind=='card':
            guide.append(card(block['title'],block['body']))
        elif kind=='table':
            guide.append(table(block['headers'],block['rows'],block['widths']))
        elif kind=='section':
            guide.append(KeepTogether([p(block['title'],13,17,NAVY,True),p(block['body'])]))
        elif kind=='text':
            guide.append(p(block['body']))
        else:
            raise ValueError(kind)
        if j<len(page['blocks'])-1:
            guide.append(Spacer(1,7))
guide_path=OUT/f'01 - {DAY} - What You Need to Know.pdf'
guide_reader=build(guide_path,guide,f'{DAY} - What You Need to Know')
assert len(guide_reader.pages)==len(NOTES['pages']), 'A guide page overflowed; fix before delivery'
if args.preview_guide:
    print(f'Draft preview: {guide_path} ({len(guide_reader.pages)} pages)')
    raise SystemExit(0)

SESSIONS = [json.loads((TRANSCRIPTS / f'Session {n:02} - Transcript.json').read_text())
            for n in range(1, len(LABELS) + 1)]
assert all(s['complete'] for s in SESSIONS), 'All recordings must be complete before publication'
assert len(LABELS) == len(SESSIONS)

story=[title('All session transcripts'),p(f'{DAY} - {DATE}',13,17,NAVY,True),
    card('Automatic draft - check the recordings for exact quotations',
        'All recordings were processed locally. Speech recognition may mishear names, accents, '
        'room discussion or overlapping voices. This is not a fully human-verified verbatim record. '
        'Speaker identities are not assigned. The study guide interprets the content separately.'),Spacer(1,10),
    p('<b>Total recording time:</b> '+stamp(round(sum(s['duration_seconds'] for s in SESSIONS)))),
    p('Timestamps restart at zero for each recording. Use the session number as well as the time. '
      'Short speech segments are grouped into roughly 45-second paragraphs without rewriting recognized words. '
      'Individual TXT and SRT files provide finer timestamps.'),p('Jump to a session',13,17,NAVY,True)]
for i,(session,label) in enumerate(zip(SESSIONS,LABELS),1):
    story.append(p(f'<link href="#session-{i}" color="#24718a">Session {i}: {label}</link> - {stamp(session["duration_seconds"])}'))
    story.append(p(escape(Path(session['source']).name),8.5,11.5,MUTED))
if META.get('transcript_caution'):
    story += [Spacer(1,10), card('Sections needing extra caution', escape(META['transcript_caution']))]
if any('\ufffd' in segment['text'] for session in SESSIONS for segment in session['segments']):
    story.append(p('Unreadable character markers appear as ? in this PDF. The original TXT/JSON output is unchanged.',9,12,MUTED))
for i,(session,label) in enumerate(zip(SESSIONS,LABELS),1):
    story.append(PageBreak())
    h=title(f'Session {i}: {label}')
    h.bookmark=(f'session-{i}',f'Session {i}: {label}',0)
    story += [h,p('<b>Source:</b> '+escape(Path(session['source']).name),9,12,MUTED),
              p('Recording duration: '+stamp(session['duration_seconds'])+'. Times below are local to this recording.',9,12,MUTED)]
    for chunk in range(1,session['total_chunks']+1):
        if chunk>1:
            story.append(Spacer(1,10))
        start=(chunk-1)*session['chunk_seconds']
        end=min(start+session['chunk_seconds'],session['duration_seconds'])
        h=p(f'{stamp(start)} - {stamp(end)}',14,18,NAVY,True)
        h.keepWithNext=True
        h.bookmark=(f'session-{i}-chunk-{chunk}',f'{stamp(start)} - {stamp(end)}',1)
        story.append(h)
        groups=[]
        group=[]
        for segment in [s for s in session['segments'] if s['chunk']==chunk]:
            if group and (segment['start']-group[0]['start']>=45 or segment['start']-group[-1]['end']>8):
                groups.append(group)
                group=[]
            group.append(segment)
        if group:
            groups.append(group)
        for group in groups:
            text=escape(' '.join(s['text'].strip() for s in group))
            story.append(p(f'<font color="#24718a"><b>[{stamp(group[0]["start"])} - {stamp(group[-1]["end"])}]</b></font><br/>{text}',9.6,13.2))
reference_path=OUT/f'02 - {DAY} - Complete Transcripts.pdf'
reference_reader=build(reference_path,story,f'{DAY} - Complete Automatic Transcripts')


class TextOnly(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts=[]
        self.ignore=0
    def handle_starttag(self,tag,attrs):
        if tag in ('style','script'):
            self.ignore+=1
    def handle_endtag(self,tag):
        if tag in ('style','script'):
            self.ignore-=1
        if tag in ('div','p','li','h1','section'):
            self.parts.append('\n')
    def handle_data(self,data):
        if not self.ignore:
            self.parts.append(data)


for name,title_text,expected in META.get('decks', [('sales','Sales and Prospecting',75),('fundraising','Fundraising Planning',66)]):
    original=ROOT/f'tmp/lectures/{SLUG}/{name}-deck.html'
    fragments=re.split(r'<div role="group" class="slide"',original.read_text())[1:]
    assert len(fragments)==expected
    extracted=[]
    for i,fragment in enumerate(fragments,1):
        parser=TextOnly()
        parser.feed('<div role="group" class="slide"'+fragment)
        text='\n'.join(line.strip() for line in ''.join(parser.parts).splitlines() if line.strip())
        extracted.append(f'SLIDE {i}\n{text}')
    source_dir=DEST/'Source decks'
    source_dir.mkdir(exist_ok=True)
    (source_dir/f'{title_text} - accessible text.txt').write_text('\n\n'.join(extracted))
    shutil.copy2(original,source_dir/f'{title_text} - original HTML view.html')

checks=[]
for i,s in enumerate(SESSIONS,1):
    segments=s['segments']
    assert all(x['text'].strip() and 0<=x['start']<x['end']<=s['duration_seconds'] for x in segments)
    assert all(segments[j]['start']<=segments[j+1]['start'] for j in range(len(segments)-1))
    assert hashlib.file_digest(Path(s['source']).open('rb'),'sha256').hexdigest()==s['sha256']
    checks.append({'session':i,'source':s['source'],'duration_seconds':s['duration_seconds'],
        'completed_chunks':s['completed_chunks'],'total_chunks':s['total_chunks'],'segments':len(segments),
        'last_speech_seconds':segments[-1]['end'],'source_sha256':s['sha256']})
(DEST/'Working files/Day validation.json').write_text(json.dumps(checks,indent=2))
shutil.copy2(NOTES_PATH,DEST/'Working files/Day study notes.json')
for file,reader in [(guide_path,guide_reader),(reference_path,reference_reader)]:
    shutil.copy2(file,DEST/file.name)
    print(f'{file.name}: {len(reader.pages)} pages')
