# TRUST.md — What Otian AI Is Allowed To Claim

Trust is the product. This file is the contract that keeps it true.

Every privacy or safety claim on otianai.com must appear below, in approved wording,
with a pointer to the code that makes it true. If a claim isn't here, it doesn't ship.

**Owner: Jett.** Jett owns technical processes; Jack owns business ops and marketing.

That split is the point. The person who knows what the code actually does holds a **veto** over
the person who writes the copy — not a seat at the table, a veto. If Jett says a sentence isn't
true, it doesn't ship, and there is no appeal to how good it sounds.

**Last verified against the Archie source:** 2026-08-21 (full-file fact-check, `Archie@main`)

**Reconciliation — 2026-08-21.** Every claim in this file and on the site was checked against the
code in one pass: 473 claims, of which 298 held exactly. What follows is what the rest required.
The themes, each fixed in place below and on the affected pages:

1. **Pricing.** $30 a month or $299 a year since 2026-08-19; Archie for Business $99 a month or
   $999 a year since 2026-08-21. Both still Stripe subscriptions granting the `subscriber` tier.
   The 08-04 reconciliation below records the change to plans and keeps its old figures as
   history.
2. **Text Replies shipped (2026-08-21)** and got its own canonical section below. Every absolute
   of the form "the agent can only ever message you" is now scoped: unprompted, it still messages
   only you; a reply to somebody else exists only as a draft that goes nowhere until you press
   Send on it, and then goes out from your own number as you.
3. **The provider roster is seven named companies plus one you name yourself:** Anthropic, OpenAI,
   Google, Groq, xAI, DeepSeek, Mistral, and "Another provider" (any OpenAI-format endpoint the
   user supplies). Every "five providers" sentence in this file and on the site was stale. The
   enum is `crates/archie-net/src/providers.rs`; requests are built in `crates/archie-net/src/llm/`.
4. **What We Hold grew again**, the third time the pattern at the end of that section has fired.
   The honest maximum a legal demand could produce is listed there now: account, plan,
   version heartbeats, opt-in crash tails, the trial-credit ledger and its spend history,
   second-factor records, guided-session invoices, refused-checkout records, and sealed phone
   messages we cannot open plus their plaintext timestamps.
5. **The heartbeat has four fields now** (app version, platform, edition, last seen), one document
   per account per edition, and crash reports carry edition too. **The off switch lives on the
   Settings page ("This computer"), not under Account**; the approved wording said Account and
   was wrong about our own app.
6. **The free credits are capped at two grants per computer** (chosen so a factory reset does not
   strand the machine), so "a second account cannot have them" promised more than the code
   refuses. And a key added from Settings stops the proxy **at each agent's next start**, not the
   moment it is pasted; the setup flow restarts the agent for you, Settings does not.
7. **The Terms promise a final version with no license check**, not "no sign-in". This file now
   quotes the Terms' own words everywhere the commitment appears, because a paraphrase of a
   contract is how a contract drifts.
8. **The 08-13 quality sweep split `gateway.rs`, `commands.rs`, `llm.rs`, and `email/replies.rs`
   into module directories**, which killed most of this file's line pointers. Every pointer named
   in the fact-check was refreshed in place; a pointer not refreshed in this pass should be
   treated as a location hint, not a citation. The claims themselves were re-verified against the
   split files.
9. **The xAI row in the provider-training block is downgraded to unverified.** Every primary xAI
   document refuses automated readers, so what we had was a summary of summaries; the entry now
   says a person with a browser has to confirm it. And the clause "which is what a user's own key
   uses" is deleted from the Google caveat: an AI Studio key can be free-tier, and a free key is
   trained on. We have never asked which kind was pasted.
10. **Hardened the same day, after the check (both decided by Jett).** Every interactive email
    tool now refuses the free starter credits exactly as the watchers do: one arm in the tool
    dispatch covers every `inbox_*` and `watch_*` tool
    (`crates/archie-runtime/src/gateway/turn.rs`; refusal text in `email/poller.rs`,
    `INBOX_TOOLS_NEED_YOUR_OWN_KEY`). Approved wording: "Every email feature refuses to run on
    the free starter credits; connect an AI account of your own and it starts." The privacy
    policy's Google bullet now scopes the starter-credits exception to calendar and task data
    for this reason. And the SSRF guard's private-address rule is now enforced inside the HTTP
    client's own DNS resolver (`crates/archie-net/src/http.rs`, `PublicAddressesOnly`), so the
    DNS-rebinding window SECURITY.md disclosed that morning is closed: a connection can only
    dial an address the check vetted, because that is where its addresses come from.

**Reconciliation — 2026-08-04.** *[Figures superseded: repriced to $30/$299 on 2026-08-19, and
Archie for Business at $99/$999 on 2026-08-21. The mechanism described here is unchanged.]*
**Pricing changed from a one-time licence to a plan**: $149 a
year or $19 a month, both Stripe subscriptions granting the `subscriber` tier. Everyone who bought
the one-time licence keeps the permanent `lifetime` tier and full access, forever
(`crates/archie-core/src/auth.rs`, `verify_access`). Three consequences for this file, all of them
copy the change made false and all of them fixed in the same pass as the code:

1. **"Whether you own Archie" is retired** in the What We Hold wording, everywhere. There is no
   ownership to report any more; the server knows **whether you have a current plan**.
2. **"If you stop paying us, nothing happens to Archie: you already own it" is now FALSE and is
   removed** from `trust/`, `trust/details/`, `faq/`, `index.html` and the Terms. The honest
   replacement, live now: a plan ends at the close of the period already paid for, nothing on the
   person's computer is deleted, and restarting a plan restores access. *[Caveat added
   2026-08-21: the account stays bound to its original Stripe customer, and a re-subscription
   Stripe books under a new customer is refused with no tier granted until support rebinds it.
   Say "restarting a plan restores access" only with "if anything looks stuck, write to us"
   nearby; never promise it as instant and unconditional.]*
3. **"If we disappear, it still keeps working" stays, in its 60-day form below.** The Terms
   commitment (a final version **requiring no license check**, published within 30 days of
   ceasing operations; those are the Terms' own words, and this file used to paraphrase them as
   "needing no sign-in", which is a different and stronger obligation than the one written)
   is independent of how the app is sold, and it is now the *only* one of the two scenarios we
   promise. That makes it more load-bearing than before, not less.

`subscriber` is no longer "the legacy recurring tier": it is what both plans grant, and
`subscription_status` is consulted on every access check. Access holds through `active`,
`trialing` and `past_due` (`SUBSCRIPTION_GRANTS_ACCESS`), so a bounced renewal is a retry window
rather than an instant lockout; it ends when Stripe cancels the subscription.

**Reconciliation — 2026-07-29.** An egress audit during the Bo competitive-response work found the
**free-add-on install ping** contradicts the retired "zero network calls" claim: *every* install,
free ones included, fires a best-effort `report_install` POST carrying the user's Firebase ID token
+ item type + item id, and the server bumps a global `install_count` (+ `last_installed_at`) with
**no per-user record** (`crates/archie-core/src/purchases.rs:111-130`; unconditional spawn at
`src-tauri/src/commands.rs:1418`, `1723-1734`; server at `stripe-webhook/index.js:290-294`).
Decision (Jett): **copy-fix, not code-fix** — keep counting free installs; retire the false "makes
no network call at all / we don't know you did it" wording and replace it with the retention-scoped
claim ("we keep only the running total, no per-person list"). Fixed in this file (the free-add-on
section + the three-things line) and on the site (`trust/`, `index.html`, `faq/`,
`privacy-policy/`). Also corrects a stale pointer: `require_owned_if_paid` now lives at
`src-tauri/src/commands/market.rs:704` (moved twice; the commands module was split 2026-08-13).

**Reconciliation — 2026-07-26.** The **one-time license migration has SHIPPED**; this file and
`PRICING-ONETIME-MIGRATION.md` were the stale artifacts, not the copy. Verified in code:
Stripe Checkout is `mode: "payment"`, not a recurring subscription
(`stripe-webhook/index.js:199,1777`), and the entitlement is an `access_tiers` array where
**`lifetime` is the one-time $149 purchase, permanent, with no subscription to check**;
`subscriber` is named in-code as the *legacy* recurring tier and is the only tier that still
consults `subscription_status` (`crates/archie-core/src/auth.rs:238-267`). The
"What We Hold" wording below has been updated from "whether your subscription is active" to
ownership; site copy already saying "whether you own Archie" (`index.html`, `archie/pricing/`)
is therefore **true and stays**. Pricing is settled at $149 one-time (Jett, 2026-07-26).

**Reconciliation — 2026-07-20.** The two Phase-1 features this file tracked as unbuilt have
**shipped** and were re-verified in code today; their ⛔/🚧 sections below have moved to ✅ with
pointers. (1) **Calendar approval gate** — writes stage instead of executing
(`gateway.rs:2006-2072`); the apply tool is only offered on a turn *after* the proposing one
(`gateway.rs:1963-1979`; snapshot rule `gateway.rs:1946-1950`); unattended routines cannot
apply writes at all (`gateway.rs:2041-2047`). (2) **Email send behind a Send tap** — the model
has no email-send tool; drafts arrive as chat cards with Send/Edit/Dismiss buttons, and
`gmail_send_reply` has exactly one caller: the "send" button handler (`email/replies.rs:507`,
`google.rs:279`; callback plumbing `telegram.rs:917-925`). The `gmail.compose` scope is
requested only when the user opts into send at connect time (`commands.rs:3054-3059`).
Site copy on archie/business/, faq/, how-it-works/, privacy-policy/, questionnaire/,
terms-of-service/, and trust/ that describes these flows in the present tense — a ⛔ under the
07-15 rules — is therefore **true and stays**. The homepage approval card, removed earlier on
07-20 while this file was stale, has been restored in the approved wording below.

**Reconciliation — 2026-07-15.** The site was audited against this file and brought into
compliance since the 07-14 pass. Verified fixed and now live in approved wording: the
three-things disclosure (was the ⛔ "subscription active" falsehood); removal of the
"Approval Required for Sends and Purchases" claim and every "nothing sends without your OK"
variant; the required web-search egress clause (`trust/index.html:179`); the volunteered
calendar-delete disclosure; and — in code — the `gmail.compose` scope, no longer requested
(`src-tauri/src/commands.rs:2338`, guarded by test `gmail_requests_readonly_only`).
**Still unbuilt (verified in code, not just copy):** the action approval gate — `calendar_delete_event`
still dispatches immediately (`gateway.rs:1738`); the only `Gate` type is the inbound access
roster (`access.rs`), which governs who may talk *to* the agent, not what it does. The claims
came down; the feature has not gone up. Do not let the claims return.
*[Superseded 2026-07-20: the gate and the Send-tap email flow have since shipped and been
verified — see the 07-20 reconciliation above.]*

---

## The Test

> Could I defend this exact sentence to a hostile engineer with a packet sniffer,
> using only what ships today?

If no, it does not ship. Not "we're building it," not "it's basically true,"
not "the spirit is right." No.

**Corollary — the tense rule:** no claim describes an unshipped feature in the present
tense. Roadmap items are labelled as roadmap, with a date, or they are absent.

**Corollary — the volunteer rule:** when a fact is unflattering and we could have
omitted it, we state it anyway. The unflattering item you volunteer buys more belief
than the flattering one you argue for. Every gap in a disclosure reads as concealment.

---

## Canonical Claims — verified, safe to ship

Each is stated in the strongest form the code supports, and no stronger.

### ✅ No Otian custodian — no server of ours holds your content

**Approved wording (positioning):** "Otian isn't a custodian of your data. Your
conversations, your files, your calendar live on your own computer and go straight to your
AI provider on your own account — they never pass through an Otian server, so there's
nothing on our side to breach, subpoena, or sell. A legal demand to us can only produce
what we actually hold, and none of it is your content: your account, your plan, and the
operational records listed under What We Hold."

*(Corrected 2026-08-21: the demand sentence used to name three things. The true maximum is the
What We Hold list — heartbeats, opt-in crash tails, the trial ledger, second-factor records,
invoices, refused checkouts, sealed phone messages with their timestamps — and a shorter list in
the one sentence about subpoenas was exactly the wrong place to be selective.)*

**Why it's true:** a synthesis of three already-verified claims below — "Your prompts never
touch an Otian server" (`llm.rs:16,18`, `lib.rs:41-48`), "What We Hold"
(`auth.rs:237-244`, `stripe-webhook`), and "We ship no telemetry and no analytics." There is
no Otian datastore of user content for a breach or subpoena to reach.

**Boundaries — do not cross:**
- ❌ Never "no third party ever holds/sees your data." Prompts still go to Anthropic/OpenAI
  (a third party) for inference. This claim is about **Otian** custody, not the provider. Keep
  the provider-egress clause visible wherever this appears.
- ❌ Never say "your data" unscoped: we **do** hold email + plan status.
  Scope it to content: "conversations, files, calendar." The What We Hold list is the floor.
- ❌ Never "nothing to subpoena." A subpoena to us yields email + plan status and the operational
  records under What We Hold.
  The true strong form is "your *content* can't be produced from us — we don't have it."
- ❌ NOT a compliance certification. It does not make Archie "HIPAA-compliant" or
  "GDPR-compliant" — content still flows to a cloud AI provider under the user's own account.
  No regulated-vertical badge without separately verifying the provider data path for that rule.
- Any contrast with a named competitor is a claim about **them** — verify and attribute before printing.

**Positioning note:** this is the one claim a cloud-hosted competitor structurally cannot match.
It's about custody and legal exposure, not secrecy. Lead with "no custodian," never "more private" —
local-model tools that keep the model on-device are genuinely more private on inference; we compete
on custody, not privacy maximalism.

### ✅ Your prompts never touch an Otian server

**Approved wording:** "When your agent thinks, it talks to Anthropic or OpenAI directly
from your computer, on your account, with your key. We are not in the middle of it, and we
keep no copy."

**Why it's true:** Provider base URLs are hard-coded constants
(`crates/archie-net/src/llm/mod.rs:36,67-79`) — in a release build, no env var, setting, or
flag can redirect them (debug builds carry a test-only `ARCHIE_ANTHROPIC_BASE` override that is
compiled out of what ships). We configure no proxy on the HTTP clients
(`crates/archie-net/src/lib.rs:71-101`); a proxy the user sets in their own OS environment is
honored, which is their choice about their traffic, not ours. The agent runtime crate contains
zero Otian hosts. The webview's CSP (`src-tauri/tauri.conf.json:24`) forbids the frontend from
reaching any host at all. One deliberate carve-out: the "Another provider" option is exactly a
setting that sends a key to an address the user typed — its own key, threaded separately, to
the endpoint they chose. That is the feature working, not the claim failing, but the claim is
about the seven named providers and must not be written as though no configurable endpoint
exists.

**Required clause — do not drop it:** web search runs on the *provider's* infrastructure
and is billed to the user's key (`llm.rs:580-605`). Still not us, but the search query does
reach the provider's search backend. Say so.

**Required clause, added 2026-08-07 — the free trial is the exception, and it is ours.**
Before anybody connects a key, a new install runs on a gift of Anthropic usage that is paid
for on **our** account, and those calls go to our billing service, not to Anthropic
(`llm.rs:44-55`, `TRIAL_PATH_PREFIX`). While somebody is on free credits, their prompts and
the replies pass through an Otian server. The key cannot ship in the binary, because a key
compiled into a shipped binary is extractable and the prize for extracting that one is
unmetered spend on our account, so the proxy is not a choice we get to make differently. The
app says this on screen. The site did not say it at all until this date, on a page whose
whole argument is "there is no Otian server in that path", which is the most expensive
omission this document has ever had to record.

**Approved wording (amended 2026-08-21):** "One exception, and it is ours: the free credits you
start with are paid for on our account, so while you are using them your messages pass through
our server on the way to Anthropic. Connect an AI account of your own and that stops from each
agent's next start (the setup flow restarts it for you), and no conversation of yours touches us
again."

*(Two corrections folded in. "The moment you connect" was not what the code does: a key added
from Settings takes effect when the agent next starts, and nothing on that page restarts it.
And "nothing of yours" was unscoped; entitlement checks, install counts, opt-in crash tails,
and sealed phone envelopes still flow, so the sentence is scoped to conversations, which is
what it was always about.)*

**Boundaries — do not cross:**
- ❌ Never state the no-Otian-server claim *unscoped* without this clause on the same page.
  The trial is the first thing a new user does, so the exception applies to everybody at the
  moment they are most likely to be reading. Two shapes are allowed elsewhere: scope the
  sentence ("on your own account, with your key, we are never in the middle"), which is true
  of every path the sentence names, or state it flat and carry the clause. A flat "nothing
  passes through us" with neither is false for every new install.
- ❌ The "block us and watch nothing happen" test may not name `otianai.com` alone. Corrected
  2026-08-09: the proxy answers on `archie-4f35.onrender.com`, so blocking the marketing domain
  leaves a free-credits agent thinking happily through a server of ours while the page tells the
  reader that proves we are not in the path. Both hosts are named now, and the promise is scoped
  to "once your own key is in". A test a reader can pass while the thing it disproves is still
  running is worse than no test. Same fix on `trust/index.html` step 4 and `trust/details/` step 4;
  step 3 on `trust/index.html` also had to name the proxy, because the paragraph invites readers
  to report any other host carrying their content and the details page's list already named it.
- ❌ **Corrected 2026-08-25: never write that connecting your own key ends the app's traffic to
  `archie-4f35.onrender.com`.** `trust/details/` step 3 said "Once your own key is in, your agent
  stops going near it", and that is false three times over. The signed licence assertion is
  fetched from `{billing}/entitlement` on every launch that reaches us, forever
  (`crates/archie-core/src/entitlement.rs:193`). The free-add-on install count posts to
  `{billing}/marketplace/installed` on every free install whatever key you hold
  (`crates/archie-core/src/purchases.rs:268`). `purchases.rs` still carries checkout functions,
  but nothing in the app calls them (see the retired purchase section below). Only the
  free-credit proxy ends, and only that. The
  same page's step 4 already said the licence renewal stops when you block the host, so the page
  contradicted itself in the two paragraphs a reader with a packet sniffer reads hardest. The
  approved shape names the three jobs and says which one ends: **licence note, free-credit proxy,
  install count; the proxy is the one your own key ends.** (Checkout was a fourth until every
  add-on became included with Archie; nothing in the app starts one.)
- ✅ **The enumeration names the host, not a nickname per job.** `trust/index.html`'s "Everything
  that leaves your computer" table called one machine "Our server", "our billing service", "Our
  checkout server" and "Our count server" in four rows while claiming to be "every single thing",
  so a reader watching connections saw one name they could not map to any row. All four now say
  `archie-4f35.onrender.com` and a note under the table says it is one machine doing four jobs.
  This is the one-name-per-concept rule applied to a hostname, and on this page it is also the
  difference between a checkable claim and an unfalsifiable one.
- ✅ It is passed through, not kept. `stripe-webhook/index.js:485-487`: nothing there logs a
  request body, a response body, a prompt, or a completion; what is logged is the uid, hashes
  of the device and IP, token counts and amounts. The reply is buffered in memory to read the
  `usage` block that decides the debit, and that is the whole of it. Say "passes through"
  rather than "is stored", and never upgrade this to "we cannot see it": a proxy we operate
  could be changed to log, and the honest claim is that it does not.

### ✅ The plan with the AI included runs through the same proxy, by choice, and mail and texts are off on it

**Added 2026-09-02.** Archie is also sold at $59 a month or $599 a year with $25 of Claude Sonnet
usage inside each month (`docs/AI-INCLUDED-PLAN.md` in the Archie repo). That usage is spent on
our Anthropic account through the same billing-service proxy as the free credits
(`stripe-webhook/index.js`, the `/trial/v1/messages` route; the ledger is `kind: "plan"` in
`stripe-webhook/credits.js`, refilled on `invoice.paid`). Two things differ from the free credits
and both have to be said wherever the plan is described:

- **It refills each paid month and nothing rolls over.** `renewPlanLedger` sets the balance; it
  does not add to it. When the $25 is used the agent pauses until the next invoice or until an
  account of the customer's own is connected (`PLAN_GRANT_MICROS`, `plan_exhausted`).
- **Email and the text watch do NOT work on it, and this reversed on 2026-09-03.** They did when
  the plan shipped: the gate compared against the trial sentinel alone, so the plan's sentinel
  (`archie_net::llm::PLAN_CREDENTIAL`) passed, on the argument that the customer chose the plan at
  a checkout line that says so while a trial user was never asked. Both halves came off, a day
  apart in reasoning and the same day in code, and the reasons are different:

  - **Mail**, because four documents in front of Google and the CASA assessor say Otian operates
    no server in the Gmail data path, and the plan had made those statements untrue for six weeks.
    The code was changed to match the filing rather than the filing amended mid-review. **This one
    is temporary**: it comes back if a later submission describes the proxy.
  - **Texts**, because consent from the owner is not consent from the person who texted them, who
    is not in the room and cannot be asked. **This one is permanent** and does not return when the
    Google review finishes.

  Both now ask `runs_through_otian` in `crates/archie-runtime/src/email/poller.rs`, which is true
  on either proxy sentinel, with a test pinning both. So on this plan the agent thinks through the
  proxy and reads neither mail nor texts.

**Approved wording, replaced 2026-09-03:** "That usage runs on our Anthropic account, so what you
write to your agent passes through our server on the way to Anthropic. It writes nothing down, we
keep no copy, and we use none of it for anything. Email and text replies are the two things it
will not do on this plan, because they carry what other people wrote and those people never agreed
to anything. Both work on an AI account of your own, where nothing goes through us at all. When
the $25 is used, your agent pauses until next month."

*(The wording it replaces said "and the mail your agent reads and writes for you" passes through
our server. That was true for six weeks and is now false in the one direction that matters, so any
page still carrying it is describing a product we do not sell.)*

**Boundaries, do not cross:**
- ❌ Never "we cannot see it" or "we technically cannot read it" for this plan, for the same
  reason as the free credits above: the reply is buffered in memory to read the `usage` block,
  and a proxy we operate could be changed to log. The honest and stronger claim is the three-part
  one: nothing writes it down, no copy is kept, none of it is used. All three are true today and
  the third follows from the second.
- ❌ Never "unlimited" or "all the AI you need". It is $25 at list price, and the pricing page
  says which of the three measured bands fit inside it.
- ❌ The plain plan's "no Otian server in the path" is now scoped to the plain plan on every page
  that also mentions this one. An unscoped version beside a plan that is sold with the proxy
  inside is false for that plan.
- ✅ The `ai_included` flag on the user document exists for support and is not a holding that
  changes the What We Hold list: it is part of "whether you have a current plan".

### ✅ No analytics, and two small things that are not analytics

> **Corrected 2026-08-06.** This entry said "no telemetry of any kind. Not opt-out, absent",
> and the one below it said crash logs have no upload path. Both were true when written and
> stopped being true when `crates/archie-core/src/telemetry.rs` shipped. They were live on
> `trust/index.html` as two "Nowhere" rows in the table that ends by inviting readers to report
> anything Archie sends that is not listed. Fixed on the same day the drift was found.

**Approved wording:** "There is no analytics service in Archie: nothing records what you do
in it, and nothing counts what you use. Two things do go out. Once every six hours Archie
says which version it is and whether it is on Mac or Windows, so we know what is still
running before we ever switch a version off. And if it quits unexpectedly, the next launch
sends the tail of the crash: the error and where in our code it happened. Both carry your
account ID. Neither carries anything you wrote, received, or asked for."

**Why it's true:** `telemetry.rs` has exactly two entry points. `heartbeat` writes
`heartbeats/{uid}` with four fields, app version, platform, edition and last seen, at most once
per six hours per process (`HEARTBEAT_EVERY`), overwriting the same document (one document per
account **per edition**, so a person running both editions has two rows). `flush` uploads
queued crash tails to `error_reports` with uid, version, platform, edition, kind, message,
build and a timestamp, capped at 2000 characters, five reports per launch, and nothing whose
`crash.log` is older than seven days (`MAX_CRASH_AGE`). Every string passes the same `Redactor` the gateway logs
use before it is written to disk, so the copy uploaded is the copy the user can read. There
is still no Sentry, PostHog, Amplitude, Mixpanel, Segment or GA in `Cargo.lock` or
`package-lock.json`, the Tauri log plugin is a no-op stub, and the webview CSP still makes
frontend network calls impossible.

**Amended 2026-08-07: there is now an off switch, and it is real.** The app's Settings page
("This computer"), under Crash reports, carries the switch and the full list of what is in one.
*(Corrected 2026-08-21: this said Account, and the pages were split; a claims file wrong about
which screen of our own app holds a switch is the cheapest kind of wrong to fix.)* Off stops the
heartbeat, stops the upload, and stops the queue being written at all; anything already
queued is deleted when the switch is thrown (`telemetry::set_off`, and `is_off` is read at
all three entry points). It is a marker file in the data directory rather than a setting in
the database, because a panic hook mid-crash holds a path and nothing else.

