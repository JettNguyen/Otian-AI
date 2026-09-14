#!/usr/bin/env python3
"""check-nav.py: every page's menus say the same thing.

There is no build step and no templating, so the nav is typed into every page three times
over: the desktop dropdowns, the mobile drawer's flyouts, and the footer's columns. Seventy-
odd pages times three copies is the one thing on this site that cannot be kept right by
reading it, and the failure is quiet in the worst way: a sweep that matches the desktop menu
and misses the footer leaves a retired link live in the place readers actually reach for.

It is not hypothetical. When equipment/ was merged into how-it-works/ on 2026-09-14, the
sweep that pulled "What to Run It On" out of the menus matched the href it had on the other
71 pages, "../how-it-works/#what-to-run-it-on". On how-it-works/ itself that link had been
rewritten to the same-page form, "#what-to-run-it-on", so all three copies survived there and
nowhere else. The visible symptom was two items in one dropdown lit at once, which reads as a
styling bug and is not one.

So: no canonical list is written down here. The majority of pages IS the canonical list, per
menu, and any page that disagrees is named with what it has extra and what it is missing.
That way a deliberate change needs no edit to this file, and an accidental one cannot hide.
Redirect stubs are skipped: their nav is a snapshot of the day they stopped being pages.

    python3 scripts/check-nav.py
"""

import collections
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REDIRECT = re.compile(r'http-equiv=["\']refresh', re.I)
HREF = re.compile(r'href="([^"]+)"')

# Each entry is a menu's name and the pattern that finds its one block on a page. The
# dropdowns and flyouts are found by id and the footer columns by the label they carry, so a
# renamed column shows up as a missing menu rather than as silent drift.
BLOCKS = [
    ("top bar", r'<div class="nav-links"[^>]*>(.*?)</nav>'),
    ("drawer", r'<nav class="nav-drawer"[^>]*>(.*?)</nav>'),
]
BY_ID = ["navArchieMenu", "navAddonsMenu", "navCompareMenu", "navCompanyMenu",
         "navDrawerFlyoutArchie", "navDrawerFlyoutAddons", "navDrawerFlyoutCompare",
         "navDrawerFlyoutCompany"]
# The footer's columns are found rather than listed, so adding one is covered the day it
# lands and renaming one shows up as a column the rest of the site has and this page does not.
FOOTER = re.compile(r'<nav class="footer-nav-links" aria-label="([^"]+)">(.*?)</nav>', re.S)


def norm(href, page):
    """A link's destination, as the same string no matter which page it is typed on."""
    if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
        return href
    path, _, frag = href.partition("#")
    if not path:
        # a bare "#thing" is this page's own anchor, and it has to normalise to the same
        # string another page would write for it, or every self-link reads as drift
        path = os.path.basename(page)
    target = os.path.normpath(os.path.join(os.path.dirname(page), path)).replace(os.sep, "/")
    if target.endswith("/index.html"):
        target = target[: -len("/index.html")]      # so a self-link matches a link in
    elif target == "index.html":                    # from anywhere else
        target = ""
    return "/" + target.strip("/") + ("#" + frag if frag else "")


def menus_of(page, html):
    out = {}
    for name, pat in BLOCKS:
        m = re.search(pat, html, re.S)
        if m:
            # the top bar and drawer carry the dropdown blocks inside them; those are checked
            # on their own, so what is compared here is only what sits at the top level
            inner = re.sub(r'<div class="nav-more-menu".*?</div>', "", m.group(1), flags=re.S)
            inner = re.sub(r'<div class="nav-drawer-flyout.*', "", inner, flags=re.S)
            out[name] = tuple(norm(h, page) for h in HREF.findall(inner))
    for ident in BY_ID:
        m = re.search(r'id="%s"[^>]*>(.*?)</div>' % ident, html, re.S)
        if m:
            out[ident] = tuple(norm(h, page) for h in HREF.findall(m.group(1)))
    for label, inner in FOOTER.findall(html):
        out["footer: " + label] = tuple(norm(h, page) for h in HREF.findall(inner))
    return out


def main():
    pages = {}
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", "__pycache__", "assets")]
        for f in files:
            if f != "index.html":
                continue
            path = os.path.join(base, f)
            html = open(path, encoding="utf-8").read()
            if REDIRECT.search(html):
                continue
            # app-auth/ and app-security/ are the app's hand-off pages and carry no site nav
            # at all, on purpose. A page with no nav has nothing to disagree with.
            if '<nav class="nav"' not in html:
                continue
            rel = os.path.relpath(path, ROOT)
            pages[rel] = menus_of(rel, html)

    shapes = collections.defaultdict(collections.Counter)
    for menus in pages.values():
        for name, links in menus.items():
            shapes[name][links] += 1

    problems = 0
    for name in sorted(shapes):
        canon, agree = shapes[name].most_common(1)[0]
        # A menu that most of the site carries and one page does not is the same bug wearing
        # the other face: the sweep that should have edited every copy created one instead.
        everywhere = sum(shapes[name].values()) >= len(pages) * 0.8
        for page in sorted(pages):
            got = pages[page].get(name)
            if got is None:
                if everywhere:
                    print("  %s: %s does not have it, and %d pages do"
                          % (name, page, sum(shapes[name].values())))
                    problems += 1
                continue
            if got == canon:
                continue
            extra = [x for x in got if x not in canon]
            missing = [x for x in canon if x not in got]
            print("  %s: %s disagrees with the other %d pages" % (name, page, agree))
            for x in extra:
                print("      has, and they do not:  %s" % x)
            for x in missing:
                print("      they have, it does not: %s" % x)
            if not extra and not missing:
                print("      same links, different order: %s" % (got,))
            problems += 1

    if problems:
        print("check-nav: %d menus disagree. Every copy of a menu has to be edited, "
              "not just the one you can see." % problems)
        return 1
    print("check-nav: clean. %d pages, %d menus each, every copy the same."
          % (len(pages), len(shapes)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
