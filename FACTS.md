# FACTS.md — every number the site is allowed to print

TRUST.md governs what we may *claim*. This file governs what we may *count*.

The site is hand-written HTML with no build step and no templating, so the same price is typed
out in eleven files. That is exactly how a site ends up saying 18 in one place and 200+ in
another. The defence is not a template, it is this list plus `scripts/check-facts.py`, which
fails on any money figure that does not appear below.

**Run it before you commit:** `python3 scripts/check-facts.py`

Adding a figure to a page means adding it here first, with where it comes from. If you cannot
say where a number comes from, it is not a fact and it does not go on the site.

**Last reconciled against the pages:** 2026-08-19

---

## Money

| Figure | What it is | Where it comes from |
|---|---|---|
| `$299` | Archie, billed yearly | Stripe subscription price. Repriced 2026-08-19 from $149; the app's own copy derives from `src/app/pricing.ts` in the Archie repo, which was moved in the same pass |
| `$30` | Archie, billed monthly | Same. Also the measured cost of a heavy month with "Use this for every skill" on, which is a different claim that happens to land on the same number |
| `$24.92` | What the yearly plan works out to per month | 299 / 12 |
| `$61` | What a year saves against paying monthly | (30 x 12) - 299 |
| `$19` | The scheduled-reports share of the heavy AI month | Archie repo, `docs/cost-of-running-an-agent.md`. No longer a plan price: it was the monthly plan until 2026-08-19 |
| `$100` | One guided session, one hour | Set by us. "$100/session" and "$100/hour" are the same claim |
| `$4.40` | Light use: what the AI costs to run for a month | Archie repo, `docs/cost-of-running-an-agent.md` |
| `$3.60` | The messages half of the light month | Same |
| `$32` | Moderate use, per month | Same |
| `$27` | The messages half of the moderate month | Same |
| `$5` | The scheduled-reports half of the moderate month | Same |
| `$137` | Heavy use, per month | Same |
| `$118` | The messages half of the heavy month | Same |
| `$165` | Heavy use on a busier schedule (320 runs) | Same |
| `$140` | A heavy month on Balanced, before the quality checkbox | Archie repo, `docs/COST-MEASURED.md` |
| `$20` | A standard AI subscription (Claude Pro) during a guided build | The provider's public price |
| `$15` | Example price badge on a paid add-on | Illustrative, marketplace UI only |
| `$0` | Admin balance placeholder | Not customer-facing copy |

## Counts and durations

| Figure | What it is | Where it comes from |
|---|---|---|
| 142 add-ons | 38 personalities, 60 skills, 4 specialists, 40 routines | Archie repo `data/marketplace/**`, counted 2026-08-16. `scripts/check-facts.py` re-counts this when that repo is checked out beside this one, so the stat rows cannot quietly diverge from the store |
| 5 chat apps | Telegram, Discord, Slack, Matrix, and (on a Mac) iMessage | `crates/archie-net/src/{telegram,discord,slack,matrix,imessage}.rs`. iMessage ships 2026-08-17: basic mode via the `imsg` CLI, macOS only, agent answers in the owner's message-yourself thread. A sixth adapter (`signal.rs`) exists but is behind the non-default `signal` cargo feature and is NOT in release builds: its dependency (libsignal, via presage) is AGPL-3.0-only, which a closed-source binary cannot ship (`src-tauri/Cargo.toml:41`). Signal does not count and must not appear in site copy until that licence question is resolved |
| 14 days | Money-back guarantee on a plan | Terms of Service |
| 14 days | The own-key trial | `stripe-webhook/index.js`, `/trial/claim` |
| 60 days | How long a signed entitlement lasts before it needs refreshing | `crates/archie-core/src/entitlement.rs`; TRUST.md 2026-08-07 |
| 30 days | Our commitment to publish a final no-sign-in build if we cease operations | Terms of Service |
| 6 hours | How often the version heartbeat goes out, at most | `crates/archie-core/src/telemetry.rs`, `HEARTBEAT_EVERY` |
| 25% | An add-on commissioner's share of future sales | `skills-marketplace/commission/` |
| 7 providers | Anthropic, OpenAI, Google, Groq, xAI, DeepSeek, Mistral | `crates/archie-net/src/providers.rs`, counted 2026-08-15 after DeepSeek and Mistral landed (Archie 9ceb303). Google's entry is shown as Gemini and Anthropic's as Claude on the site, the products' own names; the count stays a count of companies. An eighth option, "Another provider", is any OpenAI-format endpoint the user names; it is a door rather than a company and is not counted |
| 38 apps and services | The works-with band: 5 chat apps + 26 accounts and devices + 7 AI companies | `index.html` band; every name verified in the Archie source 2026-08-15 (connectors in `crates/archie-domain/src/connectors.rs`), marks taken from the app's `BRAND_MARK` table in `src/app/connect.tsx`, which names the site as its reference copy. NOTE: 13 of the 26 connectors (Stripe, YNAB, Lunch Money, Mercury, Splitwise, Raindrop, Readwise, Calendly, Zotero, Mastodon, AfterShip, GitLab, Cloudflare) shipped from provider documentation and have not yet been exercised with a live key; Archie's docs/OPEN-THREADS.md tracks this. They are in the app's picker today, which is what the band claims |
| 10 minutes | How long the self-check on /trust/ takes with a network monitor | The walkthrough on `trust/index.html` itself; the figure is the length of that procedure, not a benchmark |
| 5x | What a thought-through ("working") token bills against a read token | The providers' published output-to-input price ratio, used on `archie/pricing/` |
| 100 words | Roughly how much working a default reply carries | Archie repo, `docs/COST-MEASURED.md`, same measurement as the $140/$30 rows |

## The stat rows

`index.html` (its own numbers band under the hero since the 2026-08-18 quiet-spine rebuild) prints
four counts: **142 verified add-ons, 38 apps and services, 7 AI companies, 5 chat apps**.
`skills-marketplace/browse/` prints three of the same: **142 verified add-ons, 5 chat apps,
7 AI companies**. "Verified" is backed by the marketplace review gate (the for-developers
page: "we check that it works as described and is safe to run before it goes live"). The
connections band's note also counts **all 38** names the band shows.

The **Personal** plan card on `archie/pricing/` prints two of the same counts in prose ("all 5
chat apps", "any of 7 AI companies"), so a channel or a provider shipping now moves three pages,
not two. Added 2026-08-18 with the plans grid.

**No "+" on any of them, deliberately.** A "+" turns a count into a claim that there is more
than stated, and soft rounding is how a site ends up saying 18 curated skills in a stat bar and
200+ two pages later. All three are exact. Two of them (the fives) are fixed by code and only
change when a channel or a provider ships. The add-on count moves, which is why the check
re-counts it rather than trusting this file.

## Figures that are deliberately unpublished

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
  contradicts that page is worse than no stat.
