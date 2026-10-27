"""Create page contact sheets and check the completed archive structure."""
from pathlib import Path
import json
from PIL import Image, ImageDraw
from pypdf import PdfReader

ROOT = Path('/Users/toko/Desktop/MediMind Landing Page')
SCRATCH = ROOT / 'tmp/pdfs/session-archive'
DEST = Path('/Users/toko/Desktop/MediMind - Complete Chat Archive - 2026-10-07')
report = json.loads((DEST / 'Archive inventory/pdf-coverage.json').read_text())
reader = PdfReader(DEST / '01 ALL SESSION WORK.pdf')
assert len(reader.pages) == report['totalPages']
top_level = sum(isinstance(item, dict) for item in reader.outline)
assert top_level == 13
assert report['lowestReadingTokenCoverage'] >= .99
files = sorted(SCRATCH.glob('page-*.png'))
assert len(files) == report['totalPages'], (len(files), report['totalPages'])
for batch in range(0, len(files), 40):
    sheet = Image.new('RGB', (1760, 1190), '#dce3ec')
    draw = ImageDraw.Draw(sheet)
    for index, source in enumerate(files[batch:batch + 40]):
        image = Image.open(source).convert('RGB')
        image.thumbnail((206, 208))
        col, row = index % 8, index // 8
        x, y = col * 220 + (220 - image.width) // 2, row * 238 + 23
        sheet.paste(image, (x, y))
        draw.text((col * 220 + 8, row * 238 + 5), f'Page {batch + index + 1}', fill='#1a365d')
    sheet.save(SCRATCH / f'contact-{batch // 40 + 1:02}.jpg', quality=86)
print(json.dumps({'pages':len(reader.pages), 'topLevelBookmarks':top_level, 'contactSheets':(len(files)+39)//40}))
