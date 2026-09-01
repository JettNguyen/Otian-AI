# WAR-ROOM.md: the internal dashboard at `/admin/`

Decided on the 2026-09-01 call (Jett and Jack). Jack asked for a "war room": one place that
shows the users, the income, the feedback, the goal, and the links to everything else, so the
day does not start by opening six tabs. Jett named the constraint in the same breath: most of
what a normal startup dashboard shows is user data we say we do not collect and do not want.

This file settles what that page is, what it is allowed to show, and what it is not.

**Pass 1 shipped 2026-09-01** at `/admin/`, called the War Room, carrying Goal, Health, Fleet,
Attention and Doors. Passes 2 and 3 below are still ahead.

## Where it lives

`/admin/` becomes a real page: the index the three existing admin tools already behave like
children of. Same gate as those three, unchanged and not reinvented:

- Firebase Auth, plus the second-factor session check (`twoFactorCleared`, the same function
  `admin/ops/index.html` uses), plus `users/{uid}.access_tiers` containing `admin`.
- The client check fails politely. The real enforcement is the Firestore rules' `isAdmin()`
  and the billing service's admin routes, exactly as today.
- `noindex`, and a fourth entry at the top of the admin group in `js/account-nav.js`.

Jack asked whether a web app is secure. The honest answer for this one: it is as secure as
`/admin/tiers/`, which can already grant a paid tier to any account. The war room is strictly
less dangerous than a page we have shipped and used for months, because it mostly reads.

## The rule that decides every tile

**The war room may show only what `trust/#what-we-hold` already says we hold.** That published
list is the schema. If a tile needs data not on it, the tile does not ship until TRUST.md and
the privacy policy change first, which in practice means it does not ship.

This is the answer to the tension on the call, and it is not a compromise. The reason there is
no "what are users asking their agents" panel is the reason the product is worth paying for. A
dashboard that could show it would mean we had broken the thing we sell.

Two corollaries:

1. **Aggregates here, individuals elsewhere.** The war room counts. Looking up one person stays
   on `/admin/tiers/`, one account at a time, through the search that is already there. Pulling
   up a named customer should stay a deliberate act, not a row you scroll past.
