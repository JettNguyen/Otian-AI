#!/usr/bin/env python3
"""check-voice.py: the site should read like a person wrote it, for a reader who skims.

Jett's brief of 2026-09-27, in his words: "make this site sound less ai". It came as a list of
nineteen rules, written out in CLAUDE.md under "Sounds like a person". Most of them are
judgement (one idea per section, the objection before the CTA, proof next to the claim) and
are read by a person or not at all. Seven are patterns, and a pattern is what a script is for,
because the site's own voice had drifted into them one well-meant sentence at a time until
nearly every heading on the homepage was one:

  ANTITHESIS   "X is not Y. It is Z." Knocking down a thing nobody said in order to say the
               real thing. Its compressed forms count too: "X, not Y." as a tag on the end of
               a sentence, a sentence that starts "Not" and has no verb, "not just X but Y",
               and "does not X. It Y." A plain negative fact is fine ("No email goes out until
               you send it or set a time"): the rule is against the contrast as a flourish.
  APHORISM     A heading of two sentences ("Your agent does the work. You say the word."),
               "That is the point", "Here's the thing", "The catch?", three-word staccato
               runs, and "No X. No Y." A heading is one sentence that says one thing.
  OPENER       "Imagine", "Meet", "Welcome to", "Whether you're", "In today's", "Ready to":
               the sentence a reader skips to reach the one that says something.
  VOCABULARY   The words that mark machine copy (seamless, unlock, empower, quietly, truly,
               robust). Each one is a claim of quality with nothing under it.
  EVERYONE     "Whether you are", "no matter who": copy written to everybody, which reaches
               nobody. The site talks to one reader, and Jett named them on 2026-09-27: one
               person buried in their own life admin.
  BUTTON       A button that says "Learn more" or "Get started" names no outcome. A button
               says what you do and what you get.
  BLOCK        A paragraph a skimming reader will not start. 45 words on a selling page, 70 on
               a reference page, and a sentence over 35 on either.

The tagline h1 is the one allowed aphorism, by Jett's decision on 2026-09-27 ("keep the tagline
h1"): it is the company's line, not a sentence of copy, and it is listed below with that reason.

Scope: the visible copy inside <main> on every served page, plus each page's <title> and meta
description, which is the copy a search result shows. SVG innards and aria-hidden subtrees are
skipped, as check-copy-length.py skips them, and so is anything inside a <blockquote>: a quote is
somebody else's words, and Patrick's testimonial is published word for word or not at all.
Not scanned: the legal pages and the published Standard (a contract and a signed document say
exactly what they say), the signed-in app surfaces, and the add-on catalog grid, whose copy is
authored in the Archie repo.

Usage:
  python3 scripts/check-voice.py            # check, exit 1 on failure
  python3 scripts/check-voice.py --report   # also print the softer signals, which never fail
  python3 scripts/check-voice.py PATH ...   # check only these pages
"""

import argparse
import re
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP_DIRS = {".git", "node_modules", "scripts", "assets", "css", "js", "data", "firebase-hosting"}

# Not marketing copy, so not governed by a marketing voice.
SKIP_PREFIXES = (
    "privacy-policy/", "terms-of-service/",  # a contract says exactly what it says
    "standard/",   # Jett and Jack's signed principles, published whole
    "admin/", "account/", "app/", "app-auth/", "auth-action/", "billing/", "activity/",
    "login/", "unsubscribe/", "cp7/", "cp8/", "ucp/",  # signed-in surfaces and app strings
)

# Reference pages: their job is completeness, so they get the longer block ceiling. The same
# split check-copy-length.py makes for its word budget.
REFERENCE_PREFIXES = ("trust/", "compare/", "blog/", "ai-explained/", "faq/", "help/", "our-story/")

BLOCK_MAX = 45            # words in one paragraph on a selling page
BLOCK_MAX_REFERENCE = 70  # and on a reference page
SENTENCE_MAX = 35         # words in one sentence, anywhere

GENERATED_START = "<!-- GENERATED-CATALOG-START -->"
GENERATED_END = "<!-- GENERATED-CATALOG-END -->"

APOS = "[’']"

# ---------------------------------------------------------------------------------------------
# The patterns. Each is (rule, name, regex), matched against one block of visible text.

