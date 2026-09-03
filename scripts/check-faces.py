#!/usr/bin/env python3
"""The site's add-on faces are the app's, and this says when they stop being.

js/faces.js is a copy of the Archie app's src/app/faces.ts: the marks, and which add-on wears
which. The app is the source; the site never edits its own copy. This checks three things:

  * Every mark the app draws is drawn here with the same paths, and nothing extra is drawn here.
  * Every face the app assigns is assigned here to the same mark, and nothing is assigned here
    that the app does not assign.
  * Every add-on in the app's catalog (data/marketplace in the Archie checkout) that the app
    gives a face is given one here. Personalities are exempt on both sides by design.

It reads the Archie checkout at the path CLAUDE.md names for verifying trust claims. Without that
checkout there is nothing to compare against, so it says so and passes, rather than failing every
CI run on a computer without the app source.

Run from anywhere:  python3 scripts/check-faces.py
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_JS = ROOT / "js" / "faces.js"
ARCHIE = Path("/Users/Games/Desktop/Code/Archie")
APP_TS = ARCHIE / "src" / "app" / "faces.ts"
APP_MARKET = ARCHIE / "data" / "marketplace"

# The app's kind for each catalog folder, in the names js/faces.js keys by.
FOLDER = {"skill": "skills", "specialist": "subagents", "routine": "routines"}


def glyphs(src: str) -> dict[str, list[str]]:
    """Mark name -> path list, from either file: both write one mark per line as `name: [...]`."""
    out = {}
    for name, body in re.findall(r"^\s{2}(\w+):\s*(\[.*\]),?$", src, re.M):
        out[name] = json.loads(body)
    return out


def faces(src: str) -> dict[str, str]:
    return dict(re.findall(r'"([a-z]+:[a-z0-9-]+)":\s*"(\w+)"', src))


def main() -> int:
    if not APP_TS.exists():
        print(f"check-faces: no Archie checkout at {ARCHIE}, nothing to compare against. Skipped.")
        return 0

    site = SITE_JS.read_text()
    app = APP_TS.read_text()
    site_glyphs, app_glyphs = glyphs(site), glyphs(app)
    site_faces, app_faces = faces(site), faces(app)
    if not site_glyphs or not site_faces:
        print("check-faces: could not read marks or faces from js/faces.js. Has the shape changed?")
        return 1

    problems: list[str] = []

    for name in sorted(set(app_glyphs) | set(site_glyphs)):
        if name not in site_glyphs:
            problems.append(f"the app draws '{name}' and the site does not.")
        elif name not in app_glyphs:
            problems.append(f"the site draws '{name}', which the app no longer has.")
        elif site_glyphs[name] != app_glyphs[name]:
            problems.append(f"'{name}' is drawn differently on the site and in the app.")

    for key in sorted(set(app_faces) | set(site_faces)):
        if key not in site_faces:
            problems.append(f"the app gives {key} the '{app_faces[key]}' mark and the site has no entry.")
        elif key not in app_faces:
            problems.append(f"the site gives {key} a face and the app does not.")
        elif site_faces[key] != app_faces[key]:
            problems.append(
                f"{key} wears '{site_faces[key]}' on the site and '{app_faces[key]}' in the app."
            )

    for kind, folder in FOLDER.items():
        for p in sorted((APP_MARKET / folder).glob("*.json")):
            addon = json.loads(p.read_text())["id"]
            if f"{kind}:{addon}" not in site_faces:
                problems.append(f"{kind}:{addon} is in the app's catalog and has no face on the site.")

    if problems:
        print(f"check-faces: {len(problems)} problem(s). js/faces.js is a copy of the app's"
              f" src/app/faces.ts; fix it there, then copy.\n")
        for line in problems:
            print("  " + line)
        return 1

    print(f"check-faces: clean. {len(site_glyphs)} marks and {len(site_faces)} faces match the app.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