**Approved wording for the switch:** "You can turn both off, in the app, in Settings. Off
means nothing further is sent and anything waiting to be sent is deleted."

**Boundaries — do not cross:**
- ❌ Never "off by default". It sends until somebody turns it off. Say "on until you turn it
  off", which is the true form and is not worse.
- ❌ Never "anonymous". Both carry the account ID, which is how a version histogram and a
  crash report are worth anything. The true claim is that they carry no content, not that
  they carry nobody.
- ❌ Never "we receive no personal information" without saying what we do receive. The
  account ID is personal information; the version, platform and error text are not. The
  approved shape is the second sentence naming both: "It carries your account ID, the
  version, and the platform. It carries nothing you wrote, received, or asked for."
- The in-app page and this claim are one list. `crates/archie-core/src/telemetry.rs` is the
  source; if a field is added there, both change or the page is a lie.

### ✅ Which AI company it talks to is your choice, and the trial is Anthropic

**Approved wording (amended 2026-08-21):** "Archie runs on an AI account you connect:
Anthropic, OpenAI, Google, Groq, xAI, DeepSeek, or Mistral, or any provider of your own that
speaks the OpenAI format. You pick, and you can change it later. The free credits you start
with run on Claude, because that is the account we pay for."

**Why it's true:** the provider enum is `crates/archie-net/src/providers.rs` and requests are
built in `crates/archie-net/src/llm/` for all seven named providers plus the user-configured
endpoint; the provider is a per-agent setting rather than a build-time constant. `TRIAL_MODEL`
in `stripe-webhook/index.js` is an Anthropic model, because the trial spends our Anthropic key.

**Boundaries — do not cross:**
- ❌ Never write "Archie uses Claude" as a bare statement of what the product is. It was in
  the trust page's own headline until 2026-08-07, where it made a page about who holds your
  data say something false about the product in its first sentence.
- ❌ Never list a provider we have not shipped, and never freeze the count in copy that will
  outlive it: "five" was true once and sat stale on three pages. The list is
  `providers.rs`, and the site's number must be re-counted from it, not from another page.
- The names are a set, not a ranking. Do not imply one is required or recommended
  without saying why, and never imply the others are degraded.

### ✅ The other free trial runs on your own key, so nothing passes through us

**Approved wording (amended 2026-08-21):** "The free credits are limited per computer, so a
computer that has used its grants cannot have more. There is another way to try Archie: connect
an AI account of your own and you get 14 days, on the same terms as everyone else. Because your
key is paying, your conversations go straight to them, exactly as they do for a paying customer.
We are never in the middle of them."

*(The old first sentence promised "a second account cannot have them." The cap is two grants
per computer, chosen so a factory reset does not strand the machine, so a second account CAN
claim the second grant and only the third is refused. Per the do-not-name-the-numbers rule
below, the wording says "limited" without saying two.)*

**Why it's true:** two facts, and the second is the one that carries the privacy claim.

1. A days-only trial is granted with `kind: "own_key"` and no money in it
   (`stripe-webhook/index.js`, `/trial/claim`). It is offered only after the credits have been
   refused for that computer.
2. **A key of the user's own always wins over the trial credential**, and that is what keeps the
   proxy out of the path. `src-tauri/src/commands/gateway_lifecycle.rs:70-93` resolves in a fixed
   order: Anthropic, OpenAI, Gemini, xAI, Groq, DeepSeek, Mistral, the custom endpoint, and only
   then the trial. Anybody on a days-only trial has
   connected a key by definition (the app checks it works before asking for the trial), so the
   trial credential is never reached. The ledger is empty as well, so even a call that somehow got
   there would be refused rather than paid for.

**Boundaries — do not cross:**
- ❌ Never write it unscoped. Archie still talks to us during these 14 days: it checks what the
  account can open, it checks for updates, it reads the add-on catalog. What it does not do is send
  the conversation through us. Scope the sentence to the conversation, every time.
- ❌ Never let this become the general "your prompts never touch an Otian server" sentence.
  The **credit** trial does pass through us, that clause is still required, and this one is not a
  replacement for it. Two trials, two answers, and the difference is who is paying.
- ❌ Never say the 14 days are "free Archie". The person is paying their own AI bill for them,
  which is the entire reason we can offer them.
- ✅ Say "connect an AI account of your own". Do not say "add a key", which reads as a chore, and
  do not say "bring your own key", which is jargon.

### ✅ The update check tells us nothing about you

**Approved wording:** "Archie checks for updates with a plain request that carries no
version number, nothing identifying your computer, and no account. Our server sees an IP address
and a timestamp."

(Was "no machine ID" until 2026-08-07. Same claim, said in words a first-time reader has met
before: "machine ID" is the kind of phrase that makes a plain sentence sound like it is hiding
something, on a page whose whole job is the opposite.)

**Why it's true:** `src-tauri/tauri.conf.json:75` has no substitution placeholders, so the
updater plugin sends a bare GET. Version comparison happens client-side.

**Corrected 2026-08-21: "our server" was the wrong noun.** The manifest is a static file on
GitHub Pages, so GitHub's servers see the IP address and the timestamp, and we see nothing at
all: we hold no logs of update checks because no machine of ours answers them. That is the
stronger true claim; say it that way.

### ✅ The spend meter is local, and it is an estimate

**Approved wording:** "Archie keeps its own running total. The Account screen shows what
you've spent this month and all time, broken down by provider and by agent, counted from what
every reply hands back. That figure is an estimate from a price table inside the app rather
than the provider's invoice, and it says so on the screen. The authoritative bill is on the
provider's own dashboard."

**Why it's true:** `build_usage_sink` (`src-tauri/src/usage.rs:21-40`) appends one JSONL line
per LLM call to a per-agent log on local disk: provider, model, fresh input, cached input,
cache-write, output, and web-search counts. Cost is derived by multiplying those counts by a
local price table in the same file, which the module's own doc comment calls "an **estimate**;
the estimate is token-accurate, only the prices are approximate." The `SpendingPanel`
(`src/app/auth.tsx:76-160`) reads it back for this month / all time, by provider and by agent,
and renders the total next to the word "estimated" plus the line "Estimated from token usage
on your own API key, not the provider's bill."

**Required clauses — do not drop them:** say **estimate**, and say the provider's dashboard is
the real bill. Overstating this one turns a helpful number into a billing promise we cannot
keep. Never write "Archie tracks your exact spend" or "see your bill in Archie".

### ✅ The quality dial is a default, and the checkbox under it is the override

**Approved wording:** "An add-on can pick its own response quality and ignore the dial, and many
do, so on an agent with several add-ons installed the dial alone barely changes the bill. The
checkbox under it, 'Use this for every skill', overrides them. Measured in August 2026 on an agent
with 12 add-ons and priced at today's rates, that checkbox takes about two thirds off the monthly
cost."

**Why it's true:** `resolve_for` (`crates/archie-runtime/src/gateway.rs:711-718`) is the single
place the model is chosen for a reply. With the flag off it calls `resolve_model`, which lets a
skill's own declared tier win; with it on it calls `resolve_model_forced`, which uses the agent's
dial for every target. The flag is `AgentBundleManifest::force_model_tier`, written by
`agent_set_force_tier` (`src-tauri/src/commands.rs:622`) from the "Use this for every skill"
checkbox in `src/app/agent-detail.tsx`. Web search is bumped to Balanced rather than broken
(`resolve_model_forced`, same file line 699).

**The two thirds is measured, not modelled:** `crates/archie-runtime/examples/cost_bench.rs`
run with `--live --force-fast` against a twelve-skill agent on 2026-08-10. Forced Economy came to
18% of forced Balanced on a warm turn and 21% on a cold one at the price sheet of that day. On
September 12, 2026 Anthropic made Claude Sonnet 5's launch price the standard price instead of
raising it, and the same measured tokens at that sheet come to 27% and 32%, which is the "about two
thirds off" (it was "four fifths" until that day). The unforced dial on the same agent saved 4% to
7%. Figures and the full dataset: `docs/COST-MEASURED.md` in the Archie repo, sections 3 and 14.

**Required clause, do not drop it:** say that the checkbox also takes the add-ons off the level
they chose. A saving quoted without its trade is a claim we cannot defend.

### ✅ You choose what your agent can do, and what it stops carrying (SHIPPED 2026-09-18)

**Approved wording:** "Your agent's Setup tab has a section called 'What it can do'. Every ability
in it is switched on until you turn it off. Turn one off and the agent stops offering it, and each
message you send costs a little less. Ask it for the thing anyway and it tells you which screen
turns it back on, rather than pretending it never could."

**The two switches, in the words on the screen:**

- **"Don't let this agent build new skills."** It stops offering to build a skill or a routine when
  you describe a job none of its skills cover. The skills and routines you already have keep
  running, and you can still write one yourself on the Build a skill tab.
- **"Don't let this agent read the web."** It stops opening pages and searching, for this agent and
  every skill installed later. Email, calendar, and chat keep working, and so do the services you
  connected yourself.

**Why it's true:** both are fields on the agent's own manifest
(`AgentBundleManifest::no_skill_builder` and `::no_web_access`,
`crates/archie-domain/src/skill.rs`), written from the checkboxes in `src/app/agent-detail.tsx` by
`agent_no_skill_builder_set` and `agent_no_web_access_set` (`src-tauri/src/commands/mod.rs`) and
read once at gateway start (`src-tauri/src/commands/gateway_lifecycle.rs`). The builder switch is
read through one accessor, `GatewayConfig::skill_writer`, which three separate places consult (the
tool list, the sentence that invites an offer, and the write itself), so there is no path by which
an agent with the switch off can be handed the tools or save a draft. The test is
`a_switched_off_builder_says_where_it_goes_back_on` in
`crates/archie-runtime/src/gateway/skill_builder.rs`. The web switch is the older of the two and
had no entry here until this one was written; `crates/archie-runtime/src/tool_policy.rs` holds the
membership test that keeps a new web-reaching tool from slipping past it.

**Why the agent names the screen:** with the builder off, the turn carries one sentence saying it
is switched off and where it goes back on (`skill_builder::OFF_NOTE`). Without it the agent obeys
its standing rule that a no is never the whole answer and goes hunting through the add-on store for
a thing that is not in the store. Naming the setting is the difference between a switch and a dead
end.

**Boundaries, and one of them is a number.**

- **No figure for the saving may be quoted anywhere, by anybody, yet.** What is known is read off
  the code, not off a bench: the builder's tool descriptions are roughly 1,800 tokens carried on
  every chat turn. Nobody has run a live agent for a month with the switch off and priced it. Until
  `cost_bench` does, the claim is "a little less", and "a little less" is the ceiling.
- **Never call this a safety feature in general.** One of the two switches is about safety and the
  other is about cost, and they sit together because both are agent-wide switches read at start,
  not because they are alike. The web switch's own claim is the one in the websites section.
- **Never say it turns off a skill you installed.** It does not. It narrows what the agent offers
  in conversation; the Skills tab is where an add-on is removed.
- **Never describe what comes off a message.** The mechanism is the company's, under the rule in
  the section immediately below. "Costs a little less" is an outcome and ships; anything about what
  Archie sends does not.

### ✅ We work to keep the AI bill down, and we do not say how

**Approved wording:** "We keep working on what a reply costs, and we do not publish how. Nobody
here earns anything from this bill, and you should not pay more for a reply than it has to cost.
A change reaches these figures once it has been measured, not before."

**Why it's true:** the AI account is the owner's own and Otian takes no cut of it (the custody
claims above), and the Archie repo carries a cost rule in its `CLAUDE.md` that a change raising
what an ordinary reply costs has to earn it out loud, with `docs/COST-MEASURED.md` as the record
every published figure is read from. The figures on the pricing page move only on a measurement,
which is the standing rule on that page since 2026-08-26. On the evening of 2026-09-12 the rows
moved for the scheduled reports and the inbox watch, on a price read off the provider's own sheet
and one live run, and the page says nothing about why: the method is the part that is withheld.

**Required clauses, and one ban.** Say that we do not publish how, and say what moves the table.
**Never describe a mechanism on the site**: not what is kept between replies, not how the tool
list is handled, not the order scheduled reports run in, nothing about which text sits where in
what Archie sends. Jett's direction of 2026-09-12: the outcomes are public, the methods are the
company's. The Archie repo is private, so never write "published with the source"; "kept with the
Archie code" is the approved form. Comparisons with what other agents cost go on the compare
pages, sourced and dated like every other third-party figure, with at most a sentence of it on
the pricing page.

### ✅ What other agents charge per unit, and the like-for-like caveat

**Approved shape:** a table on `compare/cloud-agents/` (and one row each on the Symphony and
automation comparisons) that prints each company's own unit at its own price, with a numbered
`.src-cite` on every figure, beside our measured cost per reply: "$0.01 when it follows another
closely, up to $0.11 when it starts from nothing, measured on an agent with twelve add-ons and
everything connected, at Balanced." The pricing page carries one sentence of it and links to the
table.

**Why it's true:** every third-party figure is the company's own published price or rate, read on
the date in FACTS.md; the derived ones (a Copilot reply that takes two actions, a Zapier activity,
a Lindy ask) show their arithmetic in the page's Sources fold and in FACTS.md. Ours is
`docs/COST-MEASURED.md` section 14.5 in the Archie repo: the twelve-add-on bench shape, warm and
cold-and-writes, at Anthropic's sheet of 2026-09-12.

**Required clauses, do not drop them.** (1) Say the units are different sizes of work: a credit,
an action and a reply are not the same thing, and the companies say so. (2) Beside the $0.11, say
that a reply that delegates to a specialist or uses the Deep setting costs more; the tester's agent
averaged $0.155 a turn with both in the mix. (3) Call the OpenClaw figures one person's log, never
"what OpenClaw costs". (4) Claude Code is on the page for the shape of the bill (an agent on a
key), not the size of the job, and the note says so.

**Bans.** Never "cheaper than X" as a flat sentence; the reader does the comparison, in units the
page has explained. Never a figure from a search snippet, an aggregator, or a vendor's blog about a
competitor (Kilo's OpenClaw page and Lindy's Devin page were read and left out for that reason).
Never a per-task figure a company does not publish: Symphony, Manus, Genspark, Grok Bot and
Perplexity's Computer publish none that survive their own caveats, so their rows say "not
published" or do not exist.

### ✅ Your API key stays in the Keychain

**Approved wording:** "Your provider key is stored in your Mac's Keychain. It is sent to
Anthropic or OpenAI and nowhere else — we have no way to read it."

**Why it's true:** `KeychainStore` is the only store compiled into a release build
(`src-tauri/src/lib.rs:100-103`); the plaintext dev store is `#[cfg(debug_assertions)]`
(`crates/archie-core/src/secrets.rs:210`) and is **not in the release binary**, so no flag
can reach it. The key is transmitted only as `x-api-key` to Anthropic / bearer to OpenAI.

**Nuance — do not overclaim:** the key is necessarily held in process memory while in use
(`secrets.rs:62-67`, `gateway.rs:46`). Never imply it isn't. "We have no way to read it" is
true and sufficient.

