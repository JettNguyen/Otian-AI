#!/usr/bin/env python3
"""Write sitemap.xml, robots.txt and llms.txt from the pages that actually exist.

Until 2026-09-07 this site published none of the three. That is not a small omission on a
hand-written static site: there is no build step and no CMS, so nothing anywhere told a
crawler that the 60-odd public pages exist or how they relate. A competitor teardown that
day found them publishing 459 URLs against our 85 pages, and the gap was not that they had
written more, it was that we had never handed anyone a map.

Three files, one walk of the repo, because they answer three versions of the same question:

  sitemap.xml  what pages exist, and when each last changed        (search crawlers)
  robots.txt   which of them are for reading, and where the map is (search crawlers)
  llms.txt     what we sell and what is true about it              (answer engines)

**Why llms.txt is generated and not hand-written.** It is the one file whose whole job is
to be quoted back to somebody by a machine that will not check it. A hand-maintained copy
of the site's claims is a second place for those claims to live, and the second copy is
always the one that goes stale: it is not in the page a person edits, so nothing reminds
them. So the page map below is read out of the pages themselves (title and meta
description, which are already reviewed copy), and the claims block is a short list here
that check-facts.py and check-claim-drift.py see like any other served file, because
served is exactly what it is.

**The bar for a sentence in this file is TRUST.md's bar, not a looser one.** An answer
engine strips the qualifier and keeps the claim, so anything that needs its neighbouring
sentence to stay true does not belong here at all. Every claim below is either the
approved wording from TRUST.md or a figure with a FACTS.md row, and where the approved
wording carries an em dash (TRUST.md is repo prose and allowed them) it is restructured,
because this file is served.

Usage:
  python3 scripts/gen-discovery.py            # write the three files
  python3 scripts/gen-discovery.py --check    # exit 1 if they are out of date
"""

import argparse
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://otianai.com"

SKIP_DIRS = {".git", ".claude", "node_modules", "scripts", "assets", "css", "js", "data"}

# Pages that exist but are not destinations. 404 and the two fragments are not pages a
# person navigates to; firebase-hosting is the vendor's default file left in place.
SKIP_FILES = {"404.html", "preview.html", "banner.html"}

# Everything under these is either signed-in, an admin tool, or a machine endpoint. They
# carry their own noindex too; this list is what keeps them out of the sitemap, and the
# Disallow lines below are what keeps a crawler from spending its budget finding that out.
PRIVATE_PREFIXES = (
    "account/", "activity/", "admin/", "app-auth/", "auth-action/",
    "billing/", "firebase-hosting/", "login/", "phone/",
)

NOINDEX = re.compile(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex', re.I)
# A redirect stub is a real file and not a destination. Eleven of them hold old URLs alive
# (about/ to our-story/, what-you-need/ to a section of how-it-works/, and so on). Listing
# one in a sitemap points a crawler at a page whose only content is a jump somewhere else,
# and listing it in llms.txt hands an answer engine a URL that answers nothing.
REDIRECT = re.compile(r'<meta[^>]+http-equiv="refresh"', re.I)
TITLE = re.compile(r"<title>(.*?)</title>", re.S | re.I)
DESCRIPTION = re.compile(r'<meta[^>]+name="description"[^>]+content="(.*?)"', re.S | re.I)

# Titles are written for a browser tab, so most carry the site name. A map of one site
# does not need it 60 times.
TITLE_SUFFIX = re.compile(r"\s*\|\s*Otian AI\s*$")

ENTITIES = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
    "&rsquo;": "’", "&lsquo;": "‘", "&ldquo;": "“", "&rdquo;": "”",
    "&middot;": "·", "&nbsp;": " ", "&rarr;": "→", "&ndash;": "–",
}


def unescape(text):
    for entity, char in ENTITIES.items():
        text = text.replace(entity, char)
    return " ".join(text.split())


