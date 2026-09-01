# FACTS.md — every number the site is allowed to print

TRUST.md governs what we may *claim*. This file governs what we may *count*.

The site is hand-written HTML with no build step and no templating, so the same price is typed
out in eleven files. That is exactly how a site ends up saying 18 in one place and 200+ in
another. The defence is not a template, it is this list plus `scripts/check-facts.py`, which
fails on any money figure that does not appear below.

**Run it before you commit:** `python3 scripts/check-facts.py`

Adding a figure to a page means adding it here first, with where it comes from. If you cannot
say where a number comes from, it is not a fact and it does not go on the site.

**A row is permission, and nothing in the row's note is read.** `allowed_figures()` in
`scripts/check-facts.py` matches any line in this file that opens a table row with a backticked
money figure, anywhere in the file, under any heading. It keeps the figure and throws the rest of
the line away. So a row cannot be used to *record* a price we have decided not to publish, however
firmly the note beside it says so: writing the row licenses that figure on every page the checker
guards, and the sentence explaining that it is not authorised is invisible to the only thing
enforcing this. Figures we are withholding go in prose bullets under **"Figures that are
deliberately unpublished"** at the foot of this file. That is not a stylistic preference. It is the
only shape the checker cannot see.

**Last reconciled against the pages:** 2026-08-31

---

## Money

