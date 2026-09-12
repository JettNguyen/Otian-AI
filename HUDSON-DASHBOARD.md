# HUDSON-DASHBOARD.md: the Hudson page at `/admin/hudson/`

Asked for on 2026-09-11 by Jett: "it is confusing for us at Otian to figure out what Hudson is
doing and what he is capable of." The war room shows what Hudson HAS done. Nothing shows what he
can do, so the answer lives where nobody reads it, and both founders work from a picture of him
that is whatever they last happened to try.

This file settles what the page is, where its content comes from, and the one rule that makes it
worth having.

## The problem it solves, precisely

Hudson's capabilities are written in `AGENTS.md` (twenty-eight routes), `TOOLS.md` and eight
`TOOLS-*.md` companions, all of which live in `~/.openclaw/workspace-business` on Jett's computer.
That is about 80KB of prose, written for an agent, in the imperative, carrying the incident history
behind every rule. It is the correct place for it and it is unreadable as an answer to "can he do
X".

The cost is not hypothetical. Jack stops asking for things that were fixed on Tuesday and asks for
things that were never built. Hudson himself has answered "I can't do that" about capabilities that
shipped weeks earlier, which is why route 22 exists: asking him what changed is currently the only
way to find out.

## The rule that decides everything on the page

**Nothing on this page is written by hand.** The capability list is derived from the routes, the
schedule from the launchd jobs that actually fire, the health of each one from `job-health.py`, the
limits from the instructions that create them, and the changelog from `hudson-log.py`.

This is not a preference about effort. A hand-maintained list of what an agent can do is wrong
within a week, and a wrong list is worse than no list, because it gets believed. A page that can
drift from Hudson would recreate the exact problem it was built to end, one release later.

Three consequences follow, and they are the whole design:

1. **Derived, written, checked.** Which capabilities exist is derived and cannot be wrong. The
   founder-facing wording is written by the model, once per route, cached against the hash of that
   route's text, so a changed route is re-described and an unchanged one costs nothing. Every
   example phrase is checked against the route it came from.
2. **A capability with no wording still ships, flagged.** `described: false` renders as "built, but
   not described here yet". Dropping it would make a route invisible on exactly the day it is
   newest.
3. **Examples are chosen, never written.** The model picks from phrases extracted from the route;
   anything outside that set is discarded before it reaches the page. The first build offered
   "what should I include" as a way to ask for an email draft, which is a sentence route 10
   explicitly forbids Hudson from saying. It is verbatim in the file, so being verbatim is not
   enough: a trigger is the run of quotes that ends at the route's arrow, and nothing else.

## Where the content comes from

`workspace-business/jobs/capabilities.py` builds a manifest and posts it to
`POST /hudson/capabilities` on the billing service, authenticated with the same `HUDSON_TOKEN` as
`/hudson/note`, validated in `stripe-webhook/capabilities.js` (43 tests), stored at
`config/hudson_capabilities`, and read here under the admin gate.

Posted rather than committed, for the reason `hudson.js` already gives about notes: this repo is
public, and the manifest names internal tooling, the exec allowlist and the schedule the business
runs on. `firestore.rules` gives admins read and gives no client write, including an admin one. A
page that could be hand-edited would be a page that drifts.

It replaces the whole document rather than merging, so a route Jett deletes disappears from the
page. It runs daily at 6:50 AM (`ai.otianai.hudson-capabilities`) and can be run by hand any time
with `capabilities.py publish`.

## What it shows

**1. Right now.** How long since Hudson last reported work, how many scheduled jobs are running, how
long since the page was rebuilt. Three facts that only mean something together: work against a
stale page means the lists describe a Hudson that has moved on, and a current page with nothing
running means the lists are right and nothing is acting on them. The page goes amber at 36 hours,
because the only way this page can be wrong is by being old.

**2. Ask him for.** One card per route, grouped by the areas `TOOLS.md` already files its tools
under, with the example phrases and the approval verb where the route ends in a tap. Tap a phrase
to copy it. There is a filter, because the person who half remembers the wording is exactly who
this is for.

**3. Runs itself.** Every launchd job whose script lives in this workspace, worst first. The times
are read from the jobs themselves rather than from anyone's description, which matters: the prose
list in `AGENTS.md` names about fifteen where twenty-nine are loaded, and it had drifted. A job
waiting on a founder's tap is not trouble and is never sorted with the failures, or the page cries
wolf every day.

**4. Will not.** The limits, quoted rather than summarised, so the answer to "why won't he" is
always the line that makes it true.

**5. Changed recently.** The changelog, kept where it can be read days later rather than scrolling
away in Telegram.

## What it is not

- **Not a second war room.** The war room is the day's numbers and the notes Hudson posts. This is
  what he is capable of. The pulse strip reads one timestamp off `hudson_notes` and nothing else.
- **Not a place to act on Hudson.** Nothing on the page writes anything, and the Firestore rules
  enforce that rather than trusting the markup. Talking to him stays in Telegram, where the
  approval taps are.
- **Not a config screen.** A capability is changed by changing Hudson, in the files he boots from.
  The page is a mirror, deliberately, and a mirror with an edit button is just a second source of
  truth.
- **Not for anyone but the two founders.** Same gate as the other three admin tools: Firebase Auth,
  the second factor off the ID token, and `admin` in `access_tiers`.

## House rules this page has to obey

- **No em dashes,** including in the manifest. `scripts/check-facts.py` cannot see text that
  arrives from Firestore at runtime, so the generator enforces it in `copy_trim()` instead, and its
  selftest pins it.
- **Word budget.** The page is at 297 words of typed copy against the default 900. Everything else
  is rendered at runtime and is not typed copy.
- **CSP.** Regenerate with `scripts/gen-csp.py` after any script change.
- **Styles stay on the page,** injected locally like the ops console, so staff-tool CSS never lands
  in the stylesheet every visitor downloads.

## Still to decide

1. Whether the capability cards should show which tools each one runs. The manifest carries
   `commands` already and the page does not render it; it is useful when debugging and noise the
   rest of the time.
2. Whether "Runs itself" should say what a job last actually produced, rather than only that it
   ran. That needs the jobs to report, which is a change to them, not to this page.
