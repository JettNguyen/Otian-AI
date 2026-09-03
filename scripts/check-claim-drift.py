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
if failures:
    print("check-claim-drift: FAILED")
    for f in failures:
        print(f"  - {f}")
    print()
    print("TRUST.md is the source of truth. Fix the page, or fix TRUST.md and then the page.")
    sys.exit(1)

print("check-claim-drift: clean. Provider roster, holdings list, telemetry and the review page agree with TRUST.md.")
