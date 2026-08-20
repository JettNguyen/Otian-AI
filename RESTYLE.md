# RESTYLE: one quiet grammar across the whole site

The homepage rebuild (2026-08-18, "The homepage becomes the quiet spine") is the reference.
Every page moves to the same grammar, one page per commit, until the experience is uniform.
This file is the working checklist; tick pages as they land.

## The grammar (what every page inherits)

1. **Section shell.** Centered `.hm-wrap` / `.hm-head`: uppercase eyebrow, serif
   sentence-case heading (with a period), content below. No ornaments, no logo marks
   inside the page body: the brand lives in the nav and footer only.
2. **Strict band alternation.** Sections alternate `--bg-primary` / `--bg-secondary`
   top to bottom, no exceptions and no back-to-back same-ground bands. A section whose
   visuals need an exact ground (masks, diagrams) paints it explicitly (see `.hm-day`).
3. **Two accents, split by meaning.** Ember is Archie acting (and every CTA). Blue
   (`.section-label--trust`, `--c-blue-ink`) is assurance and verification: custody,
   approvals, guarantees, the trust page. Kind colors appear only on kind chips.
4. **Stone dark.** Done globally in tokens (2026-08-18). Pages must not carry their own
   dark hexes; the app-security page is the one documented exception (it mirrors the app).
5. **Less text.** One idea per band. A band is a heading plus at most one short paragraph
   or one visual. Depth moves behind links to detail pages instead of stacking paragraphs.
   Say each reassurance once, where it lands hardest, not on every page. Headings survive
   being read alone (TRUST.md rule); body copy assumes a capable first-time reader.
6. **Components over prose.** Counts become stat rows with glyphs. Claim lists become the
   borderless checklist, never a card grid (cards are for diagrams and product objects).
   Setup requirements are chips. Chat illustrations sit inside phone zoom-ins
   (`.hm-pz`: bezels, wallpaper, faded top and bottom), drawn in site tokens, never
   claimed screenshots. Iconography is the drawn glyph set: stroke `currentColor`,
   width 1.7, round caps, 24 viewBox.
7. **Motion.** `fade-up` reveals everywhere, plus at most one signature motion per page
   (homepage: the spine draw). Everything respects `prefers-reduced-motion`.
8. **Copy checks.** Zero em dashes; every figure in FACTS.md; every trust-adjacent
   sentence in TRUST.md wording; `python3 scripts/check-facts.py` before each commit.

The `hm-` classes in styles.css section 43 are the shared band system, not homepage-only;
reuse them rather than minting parallel ones. If a page needs a new component, add it to
section 43 with the same naming.

## Structure tokens (no mixing)

One scale each, and a component is either on the scale or it is a documented exception:

- **Color.** Only tokens, never new hexes in a page or component. Two layers, split by
  altitude (decided 2026-08-19, replacing the label-based split):
  - **Ember is the top layer**: every eyebrow label, every button and CTA, headline
    accents, and the primary subject of a diagram (Archie, the agent, the action).
    `.section-label--trust` is gone; no label is ever blue.
  - **Blue is the supporting layer**: text links inside body and subtext (`.hm-micro a`,
    `.marketplace-text-link`, `.calm-note a`, `.price-card-link`), checkmarks and list
    ticks (`.two-col-card-list`, `.plan-list`), small uppercase component headers
    (`.calm-list-label`, `.price-card-label`, `.faq-group-title`), supporting icons
    (`.feature-icon`, `.value-icon`, `.use-case-item svg`), diagram wayfinding (step
    badges, wire captions, time dots), the nav's current-section underline, the advisor
    ring, and the status pill. One deliberate exception: the six custody glyphs on the
    homepage stay ember, because there they are the argument, not support.
  - **Kind colors** appear on kind chips and anywhere the three kinds are compared:
    skills ember, personalities plum, routines teal (matching the app).
