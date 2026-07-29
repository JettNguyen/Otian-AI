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

## Copy conventions

- **No em dashes anywhere in site content.** Never use the `—` character (U+2014) or the
  `&mdash;`/`&#8212;`/`&#x2014;` entity in any served file: HTML copy, CSS/JS comments and
  strings, the marketplace `data/**/*.json` catalog, and glossary/blog markdown. Restructure
  with a colon, comma, semicolon, period, or parentheses so the sentence still reads well.
  En dashes (`–`) and hyphens (`-`) are fine. The site was swept to zero on 2026-07-24; keep
  it that way, and grep new copy before committing (`git grep '—\|mdash'`).
- The marketplace umbrella noun is **"Add-on"**; Skills, Workers, Routines, and Personalities
  are its kinds. Never "add an add-on".
- Guided sessions are **$100/hour**, one hour per session; "$100/session" and "$100/hour" are
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