def xml_escape(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def last_changed(rel):
    """Committed date of a file, or None when git has never seen it.

    Author date, not commit date: a rebase should not tell the world every page changed.
    """
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%as", "--", rel],
            cwd=ROOT, capture_output=True, text=True, timeout=20,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    stamp = out.stdout.strip()
    return stamp if re.fullmatch(r"\d{4}-\d{2}-\d{2}", stamp) else None


def url_for(rel):
    """Repo path to served URL. Directory indexes keep their trailing slash."""
    if rel == "index.html":
        return SITE + "/"
    if rel.endswith("/index.html"):
        return SITE + "/" + rel[: -len("index.html")]
    return SITE + "/" + rel


def public_pages():
    """Every page a stranger can open, newest-sorted by nothing: path order is stable."""
    pages = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS and not d.startswith("."))
        for name in sorted(filenames):
            if not name.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), ROOT)
            if rel in SKIP_FILES or rel.startswith(PRIVATE_PREFIXES):
                continue
            # _csp-selftest.html and anything like it: a fixture the checks load, not a page.
            if name.startswith("_"):
                continue
            with open(os.path.join(ROOT, rel), encoding="utf-8", errors="ignore") as fh:
                head = fh.read(8000)
            if NOINDEX.search(head) or REDIRECT.search(head):
                continue
            title = TITLE.search(head)
            desc = DESCRIPTION.search(head)
            pages.append({
                "rel": rel,
                "url": url_for(rel),
                "title": TITLE_SUFFIX.sub("", unescape(title.group(1))) if title else "",
                "description": unescape(desc.group(1)) if desc else "",
                "lastmod": last_changed(rel),
            })
    return pages


# How often each part of the site actually changes, which is the only honest basis for a
# priority. The homepage and the marketplace move with the catalog; the legal pages move
# when the contract does. Anything not listed is 0.5, the specification's own default,
# which is the correct answer for "no strong opinion" and not a page being demoted.
PRIORITY = (
    ("index.html", "1.0", "weekly"),
    ("archie/pricing/", "0.9", "weekly"),
    ("archie/", "0.9", "weekly"),
    ("skills-marketplace/", "0.9", "weekly"),
    ("how-it-works/", "0.8", "monthly"),
    ("trust/", "0.8", "monthly"),
    ("compare/", "0.8", "monthly"),
    ("business/", "0.8", "monthly"),
    ("individuals/", "0.8", "monthly"),
    ("blog/", "0.7", "monthly"),
    ("faq/", "0.7", "monthly"),
    ("learn/", "0.6", "monthly"),
    ("terms-of-service/", "0.3", "yearly"),
    ("privacy-policy/", "0.3", "yearly"),
)


def rank(rel):
    served = "" if rel == "index.html" else rel[: -len("index.html")]
    for prefix, priority, frequency in PRIORITY:
        target = "" if prefix == "index.html" else prefix
        if prefix == "index.html":
            if rel == "index.html":
                return priority, frequency
        elif served.startswith(target):
            return priority, frequency
    return "0.5", "monthly"


def build_sitemap(pages):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for page in pages:
        priority, frequency = rank(page["rel"])
        lines.append("  <url>")
        lines.append("    <loc>%s</loc>" % xml_escape(page["url"]))
        if page["lastmod"]:
            lines.append("    <lastmod>%s</lastmod>" % page["lastmod"])
        lines.append("    <changefreq>%s</changefreq>" % frequency)
        lines.append("    <priority>%s</priority>" % priority)
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def build_robots():
    """Open by default, closed on the signed-in half, and pointing at the map.

    No crawl-delay and no bot allowlist. Both are ways of saying we would rather not be
    read, and this file exists because we want to be found.
    """
    lines = [
        "# Otian AI. Generated by scripts/gen-discovery.py; do not hand-edit.",
        "",
        "User-agent: *",
        "Allow: /",
    ]
    for prefix in PRIVATE_PREFIXES:
        lines.append("Disallow: /%s" % prefix)
    lines += [
        "",
        "# The signed-in pages above hold one person's account and nothing a search result",
        "# could usefully show. They are excluded to save a crawler the trip, not to hide",
        "# anything: each one also carries its own noindex, which is what actually enforces it.",
        "",
        "Sitemap: %s/sitemap.xml" % SITE,
        "",
    ]
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# llms.txt
#
# Every line below is either approved wording from TRUST.md, a figure with a FACTS.md row,
# or a plain description of a page that exists. Adding a claim here means adding it there
# first. The order answers the questions in the order somebody actually asks them: what is
# it, what does it cost, what is true about the data, what can it not do.
# ---------------------------------------------------------------------------

