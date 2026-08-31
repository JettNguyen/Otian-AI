#!/usr/bin/env python3
"""check-styles.py: every size, shadow and radius on the site is a named token.

Why this exists. check-facts.py stops a price drifting and check-copy-length.py
stops a page growing. Neither watches the things a reader sees before they read
a word. With no build step, a font-size is chosen the way a shelf height would
be if nobody wrote the plan down: by eye, in the file being edited, next to
whatever happened to be there. By 2026-08-31 that had produced 69 distinct
font-size values doing sixteen jobs, and five different 1px shadows in three
inks. No single page looked wrong. The site just never looked deliberate, which
is a different and more expensive problem, because it is the one that makes a
reader price what we sell before they know what it is.

So this is the visual half of the same discipline: the ladders live in :root,
and every declaration has to name a rung. A new size stays possible; it stops
being accidental. Adding one means editing :root, where the whole scale is
visible at once and a near-duplicate is obvious.

What is deliberately NOT a failure: `inherit`, sizes in `em` (relative to their
parent on purpose), fluid `clamp()` display sizes, and text inside <svg>, whose
size comes from the drawing's geometry rather than the page's hierarchy. That
last exemption is the one CLAUDE.md already grants diagram labels in the word
budget, for the same reason. banner.html is a rendered image, not a page.

Raw hex colours are reported, never failed. Some are real drift (--danger
retyped in lowercase); some are correct (a third-party brand colour, a #000
mask channel that is an alpha channel rather than a colour). Telling them apart
needs a person, so this counts them and leaves the judgement alone.

Usage:
  python3 scripts/check-styles.py            # check, exit 1 on failure
  python3 scripts/check-styles.py --report   # also list what it let through
"""

import sys
import re
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# A font-size may be a rung, or one of these, each for a stated reason.
FONT_SIZE_OK = [
    (re.compile(r'^var\(--fs-[0-9a-z]+\)$'), "on the ladder"),  # name checked against :root below
    (re.compile(r'^inherit$'), "inherits"),
    (re.compile(r'^[\d.]+em$'), "relative to its parent on purpose"),
    (re.compile(r'^clamp\('), "fluid display size"),
]

# A box-shadow may be a token, or one of these. The distinction that matters is
# elevation versus everything else: a focus ring, an inset rule, a status dot's
# glow and the autofill hack all use the box-shadow property without being a
# light source, so a shared elevation token would say nothing true about them.
SHADOW_OK = [
    # app-security/ is the one page that mirrors the Archie app's palette rather than the site's
    # (RESTYLE.md: "stays mirroring the Archie app's own palette, documented exception"), so it
    # defines --shadow-card in its own light and dark blocks. Pointing it at a site token would
    # pass this check by importing the cream page's ink into a page that is deliberately not it.
    (re.compile(r'^var\(--shadow-card\)$'), "app-security's own palette, per RESTYLE.md"),
    (re.compile(r'^var\(--shadow-[a-z]+\)$'), "a token"),  # name checked against :root below
    (re.compile(r'^none$'), "removes one"),
    (re.compile(r'^inset\b'), "an inset rule, not an elevation"),
    (re.compile(r'^0 0 0 '), "a ring or spread, not an elevation"),
    (re.compile(r'^0 0 \d+px var\(--c-'), "a status dot's own glow"),
]

# Elevations that stay raw, by name, with the reason. Both cast black because
# they sit on imagery rather than on the cream page, where a warm shadow reads
# as a stain. Adding to this list is a deliberate act; write the reason here.
SHADOW_EXCEPTIONS = {
    "0 10px 34px rgba(0, 0, 0, 0.34)": "play control sitting on the video frame",
    "0 18px 44px rgba(0, 0, 0, 0.34)": "screenshot lifting off the page as a photo",
}

# Literals that duplicate a token's own value. Retyping one is how a token
# quietly stops being the single definition of anything.
RADIUS_DUPES = {"12px": "--radius", "8px": "--radius-sm"}

SKIP_FILES = {"banner.html"}

DECL = re.compile(r'(font-size|box-shadow|border-radius)\s*:\s*([^;}\n]+)')


def svg_spans(text):
    return [(m.start(), m.end()) for m in re.finditer(r'<svg\b.*?</svg>', text, re.S)]