- **Radius.** `999px` for pills and tabs; `--radius` (12px) for cards, frames, nodes, and
  chips; `--radius-sm` (8px) for small controls. One exception, documented at its
  definition: chat bubbles are 16px with a 5px tail corner, because that is the messaging
  idiom and the card radius would make them read as cards.
- **Type roles.** Georgia serif for display headings and stat numerals; Inter for
  everything else; uppercase 650-weight letterspaced for labels and stamps. No new pairings.
- **Availability wording.** The canonical sentence is
  "Archie is in testing and not for sale yet." followed by a "See where it stands"
  link to `archie/#status`, which stays the single home of the underlying facts. No page
  restates platform detail, and no page invents a variant phrasing.
- **Closing CTA.** Every page closes on the quiet `hm-cta` band
  (`.hm-wrap.hm-head.hm-cta`: serif h2, button or `.hm-actions` pair, `.hm-micro` line),
  never the old `.cta-banner` card. The one place `.cta-banner` legitimately survives is
  as a functional mid-page card (the submit pages' sign-in gate and done banner, and the
  blog posts, which keep their own frame for now).

## Rollout order

Each page: restructure to bands, trim copy, verify dark + light + 390px mobile, run
check-facts, commit ("one page per commit" keeps review sane).

### Phase 1: the funnel
- [x] `trust/` and `trust/details/` (2026-08-18). Sentence-case serif headings, the
      hero&rsquo;s duplicate servers paragraph cut (the &ldquo;Our servers&rdquo; section
      is the single home of that list now), CTA converted to the quiet band. The
      receipts stayed: the outbound-connections table, the limits, and the provider
      quotes are the product, not filler.
- [ ] `archie/`. The product tour, one level deeper than the homepage (which now owns
      the day arc). Its bands: what an agent actually is and how that differs from a
      chat window; the Work board (Scheduled / doing / needs you / done); the add-on
      ledger (the six real catalog items that came off the homepage move here); where
      it runs and what it needs, briefly; and the testing status section (`#status`,
      which the homepage pill links to). Heavy trim of everything else.
- [x] `archie/pricing/` (2026-08-17). Sentence-case pass, each price said once, quiet
      CTA band; FACTS.md figures untouched.
- [x] `archie/see-it-work/` (2026-08-17). Header grammar and the quiet CTA band.
- [x] `skills-marketplace/browse/` (2026-08-18). Headers, casing, quiet CTA band; the
      hero stops counting kinds (the tabs show what there is). Product detail template
      still pending.
- [x] `what-you-need/` and `how-it-works/` (2026-08-17). Trimmed, cased, quiet CTA bands.
- [x] `individuals/` (2026-08-17) and `questionnaire/` (2026-08-18). Trimmed and cased;
      the intake form's step headings (and their JS labels) dropped title case.

### Phase 2: story and support
- [x] `our-story/` (2026-08-17). Cased, quiet CTA band. Team layout already matched home.
- [x] `testimonials/`, `faq/`, `contact/` (2026-08-18). FAQ keeps its depth by design
      (answers are collapsed); only the frame joined the voice.
- [x] `ai-explained/`, `skills-marketplace/what-is-an-add-on/`, `for-developers/`,
      `commission/`, `submit/*` (2026-08-18). The glossary keeps its depth by design;
      `what-is-a-skill/` is already a redirect stub. Commission's "Four Kinds" heading
      sat over three cards and went numberless.
- [x] `blog/` index (2026-08-18): header grammar. Posts keep their voice, length, and
      frame; the post template is untouched.

### Phase 3: shell and utility
- [x] `about/`: folded into `our-story/`. Already a meta-refresh redirect with a
      canonical, and nothing links to it; no further work.
- [ ] Account-adjacent pages (`account/`, `login/`, `billing/`, `activity/`, `phone/`,
      `equipment/`, `app-auth/`): they inherit the tokens already; verify grounds and
      labels, nothing structural.
- [ ] Legal (`privacy-policy/`, `terms-of-service/`): measure and type only, no copy changes.
- [ ] `admin/*`: internal; tokens only, skip the restyle.
- [ ] `app-security/`: stays mirroring the Archie app's own palette, documented exception.

