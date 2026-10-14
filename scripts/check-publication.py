#!/usr/bin/env python3
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('stage', Path(__file__).with_name('stage-site.py'))
stage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)
for path in ['WAR-ROOM.md', 'HUDSON-DASHBOARD.md', 'TRUST.md', 'FACTS.md', 'README.md',
             'scripts/check-facts.py', 'blog/articles-roadmap.md', 'assets/internal.md',
             'data/customer-records.json', '.git/config', '.env', 'cp7/Default/History',
             'firebase-hosting/index.html', 'preview.html', 'assets/demo.master.mp4']:
    assert not stage.public_file(path), path
for path in ['index.html', 'archie/personal/index.html', 'archie/business/index.html',
             'services/index.html', 'assets/Otian-Standard.pdf', 'js/access.js',
             'phone/sw.js', 'phone/manifest.webmanifest', '.well-known/security.txt',
             'app/index.html']:
    assert stage.public_file(path), path

# Every page folder is published or named here as kept off the site. `app/` was made on September
# 18, 2026 and never added to PAGES, so every phone link to otianai.com/app (a teammate's join link,
# a pairing code opened by a phone's own camera) was a 404 until October 14, while every check
# above passed. A new page folder now has to be decided on rather than forgotten.
KEPT_OFF = {'firebase-hosting'}  # The redirect-only Firebase Hosting root; see firebase.json.
root = Path(__file__).resolve().parent.parent
for page in sorted(root.glob('*/index.html')):
    folder = page.parent.name
    if folder.startswith('.') or folder in KEPT_OFF:
        continue
    assert stage.public_file(f'{folder}/index.html'), (
        f'{folder}/index.html is not published. Add {folder!r} to PAGES in scripts/stage-site.py, '
        'or to KEPT_OFF here if it must stay off the site.'
    )
print('Publication boundary: internal files excluded; public routes and assets included.')
