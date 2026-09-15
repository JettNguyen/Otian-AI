#!/usr/bin/env python3
"""A label is read without the thing around it, so a pronoun in one names nothing.

A menu row is read without its menu, a step heading without the step before it, a
comparison card without the section it sits in, an FAQ question with its answer still
closed. Every one of those is a place a reader lands cold, and "it" there points at
whatever they were already thinking about rather than at what we meant.

This exists because of two of them found on 2026-09-14. "Have One Built" moved from
Add-ons to Services and the pronoun lost the heading that had been its antecedent. And
compare/symphony/ carried "Five things it does that Symphony does not" four words above
"Five things it does that we do not": the same four words, opposite subjects, and the
page arguing both sides at once.

Two passes, and the second is the softer one:

  LABELS   Headings, buttons, menu rows, card labels, table headers, CTA text. A pronoun
           here has to find its antecedent inside the label, because there is nothing else.
  OPENERS  A paragraph that starts on a bare pronoun has to reach back over a heading or
           another paragraph to find its subject, which is where referents break. Reported
           separately, and not every one is wrong.

Blog posts are exempt: they keep their own voice (CLAUDE.md), and a first-person essay
carries its subject across sentences the way essays do. Quoted reader sentences are
exempt for the same reason: they are somebody talking, not us labelling.

Usage:  python3 scripts/check-pronouns.py [--openers] [--all]
"""
import argparse
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP_DIRS = {"node_modules", "assets", "scripts", ".git", "blog"}

# Elements a reader meets on their own.
# No <th>. A table header is the one label that is never read alone: a column header
# is answered by the row's own first cell, and a row header by the column it is under.
# "Where it goes" over trust/'s packet table is the row's connection, every time.
TAG_LABELS = r"h1|h2|h3|h4|h5|h6|button|summary|figcaption|legend"
CLASS_LABELS = (
    r"section-label|calm-list-label|hm-step-who|chapter-time|footer-col-title|"
    r"nav-more-toggle|nav-drawer-cat|accordion-title|faq-group-title|card-aud|"
    r"help-verdict|mp-chip|step-number|hm-eta-label"
)

PRONOUN = r"it|its|it's|they|them|their|theirs|these|those|ones"
LEADING = re.compile(rf"^\s*(?:{PRONOUN}|this|that|one)\b", re.I)
ANYWHERE = re.compile(rf"(?<![\w'-])({PRONOUN})(?![\w-])", re.I)

# "this page", "that company", "these terms", "one add-on": determiners, and the noun
# they point at is the very next word. Checked wherever the word sits, not only first.
DETERMINER = re.compile(r"(this|that|these|those|one)\s+[a-z]", re.I)

# Labels that read as a pronoun and are not one. "How It Works" is the page's name and
# the word a reader scans for (nav labels stay conventional); "it" in a title like
# "Say the true thing, especially when it costs us" points at the clause beside it.
ALLOW = {
    # Page names and section labels a reader scans for. Nav labels stay conventional.
    "how it works", "how it works.", "how it all connects.", "see it work", "see it work \u2192",
    "what it is", "how it goes", "what it can be", "how it actually works.", "how it actually started.",
    "in their words", "in their words.", "in their own words",
    # "it" answered inside the same sentence, by a word too ordinary to list as a noun.
    "what you saw, and what it means",
    "check for yourself. it takes 10 minutes.",
    "what it\u2019s like to have your own agent.",
    "the difference is not how much you are buying. it is how much has to be decided before anyone starts.",
    "you already built something, and it works because you are standing in the middle of it.",
    "none of it is hard. it is just spread across everything you own.",
    "think of it like onboarding.",
    "what the standard is, and what to do with it.",
    # TRUST.md approved wording. The claim is quoted from the document that governs it,
    # so it is not reworded here for any reason short of the claim changing.
    "we are not in the middle of it.",
    # Fixed idioms, where the pronoun is the English and not a referent.
    "confirm it\u2019s you", "it started with one agent.", "them, not us",
}

# A pronoun is answered when the label names its own subject first.
NOUN = re.compile(
    r"(?<![\w-])(Archie|Otian|Ember|agent|agent's|agents|assistant|person|people|computer|"
    r"add-on|add-ons|skill|skills|routine|routine's|routines|personality|personalities|app|apps|"
    r"phone|inbox|calendar|email|emails|plan|plans|account|accounts|price|prices|model|models|"
    r"session|sessions|log|reply|draft|tool|tools|Symphony|Zapier|Claude|ChatGPT|company|"
    r"companies|marketplace|chat|build|setup|page|policy|standard|link|code|file|files|"
    r"thing|things|work|line|word|words|terms|review|reviews|answer|question|questions|"
    r"job|task|tasks|step|steps|note|list|folder|message|messages|meeting|name|day|mind|"
    r"table|tables|choice|difference|option|options|allowance|install|key|keys|figure)(?![\w-])",
    re.I,
)

QUOTED = re.compile(r'^\s*["“‘\']')


def text_of(frag):
    frag = re.sub(r"<svg\b.*?</svg>", " ", frag, flags=re.S | re.I)
    frag = re.sub(r'<span class="sr-only".*?</span>', " ", frag, flags=re.S | re.I)
    frag = re.sub(r"<[^>]+>", " ", frag)
    return " ".join(html.unescape(frag).split())


def served_pages():
    for p in sorted(ROOT.rglob("*.html")):
        if SKIP_DIRS & set(p.relative_to(ROOT).parts):
            continue
        yield p


