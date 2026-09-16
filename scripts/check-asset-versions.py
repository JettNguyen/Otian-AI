#!/usr/bin/env python3
"""Every asset a page pulls carries a version, and they all carry the same one.

There is no build step, so the only cache-busting lever this site has is the query string.
GitHub Pages serves css/ and js/ with `max-age=14400`, and that cache lives at the CDN edge
rather than in the browser, so a reader who visited this morning can hold a four-hour-old file
that no hard refresh will shift. Changing the URL is what shifts it.

That rule was written down for the stylesheet and only for the stylesheet, and on 2026-09-16
it cost exactly what it was written to prevent: Ember shipped four new moves and a backflip,
css/styles.css got a new version, js/ember.js did not, and a second device ran the new
keyframes against the old script. Ember hopped. Everything else in the change was on the
device and unreachable. A half-deployed change is worse than an undeployed one, because
nothing about it looks broken.

So the version is one stamp for the whole deploy, on every local asset a page names:

  * every <link> to css/styles.css
  * every <script src> pointing inside js/
  * every module specifier inside js/*.js, because a versioned entry point that imports
    "./faces.js" bare pulls a stale module through a fresh one

Run from anywhere:  python3 scripts/check-asset-versions.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", "node_modules", "scripts", "assets", "data"}

# A local asset reference: href/src into css/ or js/, with or without a version.
REF = re.compile(r'(?:href|src)="((?:\.\./)*/?(?:css|js)/[A-Za-z0-9._-]+\.(?:css|js))(\?v=([0-9A-Za-z.-]+))?"')
# A local module specifier inside a JS file, with or without a version.
MOD = re.compile(r"""from\s+['"](\./[A-Za-z0-9._-]+\.js)(\?v=([0-9A-Za-z.-]+))?['"]""")


def pages():
    for p in sorted(ROOT.rglob("*.html")):
        if not SKIP_DIRS & set(p.relative_to(ROOT).parts):
            yield p


def main() -> int:
    bare: list[str] = []
    stamps: dict[str, list[str]] = {}

    def note(rel: str, asset: str, version: str | None) -> None:
        if not version:
            bare.append(f"{rel}: {asset} has no ?v=")
        else:
            stamps.setdefault(version, []).append(f"{rel}: {asset}")

    files = 0
    refs = 0
    for p in pages():
        files += 1
        for asset, _, version in REF.findall(p.read_text(encoding="utf-8")):
            refs += 1
            note(str(p.relative_to(ROOT)), asset, version)
    for p in sorted((ROOT / "js").glob("*.js")):
        for asset, _, version in MOD.findall(p.read_text(encoding="utf-8")):
            refs += 1
            note(str(p.relative_to(ROOT)), asset, version)

    if bare:
        print(f"check-asset-versions: {len(bare)} reference(s) carry no version.")
        print("  A returning reader gets these from the edge cache for up to four hours.")
        for line in bare[:20]:
            print(f"  {line}")
        if len(bare) > 20:
            print(f"  ... and {len(bare) - 20} more")
        return 1

    if len(stamps) > 1:
        print(f"check-asset-versions: {len(stamps)} different versions are live at once.")
        print("  One stamp per deploy, or half the assets update and half do not.")
        for version in sorted(stamps):
            where = stamps[version]
            print(f"  {version}: {len(where)} reference(s), e.g. {where[0]}")
        return 1

    only = next(iter(stamps)) if stamps else "none"
    print(f"check-asset-versions: clean. {refs} references in {files} pages, all at {only}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
