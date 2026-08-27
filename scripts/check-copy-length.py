#!/usr/bin/env python3
"""check-copy-length.py: no marketing page may run longer than its budget.

Why this exists. There is no build step and no editor, so a page grows one
well-meant paragraph at a time, each of them defensible on its own, until the
page nobody re-read end to end is three screens longer than the thing it is
selling. This counts the words a visitor actually reads and fails when a page
is over budget.

What counts: everything inside <main> that a reader sees, minus the nav, the
drawer, the footer, scripts, styles, and <svg> innards. Diagram labels are
counted separately and reported, never budgeted: a figure earns its words by
replacing prose, and taxing it pushes copy back into paragraphs.

The budget is per page, in words, and lives in BUDGETS below. A page not
listed gets DEFAULT_BUDGET. Reference pages (terms, privacy, trust, the
glossary, blog posts, comparisons) are exempt: their job is to be complete,
and a length cap on a legal page is an argument for saying less than the
truth. Exempting a page is a deliberate act with a reason written beside it.

Usage:
  python3 scripts/check-copy-length.py            # check, exit 1 on failure
  python3 scripts/check-copy-length.py --report   # print every page, sorted
"""

import sys
import re
import argparse
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Words of body copy a marketing page may carry. Set from the measured spread
# on 2026-08-22, not invented: the median marketing page ran about 700 words and
# the tightest complete ones about 500, so 900 leaves room to make a real
# argument and still fails a page that has quietly doubled.
DEFAULT_BUDGET = 900

# A page over DEFAULT_BUDGET needs a reason here, not a bigger default. These
# are ceilings, not targets: a page at its budget has to cut a paragraph to add
# one, which is the whole point.
BUDGETS = {
    # The homepage carries the whole story once: what Archie is, who it is for,
    # what it costs, and why to trust it. It is the one page allowed to.
    "index.html": 1200,
    # How It Works is a procedure. A reader following along needs every step.
    "how-it-works/index.html": 1400,
    # Pricing prints every measured cost with its source, and a cut there reads
    # as a hidden fee. Raised from 2300 to 2700 on 2026-08-26, once, for the one
    # reason this page is allowed to grow: the repricing found a third place an
    # agent spends money (mail arriving, which is neither a message somebody sent
    # nor a scheduled run) and it was in no published figure on any page. Cutting
    # that disclosure to hold a word count would reproduce exactly the failure the
    # repricing exists to fix, which the sentence above already said. Four passes
    # of trimming took the additions from 625 words over to 377 before this moved;
    # what is left is the new table and the sentences that make it readable. Back
    # at its ceiling: a paragraph added here still has to cut one.
    "archie/pricing/index.html": 2700,
}

# Pages whose job is completeness. Length is not a defect here.
EXEMPT_PREFIXES = (
    "trust/",       # the claim-by-claim page the whole site points at
    "blog/",        # posts keep their own voice and length
    "compare/",     # side-by-side arguments need both sides in full
    "ai-explained/",  # explainer for a reader who wants the long answer
)

EXEMPT_FILES = {
    "privacy-policy/index.html",   # saying less than the truth is the failure
    "terms-of-service/index.html",  # same
    "faq/index.html",         # a list of answers; its length is the question count
    "our-story/index.html",   # a story is not a spec sheet
    "account/index.html",     # app surface, mostly UI strings
    "questionnaire/index.html",  # the chat script lives in js/, not here
    # The public half of our operating principles. Exempt for the same reason as the
    # terms and the trust page, which it sits beside: a reader comes here to check us,
    # and the only way to get it under 900 words is to publish fewer promises. Cutting
    # a page is the right instinct almost everywhere and the wrong one here.
    "standard/index.html",
}

SKIP_DIRS = {".git", "node_modules", "scripts", "assets", "css", "js", "data"}


class CopyExtractor(HTMLParser):
    """Collect visible text from <main>, minus chrome and diagram innards."""

    DROP = {"script", "style", "nav", "footer", "template"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth_main = 0
        self.drop_depth = 0
        self.svg_depth = 0
        self.body: list[str] = []
        self.figure: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag == "main":
            self.depth_main += 1
        if self.drop_depth or tag in self.DROP:
            self.drop_depth += 1
        elif tag == "svg" or self.svg_depth:
            self.svg_depth += 1

    def handle_endtag(self, tag):
        if self.drop_depth:
            self.drop_depth -= 1
        elif self.svg_depth:
            self.svg_depth -= 1
        if tag == "main" and self.depth_main:
            self.depth_main -= 1

    def handle_data(self, data):
        if not self.depth_main or self.drop_depth:
            return
        text = data.strip()
        if not text:
            return
        (self.figure if self.svg_depth else self.body).append(text)


def count_words(chunks):
    return len(re.findall(r"[A-Za-z0-9$%][A-Za-z0-9$%'’.,-]*", " ".join(chunks)))


def budget_for(rel):
    return BUDGETS.get(rel, DEFAULT_BUDGET)


def is_exempt(rel):
    return rel in EXEMPT_FILES or rel.startswith(EXEMPT_PREFIXES)


def measure(path):
    parser = CopyExtractor()
    parser.feed(path.read_text(encoding="utf-8"))
    return count_words(parser.body), count_words(parser.figure)


def pages():
    for path in sorted(ROOT.rglob("index.html")):
        rel = path.relative_to(ROOT).as_posix()
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        yield rel, path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true", help="print every page, longest first")
    args = ap.parse_args()

    rows, failures = [], []
    for rel, path in pages():
        body, figure = measure(path)
        exempt = is_exempt(rel)
        budget = None if exempt else budget_for(rel)
        rows.append((rel, body, figure, budget))
        if budget is not None and body > budget:
            failures.append((rel, body, budget))

    if args.report:
        rows.sort(key=lambda r: -r[1])
        print(f"{'page':44} {'copy':>6} {'budget':>7} {'figure':>7}")
        for rel, body, figure, budget in rows:
            mark = "" if budget is None or body <= budget else "  OVER"
            print(f"{rel:44} {body:6} {str(budget or 'exempt'):>7} {figure:7}{mark}")

    if failures:
        print()
        for rel, body, budget in failures:
            print(f"check-copy-length: {rel} runs {body} words, budget {budget} ({body - budget} over)")
        print("\nCut the page, or raise its budget in scripts/check-copy-length.py with the reason.")
        return 1

    counted = sum(1 for r in rows if r[3] is not None)
    print(f"check-copy-length: clean. {counted} pages budgeted, {len(rows) - counted} exempt.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