def strip_chrome(src):
    """The nav and footer are the same on every page; judge them once, from services/."""
    src = re.sub(r"<nav class=\"nav\"\b.*?</nav>", " ", src, flags=re.S)
    src = re.sub(r"<nav class=\"nav-drawer\"\b.*?</nav>", " ", src, flags=re.S)
    src = re.sub(r"<div class=\"nav-drawer-flyout\"\b.*?\n  </div>", " ", src, flags=re.S)
    src = re.sub(r"<footer\b.*?</footer>", " ", src, flags=re.S)
    return src


def suspect(text):
    """Return the offending pronoun, or None when the label answers itself."""
    if not text or len(text) > 110 or QUOTED.match(text):
        return None
    if text.strip().lower() in ALLOW:
        return None
    lead = LEADING.match(text)
    if lead and not DETERMINER.match(text):
        return lead.group(0).strip()
    for m in ANYWHERE.finditer(text):
        if DETERMINER.match(text[m.start():]):
            continue
        if NOUN.search(text[: m.start()]):
            continue
        return m.group(1)
    return None


LABEL_ABOVE = re.compile(r'class="[^"]*\bsection-label\b[^"]*"[^>]*>(.*?)</', re.S | re.I)


def answered_above(src, start):
    """A section-label sits directly above its heading, and the two are read as one.

    "One day with Archie" over "By 7:00 am it has already been down the list" is not a
    reader meeting a bare pronoun; it is a reader meeting a label and then its sentence.
    Only the label immediately before counts, which is why this looks back a few lines
    and not up the page.
    """
    window = src[max(0, start - 400) : start]
    hits = LABEL_ABOVE.findall(window)
    return bool(hits) and bool(NOUN.search(text_of(hits[-1])))


def labels(src):
    seen = set()
    for m in re.finditer(rf"<({TAG_LABELS})\b([^>]*)>(.*?)</\1>", src, re.S | re.I):
        if "aria-hidden" in m.group(2):
            continue
        if m.group(1).lower() in ("h1", "h2", "h3") and answered_above(src, m.start()):
            continue
        yield m.start(), m.group(1).lower(), text_of(m.group(3)), seen
    for m in re.finditer(
        rf'<(\w+)\b[^>]*class="[^"]*\b({CLASS_LABELS})\b[^"]*"[^>]*>(.*?)</\1>', src, re.S | re.I
    ):
        yield m.start(), m.group(2), text_of(m.group(3)), seen
    for m in re.finditer(r'<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>(.*?)</a>', src, re.S | re.I):
        yield m.start(), "btn", text_of(m.group(1)), seen
    for m in re.finditer(r'<a\b[^>]*role="menuitem"[^>]*>(.*?)</a>', src, re.S | re.I):
        yield m.start(), "menuitem", text_of(m.group(1)), seen


# A heading, a card title, or a term in a definition list: anything that names the
# subject of the paragraph that follows it.
NAMER = re.compile(
    r"<(?:h[1-6]|dt|strong|b)\b[^>]*>(.*?)</(?:h[1-6]|dt|strong|b)>"
    r"|class=\"[^\"]*\b(?:calm-list-label|mp-card-title|card-title|section-label|accordion-title)\b[^\"]*\"[^>]*>(.*?)</",
    re.S | re.I,
)


def named_just_above(src, start):
    """Did the thing right above this paragraph say what it is about?

    A paragraph under its own heading inherits that heading's subject: "Calendar
    Manager" then "It reads your calendar and proposes a time" is one sentence with a
    title on it, not a reader meeting a stray pronoun. So the window is small, and only
    the last namer inside it counts.
    """
    window = src[max(0, start - 500) : start]
    hits = [g for m in NAMER.finditer(window) for g in m.groups() if g]
    return bool(hits) and bool(NOUN.search(text_of(hits[-1])))


def openers(src):
    for m in re.finditer(r"<p\b([^>]*)>\s*(?:<b>|<strong>|<em>)?\s*([A-Z][^<]{0,80})", src):
        if "aria-hidden" in m.group(1):
            continue
        if named_just_above(src, m.start()):
            continue
        yield m.start(), m.group(2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--openers", action="store_true", help="also report paragraph-opening pronouns")
    ap.add_argument("--all", action="store_true", help="do not strip the shared nav and footer")
    args = ap.parse_args()

    label_hits, opener_hits = [], []
    pages = 0
    for p in served_pages():
        src = p.read_text(encoding="utf-8")
        if not args.all:
            src = strip_chrome(src)
        pages += 1
        rel = p.relative_to(ROOT)
        line = lambda o: src.count("\n", 0, o) + 1
        seen = set()
        for off, kind, text, _ in labels(src):
            if text in seen:
                continue
            seen.add(text)
            bad = suspect(text)
            if bad:
                label_hits.append((str(rel), line(off), kind, bad, text))
        if args.openers:
            for off, text in openers(src):
                lead = LEADING.match(text)
                if lead and not DETERMINER.match(text):
                    opener_hits.append((str(rel), line(off), lead.group(0).strip(), text))

    for f, ln, kind, bad, text in sorted(label_hits):
        print(f"{f}:{ln}  [{kind}] \"{bad}\" names nothing: {text}")
    if args.openers:
        if label_hits and opener_hits:
            print()
        for f, ln, bad, text in sorted(opener_hits):
            print(f"{f}:{ln}  [opener] \"{bad}\": {text}...")

    if label_hits:
        print(f"\ncheck-pronouns: {len(label_hits)} labels lean on a pronoun, across {pages} pages.")
        return 1
    extra = f" {len(opener_hits)} paragraph openers to look at." if args.openers and opener_hits else ""
    print(f"check-pronouns: clean. {pages} pages, every label names its own subject.{extra}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