**Plain-language form, approved 2026-08-03:** marketing pages may say "your computer's
built-in password store" instead of "Keychain", with no parenthetical gloss. This is the same
claim, not a weaker one: the load-bearing half is custody ("where we have no way to read
them"), which is unchanged. Both `archie/personal/` (then `archie/`) and `how-it-works/` previously ran the term AND its
gloss inside one sentence, which is what made those paragraphs unreadable. Use one, and prefer
the plain one outside this document. Still banned either way: "your keys never leave your
computer" (see Banned Phrasings).

### ✅ The activity record is tamper-evident, and it holds no content

**Approved wording:** "Archie writes down the things that decide what your agent can reach: a
key saved or handed to an agent, a service connected or disconnected, someone allowed to
message an agent or stopped from doing so. Each line carries a fingerprint of the line before
it, so a line that is changed, reordered or deleted shows up as broken the next time Archie
looks. The record stays on your computer, we never see it, and you can export the whole thing."

**Approved wording for the anchor, added 2026-09-16** (the mechanism was already in the
paragraph below; what is new is a sentence copy may use, because `trust/` and `trust/proof/`
now draw it): "Archie also writes down where the record ended, in your keychain rather than in
the record. So a record whose fingerprints have all been rewritten to cover a change still
ends on a different number than the one Archie left off on, and Archie says so when it opens."
Say it with the limit attached, which is the same limit as everything else in this section:
somebody who rewrites the record and the keychain note together leaves nothing to check.
`verify_anchored` + `AUDIT_ANCHOR_KEY` (`crates/archie-core/src/audit.rs`), run at startup
(`src-tauri/src/lib.rs:332`).

**Why it's true:** `crates/archie-core/src/audit.rs` is an append-only, hash-chained log. Each
event's `hash` is the SHA-256 of its canonical bytes including the *previous* event's hash
(`hash_event`, `audit.rs:44`), so `verify()` fails on any edited, reordered or deleted row
(`verify_rows`, `audit.rs:73-81`). `verify_anchored` closes the one gap a pure chain cannot see:
rows deleted from the *end* leave a shorter chain that is still internally consistent, so the tip
hash is anchored in the Keychain between runs (`AUDIT_ANCHOR_KEY`) and a missing anchor is
reported as tail truncation. It runs at startup (`src-tauri/src/lib.rs:332`), and the app shows
the result as a pass/fail line above the list rather than a footnote (`src/app/settings.tsx`,
"The claim first ... 'Nothing has been changed' is only worth saying by something that checked").
`export_jsonl` writes the whole record as JSON Lines with hashes included and **refuses to export
a chain that fails verification**; it is wired to a real button (`audit_export`,
`src-tauri/src/commands/mod.rs:664`, registered `lib.rs:538`, called `settings.tsx:812`).

**Why it is ours to claim, and not just a log file:** every product keeps a log. The claim here
is narrower and checkable: the record cannot be quietly rewritten, and the app tells you so on
open. That is the difference between an audit trail and a text file.

**Nuance — do not overclaim, three ways:**
1. **It is not a transcript.** It records the actions above, not what your agent read, wrote or
   sent. Never let it imply we could show a customer what their agent did to a given email. That
   would contradict "No Otian custodian" and it is not what the table holds.
2. **It shows tampering, it does not prevent deletion.** Someone who removes the database and the
   Keychain anchor together leaves an empty chain that verifies. The honest verb is "shows up",
   never "cannot be deleted" or "immutable" as a customer-facing word.
3. **It is local, so it is not attestation.** We never see it and cannot vouch for it. It is
   evidence for *you* about your own computer, which is the same shape as the network-monitor
   section on `trust/`, and it must not be written as something we certify.

**Secrets cannot enter it:** metadata is passed through `Redactor::redact_json` before it is
stored or hashed (`audit.rs:44`), so the trail cannot become a place a key leaks to.

**The take-back controls this claim sits beside, and the one that is two steps.** Disconnecting a
connected account is one control in the app (`connector_disconnect`,
`src-tauri/src/commands/integrations.rs:1867`), and it unbinds the credential
(`credential_ref_id: None`) and removes the connector. **It does not delete the saved key**, which
is a separate action under Settings / Saved keys; the app says so on the connection card itself
("To disconnect this app entirely, remove its token in Settings, under Saved keys",
`src/app/connect.tsx:4121`). Never write disconnect as though it took the key off the computer
too. Taking a person's access to a shared agent away is `api.accessRevoke`
(`src/app/access.tsx:808`). All three land in the record above (`credential.deleted`,
`connector.disconnected`, `access.revoked` in `ACCESS_ACTIONS`), which is the sentence that makes
the record worth having and is checkable against that table.

### ✅ We keep no per-person record of the add-ons you install

**Approved wording:** "When you add an add-on, Archie bumps its public popularity count by
one. That request is signed in as you, so the number can't be faked, but all we ever keep is the
running total. We hold no list of which add-ons are yours."

*(Every add-on is included with Archie, so "free add-on" is retired as a phrase: it implies a paid
kind that does not exist. Say "add-on".)*

**Why it's true:** installing *any* add-on fires a best-effort `report_install` POST to the
billing service (`crates/archie-core/src/purchases.rs:111-130`), carrying the caller's Firebase
ID token + item type + item id; the call is unconditional, not gated on price
(`src-tauri/src/commands.rs:1418`; spawner `1723-1734`). The server verifies the token and
increments a single global `install_count` (+ `last_installed_at`) on the catalog doc through the
Admin SDK, writing **no per-user record** of who installed what
(`stripe-webhook/index.js:290-294`). Identity is transmitted (authenticated, to stop
count-stuffing) but never retained: there is no `users/{uid}` free-install list anywhere.

**Boundaries — do not overclaim:**
- ⛔ **Retired 2026-07-29:** "Installing a free add-on makes no network call at all / we don't
  know you did it." **False** — the popularity ping fires for free installs too and is signed in
  as you. Caught in the egress audit during the Bo competitive-response work. Do not let it return.
- The honest strong form is about **retention**, not silence: a request goes out, but we keep
  only the aggregate. Never phrase it as "nothing leaves" or "zero network calls."
- ❌ Never imply the ping is anonymous. It carries your ID token by design.
- ⚠️ **Added 2026-08-25: it is a destination, and it belongs in every list of them.** The ping
  goes to `{billing}/marketplace/installed`, which is `archie-4f35.onrender.com`
  (`crates/archie-core/src/purchases.rs:268`), and it is unconditional on which AI account the
  user is on. So it survives connecting your own key, it survives the free credits running out,
  and it stops only if somebody blocks the host. Wherever the site enumerates where data goes,
  this is one of the entries, and wherever the site says what blocking us costs you, this is one
  of the things that stops. Both are now on `trust/`, `trust/details/` and `privacy-policy/`.

### ⛔ No add-on is sold, so there is no purchase, no receipt, and no per-person add-on list

**The fact:** every add-on (skill, routine, specialist, personality) is included with Archie. There
is no per-add-on price, no Buy, and no customer-facing purchase record. The site says "Every add-on
is included with Archie" and never frames it as a change.

**Why it's true:** every catalog entry is `price_cents: 0`. `crates/archie-core/src/purchases.rs`
still exists in the app's core crate, but nothing in the app calls its checkout functions
(`create_checkout`, `create_cart_checkout` have no callers), and the one `list_purchases` call left
(`src-tauri/src/commands/market.rs`, `require_owned_if_paid`) sits behind a `price_cents == 0`
early return that every catalog entry takes, so it never runs. The Stripe webhook's per-item
purchase writer (`users/{uid}/purchases/{item_id}`) has nothing to write, because no item checkout
is ever started. Cite the file, not a line: lines move.

**Boundaries:**
- ⛔ Never "paid add-on", "premium", "bought", "buy", a price, or "free add-on" (which implies a
  paid kind). Never "now free", "no longer sold", "for the beta": it is a standing fact.
- ⛔ **"Add-ons sync automatically, no reinstalling per device"** (caught 2026-08-24 on
  `skills-marketplace/browse/`) stays banned. There is no per-user record of any add-on to sync
  from, so a new computer adds them again. Say that.
- ⛔ The retired claim "Anything you buy is tied to your Otian account, so another computer can
  add it again without paying twice" must not return: there is nothing bought to tie.

### ✅ Archie on your phone: an encrypted mailbox we hold and cannot read (SHIPPED)

**Status 2026-08-06:** live. The Firestore rules are deployed, the feature is in the shipped app,
and the "What We Hold" amendment below has landed on all five pages. It is still off unless somebody
turns it on, per computer, which is a fact the wording has to keep carrying.

**Approved wording:** "Turn on phone access and your computer starts leaving
messages for your phone in a mailbox on our servers. Every one of them is sealed with a key your
computer makes and gives to your phone by scanning a code. The key never passes through us, so what
we hold is a pile of ciphertext with no way to open it."

**Why it's true:** payloads are sealed with AES-256-GCM before they are written
(`crates/archie-core/src/phone.rs`, `seal`/`open`; browser side in the website repo's
`js/phone.js`, same functions, verified against each other by the `opens_an_envelope_sealed_by_the_browser`
test vector). The key is generated on the desktop, stored in the OS keychain, and delivered to the
phone in a **URL fragment** (`phone::pair_url`, asserted by
`the_pairing_key_rides_in_the_fragment_never_the_query`), which browsers do not transmit to servers.
The relay rules in the Archie repo's `firestore.rules` bound shape and size but grant no read to
anyone but the account owner, and the seal means owning the row is not reading it.

**Required clauses — do not drop them:**
- ⚠️ **Say that we hold it.** The claim is about *custody without access*, not about absence. "It
  never touches our servers" is FALSE here and must never be written: the whole mechanism is that it
  does touch our servers, sealed.
- ⚠️ **Three fields are in the clear**, and pretending otherwise is the easy overclaim: a
  timestamp, the app version, and a command's `pending`/`done`/`failed` status. We can therefore see
  *that* a phone is managing a computer, and roughly when, but not what it did. Say "we can't read
  the messages", never "we can't see anything".
- ⚠️ **Off by default.** With phone access off, nothing about the computer is written at all. That
  is worth stating, because it is the strongest true form for anyone who does not want the feature.

**Boundaries — do not cross:**
- ❌ Never "end-to-end encrypted, so nobody can ever see your agent". The desktop is one end and
  the phone is the other; a person with the computer unlocked has everything, as they always did.
- ❌ Never imply the encryption protects against a compromised phone. Whoever holds the phone holds
  the key. That is what the Unpair button and key rotation are for.
- ❌ Not a compliance claim. See the boundaries on "No Otian custodian" above; the same limits apply.

### 🚧 The Archie app for a phone: sealed, where a chat app is not. IN BUILD, NOT SHIPPED

**Status 2026-09-17.** The client is written and runs (`/Users/Games/Desktop/Code/archie-mobile`).
Two things that were pending on 2026-09-11 have since happened, and one has not.

- **`/phone/pair` is deployed**, since 2026-09-14 (`stripe-webhook/phone-pair.js`), along with the
  `notPhone()` rules. The freeze it was waiting behind was lifted by the assessor, who said to
  proceed with the package as it stood.
- **Build 9 is submitted to the App Store** and sat in review from 2026-09-17. Submitted is not
  approved: nobody outside the team can install it, it is in no store listing anyone can reach, and
  a rejection is an ordinary outcome that would push it further out.
- **Android has not started.** It needs a D-U-N-S number first, which takes up to 30 business days.

So the rule below has not changed and **still holds**: every sentence about this app on the site is
future tense, and **no page may carry a ship date**. The day it is approved and downloadable, this
entry moves to SHIPPED and the tense changes with it, in one pass, deliberately. Being in review is
not that day. **A privacy policy is the one exception**, because Apple requires the policy to
describe an app under review and a policy is not a promise of availability: `privacy-policy/`
describes the phone app in the conditional, in the same shape as the shipped phone-access claim
("if you turn on phone access"), and says nothing about being able to get it.

**Why this claim is worth making at all.** Today an agent reaches its owner through a chat app, and
that is the one part of Archie that crosses somebody else's servers in a form they can read. The
text-replies section above already concedes it in approved wording: the reply card "arrives through
whatever chat app your agent uses, so it crosses that platform's servers like anything else you read
there." The app is the answer to that sentence. Until it ships, the sentence stands and the
concession stays on the page.

**Approved wording, the claim:**

> Right now your agent reaches you through a chat app, so what it says to you crosses that company's
> servers like any other message you send there. We are building an app that does not work that way.
> Your computer seals every message before it leaves, with a key it makes itself and gives to your
> phone by showing it a code to scan. The key never passes through us. We hold the sealed messages
> and cannot open them.

**Approved wording, the comparison.** Every clause is the other company's own published position.
Cite it that way on the page, with the link, or do not make the comparison:

> - **Telegram.** An ordinary Telegram chat, which is the kind an agent uses, is encrypted between
>   your device and Telegram's servers rather than end to end. Telegram's own FAQ says cloud chats
>   are "stored encrypted in the Telegram Cloud", and that "several court orders from different
>   jurisdictions are required to force us to give up any data." Its end-to-end kind, a Secret Chat,
>   is between two people on their phones and is not something an agent can use.
> - **Discord.** Discord end-to-end encrypts every voice and video call, and says so plainly. Text
>   is not covered, in its own words: "We have no current plans to extend E2EE to text messages."
> - **Matrix.** Matrix rooms can be end-to-end encrypted, and Archie cannot read one that is: the
>   connect guide asks for an unencrypted room, so this is the same trade, not a better one.
> - **iMessage on a Mac is the exception.** Apple already encrypts it end to end, and Archie reads
>   it out of the Messages app on your own computer rather than over the network.

Sources, both first-party and both checked 2026-09-11: <https://telegram.org/faq> and
<https://discord.com/blog/every-voice-and-video-call-on-discord-is-now-end-to-end-encrypted>.

**Why it's true.**

- **Sealed before it leaves.** AES-256-GCM, 96 bit nonce, version-tagged, both ends refusing a
  version they do not know: `crates/archie-core/src/phone.rs` (`seal`/`open`) and the phone's second
  implementation at `src/relay/envelope.ts` in the app repo. This is the same envelope the shipped
  phone-access claim above rests on, which is why this is one mechanism and not a new one.
- **The key never passes through us.** The desktop generates it, keeps it in the OS keychain, and
  delivers it in a **URL fragment**, which a browser does not transmit to a server (`phone::pair_url`,
  asserted by `the_pairing_key_rides_in_the_fragment_never_the_query`). It reaches the phone by
  camera and lands in the Keychain or the Keystore (`src/relay/pairing.ts`).
- **No sign-in, so no password of yours is on the phone.** The computer vouches for the phone with a
  ticket good once and for minutes, spent inside a transaction, compared in constant time, with one
  identical refusal for all five ways to fail (`stripe-webhook/phone-pair.js`).
- **A phone is allowed less than the owner's own browser.** The token carries `scope: "phone"`, and
  `notPhone()` in `firestore.rules` keeps it out of the user document, the purchase list and the
  credit ledger. This is the rare case where the app is stricter than the web page it replaces, and
  it is worth saying, because a phone is the device most likely to be lost.
- **The chat-app sentence is real.** `crates/archie-net/src/matrix.rs` states in its own header that
  the adapter is a plain client with no crypto store and cannot read `m.room.encrypted`, and it says
  so in the room itself (`ENCRYPTED_ROOM_NOTICE`). Telegram, Discord and Slack have no end-to-end
  option for a bot at all.

**Approved wording, what the app is and is not.** This is a capability claim, so it lives here too:

> The app is not running your agent. Nothing about your agent moves to your phone: it stays on the
> computer you installed it on, with your files, your passwords and your connected accounts, and it
> runs there whether your phone is in your hand, in your pocket, or flat. The app is a way to reach
> that computer and tell it things.
>
> What you can do from it is most of what you do at the computer: start it or stop it, add an add-on
> or take one off, finish an add-on's setup, turn a routine on and off or move the time it runs,
> rename it, change its face, read what it has been doing, and talk to it.

**Why it's true.** The phone can send exactly the instructions on a fixed list, and that list is the
`match op` arm of `dispatch_words` in `src-tauri/src/phone.rs`: ping, start, stop, install and remove
each of the four add-on kinds, build a skill, set the name, the face and an add-on's answers, turn a
skill or routine on and off, set a routine's time, add a row to a collection, say something, press a
button on a card, and browse this computer's catalog. There is no op for running code, reading a
file, or reaching a secret, and a phone cannot invent one: an unknown op is refused by the computer.
The snapshot it draws from is built by `build_snapshot` in the same file, whose header lists what
never travels: anybody else's conversation on a shared agent, knowledge files, the rows inside a
record collection, credential values (not even the last four of one), the screenshots a job took,
and the audio and pictures inside a conversation.

**What the phone app asks for on the phone, and the approved wording.** Added 2026-09-17, because
the App Store makes us write a purpose string for each one and a policy a reviewer can open, and
because a permission prompt is the one piece of this product a person reads before they trust it.
All three were checked against the client on that date.

> - **The camera**, for two things. It reads the square code that pairs the phone with your
>   computer, and it takes a photo when you choose to show one to an agent. It is not on at any
>   other time.
> - **Your photos**, only at the moment you pick one to send. The app is handed the picture you
>   chose and nothing else, and it never reads the rest of your library.
> - **The microphone**, only while you are recording something to say to an agent. You start that by
>   pressing the talk button, you can throw the recording away instead of sending it, and it stops
>   on its own if you leave the app.

**Why it's true**, all paths in `/Users/Games/Desktop/Code/archie-mobile`:

- **Camera.** `src/screens/Pair.tsx` mounts `CameraView` only while `scanning`, and
  `src/attach.ts` takes a photo through `ImagePicker.launchCameraAsync`, which is the system's own
  camera and not a preview this app holds open.
- **Photos.** `ImagePicker.launchImageLibraryAsync` in `src/attach.ts`. The picker is the system's;
  what comes back is the one asset, and the app has no library-wide read.
- **Microphone.** `startTalking` in `src/screens/Chat.tsx` runs on a press, `stopTalking(false)`
  throws the recording away, and the same function runs when the app stops being `active`, so
  leaving the app ends the recording rather than leaving it running.
- **A photo and a voice note ride the sealed mailbox like everything else**, as `put_file` through
  `run` in `src/attach.ts` and `src/voice.ts`, sealed by `seal` in `src/relay/envelope.ts`. So the
  custody clause below applies to them word for word: we hold them and cannot read them.
- **Nothing on the phone reports anything.** No analytics, crash or advertising dependency in
  `package.json`, and build 9's binary carries no `ASIdentifierManager` or `advertisingIdentifier`
  symbol, checked with `strings` on the shipped `.ipa`.

⚠️ **The purpose strings in the app say "and nowhere else", and that is the one wording here worth
arguing about.** `app.json` tells the phone owner a photo or a recording "is sent to the computer
running Archie and nowhere else." Read as naming the recipient it is true, and nobody but that
computer can open it. Read as naming the route it is not: the bytes cross our Firestore mailbox on
the way, sealed, and this document bans "it never touches our servers" for exactly that mechanism.
It is not an App Store problem and Apple will not reject it. It is ours. **Prefer "it goes to the
computer running Archie, sealed, and we cannot read it"** and change the strings the next time that
app is built for any other reason.

**Required clauses. Do not drop them:**

- ⚠️ **Future tense, everywhere, with no date.** "We are building", never "Archie has an app". The
  moment a present-tense sentence about this app appears on the site, this entry has been broken.
- ⚠️ **Say that we hold it.** Same clause as the shipped phone-access claim: this is custody without
  access. "It never touches our servers" is FALSE here and must never be written.
- ⚠️ **Name iMessage as the exception.** The comparison is true of Telegram, Discord, Slack and
  Matrix, and it is not true of iMessage, which Apple already encrypts end to end. Leaving iMessage
  out turns a checkable claim into an implied one, which is the failure the Standard's "we will not"
  list names directly. It also costs nothing: an honest exception is what makes a reader believe the
  other four.
- ⚠️ **Three fields stay in the clear**, exactly as on the shipped claim: when a message was left,
  which version of Archie wrote it, and whether a command is waiting, done or failed. We can see
  that a phone is talking to a computer, and roughly when, never what it said.
- ⚠️ **Whoever holds the phone holds the key.** Say what the remedy is in the same breath: unpair on
  the computer, which retires the key, so nothing sealed afterwards can be opened by that phone.
- ⚠️ **Say that the app is not running the agent, on any page that describes what it can do.** This is
  the expectation an app creates that the product cannot meet, and `docs/MOBILE-APP.md` section 7 is
  about exactly it: people assume a thing works because it is installed, and this one works because a
  computer somewhere is awake. Every page that shows the app doing something has to carry the
  computer in the same breath.
- ⚠️ **"Most of what you do at the computer", never "everything".** The op list is a short allowlist
  and the snapshot leaves things out on purpose. Name at least one thing it cannot reach whenever the
  capability is described, and never write "full control", "everything your agent can do", or
  "the whole app on your phone".

**Boundaries. Do not cross:**

- ❌ Never "we are more secure than Telegram" as a company-to-company claim. The comparison we are
  allowed to make is narrow and mechanical: a chat app holds your agent's messages in a form that
  company can open, and the app does not. Say the mechanism, not the league table.
- ❌ Never "the most secure way to reach an AI agent", or any superlative. We have not tested every
  product that exists and the claim is not checkable.
- ❌ Never "Telegram reads your messages" or "Discord reads your messages". The true and sourced
  claim is about what those companies **can** do and what their own documents say, and the stronger
  version is an accusation we cannot support.
- ❌ Never imply the app removes the chat app, or that a chat app becomes unsafe to use. Most people
  will keep using one, the agent still works there, and the app is a second door rather than a
  replacement for the first.
- ❌ Never "end-to-end encrypted, so nobody can ever see your agent", for the reason the shipped
  claim gives: the desktop is one end, the phone is the other, and somebody at that unlocked
  computer has everything.
- ❌ Not a compliance claim, and never near the CASA assessment. The app requests no Google scopes
  and holds no OAuth client, which is a fact about our engagement, not a security feature to sell.

### ✅ It works while you sleep

**Approved wording:** "It Works While You Sleep" / "works in the background while you sleep."
Used as a homepage proof chip and in the homepage meta description.

**Why it's true:** Routines fire on a schedule, unattended, and deliver their result to the
connected chat (`crates/archie-domain/src/routine.rs:405-434`); the default delivers to
whichever channel the agent is on (the enum variant's `NotifyTelegram` name is historical).
The agent genuinely runs and reports without the user present.

**⚠️ Scope guard — do not extend this into a Phase 2 claim.** "Works while you sleep" (background
execution) is true today. "Works while you sleep **and checks in for your approval before it
acts**" is NOT — that is the approval gate, which does not exist. The chip must stay a pure
capability claim. And note the honest tension: the unattended path is exactly where an ungated
agent is most exposed to prompt injection (see the gate section). The claim is true; the risk it
implies is the reason the gate is being built.

### ✅ Archie is free on an AI account of your own, with a limit of 20 jobs a day (SHIPPED 2026-09-17)

**Approved wording:** "Archie is free on an AI account of your own. Paste a key from an AI company
and the app opens: every skill, every routine, the mail watch, all of it. What free means is 20 jobs
a day. A job is one piece of work: a reply to you, a routine running, or an email it reacts to. The
count starts again at midnight. A plan takes the limit off and runs up to ten agents."

**Why it's true:** `require_access` in the Archie repo's
`src-tauri/src/commands/gateway_lifecycle.rs` has three doors, and the third is
`crate::auth::own_ai_key`: any AI key saved in a workspace this account owns. There is nothing for
Otian to fund behind that door, because every call goes to the company that issued the key and is
billed to the person who pasted it, so the app opens rather than a paywall. The limit is counted in
the gateway: `archie_domain::allowance` holds `FREE_JOBS_A_DAY = 20` and the arithmetic,
`archie_runtime::free_day` holds the day's tally in one small file beside the bundles, and
`take_a_job` in `gateway/turn.rs` takes one off the count at the single point every job passes
through. `GatewayConfig::free_day` is `None` for every paid account, so nothing is read or counted
for anybody who is paying.

**The last 5 of the 20 are the person's own.** Routines and the mail and text watches stop at 15
(`FREE_JOBS_KEPT_FOR_YOU`), so an agent cannot spend the day before its owner sits down, and the
owner is told once, in chat, on the day it happens. The first-run interview is exempt entirely:
setting Archie up does not cost a day.

**The boundaries:**
- ⛔ **Never call it a free plan, a free edition, or Archie Free.** It is not a product and it has
  no name: every edition is named for who it serves (`Archie`, `Archie for Business`), and a tier
  qualifier is banned outright. Say what it is: Archie, free, on an AI account of your own.
- ⛔ **Never say free means unlimited, and never publish the free tier without the number.** The
  limit is the whole difference between free and paid, so a page that offers one without the other
  is the trick this entry exists to prevent. The number goes in the same sentence. What a job *is*
  may be defined once per page rather than beside every mention of the number.
- ⛔ **The trial and the free tier are two offers, not two phases of one.** "14 days, then 20 jobs
  a day" is the sequence most people happen to walk, and writing it that way taught readers that
  the free tier is what a trial decays into. It is not: somebody who pastes a key on day one never
  takes the trial at all, and somebody whose computer has spent its credits never could. They differ
  in what they give (the whole app with nothing counted, against the whole app at 20 jobs a day),
  in how long they last (14 days or until the credits run out, against no end date), and in whose
  AI account pays (ours, against theirs), and that last one is what causes the other two. Say "or",
  never "then", and give each one its own block.
- ⛔ **Personal only. Archie for Business has no free tier.** `crate::auth::FREE_TIER_EXISTS` is
  `!IS_BUSINESS`, a compile-time constant, so the branch is not in the business binary at all and a
  business account with no plan meets the paywall exactly as it did before. The reason is who the
  edition is for: a business agent answers a whole team, so twenty jobs a day shared between five
  people is a working assistant for a small company rather than a trial of one, and anybody who
  wants to try Archie for nothing already has the personal edition. Any page that names the free
  tier near the business price has to say which edition it belongs to.
- ⛔ **Phone access is not on it.** Your phone reaches the computer through a mailbox on Otian's own
  server, which is the one thing here we pay for per message, so `firestore.rules`'s `entitled()`
  grants it to a plan and to a live trial and to nobody else. Copy that lists what free includes has
  to say so, and the app's own refusal says it with the button named (`crates/archie-core/src/phone.rs`).
- ⛔ **Never say a key is needed only for the free tier.** Every Archie needs an AI account, on a
  plan as much as free; the plan buys Archie, never the thinking. See "What you need" below.
- ✅ The trial still comes first and is still better: 14 days with nothing counted, on our credits or
  on a key of your own. The free tier is where you land afterwards instead of at a wall.
- ⛔ **It is a product limit, not a lock.** The tally is a small file on the owner's own computer and
  anybody willing to edit it can have more, exactly like the agent cap (`archie_core::plan` says so
  in as many words). Never describe it as enforcement, and never imply the app is defending itself
  against its owner.

### ✅ What your agent remembers about you, and what it lets go of (SHIPPED; entry written 2026-09-16)

**Approved wording:** "Your agent keeps a short list of what it has learned about you, and you can
read every line of it, add one, or delete one. It carries only what has come up lately; the rest is
kept in a file it can look back at when something you say touches it."

**Why it's true:** `crates/archie-runtime/src/memory.rs` holds two lanes in one small Markdown file,
budgeted apart. The "About you" lane stamps each fact with the month it last came up and, when the
lane is full, drops the oldest, which is a rule that can be said out loud: Archie lets go of what
you have not brought up in a long time. Since 2026-09-16 what it drops is written to an archive file
beside it rather than destroyed, and a fact comes back into a conversation when a word in what you
said matches it. The Memory panel on the agent's Knowledge tab shows every line with its month, has
a cross on each to delete it, a Clear all, and a box to add one by hand
(`agent_memory_add`, `agent_memory_remove`, `agent_memory_clear`).

**The boundaries:**
- ⛔ **Never say it remembers everything.** The carried lane is deliberately small, because it is
  read on every message and the owner pays for those tokens. The archive is the honest version of
  "nothing is thrown away", and it is searched by matching words, not by a model.
- ⛔ **Never say Otian AI can see it.** The file is in the agent's folder on the owner's own
  computer, like everything else in the bundle.
- ⛔ **Never describe the recall as the agent choosing to look something up.** There is no tool for
  it and no second AI call; it is word comparison against a file, which is exactly why it costs the
  owner nothing on the turns where nothing matches.

### ✅ What your agent can write to disk

**Approved wording:** "Your agent writes the actual file and tells you where it put it. It can
write eleven kinds: `.pdf`, `.pptx`, `.xlsx`, `.csv`, `.docx`, `.md`, `.txt`, `.json`, `.html`,
`.ics` and `.vcf`. It chooses the filename. It never chooses the folder."

**Why it's true:** `crates/archie-runtime/src/export.rs` holds an `ALLOWED` table of exactly those
eleven extensions, and the module comment states the design rule: the tool takes "the name, never
the location", files land in one folder the user was told about, and a copy is kept in their
Archie folder. Four of the eleven are converted rather than written through: `.xlsx` is built
from CSV the model wrote, and `.docx`, `.pdf` and `.pptx` from Markdown (`Made::Xlsx`, `Made::Docx`,
`Made::Pdf`, `Made::Pptx`).
One file is capped at 5 MB (`MAX_BYTES`).

**PDF, shipped 2026-09-16, is typeset in the app and sends nothing anywhere.** Worth stating because
"make me a PDF" is the one file people assume goes through a service. It does not: the document is
laid out in `export.rs` and written with `lopdf`, which is already in the build because Archie reads
PDFs. It uses the fonts every PDF reader already has, so nothing is downloaded, no font ships in the
app, and a report is a few kilobytes. Headings, bold, bullets and page breaks; the line breaks are
computed with the same character widths the reader itself uses, which is why text cannot run off the
page.

**Charts in a PDF, shipped 2026-09-16.** Approved wording: "Ask for a chart in a report and you get
a real one: bars, a line or a pie, drawn in the document." The agent writes a fenced ```chart block
holding a kind, a title and one `label, value` line each, and `export.rs` draws it with PDF's own
shapes, in the app's own colors. Drawn rather than pasted in: it stays sharp at any zoom, prints
properly, and adds nothing to the app's size. Two honest constraints are in the code and may be
described: a bar chart always has zero on it, because a bar's length is the value and a chart that
starts somewhere else draws a 1% difference as a bar twice the height of its neighbor; and a pie
refuses to draw a negative slice, listing the numbers instead. **Charts are a PDF thing.** A `.docx`
gets the figures written out rather than the picture, because Word takes a drawing as an image and
making one would mean shipping a font file to put labels on it. Do not say "charts in documents";
say PDF.

**Slide decks, shipped 2026-09-16.** Approved wording: "Ask for a deck and you get a real
PowerPoint file, not a PDF of slides: you can open it and change it." A heading starts a slide and
what follows is that slide's body, which is the Markdown the agent already writes for a document
read one level differently. `crates/archie-runtime/src/deck.rs` writes the package itself: a `.pptx`
is a ZIP of XML with a fixed shape, so nothing is sent anywhere and nothing new ships in the app.
**Say editable, because that is the whole point of the format**, and a deck somebody cannot change
is worth less than the notes it came from. **Verified by opening it**, not only by tests: Keynote
reads the file and renders every slide. Do not claim it has been opened in PowerPoint; that has not
been tested, and the two read the same format but are not the same reader.

**The stronger claim, and the reason the list is short.** `ALLOWED` is an allowlist and the
comment says it "must stay one", because a denylist of dangerous extensions is a losing game
against platforms that keep inventing new ones. Every kind on it is inert: opening one shows text
or a table, and none is executed by the OS on a double click. That is the claim worth making, and
it matters precisely because the text that reaches this tool has often passed through content we
did not write.

**Boundaries — do not overclaim:**
- ⛔ **Never claim video, and never claim the export tool writes pictures or audio.** The export
  tool writes none of the three. The agent does make pictures and audio by other paths:
  `generate_image` (`crates/archie-runtime/src/imagegen.rs`: a picture sent into the conversation,
  on the user's own provider key or a Gemini key saved for it, and the tool is not offered when
  neither exists) and voice notes (`crates/archie-runtime/src/speech.rs`: a spoken reply to a spoken
  message, or on request). **PDF shipped on 2026-09-16 and this bullet moved the same day**, which
  is the only reason the claim above may be made. Video would come through a connector and may not
  be described in the present tense until it ships, and neither of the two the agent does make has a
  ✅ entry of its own yet, so no page claims them until one is written with its clauses. Until
  2026-09-16 this line said Archie writes none of the four, and
  the homepage carried "No PDFs, pictures, audio or video" as a limitation on the strength of it;
  it was false on two of four and the chip was retired. The BetterClaw wishlist (item 7) proposed
  exactly that list and it would have been false on four of eight entries. Added here 2026-08-24
  so the next person checks the table instead of the brief.
- ⛔ **Never say the agent writes "into your folders"** or anywhere on your disk. It writes to one
  folder, and the location is not the model's to pick. The weaker-sounding claim is the true one
  and it is also the safer-sounding one, which is rare enough to be worth keeping.
- The nine are what the *export tool* writes. This row says nothing about what an add-on or a
  connected account may read, which is a separate question with its own answers.

### ✅ Add-ons are data, not code

**Approved wording:** "An add-on is a text file, not a program. A Skill is markdown plus
settings. It cannot run code on your computer, because Archie has nowhere to run it."

**Why it's true (reworded 2026-08-21):** No shell, no `dlopen`/`libloading`, no WASM, no JS
`eval` anywhere in `crates/` or `src-tauri/`. Process spawning does exist, and the old "no
`std::process::Command` anywhere" claim was flatly untrue: the crates spawn our own
hash-verified sidecars (ffmpeg, whisper, yt-dlp, the `imsg` tool), the screen lane's browser,
and the OS's device-id readers, each with an explicit argument list. What carries the claim is
that **no add-on text and no model output can ever name a program to run**: nothing parses
either into a command. Tauri capabilities are deny-by-default
(`src-tauri/gen/schemas/capabilities.json`) and expose no shell, fs, or http permission to
the webview.

---

### ✅ What you can connect, and where each one's traffic goes

Recorded 2026-09-01, when the works-with band went back on the homepage and the "Your connected
accounts" rows on `trust/` and `trust/details/` were found naming five services out of a roster
of forty-two. A list that stops at five, under a heading that invites the reader to catch us
out, is the same shape as the holdings-list incident under What We Hold.

**Approved wording (trust rows):** "Google, Microsoft, Telegram, Discord, Slack, Matrix, Todoist,
Fireflies, GoHighLevel, and any service you connected with a key of your own: directly." And for
the local lane: "Lights you added from your own wifi (Philips Hue, WiZ, LIFX): over that wifi,
and the request never leaves your network."

**Why it's true:**
- Chat apps: the five adapters in `crates/archie-net/src/{telegram,discord,slack,matrix,imessage}.rs`,
  every one outbound from the user's computer on the user's own tokens. Signal (`signal.rs`) is
  behind a non-default cargo feature for licence reasons (FACTS.md, "5 chat apps") and stays off
  the site until that is resolved.
- Mail and calendar: `crates/archie-net/src/mail/{google,microsoft}.rs` and
  `calendar/{google,microsoft}.rs`, OAuth tokens in the Keychain, requests straight to Google and
  Microsoft.
- Todoist, Fireflies, GoHighLevel: a pasted key each, `BuiltinIntegration` in
  `crates/archie-domain/src/builtins.rs` and `crates/archie-net/src/ghl.rs`.
- Every service connected with a key: `KNOWN_SERVICES` in `crates/archie-domain/src/connectors.rs`,
  twenty-one of them. A key is bound to one host (`ConnectorEntry`) and the runtime attaches it,
  never the model (`archie_net::http::send` drops runtime-owned headers).
- Lights on the user's own wifi: `crates/archie-domain/src/local_devices.rs` refuses any roster
  address that is not private, `crates/archie-net/src/local/{hue,wiz,lifx}.rs` speak only to those
  addresses, and the test `the_two_guards_never_overlap` (`local/mod.rs`) proves no address is
  reachable from both the local lane and the internet lane.

**Boundaries:**
- ❌ Never "never leaves your computer" for the lights. It leaves the computer and crosses the
  user's own wifi to the bulb or the bridge. The claim is that it never leaves the *network*.
- ❌ Never fold the LIFX cloud connector and the LIFX bulb on the wifi into one path. `lifx` in
  `KNOWN_SERVICES` goes to api.lifx.com on a key; a LIFX bulb added on the Home devices card is
  reached on the LAN. The band shows LIFX once and the privacy policy describes both.
- The Hue bridge talks to Philips on its own. That is the bridge's traffic, not Archie's, and no
  sentence may say Archie keeps it home.
- What the agent learns from a light (its name, on or off) goes to the AI provider like any other
  tool result. Say so wherever the local lane is described; the privacy policy does.

### ✅ Websites: the agent using a site itself, when there is no connector — SHIPPED 2026-08-18

**Recorded 2026-09-16**, a month after it shipped, because it had no entry here and the rule at the
top of `CLAUDE.md` is that a claim not in this file may not be made. The cost of that gap was not
silence on the site. It was that the people answering questions about Archie were telling prospects
the opposite, and filing a shipped capability as unbuilt work in benchmark and competitor notes. **A
capability with no row in this file reads to everyone downstream as one we do not have.**

**Approved wording:** "When there is no direct connection to a site, your agent can use the site
itself, the same way you would: it reads the page, it clicks, it types. It works in a browser window
on your own computer, and you can watch it. You sign in yourself, once, in that window. It never
types a password, a card number or a sign-in code, and where one of those is asked for it stops and
hands you the window. Before it presses anything that finalizes an order, a booking or an
application, it stops and asks you. You name the sites it may never open at all, and every job has a
time limit."

**It is off until the owner turns it on**, per agent. That clause travels with every description of
it: releasing it decided that the choice exists, not what anyone chose.

**Why it's true:** `crates/archie-runtime/src/screen/` in the Archie repo.
`SITES_AND_APPS_RELEASED` in `crates/archie-domain/src/screen.rs` is `true`, and so is its twin in
`src/app/vocab.ts`; a test fails if only one of them moves. The app calls it **Websites**, on the
Connections tab, since 2026-08-19, and that is the name copy uses.

- **It is a browser on the person's computer, not a hidden one.** `screen/browser.rs` launches
  Chrome, Edge or Brave headful and unfocused, never headless, in a profile of the agent's own
  (`--user-data-dir`, `--remote-debugging-port=0`). Signing in is the person's own doing:
  `open_for_sign_in` opens the window with no automation attached, so the agent never sees or stores
  the password, and the session then lasts.
- **A connector always wins.** The tier order in `screen/mod.rs` is explicit: where a direct
  connection exists it is used, and "the screen is never the cheap option."
- **The five stops are enforced in code, not in the prompt** (`screen/guard.rs`, whose own comment
  says why: "a prompt instruction is a suggestion, and this is the part where a suggestion is not
  enough").
  1. **The never-list.** Suffix match on the host, so `chase.com` also blocks `secure.chase.com`.
     Checked when a page is opened and again on every navigation event, so a redirect cannot slip
     past. A blocked host ends the job outright.
  2. **Passwords and card fields are never typed.** `typing_stop` refuses `type="password"`,
     `autocomplete="current-password"` and `new-password`, and anything `cc-*`, and hands the window
     to the person.
  3. **A finalizing press becomes a question.** `click_needs_approval` routes the click to
     `screen_ask` rather than pressing it, decided on the accessible name and role: `submit`, `pay`,
     `delete`, `transfer`, `publish`, `unsubscribe` and `purchase` on any element; `send`,
     `confirm`, `buy`, `book`, `approve`, `apply`, `post`, `order`, `checkout`, `subscribe` and
     `place` on a button; and phrases such as `place order`, `complete purchase`, `confirm payment`,
     `buy now`, `book now`, `cancel subscription`, `close account`, `delete account` and
     `sign contract` wherever they appear. It is deliberately biased toward asking, in the file's
     own words: "asking wrongly costs a notification, not asking wrongly costs a submitted claim."
  4. **A time cap per job**, on the wall clock, ten minutes by default and set in the panel. The
     failure shape of an agent that has lost the plot is a loop rather than a crash, so this is the
     backstop that matters most.
  5. **Two-factor is always a handover.** Every time, no code stored, no exceptions.
- **The prompt says it as well, whatever is installed.** `NEVER_LINE` in
  `crates/archie-runtime/src/gateway/prompt.rs` sits in every system prompt: the agent never makes
  phone calls, sends texts of its own, pays for anything, or presses a button that finalizes a
  purchase, booking or application.
- **What it learns stays with the person.** `screen/routes.rs` records the click path that worked as
  role and accessible name, never selectors and never coordinates, learned per person and never
  shipped inside an add-on. **Only clicks are recorded, never typing**, because typed values are
  often sensitive and a route file must never hold them.

**Required clauses — do not drop them:**
- ⚠️ **Say it is off until they turn it on.** Anything else describes a computer the reader does not
  have.
- ⚠️ **Say the window comes back to them.** Every stop above ends with the person holding the
  browser, and that is the actual claim. Not that the agent is careful: that the part which could
  hurt them is the part it hands back.
- ⚠️ **Two add-ons use it today**, Statement Collector and Form Filler (`required_screen` in the
  Archie repo's `data/marketplace/skills/`). Copy implying a shelf of them is describing next year.

**Boundaries — do not cross:**
- ❌ **Never say Archie buys, books, or checks out.** It cannot type a card number at all, and the
  press that finalizes an order comes back to the person as a question. This is the same claim as
  "Archie cannot spend your money", it is one of the strongest things this file holds, and a page
  selling the agent as completing a purchase breaks it.
- ❌ Never "it fills in the whole form". It fills what is not a password, a card or a code, and
  stops at the ones that are.
- ❌ Never describe it driving other **applications**. That half is not built on either platform.
  Websites are the whole of what ships.
- ❌ **Never put a cost figure on it, and never recommend it to someone choosing on price.** One
  page serialized to about 6,000 tokens in the only measurement that exists, a job is many reads,
  and the owner pays for every one on their own key. Nothing measures a whole job yet, so there is
  no number to publish (Archie repo, `docs/OPEN-THREADS.md`).
- ❌ Never imply it has been proven against every site. **Two of the three gaps this bullet named
  closed on 2026-09-16 and the wording had to change with them**, which is this file's own rule
  working in the direction people forget: a stale boundary makes us claim less than we can do. A
  cross-origin frame now reads, types and presses (`screen_live.rs`), and the tools a model calls
  now run against a shop on the open internet (`shop_live.rs`). What is still true: the Windows path
  runs in CI and has never been watched, and a signed-in errand at somebody's own shop is theirs to
  run, because signing in is a handover by design. The honest shape: the parts a person meets are
  tested against a real browser and against a real site, and the edges are known and written down.
- ⚠️ **Pointing it at a real shop found two defects, and saying so is allowed and better than not.**
  A dialog the page put up froze the whole job until the time cap (shops raise one on every add to
  basket), and a cookie banner over a button ate the press while the page read as unchanged. Both
  are fixed (`CdpPage::answer_dialogs`, `CdpPage::covered_by`). The claim this supports is not "it
  never breaks"; it is that the edges get found by pointing it at the real thing rather than at our
  own test page.

**Practice runs — SHIPPED 2026-09-16.** *Approved wording:* "Before your agent uses a site for
anything real, you can send it to look around. It reads and clicks its way through, types in the
search box and nowhere else, stays on that one site and finishes nothing, and writes down how the
site is laid out. Next time it uses that site, it already knows its way."

- **Why it's true:** `screen/tools.rs` (`JobState::practice`, set once on `screen_open` and not
  changeable mid-job), `screen/guard.rs` (`practice_typing_stop`: a search box is the only field
  that may be typed in), and `screen/notes.rs`, which caps the note at about 300 tokens and is read
  back on the call that opens that site and on no other.
- ❌ **Never say a practice run makes a site safe, or that it "tests" anything.** It is a look
  around. Every one of the five stops is what it always was on the real errand afterwards.
- ❌ Never say it is free. It is model calls like any other job, paid by the owner on their own key,
  and what it buys is that the first real errand is not also the first visit.
- ⚠️ It is started by a person pressing Practice on a saved site, or by the agent offering and being
  told yes. Nothing explores unasked, and that clause travels with the description.

**Flight check-in — SHIPPED 2026-09-16.** The one errand in this lane that is neither a purchase
nor a booking, which is exactly why it could be built when those could not.

*Approved wording:* "Check-in opens 24 hours before a flight and the good seats go in the first
hour. Your agent finds the flight in your own confirmation email, goes to the airline's site the day
before, identifies the booking with the confirmation code and your surname, takes a free seat, and
sends you the boarding pass. It buys nothing: not a seat, not a bag, not priority boarding. If
check-in cannot finish without paying, it stops and tells you what is being asked for."

- **Why it's true:** `data/marketplace/skills/flight-check-in.json` and
  `data/marketplace/routines/check-in-window.json` in the Archie repo, on the browser lane above,
  which is what enforces every sentence of it in code rather than in the skill's own words.
- ❌ **This does not soften the claim above it.** It checks in; it does not book, change or cancel
  anything, and it cannot type a card number. A page that lists this beside "books your travel" has
  broken the strongest claim in this file to advertise the weaker half of a feature.
- ⚠️ A confirmation code and a surname are not a password, which is why this works at all. Where an
  airline wants an account sign-in or sends a code, it hands the window over like everything else.
- ⚠️ **Untested against a real airline.** It runs on a lane that is now tested against a real site,
  and no airline has been checked into. Copy may say what it does and may not say it is proven.

**What this settles outside this file.** A benchmark or a comparison that scores Archie low on
purchasing and booking is scoring a decision, not a gap, and the answer is to say so rather than to
file the work: building it would break the claim above. The sites worth wanting are the ones with no
connector and no checkout, which is what the two shipped add-ons do.

### ✅ Waking the computer for a routine — SHIPPED 2026-09-16

**Approved wording:** "A routine set for seven in the morning arrives at seven, even if the computer
was asleep. Archie asks your Mac to wake a few minutes before, runs it, and lets it go back to
sleep. The screen stays off. Setting it up asks for your password once, because only an
administrator of a Mac may schedule a wake, and macOS asks for it in its own box: Archie never sees
what you type."

**Why it's true:** `archie_runtime::wake` works out which moments the computer has to be awake for,
and `crates/archie-wake` is the separate program that schedules them, run by launchd as root.

- **Root is not a choice we made.** Measured, not assumed: `IOPMSchedulePowerEvent` answers
  `kIOReturnNotPrivileged` to an ordinary application and `pmset schedule` answers "must be run as
  root". That is why there is a helper and why there is a password box, and the honest sentence says
  so rather than apologizing for it.
- **The helper does one thing.** It reads a list of numbers. There is no command in the file it
  reads, no path and nothing to interpret, and the worst thing anybody who can write that file can
  make it do is wake the computer. It tags every event it makes and cancels only events carrying
  that tag, so it can never clear somebody else's alarm.
- **It wakes and never powers on.** Somebody who shut their computer down has said what they want.
- **Without the helper there is still a fallback**, and it needs nobody's permission: Archie holds
  the machine awake in the last few minutes before an appointment (the same assertion `caffeinate`
  takes). That covers a Mac with its lid open and nothing else, which is why it is the fallback.
- **An appointment earns a wake; a rate never does.** A routine set for a time of day wakes the
  machine. A routine set to run every fifteen minutes does not, because waking a sleeping laptop
  ninety-six times a night to keep a polling loop on cadence serves nobody.

**Boundaries — do not cross:**
- ❌ **Never say Archie works while the computer is off.** It wakes a sleeping computer. A computer
  that is shut down stays shut down, deliberately.
- ❌ Never promise it on Windows. There is no lane there yet.
- ❌ Never say "no password needed". One password, once, at setup, and the sentence that says so is
  the one that keeps the rest of it credible.
- ⚠️ **Not yet watched overnight on a real machine.** Everything up to the system call is tested;
  the call itself needs root. Until somebody has run it through a night, copy may describe what it
  does and may not call it proven.

### ✅ Reminders, and the one that stands down if the person writes back — SHIPPED (conditions 2026-09-17)

Reminders themselves have been in Archie since well before this entry. It is written now because
nothing in this file said so, which under our own rule means nobody selling could say it either.

**Approved wording:** "Tell it to remind you at a time and it does, in your own words, at that
minute. It does not need you to be in a conversation and it does not ask an AI anything to read
your own sentence back to you. You can also make one conditional: \"remind me Thursday to chase the
quote unless Ellen has replied\". If Ellen emails or texts in first, the reminder is dropped and
Archie tells you it did."

**Why it's true:** `crates/archie-runtime/src/reminders.rs` is the store and the clock;
`crates/archie-runtime/src/gateway/tools_reminders.rs` is the tool the model calls; the condition is
`UnlessHeardFrom` on a reminder, offered to every inbound email and text by
`crates/archie-runtime/src/email/watches.rs` (`stand_down_reminders`).

- **No AI call at delivery.** The text is the owner's sentence, kept and read back verbatim. A
  reminder is one row in a small file and one task watching the clock, so the count of them costs
  nothing per month.
- **No AI call to notice an answer either.** The condition is matched against mail the agent is
  already watching, by the same rule the mail watches use. Noticing costs one read of a small file.
- **It survives a shut laptop.** A reminder whose minute passed while the machine was asleep
  arrives when it comes back and says what time it was meant for. Past a week it is dropped rather
  than delivered, and the drop is logged.
- **Quiet hours do not hold one.** That is deliberate: the minute was named by the person being
  interrupted.
- **The condition is visible before the day comes.** It is printed beside the reminder on the work
  board and in the list, because one that stands down leaves the list the moment the answer arrives.

**Boundaries — do not cross:**
- ❌ **Never say the condition understands what the reply said.** It notices that the named person
  wrote, not that they answered the question. A note about something else from the same person
  drops the reminder.
- ❌ **Never say the match is exact.** A name matches as a whole word, an address matches exactly,
  and the loose half is on purpose (see the mail-watch reasoning). Copy may say "if Ellen writes
  in", never "if Ellen replies to that email": no thread is being followed, because Archie does not
  send the email in the first place.
- ❌ **Never say a reminder can repeat.** One is a single moment. Something that happens every week
  is a routine, and the agent offers to build one when it sees the same reminder asked for a third
  time.
- ⚠️ **The condition needs a mailbox or the Mac text watch.** With neither connected nothing can
  notice an answer, and the reminder simply arrives at its time. The agent says so when it is set,
  and copy must not imply otherwise.
- ⚠️ **Not yet watched on a real mailbox.** The join is tested both halves and end to end in unit
  tests; nobody has set a conditional reminder and had a real person answer it. Copy may describe
  what it does and may not call it proven.

### ✅ Finding places on the map — SHIPPED 2026-09-16

**Approved wording:** "Ask for somewhere to eat near the office that is open at eight, and your
agent looks it up on the map: the name, the street, how far it is, the phone number, and the hours
for that day. It says what it checked and what it did not."

**Why it's true:** `crates/archie-runtime/src/places.rs` (the `places_search` tool) on
`crates/archie-runtime/src/maps.rs`, which is the same map connection the drive check already uses.

- **No second sign-up.** It runs on the map key an owner has already connected for "when should I
  leave", which is free and has no credit card behind it. An agent without that connection never
  sees the tool at all, rather than offering it and failing.
- **Nothing there has an account behind it.** The key buys lookups: no history, no saved places, and
  nothing of the owner's for it to read.
- **It has no opinion, and says so.** The map carries no ratings and no prices, so the reply carries
  neither, and every reply tells the model to say that rather than answer from memory. That
  boundary is the point of the feature: an invented four stars reads exactly like a checked fact.

**Boundaries — do not cross:**
- ❌ **Never say Archie recommends the best restaurant, or knows what is good.** It knows what is
  near, what it is called and whether the door is open.
- ❌ Never imply prices or ratings. Not "cheap eats", not "highly rated".
- ⚠️ Hours are the map's, and the map is sometimes out of date. The phone number ships in every
  reply for exactly that reason, and copy should not promise the hours are right.

### ✅ Mail and calendar from iCloud and five other providers, on an app password (SHIPS IN 0.2.2)

Built 2026-09-01: `crates/archie-net/src/mail/imap.rs` (IMAP over TLS on 993, SMTP with STARTTLS
on 587) and `crates/archie-net/src/calendar/caldav.rs`, behind the same `MailProvider` and
`CalendarProvider` traits Google and Microsoft use, so every rule already verified for Google mail
holds here without a new code path: the send gate, the calendar confirmation, the poller's
filters, the starter-credits refusal. Connected through `imap_connect` in
`src-tauri/src/commands/integrations.rs`. **Not in a shipped build until Archie 0.2.2.** The copy
describing it (the privacy policy section, the six names in the trust rows, the six marks on the
band, the equipment questionnaire's option, two paragraphs on help/) sits in the site commit dated
2026-09-01 and must not go live before that release.

**Approved wording:** "You make an app password on the provider's own website and paste it once.
Archie keeps it in your operating system's Keychain and sends it to that provider's own mail and
calendar servers, directly from this computer, every time it opens the mailbox; it goes nowhere
else." And: "What the account can do is what the connect step could prove: it signs in to the
incoming mail server, tries the outgoing one, and looks for the calendar where the provider
publishes one."

**Why it's true:**
- The password is stored with `create_credential(... Generic ...)` and referenced from the
  account's `token_credential_ref`; `crates/archie-runtime/src/accounts.rs` hands it back as the
  secret for `MailProviderId::Imap`. It is sent as the IMAP LOGIN and SMTP AUTH secret and as
  Basic auth to the CalDAV host, and to nothing else.
- Hosts are fixed per service in `KNOWN_SERVICES` (`imap.rs`): imap.mail.me.com,
  smtp.mail.me.com and caldav.icloud.com for iCloud, and the equivalents for Fastmail, Yahoo, AOL,
  Zoho and GMX. There is no field for a host of the user's own.
- An IMAP account's `scopes` are what connect PROVED (`imap:read`, `imap:file`, `smtp:send`,
  `caldav:read`, `caldav:write`), and `capabilities_of` reads them, so the app never assumes send
  or calendar.
- AOL and GMX have `caldav_root: None`: no calendar is looked for or claimed.

**Boundaries:**
- ❌ Never "sign in with Apple", or any OAuth phrasing. There is no OAuth for these; the app
  password is the whole mechanism.
- ❌ Never "your password never leaves your computer". It is sent to the provider on every
  connection, exactly like the API key. The custody claim is Keychain storage plus "to the
  provider's own servers and nowhere else".
- ❌ Never promise a calendar for AOL or GMX, and never promise one for the other four
  unconditionally: it exists only if discovery found one at connect.
- Untested against a live account as of 2026-09-01 (Archie's docs/OPEN-THREADS.md lists the four
  assumptions). The copy describes what the code does; the first live connect is what settles
  whether every provider behaves as documented.

### ✅ What it structurally cannot do: the answer to "is this the AI that ends the world"

Verified against `Archie@main` on 2026-09-09. This is the fear a beta tester arrived with on a
recorded call, in as many words, after a podcast about a swarm of bots going rogue. It is not the
privacy question and the privacy answers do not touch it, so it gets a claim of its own.

**Approved wording (positioning):** "The stories people are frightened by are about many AI
programs talking to each other with nobody in the middle. Archie is one agent, and the only
conversation it is in is the one with you. It is not awake between messages: it runs when you write
to it, when a clock reaches a time you set, or when it checks a mailbox you connected, and nothing
runs in between. It cannot run a program on your computer. It cannot call, text, spend, or press a
button that finishes something, on a website or anywhere else; drafts wait for your Send. And you
can quit the app, because there is nowhere else it is running."

**Why it's true, item by item:**

| Claim | What makes it true |
| --- | --- |
| One agent, no agent-to-agent conversation | Delegation to a specialist is offered only when the current target is not itself a specialist, so a helper cannot hand the job on: `crates/archie-runtime/src/gateway/tools_specialist.rs`. There is no channel between agents, and a specialist's run returns text to the agent that called it |
| Not awake in between | Three wake sources and no others: an inbound message, a routine's clock, and the mail poller. Nothing schedules the model to think on its own |
| No program execution on the owner's machine | There is no shell tool and no code-execution tool on the belt. Programmatic tool calling exists (`gateway/programmatic.rs`), runs **Archie's own read tools inside the provider's container** rather than anything on the owner's computer, and is off unless `ARCHIE_PROGRAMMATIC_TOOLS` is set, which is not a setting any owner can reach |
| No calls, texts, purchases, or finalizing presses | `NEVER_LINE` in `gateway/prompt.rs` is in every system prompt whatever is installed; on a website `screen/guard.rs` refuses submit, pay, buy, book, order, sign up, subscribe, delete and cancel by accessible name and role, biased toward asking |
| No locks, thermostats or cameras | `crates/archie-runtime/src/local_devices.rs`: the device list the owner built by hand is the fence, and lights and plugs are the whole of what may enter |
| Nothing else on the owner's network | The SSRF guard refuses private, loopback and CGNAT addresses on the model's own lane |
| The switch is the owner's | Start and Stop per agent, and the app quits. It answers only while the computer is awake, Archie is open and the agent is started |

**Where it already ships:** the guide `what-it-will-not-do` in the Archie binary
(`archie_domain::builtins::builtin_resources`), linked from the first screen of the first run, on
the same line as the sentence that says it can be asked for almost anything.

**Boundaries, do not cross:**
- ❌ Never "Archie is safe" or "it cannot do harm". Every item above is a limit on **actions**. It
  says nothing about whether the AI is right, and being wrong in a draft somebody sends is the
  realistic harm in this product.
- ❌ Never let this imply the gate stops prompt injection. It does not, and the Known Weaknesses
  section says so. The honest relationship is the other way round: these walls are what make an
  injected instruction survivable, because the worst a talked-into agent can reach is a draft
  somebody has to press Send on.
- ❌ Never "it has no internet access". It searches the web, fetches pages, and with Websites on
  it drives a browser. The limit is what it may finish, not what it may read.
- ❌ Never claim anything about the AI model's own training, alignment or safety work. We do not
  train a model and have no standing to speak for Anthropic, OpenAI or anyone else.
- ❌ Never say "one agent" in a way that denies specialists exist. They do, an owner installs them,
  and one runs when the agent hands it a job. The true strong form is that a helper cannot hand
  the job on again and cannot start anything of its own.
- ❌ Never use a competitor's incident as the contrast without naming and sourcing it.

**Positioning note:** this belongs where the unbounded promise is made, not on a page by itself. The
sentence that starts the worry is "it can do almost anything you ask", so the edge is worth naming
in the same breath rather than three screens later. It is also the honest form of the OpenClaw
comparison already in Archie's `docs/EXPECTATIONS.md` ask 11: the same shape, minus the two things
that made that one dangerous.


### ✅ This website, and what it asks your browser for (added 2026-09-16)

**Why this is here at all.** Every other claim in this file is about the app. `trust/proof/`
prints the website's own network behaviour out of the reader's browser, live, which makes the
website a thing the site makes claims about. So the claims go in this file like any other, and
they get a pointer like any other.

**Approved wording:** "This site runs no analytics, no tag manager, no session recorder and no
ad pixel. It never has. What it does ask your browser for, besides its own files, is the
typeface from Google Fonts and Firebase's sign-in code, which the account menu in the top bar
runs. Those see your address the way any host sees the address of whoever asks it for a file.
The site is served by GitHub Pages, so GitHub sees the request for the page itself, for the
same reason."

**Why it's true:** no page carries an external `<script src>` at all, and the only
cross-origin things any page pulls are the Google Fonts stylesheet and font files, the
Firebase SDK modules from `www.gstatic.com` (imported by `js/account-nav.js`, `js/marketplace.js`,
`js/phone.js`, `js/submit.js`), and `apis.google.com` on a sign-in press. The only outbound
`fetch` to somewhere that is not Firebase or our own billing service is the contact form's
`https://formspree.io/f/...` in `js/contact.js`. There is no `sendBeacon`, no tracking pixel and
no `gtag` anywhere in the repo. The ceiling under all of it is the Content-Security-Policy that
`scripts/gen-csp.py` writes into every page: `connect-src` is an allowlist of four origins, so a
script that tried to send anything anywhere else would be stopped by the browser rather than by
our intentions.

**Boundaries — do not overclaim:**
- ⛔ Never "we do not track you" as an unscoped sentence. Three third parties receive a request
  and therefore an IP address, and one of them is Google twice. Name them, as the approved
  wording does.
- ⛔ Never say the site "makes no third-party requests". It makes four kinds, listed above.
- ⚠️ The honest strong form is about **what we collect**, not about what nobody can see: we run
  no measurement of any kind on this site, and the hosts that see a request see it because they
  are serving a file.
- ⚠️ If a font is ever self-hosted or an analytics tool is ever added, this section is wrong the
  same day, and `trust/proof/` will show it before anyone edits this file: the request list there
  is read from the browser's own record, not from a list we maintain. That is the point of
  building it that way and it is also a standing commitment: do not replace it with a list.

### ✅ The claims a reader can run in a browser: `trust/proof/` (added 2026-09-16)

**What the page is.** Four claims from this file, running as instruments rather than sentences:
the activity record's hash chain (real SHA-256 through WebCrypto, over the canonical bytes
`AuditEvent::canonical_bytes` defines, with the `shasum` command that reproduces the number
printed beside it), the phone mailbox's seal (the `seal`/`open` pair out of `js/phone.js`, which
is matched to `crates/archie-core/src/phone.rs` by the `opens_an_envelope_sealed_by_the_browser`
test vector), the page's own request list and CSP, and the pairing key in the URL fragment.

**The rule that makes it worth having, and the one to enforce in review:** every verdict on that
page is computed from the real result. Nothing is scripted, nothing is a recording, and no
instrument has a branch that decides to succeed. An instrument that cannot fail is a picture of
a check, and a picture of a check on a page called proof is worse than no page at all. If a
future edit makes one of them unable to report failure, the page has to come down.

**No new claims.** The page states no privacy claim that is not already in this file in approved
wording. What it adds is the reader's ability to test four of them. It also states its own
limits in the same pass: these show the mechanisms, not the app's behaviour on somebody's
computer (the ten-minute network-monitor check remains the answer to that, and the page ends by
sending the reader to it), and nobody outside the company has audited any of it.

### ✅ The crisis floor, and why it is published (added 2026-09-17)

**Approved wording:** "If you tell your agent you are thinking about hurting yourself, about ending
your life, or that someone is putting you in danger, it stops being the character you gave it. It
says plainly that this is bigger than anything it can help you with, and it names where to get help
now: in the US, call or text 988, and anywhere else your local crisis line, your emergency number,
or your doctor. Every personality carries it and none of them can override it."

**Why it's true:** `build_system_prompt` in `crates/archie-runtime/src/gateway/prompt.rs` writes
three floors into every agent's system prompt under the line "no persona overrides any of them",
and the second is this one, naming 988 and local crisis lines in the words above. **The mechanism
is the base prompt, not a per-personality check**: a personality is text added beside the floors,
never a replacement for them, so there is no way for one to omit it. Until 2026-08-13 it worked the
other way, living inside five personality files and nowhere else, so every other personality
shipped with no such instruction; that is the history the claim rests on and the reason the
architecture matters more than a test would. **Do not put a personality count in this claim.**
`data/marketplace/personalities/` holds 38 manifests and FACTS.md registers 36 public ones, and a
safety claim is the wrong place to carry a figure that moves. The test
`every_agent_carries_the_crisis_floor_whatever_its_persona` pins the part architecture cannot: that
the rule survives a persona written to stay in character and be terse, and that it reaches a
general agent, a routed skill and a specialist alike. It is prompt text rather than a filter, which
is the honest description and the one the boundaries below depend on.

**Why it is on the site at all.** California SB 243 took effect on January 1, 2026 and requires an
operator of a companion chatbot to institute and publish details of its harm prevention measures
and safety protocols on its website. Whether Archie is a "companion chatbot" under §22601(b) is
arguable in both directions: it has anthropomorphic features and sustains a relationship across
sessions, which the definition names, and it is a work assistant rather than something built to
meet a social need, which the definition also requires. The statute carries a private right of
action at $1,000 a violation plus fees, so publishing a thing we already do was cheaper than
winning the argument. Published on `trust/` on 2026-09-17.

**Boundaries — do not overclaim:**
- ⛔ Never call it monitoring, a safety net, or anything implying somebody is watching. Nobody
  at Otian AI sees the conversation, no alert is raised and nothing is reported. A sentence
  implying otherwise contradicts every other claim in this file.
- ⛔ Never say the agent will catch it. It is a language model reading text and it can miss a
  person who does not say it plainly.
- ⛔ Never say Archie offers crisis support, counseling or help. What it does is stop, say it
  cannot be the one to help, and name who can. That is the entire claim.
- ⚠️ The refusal to *produce* self-harm content belongs to the AI provider's own safety
  layer, not to us. Do not claim it as Archie's.
- ⚠️ If the floor is ever moved out of `prompt.rs`, or a personality is allowed to
  override it, the Trust page section is wrong the same day.

## What We Hold — state the whole list, always

**The account core:** "Our servers know your email address and whether you have a current plan.
Not your prompts, not your files, not your calendar, not a single conversation. We keep no
per-person record of the add-ons you install."

*(Updated 2026-07-26: was "whether your subscription is active" — false since the one-time
license shipped. Ownership is the `lifetime` tier, checked with no subscription lookup.)*

**Why:** Firebase Auth + the Firestore user doc hold email, uid, `access_tiers`,
`subscription_status`, `stripe_customer_id`, and the licence-era fields
(`crates/archie-core/src/auth.rs:549-640`, the account parsing). There is no per-person
add-on record: every add-on is included with Archie and nothing starts an item checkout, so the
Stripe webhook's per-item purchase writer (`stripe-webhook/index.js` →
`users/{uid}/purchases/{item_id}`) has nothing to write (see "No add-on is sold" above).

