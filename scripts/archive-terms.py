#!/usr/bin/env python3
"""Write the current Terms body under the version recorded on its main element."""
from pathlib import Path
import argparse
import json
import re

ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / 'terms-of-service/index.html').read_text()
version = re.search(r'data-terms-version="([^"]+)"', source)[1]
body = re.search(r'<main\b[^>]*>[\s\S]*?</main>', source)[0]
wanted = json.dumps({'version': version, 'html': body}, indent=2) + '\n'
target = ROOT / 'terms-of-service' / 'versions' / f'{version}.json'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
if args.check:
    if not target.exists() or target.read_text() != wanted:
        raise SystemExit('Terms archive is stale. Run python3 scripts/archive-terms.py')
    print(f'Terms archive: {version} is current.')
else:
    target.parent.mkdir(exist_ok=True)
    target.write_text(wanted)
    print(f'Archived Terms version {version}.')
