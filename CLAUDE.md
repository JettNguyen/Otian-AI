# Otian AI: marketing site

Static site. Hand-written HTML per page, one shared `css/styles.css`, one shared `js/nav.js`.
There is no build step and no templating: the nav is duplicated in every page (two copies:
desktop nav and mobile drawer), so nav changes must be scripted across all pages.

## Trust claims: read TRUST.md before writing copy

**This site's product is trust. Privacy and safety claims are load-bearing, and a false one
costs more than every feature on the site combined.**

Before writing, editing, or approving ANY sentence that touches privacy, security, data
handling, or what the agent will and won't do without asking:

1. **Read [TRUST.md](TRUST.md).** It lists every claim we are allowed to make, in approved
   wording, each with a pointer to the code in the Archie repo that makes it true.
2. **Apply the test:** *could I defend this exact sentence to a hostile engineer with a packet
   sniffer, using only what ships today?* If no, it does not ship.
3. **If the claim is not in TRUST.md, you may not make it**, no matter how obviously true it
   seems. Verify it against the Archie source at `/Users/Games/Desktop/Code/Archie`, add it to
   TRUST.md with its code pointer, then use it.
4. **Never describe an unshipped feature in the present tense.** Roadmap items are labelled as
   roadmap, with a date, or they are absent.
5. **Check the banned-phrasings table in TRUST.md.** Several natural-sounding, punchy claims
   ("your data never leaves your device", "fully private", "zero data collection") are false
   or unfalsifiable and are prohibited outright.

TRUST.md also tracks claims that are **currently live on the site and false**. Do not
propagate them to new pages. Do not "improve" them. They are being fixed.

## The Otian Standard: what our operating principles require of copy

Source: **The Otian Standard, our operating principles, v4.0 (2026)**, written by Jett and Jack.
As of 2026-08-31 it is **published in full at `standard/`**, so it is no longer an internal
document this file has to paraphrase: read the page. What follows stays here anyway, because it
is the part that governs words on the site and it is faster to enforce than 5,600 words of prose.
Where the two ever disagree, the page is the document and this is the summary.

Two things the page settled that copy has to respect. The money-back guarantee is **14 days**,
matching the Terms of Service, and no page may describe it as unconditional. And Principle 7's
"consequence gets consent" is a **design rule, not a shipped-capability claim**: the page states
the rule, then names what is actually enforced today in TRUST.md's approved wording, then names
what the confirmation does not do. Copy it in that order or not at all.

These sit alongside TRUST.md rather than above it. TRUST.md governs whether a claim is **true**.
These govern whether a true claim is being made **decently**.

- **No urgency, shame, or fear. Ever.** No countdown timers, no "only 3 left", no "act now",
  no discount that is not really expiring, no implying the reader is behind or foolish for not
  having this yet. A real capacity limit is different and is allowed: say it as capacity, in
  plain numbers, with the reason ("we are two people, so this is a handful of slots a week").
  The site was swept to zero urgency phrasings on 2026-08-25; keep it that way.
- **Never use our smallness as a defence.** Being a two-person team explains a fact; it never
  excuses a shortfall on its own. Every time the site says we are small it must, in the same
  breath, carry either a remedy the reader can use or a commitment with a trigger. The Windows
  code-signing passage on `archie/install/` is the model: it names the cost, says what we will
  do, and then hands the reader a way to check us without trusting us.
- **This is a marketing site, so market. Never put ourselves down unless the truth requires it.**
  Honesty is a floor, not a genre: it obliges us to state every limitation, and it never obliges
  us to volunteer a self-criticism nobody asked for, to frame a concession as our failing when
  the same fact reads plainly from the reader's side, or to end a true sentence on the half that
  makes us look worse. Test any self-diminishing clause by deleting it: **if the sentence is
  still true and complete without it, it was decoration, and it goes.** "Four things we cannot
  offer" and "Four things your own build does better" concede the same four points; only one of
  them is written by someone who wants the reader to buy. The comparison pages set the idiom:
  frame the other side's advantage as what it buys *them*, not as what we lack. And a limitation
  we are obliged to publish still gets its remedy in the same breath, per the rule above: the
  reader should finish the sentence knowing what to do, not knowing we feel bad.
- **Name the concrete thing before you ship the sentence.** Hours back, a task they stop doing,
  a cost they avoid. If a paragraph cannot say what the reader gets, it is decoration and does
  not ship. Not a number we have not measured, though: see the badges rule in FACTS.md. An
  honest "what this takes off your plate" beats an invented "saves 5 hours a week".
- **Publish the limitation beside the capability, on the same page.** Not lower down, not in the
  FAQ, not on `/trust/` only. A reader who scans one section must meet the catch that belongs to
  it. This is the rule the `skills-marketplace/browse/` can-and-cannot section exists to satisfy.
- **The last line of a page is the one that gets remembered.** End on the most useful thing the
  reader can do next, in their words, never on a marketing flourish and never trailing off. If a
  CTA block would read the same on any other company's site, rewrite it.