**Amended 2026-08-21: the core is not the whole holdings, and this file must carry the whole
list even where a page carries the short form.** The backend's own collections also hold, where
they apply: the version heartbeat (version, platform, edition, last seen), opt-in crash tails,
the trial-credit ledger and its spend history (token counts and amounts, with salted device and
IP hashes; never message content), second-factor records, guided-session invoices,
refused-checkout records (uid, country, amount), and sealed phone messages we cannot open plus
their plaintext timestamps and statuses. A page may summarize; the summary must say it is one
("about your account", "and the operational records on the trust page"), and the subpoena
sentence in the custodian claim must never use the short form, because that is the sentence
whose whole job is completeness.

**Amended 2026-08-25: `trust/#what-we-hold` is the canonical home, and the page now says so.**
Two lists were in circulation and they disagreed. The longer one was right, re-verified against
`stripe-webhook/index.js` in this pass rather than taken from the 08-21 entry above: `mfa_totp`
(encrypted TOTP secret) and `mfa_codes` (hashed code, expiry, attempt count) at `:3002` and
`:2627`; `users/{uid}/sessions` invoices at `:3399` and `:3431`; `refused_regions/{sessionId}`
with uid, country, mode and amount at `:1454`; and the trial ledger at `credits/{uid}` plus
`trial_devices/{deviceHash}` and `trial_meta/{day}/ips/{ipHash}` at `:917-993`, whose hashes are
`sha256(TRIAL_HASH_SALT:value)` truncated to 32 chars (`trialHash`, `:837`). Salted, so the
approved wording may say the stamp cannot be read back, only compared.