BE = r"(?:is|are|was|were)"
PRONOUN_BE = rf"(?:it|this|that|they|these|those)(?:{APOS}s|{APOS}re|\s+is|\s+are|\s+was|\s+were)"

PATTERNS = [
    # "It isn't X. It's Y." / "The difference is not X. It is Y." / "That's not a flaw, that's..."
    ("ANTITHESIS", "is-not-X-it-is-Y", re.compile(
        rf"\b(?:{BE}\s+not|{BE}n{APOS}t|{APOS}s\s+not)\b[^.!?;]{{1,90}}[.;,:]\s+{PRONOUN_BE}\b", re.I)),
    ("ANTITHESIS", "not-just-X-but-Y", re.compile(r"\bnot\s+(?:just|only|merely|simply)\b", re.I)),
    ("ANTITHESIS", "not-because-but-because", re.compile(r"\bnot because\b[^.!?]*\bbut because\b", re.I)),
    # "Not to us." "Not by making you faster." A sentence opening on Not with no verb of its own.
    ("ANTITHESIS", "Not-fragment", re.compile(r"(?:^|[.!?]\s+)Not\s+(?:\S+\s+){0,5}\S+[.!](?=\s|$)")),
    # "An estimate, not a quote." "On your computer, not ours." The contrast as a tag.
    ("ANTITHESIS", "X-comma-not-Y", re.compile(r",\s+not\s+(?!only\b|just\b|yet\b|until\b|once\b|always\b|every\b|all\b|even\b)[^,.;:!?]{1,40}[.!?](?=\s|$)", re.I)),
    # "A sleeping computer does not slow your agent down. It stops it."
    ("ANTITHESIS", "does-not-X-it-Y", re.compile(
        rf"\b(?:does\s+not|doesn{APOS}t|do\s+not|don{APOS}t|will\s+not|won{APOS}t)\s+\w+[^.!?]{{0,50}}\.\s+(?:It|They)\s+(?!is\b|are\b|was\b|has\b|can\b|does\b|do\b|will\b|would\b|also\b|only\b|just\b)\w+s?\b[^.!?]{{0,30}}[.!?](?=\s|$)")),
    ("ANTITHESIS", "less-X-more-Y", re.compile(r"\b(?:less|fewer)\s+\w+(?:\s+\w+)?[,.]\s+more\s+\w+", re.I)),

    ("APHORISM", "that-is-the-point", re.compile(
        rf"\bthat(?:{APOS}s|\s+is)\s+(?:it|all|the\s+(?:whole\s+)?(?:point|difference|trick|idea|job|catch|deal|secret))\s*[.!]", re.I)),
    ("APHORISM", "heres-the-thing", re.compile(rf"\b(?:here{APOS}s|here\s+is)\s+the\s+(?:thing|kicker|catch|truth)\b", re.I)),
    ("APHORISM", "reveal-question", re.compile(
        r"\b(?:the|The)\s+(?:result|catch|best part|answer|difference|kicker|secret|trick|twist|upshot|bottom line|point)\?")),
    ("APHORISM", "simple-as-that", re.compile(r"\b(?:simple as that|full stop|end of story|nothing more, nothing less|no more, no less)\b", re.I)),
    ("APHORISM", "No-X-No-Y", re.compile(r"(?:^|[.!?]\s+)No\s+[\w-]+(?:\s+[\w-]+)?\.\s+No\s+[\w-]+(?:\s+[\w-]+)?[.!]")),
    ("APHORISM", "is-the-new", re.compile(r"\bis the new\b", re.I)),

    ("OPENER", "generic-opener", re.compile(
        rf"(?:^|[.!?]\s+)(?:In today{APOS}s|In a world|Imagine|Picture this|Meet\s+(?!the\s+requirement)|Welcome to|Let{APOS}s face it|Ever wondered|Say hello to|Introducing|Ready to|Tired of|It{APOS}s no secret|We all know|The reality is|The truth is|At its core|Simply put|Put simply|Think of it as|Let{APOS}s be honest|Here{APOS}s why|Here{APOS}s how)\b")),

    ("VOCABULARY", "machine-word", re.compile(
        r"\b(?:seamless(?:ly)?|effortless(?:ly)?|robust|powerful|cutting-edge|state-of-the-art|"
        r"game-?chang(?:er|ing)|unlock(?:s|ed|ing)?|empower(?:s|ed|ing)?|elevate[sd]?|leverag(?:e|es|ed|ing)|"
        r"streamlin(?:e|es|ed|ing)|supercharg(?:e|es|ed|ing)|harness(?:es|ed|ing)?|delv(?:e|es|ed|ing)|"
        r"tapestry|testament|realm|pivotal|crucial|holistic|revolutioni[sz](?:e|es|ed|ing)|next-level|"
        r"world-class|best-in-class|peace of mind|quietly|genuinely|truly|incredibly|remarkably|"
        r"in today{APOS}s)\b".replace("{APOS}", APOS), re.I)),

    ("EVERYONE", "whether-you", re.compile(r"\bwhether\s+you(?:\s+are|{APOS}re)\b".replace("{APOS}", APOS), re.I)),
    ("EVERYONE", "no-matter-who", re.compile(r"\bno matter (?:who|what kind|how big|how small)\b", re.I)),
]

