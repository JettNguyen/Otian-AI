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
             'phone/sw.js', 'phone/manifest.webmanifest', '.well-known/security.txt']:
    assert stage.public_file(path), path
print('Publication boundary: internal files excluded; public routes and assets included.')