Three consequences, all live:

1. **The trust page carries the whole list and declares itself the home of it.** Nothing else on
   the site may claim completeness. The two items that were understated are now stated: the
   ledger's device and IP stamps, and the three unsealed fields on a phone message. That second
   one was already a required clause in the phone-access section and had never reached the
   holdings list, which is how a required clause dies.
2. **Every summary elsewhere links here.** `index.html`, `archie/business/` and `trust/it-review/`
   already did; `archie/`, `archie/install/` and `privacy-policy/` now do. The privacy policy's
   "three things always, two more where they apply" claimed completeness for the whole of our
   custody while scoped to what the *app* sends, so it now says which half it is describing, and
   names this page as the one we maintain if the two ever drift.
3. **"The three things we hold" is dead on `trust/` too.** It survived in the acquisition
   limit, one screen below a list of eight, binding a buyer to a chosen few. It now binds them
   to the list. Anywhere a count appears in front of this list, the count is the bug.

✅ **Resolved 2026-07-15.** The old falsehood ("the only thing our servers know is whether
your subscription is active") has been removed everywhere and replaced with the list
wording above, live on the homepage, `archie/`, `archie/install/`, `faq/`, `archie/business/`,
`privacy-policy/`, and `trust/` (cited by page rather than line since 2026-08-21: the pages
were rebuilt and every line number had rotted). **Do not let the shorter,
false form return**: "email + plan status" is the floor; never fewer.

✅ **Amended 2026-08-06: three became three plus two.** Both of the things this section warned
about arrived, and the old sentence survived both of them for a while, which is exactly the failure
mode it names below.

- **Phone access shipped.** The sealed mailbox between somebody's computer and their phone is a
  fourth item in our custody. We have no key to it, and we **hold** it.
- **Crash reporting and version heartbeats shipped** (`crates/archie-core/src/telemetry.rs`). A
  record keyed to the account ID, carrying the app version, the platform and a last-seen time, is a
  fifth. See the telemetry claim above, which was corrected the same day.

**Approved wording**, now live on the five pages listed above:

> Our servers hold your email address and whether you have a current plan. Two more only where
> they apply: which version of Archie you are running, so we
> know what is still out there before we ever switch one off, and, if you turn on phone access, the
> messages between your computer and your phone, sealed with a key we never receive.

✅ **Amended 2026-09-03: the account record gained the Terms acceptance.** The app's sign-in doors
now sit under "By continuing, you agree to the Terms of Service and Privacy Policy", the shell
records the Terms version it showed (`archie_core::auth::TERMS_VERSION`, the page's "Last updated"
date), and the billing service writes `terms: {version, accepted_at_ms}` on the user document the
first time an entitlement fetch carries a version the account has not agreed to
(`stripe-webhook/index.js`, the `/entitlement` route). One more row in What We Hold, on the trust
page and in the privacy policy, the same day. Sessions signed in before this build sent nothing and
have nothing recorded; the row says "when you signed in", which is true of them too because there
is no record. `TERMS_VERSION` must move whenever the Terms page's date does, or the record names a
version that no longer exists.

**"Three things" is retired as a phrase.** It was a floor claim, not a slogan, and it has been
breached twice; anybody reaching for its punchiness is reaching for a sentence that has already been
false once. The list is the claim.

✅ **Amended 2026-08-07: the trial proxy was never disclosed at all, and the list grew a
switch.** Two things, found while adding the telemetry opt-out.

- **The free trial passes prompts through our server, and the site had never said so.** Not on
  the trust page, not in the privacy policy, not in the terms. The app has said it on screen
  since the trial shipped and `llm.rs:44-55` states it in the code, so this was a site-side
  omission on the one page whose entire argument is that no server of ours is in that path.
  Now on `trust/index.html` (a paragraph in the opening section and a row of its own in the
  table), `privacy-policy/index.html` (a paragraph under Your AI provider, cross-linked from
  What stays on your computer), `terms-of-service/index.html` (a Free Credits section, since
  it is also a commercial term), `faq/index.html` and `archie/business/index.html`.
- **Telemetry can be switched off**, and the two rows in the table say so. See the claim above.

✅ **Amended 2026-08-07 (second pass): how a free trial is given out, and the second kind of
trial.** Found in a security review of the paywall. Two new facts, both commercial rather than
privacy, and both absent from the Terms.

- **The free credits have conditions, and the Terms described none of them.** They read as
  something every copy of Archie comes with. They are given per account, need a confirmed email
  address, are limited per computer, and can be refused. Every one of those is enforced in
  `stripe-webhook/index.js` (`trialIdentityRefusal`, `TRIAL_GRANTS_PER_DEVICE`,
  `TRIAL_GRANTS_PER_IP_PER_DAY`, `TRIAL_GRANTS_PER_DAY`). A person who is refused one has been
  told nothing about why by the Terms, which is the gap.
- **There is a second trial, and the site does not mention it exists.** Fourteen days on an AI
  account of your own, offered when the credits have already been claimed on that computer.
  See the claim below, which is the one with a privacy consequence.

**Do not name the numbers.** The caps are deliberately unnamed on screen (the refusal says
"claimed here" rather than which limit was hit, so that somebody probing is not told which knob
to turn) and the Terms should match: say that it is limited, say that it can be refused, and do
not publish the figures.

Also corrected the same day: `trust/index.html` opened by telling the reader "Archie uses
Claude" in the hero and again in the section heading, on a product that connects to five AI
companies of the reader's choosing. Three pages named four providers or two.

**Do not ship a feature and the old sentence in the same release.** Shipping them together is the
exact shape of the 2026-07-15 falsehood: a true sentence that a new feature quietly made false. It
happened again on 2026-07-31 and again when telemetry landed, so this is a pattern, not an accident.
Before shipping anything that writes to Firestore, come back here first.

---

## ⛔ Claims That Are FALSE Today — must not ship

### ✅ One agent, many add-ons: what a scope or breadth claim may say

**Added 2026-08-31, because the homepage began making a breadth claim and no row governed one.**
Every other row here governs what we may say about *custody*. This one governs what we may say
about *how much of a life* Archie covers, which is the claim the coverage grid on `index.html`
makes and the claim Jack has asked for three times.

**Approved wordings:**
- "One agent, not one app per job."
- "Not just the work half."
- Naming domains by enumeration: "the inbox, the bills, the prescriptions, the birthdays", or any
  other list whose every item is a **shipped add-on named exactly as its manifest names it**.
- "148 add-ons, and they all run on the one agent." (The count is FACTS.md's, re-counted by
  `scripts/check-facts.py` against the Archie repo on every commit. **Read the number off
  FACTS.md, never off this line.** It said 151 from 2026-08-31 until 2026-09-15, which is a
  governing document holding a stale figure as approved wording: check-facts would have caught
  a page that copied it, but the whole point of this file is that nobody should have to be
  caught. Same rule as the provider roster above: the site's number is re-counted from the
  source, not from another page, and this file is another page.)

**Why it is true:** add-ons are data, not code (see the row above), loaded by the one agent rather
than installed as separate programs, so breadth is a property of the catalog and not a claim about
the binary. The catalog is `/Users/Games/Desktop/Code/Archie/data/marketplace/**`, which is the
same tree check-facts.py counts, so any enumeration is checkable by a reader and by a script.

**Boundaries, and these are the point of the row:**
- ⛔ **Never "everything", "anything", "your whole life", or "no ceiling."** Unfalsifiable, and
  false: `compare/building-it-yourself/` already tells readers, correctly, that add-ons being
  instructions rather than code *is* a ceiling. A breadth claim that contradicts our own comparison
  page is worse than no breadth claim.
- ⛔ **Never a count of domains, and never a count of "personal" add-ons.** Enumerating is the
  claim; summarising the enumeration is the overclaim, and a domain count is a number nobody
  measured.
- ⛔ **Never name an add-on that is not in the catalog, and never rename one.** A grid that prints a
  name a reader cannot find is the fastest way to lose the argument the grid exists to win.
- ⚠️ **The blanks are load-bearing.** Any enumeration ships beside the things we do not cover, in
  the same element. A list without holes reads as marketing; that is why `index.html` carries three
  empty rows under the fourteen full ones.
- ⚠️ **Breadth has a published cost and it must not be hidden.** `archie/pricing/` measures it: "A
  dozen add-ons with their routines left on fires about 320 times a month: eight every morning,
  three every week, one before every meeting. About a third of the bill, before anybody typed
  anything." Any page inviting a reader to add many add-ons carries that ceiling or links to it.
- ⛔ **Never lean a breadth claim on the connectors band.** Eight of those brands have never met a
  live key. Recognition is not capability.

### ✅ Calendar changes require your confirmation — SHIPPED, enforced in code (was ⛔ until 2026-07-20)

**Approved wording:** "When your agent wants to change a calendar you've connected — create,
move, or delete an event — it proposes the exact change and applies it only after you approve
it in a later message. Unattended routines can't apply calendar changes at all — they report
what they would make instead of making it."

**Why it's true:** every calendar write is staged, never executed, on the turn that proposes
it (`crates/archie-runtime/src/gateway/tools_calendar.rs:432-548`, staging and verbatim apply).
The apply/discard tools are only added to the tool set on a turn
where a proposal is already pending, so the model *cannot* apply a change in the same message
that proposed it (`tools_calendar.rs:311-327`; the prior-turn snapshot rule in
`gateway/turn.rs:907-919` and `1333-1340`).
`calendar_apply_pending_change` applies the staged change verbatim and nothing else.
The unattended routine path returns
`blocked_needs_user_confirmation` (`tools_calendar.rs:488-494`) — the 3am-delete exploit chain
this file used to document is closed. Guarded by test (`tools_calendar.rs:691`). *(Pointers
refreshed 2026-08-21 after the gateway split; the behavior re-verified unchanged.)*

**Amended 2026-08-16: the proposal carries buttons, and a tap counts as your later message.**
Approved wording: "the proposal arrives with Confirm, Change something, and Cancel buttons; a
tap sends the words on your behalf, so tap or typed, the approval is still a separate, later
message from you." Why it's true: a decision button is a **synthetic user message**, not a new
execution path; tapping Confirm delivers "Yes, go ahead and apply the ... you proposed" through
the same chat route and the same approval gate (`crates/archie-runtime/src/decide.rs`, module
doc and `approval_choices`; buttons attach automatically when a turn ends with a staged write).
The module doc states the invariant plainly: a button that applied a change directly would
delete the two-turn property, and a button that sends "yes" preserves it exactly. Do not write
"the button applies the change"; the button answers, the model applies.

**Boundaries — do not overclaim:**
- The code enforces the **two-turn shape**: no same-turn apply, verbatim change only, no
  unattended writes. It does **not** semantically verify that your later message was a "yes" —
  the model judges that. Never write "the app checks that you said yes."
- Reads (`calendar_list_events`) are ungated. Say "changes," never "access."
- Keep the Trust page's honest-limit paragraph (an approval only protects you if you read it)
  wherever this claim anchors a section.

### ✅ It can open the file on an email, and send one back (SHIPPED 2026-09-16)

**Approved wording:** "Ask what the invoice says and your agent opens the attachment and tells you.
It can send a file back too: the card names what is going with the reply, and it goes when you press
Send."

**Why it's true:** an attachment is listed on every message read (`Message::attachments` in
`crates/archie-net/src/mail/mod.rs`) and fetched only when asked for, by
`MailProvider::get_attachment`, which all three mail backends implement: Gmail walks the message
payload and fetches by attachment id, Outlook expands the attachment collection and takes `$value`,
and an IMAP account reads the MIME with `mail-parser` and re-fetches the message uncapped to decode
one. `inbox_read` takes the name of one, saves it into the same Archie folder everything else the
agent writes goes to, and reads it with the same extractor the knowledge base uses, so a PDF, a
spreadsheet, a Word document and a deck all come back as words. Sending works the same way in
reverse (`OutgoingReply::attachments`), and the file rides in `multipart/mixed` outside the message
rather than inside it.

**The boundaries, and each one is in the code:**
- ⛔ **Never say it can attach any file on the computer.** It can attach what is in the one Archie
  folder, by name. A name with a path in it is flattened to its last component and then is not
  found (`files_to_attach` in `email/replies/draft.rs`, and its test).
- ⛔ **Never say it sends the file itself.** Sending a file is sending an email, and that is the
  same gate as every other reply: the card names the file, and Send is a person pressing Send. The
  card naming it is load-bearing, because an approval is worth nothing if what it covers is not on
  the screen.
- ⛔ **Never claim it reads a scanned document.** There is no OCR anywhere in Archie. A PDF that is
  a picture of a page comes back saying so, in those words, and the agent passes that on.
- A file over 25 MB coming in, or 15 MB going out, is refused with a sentence rather than
  attempted. Both numbers sit under what mail servers accept, because base64 makes an attachment a
  third larger on the wire.

### ✅ Email goes out only when you send it or set a time — SHIPPED (was 🚧 roadmap until 2026-07-20)

**Approved wording (corrected 2026-08-31, see the amendment below):** "Archie can draft email
replies, but it cannot send one on its own. The draft comes to your chat as a card with Send /
Edit / Dismiss buttons, and nothing leaves your account until you send it or set a time for it."

**Amended 2026-08-16: Outlook rides the same gate, and the wording may now name it.** Approved
form: "nothing reaches Gmail or Outlook until you tap Send", and "Gmail and Outlook stay
read-only unless you turn replies on". Why it's true: the send path is provider-generic behind
one trait, and `send_reply` still has exactly one call site: the send branch of the
user-action handler (`crates/archie-runtime/src/email/replies/actions.rs:105`; definition at
`:516`). That branch is reachable from two doors, both of them a person acting: the tapped
Send button (dispatched at `:53`) and a typed "send" on a chat app that draws no buttons
(`:435`). Say "until you press Send" where buttons exist and "until you say send" where they
do not; never imply the word-door does not exist.
`open_mail_with` selects the provider (`crates/archie-runtime/src/email/mod.rs`, the match on
`MailProviderId`: Google, Microsoft), and `MicrosoftMail` implements the send
(`crates/archie-net/src/mail/microsoft.rs`, `impl MailProvider`, `send_reply`). The send
permission is opt-in at connect time on the Microsoft side exactly as on the Google side:
`Mail.Send` is requested only when send is ticked (`crates/archie-net/src/microsoft.rs`,
`scopes_for`, whose comment says "matching the Google side and for the same reasons"), and a
connection made without it is refused before any send by the `capabilities().send` check in
`send_reply` (defence in depth; capabilities are computed from granted scopes, guarded by test
`capabilities_follow_what_was_granted_rather_than_what_was_asked`). Pointer refresh from 07-20:
`email/replies.rs` became the `email/replies/` module and `gmail_send_reply` became the trait
method `send_reply`; the single-caller shape is unchanged.

**Amended 2026-08-31: a scheduled send goes out with nobody pressing anything, so the absolute
form is retired.** The old wording ("nothing reaches Gmail until you tap Send") is **false as
written** and must not be used again. A reply can carry a `send_at`, and then, in Archie's own
words, `email::replies::actions::send_due` "transmits it with nobody pressing anything"
(`crates/archie-runtime/src/gateway/prompt.rs:796`; the function is at
`crates/archie-runtime/src/email/replies/actions.rs:1012`, called every poll cycle from
`email/poller.rs:111`). The card also carries its own **Send later** button
(`email/replies/card.rs:242`). This is why the Archie repo corrected its own store copy in
commit `9baf1fd6`, "The store copy promised something scheduled send had just made untrue"; the
site was not corrected with it, on twelve pages, for the reason `prompt.rs` names: *"a parameter
added to an existing tool does not read as 'a sending tool was added'."*

**Approved forms.** Use the shipped product's own sentence, live in
`data/marketplace/skills/email-manager.json` since 2026-08-28: "Nothing leaves your account
until you send it or set a time." Also approved: "it cannot send on its own: every email is a
draft you read first", and, where the schedule is the point, "a reply set to go later calls
itself off if they write back first."

**What is still absolute, and may still be said that way.** The agent **cannot arm a timed send
by itself**: `timed_send_needs_a_person` (`email/replies/draft.rs:154`) rejects `send_at` unless
a person typed that turn, so a routine firing on a schedule and an arriving email can both draft
and neither can schedule. So "your agent cannot send email on its own" stays true, and every
send is still a person's instruction. What is **not** true is that a person presses a button at
the moment mail leaves.

**Text replies are unaffected and stay absolute.** There is no `send_at` on the texts path
(`crates/archie-runtime/src/texts/` has no scheduled send; its "scheduled pass" is a *reading*
pass). **Do not weaken the text-reply wording while fixing the email wording:** a sentence that
covers both must either split them or use the email form for both, and splitting is better,
because the text claim is the stronger one and we give it away for nothing otherwise.