2. **No new collection ships to feed a tile.** If a number cannot be computed from what is
   already written, the panel shows what we do have and says plainly what it is not. The ops
   console already writes in this voice ("an empty list means nobody has updated yet, not
   nobody is running"); keep it.

## What it shows

Seven panels, ordered by how often you would actually look.

**1. Goal.** Jack's number from the call, on the screen, every day.

**A browser cannot count accounts.** `firestore.rules` gives an admin `read` on `heartbeats`,
`error_reports`, `trial_meta` and `config/flags`, but `match /users/{uid}` is
`allow read: if request.auth.uid == uid` with no `isAdmin()` branch, so no page on this site can
read another person's account document or count the collection. That is a correct rule and it is
not being changed to feed a dashboard.

So Pass 1 counts **distinct accounts that ran Archie in the last seven days**, and the bar says
"of 50,000 active users". A heartbeat document is `heartbeats/{uid}` for the personal edition and
`heartbeats/{uid}:business` for the other (`crates/archie-core/src/telemetry.rs`), so stripping
the suffix turns rows into people exactly. Fleet deliberately keeps the rows, because a version
histogram wants copies, not people.

It is a floor, not a headcount, and the caption says so: an account whose copy nobody opens never
reports. Pass 2 puts how many of them pay beside it, off the billing summary. A goal bar that
quietly switches definitions is worse than no bar; one that changes its label out loud is fine.

**2. Money.** Monthly recurring revenue, new subscriptions and cancellations this month, failed
payments worth a nudge, outstanding guided-session invoices, Stripe available balance and the
next payout date. Needs one new read-only endpoint on the billing service (`GET /admin/summary`
on `archie-4f35.onrender.com`), because the site can count accounts in Firestore but cannot see
Stripe. On "bank account balances": Stripe's balance and payout schedule is reachable and real;
the actual bank balance is not, and the panel should say Stripe balance so nobody reads it as
the company's cash.

Add one hand-entered line here: **spent to date, reimbursed to date.** Jett raised the
reimbursement on the call and Jack waved it off. Putting it on the page it is the only honest
place for turns a guilty feeling into a number that goes down. It lives in a `config/warroom`
doc, typed by hand, dated, with no pretence of being an integration.

**3. Health.** Is the billing service up, did its configuration arrive, how many crash reports
since yesterday, today's trial spend against its ceiling. This is a summary of `/admin/ops/`
that goes red when ops is red, and links there. The panel that earns its place: it turns "a
customer told us" into "the page was already red."

**4. Fleet.** Installs alive, version spread, platform mix, from `heartbeats`. Two lines and a
link to the full list on `/admin/ops/`. Carry the undercount caveat with it every time.

**5. Feedback.** Jack's "consistent feedback that we've gotten." Today this is scattered across
Formspree contact submissions, the questionnaire, Telegram, and calls, which is exactly why the
same complaint can arrive four times without anyone noticing it is the same complaint. Version
one is deliberately manual: a `feedback` collection either of us can add to in ten seconds
(who, what they said, date, tag), rendered newest first with a count by tag so a repeat becomes
visible. This is the highest-value panel and the one that needs the least infrastructure. There
is no machine-collected feedback to draw on and we should not invent one.

**6. Follow-ups.** Riggs, Jeff, Pat, Todd all came up on the call as people to get back to, and
they currently live in Jack's head and in Hudson. Same manual pattern as feedback: name, what
is next, when. Hudson pushing into the same collection is the version-two upgrade, not the
starting point.

**7. Doors.** The link rail: Stripe, Firebase console, Render, GitHub, the Google Docs, the
marketplace catalog, the three admin tools, the live site. Unglamorous, and it is the part Jack
described most concretely ("so we're not moving around from Slack, or from Telegram"). It is
also the part that works on day one with no backend at all.

## What it is not

- **Not per-user activity.** No what-they-asked, no which-add-ons-they-installed, no usage
  graph. We hold none of it by design. See the rule above.
- **Not site analytics.** There is no analytics on this site. Adding some to fill a visitors
  tile would be a real decision with a privacy-policy consequence, not a dashboard feature, and
  it is not part of this build.
- **Not a place to act on an account.** Grants, tiers and invoices stay on `/admin/tiers/` and
  `/admin/billing/`, where the actions already are.
- **Not a Telegram client.** A browser page cannot hold one without either a bot token sitting
  in the page or a relay through our backend. A read-only feed of one dedicated ops channel via
  a bot is small and worth doing later; a full messaging surface is a lot of work to reproduce
  something the phone in your hand already does better.
- **Not the agent manager, yet.** Jack's "manage all our agents" is the right long-term shape:
  one row per agent, what it is, last heartbeat, last thing it did. There is one agent today.
  Build the frame when there is a second one, not before.
- **Not a Jarvis skin.** The Jarvis reference is about density and one-glance readability, not
  about neon on black. Reuse the site's own `acct-*`, `ver-row` and `pill` components from the
  ops console so it looks like Otian.

## Build order

Three passes, each one shippable on its own.

- **Pass 1, no backend work. SHIPPED 2026-09-01.** The page, the gate, Doors, and the panels the
  site can already compute: Goal (active accounts), Health, Fleet and Attention. Attention was not in
  the first draft of this file and earned its place during the build: crashes this week, which
  remote levers are in force right now, and what shipped last. A lever left on is the thing you
  forget, and it belongs on the page you open first rather than three clicks into the console
  that sets it.
- **Pass 2, one endpoint.** `GET /admin/summary` on the billing service, which unlocks Money
  and the revenue half of Goal. The spend and reimbursement line goes in here.
- **Pass 3, the human panels.** Feedback and Follow-ups as hand-entered lists, then Hudson
  pushing into the same collection, then the read-only Telegram feed if it still sounds good.

## House rules this page has to obey

- **No em dashes.** `scripts/check-facts.py` walks `/admin/` like every other directory.
- **Money figures.** A literal `$30` typed into the HTML needs a row in FACTS.md first. A number
  rendered at runtime from Stripe or Firestore is not a typed figure and is not checked, which
  is a good reason to prefer computing to typing.
- **Word budget.** Admin pages are budgeted at the default 900 words and are not exempt. The ops
  console sits at 297, so there is room, but the explanatory prose that makes ops good is what
  spends it.
- **CSP.** Every page carries its own policy with inline-script hashes. Regenerate with
  `scripts/gen-csp.py` after any script change, or the page silently does nothing.
- **Styles stay on the page.** Staff-tool CSS is injected locally, per the `js/admin-search.js`
  precedent, so it never lands in the stylesheet every visitor downloads. If `css/styles.css`
  does change, bump `?v=` across every page.

## Still to decide

1. Whether the spend and reimbursement line goes on the page.
2. Whether anyone besides the two of us ever holds the `admin` tier.
3. Two doors are stubbed and visibly unfinished until somebody pastes the address in: the shared
   Drive folder and Hudson. They are `<span class="wr-door is-todo">` in `admin/index.html`, each
   with a TODO comment beside it. A dead link on this page costs more than an obvious gap.

*Settled 2026-09-01: the page is called the War Room, and the Goal bar counts distinct active
accounts until the billing summary lands (revised the same day from copies to accounts, once the
heartbeat document id turned out to make people countable exactly).*