# The softer signals, printed by --report and never failing: each has honest uses, and the
# count is what is worth watching.
SOFT = [
    ("soft", "rather-than", re.compile(r"\brather than\b", re.I)),
    ("soft", "just", re.compile(r"\bjust\b", re.I)),
    ("soft", "everyone", re.compile(r"\b(?:everyone|everybody|anyone|anybody)\b", re.I)),
    ("soft", "really-actually", re.compile(r"\b(?:really|actually|simply|basically|essentially|honestly)\b", re.I)),
]

VAGUE_BUTTON = re.compile(
    rf"^(?:learn more|read more|click here|get started|see more|explore|discover|find out more|"
    rf"check it out|continue|submit|go|more|details|start|start now|try it|let{APOS}s go|begin|next)"
    r"\s*[→›»]?$", re.I)

# (page or "*", rule name, a substring of the block) -> why this one stays.
ALLOW = [
    ("index.html", "heading-two-sentences", "Own it.",
     "The tagline h1. Jett, 2026-09-27: keep the tagline as the homepage h1. It is the company's "
     "line, set on 2026-09-16, not a sentence of page copy."),
]

HEADINGS = {"h1", "h2", "h3", "h4"}
PROSE = {"p", "li", "dd", "blockquote", "figcaption", "td"}
BLOCK_TAGS = HEADINGS | PROSE | {"summary", "dt", "th", "label", "legend", "button"}


class Blocks(HTMLParser):
    """Visible blocks of <main>, in order, as (tag, text)."""

    DROP = {"script", "style", "nav", "footer", "template", "svg", "noscript"}
    VOID = {"br", "img", "input", "hr", "wbr", "source", "track", "embed", "area", "col",
            "meta", "link", "base", "param"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.main = 0
        self.drop = 0
        self.stack = []   # (tag, label) for every open block
        self.buf = []
        self.out = []
        self.head = {}
        self.quote = 0
        self._in_head = False
        self._in_title = False

    def _label(self):
        return self.stack[-1][1] if self.stack else None

    def _flush(self):
        text = re.sub(r"\s+", " ", " ".join(self.buf)).strip()
        if text and self._label() and not self.quote:
            self.out.append((self._label(), text))
        self.buf = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "head":
            self._in_head = True
        if tag == "title" and self._in_head:
            self._in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.head["description"] = a.get("content", "")
        if tag == "main":
            self.main += 1
        if self.drop or tag in self.DROP or a.get("aria-hidden") == "true" or "hidden" in a and tag != "input":
            if tag not in self.VOID:
                self.drop += 1
            return
        if not self.main:
            return
        cls = a.get("class") or ""
        if tag == "blockquote":
            self._flush()
            self.quote += 1
        is_button = tag == "a" and re.search(r"\bbtn\b", cls)
        if tag in BLOCK_TAGS or is_button:
            self._flush()
            self.stack.append((tag, "button" if is_button else tag))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "head":
            self._in_head = False
        if self.drop:
            if tag not in self.VOID:
                self.drop -= 1
            return
        if tag == "main" and self.main:
            self.main -= 1
        if tag == "blockquote" and self.quote:
            self._flush()
            self.quote -= 1
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                self._flush()
                del self.stack[i:]
                break

    def handle_data(self, data):
        if self._in_title:
            self.head["title"] = self.head.get("title", "") + data
            return
        if not self.main or self.drop:
            return
        if data.strip():
            self.buf.append(data.strip())


def sentences(text):
    return [s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z“\"‘'$0-9])", text) if s.strip()]


