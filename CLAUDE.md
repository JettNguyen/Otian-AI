# Otian AI: marketing site

Static site. Hand-written HTML per page, one shared `css/styles.css`, one shared `js/nav.js`.
There is no build step and no templating: the nav is duplicated in every page **three** times
(desktop dropdown, mobile drawer flyout, and the footer column), so a nav change is 3 edit sites
per page across ~72 pages and must be scripted. Verify afterwards with
`python3 scripts/check-nav.py`, not by eye: a regex that matches the desktop menu and misses the
footer leaves a link live in the place readers actually reach for. That check writes down no
canonical menu; the majority of pages is the canonical menu, so a deliberate change needs no
edit to it and an accidental one cannot hide. It exists because the `/equipment/` merge left
"What to Run It On" in all three of how-it-works/'s own menus and nowhere else (the sweep
matched the href the other 71 pages carried, and that page had a same-page `#` form), and left
services/ pointing its own footer at the `guided-setup/` stub it had just replaced. **The page
a merge is merging INTO is the one the sweep misses**, because its links are the ones written
differently. `python3 scripts/check-links.py` is the other half of the same lesson: a
redirect stub is for other people's links, never for ours, and on 2026-09-14 ten of our own
pages were still reaching their own content through one.

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

## Visual-first: seven rules for a figure

The site is moving its arguments out of paragraphs and into drawings. That is a direction,
not a licence: a figure fails differently from a paragraph, because copy is read by
everyone who opens the page and a figure can be read by nobody. These seven govern every
drawing on the site. Four have a script under them, `python3 scripts/check-figures.py`.
Three do not and never will; they are read by a person or not at all, and they are the
ones worth slowing down for.

1. **The visual carries the claim. The text is the caption.** Draw the figure first, then
   write the fewest words the drawing cannot say by itself. The test is deletion, the same
   one the self-diminishing-clause rule uses: cut the paragraph beside a figure, and if the
   figure still makes the point, the paragraph was decoration and it goes. *Enforced as a
   floor:* every figure carries a `<figcaption>`, and a caption is capped at 40 words by
   `check-copy-length.py`, because a caption is a caption and not a paragraph parked
   somewhere the budget cannot see. Caption words are free of the page budget (changed
   2026-09-15) so that writing one never costs a page anything.
2. **The thing that moves is the thing being claimed.** One idea per figure. A message is
   sent and a draft appears; that is motion carrying an argument. Drifting particles and
   decorative fade-ups carry none, and on a site whose product is trust, motion that says
   nothing reads as sales. *No script holds this one.*
3. **Show the real surface, not an abstraction.** Draw what the app actually shows, doing
   what it actually does. `archie/mobile/`'s three screens and the homepage's `.hm-stage`
   are the standard; a generic cloud-and-arrows diagram is not. *No script holds this one.*
4. **Motion has three tiers, and the tier is a decision.** Looping CSS is tier one and most
   of the site is there. Scroll-scrubbed is tier two, where the reader's scroll is the clock
   and nobody misses a beat. A small control the reader works is tier three, and it is the
   one that earns the most exactly where a reader is most skeptical: a toggle beats two
   hundred words of reassurance. Pick the tier on purpose rather than defaulting to the
   first. *No script holds this one.*
5. **A drawing makes claims, so TRUST.md governs it.** Every rule at the top of this file
   applies to words inside an SVG, to a caption, and to a shape: a figure showing work
   happening on your computer must still show the arrow leaving to an AI company, because
   the provider-egress clause has to stay visible wherever "no server of ours" is implied,
   and a drawing that stopped at the computer would be making a banned claim in pictures.
   The limitation belongs in the figure or in its caption, not in a paragraph that later
   gets cut. *Enforced:* `check-figures.py` reads TRUST.md's banned-phrasings table and
   fails any figure that says one, in a label, a caption or an accessible name.
6. **If the claim only exists in motion, machines see nothing.** A crawler, an answer
   engine, and a reader with reduced motion turned on all see the resting state. This is
   the glossary's "Entries shown: 0" bug in another costume. *Enforced:* every non-decorative
   `<svg>` carries an accessible name of real length, every figure carries a caption, and
   every animation sits inside a `prefers-reduced-motion: no-preference` block so the
   resting state is complete on its own.
7. **A visual-first pass is a net cut or it is not one.** Same arithmetic as the merge rule:
   write the old word count, the new one, and the difference. If a page gained a drawing and
   lost no prose, the restatement the drawing replaced is still sitting there, which is the
   usual outcome and the reason to check rather than assume.

