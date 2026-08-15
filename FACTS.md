# FACTS.md — every number the site is allowed to print

TRUST.md governs what we may *claim*. This file governs what we may *count*.

The site is hand-written HTML with no build step and no templating, so the same price is typed
out in eleven files. That is exactly how a site ends up saying 18 in one place and 200+ in
another. The defence is not a template, it is this list plus `scripts/check-facts.py`, which
fails on any money figure that does not appear below.

**Run it before you commit:** `python3 scripts/check-facts.py`

Adding a figure to a page means adding it here first, with where it comes from. If you cannot
say where a number comes from, it is not a fact and it does not go on the site.

**Last reconciled against the pages:** 2026-08-15

---

## Money

| Figure | What it is | Where it comes from |
|---|---|---|
| `$149` | Archie, billed yearly | Stripe subscription price; TRUST.md 2026-08-04 reconciliation |
| `$19` | Archie, billed monthly | Same. Also appears as the scheduled-reports share of the heavy AI month |
| `$12.42` | What the yearly plan works out to per month | 149 / 12 |
| `$79` | What a year saves against paying monthly | (19 x 12) - 149 |
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
| `$30` | The same month with "Use this for every skill" on | Same. Measured 2026-08-10, not modelled |
| `$20` | A standard AI subscription (Claude Pro) during a guided build | The provider's public price |
| `$15` | Example price badge on a paid add-on | Illustrative, marketplace UI only |
| `$0` | Admin balance placeholder | Not customer-facing copy |

## Counts and durations

| Figure | What it is | Where it comes from |
|---|---|---|
| 140 add-ons | 38 personalities, 59 skills, 4 specialists, 39 routines | Archie repo `data/marketplace/**`, counted 2026-08-15. `scripts/check-facts.py` re-counts this when that repo is checked out beside this one, so the stat rows cannot quietly diverge from the store |
| 4 chat apps | Telegram, Discord, Slack, Matrix | `crates/archie-net/src/{telegram,discord,slack,matrix}.rs`. A fifth adapter (`signal.rs`) exists but is behind the non-default `signal` cargo feature and is NOT in release builds: its dependency (libsignal, via presage) is AGPL-3.0-only, which a closed-source binary cannot ship (`src-tauri/Cargo.toml:41`). Signal does not count and must not appear in site copy until that licence question is resolved |
| 14 days | Money-back guarantee on a plan | Terms of Service |
| 14 days | The own-key trial | `stripe-webhook/index.js`, `/trial/claim` |
| 60 days | How long a signed entitlement lasts before it needs refreshing | `crates/archie-core/src/entitlement.rs`; TRUST.md 2026-08-07 |
| 30 days | Our commitment to publish a final no-sign-in build if we cease operations | Terms of Service |
| 6 hours | How often the version heartbeat goes out, at most | `crates/archie-core/src/telemetry.rs`, `HEARTBEAT_EVERY` |
| 25% | An add-on commissioner's share of future sales | `skills-marketplace/commission/` |
| 5 providers | Anthropic, OpenAI, Google, Groq, xAI | `crates/archie-net/src/llm.rs` |

## The stat rows

`index.html` (add-ons section) and `skills-marketplace/browse/` both print the same three
counts: **140 add-ons, 4 chat apps, 5 AI companies**.

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
