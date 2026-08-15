#!/usr/bin/env python3
"""Fail on any price or em dash the site is not allowed to print.

Two rules from CLAUDE.md, both of which have been broken before by hand-editing sixty
static pages, and neither of which any tool was checking:

  1. FACTS.md lists every money figure the site may print. The same price is typed into
     eleven files because there is no build step, and that is exactly how a site ends up
     saying 18 in one place and 200+ in another.
  2. No em dashes in served content. The site was swept to zero on 2026-07-24.

The two rules have deliberately different scopes. Em dashes are checked in CSS and JS
comments too, because CLAUDE.md says so and because a comment gets copied into copy.
Money is checked only where a visitor can read it: HTML and the catalog JSON. A CSS
comment reasoning about how a "$49, on your computer" row wraps is not a price claim,
and putting it through the same gate would mean either a wrong entry in FACTS.md or an
exceptions list that grows until nobody runs the check.

Usage:  python3 scripts/check-facts.py
Exit 0 when clean, 1 with a report otherwise.
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SKIP_DIRS = {".git", ".claude", "node_modules", "firebase-hosting", "scripts"}

# Repo-internal prose. Not served, and TRUST.md/FACTS.md quote the very things being checked.
SKIP_FILES = {
    "CLAUDE.md",
    "TRUST.md",
    "FACTS.md",
    "README.md",
    "PRICING-ONETIME-MIGRATION.md",
    "preview.html",
}

MONEY = re.compile(r"\$\d[\d,]*(?:\.\d+)?")
EM_DASH = re.compile(r"—|&mdash;|&#8212;|&#x2014;")

# A figure in a FACTS.md table row, e.g. "| `$149` | Archie, billed yearly | ... |"
FACTS_ROW = re.compile(r"^\|\s*`(\$[\d,]*(?:\.\d+)?)`")


def allowed_figures(facts_path):
    figures = set()
    with open(facts_path, encoding="utf-8") as fh:
        for line in fh:
            match = FACTS_ROW.match(line)
            if match:
                figures.add(match.group(1))
    return figures


def served_files():
    """(relative path, checked_for_money) for everything a visitor can read."""
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, ROOT)
            if rel in SKIP_FILES or os.path.basename(rel) in SKIP_FILES:
                continue
            if name.endswith(".html"):
                yield rel, True
            elif name.endswith(".json") and (rel.startswith("data/") or rel.startswith("assets/")):
                yield rel, True
            elif name.endswith((".js", ".css")) and (rel.startswith("js/") or rel.startswith("css/")):
                yield rel, False
            elif name.endswith(".md") and rel.startswith("blog/"):
                yield rel, False


def main():
    facts_path = os.path.join(ROOT, "FACTS.md")
    if not os.path.exists(facts_path):
        print("check-facts: FACTS.md is missing; nothing to check against.")
        return 1

    figures = allowed_figures(facts_path)
    if not figures:
        print("check-facts: FACTS.md has no figures in it. Has the table format changed?")
        return 1

    unknown = []
    dashes = []
    scanned = 0

    for rel, check_money in served_files():
        scanned += 1
        with open(os.path.join(ROOT, rel), encoding="utf-8", errors="ignore") as fh:
            for lineno, line in enumerate(fh, 1):
                if check_money:
                    for found in MONEY.findall(line):
                        # "$100," picks up sentence punctuation; compare the figure itself.
                        if found.rstrip(",") not in figures:
                            unknown.append((rel, lineno, found, line.strip()[:110]))
                if EM_DASH.search(line):
                    dashes.append((rel, lineno, line.strip()[:110]))

    if unknown:
        print("Figures not listed in FACTS.md (%d):\n" % len(unknown))
        for rel, lineno, found, ctx in unknown:
            print("  %s:%d  %s" % (rel, lineno, found))
            print("      %s" % ctx)
        print("\nAdd the figure to FACTS.md with where it comes from, or fix the page.\n")

    if dashes:
        print("Em dashes in served content (%d):\n" % len(dashes))
        for rel, lineno, ctx in dashes:
            print("  %s:%d" % (rel, lineno))
            print("      %s" % ctx)
        print("\nRestructure with a colon, comma, semicolon, period, or parentheses.\n")

    if unknown or dashes:
        return 1

    print("check-facts: clean. %d files scanned, %d figures allowed." % (scanned, len(figures)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