**Why it's true:** the model's tool set contains **no email-send tool** (tool definitions in
`gateway.rs`: calendar, meetings, specialists, knowledge, remember — nothing sends).
`gmail_send_reply` (`google.rs:279`) has exactly one caller: the "send" branch of the
button-callback handler, which requires a pending draft in `Pending` status
(`email/replies.rs:301-307,507`). Draft triage runs with **no tools** and frames the email as
untrusted input, so a prompt-injected message can at worst produce a bad draft you still have
to approve (`email/replies.rs:1-12`). The tap is authorized against the same inbound roster as
any message (`telegram.rs:917-925`). The `gmail.compose` scope is requested only if the user
ticks "send" at connect time (`commands.rs:3054-3059`); the base Gmail integration remains
read-only (test `gmail_requests_readonly_only`, `builtins.rs:673-679`).

**Boundaries — do not overclaim:**
- Sends are **replies threaded onto an existing message** (`google.rs:277-303`). No claim of
  composing fresh email from scratch until that ships.
- "Sequencing constraint" from the 07-15 entry was honored: the gate landed before/with send.

### ✅ Text Replies: it reads your texts on your Mac, and only you can send one — SHIPPED 2026-08-21

The one feature that reads messages **other people** wrote, so every sentence about it is held
to the strictest form the code supports. Mac only, off until installed, and it refuses to run
on the free starter credits at all (`crates/archie-runtime/src/texts/mod.rs`,
`say_why_texts_are_not_watched`): triaging a text means sending it to a model, the starter
credits route through our proxy, and the people who text the owner never agreed to that. So
**no text handled by this feature ever touches an Otian server**, not as an exception but
because the code refuses the one configuration where it would.

**Approved wording, what it reads:** "It reads texts as they arrive in Messages on this Mac,
under Full Disk Access you grant in System Settings. It starts from the moment you switch it
on and never trawls your history on its own; when a new text arrives, it reads the last few
messages of that one conversation (up to 12, which can include messages from before you
switched it on) so the reply fits the thread, and those go to your AI account with the new
text." Never write "it never reads old messages" bare: the per-thread context window is real
(`triage.rs`, `HISTORY_LINES`) and pretending otherwise is exactly the overclaim this file
exists to stop.

**Approved wording, what leaves the computer:** "The text of a message leaves your computer in
two ways. It goes to the AI account you connected, directly, on your key, so it can be judged
and answered; we are not in the middle and keep no copy. And the card offering you the reply,
which quotes the message, arrives through whatever chat app your agent uses, so it crosses that
platform's servers like anything else you read there." Never write "the AI call is the one
point where a message leaves your computer": the card is a second point, and on Telegram,
Discord, Slack, or Matrix it transits their servers.

**Approved wording, the filters:** "Verification codes, short-code senders, and messages
carrying opt-out phrasing like 'reply STOP' are dropped on this computer before any AI reads
them. Group chats are off until you turn them on; your ignore list and only-from list are
honored the same way." Never promise "marketing is filtered" as a category: the free filter is
a phrase list (`texts/mod.rs`, `AUTOMATED_PHRASES`), and a promotional text without those
phrases reaches the AI on the owner's account.

**Approved wording, the address book:** "It reads your address book on this computer to turn a
number into the name you saved. The lookup never leaves the machine; the resolved name then
appears on the card, in the prompt sent to your AI account, and in any reminder it sets."
Never write "nothing about your contacts is sent anywhere": the name rides the card and the
prompt, and saying otherwise contradicts SECURITY.md.

**Approved wording, retention:** "Message text never enters Archie's logs (every log line in
the lane carries ids, never text). The internal draft record is deleted within a day, on a
sweep that runs whether or not anything arrives. The card your agent posted stays in your chat
like any message there, and a commitment it caught lives on as a reminder until it fires."

**Approved wording, sending:** "Nothing sends without you. There is no tool the model can call
to send a text: the transport's send function is named in exactly one place in the lane, the
private handler behind the Send action, and a test counts those call sites and fails on a
second (`texts/replies/tests.rs`, `no_tool_can_send_a_text`). A reply you send goes out from
your own number, in your own thread, exactly as if you had typed it, because iMessage has no
way to mark a message as written by an assistant. On a shared agent this is the owner's alone."

**Boundaries — do not cross:**
- ❌ Never fold this feature into "nothing about your messages is sent to us at any point"
  alongside the iMessage chat channel. They are different: the chat channel on starter credits
  DOES route the owner's own self-thread messages through our proxy, like any chat. Scope each
  sentence to the feature it describes.
- ❌ Never write "it can only ever message you" anywhere this feature is in scope. The scoped
  form: unprompted, it messages only you; a reply to somebody else exists only as a draft that
  goes nowhere until you press Send.
- Messages does not have to be open; the watch reads the database, not the app. Full Disk
  Access is required to read, Automation to send, and both are macOS grants the user makes.

**Still true, with one rescoped 2026-08-21:**
- **The agent cannot buy anything.** `archie-runtime` cannot see `archie-core::purchases`;
  purchases require a human in Stripe Checkout.