**Staged, not diagrammed (2026-09-18).** Jett's direction, after seeing the five comparison
strips drawn as lanes and chains: flat boxes-and-wires SVGs "read as hard to understand at
first glance", and the homepage and the Archie pages "make it alive and right in front of the
person." So the direction for an argument figure is a staged scene with depth, real objects
and a character, and **each page gets its own scene, distinct in feel and obviously the same
brand**, never the homepage stage copied around ("i don't necessarily want to copy and paste
the homepage across all pages"). One page, one mechanism, no two pages the same trick, all in
the brand's own vocabulary: the app window and phone ports, Ember, the terracotta, the turned
floor, plain words. CSS perspective and real objects; never WebGL. Reference figures stay flat,
because they are read fastest that way and two of them are read by machines: the compare
hub's quadrant board, the trust packet map, the glossary, the installer dialog. The pilot is
the **day dial on `compare/hiring-an-assistant/`** (`.hd-figure`, the day dial section in
`css/styles.css`): one day as a clock face lying on a turned plane, midnight at the far edge,
a grey arc for the hours you agreed and a terracotta one for while the computer is on, one
hand sweeping the day, Ember walking the rim and a person at their desk for their hours. It
is one `role="img"` with the claim in its `aria-label` and everything inside `aria-hidden`,
as the homepage stage is, so `check-figures.py` does not see it and the resting state (eight
in the morning, every arc and label drawn) has to be checked by a person. Two things the
build taught: a percent height inside a transformed plane resolves to nothing in WebKit, so
Ember's box is a square made of width alone (padding, then the drawing filling it); and the
near edge of a tilted plane grows under perspective, so the scene needs more room below the
plane than a flat render shows. The second scene is the **drafts scene on `archie/personal/`** (`.pd-figure`, the drafts
scene section in `css/styles.css`, `js/drafts-scene.js`): the homepage's phone port standing
on a turned floor, three stations queued behind it, one draft landing at a time as the app's
own email card, and the reader's own Send is what lets the next one in. Two more lessons from
it: **an object on a floor stands at its foot's depth**, not at zero, because rotateX brings
the floor's near half toward the camera and a phone left at z 0 has the plane pass through
it (Jett saw the grid over the buttons); and **the homepage's under-971px phone rules are bare
`.dp-` selectors in a media block** (a shorter masked device, no status bar, square corners),
so any other phone on the site has to say its whole shape with more weight or it loses its
ends on a tablet. Jett's first look added two more (2026-09-18): **the floor wrapper needs
`transform-style: preserve-3d` itself**, or the tilted plane inside it is projected flat with
no camera and the grid is a squashed rectangle (the homepage's floor gets it from `.day-layer`,
which is easy to miss when copying the recipe; "is the grid supposed to have perspective?");
and **a scene that waits for the reader's press reads as stuck** ("it gets stuck on
highlighting your inbox"), the homepage's own lesson from the same day, so the script presses
each Send itself after a hold long enough to read a card, loops after the third, pauses off
screen, and a hand press does the same thing at once. And **the root of a 3D context is scaled
with a transform, never with zoom**: the box shipped zoomed to its column, Chrome drew it in
full, and Jett's browser drew a flat grid and a phone with no rim, because WebKit does not carry
a 3D context through zoom. `js/home.js` fits the homepage scene with `scale()` and zooms only
the mockups inside it, and the drafts scene now fits the same way (`--pk`, measured by
`js/drafts-scene.js`). No render here can check it: the WebKit snapshot tool draws every 3D
scene flat, on screen or off, so depth in Safari is checked by Jett or not at all. One more from
the same browser (2026-09-18): the glass's top corners stood over the bezel "sometimes", which is
WebKit dropping an overflow-plus-radius clip for a child that gets its own compositing layer (the
notice, a landing card, the spinner), so `.dp-ph` clips with `clip-path` as well, one `--ph-r`
driving the corner and the clip on every phone. The third scene is the **ring of phones on
`archie/business/`** (`.bz-figure`, the ring of phones section in `css/styles.css`,
`js/ring-scene.js`), the one the editions rule asked for once Personal had a scene: three
teammates' phones (the personal page's whole phone at a `--ps`) standing in an arc behind the
homepage's window (at a `--wz`) on the agent's Setup page, the one that says who can message it,
with the packet map's switch turning the one agent standing at the computer into three, each with
its own face and its own name in every phone's bar. Its message rolls from a phone to the
computer and back to the same phone, and no lane runs behind the window, because a ball that
vanishes behind an object for most of its run is not carrying the claim. Three lessons from Jett's
first look (2026-09-19): a name standing in front of a phone's foot covers its composer, so a
label stands 72 further in, which after the tilt lands just under the phone's bottom edge; a
figure holding a visually-hidden checkbox must be `position: relative`, or the one-pixel input
lands at the top of the page and a flip scrolls the reader up to it; and the glass's rounded
clip failed again under animation, so `.dp-ph` is its own compositing layer now (`will-change`)
on top of the clip-path. The fourth scene is the **two desks on `compare/cloud-agents/`**
(`.cl-figure`, the two desks section in `css/styles.css`, `js/desk-scene.js`): their computer as a
dark tower on the left desk, your own laptop on the right with the homepage's window as its
screen, one board at the back naming the AI each is wired to, a message on each wire, and the
lid, which closes every few seconds so the agent beside the laptop sleeps and your wire goes
quiet while theirs keeps carrying: the caption's honest second sentence, drawn, on the page whose
flat lanes Jett named first. **The laptop is the one object on the site that is not a billboard**:
it is built in the floor's own space, a base lying flat and a panel hinged at the base's back edge
whose rest is lying flat behind the hinge, so `rotateX(-80deg)` stands it up leaning back and
`rotateX(-180deg)` lays it shut on the base; the panel carries two faces with their backs hidden,
the screen and the lid, so closing shows the lid and never the window mirrored. Narrow, the two
desks stand one behind the other, theirs at the back and yours in front, and the laptop is scaled
about the front edge of its base so the name standing just past that edge stays under it. Jett's
first look (2026-09-19) taught four more. **The lid is the base's depth**: a panel deeper than the
base lies past its front edge when it is shut, and it ran under the name standing there, so the
base is 172 deep to match. **The near edge grows, so leave room**: an object 20 from the box's edge
at rest was cut off at rest and worse mid-swing, when the panel's top comes nearest the camera; the
composition stands 40 further left, with 34 to spare at rest and 18 at the widest point of the
swing. **A laptop is scaled with `scale3d`, never `scale`**: a 2D scale shrinks the base and the
panel's width but not the panel's height, which stands along the floor's normal, so the narrow
screen came out square on a two-thirds base. And **the wires are drawn once per composition**,
each out of a computer's side and around the open screen, with the tower far enough back that its
wire starts above the screen's top edge; narrow hid them at first, and a comparison of two wires
with the wires hidden is not one. The ring of phones had hidden its lanes narrow the same way,
and got its own the same day: three short lanes up from the phones' top edges to the agents'
feet, with the phones stood 80 lower to give them their length. The fifth scene is **the AI you
picked on `compare/chat-apps/`** (`.ch-figure`, the AI you picked section in `css/styles.css`,
`js/pick-scene.js`): seven platforms on the floor, one per AI company with its name on the slab's front
face, one plain chat window with a cord to every one of them, and your computer on Setup, AI
account, with a cord Ember carries to whichever platform you picked. **It was going to be a clock through the night,
and TRUST.md stopped that before a line was drawn**: the page's own table says chat apps
increasingly run scheduled tasks, so a chat app drawn idle all night would have been a claim the
page hedges; which AI answers is the one row of that table with no hedge on it, so that is the
claim. **Its control is the app's own picker, all seven rows of it**, as radios above the scene
in the app's order and words (`PROVIDER_ORDER`, `PROVIDER_LABEL`, the notes and key hints in
archie's `src/app/connections.ts`), because the rows drawn inside the window are far too small
to be the control, and a bar of three read to Jett as "only these three". The radios are direct
children of the figure, so the lit pad, the window's in-use row, its note and its key hint follow
`#ch-x:checked ~` in CSS alone, and the script owns only what a checkbox cannot redraw: where
Ember stands and the cord's path, a cubic built from `--st-*`, `--cord`, `--cord-c1` and
`--cord-in` on the scene, which narrow overrides. Three things its build taught: one unnamed chat
window wired to one company reads as arbitrary, three copies read as clutter, and one window wired
to three of seven reads as arbitrary again (every one of the seven has a chat app of its own), so
it is one window with a cord to each; Ember standing in front of a pad hides that pad's name, and a
name standing in front of the pad "falls off the platform", and behind the pad Ember "appears behind the platform", so Ember stands
on top of the slab, raised with it by `--z` and toward its front edge (at the center it read as
standing on the back of it), the name is the slab's own front face below its feet,
and the cord runs under the slab to Ember's feet, which shows as the cord entering the face, **and
the slab is built in the floor's space** like the laptop, a top raised by `translateZ` and a face turned up
perpendicular to the floor with `rotateX(-90deg)` about its bottom edge, because a billboard face
glued to a squashed top read as a flat 2D badge ("the platforms are 2d now"); and a
window standing in front of the pads' whole width hides both the pads behind it and the cord's
middle, so wide the pads sit left of a smaller window and narrow the window is small at the front
right with the cord routed up the left side.  **Every object in a scene is placed by a `[data-o]` rule, and every one of those is scoped
to its own scene** (`.bz-scene [data-o=...]`, not a bare `[data-o=...]`): the names are short,
three scenes each wanted `win`, `ember` and `l-you`, and a bare attribute selector ties with
the scene's own class so the block written later wins in silence. It cost three live bugs
found on 2026-09-21, one of which had cloud-agents' Ember standing at the other company's
tower on a figure whose whole claim is about the agent beside YOUR laptop. The ring shipped
right and was broken twelve hours later by a page nobody was editing at the time. The
concept
list for the other pages is in the session
memory (`staged-scenes-not-diagrams`): two desks with a lid closing, a divider you drag, a
clock through the night, two timelines, parts flying into the window, a ring of phones, the
app's own meter, a card flip. Build one, judge it, then set the pace.