| Figure | What it is | Where it comes from |
|---|---|---|
| `$30` | Archie, billed monthly. **The headline price**: the month leads on every page and the year follows it as the cheaper option, so a card showing $299 first is out of step | Stripe subscription price. Repriced 2026-08-19 from $19 |
| `$299` | Archie, billed yearly | Same, repriced from $149. The app's copy derives from `src/app/pricing.ts` in the Archie repo, moved in the same pass |
| `$24.92` | What the yearly plan works out to per month | 299 / 12 |
| `$30` | Also roughly what a heavy month costs with "Use this for every skill" on: the measured range is $23 to $39 | Archie repo, `docs/COST-MEASURED.md`. Measured 2026-08-10, not modelled; "$30" is the approved rounding of that range, and a page quoting it as exact must switch to the range. Same number as the monthly plan by coincidence, and a different claim |
| `$61` | What a year saves against paying monthly | (30 x 12) - 299 |
| `$99` | Archie for Business, billed monthly | Stripe subscription price on the Archie for Business product. Priced 2026-08-21: 3x the personal month, held under the $100 anchor. The app's copy derives from `src/app/pricing.ts` under `IS_BUSINESS` |
| `$999` | Archie for Business, billed yearly | Same |
| `$83.25` | What the business yearly plan works out to per month | 999 / 12 |
| `$189` | What a business year saves against paying monthly | (99 x 12) - 999 |
| `$19` | Retired 2026-08-26. It was the scheduled-reports share of the heavy AI month under the pre-repricing model, and before that the monthly plan price until 2026-08-19. Kept listed so an old page quoting it does not read as a new claim, but nothing may print it |
| `$250` | One session, one hour, for **both** guided setup and consulting | Set by us, repriced 2026-08-19 from $100. "$250/session" and "$250/hour" are the same claim, not a contradiction. Widened 2026-08-31 when consulting shipped as a second service on the same rate, on Jett's rate-consistency direction: an hour of our time is one price whatever it is spent on, and both service pages say so in the same words, because a reader who finds two rates for two services reasonably assumes the dearer one is the upsell. **Sourced to us, not to the Terms.** `terms-of-service/index.html:230` says "Guided sessions after that are billed at the rate quoted to you at the time (currently $250 per session)", which is scoped to guided sessions and permits a *different* rate by written agreement; it does not authorise applying $250 to a second service, so it may not be cited as the source for the consulting half. **Closed 2026-08-31:** the Fees & Payment clause had no wording for a scoped, phased engagement, nor for the overrun commitment the consulting page makes. Both are now in the clause at `terms-of-service/index.html:230`, the trigger quoted in the same words the page uses, so the rate is still sourced to us and the *engagement shape* is now sourced to the Terms. Also closed the same day: the Terms listed "Ongoing support after your agent is set up" as included and unbounded while `consulting/index.html:277` priced later work separately, so the two documents contradicted each other on what a customer had bought. The clause now separates answering questions about what we set up (free, no time limit) from new work (scoped and priced first) |
| `$500` | The Fix-It Authority: what either founder, or anyone we hire, can spend per customer to put a problem right with no approval and no justification afterwards | The Otian Standard, our operating principles v4.0, Principle 11, published in full on `standard/` 2026-08-31. Set by us, and the only figure here that is a policy rather than a price: the page says we publish the number because an authority nobody knows about cannot be invoked, which is exactly why it may not quietly change. Listed 2026-08-31, when check-facts caught it on a page that had gone up without it |
| `$1` | Light use at Economy, per month, the floor | Archie repo, `docs/COST-MEASURED.md` section 9.4, repriced 2026-08-26. These six rows replaced the single points `$4.40`, `$32` and `$137`, which were point values on a dataset that carries a range and did not say which quality setting they were |
| `$2` | Light use at Economy, per month, the ceiling | Same |
| `$5` | Light use at Balanced, per month, the floor. Also the scheduled-reports half of the retired moderate month | Same |
| `$7` | Light use at Balanced, per month, the ceiling | Same |
| `$41` | Moderate use at Economy, per month, the floor | Same. Roughly double the retired `$32`, and not because anything got dearer: that row counted no mail watch and assumed a schedule firing a third as often as a real one does |
| `$63` | Moderate use, per month, the ceiling at both Economy and Balanced | Same |
| `$44` | Moderate use at Balanced, per month, the floor | Same |
| `$112` | Heavy use at Economy, per month, the floor | Same. `$112 to $184` was listed as a Balanced figure before 2026-08-26; the repricing moved it to Economy and Balanced went up |
| `$184` | Heavy use at Economy, per month, the ceiling | Same |
| `$130` | Heavy use at Balanced, per month, the floor | Same |
| `$204` | Heavy use at Balanced, per month, the ceiling | Same |
| `$0.69` | The inbox watch alone at Economy, 30 emails a day reaching the model, per month, the floor | Archie repo, `docs/COST-MEASURED.md` section 9.5. Measured input from a 13-shape corpus on a live key 2026-08-26; the range is the length of the answer, which is still assumed |
| `$1.10` | The same, ceiling | Same |
| `$2.08` | The inbox watch at Balanced, 30 a day, floor | Same |
| `$3.29` | The same, ceiling | Same |
| `$5.59` | The inbox watch at Balanced with draft replies on, 30 a day, floor | Same. Draft replies roughly triple this lane, because writing a reply is output and output bills at 5x reading |
| `$9.64` | The same, ceiling | Same |
| `$1.85` | The inbox watch at Economy, 80 a day, floor | Same |
| `$2.93` | The same, ceiling | Same |
| `$5.54` | The inbox watch at Balanced, 80 a day, floor | Same |
| `$8.78` | The same, ceiling | Same |
| `$14.90` | The inbox watch at Balanced with draft replies on, 80 a day, floor | Same |
| `$25.70` | The same, ceiling | Same |
| `$4.62` | The inbox watch at Economy, 200 a day, floor | Same |
| `$7.32` | The same, ceiling | Same |
| `$13.86` | The inbox watch at Balanced, 200 a day, floor | Same |
| `$21.96` | The same, ceiling | Same |
| `$37.26` | The inbox watch at Balanced with draft replies on, 200 a day, floor | Same |
| `$64.26` | The same, ceiling | Same |
| `$20` | A standard AI subscription (Claude Pro) during a guided build | The provider's public price |
| `$15` | The price Meeting Notes once carried. Printed nowhere. On 2026-08-21 it was listed Free everywhere for now; on 2026-09-01 the decision was made permanent: **every add-on is included with Archie**, for everyone, and nothing in the catalog is sold on its own. The site's price filter, price badges and the submission form's price question were retired the same day | Its marketplace manifest in the Archie repo, `price_cents: 0` like all 151. The field stays only because removing it is a data migration. Pages say "included", never "free to start" or "premium" |
| `$0` | Admin balance placeholder | Not customer-facing copy |

