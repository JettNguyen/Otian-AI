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
PAGES = set('about account activity admin ai-explained app app-auth app-security archie auth-action billing blog business compare consulting contact docs equipment faq guided-setup help how-it-works individuals learn login our-story phone privacy-policy questionnaire security services setup-call skills-marketplace standard terms-of-service testimonials trust unsubscribe what-you-need'.split())
ROOT_FILES = {'.nojekyll', 'CNAME', 'index.html', '404.html', 'banner.html', 'llms.txt', 'robots.txt', 'sitemap.xml'}
ASSET_TYPES = {'.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.mp4', '.webm', '.vtt', '.woff', '.woff2'}
EXTRA = {'assets/articles.json', 'assets/ai-glossary-final.md', 'data/public-catalog.json',
         'docs/search.json',  # what the docs' search box reads (scripts/gen-docs.mjs)
         '.well-known/security.txt', '.well-known/microsoft-identity-association.json',
         'phone/sw.js', 'phone/manifest.webmanifest', 'terms-of-service/versions/2026-09-14.json',
         # Who Archie is, as Shopify's catalog reads it: fetched by Shopify on every product search
         # the Archie app makes (archie_net::shopify::AGENT_PROFILE). Moving it breaks every search.
         'ucp/agent.json',
         # Who Archie is when it signs in to an app that reads client documents (Shop): the
         # address is the app's client id (archie_net::mcp_auth::CLIENT_DOCUMENT), and a server
         # fetches it on every sign-in. Moving or editing it breaks every one of those sign-ins.
         'archie/oauth-client.json'}
# Images no page, stylesheet, script or generator uses (checked 2026-11-13): old screenshots, and
# the portraits' full-size originals, which the 300px cuts replaced on 2026-11-12. They stay in the
# repo and off the site, where they were 15 MB of every deploy. stage() stops if a page names one.
NOT_SERVED = {'assets/Archie-Chat-SS.png', 'assets/Archie-Name-SS.png', 'assets/Archie-Overview-SS.png',
              'assets/business-calendar-ss.png', 'assets/business-inquiry-ss.png',
              'assets/evening-ss.png', 'assets/hevy-appt-ss.png', 'assets/jack-portrait.PNG',
              'assets/jett-portrait.png', 'assets/jett-portrait square.png'}
TEXT_TYPES = {'.html', '.css', '.js', '.json', '.md', '.txt', '.xml', '.webmanifest'}

def public_file(rel):
    p = Path(rel)
    if rel in NOT_SERVED:
        return False
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
    kept_off = {r for rel in NOT_SERVED for r in (rel, rel.replace(' ', '%20'))}
    for staged in destination.rglob('*'):
        if staged.suffix in TEXT_TYPES:
            text = staged.read_text(encoding='utf-8', errors='ignore')
            used = sorted(r for r in kept_off if r in text)
            if used:
                raise ValueError(f'{staged.relative_to(destination)} uses {used[0]}, which NOT_SERVED '
                                 'keeps off the site; take it off that list to publish it again')
    revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    (destination / 'deployment.json').write_text(json.dumps({'revision': revision}) + '\n')
    print(f'Staged {count} public files in {destination}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    stage(parser.parse_args().output)
