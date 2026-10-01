#!/usr/bin/env python3
"""Rebuild the Chinese font subset from the text actually shipped in public/.

Run after changing Chinese copy: python3 scripts/build-font.py
Needs: pip install fonttools brotli. The pinned OFL source is downloaded once
into .cache/ and verified against its SHA-256 before use.
"""
from pathlib import Path
import hashlib, json, urllib.request
from fontTools.ttLib import TTFont
from fontTools import subset

root = Path(__file__).resolve().parents[1]
dest = root / 'public/brand/v2/fonts'
sources = json.loads((dest / 'SOURCES.json').read_text())
source = next(x for x in sources['files'] if x['family'] == 'notosanssc' and x['name'].endswith('.ttf'))
cache = root / '.cache' / source['name']
if not cache.exists():
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_bytes(urllib.request.urlopen(source['url']).read())
assert hashlib.sha256(cache.read_bytes()).hexdigest() == source['sha256'], 'Source font hash mismatch'

chars = {chr(c) for c in range(32, 127)}
for p in (root / 'public').rglob('*'):
    if p.is_file() and p.suffix in {'.html', '.css'}:
        chars.update(p.read_text())

font = TTFont(cache)
options = subset.Options(); options.flavor = 'woff2'; options.desubroutinize = True
sub = subset.Subsetter(options=options); sub.populate(text=''.join(sorted(chars))); sub.subset(font)
target = dest / 'noto-sans-sc-ui.woff2'; font.flavor = 'woff2'; font.save(target)
report = {'sourceSHA256': source['sha256'], 'sourceCommit': sources['commit'], 'requestedCodepoints': len(chars),
          'glyphs': len(font.getBestCmap()), 'bytes': target.stat().st_size,
          'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'note': 'Subset of the text shipped in public/.'}
(dest / 'UI-SUBSET.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
