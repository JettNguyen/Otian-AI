# Otian AI — marketing site

Static site. Hand-written HTML per page, one shared `css/styles.css`, one shared `js/nav.js`.
There is no build step and no templating: the nav is duplicated in every page (two copies —
desktop nav and mobile drawer), so nav changes must be scripted across all pages.

## Trust claims — read TRUST.md before writing copy

**This site's product is trust. Privacy and safety claims are load-bearing, and a false one
costs more than every feature on the site combined.**

Before writing, editing, or approving ANY sentence that touches privacy, security, data
handling, or what the agent will and won't do without asking:

1. **Read [TRUST.md](TRUST.md).** It lists every claim we are allowed to make, in approved
   wording, each with a pointer to the code in the Archie repo that makes it true.
2. **Apply the test:** *could I defend this exact sentence to a hostile engineer with a packet
   sniffer, using only what ships today?* If no, it does not ship.
3. **If the claim is not in TRUST.md, you may not make it** — no matter how obviously true it
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

- The marketplace umbrella noun is **"Add-on"**; Skills, Workers, Routines, and Personalities
  are its kinds. Never "add an add-on".
- Guided sessions are **$100/hour**, one hour per session — "$100/session" and "$100/hour" are
  the same claim, not a contradiction.
- Every explain-figure carries **paired desktop/mobile SVG variants**, swapped at 640px.
  Diagrams must never scroll horizontally.