- **Assume competence, answer the question underneath.** The stated question is the surface.
  Someone asking "can it move my 3 o'clock?" is losing an hour a week to calendar tetris. Answer
  what they asked, then address the thing beneath it, without ever implying they should have
  known.
- **No dark patterns in copy.** Cancelling is described as plainly as starting. No pre-checked
  boxes, no double negatives on consent, no cost mentioned only after the decision point. Costs
  that go to a third party (the AI account) get explained before purchase with realistic
  estimates, never best-case ones.
- **We beat competitors by being better, not by misrepresenting them.** Already enforced by
  TRUST.md's competitor table; it is a principle here too, so a comparison page that would pass
  the sourcing rule and still leave a false impression does not ship.

**The tie-breaker, when principles conflict and a page is genuinely close.** Run these in order,
and if any fails, do not ship it: would we be comfortable if the reader knew everything we know
about why this sentence is worded this way? Would we recommend this to a parent who would not
check? Does it give more than they paid for, or less? If someone with no loyalty to any of this
optimised the page ruthlessly, would the reader still be served? If it appeared on the front page
in two years, would we defend it or explain it away? **The short version: the money is never the
reason.**

## Copy conventions

- **No em dashes anywhere in site content.** Never use the `—` character (U+2014) or the
  `&mdash;`/`&#8212;`/`&#x2014;` entity in any served file: HTML copy, CSS/JS comments and
  strings, the marketplace `data/**/*.json` catalog, and glossary/blog markdown. Restructure
  with a colon, comma, semicolon, period, or parentheses so the sentence still reads well.
  En dashes (`–`) and hyphens (`-`) are fine. The site was swept to zero on 2026-07-24; keep
  it that way, and run `python3 scripts/check-facts.py` before committing (it checks this and
  the figures rule below in one pass).
- **Every money figure on the site must be listed in [FACTS.md](FACTS.md)**, with where it
  comes from. There is no build step, so the same price is typed into eleven files; this list
  plus `scripts/check-facts.py` is the only thing stopping the drift that has a competitor
  saying 60 seconds on one page and 2 minutes on three others. Adding a figure to a page means
  adding it to FACTS.md first. If you cannot say where a number comes from, it is not a fact.
  FACTS.md also records the figures we deliberately do **not** publish and why.
- **Every page has a word budget, and `scripts/check-copy-length.py` enforces it.** A page with
  no build step grows one well-meant paragraph at a time, each defensible on its own, until the
  page nobody re-read end to end is three screens longer than the thing it sells. Marketing
  pages get **900 words** of body copy; a handful carry a documented higher ceiling (the
  homepage, How It Works, pricing), and reference pages whose job is completeness (terms,
  privacy, trust, the FAQ, blog posts, comparisons, our story) are exempt. Diagram labels are
  counted and reported but never budgeted: a figure earns its words by replacing prose, and
  taxing it pushes copy back into paragraphs. **Run it before you commit**, alongside
  `check-facts.py`. When a page is over, the fix is cutting it; raising a budget is a
  deliberate act that needs the reason written beside the number. The usual source of the
  overage is the same fact stated in three places, so cut the restatements first and let each
  claim live once.
- **Bump the stylesheet version when you change `css/styles.css`.** Every page links it as
  `css/styles.css?v=YYYYMMDD-N`. GitHub Pages serves the file with `max-age=14400`, so without
  a new URL a returning visitor gets today's HTML against a stylesheet up to four hours old,
  which looks exactly like the site is broken rather than cached, and a hard refresh does not
  fix it because the cache is at the CDN edge, not in the browser. Changing the query string
  is the only thing that reliably busts it. One scripted find-and-replace across every page.

- The marketplace umbrella noun is **"Add-on"**; Skills, Specialists, Routines, and Personalities
  are its kinds. Never "add an add-on".
- The thing Archie runs on is a **"computer"**, never a "machine" (swept 2026-08-20; "machine"
  is borderline jargon and broke the one-name-per-concept rule, since "computer" already carried
  the concept everywhere else). Blog posts keep their own voice.
- Guided sessions are **$250/hour**, one hour per session; "$250/session" and "$250/hour" are
  the same claim, not a contradiction.
- Every explain-figure carries **paired desktop/mobile SVG variants**, swapped at 640px.
  Diagrams must never scroll horizontally.
- **Plain words, and never talk down.** (Mirrors the Archie repo's plain-words rule.) Write so a
  first-time, non-technical reader understands, without making them feel stupid. Define a term the
  first time it appears rather than in a glossary, keep **one name per concept** across the whole
  site (an "agent" is not also a "bot" or an "assistant" three sentences later), and never state a
  problem without the next step. Simplicity and ease are the point, but you *show* ease by being
  clear, you don't *assert* it: cut "it's so easy!", "don't worry", "as simple as that", baby-talk
  analogies, and over-explaining the obvious, all of which imply the reader might not keep up. The
  opposite failure counts too: unexplained jargon (API key, keychain, provider) that assumes the
  reader already knows. Respect the reader as capable but new.