**The thing the pilot taught, worth reusing.** `compare/cloud-agents/` was the first page
done this way, on 2026-09-15: the three-row `cmp-strip` table became one figure whose two
lanes carry the **same three chips**, so only the container around them changes, which is
the page's entire argument. The move that made it work was drawing what the two sides have
in common and letting one difference do all the talking. The five siblings got their own
drawings on 2026-09-18, each with its own one difference, and the `cmp-strip` table and its
CSS are gone: chat apps changes the box in the middle (symphony did too, until it merged into
cloud-agents on 2026-09-18), building it yourself keeps
the box and changes the state of the chips, and automation tools and hiring an assistant are
two rows of steps where the one difference is where the row stops. The same day the pricing
picker's three rows became bars on one scale, so a control and a chart are one object: the
sizes are on the page at rest, and the pick only lights one.

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
- **Bump the version when you change anything under `css/` or `js/`, and bump all of it
  together.** Every page links its assets as `...?v=YYYYMMDD-N`, one stamp per deploy. GitHub
  Pages serves them with `max-age=14400`, so without a new URL a returning visitor gets today's
  HTML against files up to four hours old, which looks exactly like the site is broken rather
  than cached, and a hard refresh does not fix it because the cache is at the CDN edge, not in
  the browser. Changing the query string is the only thing that reliably busts it. One scripted
  find-and-replace across every page, and `python3 scripts/check-asset-versions.py` after.
  **Until 2026-09-16 this rule said "stylesheet" and meant it**, which is how a change can ship
  half-deployed: Ember got four new moves and a backflip, `css/styles.css` got a new version,
  `js/ember.js` did not, and a second device ran the new keyframes against the old script for
  four hours. It hopped, which is what the old script knew how to do, and nothing about it
  looked broken. **A half-deployed change is worse than an undeployed one**, because there is
  no symptom to chase: the CSS is right there in the inspector. The check covers the third
  place this hides too, a module inside `js/` importing `"./faces.js"` bare from a versioned
  entry point, which pulls a stale module through a fresh one.
