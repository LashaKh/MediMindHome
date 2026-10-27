"""Check PDF text coverage and bounds against the completed local transcripts."""
import argparse
import hashlib
import json
import re
from pathlib import Path

import pdfplumber
from pypdf import PdfReader

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('notes', type=Path)
args = parser.parse_args()
notes = json.loads(args.notes.read_text())
meta = notes['meta']
destination = Path(meta['destination'])
day = meta['day']
transcript_dir = destination / 'Transcripts'
if not transcript_dir.exists():
    transcript_dir = destination
guide = destination / f'01 - {day} - What You Need to Know.pdf'
reference = destination / f'02 - {day} - Complete Transcripts.pdf'
assert notes['ready'], 'Notes must be reviewed'
assert len(PdfReader(guide).pages) == len(notes['pages']), 'Unexpected guide pagination'


def normalize(text):
    return ''.join(char.casefold() for char in text if char.isalnum())


report = {'day': day, 'pdfs': [], 'sessions': []}
reference_text = []
for pdf in (guide, reference):
    with pdfplumber.open(pdf) as book:
        for number, page in enumerate(book.pages, 1):
            assert page.chars, f'Empty page: {pdf.name} {number}'
            for char in page.chars:
                assert char['x0'] >= 35 and char['x1'] <= page.width - 35, (pdf.name, number, char)
                assert char['top'] >= 15 and char['bottom'] <= page.height - 12, (pdf.name, number, char)
            if pdf == reference:
                reference_text.append(page.crop((36, 50, page.width - 36, page.height - 43)).extract_text() or '')
        report['pdfs'].append({'filename': pdf.name, 'pages': len(book.pages),
                              'sha256': hashlib.file_digest(pdf.open('rb'), 'sha256').hexdigest()})

haystack = normalize('\n'.join(reference_text))
cursor = 0
for number in range(1, len(meta.get('sessions', [1, 2, 3])) + 1):
    session = json.loads((transcript_dir / f'Session {number:02} - Transcript.json').read_text())
    assert session['complete'] and session['completed_chunks'] == session['total_chunks']
    assert hashlib.file_digest(Path(session['source']).open('rb'), 'sha256').hexdigest() == session['sha256']
    for segment in session['segments']:
        assert 0 <= segment['start'] < segment['end'] <= session['duration_seconds']
        needle = normalize(segment['text'])
        position = haystack.find(needle, cursor)
        assert position >= 0, f'Missing or reordered segment: session {number}, {segment["start"]}, {segment["text"]}'
        cursor = position + len(needle)
    report['sessions'].append({'session': number, 'segments_matched_in_order': len(session['segments']),
                               'duration_seconds': session['duration_seconds'], 'source_unchanged': True})

output = destination / 'Working files' / 'PDF verification.json'
output.write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
