#!/usr/bin/env python3
"""Check the linked PDF and current Terms acceptance version against their sources."""
from pathlib import Path
import hashlib
import json
import re
ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / 'standard/index.html').read_text()
main = re.search(r'<main\b[^>]*>[\s\S]*?</main>', source)[0]
main = re.sub(r'<!--[\s\S]*?-->', '', main)
stamp = json.loads((ROOT / 'scripts/standard-pdf-source.json').read_text())
assert hashlib.sha256(main.encode()).hexdigest() == stamp['mainHash'], 'Regenerate the Standard PDF after editing its source'
assert hashlib.sha256((ROOT / 'assets/Otian-Standard.pdf').read_bytes()).hexdigest() == stamp['pdfHash'], 'PDF does not match its generation record'
terms = (ROOT / 'terms-of-service/index.html').read_text()
version = re.search(r'data-terms-version="([^"]+)"', terms)[1]
record = json.loads((ROOT / f'terms-of-service/versions/{version}.json').read_text())
main = re.search(r'<main\b[^>]*>[\s\S]*?</main>', terms)[0]
assert record == {'version': version, 'html': main}, 'Archive the current Terms content under its acceptance version'
app = ROOT.parent / 'Archie/crates/archie-core/src/auth.rs'
if app.exists():
    assert f'TERMS_VERSION: &str = "{version}";' in app.read_text(), 'App acceptance version differs from the current Terms'
print('Policy artifacts: PDF matches the Standard; Terms match their versioned record and local app when available.')