- **Five parts of this site are generated, and each has a `--check` mode. Run them before you
  commit.** There is still no build step: these write into the repo, the result is committed,
  and the check is what stops the committed copy drifting from what it was made from.
  - `python3 scripts/gen-discovery.py` writes `sitemap.xml`, `robots.txt` and `llms.txt` from
    the pages that exist, skipping the signed-in half, the noindex pages and the redirect
    stubs. Adding, renaming or retiring a page means running it. `llms.txt` is the one to be
    careful with: it is quoted back to people by machines that will not check it, so every
    claim in it is TRUST.md's approved wording or a FACTS.md figure, and it is checked by
    `check-facts.py` like any served file.
  - `node scripts/gen-marketplace.mjs` writes the public add-on catalog into
    `skills-marketplace/browse/` as static HTML. Until 2026-09-07 that grid was an empty div a
    script filled from Firestore, so everything that does not run JavaScript (every crawler,
    every answer engine, every link preview) saw the site's largest asset as the words "No
    add-ons match your filters." Firestore is still the authority and the script still
    replaces the grid on load; the markup is a snapshot of the public shelf. **It renders
    through `js/addon-card.js`, the same module the browser runs**, so there is one card
    builder and not two. Run it after the Archie catalog moves, in the push order FACTS.md
    already sets out for the count: Archie first, then here.
  - `python3 scripts/gen-phone-mocks.py` draws the three Archie Mobile screens into
    `archie/mobile/`, as the desktop trio and again as the under-640px gallery. Six drawings
    of three screens were hand-written SVG until 2026-09-14, which is how the two halves
    drift: a radius fixed in the gallery and missed in the trio reads as a bug nobody can
    find. **These are drawings of the app, not screenshots of it.** Everything on them has to
    be something the app actually has, doing what the app actually does; the styling was
    brought to the shipping build's from screenshots on 2026-09-14, and the content stays the
    site's own, because the real screens carry a real person's mail. The chat screen lays its
    thread out by accumulation against a composer drawn at a fixed height, so the generator
    asserts the gap: adding a bubble without tightening one fails the run rather than printing
    a timestamp over the input, which is what happened the first time.
  - `node scripts/gen-blog.mjs` writes the published posts into `blog/` from
    `assets/articles.json`, which had the same bug on a smaller scale: the hub page for fifteen
    posts carried 183 characters and named none of them. It renders through `js/blog-card.js`,
    which `js/blog.js` imports too.
  - `node scripts/gen-glossary.mjs` writes the 118 terms into `ai-explained/` from
    `assets/ai-glossary-final.md`: the entries, both curated pill lists, the A-Z rail and the
    count. **Same bug a third time, and it was the worst of the three**, because `llms.txt`
    names that page, so the one page we point machines at was the one shipping four empty
    elements and the words "Entries shown: 0". It renders through `js/glossary-card.js`, which
    `js/glossary.js` imports too. A glossary page is the one page on this site whose whole job
    is being quoted by something that is not a browser, so check it after any edit to the
    markdown.