SUMMARY = """Archie is a desktop app that runs your own AI agent on your own computer. You
give it a job in plain words, from the chat apps you already use, and it does the job on a
schedule. Otian AI is the two-person company that makes it."""

# The block that answers the question an answer engine is usually being asked. Each pair is
# a question somebody types and the shortest true answer, with the limitation in the same
# breath rather than in a later sentence that will be cut off.
QUESTIONS = [
    ("What is Archie?",
     "A desktop app that runs an AI agent on your own computer. It handles mail, calendar, "
     "and recurring jobs, and you reach it from Telegram, Discord, Slack, Matrix, or iMessage "
     "on a Mac. It is not a chatbot you open and type into: it runs on a schedule and comes "
     "back when it has something."),
    ("Does Otian AI see my conversations?",
     "No. When your agent thinks, it talks to Anthropic or OpenAI directly from your computer, "
     "on your account, with your key. We are not in the middle of it, and we keep no copy. "
     "What we do hold is your email address, your plan, and the operational records listed at "
     "https://otianai.com/trust/#what-we-hold. Your prompts still go to your AI provider, who "
     "is a third party; the claim is about Otian custody, not about secrecy from everyone."),
    ("Where does it run?",
     "On a computer you own and leave on. There is no Otian server running your agent, which "
     "is why there is no Otian copy of what it reads. A hosted agent platform cannot make that "
     "claim, because the runtime that assembles the prompt is theirs."),
    ("What does it cost?",
     "$30 a month, or $299 a year. Archie for Business is $99 a month or $999 a year. The AI "
     "itself is billed by your AI provider, to you, at their price: we add nothing to it. "
     "There is a plan with the AI included at $59 a month or $599 a year, which carries $25 of "
     "usage a month. Guided setup is $250 for an hour. Money back within 14 days."),
    ("Do I need to know how to code?",
     "No. Add-ons are written in plain words, not code, and you install one by picking it. "
     "Setting up an agent is answering a few questions about what it is for."),
    ("What is an add-on?",
     "One job you hand the agent, and there are 146 today, included with Archie for everyone. "
     "There are four kinds in the catalog and the site shows three, because a Specialist "
     "differs from a Skill in how it is built and not in anything a shopper is choosing "
     "between: Skills, Routines, and Personalities."),
    ("Can it send email or change my calendar on its own?",
     "Mail goes out when you tap Send or set a time for it, and a calendar change is proposed "
     "and waits for your confirmation. It cannot spend money or buy anything. It reads your "
     "calendar and answers chat messages without asking each time, which is the same door "
     "being useful, and is worth knowing before you connect either."),
    ("What can it connect to?",
     "48 apps and services: 5 chat apps, 7 AI companies, and 36 accounts and devices. Each one "
     "connects on an account of yours or over your own wifi, and none of them until you "
     "connect it."),
    ("Which AI models can it use?",
     "Your pick of 7 companies: Anthropic, OpenAI, Google, Groq, xAI, DeepSeek, and Mistral. "
     "You can also point it at any OpenAI-format endpoint you name. You bring the account and "
     "the key, and the provider bills you directly at their price."),
    ("How many agents and people?",
     "The plan runs 10 agents; the free trial runs 1. In the personal edition one agent answers "
     "one person, enforced in code. Archie for Business runs 50 agents and puts no ceiling on "
     "how many people an agent answers."),
    ("Is there a free plan?",
     "There is a free trial, not a free plan. It runs 14 days or until the starter credits are "
     "spent, whichever comes first, and there is a second form of it that runs on your own key. "
     "After that it is $30 a month."),
    ("What can I check for myself?",
     "All of it, and that is the point. https://otianai.com/trust/ lists every claim on this "
     "site with a pointer to the code that makes it true, and carries a 10-minute walkthrough "
     "for verifying the custody claim yourself with a network monitor. Claims we have not "
     "shipped are labelled as roadmap, and claims that were true and stopped being true are "
     "listed as corrections."),
]