### The comparison section (2026-08-19)

`compare/` and its four pages are new rather than restyled, and they inherit the grammar
above with one addition of their own. **A comparison page is a set of claims about somebody
else's company**, so TRUST.md's "Competitor claims" section governs it: every third-party
sentence needs a row there, every price is read from that company's own page and dated,
`scripts/check-facts.py` fails when a date goes past 90 days, and each page carries a
**"where the other option wins"** band plus a `Sources` fold. A comparison with no losses in
it is an advertisement and reads as one.

Band order, repeated on all four: hero (with the availability line and a visible checked
date), the short answer, the side-by-side `.cmp-table`, where the alternative wins, a
"worth saying" band that concedes the overlap, the `Sources` fold, the quiet CTA.

Sourcing is visible on the page, not only at the foot of it: every figure and claim carries a
numbered `.src-cite` superscript linking to where it was read, matching a numbered entry in the
`Sources` fold. The marker links out to the source rather than down to the fold, since the fold
is a `<details>` and a fragment link into a closed one depends on browser auto-expansion.

Dates in served content are written **Month Day, Year**, one format everywhere. Where a date is
rendered by script (`js/blog.js`, `billing/`, `activity/`) the locale is pinned to `en-US`
rather than left as `undefined`, which otherwise printed "19 Aug 2026" to a British reader and
"Aug 19, 2026" here. `FACTS.md` and `TRUST.md` keep ISO dates: `scripts/check-facts.py` parses
them, and they are not served.

Two components were added rather than duplicated. `.cmp-table` rides on `.cost-table`'s
rules instead of becoming this file's third copy of the same stacked table, and its
mobile treatment is keyed to `td:first-child` rather than to literal column names, which is
what makes `.trust-table` unreusable. `.two-col-card-list--plain` swaps the blue tick for a
dash: ticking a competitor's advantages in our own accent reads as sarcasm.

### Merges and the Learn hub (2026-08-20)

`what-you-need/` folded into `how-it-works/` as a `#what-you-need` band, sitting immediately
before "Your path to a running agent", which is the sequence it gates. Inserting a band flipped
the two after it, and that also fixed a pre-existing double `section-alt` at the foot of the
page; the grounds now alternate cleanly end to end. The page keeps its numbered requirement
cards and its paired desktop/mobile diagram. `what-you-need/` and `equipment/` are both
meta-refresh stubs pointing at the anchor: `equipment/` was pointed at the new target directly
rather than left chaining through `what-you-need/`.

`learn/` is new, and it exists because `ai-explained/` had **zero inbound links** anywhere
outside the nav and footer. Learn deliberately has no nav tab, so a hub carries it: the four
pages as `.resource-card--linked` cards, then a `.calm-list--ask` router, same grammar as the
compare hub. The footer's menu-less row is now Learn alone, opening on "Start Here".

Worth knowing for the next merge: a page-scoped `<style>` block loads *after* `styles.css`, so
`.need-list { margin: 0 auto }` silently beat the `.mt-48` utility on the same element once the
list stopped being the first thing in its section. Use `margin-inline` when moving a component
onto a page where a utility class has to reach it.

### Global, after the pages
- [x] Footer (2026-08-19). **The four columns now mirror the four nav menus exactly, link for
      link**, so the footer teaches nothing the nav contradicts: Archie, Add-ons, Compare,
      Company. Everything with no tab of its own (How It Works, AI Explained, Blog, FAQ, What
      You Need, Account) moved to a `.footer-extra` row of inline links under the columns, with
      no rule and no ground of its own, because a fifth column reads as a fifth menu. All 63
      footers are now generated from one template with a per-file relative prefix and a
      per-link assertion that the target exists; one blog post was still carrying a single
      "Pages" column from before the grid and is now in line with the rest.
- [ ] Nav: unchanged for now; any slimming is its own scripted change across all pages
      (the nav is duplicated per page, twice).
- [ ] 404 page, if present, gets the shell.