- **The homepage is one stage, and its two objects are the app's own mockups (2026-09-16).**
  `index.html` is a sticky `.day-story` the scroll moves through: seven acts across one day, captions in one column, and one Ember inside the stage that
  `js/home.js` walks between marks on the objects. The window (`.da-*`) and the phone (`.dp-*`) in css/styles.css section 49 are
  class-for-class ports of `archie-app-mockup.html` and `archie-screen-kit.html`, two
  hand-editable mockups Jett keeps in his Downloads folder, which copy the Archie repo's
  tokens value for value. **They are not in any repo.** If the app's surface changes, change
  the mockup, then change the port; do not redraw either object from a screenshot. The phone
  shows the conversation as a chat app shows it and draws none of the phone app's own tabs,
  because Archie Mobile is in build and TRUST.md forbids showing it as shipped. Every caption
  sentence was already on the page or is TRUST.md's approved form; the scene is `role="img"`
  with the claims in its `aria-label` and `aria-hidden` inside, so `check-copy-length.py` counts the captions and not the mockups. **What the phone does is what the
  product does.** Jett's first review (2026-09-16) caught a "Sent to Sam" pill and a calendar Confirm
  card that exist in neither app, so both were replaced by what the code does: the calendar skill
  takes approval as a typed later message (its SKILL.md) and the email card's Send edits the card to
  "Sent (to Sam):" with the buttons gone, **keeping the email above it and the reply below it**,
  because `heading()` there is shared by the live card and by what it becomes and a receipt that has
  lost the question is not one (the app lost both once and Jett caught it; the site had the same bug
  until 2026-09-18, and only the one label is a before/after pair now) (`email/replies/actions.rs`, whose own form for a reply that
  is), after the pressed button stays lit and busy, a spinner where its mark was, until the computer
  answers (`InlineActions` in archie-mobile's `ui.tsx`, since its commit 8533dae of 2026-09-18; it
  lit for a 700ms beat and retired before that, and so did the site until the same evening), and
  the answer also arrives as a notice over the screen in the computer's own words, "Sent ✅", which
  leaves on its own. The kit in Downloads carries both states as "Chat · Send pressed" and "Chat ·
  Sent". **The scroll runs the wait too, and that is not a detail** (2026-09-18): the busy beat ran on a
  900ms timer, so it resolved whether or not anybody scrolled and the sent card arrived with almost
  none of the act left. `at` starts the spinner and `done` settles it, both in scroll. A press by
  hand keeps a real clock, because somebody who presses and stops scrolling still has to see it
  land. **The scroll presses
  whichever of those two the reader has not**, further down each act (2026-09-18, `SENDS` in
  js/home.js): the buttons stay live and a press still does the whole thing at once, but a sent card
  and a moved meeting are what those two acts claim, and until then both claims sat behind a click
  most readers never make. Scrolling back under the screen's own beat takes the send apart again.
  Before drawing a control on either mockup, find it in the app. The mockups are laid out at the size they are shown
  (`zoom`, never `transform: scale()`; the section's comment says why hairlines shimmered), and the
  window's agent card says "On Archie Mobile" at Jett's direction, and since 2026-09-17 so does
  the app mockup in Downloads, which read "Running on Telegram" until then (its setup pane still
  connects Telegram, and that is not a contradiction: the same agent answers in both, as that
  pane says). The phone kit was behind the same way and was brought up to the port on the same
  day: the thinner bezel wall (7 against the kit's old 12, which is why the device is 407 by 866
  around a screen that is still 393 by 852), the chamfer on the outer 2 of that wall, the
  smaller island and lens, and the two rings that traced the silhouette taken off. **Carrying a
  change back to the kit is the direction that keeps the rule true**, because the kit is where
  the next change starts. The last change ran the right way round (2026-09-18): the app dropped
  the agent's face from every message and from the working row (archie-mobile's 510b626: one
  agent in the thread, its face in the bar at twice the size, the tail says who is speaking, and
  both sides on one 86% rule), Jett carried it to the kit, and then the port, the drafts scene
  and `gen-phone-mocks.py` followed, so no chat phone on the site draws a face beside a
  message. **Under
  971px the stage is a second composition of the same objects, not the wide one
  shrunk**: the scene is a design box (760 by 560 wide, 400 by 430 narrow) that `js/home.js` fits to
  the stage every frame **up as well as down** (it was clamped at 1 until 2026-09-17, so a 1440 by
  900 screen drew the scene at 76% of the room it had and the phone's type landed near 11px, which
  is what Jett read as the messages having no contrast; the ceiling is 1.45 and a growing scene
  gives up the 100px spill, which is a concession for a narrow column and not an entitlement), each
  act has a `narrow` pose beside its wide one, **and narrow the fit is height-bound on every phone
  there is**, so three things that look like layout are really the size of the mockups (all three
  changed 2026-09-19, when Jett asked how they could be bigger on a phone). The caption band was
  one cell with eight captions stacked in it, so it was always as tall as the longest of them and
  every act paid for act 3's; it is measured off the caption on screen now and eased like the
  scale, which is worth 130 to 200 pixels of scene. The narrow phone is a shorter slice of a
  device, 566 rather than 686, because height the picture does not need is width and type it never
  gets: the same drawing went from a third of the screen's width to about three quarters, and its
  messages from 5px to 11. And the narrow divisor is the phone's own projected height rather than
  a round number, so those two move together. The scene also sits 19 units lower than its box,
  because `--phone-mask` takes more off the bottom than the top and centering the box put the
  picture too close to the clock and too far from the caption. The floors turn a quarter
  (`--fz`) so the laps run toward the camera, and the caption is a band under the scene. Jett's rule
  from 2026-09-16: the visuals are the focus on a phone too, so a pose keeps its objects inside the
  box and nothing is placed by viewport arithmetic. Narrow, the phone is seen through a window: side
  bezels and rim kept so it reads as a phone, top and bottom ends faded out by a mask on the device
  and each rim layer (the transcript is bottom-aligned, so it only shows fewer bubbles), standing
  nearly full width and readable, Ember stands beside the computer rather than on it, the custody
  stations stand on the turned plane's own center line, row 210 (`--cy`, in coordinates and nothing
  else: sliding the plane's content and sliding the grid back left the grid off to one side), and
  the setup steps are a Cover Flow gallery, the current card flat, nearly the box's width and in
  front, the others to either side, turned toward it, dimmer and behind, because five cards at five
  depths shrank with the perspective until they could not be read and a flat list read as a page
  (Jett, 2026-09-16). The phone has a stacked rim behind its glass (`.dp-edge`), and the message
  ball sits a few pixels back and goes see-through under a station, both from the same review.
  **Act 6 is drawn, not listed, and that is a 2026-09-17 change.** Wide, the five setup steps
  each draw one piece of a single line drawing, and what the five of them finish is the phone,
  the computer and the AI company the rest of the day ran on, so the act ends on the thing it
  ran on; one card at a time captions the piece being drawn, and Ember walks around it. Every
  shape carries `pathLength="1"`, so one number per group between 0 and 1 is the whole animation
  and `js/home.js` measures no path. They stood in a row until then, all five of them there in
  the act's first frame, so a viewport of scroll moved nothing but which border was lit (Jett:
  it "looks boring to scroll through"). Narrow keeps the Cover Flow gallery, and the build is
  not drawn.
  **One screen is a page, not the conversation (2026-09-17).** The 2:00 am screen is the Lately
  section of the app's Now page, which carries no message bar, so `data-page` on a `.dp-scr`
  drops the composer and the screen ends in the jump across to the chat that the app puts there
  instead. Its rows are out of the layout until they land, on the window's own three beats, so
  the card grows through the night rather than standing at its finished height from the first
  frame. Still no tabs. **Before drawing a control, find the page it is on**: a message bar
  under a list you cannot type into is the same class of mistake as the calendar Confirm card.
  **The overnight act has a sky, and the sky moves (2026-09-18).** Light mode's night ground was
  lightened from #14120F to #262320 at Jett's ask ("a bit less dark"), because it was darker than
  the dark theme's own page and read as the power going out rather than as late; the dark theme
  keeps its own near-black, which is the point of `--day-night-ground` being a variable. Above it
  `.day-sky` is a field of 58 stars in two depths, fading in off the same `--night` the room is
  painted with, at the half-way mark where the captions turn to light ink. **It twinkles and it
  drifts, and visual-first rule 2 would otherwise forbid that**: Jett asked for it in those words
  ("move like you're looking at the sky"), so it is the one place on the site where motion carries
  no claim and stays. Three things hold it together and are easy to break: a star's brightness is
  `fill-opacity` on the circle and never `opacity`, because the twinkle animates `opacity` and the
  two have to multiply (a CSS `opacity` would beat the presentation attribute and flatten all 58
  to one star); every animation rule hangs off `.is-night`, so nothing animates through the other
  seven acts; and the whole sky is `display: none` under reduced motion, where the acts stand in a
  stack and the room never darkens. **The screens also light the air around them**, as a halo on
  `.day-win::before` and `.day-phone::before` rather than on the screens: the display surfaces
  carry the dimming filter, a filter dims an element's own `box-shadow` with it, and the phone's
  screen sits inside an opaque bezel where a cast shadow would never be seen. It replaced
  `--shadow-lamp`, which was the same idea on the window alone, in the room's terracotta, flipped
  on by a class at one scroll notch.