## Other companies' prices

These drift without telling us, so each row carries the date it was last read off the
company's own public pricing page. **Checked dates older than 90 days fail
`scripts/check-facts.py`**: a comparison page quoting last year's price is a false statement
about a third party, which is the one kind of error TRUST.md treats as worse than a mistake
about ourselves. Re-read the source, update the date, or take the figure off the page.

Currencies are printed as the company prints them. A converted figure is not a fact.

| Figure | What it is | Source | Checked |
|---|---|---|---|
| `$20` | Claude Pro, billed monthly | `https://claude.com/pricing`, "$20" on the Pro card | Checked: 2026-08-19 |
| `$17` | Claude Pro, billed annually | Same page, "$17" per month with the annual subscription | Checked: 2026-08-19 |
| `$100` | Claude Max, the entry tier | Same page, "From $100" | Checked: 2026-08-19 |
| `$20` | ChatGPT Plus, billed monthly | `https://chatgpt.com/pricing`, "$20 / month" on the Plus card. Read in a browser, not fetched: see the note below | Checked: 2026-08-19 |
| `$8` | ChatGPT Go, billed monthly | Same page, "$8 / month". Same caveat | Checked: 2026-08-19 |
| `$100` | ChatGPT Pro, the entry tier | Same page, "From $100 / month". Same caveat | Checked: 2026-08-19 |
| `$300` | SuperGrok Heavy, billed monthly. The xAI plan that carries Grok Bot | Grok Bot plan cards, "$300 / month". Read in a browser: `x.ai` refuses fetches. See the note below | Checked: 2026-08-20 |
| `$200` | Cursor Ultra, billed monthly. The Cursor plan that carries Grok Bot | Same cards, "$200 / month". Same caveat | Checked: 2026-08-20 |
| `$120` | Cursor Teams Premium, per seat, billed monthly. Also carries Grok Bot; printed only in the sources fold | Same cards, "$120 / seat / month". Same caveat | Checked: 2026-08-20 |
| `$29.99` | Zapier Professional, billed monthly, at 750 tasks | `https://zapier.com/pricing` | Checked: 2026-08-19 |
| `$19.99` | Zapier Professional, billed annually, at 750 tasks | Same page | Checked: 2026-08-19 |
| `$12` | Make Core, at 10,000 credits a month | `https://www.make.com/en/pricing`, "$12/mo" | Checked: 2026-08-19 |
| `$21` | Make Pro, at 10,000 credits a month | Same page, "$21/mo" | Checked: 2026-08-19 |
| `$16` | Symphony by Wix, Basic, billed monthly | `https://www.wix.com/symphony/pricing` | Checked: 2026-08-24 |
| `$12.80` | Symphony Basic, billed annually | Same page | Checked: 2026-08-24 |
| `$40` | Symphony Pro, billed monthly | Same page | Checked: 2026-08-24 |
| `$32` | Symphony Pro, billed annually | Same page | Checked: 2026-08-24 |
| `$80` | Symphony Max, billed monthly | Same page | Checked: 2026-08-24 |
| `$64` | Symphony Max, billed annually | Same page | Checked: 2026-08-24 |
| `20€` | n8n Starter, billed annually. Printed in euros because n8n prices in euros | `https://n8n.io/pricing/`, "20€/mo, billed annually" | Checked: 2026-08-19 |
| `50€` | n8n Pro, billed annually | Same page, "50€/mo, billed annually" | Checked: 2026-08-19 |