- **Unprompted, the agent messages only its own people** — `Channel::send` targets the chats
  on its roster (in the personal edition, one person: the owner; on a shared business agent,
  approved guests' chats too), and the inbound roster (`access.rs`) governs who may talk *to*
  it. There is no outbound address the model can supply. The old absolute "the agent only
  messages you" died when Text Replies shipped: a draft it wrote reaches a third party once
  the owner presses Send on it. See the Text Replies section for the approved scoping.
- **`remember` is still ungated** — a local write; the persistence vector for an injected
  instruction. Disclose, don't hide.

| Claim | Status |
|---|---|
| "Archie asks before it changes anything in your calendar." | ✅ **True now** (two-turn gate) |
| "Nothing reaches Gmail until you tap Send." | ⛔ **Banned 2026-08-31.** A scheduled send leaves with no tap. Use "nothing leaves your account until you send it or set a time." |
| "Nothing leaves your account until you send it or set a time." | ✅ **True now** (single-caller send path; a timed send cannot be armed by the agent) |
| "Archie cannot spend your money." | ✅ True (and no purchase code path exists in the runtime) |
| "Works while you sleep. Checks in before it acts." | ✅ Defensible now: unattended writes are blocked, reported instead |
| "Every Skill tells you what it can do before you install it — including what it can delete." | 🚧 Still Phase 3 |
| **"Nothing sends without your OK"** (unscoped) | ⛔ **Still banned.** Chat replies and provider web-search queries leave without a per-item OK. Use the scoped calendar/Send-tap wordings above. |

### ✅ One agent answers one person — ENFORCED IN CODE 2026-08-20

**Approved wording:** *"an agent answering you and nobody else"*, *"each one answering you and
nobody else"*, *"only to the one person who paired with it"*. For Archie for Business, and only there:
*"any agent can answer your whole team"*, *"an agent your team shares"*.

**⛔ Banned, and swept off six pages on 2026-08-21: *"one agent your whole team messages"*.** It
reads as a description of what the edition *is*, and the edition is not one agent: a business
plan runs up to 50 (`BUSINESS_PLAN_AGENTS`), and what the edition changes is the ceiling on **who
each one answers**, not the count. Sharing one agent between everybody is a thing the edition
permits, not the shape of the product, and the pricing card contradicted itself by claiming both
"one agent" and "up to 50 agents" seven bullets apart. Say what the difference is: a personal
agent answers its owner, a business agent can answer everyone the owner lets in.

**⛔ Banned: any wording that makes Archie for Business a superset of Archie**, such as "everything in
the personal plan, plus…". They are two apps and two subscriptions, sold from two Stripe products;
a business purchase writes `plan_business` and grants no personal licence
(`docs/BUSINESS-PRICING.md`, "What a purchase grants"). Write what the plan buys.

**⛔ Equally banned: saying a business plan will not run the personal app.** Today it does: the
same doc records the testing-phase decision that "any valid license runs either edition", and the gate is
expected to tighten in the business build later. Both "includes it" and "will not run it" are
claims about a thing in flux, so the site makes neither and describes the purchase instead.

A fresh agent is `Claiming`; the first person to send the pairing code becomes its `Owner`, and it
settles into `OwnerOnly` (`crates/archie-domain/src/access.rs`). Guests are the mode above that,
and both doors into it now refuse: `access_approve` and `access_invite` check
`archie_core::plan::may_add_person` before the write
(`src-tauri/src/commands/access.rs`). The invite door has to be checked too and not just the
approve door, because an invite code is redeemed over chat by `AccessRoster::try_join` inside the
gateway, where no command runs; refusing to mint the code is what closes that path.

The gate is the **edition**, not the licence: `archie_domain::product::IS_BUSINESS`, a
compile-time constant. No plan buys a second person, and a personal build cannot be configured
into allowing one. Guarded by
`plan::tests::no_license_a_customer_can_hold_buys_a_second_person`
(`crates/archie-core/src/plan.rs:162`, with
`the_edition_decides_whether_an_agent_is_shared` at `:177`), which asserts it for every paid
tier by name, so making this a plan feature breaks a test that
names this file. Staff builds are exempt so the guest paths stay reachable while they are being
developed. *(Test pointer refreshed 2026-08-21; the previously named test was renamed.)*

**Boundaries.** This is a product limit, not a security boundary, exactly as the agent cap is: it
counts what is in a roster file on this computer. Do not write it as a guarantee that nobody else
can ever reach your agent; the roster's own fail-closed behavior is the claim that carries that
weight. *(Amended 2026-08-21: it now applies retroactively too, which is more than this file
claimed. A one-time startup sweep brings pre-cap rosters inside the edition's limit, removes
guests beyond it on the personal edition, and names the removed to the owner; staff installs
are exempt.)*

### ✅ The two editions are two apps on one computer: VERIFIED IN THE SHIPPED BINARIES 2026-09-16

**Approved wording:** *"installs beside Archie as its own app, with its own data and its own
keys"*, *"one computer can run both"*.

macOS takes an app's data directory and its Keychain namespace from the bundle identifier, and the
two editions never share one: `com.archie.app` against `com.archie.business`, asserted by
`the_two_editions_never_share_an_identifier` (`src-tauri/tests/editions.rs`) and named as the one
way the split could stop being a split in `docs/BUSINESS-EDITION.md`. Read straight out of the
shipped 0.2.5 bundles on September 16, 2026: each binary carries its own identifier and neither
carries the other's, including the derived `audit` and `index` names built from it.

The same read settled the half with no remote fix. Each binary carries exactly one updater feed and
it is its own, business to `/archie/b/26924e156bd86c28/`, personal to `/archie/b/68f9841b035fc2c5/`.
A business install polling the personal feed would download a personal build, which keeps its files
under a different identifier, so every agent and every connected account would be gone from the
owner's point of view with the old data still on disk under a name the new binary never opens.
`the_two_editions_never_share_an_updater_endpoint` holds the two configs apart; the compiled
binaries were read as well, because the config is what a test can see and the compiled string is
what ships.

**Boundaries.** This says the two apps do not share storage. It is not a claim that either is
sandboxed from the other, and nothing stops a person putting the same key in both. Nobody has yet
run the two side by side through a real session, which is `docs/BUSINESS-EDITION.md`'s own open
item 1, so write that they install and store separately and not that they have been used together.

### ✅ A company's name and logo never leave the computer: VERIFIED 2026-09-16

**Approved wording:** *"put your company's name and logo on it"*, *"they stay on the computer
Archie runs on"*.

Archie for Business lets an owner say what their company is called and add a logo, on the Company
page. Both are written into `structure.json` at the root of the workspace directory, beside the
shared record lists, by `set_company_name` and `set_logo` in
`crates/archie-core/src/bundle/structure.rs`. The logo's bytes are written next to that file as
`logo.png` or `logo.jpg` and nowhere else.

Nothing sends either one anywhere. The workspace directory is on the owner's own disk, the same
place every agent bundle already lives, and no code path reads these two fields other than the two
screens that draw them: the Company page and the sidebar row. The file name rather than a full path
is what is stored, so the workspace stays movable, and the bytes reach the window as a `data:` URL
because the app grants its own webview no filesystem access at all
(`src-tauri/capabilities/default.json` lists no `fs:` and no `asset:` permission, and
`src-tauri/tauri.conf.json`'s CSP allows `img-src 'self' data: blob:` and no asset protocol).

They are also not sent to the model. The prompt an agent is given names the company only where the
owner typed it into a skill's own setup, which is the separate `COMPANY_NAME` variable an add-on
may ask for, and that is the owner's own text going where they put it.

**Boundaries.** This says the two fields stay on the computer. It is **not** a claim that the
workspace directory is encrypted, and it is not a claim about anything else in that directory. It
also says nothing about the agent's own picture, which is a different file in a different place
(`crates/archie-core/src/bundle/avatar.rs`) and has always been local for the same reason. Do not
write that Archie "knows your brand" or anything that implies the logo is used in what the agent
produces: it is drawn on two screens in the app and used nowhere else.

### 🚧 Group-chat messaging + a "who it may message" UI — ROADMAP, NOT SHIPPED

Planned: group-chat messaging, and a UI for adding user IDs to a permitted-to-message list.
**Neither exists today.** Today the agent replies in the chat it was addressed in (the owner's
chat, or the learned primary chat); the only roster that exists governs who may talk **to** it
(`crates/archie-runtime/src/access.rs`), not who it may talk **to**.

✅ **The current copy is safe for both** — *"It speaks only in the chats you connect it to, to
people you've approved"* is true today and stays true after the UI lands. Do not upgrade it to
anything more specific until the UI exists.

*[Amended 2026-08-20: that wording is still true but is no longer what the site says, and should
not be reintroduced. "People you've approved" is a plural the personal editions can no longer
reach, so it advertises a capability that is not on sale; it was replaced on `archie/business/index.html`
and `faq/index.html` with the one-person wording above. Restore the plural only alongside the
business edition.]*

### 🚧 The weekly letter: LIST RUNNING, COPY CORRECTED, ONE DECISION STILL OPEN

**Two places on the site carry the weekly letter and no others may.** The switch on
`account/index.html`, which is a control rather than a claim, and one bullet in
`privacy-policy/index.html`, which is the disclosure that has to exist before a first send. No
marketing page mentions it, and none may until it sends.

**What changed on 2026-09-10.** The earlier version of this entry said the three routes returned
404 and that nobody was on a list. Both were true when it was written and neither is true now. The
mailer shipped the same day, in `stripe-webhook/index.js` in the Archie repo, and a backfill ran
against production.

| | Then | Now |
| --- | --- | --- |
| `POST /newsletter/status`, `/enable`, `/disable` | 404 | live, and 401 to a bad token, the same as `/mfa/status` |
| People on the list | none | **29** |
| The card's "isn't running" branch | what everybody saw, on a 404 | kept, and now fires on 503 instead: that is the mailer answering without `NEWSLETTER_AUDIENCE_ID` set (`newsletterUnavailable()`), which is the one way the letter can stop running without the routes going away |

The 29 are every account with a verified email and a `users/{uid}` document, which is 29 of 30.
The one left off has no account document. Nothing has been sent to any of them.

**⚠️ The privacy policy bullet was false, and was corrected the same day.** It had said:

> One email a week from us, **off unless you switch it on yourself** on your account page.

Nobody switched anything on. The list was populated by a backfill of existing accounts, which is
opt-out, and the sentence described opt-in. It was the one claim on the site a subscriber could
disprove by simply not remembering having done it.

**Fixed 2026-09-10 by taking the first of the two remedies: the copy now describes what actually
happens.** `planContact` in `stripe-webhook/newsletter.js` returns `{action: "add", status:
"subscribed"}` for any account with a verified email and a `users/{uid}` document that has not
opted out, so the bullet now reads "If you have an account here with a confirmed email address,
you are already on it: we added existing account holders rather than asking each of them to opt in
first", and names the switch in the same breath, per the rule that a limitation we are obliged to
publish gets its remedy beside it.

**The second remedy is still open and is Jett's alone: whether to keep an opt-out list at all, or
empty the audience and make the switch the only way on.** That is a decision about the product and
about what consent the sending rests on, not about wording, and nothing on the site now depends on
which way it goes: the copy is true today either way, and if the audience is emptied this bullet
gets rewritten to the opt-in form it started as. **Do not send an issue before that is settled.**

Note that the account card itself is not affected and does not need touching. It reads the live
state from `/newsletter/status` and renders what it finds, so the 29 see a switch that is on,
which is accurate. The card is a control; only the policy bullet makes a claim about how somebody
got there.

**Retention, which the earlier entry could not answer and now can.** Both halves are in
`stripe-webhook/index.js` and `stripe-webhook/newsletter.js`:

- **Deleting an account removes the address entirely.** `/account/delete` deletes the
  `newsletter/{uid}` document and calls Resend to delete the contact. Nothing is kept, and nothing
  suppressed is kept either, because there is no account left to hold it against.
- **Unsubscribing keeps a suppression record, on purpose and for as long as the account exists.**
  `newsletter/{uid}` holds `status: "unsubscribed"`, and it is what stops a later sync run putting
  somebody back on after Resend's own contact is gone. Keeping it is what honors the opt-out; the
  alternative is forgetting that they said no.

✅ **Written 2026-09-10**, in the same push, as a row reading "Until you turn the letter off or
delete your account. A note that you turned it off outlives the address, for as long as the
account does".

✅ **`trust/#what-we-hold` was incomplete and was completed 2026-09-10.** It was correct while
nothing was held; twenty nine addresses are held. Per the "state the whole list, always" rule
above, the list now carries "Your address on the weekly letter's list, and whether you are on it
or off", with the suppression note and the account-deletion behavior in the same item.

**The one claim to verify before the first issue goes out**, because it is the only one a reader
could catch us on using nothing but the email itself:

> **We do not track opens or clicks**: there is no tracking pixel in an issue, and its links go
> where they say they go rather than through a counter, so we have no way of knowing whether you
> read one.

Resend has open tracking and click tracking as per-domain settings. Both are off by default, and
click tracking rewrites every link through a Resend domain when it is on, which anyone can see by
hovering a link in the letter. **Open the Resend dashboard, confirm both are off for
`news.otianai.com`, and record it here with the date.** Nothing in the mailer can set them: it
touches contacts and audiences only, never domain settings, so the dashboard is the only place
this can be true or false. If either is on, that sentence is false from the moment it goes out,
and false in the most checkable way a claim can be.

**Still not done, and both are now live gaps rather than future ones:**

- The unsubscribe link and the postal address in every issue. A list with 29 people on it and no
  working unsubscribe is the part that is illegal rather than untidy.
- The account card's copy names both ways off, the switch and the unsubscribe link in every issue,
  in both states. Leaving has to read as plainly as joining; do not let a later edit trim the
  off-ramp out of the "on" sentence.

### ✅ Email send with click-to-approve — SHIPPED 2026-07-20 (superseded)

See "**Email goes out only when you tap Send**" above for the approved wording, code pointers,
and boundaries. The 2026-07-14 inventory ("eleven tools, none sends email; zero buttons in any
chat adapter") is superseded: the model *still* has no send tool — sending is a user-tap
action on a draft card, not a model capability — and the chat adapters now carry inline
buttons for exactly this flow (`telegram.rs:672-729,917-925`). The sequencing constraint the
07-15 entry demanded (gate lands fail-closed before send) was honored.

### ⛔ The gate does not stop exfiltration — never imply it does

The gate stops **mutation**, not **leakage**. A prompt injection can still make the model issue
an Anthropic server-side web search (`gateway.rs:2263`) or a `delegate_to_specialist` web-search call
(`gateway.rs:1395-1418`) with an attacker-chosen query carrying data from the user's context.
Neither is gateable at the choke point, because the search never becomes a client tool call.

**This must not be swept under a "nothing happens without your OK" umbrella.** Say so plainly on
the Trust page; we already do.

**Re-verified 2026-08-25, and the answer is that nothing needs fixing.** Checked because this
admission is load-bearing in a way the flattering claims are not: it is the reason a hostile
reader believed the rest of the page, so a quiet softening of it would cost more than the thing
it admits. Three findings.

1. **Still there, still in the same form, still prominent.** Second of six in Where We Fall Short
   on `trust/`, above the fold of that section, nothing behind a click or an accordion, with the
   long version at `trust/details/#untrusted-text`.
2. **It has been strengthened, not softened.** `d76725f` widened it from "run a web search whose
   query carries information from your conversation" to also name item-adding and the `remember`
   write, and narrowed the *gate's* own claim to changes "that are not easily reversible". Both
   moves are away from flattery. The leak sentence itself survives intact.
3. **No contradicting description of the gate anywhere on the site.** Every page was checked. The
   only approval-gate claim outside the three trust pages is `compare/cloud-agents/`, and it is
   scoped to "email and calendar changes are held until you approve", which is the approved form
   and says nothing about leakage. So there is nothing for the tracked-false section here, which
   is worth writing down: the sections of this file that stay empty are evidence too.

Standing rule this pass establishes: **before any launch or press push, re-read this admission
on `trust/` and diff it against the last version.** A page gets edited for length, for rhythm,
for a new feature, and the paragraph nobody is defending is the one that quietly loses a clause.

---

## Known Weaknesses — disclose, don't hide

These are true and unflattering. They go on the Trust page anyway.

**Where they live, since 2026-08-03.** The Trust page carries every admission's headline plus
the substance of it; the full reasoning behind each one lives on `/trust/details/`, linked from
the summary it belongs to. Nothing is behind a click on `/trust/` itself and nothing is behind
an accordion anywhere — a reader deciding whether to trust us must not have to interact to find
out what we admit. When you add or change a weakness, it goes in **both** places: the admission
on `/trust/`, the argument on `/trust/details/`. If you only have room for one, it goes on
`/trust/`.

### The subscription gate is fail-open — and this cuts both ways

The license check reads a cached Keychain value and **only writes on success**
(`src-tauri/src/auth.rs:147-198`). If the server is unreachable, the last known-good answer
stands — **with no TTL, no expiry, and no grace-period counter**.

Two consequences, and they pull in opposite directions:

1. ✅ **If Otian dies, existing installs keep working.** The check fails, the cache persists,
   the app runs indefinitely. This is what we want, and it is what the code does today.
2. ⚠️ **It is also a piracy hole.** Blocking `firestore.googleapis.com` after one successful
   sign-in yields permanent free access.

Cancellation still works as intended: Stripe → Firestore `access_tier` → the next *successful*
check flips the flag and the app stops. The gate only fails open when the **server** is
unreachable, not when the answer is "no".

⚠️ **The trap:** closing the piracy hole with a TTL would silently break consequence (1) — the
"if we vanish, your agent survives" promise. **So do not rely on the accident.** We have made it
a **contractual commitment** instead (Terms of Service → "Subscription, cancellation, and what
happens if we go away"): *if Otian ceases operations, we publish a final build requiring no
license check, within 30 days.* (Those are the Terms' own words; this file used to say
"subscription check" here and "no sign-in" above, and a claims contract that paraphrases the
contract it cites is how the two drift apart.) That promise survives any change to the license
mechanism, which means the piracy hole can now be fixed freely without touching the claim.

**Updated 2026-08-07: the hole is closed, and the accident with it.** The licence check is now a
statement signed by the billing service over Ed25519, verified against a public key compiled into
the app (`crates/archie-core/src/entitlement.rs`, `stripe-webhook/entitlement.js`). Editing the
Keychain no longer buys anything, because the value that decides is one the computer reading it
cannot produce. Three consequences for this file:

1. **The piracy sentence above is now historical.** Blocking Firestore no longer yields permanent
   access; it yields an assertion that goes stale. The remaining route is patching a notarized
   binary, which is a different order of effort and breaks automatic updates.
2. **There IS a TTL now, exactly as the trap warned.** An assertion lasts 60 days and is refreshed
   on every launch that reaches us. Consequence (1), "if Otian dies, existing installs keep
   working", is therefore no longer true forever. It is true for 60 days.
3. **Which is why the window is 60 and not 30.** The contractual commitment is a final build within
   30 days of shutting down. A 30-day assertion would have expired everybody at precisely the
   moment that build was due, so the promise would have depended on publishing it early. 60 leaves
   a month of margin, and the commitment is what the claim now rests on entirely.

⛔ **Never claim the app runs indefinitely without us.** It runs for 60 days, and then the Terms
commitment is the thing that has to hold. That is a stronger promise than the accident was, because
it is written down, but it is a different one and must not be described as the old one.

⛔ **Never claim a "30-day grace period" for an unreachable server.** No such timer exists.
✅ **Do claim (reworded 2026-08-21):** "If you leave, the app stops. If we disappear, it runs
on its last license note, up to 60 days, and the final build the Terms oblige us to publish is
what keeps it running after that." The old punchy form ("if we disappear, it doesn't [stop]")
contradicted the never-claim-indefinite rule three lines up; the code delivers 60 days and the
Terms deliver the rest, and the sentence has to say which promise is doing which work.

### Prompt injection: the gate narrows it, doesn't end it

Chat attachments (`discord.rs:377`, `slack.rs:334`), Fireflies meeting transcripts, and
provider web-search results still enter the model's context. Since 2026-07-20 the calendar
gate stands between injected content and calendar writes, and email triage is quarantined
(no-tools call, sanitized input — `email/replies.rs`). What remains reachable by an injected
instruction: **`remember`** (a local write — the persistence vector) and **provider-side web
search** (the exfiltration channel — see the gate-does-not-stop-exfiltration section). A bad
draft is also still possible; the Send tap is what stops it becoming a sent email.

---

## Banned Phrasings — never ship these

| Banned | Why |
|---|---|
| "Your data never leaves your device" | **False.** Your prompts go to Anthropic/OpenAI. The true claim is that *we* never see them. |
| "The only thing our servers know is whether your subscription is active" | **False.** Also your email, and the operational records under What We Hold. |
| "Fully private" / "completely private" / "100% private" | Unfalsifiable. Means nothing. Say what we hold and what we don't. |
| "Zero data collection" | **False.** We collect your email. |
| "Bank-grade" / "military-grade" encryption | Meaningless. We use the OS Keychain and TLS. Say that. |
| "We can't see anything" | Overbroad. We can see three things. Name them. |
| "Nothing sends without your OK" (unscoped) | Chat replies and provider web-search queries leave without a per-item OK. Use the scoped forms: calendar-confirmation / Send-tap wordings. |
| "Sandboxed add-ons" | Misleading. Add-ons are data, not code — there is nothing to sandbox. The true claim is *stronger*; make it instead. |
| "Your keys never leave your computer" / "keys stay on your computer" | **False.** The key is sent to Anthropic/OpenAI as a request header on every call (`secrets.rs`, `x-api-key`/bearer). The true claim is storage + custody: "keys sit in your system's keychain, where we have no way to read them." |
| "We never hold your data" (unscoped) | Unscoped "your data" is false; we hold email + plan status. Scope to content: "We never hold your conversations." Caught 2026-07-20 on the homepage proof chip, and again 2026-08-03 as the `business/` feature-card **heading**: the body underneath stated everything we hold, but a heading is what gets scanned and the correction sat four sentences down. Check headings, not just body copy. |
| "It asks before it acts" / "acts only with your approval" (unscoped) | Same umbrella as "nothing sends without your OK": chat replies, provider web search, `remember`, and calendar reads act without asking. Use the scoped Send-tap / calendar-changes forms. |
| "Your agent's data stays on your computer" (once phone access ships) | **False** with phone access on. Installed add-ons and their settings are mirrored to our servers, encrypted. The true claim is custody without access: "we hold the messages and cannot read them." |
| "Phone access never touches our servers" | **False**, and backwards. The mechanism *is* our servers, holding sealed messages. Claiming absence throws away the honest, checkable claim in exchange for one that is trivially disprovable. |

---

## Settled Decisions

### Business Tier — what an admin can see

**Decided 2026-07-14. Binding on the build. Not to be published until the tier ships.**

An admin sees exactly three things: **which teammates have an agent, which add-ons are
installed, and what it costs** — plus the ability to revoke a seat.

An admin sees **zero content**: not what was asked, not what was read, written, or sent.

This must be enforced by architecture, not by a policy toggle — because a toggle can be
flipped, and a promise not to look is worth nothing. The published sentence, when it ships:

> Your manager can see that you have an agent, which add-ons it has, and what it costs.
> Your manager cannot see what you asked it, what it read, what it wrote, or what it did —
> not because we choose not to show them, but because that never leaves your computer.
> We don't have it to show.

**Corollaries:**
- Every employee gets a **"what your admin sees"** screen showing the exact payload their
  computer reports. This is what stops a business rollout dying from the bottom up.
- This **kills the usage/savings dashboard** as specced. Hours-saved-per-employee is derived
  from activity; if we can't see activity, we can't compute it honestly. Do not build it.

### Both trials keep 14 days (reversed 2026-08-24, and answered 2026-09-17)

**Superseded.** There is a free tier now, and it is above: "Archie is free on an AI account of your
own, with a limit of 20 jobs a day." This entry stays because its argument is what the free tier had
to answer, and because the argument was right about the thing it was about.

**What it said, and what changed.** It refused a free tier on the grounds that `FREE_AGENTS = 1` was
the only limit separating free from paid, so a trial that never ended would be the paid product
minus nine agents, which for a one-agent product is the whole thing. That was correct, and the fix
was not to argue with it: a second limit now exists, it is a day's worth of work rather than a list
of withheld features, and it bites every day on anybody who actually leans on Archie. The 2026-08-24
hold ("no page may claim a free tier until the expiry actually comes off") is lifted, because the
expiry is not what came off. Nothing expires; the day runs out and comes back.

**The reasoning that produced the refusal, kept as written:**

**What was briefly decided:** that the own-key trial would stop expiring, becoming a permanent
free tier, on the premise that `FREE_AGENTS = 1` is what separates it from a paid plan.

**Why that was wrong.** The premise is true and it is the *only* thing that is. Archie has
exactly two limits in the whole app: agents (1 free, 10 paid) and people per agent, and the
second is a compile-time 1 in the personal edition, identical for a trial and a plan. Everything
else sits behind `require_access`, which is *entitled OR trialling*, so a trial already reaches
every skill, routine, specialist, personality, integration, the mail daemon, voice and phone
access. A trial that never ends is therefore the paid product minus nine agents, and Archie for
Personal is a one-agent product for most of the people it is sold to. For its actual
audience that is not a wall, it is the whole thing.

**Nothing shipped.** The app-side change was built across all five places that end a trial and
reverted in full (Archie repo, `cdee5d5`, reverting `2c006c9` and `1a30bd7`). No server or rules
deploy happened, so the two repos never disagreed, and no site copy went up: this entry carried a
hold saying no page could claim a free tier until the expiry actually came off, and none did.

**The standing true sentence** for pricing and trial copy, rewritten 2026-09-17: "Fourteen days
free, with nothing counted. After that Archie is free on an AI account of your own, with a limit of
20 jobs a day. A plan is $299 a year or $30 a month, takes the limit off, and runs up to ten agents.
Your agent needs an AI account of your own either way, and you pay that company directly."

The old version of this sentence ended "you can still have the fourteen days by connecting an AI
account of your own", which was true and is no longer the whole answer: connecting one now opens the
app whether or not the fourteen days are available.

### ⛔ The starter credits cannot read email, and the site said they could

**Approved wording (added 2026-08-24):** "While your agent is thinking on our credits it cannot
read your email. Reading your mail would mean the mail itself passing through Otian's servers,
and the people who wrote to you never agreed to that. Connecting an AI account of your own turns
every email tool on, straight away and with nothing to switch."

**Why it's true:** every interactive inbox tool and the mail watcher refuse while the agent is on
the trial credential (`crates/archie-runtime/src/email/poller.rs`,
`INBOX_TOOLS_NEED_YOUR_OWN_KEY`; one arm of the tool dispatch applies it to everything named
`inbox_*`, so a later inbox tool is born gated rather than born as a hole, decided 2026-08-21).
The owner is told once, in chat, rather than left with a feature that silently does nothing. A
key of the user's own always takes precedence over the trial credential
(`gateway_lifecycle.rs:70-93`), so connecting one lifts the block with no setting to find.

**What was false, and where.** `archie/pricing/` said the credit trial was "the whole app either
way: every add-on, every chat app", and the FAQ said "same app, same everything". Both were
overclaims for the credit trial specifically, and the site sells email features hard enough that
the pair implied something untrue. Fixed 2026-08-24, found via the Archie repo rather than by
reading the page.

**Boundaries:**
- ⛔ Never say the credit trial is "the whole app". It is the whole app except email.
- ✅ The own-key trial *is* the whole app, and that is worth saying, because it is the difference
  between the two and it is the reason to connect a key.
- Do not frame connecting a key as an upsell. It costs us nothing and it is the step that turns
  email on.

### Add-on permissions: one setting, not three levels

**Decided 2026-08-24.** BetterClaw's Intern / Specialist / Lead ladder (wishlist item 3) is not
being adopted. Archie already made this call once, in a different place and for the same reason:
`crates/archie-domain/src/access.rs` gives a guest one switch rather than per-tool permissions,
because "per-tool permissions would be a screen nobody finishes reading."

Ranking three abstractions before you know what any of them do is a worse ask of a non-technical
buyer than one switch per add-on that says whether it checks with you first. If a per-add-on
control ships, it is that switch.

**What does not change:** the blunt-scope admission stays exactly where it is, on `/trust/` and on
the marketplace browse page. An add-on that asks for "calendar" still gets read, create and delete
together, and a permission UI must never be allowed to imply otherwise.

### Subscription gating

**Rewritten 2026-09-17, when the third door opened.** Archie is gated by payment *or* by bringing an
AI account of your own, and the second one is free with a limit of 20 jobs a day. We do not market
"runs forever", we do not claim a grace period, and we do not describe the free tier without its
number. If the gate is ever made to fail *closed*, this section gets rewritten and the Trust page's
honest-limits section updated the same day.

### ✅ What the AI providers say about training on API traffic (third-party, sourced)

**Approved wording:** the "In their own words" block on the Trust page, quoting or citing each
provider Archie connects to on whether it trains on API data.

**Why it's true / source:** these are NOT Otian claims and have no Archie code path. Each is a
citation of the provider's own current policy, linked inline. Verification status (checked
2026-08-16, aligned with `docs/PROVIDER-DATA-POLICIES.md` in the Archie repo):
- Anthropic, Google (paid tier), Groq: **verbatim**, pulled directly from the linked policy pages.
- OpenAI: **accurate summary, not verbatim.** Their site blocks automated fetching, so the
  wording is a paraphrase with the source linked; upgrade to a direct quote once the exact
  sentence is confirmed from the source.
- xAI: **unverified.** Every primary xAI document refuses automated readers, so what we held
  was a summary of summaries, which is not a source. The row stays candid about consumer Grok
  training by default; a person with a browser has to read the actual API terms before the
  entry can claim more than that.
- Mistral: **verbatim, and it splits.** Free mode trains by default; pay-as-you-go does not.
  <https://legal.mistral.ai/terms/commercial-terms-of-service> and
  <https://help.mistral.ai/en/articles/455207-can-i-opt-out-of-my-input-or-output-data-being-used-for-training>,
  read 2026-08-16. Same shape as Google: which one a user has is a fact only they hold.
- DeepSeek: **verbatim, and it is the strongest warning on the list.** Their terms say nothing
  about training; the privacy policy says personal data is used "to train and improve our
  technology" and is "directly collect[ed], process[ed] and store[d] ... in People's Republic
  of China", with open-ended retention. The opt-out is regional (EEA, UK, Switzerland) and no
  such right is stated for anyone else.
  <https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html>, read 2026-08-16.
  Their models are open weight, so a self-hosted copy reached through "Another provider" sends
  DeepSeek nothing; that is the only form of DeepSeek use this file will describe as safe.

**Added 2026-08-25: the roster on this page was five and the product has seven.** Reconciliation
item 3 at the top of this file recorded the roster as seven in August and this block was not
updated with it, so `trust/index.html` listed Anthropic, OpenAI, Google, Groq and xAI while the
same page told people they could connect Mistral or DeepSeek. The omission mattered more than a
normal staleness bug because the missing two are the two with the worst answers, so the effect of
leaving them out was a table that read better than the truth. Both rows are now required.

**Added 2026-08-25, second pass: the rows were fixed and the sentence above them was not.** The
trust page's third answer was headed "They don't train on it" over a paragraph beginning "Most of
the AI companies Archie connects to state plainly that they do not train their models on API
traffic." At five providers that was arguable. At seven it is not: three say it unconditionally
(Anthropic, OpenAI, Groq), two say it of the paid tier only (Google, Mistral), one is unverified
(xAI), and one trains and says so (DeepSeek). "Most" was reachable only by counting the
conditional pair, and the heading was flatly false for DeepSeek, forty lines above a table that
said so. **The summary above a sourced table is part of the table.** Approved wording, and it is
a count rather than a quantifier on purpose: "Of the seven, three say that what you send through
the API is not used to train their models. Two say it of their paid tier only. One we have not
been able to verify at all. And one trains on it and says so in its own policy." When the roster
changes, that sentence is re-counted from the rows or it is deleted.

**Added 2026-08-25, third pass: the stale rosters were not only on `trust/`.** Sweeping for the
same bug elsewhere found three more lists frozen at the old roster: `how-it-works/` named five in
the anatomy figure and five again under "An account with an AI company", and `faq/`'s cost answer
named four. All three now name seven, and the anchor `trust/#providers` exists so a page can send
a reader to the sourced table instead of paraphrasing it. **The provider list is
`crates/archie-net/src/providers.rs` and nothing else**; a page that names providers is re-counted
from it whenever the enum changes, and a page that only needs to gesture at the set links to the
anchor rather than typing the names again.

⛔ **And one of the three was worse than stale.** `how-it-works/` recommended Google with "Google
is free in most countries", steering a first-time reader at the exact tier Google trains on,
with the paid-vs-free caveat nowhere on the page. The caveat boundary below says never to drop it
where the no-train line appears; this was the sharper version, a free-tier recommendation with no
no-train line to attach a caveat to. **Recommending a provider's free tier is making a claim
about its training terms**, so a page that recommends one carries the terms or links the table.
Fixed in place: Groq's free tier stays recommended without a caveat because Groq's no-train line
is unconditional, and Google's now says which tier trains.

⛔ **Superseded 2026-08-30, and for a reason that has nothing to do with training: Groq's free tier
cannot run Archie, so the site no longer recommends it anywhere.** That tier allows 8,000 tokens a
minute, and one turn sends 10,000 to 17,500 because the agent's own instructions travel with every
message. A free Groq key therefore pastes in, validates green, and then fails on everything the
person sends. Measured against the live API on 2026-08-29 against two agents, one with eleven
skills and one with two; the small one is still nearly twice the cap, so there is no agent small
enough. Three pages carried the claim, all now corrected: `archie/pricing/`, `faq/`, and
`how-it-works/` said Groq was free to start and needed no card, and now say it is the cheapest to
run and needs one. **The only free start this site may claim is the credits Archie already
includes**, which run on Claude. Groq's unconditional no-train line is untouched by any of this and
is still quoted on `trust/`. The rule above stands and gains a second half: recommending a free
tier is a claim about its training terms, and also a claim that it works.

**xAI, re-checked 2026-08-25 and unchanged: unverified is what the site says, everywhere it
says anything.** The only two places on otianai.com that characterize xAI's training terms are
the trust page's row and the review PDF's provider table, and both say unverified with the
reason. Linking `x.ai/legal/terms-of-service-enterprise` as a "read it directly" source is not
characterizing it and stays. Any future entry that describes what those enterprise or consumer
terms *say* needs a person with a browser to have read them and a date recorded here first.

**Boundaries — do not cross:**
- ❌ Never state or imply that *all seven* providers commit to not training. xAI, Mistral, DeepSeek
  and Google all break that sentence in different ways. xAI is the first exception:
  its consumer Grok trains by default, and a self-serve API key's status is not clearly its
  enterprise no-train terms. Keep the xAI entry candid.
- ❌ Never drop Google's paid-vs-free caveat: the no-train line is the paid tier only. And
  never append "which is what a user's own key uses": an AI Studio key can be free-tier, the
  connect flow points people there, and Archie has never asked which kind was pasted. Whether
  the caveat protects a given user depends on their Google billing, and only they know it.
- Provider policies change. Re-verify all seven, and re-pull the verbatim ones, before any launch
  or press push, and update the "checked" date. A stale quote here is a false claim.

---

## Competitor claims — the `/compare/` pages

Every other section of this file governs claims about **us**, where the worst case is that we
overstate our own product. This section governs claims about **other companies**, where the
worst case is a false public statement about a third party. That is the one kind of error that
is both a trust failure and a legal one, so the bar is higher, not lower.

**The rule: no sentence about a named third party ships without a row in the table below.** A
row needs the company's own public page as its source, not a search result, not an aggregator,
not a summary of one, and not this model's memory. Money figures additionally need a row in
FACTS.md under "Other companies' prices" with its own `Checked:` date.

**A page that blocks automated requests is still a source; a search result is not.** Several
companies return 403 to any fetch. Reading their page in a browser and transcribing the figure
satisfies this rule, because the requirement is the company's own page, not the method of
getting at it, and any reader can open the same URL and see the same thing. What it does not
satisfy is re-checking: no script can confirm it later, so those rows carry the caveat in
FACTS.md and someone has to open the page by hand when the 90-day date comes due. The failure
mode to guard against is a figure that was verified once and then silently rots, not the
transcription itself. What remains banned is the shortcut, which is taking the number from a
search snippet, an aggregator, a competitor's comparison page, or memory.

### Structural rules for every comparison page

- **Lead on custody, never on privacy.** The positioning note under "No Otian custodian"
  applies with full force here: local-model tools are genuinely more private on inference, so
  "more private than X" is both false against some competitors and unfalsifiable against the
  rest. The claim is that no server of ours holds your content.
- **Every page carries a section where the alternative wins**, named and specific. This is the
  disclosure principle from "The Test" applied to comparison: the unflattering item you
  volunteer buys more belief than the flattering one you argue for. A comparison page with no
  losses reads as an advertisement and is treated as one.
- **And a section where Archie wins comes first, and gets at least as much room.** Jett's
  direction of 2026-09-12: the pages argue for us, in sentences that are true, and put our
  strengths ahead of our gaps. The alternative's section stays, shorter and matter-of-fact, for
  the reason above. Ours sits before it, and every item in it is a claim this file already
  approves, cited in place to the Trust, pricing or Terms page.
- **Category claims and company claims are different things.** "A chat app answers when you
  open it and ask" describes the category and needs no citation. "ChatGPT costs $X" or
  "Zapier cannot do Y" is a claim about a company and needs a row.
- **No absolutes.** "Zero maintenance", "no risk", "never breaks" are the banned-phrasings
  category by another name. If it cannot be falsified, it does not ship.
- **Date the page.** Each comparison page prints a visible "Checked" date and carries a
  `Sources` fold listing every third-party claim with its link. A reader who wants to audit
  the page must be able to.
- **Cite in place, not only at the foot.** Every money figure, every count, every sentence
  about another company, and every custody or approval claim carries a numbered `.src-cite`
  marker linking straight to the page it was read from: the other company's own pricing page
  for theirs, our Trust page, Terms, or pricing page for ours. The number matches its entry in
  the `Sources` fold, which holds our note and the date. The marker links out rather than down
  to the fold, because that fold is a `<details>` and a fragment link into a closed one relies
  on browser auto-expansion; a citation that silently does nothing is worse than none. A figure
  a reader cannot click through to is a figure they have to take on faith, which is the whole
  thing this section exists to prevent.
- **A figure with no source does not get a marker, it gets a sentence.** Where we could not
  read a number at its source (ChatGPT's prices, assistant wages), the page says so in prose
  and the `Sources` fold carries an unnumbered entry explaining the omission. Never invent a
  citation to fill the pattern.
- The availability sentence and the `archie/#status` link appear on every one of these pages,
  same as everywhere else.

### The table

| Claim as printed | About | Source | Checked |
|---|---|---|---|
| Claude Pro is $20 a month, or $17 on the annual plan | Anthropic | `https://claude.com/pricing` | 2026-08-19 |
| Claude Max starts at $100 a month | Anthropic | `https://claude.com/pricing` | 2026-08-19 |
| ChatGPT Plus is $20 a month | OpenAI | `https://chatgpt.com/pricing` | 2026-08-19 |
| ChatGPT has a free tier, Go at $8 a month, and Pro from $100 | OpenAI | `https://chatgpt.com/pricing` | 2026-08-19 |
| Zapier's free tier includes 100 tasks a month | Zapier | `https://zapier.com/pricing` | 2026-08-19 |
| Zapier Professional starts at $29.99 a month, or $19.99 billed annually, for 750 tasks | Zapier | `https://zapier.com/pricing` | 2026-08-19 |
| Make's free tier includes up to 1,000 credits a month | Make | `https://www.make.com/en/pricing` | 2026-08-19 |
| Make Core is $12 a month and Pro is $21 a month, each at 10,000 credits | Make | `https://www.make.com/en/pricing` | 2026-08-19 |
| n8n Starter is 20€ a month billed annually, Pro 50€ | n8n | `https://n8n.io/pricing/` | 2026-08-19 |
| n8n publishes a self-hostable Community edition on GitHub under its Fair-code licence | n8n | `https://n8n.io/pricing/` | 2026-08-19 |
| Claude Cowork is Anthropic's knowledge work agent, included on paid Claude plans from Pro up ("Includes Claude Cowork" on the Pro card) | Anthropic | `https://claude.com/pricing` | 2026-08-20 |
| Cowork's work "runs on Anthropic's servers, in an isolated environment, and your sessions and files are saved to your Claude account" | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-08-20 |
| Cowork has three permission modes; in Skip mode "Claude doesn't pause to ask and nothing checks its actions automatically" | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-08-20 |
| Grok Bot is in beta for SuperGrok Heavy, Cursor Ultra and Cursor Teams Premium subscribers, on desktop and iOS | xAI | `https://x.ai/news/introducing-grok-bot` | 2026-08-20 |
| Each Grok Bot "runs on a persistent cloud VM with a browser, filesystem, and terminal" and signs in to your tools there; it comes back "when something needs your approval" | xAI | `https://x.ai/news/introducing-grok-bot`, `https://docs.x.ai/grok-bot/overview` | 2026-08-20 |
| Symphony by Wix is an AI agent platform for small businesses, on iOS, Android and web, with a "mobile-first interface" | Wix | `https://www.wix.com/symphony` | 2026-09-11 |
| Symphony is "a new standalone AI agent platform", "platform-agnostic", and used with a Wix account though it needs no Wix website | Wix | `https://www.wix.com/press-room/home/post/wix-launches-symphony-by-wix-a-new-standalone-multi-agent-system-built-for-smbs`, `https://support.wix.com/en/article/symphony-an-overview` | 2026-09-11 |
| Symphony is reached in a browser or its iOS/Android app: "Symphony is available on iOS and Android. Download the app and take your business with you wherever you go." Wix publishes no program you run on your own computer | Wix | `https://www.wix.com/symphony` | 2026-09-11 |
| Symphony "checks with you first before your agents act, so nothing important happens without your approval" | Wix | `https://support.wix.com/en/article/symphony-an-overview` | 2026-09-11 |
| Symphony's agents "don't wait to be asked. They spot the moves worth making and run with the ones you approve. Day or night." | Wix | `https://www.wix.com/symphony` | 2026-09-11 |
| Symphony is "powered by Wix AI"; the page offers no model choice, so which model runs is Wix's decision, not the customer's | Wix | `https://www.wix.com/symphony` | 2026-08-24 |
| Symphony is "powered by Wix AI and built on 20 years of real business expertise"; Wix names no model and its product and pricing pages offer no model choice | Wix | `https://www.wix.com/symphony` | 2026-09-11 |
| Wix says Symphony draws on "experience and unique data accumulated in supporting hundreds of millions of businesses worldwide" | Wix | `https://www.wix.com/press-room/home/post/wix-launches-symphony-by-wix-a-new-standalone-multi-agent-system-built-for-smbs` | 2026-09-11 |
| Symphony has a free plan, "no credit card needed", with 500 monthly credits and 100 daily credits; credits "reset monthly and do not roll over" | Wix | `https://www.wix.com/symphony/pricing` | 2026-09-11 |
| Symphony Basic carries 2,000 monthly credits and Pro 5,000 | Wix | `https://www.wix.com/symphony/pricing` | 2026-09-11 |
| Symphony is $16 a month for Basic ($12.80 annually), $40 for Pro ($32), $80 for Max ($64) | Wix | `https://www.wix.com/symphony/pricing` | 2026-09-11 |
| Symphony meters in AI credits: "Each action you take with agents and tools consumes AI credits. The exact amount is calculated after each action, based on its complexity and the tool used." | Wix | `https://www.wix.com/symphony/pricing` | 2026-09-11 |
| Muse is Meta's personal AI agent, announced 2026-09-08, rolling out in the US on iOS, Android and muse.ai, "and coming soon to AI glasses" | Meta | `https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/` | 2026-09-15 |
| Muse "runs on its own dedicated computer in the cloud, contained so no one else's agent can reach it" | Meta | `https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/` | 2026-09-15 |
| Muse is "free for most of what people need, with subscription plans for people who want to do more" | Meta | `https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/` | 2026-09-15 |
| Muse "doesn't share a person's conversations or the data in their VM with Meta's ad systems", and people "can opt out of their interactions being used to train Meta's AI models" | Meta | `https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/` | 2026-09-15 |
| "By default, Muse will not take many important actions, like sending an email, without your approval" | Meta | `https://www.meta.com/help/artificial-intelligence/1687253048996149/` | 2026-09-15 |
| Grok Bot comes with SuperGrok Heavy at $300 a month or Cursor Ultra at $200 a month (Cursor Teams Premium at $120 a seat also carries it); plan cards read in a browser, since xAI refuses fetches | xAI, Cursor | `https://x.ai/bot` | 2026-08-20 |
| Vellum is "A personal AI assistant for your busywork" | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| Vellum says "By default, your assistant runs locally. Your conversation history, memory, and credentials stay on your machine and are never used to train models." | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| Vellum is "native to Mac and accessible everywhere: iOS, Android, web app, voice, email, Telegram, Slack, and terminal" | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| Vellum says it "is open-source, so you can inspect the code yourself" | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| On Vellum, "High-stakes actions like sending emails to new contacts, modifying important files, or spending credits require explicit approval until you mark them as trusted" | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| Vellum is "free to download and start"; its paid plans are Mighty at $30 a month, Super at $100 and Ultra at $200, each described as a computer of a given size (Mighty is "Small computer 1 vCPU / 2 GiB, 10 GB storage") | Vellum | `https://www.vellum.ai/pricing` | 2026-09-16 |
| Vellum meters in credits beyond what a plan includes, "you only pay for what you use", at "$1 = 1 credit" | Vellum | `https://www.vellum.ai/pricing` | 2026-09-16 |
| OpenClaw's own summary of itself is "Open source, Runs on your machine, Nobody's business model" | OpenClaw Foundation | `https://openclaw.ai/` | 2026-09-16 |
| OpenClaw runs on "Mac, Windows, or Linux. Bring hosted, subscription-backed, gateway, or local models. State lives on your machine, not a vendor cloud." | OpenClaw Foundation | `https://openclaw.ai/` | 2026-09-16 |
| OpenClaw "is stewarded by the OpenClaw Foundation, an independent US 501(c)(3) non-profit", and the product is MIT licensed | OpenClaw Foundation | `https://openclaw.ai/` | 2026-09-16 |
| OpenClaw costs nothing: "No subscription. No hosted tier. No token." | OpenClaw Foundation | `https://openclaw.ai/` | 2026-09-16 |
| OpenClaw reaches "WhatsApp, Telegram, Discord, Slack, Signal, iMessage, or any of its 29 channels" | OpenClaw Foundation | `https://openclaw.ai/` | 2026-09-16 |
| Hermes Agent is "The Agent That Grows With You", from Nous Research, free and open source under the MIT license | Nous Research | `https://hermes-agent.nousresearch.com/` | 2026-09-16 |
| Hermes offers both a desktop app and "Deploy to the cloud" through Nous Portal, and installs on macOS 12+, Windows 10/11 and Linux | Nous Research | `https://hermes-agent.nousresearch.com/` | 2026-09-16 |
| Hermes reaches "Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI" and "stores conversations, memories, and skills so you can return to your work in a later session" | Nous Research | `https://hermes-agent.nousresearch.com/` | 2026-09-16 |
| Nous Portal plans for Hermes run from $0 to $200 a month for credits and hosted services | Nous Research | `https://hermes-agent.nousresearch.com/` | 2026-09-16 |
| "Instinct is a personal assistant that understands what you're working on and what's important to you." | Instinct | `https://instinct.com/` | 2026-09-16 |
| Instinct "is currently available to a private access group as we're scaling up compute", reached by waitlist or an existing member's invite | Instinct | `https://instinct.com/` | 2026-09-16 |
| Instinct "connects to your applications and devices - email, messaging, screen, audio, location, and more", and "It's trained to use a phone and a computer. You can text or call it." | Instinct | `https://instinct.com/` | 2026-09-16 |
| Norton Family Assistant "keeps your family organized, so you never miss to-dos, calendar events, and important updates in your life" and "Plugs into the apps your family already uses" | Norton | `https://us.norton.com/products/family-assistant` | 2026-09-16 |
| Norton Family Assistant "Asks first, acts after", and "Your chats are never shared, sold or used to train AI" | Norton | `https://us.norton.com/products/family-assistant` | 2026-09-16 |
| Vellum&rsquo;s mark on `/compare/` is the file vellum.ai serves as its favicon, unmodified | Vellum | `https://www.vellum.ai/favicon.svg` | 2026-09-16 |
| OpenClaw&rsquo;s mark on `/compare/` is the file openclaw.ai serves as its favicon, unmodified | OpenClaw | `https://openclaw.ai/favicon.svg` | 2026-09-16 |
| Hermes&rsquo; mark on `/compare/` is the 48px icon its site declares in its head, unmodified, kept as `assets/mark-hermes.png` | Nous Research | `https://hermes-agent.nousresearch.com/icon.png` | 2026-09-16 |
| Instinct&rsquo;s mark on `/compare/` is the file instinct.com serves as its favicon, unmodified | Instinct | `https://instinct.com/favicon.svg` | 2026-09-16 |
| Wix&rsquo;s mark beside Wix Symphony on `/compare/` is the 192px favicon wix.com serves, unmodified, kept as `assets/mark-wix.png` | Wix | `https://www.wix.com/favicon.ico` | 2026-09-16 |
| Wix publishes its own logo for download and asks only that it not be changed: &ldquo;Download our logo on both white and color backgrounds. We just ask you to please not make any changes.&rdquo; | Wix | `https://www.wix.com/about/design-assets` | 2026-09-16 |
| Vellum's FAQ: "you can switch between models including OpenAI, Anthropic, Gemini, or open weights via Ollama at any time" | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| Hermes' README: "Use any model you want", naming Nous Portal, OpenRouter, OpenAI and "your own endpoint" | Nous Research | `https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md` | 2026-09-16 |
| Hermes' security docs: "Before executing any command, Hermes checks it against a curated list of dangerous patterns. If a match is found, the user must explicitly approve it", with `approvals.mode` of "smart, manual, off" | Nous Research | `https://hermes-agent.nousresearch.com/docs/user-guide/security` | 2026-09-16 |
| OpenClaw's docs on tool and agent permissions: "Full Access, including Default (Full Access), authorizes permitted changes without an approval prompt; restricted runs require human approval" | OpenClaw | `https://docs.openclaw.ai/gateway/security/tool-permissions` | 2026-09-16 |
| OpenClaw's docs on exec approvals: "Commands run only when policy + allowlist + (optional) user approval all agree" | OpenClaw | `https://docs.openclaw.ai/tools/exec-approvals` | 2026-09-16 |
| Grok Bots "finish jobs end to end, and only come back when something needs your approval", and "share a computer of their own in the cloud" (read in a browser; x.ai refuses automated requests) | xAI | `https://x.ai/news/introducing-grok-bot` | 2026-09-16 |
| Instinct's privacy policy: the service is provided with "third-party hosting"; its features "can perform tasks or take actions independently on your behalf, based on the permissions you grant"; it uses "third-party AI model providers who help support the Services" | Instinct | `https://instinct.com/privacy` | 2026-09-16 |
| Norton's FAQ: "Every send, payment and booking waits for your approval", and "The AI providers we use operate under enterprise contracts with zero data retention" | Norton | `https://us.norton.com/products/family-assistant` | 2026-09-16 |
| Cowork's mode selector "offers Auto and Manual (default)"; Manual, "formerly 'Ask before acting'", means "Claude pauses and asks for approval for actions" | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-09-16 |

**Re-read 2026-09-16 for the compare chart, and the docs say what the landing pages do not.** Jett
asked for the chart's "doesn't say" gaps to be filled rather than drawn, so each company's docs,
FAQ and privacy pages were read. Hermes asks by default and can be set not to; OpenClaw acts on
its own by default and can be set to ask; Instinct is hosted and acts independently within
permissions you grant. Those three moved from "doesn't say" onto the chart on the rows above.
Hermes' "you pick the AI company" point, retired that morning as unsourced, is sourced now from
its README. Two gaps stayed gaps, and stay off the chart: nothing on wix.com or support.wix.com
says where Symphony's agents run, and nothing on us.norton.com says where Family Assistant's
work happens. Both pages say the assistant asks first, and the chart's strip says that.

**Logos on `/compare/`, added 2026-09-16 and cut back the same day.** Five marks are live and each
is the file that company&rsquo;s own site serves for itself, fetched that day and named in the rows
above, used only to identify the product in a comparison, which is what the footer&rsquo;s marks note
says every third-party mark on this site is for. Nothing is redrawn. Three are a `favicon.svg`
untouched; two are rasters kept under `assets/` because that is all those sites serve. Four others
were live for part of the day and came off, for the reason the next section gives. These rows
re-read on the same 90-day cadence as the claims.

Drawing a company&rsquo;s logo from memory is both a trust failure and a legal one, which is why the
chart carried initials until these were sourced. **Sourcing settles a different question than
permission**, and getting the first one right is not clearance for the second.

⚠️ **What every one of these companies publishes about their own marks, read 2026-09-16, and it
does not say yes.** Jett asked whether using the names and the logos is legal, so their brand
pages, trademark guidelines and terms were read the same way their product pages are, and the two
halves of the question come out differently.

**The names are settled, and three sources say so.** The FTC's comparative-advertising policy
(16 CFR 14.15(b)) "encourages the naming of, or reference to competitiors, but requires clarity,
and, if necessary, disclosure to avoid deception of the consumer", and its footnote defines this
kind of advertising as one that "identifies the alternative brand by name, illustration or other
distinctive information". The Lanham Act's dilution exclusions, 15 U.S.C. 1125(c)(3)(A), carve out
"any fair use, including a nominative or descriptive fair use ... including use in connection
with ... advertising or promotion that permits consumers to compare goods or services". And
*New Kids on the Block v. News America Publishing*, 971 F.2d 302, 308 (9th Cir. 1992) sets the
three-part test a comparison has to meet: the product must not be "readily identifiable without
use of the trademark", "only so much of the mark or marks may be used as is reasonably necessary
to identify the product or service", and the user "must do nothing that would, in conjunction with
the mark, suggest sponsorship or endorsement by the trademark holder". Two of the companies say it
themselves: xAI's brand guidelines list "Use our Marks only to accurately refer to us or our
services" as a **Do**, and Gen Digital's say "you generally may use NortonLifeLock trademarks to
refer to NortonLifeLock's products or services in advertising, promotional, and sales materials".

**The logos are the other half, and this is where the same authorities stop.** The second part of
the *New Kids* test is the one a logo fails, and the court gave the example in footnote 7 at 308:
"a soft drink competitor would be entitled to compare its product to Coca-Cola or Coke, but would
not be entitled to use Coca-Cola's distinctive lettering." *Toyota v. Tabari*, 610 F.3d 1171, 1181
(9th Cir. 2010) applied it: "use of the stylized Lexus mark and 'Lexus L' logo was more use of the
mark than necessary ... The Tabaris could adequately communicate their message without using the
visual trappings of the Lexus brand." *Playboy v. Welles*, 279 F.3d 796, 804 (9th Cir. 2002) held
the same way, that plain textual references were nominative use and "the repeated, stylized use of
this abbreviation fails the nominative use test".

**And seven of the nine ask for written permission we do not have.** In their own words:

| Company | What their own page says | Where |
| --- | --- | --- |
| Meta | "All usage of the Meta logo requires approval." | `meta.com/brand/resources/meta/our-trademarks/` |
| Anthropic | "You may only use our trademarks as specifically permitted by us and only in materials we approve beforehand." | `anthropic.com/legal/trademark-guidelines` |
| xAI | "We may grant others the right to use our Marks, but you are not permitted to." | `x.ai/legal/brand-guidelines` |
| Gen Digital (Norton) | "You may not use any Gen logos unless you have an agreement with or express written consent from Gen authorizing such use." | `gendigital.com/us/en/legal/trademark-policies/` |
| Nous Research (Hermes) | "Any commercial or promotional distribution, publishing or exploitation of the Nous Research Materials is strictly prohibited unless you have received the express prior written permission from Nous Research" | `portal.nousresearch.com/terms` |
| Wix | "Don't use the Wix Studio company name, logo or identity in your promotional campaigns" | `wix.com/studio/about/brand-guidelines` |
| Instinct | Prohibits third parties who "use, reproduce or remove any ... logo ... displayed on or through the Services" | `instinct.com/terms` |
| Vellum | No trademark or brand policy published. Its terms assert ownership only. | `vellum.ai/docs/vellum-terms-of-use` |
| OpenClaw | No trademark or brand policy published. MIT covers the code and grants no mark rights. | `github.com/openclaw/openclaw/blob/main/LICENSE` |

None of the nine publishes anything at all about comparison charts. Silence is not permission, and
an MIT licence on a codebase is not a licence to its logo. Permission routes exist and are cheap to
ask: Meta's brand request form, `marketing@anthropic.com`, `legal@x.ai`, `trademarks@Gen.com`,
`studiobrandassets@wix.com`, `press@openclaw.org`, `comms@instinct.com`, `support@vellum.ai`,
`support@nousresearch.com`.

**The rule this sets, and it is the same rule as the rest of this file.** A mark stays on a page of
ours only while we can point at the thing that permits it. Today we can point at the name and not
at the logo, so **a competitor's name ships in plain type and a competitor's logo ships only with
that company's permission in hand, recorded as a row here with the date.** The sourcing rule in the
rows above is necessary and was never sufficient: fetching a logo from the company's own server
proves it is their real mark, not that we may publish it. That distinction cost nothing to learn
and would have cost a lot to learn later.

✅ **Settled 2026-09-16, by Jett: take off the logos that are confirmed not allowed, and only
those.** The test that sorts them, and it is the only one that sorts them consistently: **does the
company publish a rule, addressed to third parties, about using its marks?** A term buried in a
terms-of-service binds that company's own users, which we are not; a trademark guidelines page
speaks to everyone, including us.

**Four publish such a rule, all four say no, and all four came off the chart:**

| Off the chart | Their own words | Where |
| --- | --- | --- |
| Meta, beside Meta Muse | &ldquo;All usage of the Meta logo requires approval.&rdquo; | `meta.com/brand/resources/meta/our-trademarks/` |
| Anthropic, beside Claude Cowork | &ldquo;You may only use our trademarks as specifically permitted by us and only in materials we approve beforehand.&rdquo; | `anthropic.com/legal/trademark-guidelines` |
| xAI, beside Grok Bot | &ldquo;We may grant others the right to use our Marks, but you are not permitted to.&rdquo; | `x.ai/legal/brand-guidelines` |
| Gen Digital, beside Norton Family Assistant | &ldquo;You may not use any Gen logos unless you have an agreement with or express written consent from Gen authorizing such use.&rdquo; | `gendigital.com/us/en/legal/trademark-policies/` |

Those four now carry an initial set in the site's own type. **A letter we drew is not their mark**,
which is the point: *New Kids* leaves the name open and closes the distinctive lettering, and an
initial is neither. `assets/mark-norton.png` was deleted with them; `git checkout 3d67a461 --
assets/mark-norton.png` brings it back if permission ever lands.

**Five publish no such rule and keep their icon:** Vellum and OpenClaw publish nothing at all
(OpenClaw is MIT, which covers the code and is silent on marks); Instinct and Nous Research have
only terms that bind their own users; and Wix runs the other way, publishing its logo for download
and asking only that it not be altered, which we have not.

⚠️ **The closest call, recorded because it is close.** Nous Research's portal terms say &ldquo;Any
commercial or promotional distribution, publishing or exploitation of the Nous Research Materials
is strictly prohibited unless you have received the express prior written permission from Nous
Research&rdquo; (`portal.nousresearch.com/terms`). It is a user contract, not a brand policy, and
Hermes itself is MIT, which is why the Hermes mark stayed. If that reading is wrong, Hermes is the
one that comes off next, and nothing else on the page changes.

✅ **Settled 2026-09-17, by Jett, in two steps the same day: the band carries no logos at all.**
This was raised as the note above asked. The first answer was to run the app's allowlist here, which
took 37 marks off and left the 8 with a written grant. Seeing that rendered settled the rest: eight
logos among forty-two lettered tiles reads as a sponsor tier, which is the impression trademark law
says not to create, and the marks had stopped doing the job that justified them. **So every mark
came off both surfaces and every service is named in type.** The hidden sprite, `.ww-mark`, and
about 120 lines recording where each of the fifty logos was fetched from went with them.

**The rule this leaves, and it is simpler than what it replaces:** on this site, a company is named
and not drawn. No exceptions to track, no allowlist to keep in step with the app, and no default
that quietly goes wrong when the fifty-first connector lands. `git show 18318e82^:index.html` has
the sprite and `git show 18318e82^:css/styles.css` the sourcing notes, if a grant ever makes one
worth restoring; the audit that judged each is the Archie repo's `docs/BRAND-MARKS.md`.

**What made names alone survivable** is that every mark got its service's name under it earlier the
same day. Without that the band would have gone from logos to nothing. With it, the figure already
said the thing the logos were there to say, and the pictures turned out to be the removable half.

⚠️ **One correction, kept because the mistake is the useful part.** This file and `FACTS.md`
briefly recorded that the site had been drawing "a generic orange lightning bolt" under the name
Groq. That was wrong. `groq.com/favicon.svg` is a lightning bolt in `#F43E01`, so the site was
drawing Groq's own file; the app draws their rounded-square mark in `#F54F35`. Both are Groq's
artwork and the two surfaces simply disagreed about which. **A mark fetched from a company's own
server can still be the wrong one of their marks**, and a favicon is not what a brand team means by
their logo.

**And the rule for anything new:** a competitor's name ships in plain type, needing nothing. A
competitor's logo ships only where that company publishes no rule against it, recorded as a row
here with the date, or where written permission is in hand. Permission is cheap to ask: Meta's
brand request form, `marketing@anthropic.com`, `legal@x.ai`, `trademarks@Gen.com`,
`studiobrandassets@wix.com`, `press@openclaw.org`, `comms@instinct.com`, `support@vellum.ai`,
`support@nousresearch.com`.

**Re-read 2026-09-11, before the soft launch, and the Symphony rows moved.** Three findings, and
two of them were live on `compare/cloud-agents/`:

1. ⛔ **"Run as a standalone cloud service on Wix's own servers" had no source and is deleted.**
   Nothing on `wix.com/symphony`, the pricing page, the overview article or the launch press
   release says where Symphony's agents run. It reads as an obvious inference from the product's
   shape, which is exactly the kind of sentence this section exists to stop: an unsourced claim
   about another company's infrastructure. What their pages *do* support is how you reach it, and
   that is what the rows now say. The honest and checkable form is that Symphony is a service you
   sign in to with a Wix account, in a browser or its phone app, and that **Wix does not publish
   where the agents run**. Not publishing it is a fair thing to point out; guessing it is not.
2. ⛔ **The free plan's daily cap doubled, from 50 to 100.** `compare/cloud-agents/` printed 50 in
   two places. A competitor's number that moved in our favour is still a false number.
3. ⛔ **The "300M Wix businesses" quote is no longer on the page** and is retired. The live page
   says "powered by Wix AI and built on 20 years of real business expertise"; the press release
   says "hundreds of millions of businesses worldwide". Neither is 300M, so the row is replaced by
   the two sentences that are actually there.

⚠️ **And one finding that cuts against us, recorded because that is the rule.** Symphony publishes
an approval gate of its own: "It checks with you first before your agents act, so nothing important
happens without your approval." No page may imply Symphony acts unchecked, or that asking first is
something only Archie does. The difference worth writing about is **whose computer the work happens
on and which AI company answers**, not who asks permission.

### Muse, read 2026-09-15, and the claim it does NOT support

**Why this block exists.** Jett asked for copy contrasting our support with Muse's on 2026-09-15.
The research was done and **the support claim does not source**, so it did not ship. What follows
is what the reading actually established, so nobody repeats the attempt from memory.

⛔ **We may not say Muse gives you no human help, in any wording.** Meta's published support
surface for Muse is Help Center articles (`meta.com/help`), and no way to reach a person about
Muse was found. **Not finding one is not the same as there not being one**, which is the boundary
immediately below: absence from the pages we can read is not absence from the product. Meta runs
account-support channels for other products, `muse.ai` itself redirects signed-out visitors to
`auth.muse.ai` so the product site cannot be read without an account, and a company that size is
the least safe subject for an absence claim. The honest form, if a page ever needs one, is that
**Meta does not publish a named human contact for Muse**, and even that earns its place only
beside what we *do* publish, which is the checkable half.

⚠️ **Two findings that cut against us, recorded because that is the rule.**
1. **Muse asks before it acts.** "By default, Muse will not take many important actions, like
   sending an email, without your approval." That is the third competitor with an approval gate,
   after Symphony and Grok Bot. No page may imply that asking first is something only Archie does.
2. **Meta makes a privacy commitment on Muse**, including no sharing with ad systems and a
   training opt-out. A comparison implying Meta offers no privacy position on this product would
   be false, whatever anyone's priors about Meta are.

✅ **Where the sourced contrast actually is, and it is a strong one.** Meta's own sentence is that
Muse "runs on its own dedicated computer in the cloud". That is custody, it is in their words, and
it is the wedge `compare/cloud-agents/` already argues. A Muse row belongs on that page, not on a
support page.

⚠️ **Not verified at source: the $20 and $100 subscription prices.** TechCrunch reports "Power at
$20/month and Maximum at $100/month" and Meta's Help Center confirms a free tier with paid
subscriptions, but Meta's own pricing page was not readable (the auth wall above). **No Muse price
may be printed until somebody reads it on Meta's own page**, and neither figure is in FACTS.md.

**Boundaries — do not cross:**
- ⚠️ ChatGPT's prices are in the table above as of 2026-08-19, read off the pricing page in a
  browser because `openai.com` and `chatgpt.com` return 403 to any fetch. Those rows are the
  ones most likely to rot: nothing automated can re-check them, so when the date comes due
  somebody opens the page. (The same constraint still keeps the OpenAI entry in the
  provider-training block a paraphrase, which has not been re-read.)
- ❌ Never print a salary figure for an assistant. There is no row for one and no source we can
  point a reader at. The comparison argues on what the work looks like, not on a wage, and the
  page says why: pay swings by country, seniority and hours further than one number can carry.
- ❌ Never claim a competitor *cannot* do something on the basis that their marketing page did
  not mention it. Absence from a pricing page is not absence from the product.
- Re-read every source before any launch or press push, and update the dates. A stale
  comparison is a false claim about somebody else's company.

### The assistants board: five companies read for the first time, 2026-09-16

Read to put a whole-category comparison on `compare/`, after Jett asked for something in the
shape of Vellum's own "AI Assistants Leaderboard". **The thing worth knowing about that page is
what it does not have:** it ranks four products across six "category winner" dimensions and a
platform grid, and it carries no citation, no methodology and no date. Vellum is on it, and
Vellum wins. So the format is worth taking and the practice is not, and the whole of our version
is that every cell links to the sentence it came from on that company's own page.

**Five new companies, all rows above:** Vellum, OpenClaw, Hermes (Nous Research), Instinct, and
Norton Family Assistant. With Claude Cowork, Grok Bot, Wix Symphony and Meta Muse already
sourced, that is nine, and it is the whole of what any assistants board on this site may name.

**⛔ Norton's article about Instinct is not a source for a claim about Instinct.** `us.norton.com`
published "is-instinct-safe", which says Instinct "can make purchases on your behalf using
payment methods that you have shared" and that data "may help train AI models" unless the user
opts out. Both would be useful to us, the first especially, since it is the exact thing
`screen/guard.rs` refuses. **Neither may be printed.** Norton is a competitor writing about a
competitor, which is the weakest possible source for an unflattering claim, and the rule at the
top of this section says the company's own public page. Instinct's own site says neither thing.
If we want either claim, somebody with an invite reads Instinct's settings and terms, and it
gets a row of its own. Until then it does not exist.

**What Instinct's own page does not say is itself the finding**, and it is the Symphony shape
from 2026-09-11 again: Instinct publishes no price, no statement of where it runs, and nothing
about approval before it acts. Saying so is fair and checkable. Guessing the answers is not, and
"currently available to a private access group as we're scaling up compute" is a sentence about
their capacity, not a disclosure of their architecture. The board's cell for them reads that they
do not publish it.

**Two rows that cut against us, and they stay.** Vellum's "By default, your assistant runs
locally. Your conversation history, memory, and credentials stay on your machine" is the same
custody claim we make, from a product that is also open source and also reaches a phone. And
OpenClaw costs nothing at all: "No subscription. No hosted tier. No token." A board that omitted
either would be Vellum's page with our logo on it.

**Where Vellum's local claim stops, and the only honest way to put it.** Their paid plans are
sold as computers, by size: Mighty is a "Small computer 1 vCPU / 2 GiB, 10 GB storage" at $30 a
month, the same price as Archie's month. A plan denominated in vCPU is a plan that runs
somewhere, and "by default ... locally" is scoped wording that invites the inference that the
paid tiers are not. **Do not print that inference.** What the two pages support together is that
Vellum is local by default and sells hosted computers by the month, and a reader can draw their
own conclusion from their own words. The banned form is any sentence asserting where a Vellum
paid plan executes.

---

## Change Process

1. A new claim requires a pointer to the code path that makes it true. No pointer, no claim.
2. A claim whose code path is deleted or changed is **dead** until re-verified. Ripping out a
   feature means ripping out its copy in the same PR.
3. Re-run the full egress audit before any launch, funding round, or press push. The audit is
   the only thing standing between us and a claim that quietly went stale.
4. The owner named at the top has veto. Not consensus — veto.
