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

import datetime
import json
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


# A "Checked: 2026-08-19" stamp on a row in FACTS.md's "Other companies' prices" table, or a
# bare date in the last cell of a TRUST.md competitor-claim row.
CHECKED = re.compile(r"Checked:\s*(\d{4})-(\d{2})-(\d{2})")
TRUST_CLAIM_ROW = re.compile(r"^\|.*\|\s*`?https?://[^`|]+`?\s*\|\s*(\d{4})-(\d{2})-(\d{2})\s*\|")
STALE_AFTER_DAYS = 90


def stale_competitor_claims(today):
    """Rows about other companies whose source was last read too long ago.

    Our own prices change when we change them, so FACTS.md's file-level "last reconciled" line
    is enough for those. Another company's price changes without telling us, and a comparison
    page quoting last year's number is a false public statement about a third party, which
    TRUST.md treats as worse than a mistake about ourselves. So those rows date themselves and
    this check fails when the date goes cold.
    """
    stale = []
    for name in ("FACTS.md", "TRUST.md"):
        path = os.path.join(ROOT, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as fh:
            for lineno, line in enumerate(fh, 1):
                match = CHECKED.search(line) or TRUST_CLAIM_ROW.match(line)
                if not match:
                    continue
                y, m, d = (int(part) for part in match.groups()[:3])
                try:
                    checked = datetime.date(y, m, d)
                except ValueError:
                    stale.append((name, lineno, "not a real date", line.strip()[:90]))
                    continue
                age = (today - checked).days
                if age > STALE_AFTER_DAYS:
                    stale.append((name, lineno, "%d days old" % age, line.strip()[:90]))
    return stale


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


# The four collections the store sells from, per COLLECTIONS in js/catalog.js. `resources` and
# `assets` live alongside them in the Archie repo and are not add-ons, so they are not counted.
SOLD_COLLECTIONS = ("personalities", "skills", "subagents", "routines")

# Where the catalog is authored. CI seeds these files into the Firestore collections the site
# reads, so this directory is the number, and the site's stat rows have to match it.
ARCHIE_CATALOG = os.path.join(
    os.path.dirname(ROOT), "Archie", "data", "marketplace"
)

# Two markup shapes print these counts and both have to be read. .stat-row (the marketplace
# and the compare hub) pairs .stat-num with .stat-label; .hm-numbers (the homepage band) puts
# the figure in a <b> inside .hm-num-top and labels it with .hm-num-label. Matching only the
# first meant the homepage's count was never checked at all.
STAT_NUM = re.compile(
    r'<span class="stat-num">([\d,]+)</span>\s*<span class="stat-label">([^<]+)</span>'
    r'|<b>([\d,]+)</b></span>\s*<span class="hm-num-label">([^<]+)</span>',
    re.S,
)


def catalog_count():
    """How many add-ons a visitor can install, or None if the Archie repo isn't here.

    Private manifests are skipped, decided by Jett 2026-09-01. The count was the whole directory
    until then, and by that day 18 of the 153 were `visibility: private`: one client's sales pack
    and two items for a testing account. Those reach allowlisted accounts only, so a reader who opened
    the store to check the number on the page would have counted 135 and found the site 18 out.
    """
    if not os.path.isdir(ARCHIE_CATALOG):
        return None
    total = 0
    for coll in SOLD_COLLECTIONS:
        path = os.path.join(ARCHIE_CATALOG, coll)
        if not os.path.isdir(path):
            return None
        for name in os.listdir(path):
            if not name.endswith(".json"):
                continue
            with open(os.path.join(path, name), encoding="utf-8") as fh:
                # Absent means public, the same default the seeder and the store query use.
                if json.load(fh).get("visibility") != "private":
                    total += 1
    return total


def check_stat_rows(actual):
    """Every printed add-on stat must equal the real catalog count."""
    wrong = []
    for rel, _ in served_files():
        if not rel.endswith(".html"):
            continue
        with open(os.path.join(ROOT, rel), encoding="utf-8", errors="ignore") as fh:
            body = fh.read()
        for a_num, a_label, b_num, b_label in STAT_NUM.findall(body):
            num, label = (a_num, a_label) if a_num else (b_num, b_label)
            # endswith, not ==: every one of these labels is actually "Verified Add-ons", so an
            # equality test against "add-ons" matched nothing and the check reported clean for
            # as long as it has existed.
            if label.strip().lower().endswith("add-ons"):
                printed = int(num.replace(",", ""))
                if printed != actual:
                    wrong.append((rel, printed))
    return wrong


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

    actual = catalog_count()
    stale = check_stat_rows(actual) if actual is not None else []

    if stale:
        print("Add-on stat rows disagree with the catalog (%d real add-ons):\n" % actual)
        for rel, printed in stale:
            print("  %s prints %d" % (rel, printed))
        print("\nUpdate the pages and the count in FACTS.md together.\n")

    cold = stale_competitor_claims(datetime.date.today())
    if cold:
        print("Claims about other companies whose source has not been re-read (%d):\n" % len(cold))
        for name, lineno, why, ctx in cold:
            print("  %s:%d  (%s)" % (name, lineno, why))
            print("      %s" % ctx)
        print("\nRe-read the source page, update the date, or take the claim off the site.\n")

    if unknown or dashes or stale or cold:
        return 1

    counted = "catalog re-counted: %d add-ons" % actual if actual is not None else \
        "catalog not re-counted (Archie repo not checked out beside this one)"
    print("check-facts: clean. %d files scanned, %d figures allowed, %s." % (scanned, len(figures), counted))
    return 0


if __name__ == "__main__":
    sys.exit(main())