**On the ChatGPT rows.** `openai.com` and `chatgpt.com` return 403 to every automated request,
so those three figures were read off the pricing page in a browser by a person and transcribed,
on 2026-08-19. That is a weaker check than the rest of this table: no script of ours can
re-confirm it, and the 90-day staleness check will come due against a page we cannot fetch. It
is still the company's own page rather than a search result or an aggregator, and any reader
can open the same URL and see the same cards. When the date comes due, someone opens the page
again. A fetch that fails must not quietly become a figure that rots.

**On the Grok Bot rows.** Same story as ChatGPT above: the plan cards were read in a browser
and transcribed on 2026-08-20, because `x.ai` returns 403 to any fetch. Claude Cowork needs
no figure of its own: it is included on the Claude plans already
priced above ("Includes Claude Cowork" on the Pro card).

**Gemini Spark is deliberately not on the site.** It was in the cloud-agents comparison for a
day and came out on 2026-08-20: unpriceable at source (Google renders plan prices per region,
so a fetch reads "/mo" with no number) and available only to AI Ultra in select countries, so
the comparison is Cowork and Grok Bot. If Spark returns, its claims need fresh TRUST.md rows.

**Deliberately not published.** Any wage figure for a personal or executive assistant. It was
wanted for the comparison page and could not be read at its source: `bls.gov` refuses automated
requests, and a salary copied out of a search result or an aggregator is not verification. That
page therefore argues the comparison on what the work looks like rather than on a number. Add
the figure here only after reading it on the source page, with the date.

## Counts and durations

