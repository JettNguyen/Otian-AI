#!/usr/bin/env python3
"""check-copy-length.py: no marketing page may run longer than its budget.

Why this exists. There is no build step and no editor, so a page grows one
well-meant paragraph at a time, each of them defensible on its own, until the
page nobody re-read end to end is three screens longer than the thing it is
selling. This counts the words a visitor actually reads and fails when a page
is over budget.

What counts: everything inside <main> that a reader sees, minus the nav, the
drawer, the footer, scripts, styles, <svg> innards, and anything marked
aria-hidden="true" (since 2026-09-01: the works-with band's marquee is one real
list and three hidden copies that exist only so the loop has no seam, and a
reader reads the names once, not four times). Diagram labels are
counted separately and reported, never budgeted: a figure earns its words by
replacing prose, and taxing it pushes copy back into paragraphs.

A <figcaption> counts as figure words too, for the same reason (2026-09-15).
The visual-first rules in CLAUDE.md make a caption the place a figure's claim
is written down, so charging a page for writing one pushes the answer toward
no caption at all, which is the failure the rules exist to stop. The loophole
that opens is real and CAPTION_MAX closes it: a caption is a caption, not a
paragraph parked somewhere the budget cannot see.

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

# Words one <figcaption> may carry. Captions are free of the page budget, so this is
# what stops a paragraph moving into one: the longest caption on the site when this
# landed was 31 words, so 40 leaves room to state a claim and its catch together and
# still fails a caption that has become prose.
CAPTION_MAX = 40

# A page over DEFAULT_BUDGET needs a reason here, not a bigger default. These
# are ceilings, not targets: a page at its budget has to cut a paragraph to add
# one, which is the whole point.
BUDGETS = {
    # what-it-does/ is a picker, and the budget is measuring the wrong thing on it. The default
    # 900 exists because a prose page grows one well-meant paragraph at a time until nobody has
    # read it end to end. This page cannot fail that way: twelve panels are in the markup and a
    # reader is shown ONE. The arithmetic, counted 2026-09-21: 810 of its 1,048 words are the
    # twelve panels at 59 to 75 words each, 238 are the hero, the chips, the two catches and the
    # close, so what anybody actually reads at rest is 238 + 68 = about 306 words, a third of
    # what a marketing page is allowed. The eleven they do not read are in the HTML on purpose,
    # because visual-first rule 6 says the resting state has to be complete for a crawler, an
    # answer engine and a reader with scripts off, and the glossary's "Entries shown: 0" is what
    # the alternative looks like. Taxing that would push the content back into a prose page,
    # which is the same reason figure labels are counted and never budgeted.
    # Set at 1060, twelve above today's count, so a thirteenth persona costs one of the twelve
    # rather than arriving free. If the panels ever stop being one-at-a-time, this goes back to
    # the default the same day.
    "what-it-does/index.html": 1060,
    # The homepage carries the whole story once: what Archie is, who it is for,
    # what it costs, and why to trust it. It is the one page allowed to.
    # Raised 2026-09-08 from 1200, for the five setup steps: the page had a band
    # of three requirement chips answering "can I", and nothing answering "what
    # am I in for", which is the question somebody has after the recording. Two
    # cuts paid for most of it. Two stops came off the day spine because the hero
    # now runs seven scenes and those two were the same scene twice (the drafted
    # reply to Sam, and a sentence becoming a routine), and the AI bill stopped
    # being described three ways in one sentence. The 76 that were left are the
    # steps themselves, and they are the page's most concrete words.
    # Cut 2026-09-14 from 1300 to 1270, page at 1,269, and this is the one of the five that
    # did not give up its 150. What it gave was 24 words of loose phrasing: "it takes on more
    # in three directions" said aloud what the three bullets under it already are, "charged to
    # your account at your AI company's price" carried a clause its own sentence repeats, and
    # "before you type anything" was decoration on a true sentence. Everything else that counts
    # here is one distinct claim per line, and the page is already the most drawn on the site:
    # 542 figure words, three phone screens, an integrations grid, a record of work and a
    # five-step band. The prose left is the connective tissue between drawings, and taking
    # another hundred out of it means taking out a claim, not a restatement. The three repeated
    # sentences the record used to carry came out too, but they were inside an aria-hidden mock
    # and never counted: a log does not print its own footnote in every row.
    "index.html": 1270,   # raised 2026-09-11 from 1280: the recording's index under the demo, six moments as buttons, is 28 words counted as body because it is HTML rather than SVG, and six moments do not index in fewer
    # How It Works is a procedure. A reader following along needs every step.
    # Raised 2026-09-11 from 1400, because the page absorbed archie/see-it-work/
    # rather than growing: that page was a second explanation of the same journey
    # with better evidence, and a reader had to find both to get either. This is a
    # net cut, not an addition. The two pages ran 1,896 words against 2,300 of
    # combined budget; merged and de-duplicated they run 1,695. What came off was
    # restatement, every word of it: the parts defined once in the diagram instead
    # of again in the setup steps, one of the two "Archie is in testing" lines, the
    # computer answered in the requirements instead of again in step one, and the
    # custody sentence that the moving-parts section already makes in full. What
    # came on is two silent recordings and the file-formats section, which is the
    # only place the site says what the agent actually hands you.
    # Back at its ceiling on purpose: a paragraph added here still has to cut one.
    # Raised 2026-09-14 from 1700 to 1750, on the same terms as the raise above: the page
    # absorbed /equipment/ rather than growing. Those two ran 2,002 words against 2,600 of
    # combined budget; merged and de-duplicated they run 1,744, a net cut of 258 words and one
    # page. What came across is only what this page did not already have, the picker and the
    # reasons under "not needed"; /equipment/'s hero and its "short answer" lede both restated
    # requirement 1 and did not. Four more restatements the merge exposed came out with them:
    # the pointer sentence in requirement 1 (it now points down its own page), the figure
    # caption's line repeated as the skip list's lede, and the "hit a ceiling" bullet that said
    # step 6 over again word for word.
    # Cut 2026-09-14 from 1750 to 1550, with the page at 1,507. This is a budget coming down
    # rather than a page coming in under one, so the arithmetic is the other way round: 238
    # words came off and one whole section with them. All of it was restatement the two merges
    # left behind and nobody had read end to end since. The price of a plan was typed three
    # times in three sections and is now typed once; the chat-app roster twice and now once;
    # "the computer you already own" three times and now once; the custody sentence and the
    # approval sentence each lived in the moving-parts caption and again in a later list. The
    # section that went was "You do not need to be technical", which was one sentence under an
    # h2: its first half is the lede's job and its second half pointed at the guided path that
    # the fork above the CTA sets out in full. What did not come off is anything a reader came
    # for: every requirement, every reason under "not needed", and the whole trust caption.
    # Cut again the same day, 1550 to 1400, page at 1,392, as the second of the five ceilings
    # coming down 150. This one had no restatement left to give, so it came off two structural
    # things instead. The provider roster was a sentence listing eight AI companies and is now
    # a grid of eight tiles, which is what a roster is; the rule that a page listing providers
    # lists every one of them still holds, and a grid keeps it honest by making a gap visible.
    # And "On your own, or with us beside you" was two columns of bullets summarising
    # services/, a whole page about that exact choice which did not exist when the block was
    # written: it is a fork and a door now, and its link no longer points at the guided-setup/
    # stub services/ replaced.
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
    # Raised from 2900 to 2960 on 2026-09-11 for the cost picker: three tabs and one
    # number above the measured table, so a reader who will not parse a six-column
    # table still gets their band. Its labels are the table's own words restated as
    # a control, about 70 of them, counted here as body only because the widget is
    # HTML and not SVG. Four notes moved into the fold and one was trimmed to pay
    # for it, which is why the rise is 60 and not the widget's full weight.
    # Considered for the 150-word drop on 2026-09-14 and left alone, for the reason already
    # written above: a cut here reads as a hidden fee. The arithmetic, so it is on the record:
    # of 2,977 words, 163 are the table and 880 the folds, and what is left is measured cost
    # with its source beside it. The visual-first direction the other four pages took is real
    # and it does not apply to a page whose job is to print every number we charge.
    # Raised to 3010 on 2026-09-17, for the free tier. Archie stopped being paid-only that day:
    # an AI account of your own opens the app with a limit of 20 jobs a day, and TRUST.md's entry
    # forbids offering the free tier anywhere without that number in the same breath. So it is a
    # new price on the page whose job is to print every one of them, in three places that each
    # have to stand alone (the free card, the two-lane section, and the plans lede). 41 words of
    # the rise were paid for first, out of my own additions and one sentence that was on two cards
    # word for word; what is left is the fact itself.
    "archie/pricing/index.html": 3010,
    # Archie Mobile is a sourced comparison that lives under archie/ rather than compare/,
    # because it is about our own product. 690 of its words a reader never meets as prose:
    # a 295-word comparison table, every quote in it another company's own wording, and a
    # 395-word sources fold collapsed behind a summary. Cutting either means dropping a
    # source or paraphrasing somebody else's security posture, which is how a comparison
    # becomes a misrepresentation. The prose is what this budget governs.
    # Rebuilt 2026-09-18 as a marketing page in the homepage's shape, one stage and four
    # acts, and the arithmetic is written down because a visual-first pass is supposed to
    # be a net cut and this one was not: 1,125 words before, about 1,370 after, +245. Where
    # it went: the three explainer sections the stage replaced ran 280 words and the four
    # captions run 330, because the app's op list and all three of TRUST.md's required
    # clauses for the sealed claim are now on the page (the old page carried two); the
    # three permission cards are 150 words of wording approved 2026-09-17 that exist
    # because the App Store makes us publish them, so they are published here where a
    # person reads them before trusting an app; the store tiles and the hero's line under
    # them are 40. The restatements were cut before the number moved: the second-door
    # sentence was on the page three times and is now once. Prose is about 680, still
    # under the 900 a marketing page gets, on a page that is meant to be looked at.
    "archie/mobile/index.html": 1400,
    # Working With Us is /guided-setup/ and /consulting/ merged on 2026-09-14, and the budget
    # is the merge's arithmetic rather than a concession. The two pages ran 1,494 words against
    # 1,800 of combined budget; merged and de-duplicated they run 1,191. This is a net cut of
    # 303 words and one whole page, not a page that grew.
    # What came off was restatement, every word of it: the "Which one is this?" list existed on
    # both pages in near-identical wording because each one's job was to hand the reader to the
    # other, the $250 rate was stated four times between them, and both closed on the same free
    # call. What is left is two halves that a reader sorts themselves into, which is what the
    # duplicated list was trying and failing to do across a page boundary.
    # At its ceiling on purpose: a paragraph added here still has to cut one.
    # Cut 2026-09-14 from 1200 to 1050, page at 1,048. This is the first of the five ceilings
    # coming down 150 each, on the reasoning that the site should be looked at more than it is
    # read. The rule that makes that possible is already here: figure words are counted and
    # never budgeted, so a paragraph that becomes a drawing is a real cut rather than a moved
    # one. This page was the whole argument for it. At 1,191 words it was the heaviest page on
    # the site carrying no drawing at all, zero figure words, and two of its paragraphs were
    # describing shapes: "an inbox, a calendar and a chat app on one computer" against "several
    # pieces that have to keep working without you in the middle", and "the rate never rises
    # with complexity" against a session count that does. Both are now drawn (149 figure words),
    # the rows under them went back to routing the reader instead of describing the shapes, and
    # the rest came off restatement: "if we are the wrong tool we say so on the call" was on the
    # page three times, and the build happening in sessions with you there was on it twice.
    "services/index.html": 1050,   # raised 2026-09-02 from 2700: the plan with the AI included is a second price on the same card and a proxy disclosure that TRUST.md requires in the same breath, about 150 words that cannot live on another page
}

# Pages whose job is completeness. Length is not a defect here.
EXEMPT_PREFIXES = (
    "trust/",       # the claim-by-claim page the whole site points at
    "blog/",        # posts keep their own voice and length
    "compare/",     # side-by-side arguments need both sides in full
    "ai-explained/",  # explainer for a reader who wants the long answer
)

EXEMPT_FILES = {
    # The catalog itself, 146 add-ons deep, written into the page by
    # scripts/gen-marketplace.mjs on 2026-09-07. The grid used to be an empty div a script
    # filled in, so this page measured 900-ish words and showed a crawler none of the shelf.
    # Now it ships the shelf. A word budget on a catalog is a budget on how many things we
    # sell, which is not a thing to have an opinion about: the fix for a page that is too
    # long is to cut copy, and there is no copy here to cut, only products. The hand-written
    # half of the page is what the budget was ever for, and it is 15 paragraphs, unchanged.
    "skills-marketplace/browse/index.html",
    "privacy-policy/index.html",   # saying less than the truth is the failure
    "terms-of-service/index.html",  # same
    "faq/index.html",         # a list of answers; its length is the question count
    # Troubleshooting. Exempt for the FAQ's reason and a second one that is stronger: every
    # answer here is read by somebody who already has the problem, so an answer that stops
    # short of naming the tab, the section and the button has failed at the moment it is
    # needed most. Cutting this page cuts the instruction, not the padding. Its length is
    # governed by the symptom count and by the plain-words rule, not by a budget.
    "help/index.html",
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
        self.cap_depth = 0
        self.body: list[str] = []
        self.figure: list[str] = []
        # Each <figcaption> kept on its own, so a caption can be checked against CAPTION_MAX
        # individually. Counting them only in aggregate would let one page carry a paragraph
        # in one caption and pass because its other captions are short.
        self.captions: list[list[str]] = []

    # Tags that never close, so they must not deepen a dropped subtree: a <br> inside a
    # hidden list would otherwise leave the parser dropping copy for the rest of the page.
    VOID = {"br", "img", "input", "hr", "wbr", "source", "track", "embed", "area", "col", "meta", "link", "base", "param"}

    def handle_starttag(self, tag, attrs):
        if tag == "main":
            self.depth_main += 1
        hidden = ("aria-hidden", "true") in attrs
        if self.drop_depth or tag in self.DROP or hidden:
            if tag not in self.VOID:
                self.drop_depth += 1
        elif tag == "svg" or self.svg_depth:
            self.svg_depth += 1
        elif tag == "figcaption" or self.cap_depth:
            if not self.cap_depth:
                self.captions.append([])
            self.cap_depth += 1

    def handle_endtag(self, tag):
        if self.drop_depth:
            self.drop_depth -= 1
        elif self.svg_depth:
            self.svg_depth -= 1
        elif self.cap_depth:
            self.cap_depth -= 1
        if tag == "main" and self.depth_main:
            self.depth_main -= 1

    def handle_data(self, data):
        if not self.depth_main or self.drop_depth:
            return
        text = data.strip()
        if not text:
            return
        if self.svg_depth:
            self.figure.append(text)
        elif self.cap_depth:
            self.captions[-1].append(text)
        else:
            self.body.append(text)


def count_words(chunks):
    return len(re.findall(r"[A-Za-z0-9$%][A-Za-z0-9$%'’.,-]*", " ".join(chunks)))


def budget_for(rel):
    return BUDGETS.get(rel, DEFAULT_BUDGET)


def is_exempt(rel):
    return rel in EXEMPT_FILES or rel.startswith(EXEMPT_PREFIXES)


def measure(path):
    parser = CopyExtractor()
    parser.feed(path.read_text(encoding="utf-8"))
    caps = [(count_words(c), " ".join(c)) for c in parser.captions]
    figure = count_words(parser.figure) + sum(n for n, _ in caps)
    return count_words(parser.body), figure, caps


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

    rows, failures, long_caps = [], [], []
    for rel, path in pages():
        body, figure, caps = measure(path)
        exempt = is_exempt(rel)
        budget = None if exempt else budget_for(rel)
        rows.append((rel, body, figure, budget))
        if budget is not None and body > budget:
            failures.append((rel, body, budget))
        # Every page, exempt or not: a caption is free of the page budget everywhere,
        # so it needs its own ceiling everywhere.
        for n, text in caps:
            if n > CAPTION_MAX:
                long_caps.append((rel, n, text))

    if args.report:
        rows.sort(key=lambda r: -r[1])
        print(f"{'page':44} {'copy':>6} {'budget':>7} {'figure':>7}")
        for rel, body, figure, budget in rows:
            mark = "" if budget is None or body <= budget else "  OVER"
            print(f"{rel:44} {body:6} {str(budget or 'exempt'):>7} {figure:7}{mark}")

    if long_caps:
        print()
        for rel, n, text in long_caps:
            print(f"check-copy-length: {rel} has a {n}-word figcaption, max {CAPTION_MAX}")
            print(f"    {text[:110]}...")
        print("\nA caption states the figure's claim. Anything longer belongs in the page copy,")
        print("where the budget can see it.")

    if failures:
        print()
        for rel, body, budget in failures:
            print(f"check-copy-length: {rel} runs {body} words, budget {budget} ({body - budget} over)")
        print("\nCut the page, or raise its budget in scripts/check-copy-length.py with the reason.")

    if failures or long_caps:
        return 1

    counted = sum(1 for r in rows if r[3] is not None)
    print(f"check-copy-length: clean. {counted} pages budgeted, {len(rows) - counted} exempt.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