- **Archie has two editions, and they are siblings under `archie/`.** `archie/personal/` and
  `archie/business/` are the same app with different ceilings (10 agents and one person per
  agent, against 50 agents and no seat count), so neither is the default and neither is a
  service. Business sat under the Services nav until 2026-09-14, which filed an edition of the
  product next to consulting and left a first-time reader unable to tell who the site was for.
  Both pages now open with the same two-row "Which one is this?" fork pointing at each other:
  same rows, same order, only the "you are here" moves. **Keep them mirrored.** Adding a figure
  to one means adding it to the other or to neither. The old URLs are redirect stubs and stay
  that way: `business/` and `individuals/`.
- **The top bar says what we sell, and that is three things.** Archie is the product,
  Add-ons is the shelf, and Services is our time: $250 an hour for guided setup, consulting,
  or an add-on built to order. Until 2026-09-14 the third one was a bare link to a single
  page, and it looked thin because **a third of it was filed under Add-ons**: "Have an
  Add-on Built" is a service that happens to produce an add-on, and it sat on the shelf
  beside the things you get for free. It is under Services now, and nothing moved on disk.
  **A menu row is read without its menu**, which is why that row is not "Have One Built"
  any more: the pronoun had its antecedent in the Add-ons heading it used to sit under, and
  moving the row to Services left "one" pointing at nothing. A label that only parses in
  the menu it was written for does not survive the menu being reorganised. The slot for
  a fifth menu came from **Compare**, which was seven rows for six pages with one or two body
  inbound links each; it is one row inside **Learn** pointing at the hub that already lists
  them all. Learn is the other half of that change: `blog/` is the second most body-linked
  page on the site and had no place in the top bar at all, only in the footer.
