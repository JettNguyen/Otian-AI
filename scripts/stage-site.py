#!/usr/bin/env python3
"""Publish an explicit set of public file types under approved site directories.

Internal documents, tooling, browser profiles and deployment configuration can never
enter the artifact merely because somebody adds them to the repository.
"""
from pathlib import Path
import argparse
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PAGES = set('about account activity admin ai-explained app-auth app-security archie auth-action billing blog business compare consulting contact equipment faq guided-setup help how-it-works individuals learn login our-story phone privacy-policy questionnaire security services skills-marketplace standard terms-of-service testimonials trust unsubscribe what-you-need'.split())
ROOT_FILES = {'.nojekyll', 'CNAME', 'index.html', '404.html', 'banner.html', 'llms.txt', 'robots.txt', 'sitemap.xml'}
ASSET_TYPES = {'.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.mp4', '.webm', '.woff', '.woff2'}
EXTRA = {'assets/articles.json', 'assets/ai-glossary-final.md', 'data/public-catalog.json',
         '.well-known/security.txt', '.well-known/microsoft-identity-association.json',
         'phone/sw.js', 'phone/manifest.webmanifest', 'terms-of-service/versions/2026-09-14.json',
         # Who Archie is, as Shopify's catalog reads it: fetched by Shopify on every product search
         # the Archie app makes (archie_net::shopify::AGENT_PROFILE). Moving it breaks every search.
         'ucp/agent.json'}

def public_file(rel):
    p = Path(rel)
    if any(part.startswith('.') for part in p.parts) and rel not in ROOT_FILES | EXTRA:
        return False
    if rel in ROOT_FILES | EXTRA:
        return True
    top = p.parts[0]
    if top in PAGES and p.suffix == '.html':
        return True
    if top == 'archie' and p.suffix == '.json':
        return True  # Desktop update manifests, including the Business channel.
    if top == 'assets' and p.suffix.lower() in ASSET_TYPES and '.master.' not in p.name:
        return True
    return (top == 'css' and p.suffix == '.css') or (top == 'js' and p.suffix == '.js')

def stage(destination):
    destination = destination.resolve()
    if destination == ROOT or ROOT.is_relative_to(destination):
        raise ValueError('Output must not contain the source checkout')
    destination.mkdir(parents=True, exist_ok=True)
    if any(destination.iterdir()):
        raise ValueError('Output must be empty; refusing to delete existing files')
    count = 0
    for source in ROOT.rglob('*'):
        if source.is_symlink() or not source.is_file() or destination in source.parents:
            continue
        rel = source.relative_to(ROOT).as_posix()
        if not public_file(rel):
            continue
        target = destination / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        count += 1
    revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    (destination / 'deployment.json').write_text(json.dumps({'revision': revision}) + '\n')
    print(f'Staged {count} public files in {destination}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    stage(parser.parse_args().output)
