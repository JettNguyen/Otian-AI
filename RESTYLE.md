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
- [ ] `archie/pricing/`. The 3-costs story as three bands; price cards keep FACTS.md
      figures exactly.
- [ ] `archie/see-it-work/`. Mostly the recording; light touch, header grammar and captions.
- [ ] `skills-marketplace/browse/` (+ the product detail template). Align headers, stat
      row, alternation; the catalog grid already reads as product objects.
- [ ] `what-you-need/` and `how-it-works/`. Chips and steps; both trim well.
- [ ] `individuals/` and `questionnaire/`. Conversion pages; short bands, one CTA each.

### Phase 2: story and support
- [ ] `our-story/`. Team layout matches home: Jett and Jack on the top row, Jeff beneath.
- [ ] `testimonials/`, `faq/`, `contact/`.
- [ ] `ai-explained/`, `skills-marketplace/what-is-an-add-on/`, `what-is-a-skill/`,
      `for-developers/`, `commission/`, `submit/*`.
- [ ] `blog/` index and the post template. Typography and header grammar only; posts keep
      their voice and length.

### Phase 3: shell and utility
- [x] `about/`: folded into `our-story/`. Already a meta-refresh redirect with a
      canonical, and nothing links to it; no further work.
- [ ] Account-adjacent pages (`account/`, `login/`, `billing/`, `activity/`, `phone/`,
      `equipment/`, `app-auth/`): they inherit the tokens already; verify grounds and
      labels, nothing structural.
- [ ] Legal (`privacy-policy/`, `terms-of-service/`): measure and type only, no copy changes.
- [ ] `admin/*`: internal; tokens only, skip the restyle.
- [ ] `app-security/`: stays mirroring the Archie app's own palette, documented exception.

### Global, after the pages
- [ ] Footer: same quiet grammar (it already alternates correctly; check column noise).
- [ ] Nav: unchanged for now; any slimming is its own scripted change across all pages
      (the nav is duplicated per page, twice).
- [ ] 404 page, if present, gets the shell.