- **A menu can name one page more than once, and the highlight has to cope.** Services lists
  the page and two sections of it, because they are two different things you can buy. Every
  row there resolves to the same pathname, so `js/nav.js` breaks the tie on the hash: the row
  matching the reader's hash wins, and with no hash it is the row that has none. Without that
  the menu lights three rows and says you are in three places, which is what the retired
  "What to Run It On" row did beside "How It Works" and what it reads as: a styling bug
  rather than the address problem it is.
- **A page that exists because another page was split is not a page.** Four merged on
  2026-09-14 and the test each one failed is worth reusing: `guided-setup/` and `consulting/`
  each opened with the same list telling the reader the other one might be theirs; `learn/` was
  four cards pointing at pages the footer already listed; `equipment/` elaborated a requirement
  that `how-it-works/` already carried, using a copy of a figure already on it; `archie/` and
  `archie/personal/` sat next to each other in one menu with no way to tell them apart. **Before
  adding a page, check the count of inbound links from page bodies rather than from the nav**:
  chrome makes every page look equally connected, and all three of the pages with zero real
  inbound links turned out to be merge candidates. The nav is the symptom, the split page is
  the cause, and rearranging the menu without merging just moves the problem. `compare/symphony/`
  followed on 2026-09-18 by the same test: zero body inbound links, and the product it compared
  against was already named 31 times on `compare/cloud-agents/`, which is where it went.
- **Merging is a net cut or it is not a merge.** Every budget raise in `check-copy-length.py`
  that came out of this pass is written as arithmetic: the pages' combined old word count, the
  merged count, and the difference. `services/` is 1,191 where two pages were 1,494;
  `how-it-works/` is 1,745 where two were 2,002. If a merge does not come out smaller than what
  went into it, the restatements have not been cut yet, and they are always there: the same
  claim in both heroes, the rate stated on both pages, two CTAs that said the same thing.
- **The wedge is one person, personal admin, and the homepage leads on it.** Decided by Jett on
  2026-09-15, and it **supersedes the 50/50 fork** of the day before: the page used to offer
  "For one person" and "For a team" as equal choices under the hero CTA, which is not the same
  as having an audience. Leading means the hero's primary route is the one person, the team
  route sits on the muted line under it, and the sections downstairs stay what they already
  were: the post, the bills, the paperwork, the doctor. **Leading is not abandoning.** Archie
  for Business is a real edition with a real price, it keeps its nav row, its card in the
  pricing band and its link in the hero's second line, and no page may imply we do not sell it.
  **Do not "rebalance" the homepage by putting a team add-on in the four cards**: that swap was
  considered on 2026-09-15 and dropped, because `Owed to Customers` sweeps a business's shared
  mail and is off-wedge by definition. The rule this replaces is still worth knowing, because
  the failure it fixed can come back: until 2026-09-14 "business", "team" and "individual"
  appeared in the nav and footer and in no sentence of body copy, and the only in-body signal
  was a price tier 1,400 words down. Saying nothing about the audience is the older and worse
  bug; a wedge is the fix for the fork, not a licence to go quiet again. Anything that
  splits by audience elsewhere (the `.card-aud` chips and the `.aud-pick` review grids on
  `testimonials/`) uses the same two phrases: **"one person"** and **"a team"**. Two registers,
  and they do not mix. *Personal* and *Business* are the **editions' names**, so they are what
  the nav labels, the page titles and the prices say ("For Personal", "Archie for Business").
  *One person* and *a team* describe the **reader**, so they are what anything sorting readers
  says: the hero fork, the chips, the review tabs, the "Which one is this?" rows. Never
  "individuals" as a reader-facing label (it was a URL that read like an audience and pointed at
  a setup service for months), and never "enterprise", which we do not sell.