def check(path):
    """Yield (line, property, value, why) for each declaration that fails."""
    text = path.read_text()
    spans = svg_spans(text) if path.suffix == ".html" else []
    starts = [m.start() for m in re.finditer(r'\n', text)]

    def line_of(i):
        lo, hi = 0, len(starts)
        while lo < hi:
            mid = (lo + hi) // 2
            if starts[mid] < i:
                lo = mid + 1
            else:
                hi = mid
        return lo + 1

    for m in DECL.finditer(text):
        if any(a <= m.start() < b for a, b in spans):
            continue
        prop, val = m.group(1), m.group(2).strip()

        if prop == "font-size":
            if not any(rx.match(val) for rx, _ in FONT_SIZE_OK):
                yield line_of(m.start()), prop, val, "not a rung of the type ladder in :root"

        elif prop == "box-shadow":
            if any(rx.match(val) for rx, _ in SHADOW_OK) or val in SHADOW_EXCEPTIONS:
                continue
            yield line_of(m.start()), prop, val, "an elevation that is not a --shadow-* token"

        elif prop == "border-radius":
            if val in RADIUS_DUPES:
                yield line_of(m.start()), prop, val, f"retypes {RADIUS_DUPES[val]}"


def hex_report():
    """Raw hex outside :root and the theme blocks. Counted, never failed."""
    text = (ROOT / "css/styles.css").read_text()
    depth, in_tokens, hits = 0, False, 0
    for line in text.split("\n"):
        if re.search(r'(^:root|\[data-theme)', line):
            in_tokens = True
        for ch in line:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    in_tokens = False
        if not in_tokens and re.search(r'#[0-9a-fA-F]{3,8}\b', line) and '/*' not in line:
            hits += 1
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    files = [ROOT / "css/styles.css"] + sorted(ROOT.glob("**/*.html"))
    files = [f for f in files if f.name not in SKIP_FILES and "node_modules" not in str(f)]

    # Every token a page names has to resolve, and where it resolves from depends
    # on whether the page links the shared stylesheet. Thirteen pages do not:
    # app-security/ is standalone on purpose and mirrors the tokens it needs into
    # its own :root. A var() that resolves nowhere does not fall back to the old
    # literal, it drops the declaration, so an unresolvable --fs- rung is not a
    # style nit but a font-size that silently stopped applying. This checks the
    # thing that actually matters rather than the name's shape.
    css = (ROOT / "css/styles.css").read_text()
    shared = set(re.findall(r'(--[0-9a-z-]+)\s*:', css))

    failures = []
    for f in files:
        text = f.read_text()
        for line, prop, val, why in check(f):
            failures.append((f.relative_to(ROOT), line, prop, val, why))
        scope = set(re.findall(r'(--[0-9a-z-]+)\s*:', text))
        # An actual <link>, not the string: app-security/ mentions css/styles.css
        # three times in comments explaining why it does NOT link it, which is
        # exactly the page this rule exists to protect.
        if re.search(r'<link[^>]+href="[^"]*styles\.css', text):
            scope |= shared
        for m in re.finditer(r'var\((--(?:fs|shadow|radius)[0-9a-z-]*)\)', text):
            if m.group(1) not in scope:
                failures.append((f.relative_to(ROOT), 0, "var", m.group(1),
                                 "names a token nothing in this page's scope defines"))

    if args.report:
        css = (ROOT / "css/styles.css").read_text()
        rungs = sorted(set(re.findall(r'--fs-[0-9a-z]+', css)))
        shadows = sorted(set(re.findall(r'--shadow-[a-z]+', css)))
        print(f"type ladder: {len(rungs)} rungs  {' '.join(r.replace('--fs-', '') for r in rungs)}")
        print(f"shadows:     {len(shadows)} tokens {' '.join(s.replace('--shadow-', '') for s in shadows)}")
        print(f"exceptions:  {len(SHADOW_EXCEPTIONS)} raw elevations, each with a reason in this file")

    loose = hex_report()
    if loose:
        print(f"check-styles: note, {loose} lines carry a raw hex colour outside the token blocks. "
              f"Some are drift, some are correct (a brand colour, a #000 mask channel). Not failed.")

    if failures:
        print()
        for rel, line, prop, val, why in failures:
            print(f"check-styles: {rel}:{line}  {prop}: {val}  ({why})")
        print(f"\n{len(failures)} declaration(s) off the ladder. Name a token in css/styles.css :root, "
              f"or add the exception here with its reason.")
        return 1

    print(f"check-styles: clean. {len(files)} files, every size, shadow and radius named.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