def words(text):
    return len(re.findall(r"[A-Za-z0-9$%][A-Za-z0-9$%'’.,-]*", text))


def served_pages():
    for path in sorted(ROOT.rglob("index.html")):
        rel = path.relative_to(ROOT).as_posix()
        if set(path.relative_to(ROOT).parts) & SKIP_DIRS:
            continue
        if rel.startswith(SKIP_PREFIXES):
            continue
        yield rel, path


def allowed(rel, name, text):
    return any((page in ("*", rel)) and rule == name and snip in text for page, rule, snip, _ in ALLOW)


def scan(rel, src, soft=False):
    if GENERATED_START in src and GENERATED_END in src:
        a, b = src.index(GENERATED_START), src.index(GENERATED_END)
        src = src[:a] + src[b:]
    p = Blocks()
    p.feed(src)
    p._flush()
    reference = rel.startswith(REFERENCE_PREFIXES)
    cap = BLOCK_MAX_REFERENCE if reference else BLOCK_MAX
    hits = []

    blocks = list(p.out)
    for key in ("title", "description"):
        if p.head.get(key):
            blocks.append((key, unescape(p.head[key]).strip()))

    for tag, text in blocks:
        if tag == "button":
            if VAGUE_BUTTON.match(text) and not allowed(rel, "vague-button", text):
                hits.append(("BUTTON", "vague-button", tag, text))
            continue
        for rule, name, rx in PATTERNS + (SOFT if soft else []):
            if rx.search(text) and not allowed(rel, name, text):
                hits.append((rule, name, tag, text))
        # A question answered in the same heading ("Hit a ceiling? Tell us") is one thought.
        heading_ss = sentences(text)
        if (tag in HEADINGS and len(heading_ss) > 1 and not heading_ss[0].rstrip().endswith("?")
                and not allowed(rel, "heading-two-sentences", text)):
            hits.append(("APHORISM", "heading-two-sentences", tag, text))
        ss = sentences(text)
        run = 0
        for s in ss:
            run = run + 1 if words(s) <= 3 else 0
            if run >= 3 and not allowed(rel, "staccato", text):
                hits.append(("APHORISM", "staccato", tag, text))
                break
        if tag in PROSE and words(text) > cap and not allowed(rel, "block", text):
            hits.append(("BLOCK", f"block-over-{cap}", tag, text))
        for s in ss:
            if words(s) > SENTENCE_MAX and not allowed(rel, "long-sentence", s):
                hits.append(("BLOCK", f"sentence-over-{SENTENCE_MAX}", tag, s))
                break
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true", help="also print the softer signals")
    ap.add_argument("--summary", action="store_true", help="one line per page")
    ap.add_argument("paths", nargs="*")
    args = ap.parse_args()

    if args.paths:
        pages = [(Path(x).resolve().relative_to(ROOT).as_posix(), Path(x).resolve()) for x in args.paths]
    else:
        pages = list(served_pages())

    failing = 0
    for rel, path in pages:
        hits = scan(rel, path.read_text(encoding="utf-8"), soft=args.report)
        hard = [h for h in hits if h[0] != "soft"]
        failing += len(hard)
        if not hits:
            continue
        if args.summary:
            counts = {}
            for h in hits:
                counts[h[1]] = counts.get(h[1], 0) + 1
            print(f"{len(hard):4d}  {rel}  " + ", ".join(f"{k}:{v}" for k, v in sorted(counts.items(), key=lambda kv: -kv[1])))
            continue
        print(rel)
        for rule, name, tag, text in hits:
            short = text if len(text) <= 180 else text[:177] + "..."
            print(f"  {rule:<10} {name:<24} <{tag}> {short}")

    if failing:
        print(f"\ncheck-voice: {failing} to fix. The rules are in CLAUDE.md, \"Sounds like a person\".")
        return 1
    print(f"check-voice: clean. {len(pages)} pages read.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
