#!/usr/bin/env python3
"""check-links.py: every internal link goes somewhere, and none of them goes through a stub.

Two rules, and the second is the one that keeps costing us.

1. An internal link resolves to a file that exists. Nothing exotic: there is no build step
   here, so a moved page is a moved directory and every link to it is a separate edit.

2. **No page links to a redirect stub.** The stubs exist so that a bookmark, a search result
   or somebody else's link keeps landing somewhere after a page moves. They are not a way for
   this site to reach its own pages. Linking through one spends the reader a round trip, and
   it is how a link rots: a stub is the file nobody re-reads, so the day its target moves
   again the link breaks twice over.

   Ten of these were live on 2026-09-14, every one of them a leftover from the two merges
   that week: the homepage, the FAQ, the terms, both edition pages, the install page, the
   pricing breadcrumb, billing and a comparison page were all still pointing at
   guided-setup/, consulting/, equipment/ or archie/, which had all become stubs. They
   worked, which is exactly why nobody noticed.

Stubs themselves are skipped: what a stub links to does not matter, it redirects.

    python3 scripts/check-links.py
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REDIRECT = re.compile(r'http-equiv=["\']refresh', re.I)
HREF = re.compile(r'href="([^"]+)"')
SKIP_DIRS = {".git", "node_modules", "__pycache__"}


def main():
    pages, stubs = {}, {}
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        if "index.html" not in files:
            continue
        path = os.path.join(base, "index.html")
        html = open(path, encoding="utf-8").read()
        # A script builds hrefs out of string pieces, so its "href=" is not a link; a comment's
        # is a link that was deliberately taken down. Neither is the page's.
        html_links = re.sub(r"<script\b.*?</script>", "", html, flags=re.S | re.I)
        html_links = re.sub(r"<!--.*?-->", "", html_links, flags=re.S)
        rel = os.path.relpath(path, ROOT)
        if REDIRECT.search(html):
            m = re.search(r'url=([^"\']+)', html)
            stubs["/" + os.path.dirname(rel).replace(os.sep, "/")] = (m.group(1) if m else "?")
        else:
            pages[rel] = html_links

    missing, through = [], []
    for rel, html in sorted(pages.items()):
        base = os.path.dirname(rel)
        for href in sorted(set(HREF.findall(html))):
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:")):
                continue
            path = href.split("#")[0].split("?")[0]
            if not path:
                continue
            # A leading slash is from the site root, not from this page
            joined = path.lstrip("/") if path.startswith("/") else os.path.join(base, path)
            target = os.path.normpath(joined).replace(os.sep, "/")
            full = os.path.join(ROOT, target)
            if os.path.isdir(full):
                key = "/" + target.rstrip("/")
                if key in stubs:
                    through.append((rel, href, key, stubs[key]))
                    continue
                full = os.path.join(full, "index.html")
            if not os.path.exists(full):
                missing.append((rel, href))

    for rel, href in missing:
        print("  broken: %-40s -> %s" % (rel, href))
    for rel, href, key, dest in through:
        print("  through a stub: %-34s -> %s   (%s redirects to %s)" % (rel, href, key, dest))

    if missing or through:
        print("\ncheck-links: %d broken, %d going through a redirect stub. A stub is for other"
              " people's links, not for ours: point at the real page." % (len(missing), len(through)))
        return 1
    print("check-links: clean. %d pages, %d redirect stubs, no link through one." %
          (len(pages), len(stubs)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
