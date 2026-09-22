#!/usr/bin/env python3
"""Fail when the same load-bearing claim is spelled differently in two places.

TRUST.md records the same failure twice, in its own words: a list that called itself the
whole list grew two items and the old sentence stayed up, and a provider block that said
five while the product shipped seven. Both were true when written. Both became false by
sitting still while something else moved, and both were found by a reader rather than by us.

On 2026-08-25 a third copy of those claims appeared: `trust/it-review/` and the review PDF
built from the Archie repo now state the holdings list, the provider roster and the telemetry
fields alongside `trust/`. Three copies of one fact is the exact shape that produced the first
two incidents, so this runs before it happens a third time.

WHAT THIS CAN AND CANNOT DO. It compares the *site's* copies against TRUST.md, which is the
source of truth. It cannot read the PDF, which is a binary built in another repo; what it does
instead is check that the page handing out that PDF says which copy is canonical, so a reader
who finds a disagreement knows which one to believe. That is a weaker guarantee than checking
the bytes and it is the honest one available from here.

Usage:  python3 scripts/check-claim-drift.py
Exit 0 when clean, 1 with a report otherwise.
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(*parts):
    with open(os.path.join(ROOT, *parts), encoding="utf-8") as f:
        return f.read()


def strip_tags(html):
    """HTML to bare words. Entities that matter to matching become their characters."""
    text = re.sub(r"<[^>]+>", " ", html)
    for entity, char in (
        ("&rsquo;", "'"),
        ("&lsquo;", "'"),
        ("&ldquo;", '"'),
        ("&rdquo;", '"'),
        ("&amp;", "&"),
        ("&nbsp;", " "),
    ):
        text = text.replace(entity, char)
    return re.sub(r"\s+", " ", text)


failures = []


def require(condition, message):
    if not condition:
        failures.append(message)


# ---------------------------------------------------------------------------
# 1. The provider roster.
#
# The product connects seven named providers plus one the user supplies. Any page that
# lists providers at all must list all seven, because the two that went missing last time
# were the two with the worst answers, which made the table read better than the truth.
# ---------------------------------------------------------------------------
PROVIDERS = ["Anthropic", "OpenAI", "Groq", "Gemini", "Mistral", "DeepSeek", "xAI"]

trust_html = read("trust", "index.html")
trust = strip_tags(trust_html)

# Scoped to the rows themselves, NOT to the page. Every provider name also appears in the
# prose sentence listing what you can connect, so a whole-page search passes while the table
# is missing a row, which is exactly the bug that shipped. The first version of this check did
# that and let a deleted DeepSeek row through.
rows = re.findall(r'class="trust-quote-co">([^<]+)<', trust_html)
row_text = " ".join(rows)
missing = [
    p for p in PROVIDERS
    if p not in row_text and not (p == "Gemini" and "Google" in row_text)
]
require(
    not missing,
    f"the provider table in trust/index.html has no row for: {missing}. "
    "A partial table is how Mistral and DeepSeek stayed off the page, and the two that go "
    "missing are the ones with the worst answers, so the table reads better than the truth.",
)

# ---------------------------------------------------------------------------
# 2. The holdings list.
#
# TRUST.md's "What We Hold" section is the claim. Every item in it has to appear on the
# trust page, because that page's own closing note promises the day something joins the
# list is the day it appears there.
# ---------------------------------------------------------------------------
HOLDINGS = {
    "email address": ["email address"],
    "current plan": ["current plan", "whether you have a plan"],
    "terms acceptance": ["version of the terms you agreed to"],
    "version heartbeat": ["which version of Archie you are running", "version heartbeat"],
    "crash reports": ["crash report"],
    "trial credit ledger": ["free credits, the ledger", "credit ledger", "ledger of what each call"],
    "second-factor records": ["second-factor record"],
    "guided-session invoices": ["invoice"],
    "refused checkouts": ["refused", "checkout that was refused"],
    "sealed phone messages": ["sealed", "between your computer and your phone"],
}
for label, spellings in HOLDINGS.items():
    require(
        any(s.lower() in trust.lower() for s in spellings),
        f"trust/index.html no longer states that we hold {label!r}. "
        "That list calls itself the whole list, so an omission is a false claim, not a gap.",
    )

# ---------------------------------------------------------------------------
# 3. Telemetry.
#
# Two things go out and the heartbeat carries four fields. Both numbers have been wrong on
# the site before, in the direction of understating what is sent.
# ---------------------------------------------------------------------------
require(
    "six hours" in trust,
    "trust/index.html no longer says how often the heartbeat goes out.",
)

# ---------------------------------------------------------------------------
# 4. The IT review page, which is the newest copy and the one most likely to drift.
# ---------------------------------------------------------------------------
review_path = os.path.join(ROOT, "trust", "it-review", "index.html")
if os.path.exists(review_path):
    review = strip_tags(read("trust", "it-review", "index.html"))

    # It summarizes the holdings list rather than repeating it, which TRUST.md allows only
    # when the summary says it is one and points at the full version.
    require(
        "That is a summary" in review or "summary" in review.lower(),
        "trust/it-review/ states what our servers hold without marking it as a summary. "
        "TRUST.md requires the short form to say it is short and link the whole list.",
    )
    require(
        "../#what-we-hold" in read("trust", "it-review", "index.html"),
        "trust/it-review/ no longer links its holdings summary to the full list on /trust/.",
    )

    # The weakness the long version admits has to be on the summary too. A summary that omits
    # it is the sanitized version, and a reader who checks both stops believing either.
    require(
        "leak" in review.lower(),
        "trust/it-review/ no longer mentions that an injected instruction can leak. "
        "/trust/ admits it, so leaving it off the summary makes the summary the dishonest one.",
    )

    # The PDF it hands out is built in the Archie repo and cannot be read from here, so the
    # page has to say which copy wins when they disagree.
    require(
        "canonical" in review.lower() or "Trust page" in review,
        "trust/it-review/ hands out a PDF without saying which copy is canonical. "
        "Two documents asserting completeness and disagreeing is worse than neither.",
    )

# ---------------------------------------------------------------------------
# 5. The founders' titles.
#
# our-story/ is where a reader meets them, so it is the source and every other copy
# follows it. On 2026-09-15 contact/ still carried the pair from before the titles were
# settled ("Co-Founder / Engineering & Implementation" and "Co-Founder / Operations &
# Client Discovery"), and README.md carried the same stale pair, so the page a reader
# reaches from the top bar disagreed with the page that introduces the two of them.
# Three copies of one fact is the shape this file exists to catch.
# ---------------------------------------------------------------------------
story_html = read("our-story", "index.html")
TITLES = dict(re.findall(r"<h3>([^<]+)</h3>\s*<p class=\"team-role\">([^<]+)</p>", story_html))

# If the markup moves, fail here rather than passing every copy silently.
require(
    {"Jett Nguyen", "Jack Raney"} <= set(TITLES),
    "our-story/ no longer yields a team-role for both founders, so nothing can be "
    "checked against it. Fix the reader here before trusting this check again.",
)

for name, role in TITLES.items():
    if name not in ("Jett Nguyen", "Jack Raney"):
        continue

    contact = dict(
        re.findall(
            r"<p class=\"contact-info-value\">([^<]+)<span class=\"contact-info-subvalue\">([^<]+)</span>",
            read("contact", "index.html"),
        )
    )
    require(
        contact.get(name) == role,
        f"contact/ gives {name} the title {contact.get(name)!r}, "
        f"but our-story/ says {role!r}.",
    )

    readme = read("README.md")
    require(
        f"**{name}**, {role}" in readme,
        f"README.md does not give {name} the title our-story/ does ({role!r}).",
    )

# ---------------------------------------------------------------------------
# 5. The binary: how many agents, whose computer, and whether the asking has an off switch.
#
# `compare/` is the source. Its h1 is the one sentence none of the other nine can print, and
# every placement behind it is read off that company's own page and dated on `compare/` itself.
# On 2026-09-21 the claim moved onto three selling pages, which makes four copies of one fact:
# the exact shape the header of this file describes, and the reason the first two incidents
# happened. What drifts is the COUNT. The board gains or loses an agent on `compare/`, that
# page is edited, and the homepage goes on saying ten for months because nothing reads both.
#
# The egress clause is checked on every page that carries the binary. TRUST.md ties it to any
# sorting of the agents onto "your own computer": a page that sorts them and drops it is making
# a banned claim by omission, whichever of the two places carries it. It is derived from the
# same count, so an eleventh agent fails every page at once instead of leaving a stale "All ten"
# behind on three of them.

BINARY_PAGES = (
    ("compare", "index.html"),
    ("index.html",),
    ("archie", "personal", "index.html"),
    ("archie", "business", "index.html"),
)

# Comments carry the reasoning for this claim on every page that states it, quoting both the
# sentence and TRUST.md. Reading them would let a page pass on its own footnotes.
def visible(*parts):
    return strip_tags(re.sub(r"<!--.*?-->", " ", read(*parts), flags=re.S))


# Two forms, because the h1 was cut from 24 words to 18 on 2026-09-21 (Jett: the title is
# too long) and "Archie is the only one that works" became "Only Archie works". Both say the
# same thing and both are read here, so a later edit can go either way without touching this
# file. What may NOT be dropped is the tail: the sentence sorts ten agents onto "your own
# computer", and three of the other nine are there too. The h1 is only true because it asks
# two things of the one agent left, so a truncation to the first clause is a false claim, not
# a shorter one.
compare_text = visible("compare", "index.html")
binary = re.search(
    r"(\w+) agents\. (?:Archie is the only one that works|Only Archie works) on your own computer",
    compare_text,
)
require(
    binary is not None,
    "compare/ no longer opens on the binary in either form this check reads "
    "('<N> agents. Only Archie works on your own computer...' or '<N> agents. Archie is the "
    "only one that works on your own computer...'). "
    "Fix the reader here before trusting this check again.",
)

if binary:
    count = binary.group(1)
    egress = f"All {count.lower()} send your words to an AI company's computers by default."
    for page in BINARY_PAGES:
        where = "/".join(page)
        text = visible(*page)
        low = text.lower()
        carries = (
            "archie is the only one that works on your own computer" in low
            or "only archie works on your own computer" in low
        )
        if not carries:
            continue
        require(
            re.search(rf"\b{count} agents\b", text, re.I) is not None,
            f"{where} states the binary but not the count compare/ states "
            f"({count.lower()} agents). One of the two has moved.",
        )
        require(
            egress.lower() in text.lower(),
            f"{where} sorts the agents onto 'your own computer' without the egress clause. "
            f"TRUST.md requires \"{egress}\" wherever the binary is stated, in the figure or "
            f"in the copy beside it.",
        )

# ---------------------------------------------------------------------------
if failures:
    print("check-claim-drift: FAILED")
    for f in failures:
        print(f"  - {f}")
    print()
    print("TRUST.md is the source of truth. Fix the page, or fix TRUST.md and then the page.")
    sys.exit(1)

print("check-claim-drift: clean. Provider roster, holdings list, telemetry, the review page,\n    the binary's count and egress clause, and the founders' titles all agree with their source.")