- The marketplace umbrella noun is **"Add-on"**; Skills, Specialists, Routines, and Personalities
  are its kinds. Never "add an add-on". **But the site says three kinds, not four, and that is
  deliberate:** `js/catalog.js` and `js/marketplace.js` map the `subagents` collection to
  `kind: "specialist"` with `shelf: "skill"`, because a Specialist differs from a Skill in how it is
  built and not in anything a shopper is choosing between. So the marketplace shows three type tabs,
  three tab colours are defined (`--c-blue` is documented in `css/styles.css` as "no longer an add-on
  colour"), and `skills-marketplace/what-is-an-add-on/` explains three. Four is the catalog's
  structure and the count in FACTS.md; three is the taxonomy the reader is shown. Do not "fix" the
  explainer page to four: a redirect stub said four on 2026-08-31 and it was the stub that was wrong.
- **Four words, four levels, and they are not interchangeable. Swept 2026-09-16.** *Otian AI* is
  the company. **Archie** is the desktop app you install. **Your agent** (or agents) is what
  Archie runs, and you name it. **Ember** is the face your agents wear, defined once on
  `archie/personal/` and used nowhere else as a name. Jett asked whether Ember should just be
  called Archie, since Otian plus Archie plus Ember is three names to learn. The answer was no,
  and the reason is the thing to keep: **Archie was already the one doing double duty.** Served
  copy called it a desktop app on three pages, an agent on two, a program on one, and a plan on
  one, and `faq/` said "Archie is one agent" on a product that runs up to ten. Adding the
  character to that pile would have made four, and it would have collided with the one
  distinction the product is sold on, because "ten Archies" is not a sentence anybody can say.
  So: **Archie is never "an agent"**, it is the app that runs one; write "Archie runs an agent
  you own", not "Archie is an agent you own". **Ember is never a speaker or an actor**, it is a
  face; the homepage lockup says "Archie | [face] your agent | on your computer" for that reason,
  where it used to say Ember. The app still names the starter agent Ember (`STARTER_NAME` in
  `src/app/starter.ts`), which is the last place the two jobs overlap and the open question to
  put to Jett before it spreads.
- The thing Archie runs on is a **"computer"**, never a "machine" (swept 2026-08-20; "machine"
  is borderline jargon and broke the one-name-per-concept rule, since "computer" already carried
  the concept everywhere else). Blog posts keep their own voice.
- Guided sessions are **$250/hour**, one hour per session; "$250/session" and "$250/hour" are
  the same claim, not a contradiction.
- **Add-on faces are the Archie app's, copied.** `js/faces.js` carries the app's `GLYPH_PATHS`
  and `FACE` map (a stroked mark per add-on on a field tinted by kind) so the browse grid, pack
  lists, phone-page rows, and detail pages read the way the app's store does. Do not draw new
  marks or reassign one here: change it in the Archie repo's `src/app/faces.ts`, then copy.
  `scripts/check-faces.py` fails when the two drift, and lists live catalog ids the map lacks.
- Every explain-figure carries **paired desktop/mobile SVG variants**, swapped at 640px.
  Diagrams must never scroll horizontally. Enforced, with the rest of the visual-first
  rules above, by `python3 scripts/check-figures.py`: **run it before you commit**,
  alongside `check-facts.py` and `check-copy-length.py`. Its `--report` prints the shape
  and label count of every figure, which is never a failure and is how "one idea, about
  twenty shapes" stays visible.
- **A label is read without the thing around it, so it names its own subject.**
  `python3 scripts/check-pronouns.py` enforces it over every heading, button, menu row,
  card label and CTA on the site. A menu row is read without its menu, a step heading
  without the step before it, an FAQ question with its answer still closed, a comparison
  card without the grid it sits in: land on any of those cold and "it" points at whatever
  the reader was already thinking about. Two of these were found on 2026-09-14 and they
  are the shape to remember. "Have One Built" moved from Add-ons to Services and the
  pronoun lost the heading that had been its antecedent, which is the general case: **a
  label that only parses inside the menu it was written for does not survive the menu
  being reorganised.** And `compare/symphony/` carried "Five things it does that Symphony
  does not" four words above "Five things it does that we do not", the same four words
  for opposite subjects, on a page whose whole job is telling two things apart. The check
  exempts what a reader never meets alone: `<th>` (a column header is answered by its
  row), a heading with a `section-label` naming a noun directly above it, a paragraph
  under its own heading, quoted reader sentences, and `blog/`, which keeps its own voice.
  Everything else in the allow-list carries the reason beside it, and one of them is that
  TRUST.md governs the wording. Run it with `--openers` for the softer pass over
  paragraphs that start on a bare pronoun; those are judgement calls, not failures.
- **Plain words, and never talk down.** (Mirrors the Archie repo's plain-words rule.) Write so a
  first-time, non-technical reader understands, without making them feel stupid. Define a term the
  first time it appears rather than in a glossary, keep **one name per concept** across the whole
  site (an "agent" is not also a "bot" or an "assistant" three sentences later), and never state a
  problem without the next step. Simplicity and ease are the point, but you *show* ease by being
  clear, you don't *assert* it: cut "it's so easy!", "don't worry", "as simple as that", baby-talk
  analogies, and over-explaining the obvious, all of which imply the reader might not keep up. The
  opposite failure counts too: unexplained jargon (API key, keychain, provider) that assumes the
  reader already knows. Respect the reader as capable but new.
- **Example names read as American.** Sam, Dana, Ellen, Todd, Sarah, Emily, Mike. Never Priya,
  Marco, Kenji, Reyes or anything that reads as from somewhere else, in copy, mockups, sample
  data, or the catalog. Jett's rule across every Otian product, 2026-09-11. The catalog copy is
  authored in the Archie repo, so a name there is fixed there and the browse page regenerated.