# Sections of the map, in the order a reader needs them. A page not listed here still ships
# in the sitemap; this file is a curated map, not a second copy of it.
MAP = [
    ("The product", ["archie/", "how-it-works/", "archie/pricing/", "archie/see-it-work/",
                     "equipment/"]),
    ("Who it is for", ["individuals/", "business/", "consulting/"]),
    ("Add-ons", ["skills-marketplace/browse/", "skills-marketplace/what-is-an-add-on/",
                 "skills-marketplace/find/", "skills-marketplace/commission/",
                 "skills-marketplace/for-developers/"]),
    ("Privacy, security and claims", ["trust/", "trust/details/", "trust/it-review/",
                                      "security/", "privacy-policy/", "terms-of-service/"]),
    ("How we compare", ["compare/", "compare/chat-apps/", "compare/cloud-agents/",
                        "compare/automation-tools/", "compare/building-it-yourself/",
                        "compare/hiring-an-assistant/"]),
    ("About us", ["our-story/", "standard/", "contact/", "testimonials/"]),
    ("Learning", ["learn/", "faq/", "ai-explained/", "blog/", "help/"]),
]


def build_llms(pages):
    by_url = {p["url"]: p for p in pages}
    out = ["# Otian AI", "", "> " + " ".join(SUMMARY.split()), ""]
    out += [
        "This file is a curated map for answer engines. The full machine index is",
        "%s/sitemap.xml." % SITE,
        "",
        "Every claim below is one this site can back with a pointer to the code that makes it",
        "true. %s/trust/ is that page, claim by claim, and it lists the ones we got" % SITE,
        "wrong along with the ones we got right. If a claim here cannot be checked there, it is",
        "a mistake and we want to hear about it: questions@otianai.com.",
        "",
    ]

    out.append("## Common questions")
    out.append("")
    for question, answer in QUESTIONS:
        out.append("- **%s** %s" % (question, " ".join(answer.split())))
    out.append("")

    for heading, wanted in MAP:
        rows = []
        for path in wanted:
            url = SITE + "/" + path
            page = by_url.get(url)
            if not page:
                continue
            label = page["title"] or path
            summary = page["description"]
            if len(summary) > 240:
                summary = summary[:237].rsplit(" ", 1)[0] + "..."
            rows.append("- [%s](%s)%s" % (label, url, ": " + summary if summary else ""))
        if rows:
            out.append("## " + heading)
            out.append("")
            out += rows
            out.append("")

    out += [
        "## What we do not claim",
        "",
        "- Archie cannot spend money or buy anything.",
        "- It connects to no bank. The add-ons that track bills and spending keep the list you",
        "  give them.",
        "- We are not a compliance certification. Your content still flows to a cloud AI",
        "  provider under your own account, so nothing here makes a deployment HIPAA or GDPR",
        "  compliant on its own.",
        "- We hold your email address and your plan. Any page saying we collect nothing is",
        "  wrong, and we have listed what we hold rather than rounding it to zero.",
        "- Windows builds are not code-signed yet, so Windows shows a warning on first run.",
        "  The install page says what we are doing about it and how to check the download",
        "  without having to trust us.",
        "",
    ]
    return "\n".join(out) + "\n"


TARGETS = ("sitemap.xml", "robots.txt", "llms.txt")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="exit 1 if a generated file is missing or stale")
    args = parser.parse_args()

    pages = public_pages()
    wanted = {
        "sitemap.xml": build_sitemap(pages),
        "robots.txt": build_robots(),
        "llms.txt": build_llms(pages),
    }

    if args.check:
        stale = []
        for name in TARGETS:
            path = os.path.join(ROOT, name)
            if not os.path.exists(path):
                stale.append((name, "missing"))
                continue
            with open(path, encoding="utf-8") as fh:
                if fh.read() != wanted[name]:
                    stale.append((name, "out of date"))
        if stale:
            print("gen-discovery: %d file(s) need regenerating.\n" % len(stale))
            for name, why in stale:
                print("  %-14s %s" % (name, why))
            print("\nRun: python3 scripts/gen-discovery.py")
            return 1
        print("gen-discovery: clean. %d public pages." % len(pages))
        return 0

    for name in TARGETS:
        with open(os.path.join(ROOT, name), "w", encoding="utf-8") as fh:
            fh.write(wanted[name])
    print("gen-discovery: wrote %s from %d public pages."
          % (", ".join(TARGETS), len(pages)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