| Figure | What it is | Where it comes from |
|---|---|---|
| 151 add-ons | 38 personalities, 66 skills, 4 specialists, 43 routines | Archie repo `data/marketplace/**`, recounted 2026-08-31. The count has now moved twice in three days and neither move was a copy decision: `routines/evening-journal.json` was retired on 2026-08-28 (Evening Reflection had taken over its job, and a live agent was firing both of them half an hour apart), taking it 151 to 150, and `routines/statement-round.json` landed on 2026-08-30, taking it back to 151 with nothing on either page moving. **The down move is why the check exists and the up move is why it has to run on every commit**: a deletion nobody thinks of as a stat change sat wrong for a day, and an addition did the same thing two days later in the opposite direction. `scripts/check-facts.py` re-counts this when the Archie repo is checked out beside this one |
| 5 chat apps | Telegram, Discord, Slack, Matrix, and (on a Mac) iMessage | `crates/archie-net/src/{telegram,discord,slack,matrix,imessage}.rs`. iMessage ships 2026-08-17: basic mode via the `imsg` CLI, macOS only, agent answers in the owner's message-yourself thread. A sixth adapter (`signal.rs`) exists but is behind the non-default `signal` cargo feature and is NOT in release builds: its dependency (libsignal, via presage) is AGPL-3.0-only, which a closed-source binary cannot ship (`src-tauri/Cargo.toml:41`). Signal does not count and must not appear in site copy until that licence question is resolved |
| 300M Wix businesses | Symphony's own claim about what its intelligence is drawn from, quoted only to answer it | `https://www.wix.com/symphony`: "the intelligence of 300M Wix businesses across every industry and geo, and turns it into a team of agents built just for you". Read 2026-08-24. **Print it as their claim, never as our own figure**, and never as an independently verified count of businesses |
| 1 agent | What the free trial runs | Archie repo, `crates/archie-core/src/plan.rs`, `FREE_AGENTS`. Enforced in `agent_create` before the row is written |
| 10 agents | What the personal plan runs | Archie repo, `PLAN_AGENTS` in `crates/archie-core/src/plan.rs`. Staff accounts are the only unlimited ones, so **no page may say "unlimited"** about agent counts |
| 50 agents | What the business plan runs | Same file, `BUSINESS_PLAN_AGENTS`: the business licence `plan_business` gets its own allowance in `agent_allowance` (2026-08-21), sized so a company can run one per department. Same no-"unlimited" rule |
| 2 separate plans | Archie and Archie for Business are not a bundle | Archie repo, `docs/BUSINESS-PRICING.md`, "What a purchase grants": a personal purchase writes the `plan` licence (`subscriber` tier), a business purchase writes `plan_business` (`business` tier), from prices sitting on two different Stripe products. Neither grants the other. **What must not be said either way:** whether a licence *runs* the other edition is a separate question the same doc answers "any valid license runs either edition" for the beta only, and the business build's gate is expected to tighten. So the site talks about what a plan buys, never about which app a licence opens |
| 1 person per agent | How many people one agent answers, in the personal edition | Same file, `PEOPLE_PER_AGENT` and `may_add_person`. Enforced in `access_approve` and `access_invite` before the roster is written. Gated on the **edition** (`IS_BUSINESS`), not the licence, so no personal plan can buy a second person. **Archie for Business has no ceiling**: `PEOPLE_PER_AGENT` is `None` in that build. Say "no seat count", never "unlimited seats", which invites the agent-count confusion the row above forbids. **And never "one agent your whole team messages"**: that was on six pages until 2026-08-21 and it describes the edition as being a single agent, when the edition runs up to 50 and lifts the ceiling on *each* of them. The difference between the editions is who an agent answers, not how many you get |
| $99 / $999 | Archie for Business, a month / a year | Archie repo, `src/app/pricing.ts` under `IS_BUSINESS`, and `docs/BUSINESS-PRICING.md` for where the numbers come from (3x the personal plan, rounded up to the anchor under $100; decided 2026-08-21). Grants the `business` tier / `plan_business` licence, written by the webhook off which Stripe product the price sits on (the Archie for Business product, id held in Render's `BUSINESS_PRODUCT_ID`). Not on sale until the runbook's steps finish |
| 30 minutes | The free discovery call, for guided setup and for the Business Roadmap alike | Set by us. Printed on the site before this row existed; listed 2026-08-21. **Discrepancy closed 2026-08-27:** the embedded Google Calendar schedule had been booking 60-minute slots against copy saying 30 in nine files, and a real lead booked an hour before anybody noticed. Jett set the schedule to 30 minutes, so the calendar now matches the copy and the nine files stand. The schedule is configured in Google Calendar, not in this repo, so nothing here can check it: if the duration changes again, this row and those nine files are what has to move with it |
| 3 things to start | A computer you can leave on, an account with an AI company, an Otian account with a plan | The requirement cards on `how-it-works/#what-you-need`, each traced there. A chat app is a **fourth, optional** item: it stopped being a requirement 2026-08-06 when Archie gained a conversation of its own, so an agent runs with none connected. It carries a `+` instead of a number for that reason. **The count is printed in three places** (the homepage "shopping list" band, that section's lede, and `learn/`), so a requirement shipping or dropping moves all three. Recorded 2026-08-22 after the homepage band was found listing two of the three and calling it the whole list |
| 14 days | Money-back guarantee on a plan | Terms of Service |
| 14 days | How long a free trial runs, and it is both kinds | Archie repo, `stripe-webhook/credits.js:284`, `TRIAL_DAYS`: "how long a trial runs, whatever is left of the credits", mirrored in `archie-core::credits` and `firestore.rules`. **Recorded as the own-key trial only until 2026-08-30**, which read as though the credit trial had no clock; it has the same one, and ends at whichever comes first, the credits or the days. The own-key trial is granted by `/trial/claim` in `stripe-webhook/index.js` |
| 60 days | How long a signed entitlement lasts before it needs refreshing | `crates/archie-core/src/entitlement.rs`; TRUST.md 2026-08-07 |
| 30 days | Our commitment to publish a final build requiring no license check if we cease operations | Terms of Service, quoted in its own words since 2026-08-21 ("no license check", not "no sign-in": the contract's wording is the claim) |
| 6 hours | How often the version heartbeat goes out, at most | `crates/archie-core/src/telemetry.rs`, `HEARTBEAT_EVERY` |
| 20% | The margin ceiling: the most we mark up anything we resell or pass through | The Otian Standard v4.0, Principle 2, published on `standard/` 2026-08-31. **Deliberately unpublished until that date**: the v3.0 page said only that a ceiling existed and was written down internally, which made it a promise nobody outside could check. The document commits any change to being a dated, visible revision, so this row moves only when that one does |
| 0% | What we add to third-party AI usage, which the customer pays their provider directly at cost | Same document, same principle, and it is already a term of the Terms of Service, which say the provider's cost "is not a fee we charge, collect, resell, or mark up". The two must not drift |
| 60% | Earned growth: the share of new business we intend to come from referral or repeat custom | The Otian Standard v4.0, Measurement section. **A target we set ourselves, not a measured result**, and the page prints it as a target in those words. It must never appear as an achieved figure, and there is no measured share of referral business on the site |
| 25% | An add-on commissioner's share of future sales | `skills-marketplace/commission/` |
| 7 providers | Anthropic, OpenAI, Google, Groq, xAI, DeepSeek, Mistral | `crates/archie-net/src/providers.rs`, counted 2026-08-15 after DeepSeek and Mistral landed (Archie 9ceb303). Google's entry is shown as Gemini and Anthropic's as Claude on the site, the products' own names; the count stays a count of companies. An eighth option, "Another provider", is any OpenAI-format endpoint the user names; it is a door rather than a company and is not counted |
| 40 apps and services | The works-with band: 5 chat apps + 28 accounts and devices + 7 AI companies | `index.html` band; every name verified in the Archie source (connectors in `crates/archie-domain/src/connectors.rs`), marks taken from the app's `BRAND_MARK` table in `src/app/connect.tsx`, which names the site as its reference copy. Recounted 2026-08-26 when GoHighLevel (`crates/archie-net/src/ghl.rs`) and lemlist (`connectors.rs:877`) joined the band. NOTE: 13 of the 28 connectors (Stripe, YNAB, Lunch Money, Mercury, Splitwise, Raindrop, Readwise, Calendly, Zotero, Mastodon, AfterShip, GitLab, Cloudflare) shipped from provider documentation and have not yet been exercised with a live key; Archie's docs/OPEN-THREADS.md tracks this. They are in the app's picker today, which is what the band claims |
| 10 minutes | How long the self-check on /trust/ takes with a network monitor | The walkthrough on `trust/index.html` itself; the figure is the length of that procedure, not a benchmark |
| 5x | What a thought-through ("working") token bills against a read token | The providers' published output-to-input price ratio, used on `archie/pricing/` |
| A few hundred words | Roughly how much working a default reply carries (measured 123 to 641 output tokens a turn) | Archie repo, `docs/COST-MEASURED.md`, same measurement as the Balanced/Economy rows. Was "100 words" until 2026-08-21, which matched only the bottom of the measured range |

## The stat rows

`index.html` (its own numbers band under the hero since the 2026-08-18 quiet-spine rebuild) prints
four counts: **151 verified add-ons, 40 apps and services, 7 AI companies, 5 chat apps**.
`skills-marketplace/browse/` prints three of the same: **151 verified add-ons, 5 chat apps,
7 AI companies**. "Verified" is backed by the marketplace review gate (the for-developers
page: "we check that it works as described and is safe to run before it goes live"). The
connections band's note also counts **all 40** names the band shows.

The **Personal / Small business** plan card on `archie/pricing/` prints two of the same counts in
prose ("all 5 chat apps", "any of 7 AI companies"), so a channel or a provider shipping now moves
three pages, not two. Added 2026-08-18 with the plans grid.

**No "+" on any of them, deliberately.** A "+" turns a count into a claim that there is more
than stated, and soft rounding is how a site ends up saying 18 curated skills in a stat bar and
200+ two pages later. All three are exact. Two of them (the fives) are fixed by code and only
change when a channel or a provider ships. The add-on count moves, which is why the check
re-counts it rather than trusting this file.

## Figures that are deliberately unpublished

- **The size of the free-credit grant.** It is $2 of Anthropic usage (`TRIAL_GRANT_MICROS` in
  the Archie repo's `stripe-webhook/index.js`), and the app itself refuses to say so: the trial
  strip counts answers left rather than dollars left, because nobody knows what a dollar of an AI
  model buys, so the figure supports no decision the reader is trying to make (`src/app/update-banners.tsx`,
  "Why not dollars"). The site says the credits run out, and says when: the 14 days above, or the
  credits, whichever is first. Publishing $2 here would put a number on the site that the product
  deliberately does not put on screen.
- **The free-credit caps.** Per account, per computer, per day. The app's refusal says "claimed
  here" rather than which limit was hit, so a person probing is not told which knob to turn.
  The site says the credits are limited and can be refused, and names no numbers. TRUST.md,
  "Do not name the numbers."
- **Time to a first working agent.** BetterClaw says 60 seconds on one page and 2 minutes on
  three others, which is the drift we are trying not to inherit. Archie is a desktop install:
  a download, an install, an OS permission prompt, and an AI account. Nobody has timed it on a
  clean machine, so no number goes anywhere until somebody has. An honest five minutes beats a
  60 seconds we visibly miss on first run.
- **Users, installs, hours saved.** We have no published figure for any of these and no
  testimonial behind them. `/testimonials/` says we are still collecting reviews; a stat that
  contradicts that page is worse than no stat. **Two of these were live until 2026-08-30**,
  on `/testimonials/` itself: "morning inbox processing dropped from 90 minutes to around 25
  minutes" and "missed follow-ups fell substantially". Both came from client work before Archie
  and neither had a record anybody could point at, which made them the only numbers on the site
  that could not be traced, on the page whose entire job is being checkable. They are gone. The
  cards now lead on the job the agent takes off you, written from each add-on's own catalog entry
  in the Archie repo (`data/marketplace/skills/`), which is a claim we can defend line by line.
  If a real measured outcome ever exists, it belongs here first, with the engagement and the date.
- **Every hardware price, on `/equipment/` and anywhere else.** Added 2026-08-26 with that page.
  A hardware price is a third-party figure under the rules above, so it would need a row in
  "Other companies' prices" with the maker's own store as its source and a 90-day re-read. It
  would also be the worst kind of row to carry: the reader is about to *spend* against it, the
  price varies by country and by configuration in a way one number cannot hold, and it goes stale
  without telling us. So the equipment page names machines and says what to look for, and the
  reader reads the price at the maker's own store, one click away. `js/equipment.js` says the same
  thing at the top of the file, because that is where somebody would be tempted to add one.
  **Budget on that page is a shape, not a number:** "spend nothing", "as little as will do the
  job", "buy once". If a price is ever published there, it needs a sourced row here first, and
  a person to re-read it every 90 days for as long as it is up.
- **A minimum processor, memory, or disk for running Archie.** There is no published floor in the
  Archie repo to cite, and the honest reason is that the demanding part does not happen on the
  user's computer: the model runs at the AI provider. Inventing a "16GB recommended" would be a
  number a reader shops against, which is worse than the vaguer truth. The equipment page states
  the two requirements that *are* sourced (`archie/install/`: macOS 12 Monterey or later; Windows
  10 or 11, 64-bit) and otherwise says what the machine has to *do*, which is stay on. If a floor
  is ever measured, it goes here with the measurement.
- **The Business Roadmap session price.** The roadmap (added 2026-08-21: a consult for
  businesses that don't know where to start; free 30-minute discovery call, then the
  recommendations arrive in a paid working session) has no published price. The site says
  "paid" and that the cost is quoted on the free call, and names no number. The $250 guided
  session rate is a different service and **must not be reused for the roadmap**: the two are
  priced independently, and a page implying the roadmap session costs $250 is inventing a
  figure. Publish a number here first if one is ever set.
