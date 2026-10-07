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
    the free starter credits; connect an AI account of your own and it starts." **A second
    approved form, for marketing copy, added 2026-09-21 in a plain-words pass:** "Email features
    need an AI account of your own. The free starter credits will not run them." It states the
    condition first and drops "refuses to", which reads as the app being difficult rather than
    as a limit of the funding. ⚠️ **Do not write "the starter credits do not cover them."**
    Cover is a billing word and this is not a billing limit: no quantity of starter credits ever
    runs an email feature, and a reader told about coverage will reasonably go looking for more
    credits. The words that carry the claim are **will not run**. The privacy
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

### ✅ We are paid by the people who use Archie, and by nobody else

**Added 2026-10-06**, when the investor pitch's strongest line ("their prize is your data; ours is
your subscription") was carried to the site without naming anybody. The site had never said how
Otian makes money, which is the first question a reader asks about a product with a free tier.

**Approved wording:** "From you, and nobody else: the plans on this page and setup help at $250 an
hour. We run no ads, take no sponsors, and never sell, rent or broker customer data. On your own AI
account, we add nothing to your AI bill."

**Why it's true:** it is a published commitment, not a code claim, so its pointers are documents.
`standard/index.html:428` ("We are paid by the people we serve, and by nobody else") and `:430`
(what that forecloses: advertising of any kind, paid placement, selling, renting or brokering
customer data); `standard/index.html:317` (no selling, renting, brokering or trading customer data,
"Not aggregated, not anonymized"); the Terms of Service, which say the AI provider's cost "is not a
fee we charge, collect, resell, or mark up" (FACTS.md, `0%`). The revenue lines that exist are the
Stripe products on `archie/pricing/` (Personal, AI included, Business) and the `$250` hour on
`services/`. The no-ads half is also true in code: "We ship no telemetry and no analytics" below.

**Boundaries, do not cross:**
- ⚠️ **"We add nothing to your AI bill" is scoped to your own AI account.** On the AI-included plan
  and on the free credits we buy the AI, so the unscoped "we make no money on AI" is not this claim.
- ❌ Never name another company's business model in the same breath. The reader draws that contrast;
  the site does not draw it for them (CLAUDE.md, "Two starting points": no blame, no fear).
- ❌ Never "we can't sell your data because we don't have it" unscoped. We hold your email and the
  records under What We Hold; the commitment is that we sell none of it.
- ⛔ **A partnership that pays us breaks this claim the day it is signed.** Venice, a referral
  bounty, a sponsored add-on: any of them takes this entry down first, and the Standard says none
  of them will happen.

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

**Scoped 2026-09-27: "we keep no copy we can read."** The homepage's custody heading says it that way. With phone access on, messages to and from the phone sit on our server sealed with a key we never receive (the Archie Mobile entry below), so an unscoped "we keep no copy" on a page that also sells the phone app would be the absence claim the Banned Phrasings table forbids. "Never a conversation we can read" is the same scope in a holdings sentence.

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
write to your agent passes through our server on the way to Anthropic. It writes down what each
request cost and never what it said, we keep no copy, and we use none of it for anything. Email and text replies are the two things it
will not do on this plan, because they carry what other people wrote and those people never agreed
to anything. Both work on an AI account of your own, where nothing goes through us at all. When
the $25 is used, your agent pauses until next month."

*(Corrected 2026-09-27: it said "It writes nothing down". The server records the account ID, token
counts, amount, time and call count for each request so it can enforce the allowance, which trust/
already said in its own table; the approved sentence now says the same.)*

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

### ✅ On the two lanes that run on our AI account, each person's calls carry a tag, and we can turn that AI off for one person

**Added 2026-10-04. Built in the Archie repo and not yet deployed; nothing on the site says it yet.**

**The claim**, as somebody would say it: "When you use the free credits or the plan with the AI
included, each request carries a code that stands for your account, so Anthropic can tell people
apart when it checks for misuse. If somebody breaks the rules on those plans, we can turn off the AI
on our account for that one person, without touching their license or the rest of Archie."

**Why it's true** (Archie repo):

- `stripe-webhook/credits.js`, `rewriteForTrial`: sets Anthropic's `metadata.user_id` from a tag
  the relay chose. `metadata` is not in `FORWARDED_FIELDS`, so a client cannot set it or forge
  somebody else's. Metadata is not prompt text and costs no tokens.
- `stripe-webhook/index.js`, the `/trial/v1/messages` route: the tag is `trialHash("user:" + uid)`,
  the same salted, truncated sha256 as the device and IP stamps. It is kept on `credits/{uid}` as
  `relay_tag`, written inside the hold transaction the call already makes, so a tag Anthropic reports
  can be found. The same route refuses with `ai_stopped` when `credits.isStopped` reads
  `ai_stopped_at_ms`, and the message says why, where to write, and how to keep going on an AI
  account of their own.
- `setAiStopped` and the `stop` and `restart` actions on `/admin/credits/plan`, pressed from either
  staff console (`admin/tiers/index.html` here, `src/app/admin.tsx` in the app). `renewPlanLedger`
  and `endPlanLedger` spread the old ledger, so a monthly refill cannot undo a stop, and
  `stripe-webhook/credits.test.js` pins that.
- The runbook is `docs/MISUSE.md`.

**Required clauses, before anything public says it:**

- The privacy policy's free-credits paragraph gets one sentence about the tag (drafted in the Archie
  repo, `docs/drafts/HARMFUL-USE-TERMS.draft.md`, section 5). It lists exactly what that server
  records, so it is wrong the day the relay deploys without it.
- `trust/#what-we-hold` names "the ledger's device and IP stamps". The account tag is a third stamp
  of the same kind and the list has to say so, since that page is the one allowed to claim it is
  complete.

**Boundaries, do not cross:**

- ❌ Never "we monitor for misuse" or "we watch for abuse". The relay logs no request and no reply,
  and nothing in Archie lets us see what anybody does. What we act on is a report, or Anthropic
  writing to us about a tag.
- ❌ Never "anonymous". The tag is a stand-in Anthropic cannot turn into an account, and we can, on
  purpose: that is what makes a letter from Anthropic something we can act on. "Anthropic cannot tell
  who you are from it" is the true shape.
- ❌ Never imply the stop reaches an AI account of the customer's own, their license, or anything on
  their computer. It covers the two lanes on our account and nothing else. Ending a license is a
  separate step.
- ❌ Never "we can remove a harmful add-on from your agent". Setting an add-on private takes it out of
  the store; nothing reaches a copy already installed (open thread in Archie's
  `docs/OPEN-THREADS.md`).
- ❌ Never claim the tag or the stop for somebody on their own AI account. Their calls never touch
  our server.

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

**A third thing goes out, recorded 2026-09-27: error reports.** Approved wording: "Crash reports
and error reports, if you leave them on: where in our code it broke, the error line when something
keeps failing, and, for an add-on, its name and the tool that failed. Never what you wrote." Every
caller of `telemetry::queue_report` in 0.3.0 sends one: `addon_health.rs` ("{add-on}: {tool}
failed {n} times in one session"), the gateway restart loop with its last error
(`gateway_lifecycle.rs`), and the audit, vault and restore failures (`src-tauri/src/lib.rs`). The
same switch turns them off. ⛔ Never "no error text leaves": a restart loop sends its error line.
So a page counting what goes out says three things, not two (archie/install/ was corrected the
same day).

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

**Amended 2026-08-07: there is now an off switch, and it is real.** The app's Settings page, under
Privacy, carries the switch and the full list of what is in one.
*(Corrected 2026-08-21: this said Account, and the pages were split; a claims file wrong about
which screen of our own app holds a switch is the cheapest kind of wrong to fix.)*
*(Corrected 2026-09-28: the Crash reports section became the first card of Privacy when Settings
went from seven sections to five, and the in-app list names error reports now as well, so it counts
three things, as this entry has since 2026-09-27.)* Off stops the
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

### 🚧 "How did you hear about Archie?" at the end of setup: BUILT 2026-10-05 (Archie b2f2c7fc), IN 0.3.6 BUT SWITCHED OFF, and its route is deployed

*Checked October 6, 2026, at the 0.3.6 release: the question ships switched off (`HEARD_FROM_LIVE` is
`false` in Archie `src/app/heard-from.ts` at the release commit `59a674e6`), so nobody is asked. The
route is live: an unsigned POST to `/account/heard-from` gets 401 where a made-up route gets 404. What
is left before any page says it: switching it on, and the privacy policy's line.*

Built at Jett's ask, from the spec in Archie's `docs/GIVE-A-FRIEND-A-MONTH.md`, because nothing
before sign-in is counted and nobody can tell which channel brought someone. **Two gates before
any page says it:** a release has to carry it, and the billing service has to be deployed with
its route, which waits on the CASA freeze (the service "is frozen until the assessor signs off",
`stripe-webhook/index.js`). A release before the deploy would show every new person a question
whose answer fails to save. The privacy policy gains its line in the same pass as the deploy.

**Approved wording, once it ships:** "At the end of setup Archie asks how you heard about it.
Answering is optional: nothing is sent unless you press an answer, and then only that answer,
kept on your account."

**Why it's true:** `HeardFromQuestion` (`src/app/intro.tsx`) sends only from a button press,
through `account_heard_from` (`src-tauri/src/commands/market.rs`) and `record_heard_from`
(`crates/archie-core/src/purchases.rs`) to `POST /account/heard-from`
(`stripe-webhook/index.js`), which takes the uid from the verified token, accepts only the seven
ids in `stripe-webhook/heard-from.js`, and writes the one field `heard_from` on `users/{uid}`
with `update`. No free text, no device, no timestamp field. `/account/delete` removes it with the
account. Staff see counts only (`tallyHeardFrom` in `/admin/summary`).

**Boundaries:**
- ⛔ **Never "anonymous".** The answer is on the account, and anyone with console access can read it.
- ⛔ **Never "asked of everyone".** It is on the send-off that ends the first walk, so anyone who
  presses Skip on the walk, or set up before this shipped, is never asked.
- ⛔ **Never "nothing else is sent".** The request carries the sign-in token and arrives from the
  computer's address, like every request.
- ⚠️ **The no-analytics entry above counts what goes out.** Once this ships, a page that counts
  those things names this one too, as sent only when you press an answer, and never files it under
  the crash-reports switch, which does not govern it.

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

**Amended 2026-09-21: changing it is a sentence, not a settings trip, and that shipped in 0.2.5
on 2026-09-15.** Approved wording: "Ask your agent to use a different AI company and it does.
'Use ChatGPT instead' is the whole of it. If you have not saved a key for the one you asked for,
it says where to paste one rather than just refusing." The tool is
`crates/archie-runtime/src/gateway/tools_ai.rs`, offered where the toolkit is assembled
(`gateway/turn.rs`), and it moves the same two settings that live on Setup under Response
quality: which company answers, and how much thinking a reply gets.

**Three boundaries on that sentence, all of them in the code:**
- ⚠️ **It is interactive only.** A routine cannot reach it, deliberately: both changes restart
  the gateway, so a schedule that could switch AI could take the agent down mid errand with
  nobody watching. Never write "your agent picks the model", which implies it chooses on its
  own. It changes because **you asked**, in a conversation.
- ⚠️ **It is one of the eight switches** in "What it can do" (see that entry above), on by
  default and able to be turned off, after which the agent names Response quality instead of
  pretending it never could. Copy claiming the capability must not imply it is unconditional.
- ⛔ **Never say "switch and keep going".** The change restarts the agent. That is a few seconds,
  not a migration, and saying so is better than letting somebody discover it.

**What this is allowed to support, and what it is not.** It is fair to say the agent you built is
not tied to one AI company, and that a better model from any of them is a setting rather than a
rebuild: the agent, its skills, its routines and its memory are yours on your disk (see the entry
on the one file below) and none of them are a provider's. It is **not** a claim that Archie is
model-agnostic in quality, that every provider does every job equally well, or that we have
benchmarked them. We have not. Say what moves, not what performs.

### ✅ A model on your own computer, found and checked before anything binds to it (SHIPPED 2026-09-01, Archie 0.2.2)

**Added 2026-09-18, and it should have existed on 2026-09-01.** This capability shipped, and
`compare/building-it-yourself/` spent seventeen days conceding the opposite to readers: "Archie
connects to a hosted provider, so on that one axis a local model beats every hosted setup, ours
included." Two competitors publish local models as a feature. We shipped one and argued against
ourselves with it. See the note under the mail entry: the failure mode is a file that records what
we cannot do and is never re-read when we can.

**Approved wording:** "Archie can run on a model on your own computer instead of an AI company's.
It looks for Ollama, LM Studio and llama.cpp on this computer, hands what it finds a tool to see
whether it can use one, and offers to bind it only if it can. With one bound, what you type goes to
that model instead of to a provider."

**Why it's true:** `crates/archie-net/src/local_llm.rs`. `RUNNERS` is a fixed list of three
loopback ports rather than a scan, which is the same inversion `docs/LOCAL-DEVICES.md` applies to
lights: what a person may point Archie at is not what Archie may point itself at. `probe()` and
`preflight()` reach the app as `local_llm_probe` and `local_llm_preflight`
(`src-tauri/src/lib.rs`, `src-tauri/src/commands/mod.rs`), and the connect screen calls both
(`useLocalModel` in `src/app/connect.tsx`). Below that module there is no special case: a local
model rides `LlmProvider::Custom` in `crates/archie-net/src/providers.rs` as an address and a model
name, the same path as any other OpenAI-format endpoint a person supplies.

**Boundaries — do not cross:**
- ⛔ **Never "your data never leaves your device."** It is in the banned table and it stays there.
  A bound local model changes where the **model call** goes and nothing else. The services you
  connected are still reached when a skill uses one, the web tool still fetches pages, and the
  licence assertion still reaches us.
- ⚠️ **The catch ships in the same breath, and it is not a small one.** Nothing binds until the
  model has been handed a tool and has actually called it, because a model that writes good prose
  and never calls a tool makes an agent that sounds fine and does nothing. That is the ordinary
  behaviour of a small model, which is what somebody trying this for the first time is likeliest
  to have pulled. Any sentence offering this carries that sentence too.
- ⛔ **No number, of any kind.** No minimum model, no size, no speed, no quality comparison against
  a hosted provider. Nobody has benchmarked one for the agent lane.
- **What the app itself got wrong, until October 5, 2026** (the reviewer pass, fixed and not yet in
  a release). The local card said "Nothing leaves this computer, and there is no bill" and "around
  20B or larger", breaking both boundaries above, while the agent on that same binding was told
  everything typed went "over the internet to Another provider" on a bill that does not exist. The
  card now says what you type goes to the model instead of an AI company and that mail, calendar,
  web pages and Archie's own checks still use the internet; the agent names the model and the
  runner and says the same; an Ollama model whose id ends in "-cloud" is said to run on Ollama's
  servers; and a closed runner is named instead of the WiFi.
- ⚠️ **Not the default and not the trial.** It is bound inside the "Another provider" panel, which
  is the only place it can be bound. Never draw it as the way Archie normally runs.
- ⚠️ **Three products on the compare board publish something similar** and two of them explicitly:
  Vellum names Ollama, OpenClaw says "Bring hosted, subscription-backed, gateway, or local models",
  and Hermes offers "your own endpoint", which is close but is not the same sentence. This is not a
  thing only we do, and no page may say it is.

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

**Narrowed 2026-10-07: the request reaches GitHub through Cloudflare** (see "This website, and
what it asks your browser for"), so Cloudflare's servers see the IP address and the timestamp
too. What our Cloudflare account keeps was not checked, so until it is, say that no server of
ours answers the update check, and not that we hold no logs of it.

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

**Approved wording:** "Your agent's Setup tab has a section called 'What it can do', with a switch
for each of eight abilities. Every one is on until you turn it off. Turn one off and the agent
stops offering it, and each message you send costs a little less. Ask it for the thing anyway and
it tells you which screen turns it back on, rather than pretending it never could."

**The eight, in the words on the screen.** Under *Jobs it does for you*: set reminders; save files
to this computer; look up what it has been doing; read the web. Under *Changes it can make to
itself*: build new skills and routines; add and remove add-ons; start and pause routines when you
ask; change which AI answers. Each row names where the job still gets done with the switch off (a
routine for a repeating nudge, the Jobs tab for the record, the Marketplace for add-ons, the Build
a skill tab for a skill, each routine's own card, Response quality for the AI settings).

**Why it's true:** seven are fields on `archie_domain::AgentAbilities`
(`crates/archie-domain/src/skill.rs`), stored on the agent's own manifest and every one defaulting
to on, so an `agent.json` written before the screen existed has all of them. The eighth, the web
switch, is the older `AgentBundleManifest::no_web_access` and is the one field stored in the
negative, because renaming a field every agent on disk already carries is a data migration; the
screen draws it positive like the rest. Both are written by `agent_abilities_set` and
`agent_no_web_access_set` (`src-tauri/src/commands/mod.rs`) and read once at gateway start
(`src-tauri/src/commands/gateway_lifecycle.rs`). Each switch gates its own tools where the belt is
assembled (`crates/archie-runtime/src/gateway/turn.rs`), and the ones the prompt also claims in
words (reminders, saving files) are gated in the same expression that builds the toolkit section,
so the prompt cannot describe a belt the turn is not holding.

**Why the agent names the screen:** with anything switched off, the turn carries one sentence
listing what is off and the single screen it goes back on
(`prompt::switched_off_note`). Without it the agent obeys its standing rule that a no is never the
whole answer, and goes hunting through the add-on store for a reminder add-on that does not exist.
Naming the setting is the difference between a switch and a dead end. Nothing is added to the
prompt for an agent with nothing switched off, which is every agent until somebody opens that
screen.

**Boundaries, and one of them is a number.**

- **No figure for the saving may be quoted anywhere, by anybody, yet.** What is known is read off
  the code, not off a bench: the seven groups run from roughly 235 to 1,825 tokens of tool
  descriptions carried on every interactive turn. Nobody has run a live agent for a month with
  switches off and priced it. Until `cost_bench` does, the claim is "a little less", and "a little
  less" is the ceiling.
- **Never call this a safety feature in general.** One of the eight is about safety and seven are
  about an ability not being wanted. The web switch's own claim is the one in the websites section.
  Switching an ability off withholds its tools and `execute_tool` refuses what was never offered,
  but that is not what any of the other seven are for.
- **Never say it turns off a skill you installed.** It does not. It narrows what the agent offers
  in conversation; the Skills tab is where an add-on is removed.
- **Never say the agent loses the job.** Every row names where the job still happens, and the claim
  above only holds because they do.
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

### ✅ Why there is a store: your agent takes on the jobs you pick (entry written 2026-09-25)

**Approved wording:** "Your agent takes on the jobs you pick, so it fits the way you work, and each
reply costs less than it would if it came with every one of them." On the site under the heading of
`skills-marketplace/browse/`. Jett's to reword; the claim is what is checked here, not the words.

**Why it's true:** an add-on reaches a reply only on an agent that has it. The toolkit a reply
carries is put together per message from what that agent has installed and connected
(`crates/archie-runtime/src/gateway/turn.rs`, where the belt is assembled), and the router only
chooses among installed skills. The last two tools that rode every agent regardless, flights and
video, are carried only when an installed skill uses them since Archie commit `ea957de1` (built
2026-09-25, in 0.3.1 and every release since; before it, those two were the exception to this sentence). The
app says the same on its own Marketplace screen (`src/app/marketplace.tsx`, Archie `c7121365`).

**The boundaries:**
- ⛔ **Never describe what an add-on adds to a reply.** The rule in the entry above governs: the
  outcome is public, the mechanism is the company's.
- ⛔ **No figure.** Nobody has priced an agent with every add-on against one with a few. "Costs
  less" is the claim, and it has no number.
- ⛔ **Never say the agent does nothing but the jobs you pick.** It answers questions, sets
  reminders, remembers what you tell it and keeps files, with nothing installed. "Takes on the jobs
  you pick" is about the store's jobs.
- ⚠️ **Picking is not buying.** Every add-on is included; never let this read as a price per add-on.

### ✅ What other agents charge per unit, and the like-for-like caveat

**Approved shape:** a table on `compare/cloud-agents/` (and one row on the automation
comparison; the Symphony page merged into `compare/cloud-agents/` on 2026-09-18) that prints each company's own unit at its own price, with a numbered
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
Never a per-task figure a company does not publish: Symphony, Manus, Genspark, Grok Bot,
Perplexity's Computer and, since 2026-09-30, OpenAI's Dots publish none that survive their own caveats, so their rows say "not
published" or do not exist.

### ✅ What "own" means in "Don't rent your agent. Own it." (entry written 2026-09-28)

**Written because the tagline had no entry.** "Own it" is on the homepage h1 and every footer, and
until today nothing in this file said what it covers. The retired claim at the top ("you own
Archie") shows what happens when the word runs loose: it was read as owning a software license,
and that stopped being true in July. This entry scopes the word to what is true now.

**Approved wording:** "Your agent is yours. What it is made of, what it remembers and what you
built for it live on your own computer, and you can save all of it to one file and restore it
there. If you stop paying, nothing on your computer is deleted, and a personal agent keeps working
at 20 jobs a day on an AI account of your own. If we close, the Terms oblige us to publish a final
version of Archie that needs no license check."

**Why it's true:** four entries already in this file, each with its own code pointer. The agent's
files live on the computer and no server of ours holds them ("No Otian custodian" above). The file
is "Your whole agent in one file, and no key is in it" (`transfer.rs`). What happens after a plan
is "What happens when a plan ends" (the free tier, `own_ai_key`). The final version is the Terms'
own sentence (`terms-of-service/index.html`, "If Otian AI ceases operations"), and the 60-day
license note that makes it matter is "The subscription gate is fail-open".

**Where it ships (2026-10-05):** the first two items under `compare/cloud-agents/#owning-heading`,
"What owning your agent means" and "If you stop paying, or we close", which is where the homepage
h1's "Own it." links. The egress clause sits in the first item beside "on your computer", as the
boundary below requires. If this wording changes, that section changes with it.

**Boundaries:**
- ⛔ **Never "you own Archie" or "Archie is yours".** The app is sold as a plan. The word covers
  **your agent and what you built**, never the software license.
- ⛔ **"Own" never covers the thinking.** An agent thinks through an AI company's account unless
  a model on the person's own computer is bound, and that is neither the default nor the trial
  ("A model on your own computer" above, whose catch travels with any mention of it). So wherever
  "own it" sits near "on your computer", the arrow to the AI company stays in the same sentence or
  the same figure, as the custody entry requires. *[Corrected 2026-10-01: this line said "every
  agent", which local models made false in 0.2.2. Even with one bound, "own" never stretches to
  "nothing leaves your computer": connected accounts, web lookups and the license check still go
  out, and "your data never leaves your device" stays banned.]*
- ⛔ **Never a portability claim.** The file restores into Archie and nothing else reads it
  ("Your whole agent in one file" says why). "Yours to keep" means you can leave us; it never
  means you can take the agent to another assistant.
- ⛔ **Never "it runs forever without us".** It runs on its last license note for up to 60 days,
  and after that the Terms' final version is what has to hold.
- ⚠️ **Archie for Business has no free tier**, so after a business plan ends the app asks for a
  plan. Nothing is deleted there either. A page selling "own it" to a team says the first half.
- ⚠️ **The shutdown term is with a lawyer** (Jett's direction of 2026-09-28: keep it firm, add a
  court-or-law exception, and build the no-license switch now). If its wording changes, the last
  sentence of the approved wording changes with it, the same day.
- **The no-license switch is built (Archie `0b8e7644`, October 6, 2026), and no binary of it
  exists.** `--features final-build` (`FINAL_BUILD` in `src-tauri/src/auth.rs`) answers yes to every
  access decision, reads the license as `lifetime`, makes no call to verify, and adopts the account
  that owns the oldest workspace when nobody is signed in; `FINAL=1 ./scripts/release-macos.sh` and
  the Windows workflow's **final** box build it. Procedure: Archie `docs/FINAL-BUILD.md`. It type-checks
  and its owner rule is tested; it has never been built and opened (`docs/TEST-DAY.md` item 26b).
  **Say nothing new on the site about it yet.** The approved wording already promises the final
  version; "it's already built" is a claim about readiness that waits on 26b, and on who can build it
  if Jett cannot, which is undecided. ⚠️ **One dependency found building it:** installed copies find
  updates through `https://otianai.com/archie/b/<id>/latest.json`, so the final version reaches them
  automatically only while the domain is registered. A closing that lets the domain lapse strands
  every copy that has not updated, at 60 days.

### ✅ Venice works through "Another provider" (entry written 2026-09-28; the guide shipped in 0.3.0)

**Approved wording:** "The dashed tile is for any AI service that works like OpenAI's, such as
Venice." Or, where there is room: "Venice isn't one of the seven in the list, and it still works:
pick Another provider and paste its address, a model name and a key, copied from Venice's own
docs."

**Why it's true:** the Archie repo's `data/marketplace/resources/connect-custom.json` is the guide
for the "Another provider" row, and since `4608e429` (2026-09-18, in 0.3.0) it carries Venice as
its worked example: the address `https://api.venice.ai/api/v1`, the key made in Venice's API
settings, and the model name copied from their list. The row itself is `LlmProvider::Custom`, an
OpenAI-format endpoint the owner names. `docs/OPEN-THREADS.md` ("An eighth AI provider is reachable
without being one") records the decision that Venice stays there rather than becoming a named
provider.

**Boundaries:**
- ⛔ **Venice is not one of the providers, and no page counts it as one.** The count stays seven
  (FACTS.md), and it has no row of its own in the picker and no spend estimate on `archie/pricing/`.
- ⛔ **No claim about what Venice does with what it receives.** No privacy, retention or compliance
  sentence about Venice ships on our pages, the same rule the Venice partnership notes set. What
  Venice promises is Venice's to say, and a reader is pointed to Venice's own pages for it.
- ⛔ **No Venice logo on the roster.** Venice's brand kit permits one (the Archie repo's
  `docs/BRAND-MARKS.md`), and it still stays off: every company on the site is named in type (the
  one exception is a sign-in button that opens that company's own sign-in), and one mark among name
  tiles reads as a sponsor.

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
looks. The record stays on your computer, we never see it, and on Archie for Business you can
export the whole thing."

*(Corrected 2026-09-28: it said "you can export the whole thing" with no edition, and
`trust/` said "Archie will hand you the whole record as a file". The personal build refuses:
`audit_export` returns "Exporting the record is part of Archie for Business." when
`IS_BUSINESS` is false (`src-tauri/src/commands/mod.rs:864-865`), and has in every release
since cc56e6e6 of 2026-08-21. Never say a personal owner can export the record.)*

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
  from, so a new computer adds them again. Say that, **and say the backup file in the same breath**
  (added October 6, 2026): it carries every add-on on each agent, with the setup answers and each
  routine's times (Archie `docs/BACKUP-FORMAT.md`, the `workspaces/` table; see "Your whole agent in
  one file"). `trust/` and `trust/details/` used to say "nothing on our side can put your add-ons
  back on a new computer: you add them again there", which was true of us and left the reader
  thinking nothing could. "Without a backup, you add them again" is the true form of the old line.
- ⛔ The retired claim "Anything you buy is tied to your Otian account, so another computer can
  add it again without paying twice" must not return: there is nothing bought to tie.

### ✅ Archie on your phone: an encrypted mailbox we hold and cannot read (SHIPPED)

**Status 2026-08-06:** live. The Firestore rules are deployed, the feature is in the shipped app,
and the "What We Hold" amendment below has landed on all five pages. It is still off unless somebody
turns it on, per computer, which is a fact the wording has to keep carrying.

**Amended 2026-09-18, and it changes what may be said about this, not whether it is true.** The
mailbox had two clients: a web page at `otianai.com/phone`, and the Archie app. The web page was
decommissioned that day and deleted from this repo, so **the app is the only thing that can read
the mailbox now**, and the app is in neither store (see the entry below, which is still IN BUILD).
Every word of the approved wording is still true of the mechanism. What is no longer true is the
implication a reader takes from it, which is that they could go and do this today.

So, until the app ships: **do not put the approved wording on a page as something a reader can
reach for.** It stays available for what it was always strongest at, which is answering "what do
you hold, and can you read it" in the What We Hold sections, where it describes custody of
something the reader may already have switched on. A page that instead *invites* somebody to turn
phone access on has to carry the app's status in the same breath, in the tense the entry below
requires. The day the app is approved, this amendment comes out and the entry below moves to
SHIPPED, in one pass.

**Approved wording:** "Turn on phone access and your computer starts leaving
messages for your phone in a mailbox on our servers. Every one of them is sealed with a key your
computer makes and gives to your phone by scanning a code. The key never passes through us, so what
we hold is a pile of ciphertext with no way to open it."

**Why it's true:** payloads are sealed with AES-256-GCM before they are written
(`crates/archie-core/src/phone.rs`, `seal`/`open`; the reading side is `src/relay/envelope.ts` in
`archie-mobile`, and `js/proof.js` here carries the same two functions for `trust/proof/`, all of
them verified against each other by the `opens_an_envelope_sealed_by_the_browser` test vector). The
key is generated on the desktop, stored in the OS keychain, and delivered to the phone in a **URL
fragment** (`phone::app_pair_url`, asserted by
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
- ❌ **Never say Archie Mobile buzzes, rings or notifies.** It shows what the agent posted when it is
  opened. The pairing screen and Settings say "It does not buzz or show notifications yet" (from
  0.3.5).

### 🚧 Texting your agent on iMessage like a contact, on an Apple ID of its own: BUILT 2026-10-06, SHIPPED in Archie 0.3.6 on October 6, 2026, not yet tried on a real Mac

*Released, checked October 6, 2026: `0bd65dc2` is an ancestor of 0.3.6's `59a674e6`, 0.3.6's release
note says "On iMessage, your agent can have an Apple ID of its own", and the Connecting iMessage
guide carries both ways from the same commit. No page says it yet. The last boundary below still
holds, so a page that does says the second way is new.*

Raised by Jett on October 6, 2026: on iMessage the agent lived only in the owner's conversation
with themselves, which Messages draws with every message as the owner's and often twice, so texting
the agent read as your own words echoing back.

**Approved wording, once it ships:** "On a Mac, your agent can answer in iMessage two ways. In the
conversation you have with yourself, on any Mac, its replies start with its name. Or give it an
Apple ID of its own on a spare Mac, and text it like any contact: nothing shows twice."

**Why it's true** (Archie `0bd65dc2`, October 6, 2026, in 0.3.6):
- **Two ways, chosen on the Chat app card.** `SignedInAs` in `crates/archie-net/src/imessage.rs`:
  `Owner` is the message-yourself thread, `Agent` is an Apple ID of the agent's own. The choice is
  `imessage_own_account` on the agent's manifest, read at start (`gateway_lifecycle.rs`).
- **No echo on its own Apple ID.** The conversation is the direct chat with the owner's handle,
  found exactly as the self-chat is; everything sent from that Mac is the agent's own and is never
  answered, by `is_from_me` rather than by memory (`on_its_own_apple_id_only_what_arrives_is_the_owners`).
- **Its name on its replies in the self-chat.** Every text and caption starts with the agent's name,
  and a line starting with it is never answered as the owner's
  (`in_the_self_chat_the_agents_words_carry_its_name`).

**Boundaries:**
- ⛔ **Never "no account to make" for the second way.** It needs an Apple ID made for the agent, and
  the Mac's Messages signed into it instead of the owner's.
- ⚠️ **It takes the owner's own texts off that Mac's Messages**, because Messages is signed into one
  Apple ID at a time; and Text Replies then reads the agent's account, not the owner's. Say "a spare
  Mac" or "a Mac you can give to your agent".
- ⚠️ **The doubling in the self-chat is Apple's drawing and still happens.** The name only makes the
  agent's half readable. Never "fixed the echo" for the first way.
- ⚠️ **Not yet tried on a real Mac signed into a second Apple ID.** Tested in code against the
  watch's own message shape.

### ✅ The Archie app for a phone: sealed, where a chat app is not. SHIPPED ON ANDROID

**Which build Android has, 2026-10-05.** The APK on the latest release (`Archie-latest.apk` on
v0.3.5, version code 8) was built on this Mac from archie-mobile `e742a48`, signed with the same key
as the APK before it, and opened on an emulator after updating over it. The one it replaced was
built from before September 29. So an entry below whose phone half is in archie-mobile at or before
`e742a48` has that half in a release on Android; its computer half still needs a desktop release.

**Status 2026-09-22. The tense split, and this is the deliberate pass that entry always promised.**
Android and iPhone are no longer in the same state, so no page may talk about "the phone app" as one
thing any more.

- **Android is downloadable today**, as an APK from the `archie-releases` repo, linked from
  `archie/install/`. Anyone can install it. **Present tense is correct for Android**, and for
  Android only.
- **iPhone is still with Apple.** First submitted 2026-09-17; rejected 2026-09-23 and 2026-09-29
  (archie-mobile `docs/STORE-LISTING.md`), and build 16 has waited for review since 2026-09-29 (App
  Store Connect, read October 6, 2026). In review is not
  approved: nobody outside the team can install it and it is in no store listing anyone can reach.
  **Future tense still holds for iPhone**, and **no page may carry a date for it**, because a
  rejection is an ordinary outcome and we do not control the clock.
- **`/phone/pair` is deployed**, since 2026-09-14 (`stripe-webhook/phone-pair.js`), along with the
  `notPhone()` rules. The freeze it was waiting behind was lifted by the assessor, who said to
  proceed with the package as it stood.
- **Google Play is not started and cannot be rushed.** An organization account needs a D-U-N-S
  number, which Google's own FAQ puts at up to 28 days. The APK needs none of that today, but
  **Google is extending developer verification to sideloaded apps**: 2026-09-30 in Brazil,
  Indonesia, Singapore and Thailand, and 2027 everywhere. Say nothing on the site that implies the
  direct download is permanent.
- **Found 2026-09-28: nobody outside the team can pair yet.** In 0.3.0 and on main, the Set up a
  phone button that shows the pairing code renders only for staff (`src/app/settings.tsx`, behind
  `isAdmin`, commented "Staff only, until a store lists Archie Mobile"), and the chat-app picker's
  Archie Mobile row is disabled for non-staff ("our own app, not out yet"). The APK is a file rather
  than a store listing, so that gate's condition is never met, and `archie/install/`'s "scan the code
  Archie shows on your computer" cannot be completed by a customer. **Decided 2026-09-28 (Jett): the
  gate comes off for Android in the next release**, and the Android download stays on the install
  page meanwhile. Until that release ships, present tense for Android is true of the download and
  not of the pairing, so no new page may tell a reader to pair a phone. **Built the same day**
  (Archie `c434a385`, in 0.3.1, released September 29, 2026): Set up a phone and the Archie Mobile row in the chat-app list are
  open to everybody, and the row reads "our own app; on Android now, and on iPhone once Apple
  approves it", with no Recommended tag until the iPhone app is approved. **Later the same day the
  Set up a phone button went, with the Settings section it sat on (Your phone).** The pairing code
  is now only on that row, on an agent's Setup tab under Chat app, behind Show the code; Disconnect
  every phone sits under it, and the row says "on" while phone access is. A page that says where
  to find the code names that row, never Settings.

**The one thing to say in the same breath as an Android download.** A person installing from a file
rather than a store has to pass two warnings, and a page that hands them the file owes them both, in
the same shape the Windows warning already gets on `archie/install/`: Android refuses the first
install and asks them to allow it from the browser they used, and Play Protect offers to scan an app
it has not seen. Neither means anything is wrong, and neither should be described as a formality:
they are the checks working, and the honest thing is to say why they fire.

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
  delivers it in a **URL fragment**, which a browser does not transmit to a server (`phone::app_pair_url`,
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

⚠️ **From 0.3.1, a routine can run at several set times a day** (Archie b7c15696, in 0.3.1;
archie-mobile 8f9ae08, the phone's half, in v0.3.5's Android download and not yet on iPhone), and the phone moves any
one of them. Of Android the sentence above can say "move any of the times it runs"; of the iPhone,
still in App Store review, it stays as written.

**Why it's true.** The phone can send exactly the instructions on a fixed list, and that list is the
`match op` arm of `dispatch_words` in `src-tauri/src/phone.rs`: ping, start, stop, install and remove
each of the four add-on kinds, build a skill, set the name, the face and an add-on's answers, turn a
skill or routine on and off, set a routine's time, set the quality, add a row to a collection, say
something, press a button on a card, send a picture, a video, a voice note or a document in pieces
(`put_file`), send several pictures as one message (`send_pictures`), take a document off, and browse
this computer's catalog. Three more only fetch: the owner's calendar days, and the audio (`spoken`)
or the picture or file (`media`) on one message of the owner's own conversation. There is no op for
running code or reaching a secret, and none for reading an arbitrary file: `media` reads only a file
a message names, and only from the Archie folder in Downloads or the agent's own folder
(`saved_file_bytes`, tested by `a_phone_can_fetch_only_a_file_the_agent_saved`). A phone cannot
invent an op: an unknown one is refused by the computer. The snapshot it draws from is built by
`build_snapshot` in the same file, whose header lists what never travels: anybody else's
conversation on a shared agent, knowledge files, the rows inside a record collection, credential
values (not even the last four of one), and the screenshots a job took. The audio, pictures and
files inside the owner's conversation travel only when somebody on the phone presses to hear, see
or open one, sealed like everything else (added 2026-09-25; before that they never travelled).

✅ **In 0.3.2, three more for the talk screen, on the computer's side only** (Archie `e7f6e128`, an
ancestor of 0.3.2's `94f85315`; checked 2026-09-30): `talk_ready` only asks whether this computer can
hear and speak and whether the agent talks back, `talk_download` starts those two downloads, and
`set_voice_mode` sets whether one agent answers out loud (`src-tauri/src/phone.rs:1639`, `:2575` and
`:2592` at `94f85315`). None reaches a secret, a file or anybody else's conversation. **No released
phone asks them yet.** The phone's talk screen is archie-mobile `cf0b115`, not in a release, so this
list of ops is true of 0.3.2 and still says nothing the phone can do. See the talk screen's own entry.

⚠️ **From 0.3.3, one more op, and the first list whose rows travel** (Archie `8fb5705d`, in 0.3.3,
released September 30, 2026; the phone's side is archie-mobile `817e099`, in v0.3.5's Android download and not yet on iPhone).
The open items on the owner's to-do list (the Task Manager skill's
`tasks` list) now ride the snapshot, up to thirty, each as a title, a date, a priority and a status
(`tasks_of` in `phone.rs`). `task_done` ticks one off or puts it back. Every other list still sends
a count and nothing else. From that release, the list above of what never travels reads "the rows
inside the agent's lists, apart from the open items on its to-do list". The items are sealed like the
conversation they already appeared in as the agent's checklist, so "sealed with a key we never
receive" covers them and "never leaves your computer" does not. See the to-do list's own entry.

**What the phone app asks for on the phone, and the approved wording.** Added 2026-09-17, because
the App Store makes us write a purpose string for each one and a policy a reviewer can open, and
because a permission prompt is the one piece of this product a person reads before they trust it.
All three were checked against the client on that date.

> - **The camera**, for two things. It reads the square code that pairs the phone with your
>   computer, and it takes a photo or a short video when you choose to show one to an agent. It is
>   not on at any other time.
> - **Your photos**, only at the moment you pick something to send. The app is handed the photos or
>   videos you chose and nothing else, and it never reads the rest of your library.
> - **Your files**, only the ones you pick in your phone's own file picker, at the moment you pick
>   them. The app asks for no permission to read files, because the picker hands over only what you
>   chose.
> - **The microphone**, only while you are recording something to say to an agent. You start that by
>   pressing the talk button, you can throw the recording away instead of sending it, and it stops
>   on its own if you leave the app.

⚠️ **On main, the talk screen changes the microphone line** (archie-mobile `cf0b115`, not in a
release). There the microphone stays open between turns until Done, is closed while the agent
answers, and is closed when the app goes to the background, and nothing is thrown away by a press:
what is said is sent when the speaker stops. At that release the line above becomes: "**The
microphone**, only while you are recording something to say to an agent, or while the talk screen is
open. On the talk screen it listens between turns until you press Done, and it stops on its own if
you leave the app." The app's own permission text says "only when you press the talk button" and
moves with the next store build (see Archie's `docs/OPEN-THREADS.md`).

**Why it's true**, all paths in `/Users/Games/Desktop/Code/archie-mobile`:

- **Camera.** `src/screens/Pair.tsx` mounts `CameraView` only while `scanning`, and
  `src/attach.ts` takes a photo through `ImagePicker.launchCameraAsync`, which is the system's own
  camera and not a preview this app holds open.
- **Photos.** `ImagePicker.launchImageLibraryAsync` in `src/attach.ts` (`pickFromPhotos`). The
  picker is the system's; what comes back is the assets chosen, up to four, and the app has no
  library-wide read.
- **Files.** `DocumentPicker.getDocumentAsync` in `src/attach.ts` (`pickFiles`), the system's own
  picker, copying only the chosen files into the app's cache so they can be read.
- **Microphone.** `startTalking` in `src/screens/Chat.tsx` runs on a press, `stopTalking(false)`
  throws the recording away, and the same function runs when the app stops being `active`, so
  leaving the app ends the recording rather than leaving it running.
- **A photo, a video, a document and a voice note ride the sealed mailbox like everything else**,
  as `put_file` through `run` in `src/attach.ts` and `src/voice.ts`, sealed by `seal` in
  `src/relay/envelope.ts`, several pieces at a time. The same goes the other way for a picture or
  a file the agent sends, fetched with `media` when somebody presses it. So the custody clause below
  applies to them word for word: we hold them and cannot read them.
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

**Changed on archie-mobile main, October 6, 2026 (`23a21a3`), in no store build yet.** "Nowhere else"
was false a second way too: the agent shows a photo to its AI company when it looks at it, and the
words of a recording go there once the computer has turned it into words. The prompts now read:
"It goes to the computer running Archie, locked so we cannot open it on the way. Your agent then
shows it to the AI company it uses, the same as anything you type." And for the microphone, with
the talk screen's line from the entry above: "Archie uses the microphone only while you record
something to say to an agent, or while the talk screen is open. What you say goes to the computer
running Archie, locked so we cannot open it on the way. That computer turns it into words, and only
the words go to the AI company your agent uses." "Locked" rather than "sealed", because a
permission prompt is on-screen copy. The transcription half is `transcribe_voice_note` in Archie's
`gateway/turn.rs`: the bundled Whisper, audio deleted when it returns.

**Changed again on archie-mobile main the same day (`fc8d1fb`), also in no store build yet,** because
the prompts named photos and a held talk button while the app picks and films videos
(`mediaTypes: ["images", "videos"]` in `src/attach.ts`) and Talk out loud listens hands-free. Camera:
"...and to take a photo or video when you want to show one of your agents something." Photos:
"Archie sees only the photos or video you pick to show an agent. What you pick goes to the computer
running Archie, locked so we cannot open it on the way. When your agent looks at it, the AI company
your agent uses sees it too, the same as anything you type." Microphone: "Archie uses the microphone
only while you record a voice note or a video for an agent, or while you have Talk out loud open."
then the same two sentences as before. For a video the AI company sees up to ten stills and the
words, never the file (`KEYFRAME_BUDGET` and the local Whisper in Archie's
`crates/archie-runtime/src/video.rs`), so "sees it too" says more than happens, which is the safe
direction. The privacy policy's phone section was brought to the same facts the same day.

**The phone's name crosses unsealed at pairing.** `deviceLabel()` in archie-mobile's
`src/screens/Pair.tsx` sent `Device.deviceName` to `POST /phone/pair`, which stores it as
`device_label` beside the pairing ticket (`stripe-webhook/phone-pair.js`). On iOS 16 and later that
is the word "iPhone" for every app without Apple's naming entitlement, but on Android it is the name
in the phone's settings, often the owner's. The privacy policy now says so. From `fc8d1fb` the app
sends only `Device.modelName` ("iPhone 15 Pro", "Pixel 7"). **When a phone build carrying it ships
on both platforms**, change the policy's sentence to "we also keep its model, such as &ldquo;iPhone
15 Pro&rdquo;", and not before, because copies paired from older builds keep the name they sent.

**Required clauses. Do not drop them:**

- ⚠️ **Name the platform, because they are no longer in the same state.** Android is downloadable,
  so present tense is correct for it. iPhone is in review, so it stays future tense with **no date**,
  and "we are building" rather than "Archie has an app". A sentence about "the phone app" that does
  not say which platform is now the failure this clause is watching for, and it was the opposite
  failure until 2026-09-22.
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

### ✅ Stopping a reply partway by typing stop or pressing Stop, in Archie and in Archie Mobile, and a phone message that waits for a sleeping computer: SHIPPED in Archie 0.3.5 on October 5, 2026, and in Archie Mobile on Android in the same release; iPhone still in App Store review

*Released on the computer, checked October 6, 2026: Archie `389c0b4e` (the bare stop and the Stop
button) and `e24a5005` (the computer reading the relay's receive time) are ancestors of 0.3.5's
`2afe4589`, and 0.3.5's release note says "Type stop, or press Stop, while your agent is working."
Archie for Business follows; its 0.3.5 is not out yet. The phone's half (archie-mobile `721791f`) is
in v0.3.5's Android download (built from `e742a48`, see "Which build Android has" above) and not on iPhone, which is
still in App Store review. Both approved sentences below name the phone, so a page that uses them
says Archie Mobile on Android until the iPhone app is out.*

Found by the reviewer pass on October 5, 2026: a reviewer who texts the agent from the phone typed
"stop" while it worked, and it finished the job and then answered "stop" as a new request; and a
message sent while the computer slept showed "Not delivered, try again", and was then answered hours
later as if just sent, once for every retry.

**Approved wording, once it ships:** "Changed your mind while your agent is working? Type stop, or
press Stop, in Archie or in Archie Mobile. What it already finished stays done, and nothing more
happens." And: "Send a message from your phone while your computer is asleep and it waits for the
computer, says so, and your agent answers it when the computer wakes, knowing it was sent earlier.
Until then, Remove it takes it back."

**Why it's true** (Archie branch merged October 5, 2026; archie-mobile `721791f`):
- **A bare stop.** `crates/archie-runtime/src/gateway/worker.rs`: from the owner, while a reply is
  being written, a message that is only "stop" (any case, a trailing period or exclamation mark
  allowed) fires the same stop as `/stop` and is not sent to the AI. With nothing running it is an
  ordinary message. Tested in `a_bare_stop_calls_off_a_running_turn_and_is_a_message_otherwise`.
- **The Stop button.** `src/app/conversation.tsx` (while the conversation is working) and
  archie-mobile `src/screens/Chat.tsx` (while the agent is answering and the phone's copy is fresh).
- **The waiting message.** The computer reads the relay's own receive time for each command
  (`crates/archie-core/src/phone.rs`) and passes it through to the conversation, so a message that
  waited arrives held (`ChannelEvent::held_since` in `crates/archie-net/src/channel.rs`). The phone
  says "Waiting for your computer" instead of "Not delivered", and Remove it deletes the waiting
  command only if the computer has not taken it yet.

**Boundaries:**
- ⛔ **Never "undo".** Stopping keeps what was already done: a row written or a draft made stays.
- ⚠️ **"cancel" is not a stop.** It answers reminder cards and staged changes, so it was left out.
- ⚠️ **Only the owner's stop.** On a shared agent a guest's "stop" is an ordinary message.
- ⚠️ **The computer still has to wake.** Never "your phone runs your agent". A message from the
  phone waits until the computer running Archie is on and Archie is open.
- ⚠️ **Not yet pressed on a real phone against a sleeping computer.** Tested in code on both sides.

### 🚧 Updating Archie on the computer from Archie Mobile, and running or tuning a skill or routine from the phone: BUILT 2026-10-02, the computer's half in Archie 0.3.5 (released October 5, 2026), the Archie Mobile half on Android in the same release (iPhone in App Store review), and never watched

*Checked October 6, 2026: every Archie commit named below is an ancestor of 0.3.5's `2afe4589`, and
0.3.5's release note says "A skill or a routine opens where it sits". Archie for Business follows;
its 0.3.5 is not out yet. The phone's half (archie-mobile `04da3b6`) is in v0.3.5's Android download (see "Which
build Android has" above) and not on iPhone, which is still in App Store review. The wording below
still waits for the watch the boundaries ask for, and names Android only until the iPhone app is out.*

**Approved wording, once both halves are in a release:** "When an update for Archie is ready,
Archie Mobile shows it with what's new. Press Update and Archie on your computer installs it and
restarts, and your agents start again on their own. From the phone you can also run a routine now,
pick a skill's response quality, and switch a skill's scheduled messages off and on."

**Why it's true** (Archie `1cf5b5df` for the update and the new phone actions, `623d1850` and
`6880e0b3` for what the phone is sent, `862f5790` and `50d9cb96` for the rows on the computer;
archie-mobile `04da3b6`):

- **One update status for both screens.** `src-tauri/src/app_update.rs` checks the address the
  window always checked (an hour apart and when the window comes forward, never closer than 15
  minutes), holds what it found, and sends it both to the window and, in the sealed snapshot, to the
  phone: the version, its notes, and whether it is installing (`update` in `build_core`,
  `src-tauri/src/phone.rs`).
- **Update on the phone** sends `update_install`, one of the fixed actions the computer accepts
  from a phone (`dispatch_words` in `phone.rs`). The computer writes its answer to the phone first
  and only then starts the install (`start_queued`), so the restart cannot leave the request waiting
  to run a second time. Archie restarts itself, and a restart no longer stops to ask whether to quit
  (`src-tauri/src/lib.rs`, `RESTART_EXIT_CODE`).
- **Run now, Response quality and the schedule switch** are `routine_run_now`, `set_skill_tier` and
  `skill_schedule_enabled`, which run the same code as the computer's own buttons.
- **The phone's side** is `src/update.ts` and `src/screens/Update.tsx` in archie-mobile: the card
  on Settings and at the top of the agent list, which asks before it starts, says the agents pause
  for about a minute, and waits for the computer to come back with the new version.
- **The rows open in place on both apps, with the same words.** The design and the list of what the
  phone is sent are `docs/SKILL-ROUTINE-CONTROLS.md` in the Archie repo. Response quality is
  Economy, Balanced or Best, the words the computer uses.

**The boundaries.**

- ⚠️ **The computer has to be on, awake, and running Archie.** The phone asks; the computer does
  the work. Never "update Archie from anywhere" without that condition beside it, and never
  "automatically": somebody presses Update.
- ⚠️ **Some Macs say no.** When the account signed in on the Mac cannot change the Archie app
  (it was installed from another administrator account), installing asks for an administrator's
  password, so the phone refuses and says to update at the computer. Never "always" or "on any
  computer".
- ⚠️ **Nobody has watched it happen yet.** It needs a release build (a development build never
  checks for updates), and the computer's half is first in 0.3.5, so the first update it can be
  watched on is the one after 0.3.5. Until one has been watched on a Mac and on
  Windows, this stays 🚧 and no page may make the claim.
- ⚠️ **Both halves have to ship, computer first.** A phone that is newer than its computer hides
  these controls rather than sending an action the computer would not know. A page may say this
  once a computer release and the phone update that carry it are both out.
- ⚠️ **The phone still cannot connect an account or paste a key.** No secret travels through the
  mailbox, so a skill waiting on an account says to connect it at the computer.
- **The update check itself is unchanged.** It is the same plain request to the same address (see
  "The update check tells us nothing about you"). Moving it into the app's own process changed when
  it runs, not what it sends.

### Choosing the exact model behind each Response quality setting: on the computer since 2026-08-29, from Archie Mobile SHIPPED in Archie 0.3.5 (released October 5, 2026) and on Android in the same release; iPhone still in App Store review

*Checked October 6, 2026: Archie `0d61132b`, the computer's side of the phone's picker, is an
ancestor of 0.3.5's `2afe4589` (Archie for Business follows; its 0.3.5 is not out yet). The phone's
screen (archie-mobile `51629d7`) is in v0.3.5's Android download (see "Which build Android has" above) and not on
iPhone, which is still in App Store review. So the wording's last clause, "on the phone, under
Response quality in More", may be said of Android, and of the iPhone once its app is out.*

**Approved wording:** "Archie picks a model for each of Economy, Balanced and Best. You can pick your
own for any of them, from the list your AI company publishes, and that setting runs it everywhere:
in replies, in your skills, and in anything on a schedule. Put any of them back to Archie's choice
in one press. On the computer it is under Response quality; on the phone, under Response quality in
More."

**Why it's true** (Archie `9a067256` for the computer, `0d61132b` for the phone's ops; archie-mobile
`51629d7` for the phone's screen):

- **One stored choice per setting, per AI company.** `TierModelChoice` and
  `AgentBundleManifest.tier_models` in `crates/archie-domain/src/skill.rs`, written by
  `agent_tier_model_set` and cleared by `agent_tier_models_reset` in
  `src-tauri/src/commands/mod.rs`. `base_model_for_tier` in
  `crates/archie-runtime/src/gateway/routing.rs` uses a picked model for every reply, skill and
  routine that lands on that setting.
- **The list is the AI company's own**, asked on the owner's key: `list_models` in
  `crates/archie-net/src/llm/mod.rs`, behind `provider_models_list`.
- **The phone runs the same code.** `set_tier_model`, `reset_tier_models` and `models` in
  `src-tauri/src/phone.rs` call those same commands, and the provider is read off the agent on the
  computer, never taken from the phone. The phone's picker is `ModelChoice` in
  `src/screens/Manage.tsx` in archie-mobile.

**The boundaries.**
- ⚠️ **Only with an AI account of the owner's own.** On the starter credits or the plan's allowance
  there is one model and nothing to pick; both screens say so instead of drawing a picker.
- ⚠️ **Not on the Custom connection**, which runs the one model typed on its card at every setting.
- ⚠️ **Some AI companies publish no list** (xAI does not, to most keys). Then a model's name is typed
  in, copied from the company's own site. Never write "choose from every model".
- ⛔ **Never claim a picked model thinks the way Archie's own choice does.** A picked model runs
  with extended thinking off unless it is the very model Archie would have used
  (`pinned_model` in `routing.rs`), because the right thinking settings differ by model and
  guessing them wrong fails the request.
- ⛔ **Never "your agent picks the model".** The owner picks it; the agent never changes it on its
  own. A change restarts the agent, which takes a few seconds.

### 🚧 Pictures, videos, recordings, and documents both ways, and replies with tables, in Archie and in the app: BUILT 2026-09-25, the computer's half in Archie 0.3.1 (released September 29, 2026), the app's half on Android in 0.3.5's download (October 5, 2026); iPhone still in App Store review

*Checked October 6, 2026: every Archie commit named below is an ancestor of 0.3.1's `09c5cb5e`, and
every release since carries them. The app's half (the archie-mobile commits below) is not marked
shipped here: the iPhone app is still in App Store review, and for Android see "Which build Android
has" above. The wording below names the phone, so until that half is marked, a page may describe
this in Archie on the computer only.*

**Approved wording, once it is in a release:** "Send your agent a photo, a few at once, a video, a
recording, or a document, from Archie on your computer or from the Archie app on your phone. It
looks at the pictures, asks before it watches a video or listens to a recording, and reads the
document. It sends files back the same way, and in Archie it can answer with a table or a checklist
when that is the clearer shape."

**Why it's true** (Archie repo `1ddd20d3`, `12461dfc`, `65c1d2f3`, `b3fd0fdf`, `766abc60`, `1df1ba2f`,
`20f547d7`; archie-mobile `2e5516e`, `674a438`, `534fce5`, `126831f`, `7453d20`):
- **The window.** The message box takes up to four pictures, one video and any number of documents,
  from its Add button or dropped on the conversation (`src/app/conversation.tsx`, `src/app/attach.ts`).
  Several pictures go as one message the agent answers once (`ChannelEvent::Album`,
  `vision::look_at_photos`). A video is copied into the agent's folder and offered with the Watch or
  Skip card (`inapp_send_video`, `gateway/video_offer.rs`). Documents are filed under General and the
  agent is told they arrived.
- **Recordings.** A recording (a meeting, a voicemail; MP3, M4A, WAV, AAC, OGG, Opus or FLAC) goes
  the way a video does: the same card, worded Listen or Skip, and the same pipeline, which
  transcribes it and files notes under Knowledge without looking for pictures in it (`is_recording`
  and `words_for` in `gateway/video_offer.rs`, `video.rs`). In the window it takes the video's
  place on a message; on the phone it comes from the files picker, up to 25 MB.
- **The app.** The attach sheet opens the camera (a photo or a video), the photo roll (up to four,
  videos too) and the files picker (`src/attach.ts`, `src/screens/Chat.tsx` in archie-mobile). Files
  cross in sealed pieces, several at a time, up to 5 MB for a picture, 10 MB for a document and 25 MB
  for a video (`upload_cap` in `src-tauri/src/phone.rs`, `FILE_MAX` in the app's `src/upload.ts`).
- **Files back.** The agent sends a file it made or one from its documents (`save_file`, with a
  `file_id` for a document it holds, `crates/archie-runtime/src/export.rs`). The app shows the
  agent's pictures and opens its files when somebody presses them (`media`, `src/shown.tsx`).
- **Tables.** The window and the app draw tables, checklists, links and code
  (`src/app/markdown.tsx`; `src/text/markdown.ts` in the app, with tests). The agent is told a
  table is fine only when every screen reading the conversation draws one: talking in Archie alone,
  and the paired phone reporting it can (`reply_style` in `gateway/prompt.rs`,
  `GatewayConfig::phone_draws_tables`). **Widened in Archie 0.3.6, October 6, 2026 (`ae4f4b2d`):**
  an agent connected to Telegram, Slack or Matrix may write one too, because Matrix draws it and
  Telegram and Slack already turn it into labeled bullets on the way out (`flush_table` in
  `archie-net`). Discord still may not: it would show the pipes. Never say a table appears in
  Telegram or Slack; say it shows there as a list.

**The boundaries:**
- ⛔ **Never say it watches every video or listens to every recording you send.** It asks first,
  every time, because watching or listening costs minutes and money on the owner's AI account; and
  it does either only with Video Synthesizer installed, which brings the tools. Without it the agent
  says so and names the add-on.
- ⛔ **Never say it listens to a recording sent on a chat app.** On Telegram, Slack, Discord, Signal,
  iMessage and Matrix an audio file is still heard as the sender talking and answered, not turned
  into notes. The recording card is in Archie and the Archie app only.
- ⛔ **Never promise a size past the phone's limits.** From the phone a video is up to 25 MB (about a
  minute), a document 10 MB and a picture 5 MB, and a video past the limit is refused with how to
  trim it. From the window a video can be much larger, so copy says "a video" and not a length.
- ⛔ **Never say tables work on every app.** They are drawn in Archie and in the Archie app. On
  Telegram, Slack, Discord, Signal and iMessage the agent still writes labeled lists, because two of
  those cannot draw a table at all.
- ⚠️ **A document sent in a conversation is kept.** It is filed under General with the agent's other
  documents, and it stays there until somebody removes it on the Knowledge tab or in the app.
- ⚠️ **The files travel through our mailbox, sealed.** The phone entries above govern the wording:
  we hold the ciphertext and cannot read it. Never "the files never touch our servers".
- ⚠️ **On Android, a file the agent sends opens where the phone has something that opens it.** The
  app shows pictures itself; other files are handed to the phone, and a phone with nothing for that
  kind says so rather than opening it.
- ⛔ **Never say an iPhone sends a document until an iPhone build after archie-mobile `ca349b5` is
  out.** Found October 6, 2026 on the iPhone test build of September 29, which is the build Apple is
  reviewing: its files picker grays out PDFs and Office files, because iOS drops the
  `application/*` wildcard the picker was given. Fixed on main with the types named one by one
  (`DOCUMENT_TYPES` in `src/upload.ts`). The same build sends picked photos at once with no room for
  words (`50c192d` holds them in the message box until Send, so words go with them) and its Share
  in the message menu opens nothing (`d5ecab0`). The picker and Share problems are the iPhone's
  alone (the Share fix runs on iOS only); picked photos going at once is on Android too, until an
  APK after `50c192d`.

### ✅ A microphone and Talk out loud beside Archie's message box, and where what you say goes: the window only, SHIPPED in Archie 0.3.2 on 2026-09-30

*Released, checked 2026-09-30 against 0.3.2's `94f85315`. The microphone has been in the window since
August (Archie `167c924b`) and Talk out loud since 0.3.0 (`080c3726`); 0.3.2 moved both into Send's
place while the box is empty, and its release notes say so: "While the message box is empty, the
microphone and talk buttons sit where Send goes." (`docs/releases/0.3.2.md`, `archie/releases.json`).
This entry approves what the window shows and where the words go. It approves nothing about how the
talk screen behaves, because nobody has held a conversation with it yet, so the entry below keeps its
gate. The phone's half is in no release.*

**Approved wording:** "Beside the message box in Archie are two buttons: a microphone, to say a message
instead of typing it, and Talk out loud, which opens a screen for talking with your agent out loud.
What you say is turned into words on your computer, and only the words go to your AI company, the
same way a typed message does. The microphone is on only while you are recording, or while that
screen is open."

**Why it's true**, all at `94f85315`:

- **The bar.** `src/app/conversation.tsx`: Add (`:2712`), the box, whose hint is "Message {name}, or /
  for commands" (`:2759`), the microphone, "Say it instead of typing" (`:2898`), and Talk out loud
  (`:2945`), which gives its place to Send the moment there is anything to send (`sendInSlot`,
  `:2093`). Under the bar: "Archie can get things wrong. Check before you act on it." (`:2974`). The
  two voice buttons appear only while the agent is running; a stopped agent shows Start there.
- **The microphone.** A press records until Done, five minutes at most (`MAX_SECONDS`,
  `src/app/recorder.ts:48`), then offers Put it in the box, Send as a voice note, or throw it away.
  Put it in the box turns the recording into words and sends nothing (`inapp_dictate`,
  `src-tauri/src/inapp.rs:1785`).
- **Turned into words on the computer.** Both buttons use the local Whisper: `said_to_words`
  (`inapp.rs:1584`) calls `transcribe_media` (`crates/archie-runtime/src/media.rs:515`, at
  `inapp.rs:1624`), and the talk screen calls `media::transcribe` (`src-tauri/src/talk.rs:125`). The
  tools are `ffmpeg`, `whisper` and `whisper-model-base.en` (`HEARING_ASSET_REFS`,
  `src-tauri/src/assets.rs:210`), run as programs on the computer. No speech service is called.
- **Only the words go.** A voice note and each turn on the talk screen go through `deliver_spoken`
  (`inapp.rs:1840`; the talk screen's `talk_send` calls it at `talk.rs:246`), which hands the gateway
  the words alone (`spoke_to`, `inapp.rs:1872`; `ChannelEvent::Spoken` carries text,
  `crates/archie-net/src/inapp.rs:373`). The gateway adds " [heard, not typed]" so the agent reads
  names and numbers back (`HEARD_NOT_TYPED`, `crates/archie-runtime/src/gateway/worker.rs:1998`), and
  from there it is an ordinary message to the owner's AI company.
- **The microphone is opened in two places and let go on the way out of both.** `getUserMedia` is
  called only at `src/app/recorder.ts:125` and `src/app/talk-mic.ts:357`. The recorder lets go on
  Done, on throwing it away, at the five-minute ceiling, and when the conversation closes (`release`,
  `recorder.ts:103`, `:111`). The talk screen is mounted only while it is open
  (`conversation.tsx:2991`) and lets go when it unmounts (`talk-mic.ts:299`, `:314`). The Mac's own
  permission text says it too: "What you say is turned into words on this computer and is never
  uploaded for transcription." (`src-tauri/Info.plist:18-19`).
- **The answer out loud is made on the computer as well**: Kokoro through `sherpa-onnx-offline-tts`
  (`speak`, `crates/archie-runtime/src/speech.rs:636`; `VOICE_ASSET_REFS`, `assets.rs:173`). This is a
  fact about where audio is made, not approved wording; the entry below holds that.

**Required clauses:**

- ⚠️ **It needs a one-time download from us, and the app says so first.** The microphone needs the
  hearing tools, about 195 MB. Talk out loud needs those and the voice, about 585 MB in all on a Mac
  and 540 MB on Windows, less whatever is already there (`data/marketplace/assets/*.json`; the public
  catalog carried the same sizes on 2026-09-30). The app names the size before it starts. It is a
  plain file request to `assets.otianai.com` with no account on it (`install`,
  `crates/archie-core/src/assets.rs:167-169`), checked against a SHA-256 before use (`:235`, `:339`).
  Never "works out of the box".
- ⚠️ **English only.** The hearing model is `base.en`.
- ⚠️ **A person has used the microphone on a Mac and never on Windows.** Archie's
  `docs/OPEN-THREADS.md`, "The microphone works on macOS and has never run on Windows", still open on
  main at `189dc289`. No page says or shows it working on Windows until that closes.
- ⚠️ **A recording that is sent is kept.** A voice note, and every turn on the talk screen, keeps its
  recording on the message, in the agent's folder on the computer, so it can be played back
  (`write_spoken`, `inapp.rs:1850`). Only Put it in the box keeps nothing. Never "recordings are not
  kept". What a paired phone may fetch is governed by the phone entries above.

**Boundaries:**

- ⛔ **Never say how Talk out loud goes.** Not "hands-free", "back and forth", "without pressing
  anything", how quickly it answers, or that it can be interrupted. Name the button and the screen it
  opens; the entry below holds the rest and its gate.
- ⛔ **Never "nothing leaves your computer", "offline" or "a private voice assistant".** The words go
  to the AI company. "Only the words go" is the true half, and it is the stronger one.
- ⚠️ **On the phone, the button only, and on Android only.** Archie Mobile's talk screen is in the
  Android APK put on v0.3.5 on 2026-10-05 (archie-mobile `e742a48`), and the iPhone's build is still
  with Apple. A drawing of the phone may show the button beside the microphone, as the site's phones
  do since that day; any sentence about the phone's screen waits on the entry below.

### 🚧 A conversation out loud, in Archie and in Archie Mobile: the window's IN 0.3.0 and never talked to; the phone's BUILT 2026-09-29, its computer half IN 0.3.2 and its app half in the Android APK of 2026-10-05

**Entry written 2026-09-29.** The window's half shipped in 0.3.0 (Archie `080c3726`, built September
15) with no entry, which under this file's rule meant it did not exist to anybody reading here. It is
written now, with the phone's half, and it stays 🚧 until a person has held a conversation with
either: the four things only a voice can settle are in Archie's `docs/OPEN-THREADS.md`, under "The
talk screen has never been talked to" and the phone's entry after it.

**Checked against 0.3.2 on 2026-09-30.** The computer's half of the phone's screen (Archie
`e7f6e128`) is in 0.3.2, and the window's button now stands beside the box. Neither condition on the
wording below is met by that: both threads are still open on main at `189dc289`, and archie-mobile
`cf0b115` is in no release. The window's two buttons, and where what you say goes, are approved on
their own in the entry above.

**Checked 2026-10-05.** The phone's half is in a release on Android: the APK on v0.3.5 was built on
this Mac from archie-mobile `e742a48`, and its bundle carries "Talk out loud" and `talk_screen`. The
APK before it, uploaded the same afternoon, was built from before `cf0b115` and had neither. The
iPhone is still with Apple. The other condition is still open, since nobody has talked to either
screen (both threads in Archie's `docs/OPEN-THREADS.md`), so the wording below still
waits. Drawing the button beside the microphone on the phone is allowed now, by the entry above.

**Approved wording, once a person has used it and the phone's half is in a release:** "Talk to your
agent out loud and hear it answer, back and forth, without pressing anything between turns. It is
the button beside the microphone, in Archie on your computer and in Archie Mobile. What you say is
turned into words on your computer, and the answer is read out by a voice that runs there too."

**Why it's true:**
- **The window.** `src/app/talk.tsx` is the screen, `src/app/talk-mic.ts` decides from loudness when
  somebody started and stopped, and `src-tauri/src/talk.rs` holds what is being said while it is
  read. Each turn goes as a voice note, and a voice note is answered out loud unless the agent is set
  to answer in writing (`agent_voice_mode_get`, `crates/archie-runtime/src/speech.rs`).
- **Hearing and speaking run on the computer.** Whisper (`whisper-model-base.en`) turns speech into
  words and Kokoro (`sherpa-onnx-offline-tts`, `kokoro-en`) reads the answer, both downloaded once
  from our asset store with builds for Mac and Windows (`HEARING_ASSET_REFS` and
  `VOICE_ASSET_REFS` in `src-tauri/src/assets.rs`; about 195 MB, and for the voice about 390 MB on a
  Mac and 343 MB on Windows). *Corrected 2026-09-30: this said 148 MB for the voice, which is the
  hearing model's size. `kokoro-en` 1.0 alone is 335.6 MB, in the manifests since August.*
- **The phone** (Archie `e7f6e128`, in 0.3.2; archie-mobile `cf0b115`, in the Android APK of 2026-10-05). `src/screens/Talk.tsx` and
  `src/talk.ts` in archie-mobile listen until somebody stops, send it as an ordinary voice note
  (`put_file`), and fetch the spoken answer the way the play button on a message does (`spoken`).
  The computer answers three new ops in `src-tauri/src/phone.rs`: `talk_ready` (only asks whether
  both downloads are there and whether this agent talks back), `talk_download` (starts both), and
  `set_voice_mode` (lets this agent answer out loud, after the screen says what that changes). It
  also says when a turn is over (`answering` on the conversation, `phone::answering`). The button
  appears only where the computer says it can do all of that (`talk_screen`).
- **The phone's microphone is open only on that screen.** It is closed while the agent answers,
  closed by Done, and closed when the app goes to the background; the screen stays lit while it is
  open, because a locked phone would close it anyway.

**The boundaries:**
- ⛔ **Never "real time", "instant", "like a phone call" or "a natural conversation".** Measured at
  the computer on 2026-09-15: about eight seconds from the end of what you say to the start of the
  answer, most of it the AI thinking. From the phone every step is a trip through the mailbox, so
  expect more; nothing there is measured yet.
- ⛔ **Never "your phone understands you" or "it runs on your phone".** The phone records and plays.
  The computer hears and speaks, so it has to be on, running Archie, and the agent has to be
  started. The phone entries above govern how to say that.
- ⛔ **Never "nothing leaves your computer" or "a private voice assistant".** The recording is turned
  into words on the computer and is never uploaded for transcription, but the words then go to the
  owner's AI company as an ordinary message, exactly as if they had been typed. From the phone, the
  recording crosses our mailbox sealed on its way to the computer, and the answer's audio comes back
  the same way: custody without access, as above.
- ⛔ **Never "interrupt it any time".** On the phone a tap cuts it off; talking over it does not,
  because a phone's speaker is an inch from its microphone. At the computer, talking over it is
  meant to cut it off and depends on the webview's echo canceler, which nobody has tested. In Archie
  0.3.6 (October 6, 2026, `4785c10f`) a click anywhere on the screen or the space bar
  also cuts it off at the computer, so "click or press Space to cut in" may be said of the computer
  once the wording above is cleared. The same day fixed a fade that hid the last lines of a short answer
  (`a3c99e92`). Jett talked to the window's screen on October 6 on a dev build; the echo answer is
  not written down yet (Archie `docs/TEST-DAY.md`, item 4), so the wording above still waits.
- ⚠️ **English only.** The hearing model is `base.en`. No other language may be claimed.
- ⚠️ **A long answer is written, not read out.** Past about 1,200 characters (`MAX_SPOKEN_CHARS` in
  `crates/archie-runtime/src/speech.rs`) the screen says the answer was too long to read out and
  shows it instead.
- ⚠️ **It needs a one-time download on the computer, about 585 MB on a Mac and 540 MB on Windows**
  (corrected 2026-09-30 from 340 MB; see the voice's size above), which either screen starts, and
  which the phone's screen follows until it is done.
- ⚠️ **An agent set to answer in writing is asked about, not overruled.** Both screens say what
  turning speech on changes, and change it only when the owner presses Let it talk.

### ✅ Your to-do list at the top of the Dashboard, in Archie and in Archie Mobile, and Knowledge as folders: SHIPPED, the computer's half in Archie 0.3.3 (released September 30, 2026), the Archie Mobile half on Android in 0.3.5's download (October 5, 2026); iPhone still in App Store review

*Checked October 6, 2026: Archie `d34189e5` and `8fb5705d` are in 0.3.3, whose release note says
"Your to-do list is the first card on the Dashboard" and "Knowledge opens like folders", and every
release since carries them. The phone's half (archie-mobile `817e099`) is in v0.3.5's Android download (see "Which build
Android has" above) and not on iPhone, which is still in App Store review. The wording below says
"and on your phone", so a page says it of Android until the iPhone app is out.*

**Approved wording, once it is in a release:** "Your to-do list is the first thing on your agent's
Dashboard, in Archie and on your phone. Tick something off, or add something, right there, without
asking your agent or scrolling back through the chat."

**Why it's true** (Archie `d34189e5` for the desk, `8fb5705d` for what the phone is sent;
archie-mobile `817e099`):

- **The desk.** `TasksCard` in `src/app/tasks-card.tsx` reads the Task Manager skill's `tasks` list
  every time the Dashboard opens and draws every open item, grouped Overdue, Today, Coming up and No
  date, in the order the agent's own checklist in chat uses (`openTasks` in `src/app/open-tasks.ts`,
  kept line for line with `crates/archie-runtime/src/tasks.rs`). A tick writes status Done, and
  today's date where the list has that column, through the same record write the Lists table uses;
  Undo puts back the status it had. The box at the bottom adds a row with a title and nothing else.
- **The phone.** The computer sends the open items in the sealed snapshot (see the phone-app entry
  above), and `TodoCard` in `src/screens/Todo.tsx` draws them with the desk's words and order. It
  ticks with `task_done` and adds with `add_row`, both on the fixed op list.
- **Placement.** First on the Dashboard on both, unless something is waiting on the owner (a draft
  to send, a change to approve), which goes above it. Jett's order, September 30, 2026.
- **Knowledge.** The Knowledge tab is a tree now: Documents (files it reads and never changes, in
  folders), Lists (lists it keeps up to date as you chat, which you can edit too), Memory and How
  you write (`KnowledgeBrowser` in `src/app/knowledge.tsx`). The phone groups documents by the same
  folders. This is a layout and a set of words, not a capability.

**The boundaries.**

- ⚠️ **Only on an agent with the Task Manager skill.** An agent whose to-do list lives in Todoist or
  Google Tasks shows no card: nothing from those is mirrored into Archie. Never "your to-do list,
  wherever you keep it".
- ⚠️ **The phone ticks and adds, and that is all.** A date or a priority is changed by telling the
  agent, or at the computer in the Lists table.
- ⚠️ **The to-do list is the one list whose items reach the phone.** Every other list sends a count.
  Say "sealed", never "never leaves your computer", about the to-do list.
- ⚠️ **A checklist the agent already posted in chat is not redrawn** when an item is ticked on the
  Dashboard, on either app, until the agent next touches the list. Do not say ticking anywhere
  updates everywhere at once.
- **Words.** The agent keeps **lists** and a document is in a **folder**. "Records" and "category"
  are gone from both apps' screens; any page describing the Knowledge tab says Documents and Lists.

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

### ✅ Around the clock, on a computer you leave on (entry written 2026-10-07)

**Approved wording:** "It works around the clock on a computer you leave on." A headline may ask
"Want an employee who works 24/7?" only when this sentence, or one that says the same limit, is
the very next thing the reader sees.

**Why it's true:** the entry above. Routines fire on their schedule with nobody present, mail watch
reads new mail as it arrives, and since 2026-09-16 (Mac) and 2026-09-19 (Windows) a routine can
wake a sleeping computer ("Waking the computer for a routine", below).

**Required clause, every time:** the computer has to be on and Archie open. A shut-down computer
stays off, and the agent answers nothing while it is. ⛔ Never "24/7" alone, never "never sleeps",
and never set beside a cloud agent as if the two were the same: `compare/cloud-agents/` draws the
lid closing and their agent carrying on, and that difference is true.

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
- ✅ **The Terms carry it from October 6, 2026** (version `2026-10-06`, live once pushed). Until
  then they said "Access to the app ends at that point" and never named the free tier, which was the
  contract promising less than the product. Now the section "Archie for free on an AI account of
  your own" says the 20, the held-back 5, Personal only and no Archie Mobile, and the license, plan
  and trial paragraphs say where a plan's end lands. Jett approved the text himself on October 6
  (no counsel is retained yet) as a smaller update under "Changes to These Terms", since it gives
  more and takes nothing, so no 30-day notice. The app's `TERMS_VERSION` moved with it, so a sign-in
  from the next release records the new version. The draft and its reasoning are in the Archie repo,
  `docs/drafts/FREE-TIER-TERMS.draft.md`.

### ✅ Your plan is on your Otian account, not on the computer (entry written 2026-09-21)

**Written because `how-it-works/#what-you-need` listed "an Otian account" as one of three things
to start and never said what it was for**, which reads as a signup for our benefit rather than
the reader's. It is for the reader, and this is the reason.

**Approved wording:** "The account is where a plan lives if you take one, so it follows you and
not the computer."

**Why it's true:** the app asks the billing service for a signed entitlement with the account's
ID token and nothing else: the request body is `{}` or `{terms_version}`
(`crates/archie-core/src/entitlement.rs`, `fetch`). The service signs a payload of `uid`,
`accountFacts(user)` and the trial facts (`stripe-webhook/entitlement.js`, `signEntitlement`).
No device, machine or install identifier is in the request or in the assertion, so what the app
is allowed to open is decided by who signed in, and signing in on a second computer gets the
same answer.

**Boundaries — do not cross:**
- ⛔ **This is the plan, and only the plan. Never let it grow into add-ons.** The retired claim
  in the no-purchase section above ("anything you buy is tied to your Otian account") stays
  retired for a different reason: there is no per-person add-on record to tie, so a new computer
  adds them again. A sentence that says "everything follows your account" is false the moment a
  reader tests it on their shelf.
- ⛔ **It does not carry your agents.** Those are files on the computer, and the way they move is
  the transfer file in "Your whole agent in one file" below, which hands you a list of what to
  connect again. Never imply signing in restores a setup.
- ⛔ **Never "use it on all your computers".** Nothing here is a seat count or a device
  allowance, and the personal edition's ceilings are about agents and people, not machines. The
  claim is only that the plan is not stranded on one computer, which is what somebody replacing
  a computer is actually asking.
- ⛔ **Never say the free credits follow the account.** They are capped per computer and
  deliberately so (see the free-trial entries above). The two facts point opposite ways and a
  page that states them loosely says both.

### ✅ What happens when a plan ends (entry written 2026-09-22)

**Written because the site was more pessimistic than the product.** `faq/` said "If you stop your
plan, Archie stops letting you in at the end of the period you paid for" and `trust/` said "Archie
stops letting you in and deletes nothing". Both were written before the free tier shipped on
2026-09-17 and both were wrong for the commonest case by the time a reader met them. This is the
stale-pessimistic failure: a true-when-written sentence that now costs us the one thing a
frightened reader is asking about, which is whether leaving is survivable.

**Approved wording:** "You stop a plan in Archie, on the Account page, under Your plan. It runs to
the end of the period you have already paid for. On Personal, if a key from an AI company is saved,
Archie keeps opening after that: you land on the free tier, at 20 jobs a day, rather than at a
wall. Every agent you have made is still there and still works. Without a saved key, Archie asks for one. Archie for Business has no
free tier, so it asks for a plan. Nothing on your computer is deleted in any of the three cases."

**Why it's true:** `onFreeTier` in the Archie repo's `src/app/pricing.ts` is
`!IS_BUSINESS && !auth.allowed && !auth.trial_active && auth.own_ai_key`, and `App.tsx` sends a
person to `PaywallScreen` only when `!auth.allowed && !auth.trial_active && !(FREE_TIER_EXISTS &&
auth.own_ai_key)`. The same reading decides what actually runs, on the other side, in
`crate::auth::on_free_tier` (`src-tauri/src/auth.rs`), which `require_access` and the gateway both
consult. `FREE_TIER_EXISTS` is `!archie_domain::product::IS_BUSINESS`, a compile-time constant, so
the business binary has no such branch. The agent ceilings are `FREE_AGENTS = 1` and
`PLAN_AGENTS = 10` in `crates/archie-core/src/plan.rs`. `free_day.rs`'s module comment names this
exact case in as many words: the tally is per computer rather than per agent because of "the moment
somebody's plan lapses with ten agents already made".

**Nothing is deleted, and the app says so itself.** The lapsed notice on `PaywallScreen` reads
"Everything you set up is still here and nothing was deleted. Picking your plan back up puts it all
back exactly as you left it." The Terms say the same about our side: your agent, its memory, your
files and your keys are on your own computer, we have no access to them, and we do not delete them.

**The catch, and it ships in the same breath every time:** `PaywallScreen` replaces the whole app,
not part of it, so the Account page's **Backups** section (`src/app/moving.tsx`) is not
reachable while a plan is lapsed and no key is saved. The files are all still on the computer and
nothing has been lost, but the one-file backup is written from inside Archie, so **the honest
instruction is to write the backup before you stop, not after.** Any page describing the ending has
to carry that sentence, per the limitation-beside-capability rule. Telling somebody their data is
safe and letting them discover they cannot package it is the shape this entry exists to prevent.

**Closed in Archie 0.3.6, October 6, 2026 (`075a8e18`).** `PaywallScreen` now
carries **Save a backup of your agents**, beside "Already paid? Check again". It runs the same save
dialog and `transfer_save` as the Backups section (`pickBackupPath`, `savedBackupNote` in
`src/app/moving.tsx`), and `transfer_save` asks only that somebody is signed in, which anybody on that
screen is. **The sentence above may stay on every page that has it**: it is still the safest
advice, and Archie for Business has no button until its next release. From 0.3.6, the approved form
for Personal is the one below, and `trust/details/` carries it since October 6, 2026, with the
Business clause: "Nothing on your computer is deleted, and the screen
that asks for a plan has a button that saves a backup of your agents." Never "you can always get
your agents out": a computer signed out of every account still reaches neither the button nor the
Backups section.

**Boundaries — do not cross:**
- ⛔ **Never write the three cases as one.** "Archie keeps working after you stop paying" is false
  for Business and false for a Personal computer with no key saved. Three sentences, three cases,
  in that order, or name the case the sentence is about.
- ⛔ **Never call the landing place a downgrade, a free plan or a lock-out.** The free tier has no
  name (see the free-tier entry above) and this entry does not give it one. Write "you land on the
  free tier", never "you are moved to the free plan".
- ⛔ **Never imply the other agents stop.** `agent_create` in `src-tauri/src/commands/mod.rs` is the
  **only** caller of `may_add_agent`, so the cap is checked when an agent is added and nowhere else:
  a person who lapses with ten agents made keeps all ten, and all ten keep working. What the free
  allowance of one agent costs them is the eleventh. **"One agent at a time" is wrong**, and it was
  in this entry for an hour on 2026-09-22 before the enforcement point was read: FACTS.md's row says
  "what an account with no plan runs", which reads as a runtime ceiling and is not one. "The free
  allowance is one agent, checked when you add one" is the honest form, and the app's own message
  says to delete one to make room rather than reporting a limit and stopping (`agent_limit_message`
  in `plan.rs`).
- ⛔ **Never use this to soften the refund window.** 14 days from first starting a plan, full
  refund, and guided sessions are hours already spent and are not refunded. That is in the Terms
  and it does not stretch.
- ⛔ **Never say restarting is instant or automatic.** Picking a plan back up is a checkout or the
  billing portal, and the portal is the right door for a lapsed subscriber because a fresh checkout
  bills them twice.

### ✅ It answers ordinary questions too, the way any AI chat does (entry written 2026-09-18)

**Approved wording:** "Your agent answers ordinary questions the same way any AI chat you have
used does: how to word a hard email, what a letter actually means, what to cook with what is in
the fridge. Same conversation as everything else it does."

**Why it's true:** a plain text answer with no tool call is the designed, prompted-for and tested
outcome, not an edge case.
- The system prompt names ordinary conversation as one of the agent's abilities, in the same
  sentence that limits the others: "Your abilities are the tools you have been given this turn,
  plus ordinary conversation, and nothing more"
  (`crates/archie-runtime/src/gateway/prompt.rs`, in `build_system_prompt`).
- A persona is framed as a manner rather than a script, with the escape hatch spelled out: "when
  you're asked a plain question, a factual one, or something outside this brief, just answer it
  ... never let it become a reason to withhold a straight answer" (same file). A unit test guards
  that wording, `a_persona_is_framed_as_a_manner_so_a_plain_question_still_gets_a_plain_answer`,
  and the comment above it names the bug it was written for: a "Creative Muse" persona changing
  the subject rather than answering a question with one answer.
- An agent with nothing installed is told it "can hold a conversation and answer from your own
  knowledge" (same file, the bare-toolkit branch).
- The router treats it as a destination rather than a miss: "general: none of these, so the
  assistant answers directly" (`crates/archie-runtime/src/router.rs`), and questions about the
  assistant itself are pulled there on purpose.
- The turn loop returns the model's text as the reply as soon as a round produces no tool calls,
  including the first round (`crates/archie-runtime/src/gateway/turn.rs`, "If the model produced
  no tool calls this round, we have the final reply"). Tool choice is `auto` on a general turn;
  the one place a tool call is forced is gated on a connected calendar. An empty reply is logged
  as a warning, which is the other way round from a rule: text with no tools is the success case.

**Boundaries — do not overclaim:**
- ⛔ **Never say it answers "anything".** It is a model, so it is wrong sometimes, and the app
  says so under its own composer, in those words: "Archie can get things wrong. Check before you
  act on it." (`src/app/conversation.tsx`, and the comment there says why it is under the box
  rather than in the transcript). Say it answers the way any AI chat does, which is a claim the
  reader can check against the chat they already use, and do not promise accuracy we cannot.
- ⛔ **Never use this to imply the answer is private when it is not.** An ordinary question goes
  to the AI company on the reader's own account, exactly as every other message does. On the
  trial or on a plan's included allowance with no key of their own connected, it goes to
  Anthropic through our proxy (`crates/archie-net/src/llm/trial.rs`, and the ordering note in
  `src-tauri/src/commands/gateway_lifecycle.rs`: a key the user connected always wins). That is
  the same route every message takes and is already covered by the entries above; this capability
  adds no new claim about where words go, and must not be written as though it did.
- ⛔ **Do not say it "replaces" a chat app you pay for.** We have not priced that comparison and
  the competitor rules govern it. The true and useful form is that the asking and the doing are
  in one conversation.
- ⚠️ **Where a real answer needs a file or a live fact, the product prefers looking it up.** The
  code pushes toward opening the document rather than answering from the line beside its name,
  and toward labelling a recalled fact as possibly out of date. So do not write copy implying it
  prefers to answer from memory: it prefers to check, and answers from its own knowledge when
  there is nothing to check.
- ⚠️ **The first few messages of a brand new agent are onboarding**, which is a deliberately
  tool-free chat; a task asked during it is deferred with one line while the question is still
  answered (`crates/archie-runtime/src/gateway/onboarding.rs`). Nothing on the site describes
  this, and nothing needs to.

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

### ✅ It can look back through your conversation for something you told it: BUILT 2026-09-25 (Archie `69b2e4ed` and `dd154236`), SHIPPED in Archie 0.3.1 on September 29, 2026

*Released, checked October 6, 2026: both commits are ancestors of 0.3.1's `09c5cb5e`, and every
release since carries them. This heading still said "not yet in a release" until that day.*

**Approved wording, once it is in a release:** "Your agent keeps the last twenty messages in front of
it. Ask about something from further back and it can search your conversation for it, the same
conversation you can scroll back through in Archie."

**Why it's true** (Archie repo, `69b2e4ed` and `dd154236`):
- `crates/archie-runtime/src/gateway/tools_conversation.rs` is the search. It reads the window's own
  record of the conversation, `inapp/transcript.json` in the agent's folder, written by
  `src-tauri/src/inapp.rs`, which keeps the last 500 messages (`MAX_ENTRIES`). It matches the words
  asked for, with no AI call of its own, skips what the agent already has in front of it, and hands
  back at most five messages, each with the day and time it was said.
- The owner's conversation is one conversation across the Archie window and the owner's own chat on
  a chat app: `crates/archie-net/src/mirror.rs` files both under one chat id. So something said on a
  phone is found the same way as something typed at the desk.
- The prompt's sentence about how far back the agent can see names the search on the turns that
  have it, and tells the agent to say plainly it no longer has something when neither its memory nor
  the search finds it (`crates/archie-runtime/src/gateway/prompt.rs`, `build_system_prompt`).
- Tests: `the_owner_can_find_what_they_said_further_back` (the whole loop, in
  `crates/archie-runtime/tests/pipeline.rs`), `only_the_owners_own_conversation_can_be_searched`
  (`gateway/turn.rs`), and the matching rules in `tools_conversation.rs`.

**The boundaries:**
- ⛔ **Never say it remembers every conversation, or everything you ever said.** It searches the last
  500 messages of the owner's own conversation with that one agent, and nothing older exists for it
  to search.
- ⛔ **Never say anybody else can search it.** It rides only the owner's own conversation
  (`turn::may_search_conversation`): the owner's messages, and a message a watcher delivers into
  that conversation. It is refused at dispatch anywhere else. A guest on a shared agent never gets
  it, including a guest allowed to act as the owner, and it never reads another person's
  conversation with the agent.
- ⛔ **Never say it understands what you meant.** It matches words. A question worded differently
  from what was said can miss, and the agent is told to say it no longer has it rather than guess.
- ⛔ **Do not merge this with the memory claim above.** The memory is what the agent carries on every
  message; this is a search the agent chooses to run when asked about something further back. The
  memory entry's line that its recall has no tool stays true, because that is a different file.
- ⚠️ **Not everywhere a person talks to it.** A second conversation thread in the window and a
  routine do not get it: the thread has a record of its own, and a routine is not in a
  conversation.
- ⚠️ **What it replaced.** The agent used to be told that anything older than its twenty messages
  "has been dropped and you cannot read it", which was true of what it could see and false of what
  the owner could scroll back to. The Archie repo's `docs/CHAT-UX-REVIEW.md`, finding 2.5, is where
  that was found.

### ✅ Your whole agent in one file, and no key is in it (SHIPPED 2026-09-02 in Archie 0.2.2; entry written 2026-09-21)

**Approved wording:** "Everything you built is in one file you can save where you like: your
agents, their skills with the answers you gave their setup questions, their routines with the
schedules, what each one remembers about you, your records, your writing style and the
conversations. Archie can write one every week on its own and keep the last three. **No key or
token is in it.** Those stay in your computer's own password store, and putting the file on
another computer hands you a list of what to connect again."

**Why it's true:** `crates/archie-domain/src/transfer.rs` is the format and every refusal;
`crates/archie-core/src/transfer.rs` writes and unpacks it. The file is an ordinary zip with the
extension `.archie`, holding three things: `manifest.json`, the database `archie.db` (agents,
workspaces, which add-ons each one has, the access record) and the `workspaces/` tree, which is
every agent bundle (persona, skills with their setup answers, routines with their schedules and
timezones, records, memory, writing style, chat history, documents). The person picks the
destination; `AUTO_KEEP` is 3 and the weekly writer keeps that many. The section is on the
Account page under **Backups** (`src/app/moving.tsx`).

**The key claim, and it is the one worth checking.** `saved_keys` in the manifest is
`db.all_credential_refs().len()`, a **count**, and no value is read out of the credential store
anywhere in the module. Secrets live only in the macOS Keychain or Windows Credential Manager
(`crates/archie-core/src/secrets.rs`, whose module comment states it), and the database rows are
`CredentialRef`: a label and a last-4. The design note in `transfer.rs` says why, and it is
quotable: a file that carried them "would be every credential its owner has, in one attachment,
guarded by wherever they happened to save it."

**What it will not carry, which ships beside the claim and never below it:**
downloaded tools (ffmpeg, whisper, the speech models) come back by themselves the first time a
skill needs one; the permissions macOS grants belong to the copy of the app, not to the data; a
paired phone is paired again, because its key belongs to the old computer. Two more travel and
are then deleted on purpose: an agent's browser sign-ins and its Signal link are ordinary files
in the bundle, and on a **different** computer both are worse than missing (the browser opens
signed out of everything while looking fine, and one Signal link on two computers is a state
Signal does not expect). `CopyManifest::machine_id` is what separates a rescue from a move, and
`notes()` names every dropped item on screen.

**Nothing is deleted to make room.** A restore moves what was there into `replaced-<timestamp>/`
beside it and keeps two (`REPLACED_KEEP`), so a restore somebody regrets is a folder they still
have. The swap happens at the next launch, before the database is opened.

**Boundaries — do not overclaim:**
- ⛔ **Never say the file is encrypted or protected. It is a plain zip**, and it holds chat
  history, records and documents. It is exactly as protected as the folder it is saved into. Any
  page describing this **must** say so in the same breath, per the limitation-beside-capability
  rule: "it is an ordinary file, so keep it somewhere you would keep a tax return." Saying
  "backup" without that is the banned shape, because readers assume a backup is sealed.
- ⛔ **Never call it an export to anything else.** It restores into Archie and nothing else reads
  it. It is not an interchange format, and no sentence may suggest a reader can carry their agent
  to another assistant with it. What it does prove is that leaving **us** costs nothing: the file
  plus the Terms' final-version commitment is the whole of "yours to keep."
- ⛔ **Never say a backup moves everything.** Four categories do not travel and are listed above.
  "Puts that computer where this one is, minus the things a file cannot carry" is the honest form.
- ⛔ **Never use this to revive "you own Archie."** That claim is retired (see the 2026-07 note at
  the top of this file) and this entry does not bring it back. This is ownership of **what you
  built**, not of a software licence. Write "your agent is yours", never "Archie is yours".
- ⚠️ **A restore is refused across accounts and across editions**, and refused when the backup was
  made by a newer Archie than the one reading it (`refusal()`). Do not write "restore it anywhere";
  write "restore it on a computer signed in as you."
- ✅ **The layout is published, since 2026-09-28** (Jett's call): `trust/details/#backup-long` for
  readers, and the Archie repo's `docs/BACKUP-FORMAT.md` for the full field list, both read from
  `transfer.rs`. Publishing it is for looking inside your own file. It changes nothing above: it
  still opens in Archie and nothing else, and the page says so.

### ✅ What Reset Archie erases, and what it leaves behind (entry written 2026-09-29)

**Approved wording:** "Reset Archie erases your agents and your saved keys from this computer."
And wherever that is said to someone leaving, the leftovers go with it, in the list or the
paragraph beside it: the setting that wakes the computer for routines, and, on Windows, the
uninstaller's box "Also remove my Archie data, agents, and settings". *[The phone mailbox came off
this list on October 6, 2026: Reset empties it from 0.3.3 on (Archie `be864a76`), and every edition
is past that. "Resetting also disconnects every phone and empties its sealed mailbox" may be said.]*

**Why it's true** (`app_factory_reset`, `src-tauri/src/auth.rs:1579`, 0.3.1 `09c5cb5e`, unchanged
on main): it deletes every credential the database lists from the Keychain or Credential Manager
(the AI key, account keys, app passwords, chat tokens), the sign-in keys in `SESSION_KEYS`, every
agent folder, `archie.db` and the crash logs, then restarts. The Account page's Resetting Archie
section asks you to type "reset" first (`account.tsx`).

**What it leaves, and why each matters:**
- **The phone mailbox on our server, through 0.3.2 only.** Reset did not call the relay's `wipe`,
  so the sealed snapshot stayed until **Disconnect every phone** or the account was deleted. From
  0.3.3 (`be864a76`, September 30, 2026) `app_factory_reset` calls `phone::disconnect_every_phone`
  first, best effort: a relay that cannot be reached is logged and the reset carries on, and the
  pairing key goes either way, so what a failed wipe leaves is ciphertext nobody holds a key to.
- **On Windows, the uninstaller's box is not a reset.** "Also remove my Archie data, agents, and
  settings" deletes the app's two data folders (`RmDir /r "$APPDATA\${BUNDLEID}"` and the same under
  `$LOCALAPPDATA`, `src-tauri/installer/installer.nsi`) and leaves every saved key in Credential
  Manager, the wake task and the mailbox. The privacy policy said it "does the same" as Reset until
  2026-09-30; say reset first.
- **Two app keys in the password store:** `vault_key_v1` and `phone_pairing_key` are not in
  `SESSION_KEYS`. Neither is an account's key, which is why "your saved keys" stays true.
- **The wake setup.** Reset leaves no routines, so nothing wakes the computer, but the Mac helper
  (`/Library/PrivilegedHelperTools/archie-wake` and its LaunchDaemon; `archie-wake --uninstall`
  removes it) and the Windows task `\Archie\Wake` stay installed.
- **Open Archie at login**, a login item the autostart plugin owns, stays as it was set.
- **Downloaded models** (`assets/`, deliberately, since they are ours and say nothing about anyone),
  the `telemetry-off` marker (deliberately, since deleting it would switch reports back on), and
  any `replaced-*` copies of agents from a restored backup (`commands/transfer.rs`).

⛔ Never "erases everything" or "leaves nothing behind". Found by the Learning Library check of
2026-09-29, which is what 3.3's script was waiting on.

### ✅ How long the phone mailbox keeps things (entry written 2026-09-30)

**Approved wording:** "The phone deletes a message once it has read it. One it never came back for
is cleared by your computer a day after it was answered, the next time Archie is running. The sealed
picture of your agent that the phone shows is replaced as it changes, and removed when you press
Disconnect every phone or delete your account."

**Why it's true:** commands and their answers are documents in `users/{uid}/phone_commands`; the phone
deletes what it has read, and the computer sweeps answered ones older than `SWEEP_AFTER_SECS` (24
hours), once an hour while phone access runs (`src-tauri/src/phone.rs`, `delete_command` and
`stale_command_ids` in `crates/archie-core/src/phone.rs`). The snapshot is one state document,
overwritten by `publish_state` and deleted by `wipe`, which Disconnect every phone calls
(`phone_disable`) and account deletion removes with the account (`stripe-webhook/index.js`).

**Boundaries:**
- ⛔ **Never a fixed limit in days.** The privacy policy said "at most 30 days" until this entry, and
  no code enforced it: the sweep needs the computer on and Archie running, so a message can outlive a
  day by as long as the computer is off.
- **Reset removes the snapshot from 0.3.3 on** (`be864a76`), as Jett decided on 2026-09-30. The
  leftover came off the Reset entry above and off the privacy policy on October 6, 2026.

### ✅ What your agent can write to disk

**Approved wording:** "Your agent writes the actual file and tells you where it put it. It can
write eleven kinds: `.pdf`, `.pptx`, `.xlsx`, `.csv`, `.docx`, `.md`, `.txt`, `.json`, `.html`,
`.ics` and `.vcf`. It chooses the filename. It never chooses the folder."

**Short location wording, verified 2026-10-01 against released 0.3.2 (`94f85315`):** "Files
land in Downloads, in the Archie folder. Your agent chooses the filename and tells you where to
find it." `src-tauri/src/commands/gateway_lifecycle.rs`, `export_dir`, binds the destination to
`app.path().download_dir().ok().map(|d| d.join("Archie"))`. No Downloads folder means the tool is
unavailable. This is the folder on the computer running Archie, not a promise of cloud syncing.

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
reads the file and renders every slide, and **on October 6, 2026 PowerPoint 16.113 for Mac opened a
five-slide deck from `deck.rs` with no repair prompt**, and the same deck after an agent's edit to one
slide. `deck.rs` has not changed since 0.3.5, so this holds for the release. "Opens in PowerPoint" may
now be said of a deck. The same run opened files the agent **edited** (`edit_document`,
`crates/archie-domain/src/document_edit.rs`): Excel 16.113 a workbook with a row added and a figure
changed, its total recalculated, and Word 16.113 a letter with a sentence changed and a line added,
neither asking to repair (Archie `crates/archie-runtime/tests/office_live.rs`). ⚠️ Those were files
Archie's own writers made. A workbook Excel itself saved carries a calculation chain and shared
strings the edit rewrites, and that has not been tried, so never say an edited Excel file "opens
cleanly in Excel" without that caveat until it has (Archie `docs/TEST-DAY.md`, item 11).

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
  be described in the present tense until it ships. Pictures got a ✅ entry of their own on
  2026-10-07 (the next entry); voice notes still have none, so no page claims them until one is
  written with its clauses. Until
  2026-09-16 this line said Archie writes none of the four, and
  the homepage carried "No PDFs, pictures, audio or video" as a limitation on the strength of it;
  it was false on two of four and the chip was retired. The BetterClaw wishlist (item 7) proposed
  exactly that list and it would have been false on four of eight entries. Added here 2026-08-24
  so the next person checks the table instead of the brief.
- ⛔ **Never say the agent writes "into your folders"** or anywhere on your disk. It writes to one
  folder, and the location is not the model's to pick. The weaker-sounding claim is the true one
  and it is also the safer-sounding one, which is rare enough to be worth keeping.
- The eleven are what the *export tool* writes. This row says nothing about what an add-on or a
  connected account may read, which is a separate question with its own answers.

### ✅ Your agent can make a picture (added 2026-10-07)

**Approved wording:** "Your agent can make a picture and send it to you in the conversation. It
draws with OpenAI or Google: on your own account with either one, or on a Gemini account you add
just for pictures. With only a Claude account, it cannot draw."

**Why it's true:** `crates/archie-runtime/src/imagegen.rs` is the `generate_image` tool, and
`crates/archie-net/src/images.rs` draws with `gpt-image-1` or `gemini-2.5-flash-image`
(`provider_makes_images` is OpenAI and Gemini only). Anyone on another provider can save a Gemini
key for pictures alone, and the tool is not offered at all when neither key exists. The picture
is sent into the conversation, or saved on the computer with its path reported when the chat app
cannot take a file. Shipped in Archie 0.1.3 (`docs/releases/0.1.3.md`: "It can make pictures
too"), built 2026-08-02 (`334be887`). Written up 2026-10-07 because `compare/chat-apps/` had
carried the app's own picker notes ("in use makes pictures") since 2026-09-19 with no entry
under them, which the Tab and Eden review caught.

**Boundaries:**
- ⛔ **Never "free pictures" and never on our credits.** A picture is billed to the AI account that
  draws it, in tokens, at a rate that moves with the provider's own quality setting
  (`images.rs`, the `usage` field). No page prints a price per picture; FACTS.md has none.
- ⚠️ **What you ask for goes to OpenAI or Google**, whichever draws it, even when your agent
  otherwise thinks with Claude. A page that says pictures come from your own computer is wrong.
- ⛔ **Never video or music.** Neither exists (`video.rs` only reads a video it is sent).

### ✅ Add-ons are data, not code

**Approved wording:** "An add-on is a text file, not a program. A Skill is markdown plus
settings. It cannot run code on your computer, because Archie has nowhere to run it."

**Second approved form (2026-09-27, the voice pass):** "An add-on is a text file your agent reads.
A Skill is written instructions plus settings. It cannot run code on your computer, because Archie
has nowhere to run it." The same claim without the contrast; the browse page's caption uses it.

**Amended 2026-10-02, when Computer control shipped:** both captions now say "It cannot run code or a
command on your computer, because Archie has nowhere to run one", and the figure beside them labels
the struck-out block "Code" where it said "A program". On a Mac the agent can now open an application
the owner allowed, so a struck-out program would read as untrue; an add-on still brings no code and
Archie still has nowhere to run any.

**Why it's true (reworded 2026-08-21):** No shell, no `dlopen`/`libloading`, no WASM, no JS
`eval` anywhere in `crates/` or `src-tauri/`. Process spawning does exist, and the old "no
`std::process::Command` anywhere" claim was flatly untrue: the crates spawn our own
hash-verified sidecars (ffmpeg, whisper, yt-dlp, the `imsg` tool), the screen lane's browser,
and the OS's device-id readers, each with an explicit argument list. What carries the claim is
that **no add-on text and no model output can ever name a program to run**: nothing parses
either into a command. Tauri capabilities are deny-by-default
(`src-tauri/gen/schemas/capabilities.json`) and expose no shell, fs, or http permission to
the webview.

**What that costs, and it must be published wherever the safety of it is claimed (added
2026-09-18).** An add-on is instructions plus permission to use tools the app already has. Which
tools exist is a code-declared registry (`TOOL_GRANTS` in
`crates/archie-runtime/src/gateway/skill_builder.rs`), and which services may be named is a closed
list (`integrations()` in `crates/archie-domain/src/addon_fields.rs`, plus the connector catalog in
`crates/archie-domain/src/connectors.rs`). `docs/ADDON-ARCHITECTURE.md` says an unknown value
"grants nothing, silently", and ADR-0007 gives the reason: a static registry means no dynamic code
loading. **So adding a service, a tool, an event source or a screen is an app release, and only we
can cut one, with one exception below.** Read the code for the current sets; the architecture doc
warns that its own copy of them goes stale, and so would a copy here.

**The exception, and it is a real one: a remote MCP server (shipped 2026-09-02).** A person types
an `https` address under Connections, and `connector_connect` asks that server what it offers and
stores its answer on the connection (`entry.mcp_tools`, from `McpServer::list_tools`). Those tool
names then go onto the model's belt every turn, named inline in `mcp_call`'s own description
(`mcp_call_definition` in `crates/archie-runtime/src/connectors.rs`). The door for any address is
**Something else** at the foot of the Apps list: an address that looks like one an app hands out for
AI assistants (`looksLikeAiAddress` in `src/app/connect.tsx`) is connected this way, under the name
the person gives it. Four vendor servers are also in the catalog (GitHub, Linear, Stripe, Cloudflare),
and since 2026-09-24 the list offers one only when a skill on that agent asks for it, because no
store add-on reads them. So the person really has added tools Archie never shipped, without a
release. What does not change is the safety shape: a tool the server marks read-only runs, and
anything else is staged for the person's approval like every other write.

⚠️ **The app never says "MCP" to an owner, and copy for owners should not lean on it either**
(Jett, 2026-09-24: most people do not know what MCP is). The app's words are "an address for AI
assistants", and the only "MCP" left on its screens is Fireflies' own menu name, "MCP & Dev Tools",
spelled the way Fireflies spells it (`no_label_or_description_says_mcp` in the Archie repo's
`crates/archie-domain/src/connectors.rs` holds the catalog to it). On the site, say what the door
does in those words and give MCP as a parenthetical at most, for the reader who already knows it.

**Signing in instead of pasting a key, since 2026-09-24.** *Approved wording:* "Some servers have you
sign in on their own site instead of giving you a key. For those, Archie opens the sign-in in your
browser, and what comes back is kept in your computer's password store." Why it's true: the Archie
repo's `archie_net::mcp_auth` and `connector_mcp_sign_in` (`16145ae6`), which find the server's
sign-in pages from the server itself, refuse any of them that is not public https, register Archie
for that one sign-in, and keep the refresh token in the credential store like every other secret.
Built for Robinhood's trading server. ❌ Never name Robinhood, or any trading, as something Archie
does: no add-on uses it yet, and a trading claim needs its own entry. ⚠️ A server that rotates its
sign-in may ask again after Archie restarts (the Archie repo's `docs/OPEN-THREADS.md`).

⚠️ **Barely tested against a live server, so say what it does and never call it proven.** Until
October 6, 2026 nothing had connected to a real endpoint. That day Archie's client (`mcp.rs`, unchanged
since 0.3.5) listed the four tools of GitMCP's public server and ran one read that came back with
real text (Archie `crates/archie-runtime/tests/mcp_live.rs`). Still untested: a server that takes a
key, and a write that waits for the owner's yes (`docs/TEST-DAY.md`, item 29). Same clause as
Flight Check-In.

⚠️ **A server that wants no key cannot be connected if it refuses one.** The connect screen will not
save a server without a key (`connector_connect`), and the client always sends it. DeepWiki's public
server lists its tools and then refuses every call for that reason ("Authentication is not allowed
on the public DeepWiki endpoint"). Never say "any MCP server" without the key: say a server you
have a key for.

⛔ **Never imply a person can extend what Archie can do, except through an MCP server.** Outside
that one door they recombine what exists, at any depth, and a new service or ability comes from us
in a release. This boundary read as absolute until 2026-09-19, seventeen days after the door
opened, which is this file's own stale-boundary failure: it made us claim less than we can do.
✅ **Do say** that the shelf and the skill you write yourself draw on the same fixed set, and that
an MCP server is the way past it.

---

### ✅ Ask it whether it can do something, and it searches the shelf before it answers (entry written 2026-09-21)

**Approved wording:** "Not sure your agent can do something? Ask it, and it will build it for
you. It searches the add-ons for one that fits, and writes a new skill when none does. It shows
you what it is adding, and adds nothing until you say yes."

**"Build it for you" travels with the last sentence or not at all (2026-09-21).** On its own it is
the shape this entry bans two lines down, because it promises the doing without the asking, and it
also quietly promises a new skill where the app would rather hand over one of the 160 that already
exists. Both are answered by the two sentences that follow it, so the three ship together, on one
screen, in this order.

**Why it's true:** the tool is `marketplace_search` (`crates/archie-runtime/src/addons.rs`, in
`tools()`), and its own description tells the agent that a question about the store in any wording
("can Archie do X?", "what would let you do X?") **is** a search, to run it rather than answer from
memory, and never to invent an add-on. The match is a local word score over the catalog that copy
of Archie holds, capped at `MAX_RESULTS` of 5, with `STOP_WORDS` and `same_word` doing the
matching: no network call, no second model. The chat builder's classify table puts the search
first, above writing anything ("a job nobody here does, wanted again: search the store; if one
fits, offer it beside Make one just for me"), a row added 2026-09-08 after a live run wrote a
medications skill while Medication &amp; Refill Reminder sat in the store unread
(`docs/CUSTOM-SKILLS-FROM-CHAT.md`).

**The "adds nothing until you say yes" half, which is the load-bearing one.** Finding and adding
are two tools. `marketplace_install_pending` stages and returns "Staged, not added. Ask the user to
confirm", and the apply pair (`marketplace_apply_pending_change` / `..._discard_pending_change`)
exists only on a **later** turn that has something staged (`apply_tools`), so the yes is a real,
separate message and the model cannot approve its own proposal. `stage()` refuses an id that is not
in the catalog and refuses anybody but the agent's owner. A written skill is gated the same way by
its own Keep it card.

**Boundaries — do not cross:**
- ⛔ **Never "it finds the right one".** It is a word match over names and descriptions, five at
  most, read back by a model. Say that it searches and tells you what it found.
- ⛔ **Never say it installs, or "adds it for you".** It proposes; the owner says yes on a later
  message. Only the owner: a guest on a business agent is told to ask them.
- ⛔ **Never imply a live search of the whole catalog.** It searches what that copy of Archie was
  holding when the agent started, which is the staleness `catalog_offers` carries by design.
- ⚠️ **Both tools are withheld when there is nothing to find** (an agent with the catalog already
  installed gets neither) and when no installer is wired, where it can find but not offer. So never
  write it as a thing that happens on every turn.

### ✅ You can tell it what you wish it did, and it writes the skill (SHIPPED 2026-09-01, Archie 0.2.2)

**Added 2026-09-18, three weeks late, and nothing on the site has ever said it.** This is the
strongest answer we have to "can I make it mine", it shipped in the same release as the mail
providers, and it went unclaimed while the compare board drew us a level below three products
whose advantage is that you can edit their code.

**Approved wording:** "Say what you wish your agent could do, in your own words. It asks a
couple of questions, writes the skill, and shows you a card naming what it assumed. Press Keep it
and your agent has it. If you would rather fill in the fields yourself, the Skills tab has the
form."

**Why it's true:** the chat path is `crates/archie-runtime/src/gateway/skill_builder.rs`, whose
tools (`skill_builder_start`, `skill_draft_pending` and the rest) draft against the same caps and
the same tool registry the catalog is validated against; the card, the buttons and the reply after
Keep it are written in Rust, so what a person reads cannot drift from what was built.
`docs/CUSTOM-SKILLS-FROM-CHAT.md` documents the flow, with the live runs that shaped it, built
2026-09-01 and reworked the next day. The form is `src/app/skill-builder.tsx`, writing through
`skill_add` (`src-tauri/src/commands/bundle_env.rs`). A skill made either way carries no
`manifest.json`, which is how the app tells it from a catalog one, and `skill_prompt_is_customized`
(`crates/archie-core/src/bundle/skills.rs`) is why a catalog refresh leaves a prompt you edited
alone.

**Boundaries — do not cross:**
- ⛔ **Never "build your own add-on" unscoped.** Skills, specialists and routines can be written
  on this computer (`skill_add`, `subagent_add`, `routine_add` in `src-tauri/src/lib.rs`). A
  personality cannot: there is no `personality_add`, only install, remove and additional rules.
- ⛔ **Never imply a skill you write can do something Archie could not already do.** See the
  ceiling under "Add-ons are data, not code". It is instructions plus permission.
- ⚠️ **The form offers a subset of the services, not all of them.** `CUSTOM_SKILL_INTEGRATIONS`
  in `src/app/skill-builder.tsx` is calendar, mail, two task lists and meeting notes, plus (since
  2026-09-18) anything this owner connected under Something else. Never print that list as the set
  a skill can reach; read it from the code, and never imply it is everything the catalog's own
  skills may name. The chat builder is the wider of the two: its list is every service in the
  catalog as well.
- ⛔ **Never "no review" or "publish it yourself".** Writing one for your own agent is local.
  Getting one into the shelf for other people is a submission we read by hand.
- ⛔ **Never as a thing only we do, and this was checked properly on 2026-09-18.** Six of the nine
  products on the compare board publish the same capability, each in its own words: Claude&rsquo;s
  skill-creator (&ldquo;Describe what you want, and Claude generates the folder structure&rdquo;),
  Vellum (&ldquo;You can create new skills by describing what you want in the chat&rdquo;), Hermes
  (`/learn`, &ldquo;without hand-writing the SKILL.md&rdquo;), OpenClaw (Skill Workshop, &ldquo;ask
  the agent for the skill you want&rdquo;), Grok Bot (&ldquo;Save the process we just used as a
  skill&rdquo;), and Meta Muse on its engineering blog (&ldquo;builds its own tools&rdquo;, though
  Meta&rsquo;s own help centre says skills are Meta-built and cannot be installed, so that one is
  contested between two Meta pages). **Getting a new ability by asking for it is table stakes
  among agent-shaped products, not a differentiator**, and the entry above calling it our
  strongest answer to &ldquo;can I make it mine&rdquo; was written before that was known. It is
  still true that it is our strongest answer. It is not true that it sets us apart, and any page
  implying it does is wrong.

### ✅ An API nobody here has heard of, connected and used. SHIPPED 2026-09-18, the day a skill could first name one

**Approved wording:** "If the service you want is not on our list, connect it yourself. On the
Connections tab, press Something else, give it a name, the web address of its API, and the key that
service gave you. Then write a skill that uses it and tell your agent which addresses to call."

⚠️ **Never run against a real service** (Archie `docs/OPEN-THREADS.md`, "A key you added by hand
now reaches a skill, and nothing has been connected that way"; noted October 6, 2026). The heading's
"connected and used" names what the code allows, not something anyone has done. The approved
wording above says how to do it and stays; do not add "people use it to" or any sentence that
reports it working until `docs/TEST-DAY.md` item 30 has passed.

**Why it's true:** `connector_connect` (`src-tauri/src/commands/integrations.rs`) accepts a service
id that is not in `KNOWN_SERVICES` and builds the connection out of the address and the key the
person typed. The key goes into the Keychain bound to that one host, exactly like a catalog one, and
`service_path` (`crates/archie-runtime/src/connectors.rs`) refuses any URL that would land somewhere
else. A skill reaches a connection only by naming its service id (`connectors_for_target` in
`crates/archie-runtime/src/gateway/turn.rs`), and since 2026-09-18 both places a person writes a
skill can name these ids: the chat builder's own list, its validator and the check on the tool the
body calls (`hand_added_services` in `gateway/skill_builder.rs`), and the boxes on the Skills tab
form (`src/app/skill-builder.tsx`).

**Boundaries:**
- ⛔ **Never "works with any service".** It works with a service that answers over https and takes
  its key as a Bearer token or in a header the person names. `host_of` in `crates/archie-net/src/http.rs`
  refuses anything that is not https. A service that will not issue a key cannot be connected here
  at all, and no service signs in through the browser yet.
- ⛔ **Never imply Archie knows the API.** It knows the address and the key and nothing else. The
  person writing the skill supplies the paths, which is what both builders now say on screen. Never
  sell this as "it figures out the API".
- ⚠️ **Every write asks first, and that is not a setting.** `read_paths` and `receipt_paths` are
  empty for a service nobody has tested, so reading runs and anything that changes something is put
  in front of the person (`call_is_read`). Say it as the protection it is, never as a limit that can
  be turned off.
- ⛔ **Never put one in the works-with band, or in any count of what Archie works with.** That
  roster is what we have tested. A service somebody connected themselves is theirs, and we make no
  claim at all about it working.
- ⛔ **Never say it existed before 2026-09-18.** The key could be connected from 2026-08, and no
  skill could name it, so it answered nothing. The claim is the pair, not the connect screen.

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
  twenty-four rows on 2026-09-18: twenty-three named services and one for any other MCP server
  (on screen since 2026-09-24, that one is the Something else door, and the four vendor MCP rows
  appear only when a skill asks for one, so the Apps list shows nineteen of these plus Todoist,
  Fireflies, Zoom and GoHighLevel).
  Count the file before printing a number; this one has been stale before. A key is bound to one host (`ConnectorEntry`) and the runtime attaches it,
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
- **Archie itself asks Philips once, to find a Hue bridge.** The Scan on the Home devices card asks
  Philips' discovery server (`https://discovery.meethue.com/`, `hue::discover_via_cloud` in
  `crates/archie-net/src/local/hue.rs`) which bridges have reported in from this network, the way
  the Hue app does. The request names no light and no room; Philips sees the network's public
  address, as any website would. Switching a light never leaves the network. So "finds them on your
  own network" is true of WiZ and LIFX and not of Hue. Found October 6, 2026: the privacy policy said
  it of all three until that day, and the Home Lights add-on said "Nothing about your home ever leaves
  this computer" until Archie `9aca1535` (the site's catalog copy was corrected the same day; the live
  store followed when Archie was pushed that evening).
- What the agent learns from a light (its name, on or off) goes to the AI provider like any other
  tool result. Say so wherever the local lane is described; the privacy policy does.
- **Google Drive is per file, and the privacy policy did not name it until October 6, 2026.** The
  connect screen's "Files (Google Drive)" box asks for `drive.file` (`SCOPE_DRIVE_FILE`, Archie
  `src-tauri/src/commands/integrations.rs`), so the agent sees only the Sheets and Docs the owner
  picks in Google's picker; a spreadsheet change is staged (`ProposalKind::Drive`) and applies on a
  later message. `drive_read` and `drive_write` run on the starter credits and the plan with the AI
  included (`tool_policy::credit_policy`), so picked files ride the proxy there like calendar data.
  Never "it can read your Drive".

### ✅ Websites: the agent using a site itself, when there is no connector — SHIPPED 2026-08-18

**Recorded 2026-09-16**, a month after it shipped, because it had no entry here and the rule at the
top of `CLAUDE.md` is that a claim not in this file may not be made. The cost of that gap was not
silence on the site. It was that the people answering questions about Archie were telling prospects
the opposite, and filing a shipped capability as unbuilt work in benchmark and competitor notes. **A
capability with no row in this file reads to everyone downstream as one we do not have.**

**Approved wording:** "When there is no direct connection to a site, your agent can use the site
itself, the same way you would: it reads the page, it clicks, it types. It works in a browser window
on your own computer, and you can watch it. You sign in yourself, once, in that window. It never
types a password, a card you pay with or a sign-in code, and where one of those is asked for it stops
and hands you the window. Before it presses anything that sends, submits or finalizes something, it
stops and sends you the page. Tap Press it for me, from Archie, your phone or your chat app, and it
presses that one button; or finish it yourself, in the window on the computer, or in the shop's
own app on your phone if your cart shows up there. A purchase also needs buying switched
on, at a shop you picked and up to a limit you set; a subscription or free trial also needs it on,
and the card says what it repeats at. Moving money and signing a contract are always yours to
press. You name the sites it may never open at all, and
every job has a time limit."

**Changed 2026-09-24: a finalizing press can be handed over with a tap.** Jett: "not everybody is
going to be at their computer to press to approve." Before this, no answer released one. Now the
owner's tap on the card releases that one press, by its name and its site, once
(`PendingPress` in `screen/tools.rs`, rechecked against `guard::click_can_be_tapped` at the moment
of the click). A guest cannot give it and a routine never receives one (`turn.rs`, owner only).

**Amended 2026-10-02: "a card number" became "a card you pay with"** in the wording above, the form
Jett approved for Computer control the same day. Both halves type through one guard
(`guard::typing_stop`), and since his call a gift card, library card, loyalty or membership number
is typed there (`guard::names_a_card_that_is_not_payment`), so "never types a card number" stopped
being true on a website too.

**Amended 2026-10-02: two defects in every release through 0.3.3, fixed in 0.3.4, released
October 2, 2026** (Archie `9549aefc` and `b498fdf4`). Jett first chose a fix-only 0.3.4, then the same day
chose to release main with everything in it, since `release.sh` ships only from main. Found while
building the applications half (below), by mapping the tool layer before building on it. Both make a sentence in the approved wording above untrue in one case, so the copy is safe
only for a release that carries the fixes:

1. **A press the owner approved once could be pressed again without asking.** The remembered route
   (`screen/routes.rs`) recorded every click that landed, including a Submit or a Place order the
   owner had tapped Press it for me on, and replay pressed every recorded step with no stop at all.
   So the next run of the same errand on the same site could press Place order with no card, no tap
   and no line on the spending ledger. Fixed in Archie `b498fdf4`: an approved press is never
   recorded, and replay checks every remembered click against stop 3 and the never-list, because a
   route file written before the fix is still on somebody's disk.
2. **A guest could read the owner's browser.** On a shared agent, `screen_read`, `screen_choose` and
   `screen_ask` were not owner-only, and a guest's ask sent a picture of the owner's signed-in
   browser into the guest's chat. Fixed in Archie `9549aefc`: every screen tool is the owner's.

**Jett's call, 2026-10-02: close it with the patch release rather than a disclosure.** Until 0.3.4
is out and installed, "before it presses anything that sends, submits or finalizes something, it
stops" has the exception in item 1 on every installed copy; from 0.3.4 it does not. 0.3.4 shipped the
same day, and a copy updates itself when Archie is next opened, so the exception lasts on a computer
only until then.

**It is off until the owner turns it on**, per agent. That clause travels with every description of
it: releasing it decided that the choice exists, not what anyone chose.

**Why it's true:** `crates/archie-runtime/src/screen/` in the Archie repo.
`SITES_AND_APPS_RELEASED` in `crates/archie-domain/src/screen.rs` is `true`, and so is its twin in
`src/app/vocab.ts`; a test fails if only one of them moves. The app calls it **Websites**, on the
Connections tab, from 2026-08-19 through 0.3.3. From 0.3.4 (October 2, 2026, carrying Archie
`3ff8fee9`) the entry is called **Computer control** (see its entry below), and the site says "under
Computer control" everywhere it used to say "under Websites", changed the same day.

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
  purchase, booking or application. An agent with buying switched on gets `NEVER_LINE_BUYING` in
  its place, which releases a purchase inside the owner's limits and nothing else.
- **What it learns stays with the person.** `screen/routes.rs` records the click path that worked as
  role and accessible name, never selectors and never coordinates, learned per person and never
  shipped inside an add-on. **Only clicks are recorded, never typing**, because typed values are
  often sensitive and a route file must never hold them.

**Required clauses — do not drop them:**
- ⚠️ **Say it is off until they turn it on.** Anything else describes a computer the reader does not
  have.
- ⚠️ **Say the decision comes back to them.** Every stop above ends with the person deciding,
  either by tapping for the agent to press that one button or by finishing it themselves (the card
names the button by its own name on the page, the computer running Archie and the shop's app, with
"if your cart shows up there", because not every shop keeps a cart across devices; since Archie
`9d13a9ac`, September 28, 2026, when "that one button" on the card was too vague for Jett), and that
  is the actual claim. Not that the agent is careful: that the part which could hurt them waits for
  them. Passwords, cards you pay with and sign-in codes are still never typed, tap or not.
- ⚠️ **Three add-ons use it today**, Statement Collector, Form Filler and Flight Check-In
  (`required_screen` in the Archie repo's `data/marketplace/skills/`, and that grep is the count).
  Flight Check-In joined on 2026-09-16 and this clause was not updated in the same pass, while the
  entry describing it sits forty lines below. Copy implying a shelf of them is still describing
  next year.

**Boundaries — do not cross:**
- ❌ **Never say Archie buys, books, or checks out without the switch and the limits in the same
  sentence.** It cannot type a card you pay with at all, and with the Buying switch off, which is how it
  ships, the press that finalizes an order comes back to the person as a question. Switched on, it
  may press Place order inside the owner's limits. **Rewritten 2026-09-24**, when Jett approved
  buying for copy: see "Buying, as a switch the owner turns on" below for the wording and its
  required clauses.
- ❌ Never "it fills in the whole form". It fills what is not a password, a card or a code, and
  stops at the ones that are.
- ❌ Never describe this entry as driving **applications**. Since 0.3.4 a Mac's applications are
  the other half of Computer control, which has its own entry below with its own wording and its own
  boundaries: say them from there. On Windows, websites are the whole of it.
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
  anything, and it cannot type a card you pay with. With buying switched on and the airline on the shop
  list, the code would release a Pay press, so "it buys nothing" rests on the add-on's own
  instructions in that one case. A page that lists this beside "books your travel" has
  broken the strongest claim in this file to advertise the weaker half of a feature.
- ⚠️ A confirmation code and a surname are not a password, which is why this works at all. Where an
  airline wants an account sign-in or sends a code, it hands the window over like everything else.
- ⚠️ **Untested against a real airline.** It runs on a lane that is now tested against a real site,
  and no airline has been checked into. Copy may say what it does and may not say it is proven.

**What this settles outside this file.** A benchmark or a comparison that scores Archie low on
purchasing and booking is scoring a decision, not a gap, and the answer is still to say so rather
than to file the work. **Updated 2026-09-24:** the decision changed in the code on September 21 and
on the site on September 24. Buying is an opt-in switch with limits the owner sets (see "Buying, as
a switch the owner turns on"), so the answer to a benchmark is that Archie buys when its owner has
said it may, where and up to what they said. Booking a trip end to end is still not a claim: a
Book now press is released like a purchase, but nothing plans and books travel as one job.

### ✅ Computer control: the agent using the apps you allow on a Mac, in the background: SHIPPED 2026-10-02 in 0.3.4 (Archie `9549aefc` to `2454cd4f`)

**Release verified October 2, 2026:** [Archie v0.3.4](https://github.com/JettNguyen/archie-releases/releases/tag/v0.3.4)
is published, and its first release note names Mac app control, the allowed apps, and the stops
below. The release gate is satisfied; the approved wording may now be used in the present tense.

**Recorded the day it was built**, so the row exists before anybody is asked about it: the Websites
row above went a month without one, and a capability with no row reads downstream as one we do not
have. **It shipped the same day, in 0.3.4**, and the site's pages changed with it (listed at the
end of this entry).

**What the first real jobs showed (2026-10-02, `scripts/live-app-job.sh`, a real model through
the whole gateway):** asked to start a new project in Premiere Pro, the agent asked to use it, was
allowed by a tap, and worked through File, New, Project with Premiere behind another application.
Premiere's name box ignored its typing at first, and the agent said so and asked the person to type
the name; it did not press Create. With key presses added as the last resort (below), the same job
typed the name, Archie Test, and again stopped before Create. Started fresh, Premiere brought itself
forward for under half a second before it was hidden. In TextEdit it typed a line at the end of a new
document and read it back. Five defects found on the way were fixed the same day.

**What has not happened yet**, and each is a reason for a boundary below:

- The macOS permission prompt has not been seen from a signed build; in development the permission
  belonged to the editor that ran it.
- Nobody knows yet whether it works while the Mac is locked, which is the shape of every request
  from a phone.
- The pointer has been seen in a real browser window on a test page (`tests/screen_live.rs`), not
  yet on a real site.

**Wording, approved by Jett 2026-10-02 ("approve as written"), shipped in 0.3.4:** "On a Mac,
your agent can also use the apps you allow, such as Numbers or Preview, the same careful way it uses
a website. It presses buttons and fills in boxes inside the app's window without moving your
pointer, so you can keep working, and if you start using that app it waits for you. macOS asks you
once to allow it. It never uses Terminal, password keepers, System Settings, Mail, Messages,
Calendar, or your web browsers, and the same stops apply: it never types a password or a card you
pay with, and anything it could not undo waits for you."

*One change since his approval, approved by him the same day:* "a card number" became "a card you
pay with", because he had chosen to let a gift card, library card, loyalty or membership number be
typed, and "never types a card number" would no longer have been true as written.

*Where it is on the site (2026-10-02):* `archie/websites/`, in a section headed "On a Mac", as three
points with every clause kept. The last sentence is split at "and the same stops apply", because the
site's limit is 35 words a sentence.

*Short form, proposed:* "Uses the apps you allow on your Mac, in the background, and stops before
anything it can't undo."

**The name, approved by Jett 2026-10-02:** websites and applications are one capability on screen,
**Computer control**, with the line "Your agent clicks and types in websites and apps on this
computer, the way you would. It stops before anything it can't undo." (Windows reads it without "and
apps".) It replaced **Websites** as the Connections entry in 0.3.4.

**One switch, one list (Jett, 2026-10-02):** "to a normal person, they do the same thing, they just
work a bit differently behind the curtain." The panel opens on asking in the chat, holds websites and
apps in one list, and adds either from one box. There is no second switch for apps any more.

**The pointer people can see (Jett, 2026-10-02):** the Archie mark, tilted like a cursor, moves to
each button the agent presses in its own browser window and rests on a press waiting for a tap, so
the picture in the approval card shows which button it means.

**Why it's true:** in the Archie repo.

- **It never moves the pointer and keeps applications out of the person's way.**
  `crates/archie-runtime/src/screen/app/macos.rs` presses through `AXPress` (or `AXPick`, or selects
  a row), and types by setting `AXValue` or, in a document, `AXSelectedText` at the end. There is no
  synthetic mouse input anywhere in the tier. **Key presses, only as a last resort (Jett's call,
  2026-10-02):** when a box keeps its old text through both accessibility ways (Premiere Pro's
  project name), the words go as key presses addressed to that application's own process
  (`type_by_keys`), never to the application in front, never into a secure box, never with a line
  break. An application is started with `NSWorkspaceOpenConfiguration.activates` off, and one that
  brings itself forward anyway while it starts is hidden at once, which hands the front back
  (`settle_after_launch`; Premiere held the front for under half a second, where it had kept it).
- **It waits for the person.** `AppWindow::wait_for_person` (`screen/app/mod.rs`) holds every press
  and every word typed while that application is in front and somebody has touched the keyboard or
  pointer in the last three seconds, up to twelve seconds, then says so and asks.
- **Only the applications the owner allows**, an allowlist where empty means none
  (`guard::app_allowed`), checked when a job opens one and again before every action. An
  application the agent has not been allowed becomes a question with two buttons, and the yes is
  read from the owner's own next message (`turn.rs`), never from anything the model or a window
  wrote. Routines and guests cannot grant one.
- **Some it never uses, whatever the owner says** (`guard::app_refused`): Archie itself; anything
  that runs commands (terminals, script editors, code editors with a terminal in them); password
  keepers; System Settings, installers and the App Store; Mail, Outlook, Messages and Calendar,
  because each has a lane where nothing goes out without a press and driving the app would get
  around it; every web browser, because the owner's sign-ins are in it; and anything that reaches
  another computer, a phone or a call.
- **The same stops as a website.** A field macOS marks as secure arrives at stop 2 as a password,
  and a card field is known by its name (`guard::typing_stop`, which also closed the same gap on the
  web), except a gift card, library card, loyalty or membership number, which is not a way to pay
  and is typed (`guard::names_a_card_that_is_not_payment`, Jett's call). Stop 3 adds an application's own words for the irreversible: Empty Trash, Move to Trash,
  Delete Immediately, Don't Save, Erase, Shut Down, Restart, Log Out, Force Quit, and Replace,
  Overwrite, Discard, Revert, Quit, Print, Share and AirDrop when a name starts with them
  (`guard::app_click_is_final`). The Return key is never pressed, because a message app sends on it.
- **A number from an old read cannot press something else.** Every action follows the element's
  path again and refuses it unless its role and name are still what the read printed
  (`macos::find`).
- **Owner only.** Every screen tool is withheld from a guest (`acts_as_owner` in `turn.rs`, and the
  test `a_guest_is_offered_no_screen_tool_at_all`).
- **Off until switched on, and only the apps the owner allows.** Computer control's own switch
  (since the merge there is no second one for applications; `tools_screen::apps_switched_on`), an
  allowlist that starts empty and grows only by the owner's yes, then the macOS Accessibility
  permission, which the person grants in System Settings.
- **The pointer is a picture inside the agent's own browser window.** `POINTER_JS` in
  `screen/mod.rs` draws it in a closed shadow root, `aria-hidden`, taking no pointer events, so the
  agent's read and its presses pass through it; `tests/screen_live.rs` asserts the read is unchanged
  with it on the page. Nothing is drawn in an application.
- **The phone can run the panel**, from the next Archie Mobile (no phone build carries it yet; the
  desktop half shipped in 0.3.4): the snapshot carries each agent's
  Computer control (`computer_at` in `src-tauri/src/phone.rs`) and nine relay ops change it through
  the window's own commands. Sign-ins and the macOS permission still happen on the Mac.
- **Mac only.** `ScreenSurface::Apps.available_here()` is false off macOS, so the store lists no
  application add-on on Windows and the panel draws no applications section there.
- **It reads text, not pictures.** A window is read through the same accessibility tree a screen
  reader uses. No screenshot of an application is taken, so none leaves the computer or reaches the
  phone.

**Required clauses, once there is copy:**
- ⚠️ **Mac only**, and say what Windows does: websites.
- ⚠️ **Off until they turn it on, and only the apps they allow.**
- ⚠️ **The never list**, or at least that it never uses a terminal, a password keeper or their
  email app, because those are the three a careful reader asks about.
- ⚠️ **An app that does not describe its window cannot be used yet**, and the agent says so.
- ⚠️ **An app that draws its own boxes may not take its typing**, and the agent says so and asks
  the person to type that part. Premiere Pro's project name took it only as key presses, the last
  resort.

**Boundaries:**
- ❌ **Never "takes over your computer", "controls your mouse" or "types for you" as if it were a
  person at the keyboard.** It does the opposite on purpose, and the difference is the claim.
- ❌ **Never "anything on your computer".** It uses the apps the owner allowed, refuses the list
  above, and cannot run a command.
- ❌ **Never say it sends email or texts through Mail or Messages.** Both are refused; the email
  lane's rule that nothing is sent without a press stands unchanged.
- ❌ **Never a cost figure**, for the Websites entry's reason: nothing measures a whole job yet. What
  is measured: about 40 tokens of tools with applications switched on, and a look at a small app's
  window at 185 to 400 tokens.
- ❌ **Never "works while your Mac is locked"** until it has been tried.
- ❌ **Never name an application as supported.** One real job ran in Premiere Pro, through its menus
  and its name box by key presses, and one in TextEdit. That is two jobs, not a list.
- ❌ **Never say the phone can run it** until an Archie Mobile build carrying the panel is out.
- ❌ **Never say it moves your mouse or puts a cursor on your screen.** The pointer is drawn inside
  the agent's own browser window, and in an application nothing is drawn at all.
- ❌ **Never "never types a card number" without "you pay with".** A gift card, library card,
  loyalty or membership number is typed.
- ❌ **Never "it never sends key presses".** It can, to the one application it is using, when that
  application's boxes ignore everything else. Say what is true: it never moves your pointer, and
  while you are using the app it is working in, it waits for you.

**What changed on ship day (2026-10-02)**, because each said something this made untrue:
- "It cannot run a program on your computer" became "It cannot run code or a command on your
  computer. On a Mac it can use the apps you allow, and never a terminal." in the positioning under
  "What it structurally cannot do" and its table row, and the add-on lines became "code or a
  command" (both below). Archie's own guide `what-it-will-not-do` says it in its own words from
  0.3.4 (Archie `7f77cd5d` and `2454cd4f`): no code, command or script; websites, and on a Mac the
  apps you allow, once Computer control is on; never a terminal, on a Mac or on Windows.
- The Websites entry's boundary about applications points here.
- The macOS permissions: `trust/it-review/` now says, beside the document, that it describes 0.2.3
  and that a Mac has asked for two more since: the administrator password for waking, and
  Accessibility for Computer control. The document itself lists neither and is a revision away.
- "A card number" became "a card you pay with" everywhere the site says the agent never types one,
  and since 2026-10-07 in the privacy policy and the terms of service too, at Jett&rsquo;s approval
  (Terms version 2026-10-07).
- The pages: `archie/websites/` (the label, the Buying fold's drawings and caption, the stops figure,
  a section headed "On a Mac", the next step in 0.3.4's words, and the agent's pointer drawn as the
  Archie mark it is), `how-it-works/` (the caption names the apps), `faq/`, `trust/` (and its add-on
  figure, now "Code" where it said "A program"), `trust/it-review/`, `skills-marketplace/browse/`
  with `js/addon-card.js`, which writes each card's sentence, `help/` (a row for the Mac's
  permission), the workout post, and two Learning Library sections not yet published
  (`assets/library.json`).

### ✅ Waking the computer for a routine — SHIPPED 2026-09-16 (Mac), 2026-09-19 (Windows)

**Approved wording:** "A routine set for seven in the morning arrives at seven, even if the
computer was asleep. Archie asks the computer to wake a few minutes before, runs it, and lets it go
back to sleep. The screen stays off."

**And the setup sentence, which is different on each and must match the reader's machine:** on a
Mac, "Setting it up asks for your password once, because only an administrator of a Mac may
schedule a wake, and macOS asks for it in its own box: Archie never sees what you type." On
Windows, "Setting it up is one press. Windows lets you schedule a wake for your own computer, so
there is nothing to approve."

**Why it's true:** `archie_runtime::wake` works out which moments the computer has to be awake for.
On macOS `crates/archie-wake` is the separate program that schedules them, run by launchd as root.
On Windows `archie_runtime::wake::windows_task` writes a Task Scheduler task carrying `WakeToRun`,
as the ordinary person who opened Archie. The deciding half is shared: both platforms wake for the
same appointments, worked out by the same code.

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
- ❌ **Never carry one platform's setup sentence to the other.** "One password, once" is true on a
  Mac and the sentence that keeps the rest of it credible; saying it to a Windows reader describes
  a step that does not exist. "Nothing to approve" is true on Windows and would be a lie about a
  Mac. A page that cannot tell which reader it has says the first paragraph and neither sentence.
- ⚠️ **On Windows, set up is not the same as working.** The power plan decides whether any timer
  may wake the machine, and on a lot of laptops the on-battery setting ships off or set to
  important-only, which means Windows' own timers and not ours. Archie reads that setting
  (`wake_timers_allowed`) and the Routines card names the presses that change it. Never claim
  Windows wakes work without naming this; an owner whose plan says no gets nothing and no
  explanation anywhere but that card.
- ⚠️ **Not yet watched overnight on a real machine, on either platform.** Everything up to the
  system call is tested; on macOS the call needs root, on Windows it needs Windows. Until somebody
  has run each through a night, copy may describe what it does and may not call it proven. The
  Windows half additionally has three facts read off Microsoft's documentation rather than a
  machine, listed in this repo's counterpart thread in `docs/OPEN-THREADS.md`.

### ✅ One routine at several set times a day: BUILT 2026-09-28 (Archie b7c15696..8e30221b, then 6ec9c78a and 36e4b6e0 for 24 a day and chat; archie-mobile 8f9ae08 and 4e22fd9), SHIPPED in Archie 0.3.1 on September 29, 2026, the phone's half on Android in 0.3.5's download (October 5, 2026); iPhone still in App Store review

*Released, checked October 6, 2026: every Archie commit above is an ancestor of 0.3.1's `09c5cb5e`,
and every release since carries them. The approved wording names chat and the Routines tab, both on
the computer, so it applies now. The phone's half (archie-mobile `8f9ae08` and `4e22fd9`) is not
marked shipped here: the iPhone app is still in App Store review, and for Android see "Which build
Android has" above. Until it is, no page says the phone moves a routine's times.*

Jett asked on 2026-09-28 why a routine could not run at 9:00 and 5:00, and decided it should, for
everyone rather than only for jobs brought over from OpenClaw. The same day he set the cap at 24 (the
recommendation was 12) and had chat set several times too.

**Approved wording, once it ships:** "A routine can run at several set times a day, up to 24, like
9:00 in the morning and 5:00 in the afternoon, and you can set them in chat or on the Routines tab.
Each time it runs counts as a job, like any other."

**Why it's true:** `DailyAt` and `DaysOfWeek` in `crates/archie-domain/src/routine.rs` keep the first
time in `hour` and `minute` and the rest in `also_at`, which is left out of the file when empty, so
every routine already on disk and every catalog file reads unchanged. At most `MAX_TIMES_A_DAY` (24),
checked in `validate_times`; more than four at an even gap are said as their pattern ("every weekday,
every hour from 9:00am to 5:00pm"). Chat's routine draft takes several times, a change that leaves the
time empty keeps them all, and one that names its times says on the card which it drops. The scheduler (`gateway/routines.rs`) waits for the nearest time, and
after the computer sleeps through several it runs only the latest, once. The Routines tab adds and
removes times (`src/app/routines.tsx`, `schedule-parse.ts`); the phone shows every time and moves any
one (archie-mobile `src/schedule.ts` and `screens/Manage.tsx`, `set_routine_time` in
`src-tauri/src/phone.rs`). `runs_often` counts every time in a day and flags hourly or more often.

**Boundaries:**
- ⛔ **Never "as often as you like."** Up to 24 set times a day. More often is an interval ("every 30
  minutes"), which counts from when it starts, not from the clock.
- ⚠️ **On the free tier, no more than 15 of a routine's runs happen in a day.** Routines and the
  watches stop at 15 and keep the last 5 for the person (`FREE_JOBS_KEPT_FOR_YOU`, the free-tier
  entry), so a routine at 24 times runs at most 15 of them, and fewer if mail took some first. Say
  that beside the cap wherever the cap is sold. From Archie 0.3.1 (3c8d27a9, not in 0.3.0) the Routines
  tab, chat's routine card and the OpenClaw review say so once a schedule takes more than half of
  the 15 (`free_day_line` in `archie_domain::allowance`, `freeDayLine` in `src/app/schedule.ts`).
  Nothing is blocked, and a plan or a trial sees no line.
- ⛔ **Never "it catches up on every run it missed."** After the computer sleeps through several of a
  day's times, it runs the latest one, once.
- ⚠️ **Waking for the second time of a day has not been watched on a real machine**, the same caution
  the waking entry carries.
- ⚠️ An older phone that does not say which time moves the first and keeps the rest.

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
- ❌ **Never say Archie Mobile notifies you or makes your phone buzz.** It has no notifications and
  no push. With no chat app connected (and messaged once), a reminder waits in the conversation
  until it is opened. "At that minute" is when it is posted, not when anybody hears it. A chat app
  such as Telegram is what buzzes a phone. Found by the reviewer pass on October 5, 2026; from
  0.3.5 (Archie `eb4aea51` and `4269a5e1`) the agent says so when it sets one on an agent no phone hears, and
  the computer shows an alert when the agent posts something on its own (see "An alert on this
  computer" below).

### ✅ An alert on this computer when the agent posts on its own: BUILT 2026-10-05 (Archie `4269a5e1`), SHIPPED in Archie 0.3.5 on October 5, 2026 (Archie for Business follows)

*Released, checked October 6, 2026: `4269a5e1` is an ancestor of 0.3.5's `2afe4589`, and 0.3.5's
first release note says "Archie shows an alert on your computer when your agent posts something on
its own". Archie for Business 0.3.5 is not out yet, so a page about the business edition waits for
it. Shipping it did not test it: the last boundary below still holds.*

Found by the reviewer pass on October 5, 2026: a reminder or a routine's report on an agent with no
chat app landed in Archie's window with no sound, so "remind me at 7 to take my pill" was learned at
9, while the agent had been told a reminder is the thing that interrupts.

**Approved wording, once it ships:** "When your agent posts something on its own (a reminder, a
routine's report, a card about new mail), your computer shows an alert with the agent's name and
the first line, while Archie is open behind your other windows. Turn it off in Settings, General."

**Why it's true** (Archie branch merged October 5, 2026):
- **Which messages.** `src-tauri/src/alert.rs` (`OwnerTurn`) marks a message for an alert when it is
  new, in the owner's own conversation, and not inside a turn the owner started. That turn ends when
  the reply settles or after 60 quiet seconds. A reply to something the owner just said raises none.
- **One event with the badge.** The mark rides on the same `inapp:message` event the sidebar's count
  is drawn from (`src-tauri/src/inapp.rs`), so an alert never fires for something the count missed.
- **Only in the background.** `src/app/alerts.ts` shows it only when Archie's window is not in front,
  asks the computer for permission at the first alert and never at launch, and reads the switch in
  Settings, General ("Show alerts on this computer", on by default, kept per account).
- **The plugin's three calls only.** `src-tauri/capabilities/default.json` grants checking
  permission, asking for it, and showing one; scheduling and listeners stay closed.

**Boundaries:**
- ❌ **Never say your phone buzzes.** This is the computer only. Archie Mobile has no notifications
  and no push; a chat app such as Telegram is what buzzes a phone (see the boundary on Reminders
  above).
- ⛔ **Never "even when Archie is closed".** It needs the computer on, awake, and Archie open. With
  Archie shut, nothing posts and nothing alerts.
- ⛔ **Never "click it to open the conversation".** The plugin has no click handler on a desktop in
  this version, so a click at most brings Archie forward, and nobody has checked even that.
- ⚠️ **Archie cannot tell that the computer refused alerts.** On a desktop the plugin answers
  "allowed" without asking, so the Settings row always says where the computer's own switch is.
- ⚠️ **Two quiet cases.** On an agent with a chat app, a reminder that fires within 60 seconds of a
  conversation ending raises no alert; and Archie's own notes on an agent's behalf (a restart, an
  add-on arriving) raise none.
- ⚠️ **Not yet seen on a real Mac or Windows computer.** Tested in code. Nobody has watched macOS ask
  for permission, an alert appear behind another window, or a Windows alert show Archie's name. Copy
  may describe it and may not call it proven.

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
- ⚠️ **The places tool has never read the real map** (Archie `docs/OPEN-THREADS.md`, "The places
  tool has never met the real map"; noted October 6, 2026). Every field it reads is parsed from a
  fixture written from TomTom's documentation, so a renamed field would drop silently. The approved
  wording stays; `cargo test -p archie-runtime --test places_live -- --ignored` with the drive
  check's key settles it (`docs/TEST-DAY.md` item 31).

### ✅ Prices at Shopify stores, for Price Watch: BUILT 2026-09-24 (Archie `b67a6576`), SHIPPED in Archie 0.3.1 on September 29, 2026

*Released, checked October 6, 2026: built in the Archie repo on September 24, 2026, and `b67a6576`
is an ancestor of 0.3.1's `09c5cb5e`, so every release since carries it. Price Watch in the catalog
is 1.3.3, with `min_app_version` 0.3.1, and the store page (`skills-marketplace/browse/`) already
says it checks what Shopify stores charge. This heading still said "not yet in a release" until that
day.*

**Approved wording, once it ships:** "Ask Price Watch to check your prices, and your agent looks up
what Shopify stores charge right now: the store, the price, whether it is in stock, and a link that
opens that store's checkout with the item in the cart. Amazon, Walmart, and the other big
marketplaces are not Shopify stores, so for those it searches the web."

**Why it's true:** `crates/archie-net/src/shopify.rs` (the catalog client) and
`crates/archie-runtime/src/shopify.rs` (the `shopify_search` tool), declared by
`data/marketplace/skills/price-watch.json` from version 1.3.0.

- **No account and no key.** Shopify's catalog answers anonymous searches. What it does require is
  a page saying which assistant is asking, and this repo serves it at `ucp/agent.json` (it is on
  the allowlist in `scripts/stage-site.py`). If that page is not live, every search fails, and the
  tool tells the agent to say so and use a web search instead.
- **It only reads.** Paying through Shopify's own system is invite-only, so nothing here places an
  order. The cart link lands on the store's own checkout page, where buying works exactly as the
  Buying entry says: off until switched on, the shop on the owner's list, and a tap before the
  order.
- **Only an agent with Price Watch switched on carries the tool**, so nobody else pays for it.

**Boundaries, do not cross:**
- ❌ **Never say Archie finds the lowest price anywhere, or checks every store.** It checks Shopify
  stores, plus whatever a web search turns up.
- ❌ Never say Archie buys through Shopify, or that Shopify checkout is built in. The order is
  placed on the store's own page, under the Buying switch.
- ❌ Never imply Shopify is a partner or endorses Archie. Naming Shopify in plain type to say where
  a price came from is fine; a Shopify logo is not (the no-logos rule).
- ⚠️ A price is what the store showed at that moment. Say "right now", never "always current".

### ✅ Mail and calendar from iCloud and five other providers, on an app password (SHIPPED 2026-09-01, Archie 0.2.2)

Built 2026-09-01: `crates/archie-net/src/mail/imap.rs` (IMAP over TLS on 993, SMTP with STARTTLS
on 587) and `crates/archie-net/src/calendar/caldav.rs`, behind the same `MailProvider` and
`CalendarProvider` traits Google and Microsoft use, so every rule already verified for Google mail
holds here without a new code path: the send gate, the calendar confirmation, the poller's
filters, the starter-credits refusal. Connected through `imap_connect` in
`src-tauri/src/commands/integrations.rs`. **Shipped in Archie 0.2.2 on 2026-09-01**, and the app is
at 0.2.5 as of 2026-09-15; `archie/releases.json` on this site is the record of both, written by
the release pipeline rather than by hand. *This heading said "SHIPS IN 0.2.2" until 2026-09-18, and
the paragraph under it still told a reader the copy must not go live. It had gone live, correctly,
seventeen days earlier.* **A release gate written into this file is a fact with an expiry date on
it, and nothing expires it**: the same pass found two shipped capabilities with no entry here at
all, below. When a gate is written, the release that lifts it lifts this sentence too.

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

### ✅ College: it reads the syllabus and holds the term. It never turns work in and never registers you (IN THE CATALOG 2026-09-21, live on the next catalog push)

The claim, in the words somebody would say:

> Add each class's syllabus and Archie reads it: every due date on the schedule, what the grade is
> made of, and the rules that cost points. After that it holds the term. It tells you what is due
> this week, works out what you need on the final to keep an A, and warns you two weeks before the
> school's own deadlines, like the last day to drop. When registration comes round it reads your
> degree audit and lays out what to take next, with the clashes and the missing prerequisites
> marked. It plans and it tracks. Turning the work in and signing up stay yours.

**Why it's true**, all paths in `/Users/Games/Desktop/Code/Archie`:

- **The syllabus.** `data/marketplace/skills/my-classes.json` rule 1. A file added under Knowledge
  in the app is read with `read_knowledge_file`; PDF, Word and PowerPoint have their text pulled out
  at ingest by `crates/archie-domain/src/documents.rs`, so a scanned-in syllabus is readable text by
  the time the skill sees it.
- **What it holds.** Three lists declared on that manifest and created at install: `courses` (the
  grade split and the professor's rules, copied word for word), `coursework` (one row per dated
  item, with what it is worth and what was scored), and `school_dates` (the registrar's dates).
- **The grade answer is arithmetic, not a prediction.** Rule 5 works over the grade split already
  copied out of that course's own syllabus and the scores the student entered, and the body requires
  showing the working and naming which parts have no score yet.
- **The deadline warnings cost nothing when there is nothing to say.** The `when_due` routine
  trigger (`crates/archie-domain/src/routine.rs`) scans the rows on the owner's own computer and
  wakes the model only on the days a row crosses a threshold.
  `data/marketplace/routines/coursework-due.json` watches `coursework` four days out,
  `term-dates.json` watches `school_dates` fourteen days out.
- **The class calendar link.** `my-classes.json` rule 2 and the `CLASS_CALENDAR_LINK` variable. The
  student pastes the personal calendar feed address their own school publishes (Canvas calls it
  Calendar Feed, Blackboard calls it Share Calendar, Brightspace calls it Subscribe). It is fetched
  with `web_fetch`, which attaches no credential to any request ever
  (`crates/archie-runtime/src/connectors.rs`, `execute_web_fetch`).
- **Class planning stops before registration.** `data/marketplace/skills/class-planner.json` rule 4
  says what it cannot see and forbids implying a seat is open. There is no tool in the runtime that
  could register anybody: registration is not an integration, not a connector, and not on the belt.
- **Where it is offered.** The College pack in `src/app/packs.ts`, the "Getting through a degree"
  life in `src/app/lives.ts`, and the worked example in `src/app/setups.tsx`.

**Required clauses. Do not drop them:**

- ⚠️ **Never write "Canvas integration", "connects to Canvas", or any LMS company's name as a
  connection.** There is no connection to any learning management system. Two things exist and both
  belong to the student: a calendar feed address they copy out of their own school's site and paste
  in once, read over the public web; and the notification emails their school already sends them,
  read only if they connect a mailbox. Say "your class calendar link". Naming Canvas as a
  connection would be the false claim on this entry.
- ⚠️ **Say the feed only carries what a professor put a date on.** It is not the whole syllabus and
  never was. The syllabus is the better source and the product says so in rule 2.
- ⚠️ **The mail half needs a mailbox connected, and the starter credits cannot read mail.** Same
  clause as everywhere else on this document: mail tools are `OwnKeyOnly` in
  `crates/archie-runtime/src/tool_policy.rs`. A page describing the announcements half has to carry
  that in the same breath.
- ⚠️ **A drop deadline is the school's, not ours.** The skill fetches the school's own academic
  calendar page or asks, and rule 3 forbids stating one from general knowledge. Copy may never
  print a real school's date, and may never imply we know one.

**Boundaries. Do not cross:**

- ❌ Never "it registers you", "it enrolls you", "it drops the class", "it submits your homework",
  or any wording where the agent acts on the school's systems. It cannot, and there is nothing to
  build the claim on.
- ❌ Never say it can see grades in a learning management system, seats left, a waitlist position, a
  hold on an account, or a registration time. It cannot see any of them.
- ❌ Never "it knows your school's requirements". It reads the degree audit the student gives it, and
  `class-planner.json` rule 6 sends every question with a real cost to their academic advisor.
- ❌ Never "it guarantees you graduate on time", or any outcome claim about a grade, a GPA or a
  degree. The arithmetic is checkable; the outcome is not ours to promise.
- ❌ Not a FERPA claim, and never near one. No compliance wording of any kind attaches to this. What
  is true is what the first entry on this document says: no server of ours holds the content.
- ❌ Never name a real university, its colors, its logo or its mascot in copy or a mockup. Example
  schools are invented ones, and the example people follow the house rule: Sam, Dana, Ellen, Todd.

### ✅ What it structurally cannot do: the answer to "is this the AI that ends the world"

Verified against `Archie@main` on 2026-09-09. This is the fear a beta tester arrived with on a
recorded call, in as many words, after a podcast about a swarm of bots going rogue. It is not the
privacy question and the privacy answers do not touch it, so it gets a claim of its own.

**Approved wording (positioning):** "The stories people are frightened by are about many AI
programs talking to each other with nobody in the middle. Archie is one agent, and the only
conversation it is in is the one with you. It is not awake between messages: it runs when you write
to it, when a clock reaches a time you set, or when it checks a mailbox you connected, and nothing
runs in between. It cannot run code or a command on your computer. On a Mac it can use the apps
you allow, and never a terminal. It cannot call or text, and it presses
nothing that finishes something, on a website or anywhere else, unless you switched on buying and
the order is inside your limits; drafts wait for your Send. And you can quit the app, because there
is nowhere else it is running."

**Why it's true, item by item:**

| Claim | What makes it true |
| --- | --- |
| One agent, no agent-to-agent conversation | Delegation to a specialist is offered only when the current target is not itself a specialist, so a helper cannot hand the job on: `crates/archie-runtime/src/gateway/tools_specialist.rs`. There is no channel between agents, and a specialist's run returns text to the agent that called it |
| Not awake in between | Three wake sources and no others: an inbound message, a routine's clock, and the mail poller. Nothing schedules the model to think on its own |
| No code or command execution on the owner's machine | There is no shell tool and no code-execution tool on the belt. **On a Mac, Computer control (0.3.4) can open and use an application the owner allowed.** It refuses Terminal and the other terminals, script editors, Automator, Shortcuts, Xcode and the code editors on its list, whatever the owner says (`REFUSED_APPS` in `screen/guard.rs`, application ids, so an unknown app is not on it), and it never presses Return, nor sends a line break as a key press (`macos::type_by_keys`), which is how a terminal runs what is typed. "It cannot run a program" became this row's wording that day, because opening an allowed application is running one. Programmatic tool calling exists (`gateway/programmatic.rs`), runs **Archie's own read tools inside the provider's container** rather than anything on the owner's computer, and is off unless `ARCHIE_PROGRAMMATIC_TOOLS` is set, which is not a setting any owner can reach |
| No calls, texts, or finalizing presses, and purchases only when switched on | `NEVER_LINE` in `gateway/prompt.rs` is in every system prompt whatever is installed; on a website `screen/guard.rs` refuses submit, pay, buy, book, order, sign up, subscribe, delete and cancel by accessible name and role, biased toward asking. With buying on, `click_is_purchase` releases a purchase press inside `SpendPolicy`'s limits and nothing else (see the Buying entry) |
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
  somebody has to press Send on (or press a time on), from 0.3.5. In 0.3.4 and
  earlier (still what Archie for Business runs, until its 0.3.5) a timed send armed on a turn the
  owner typed could go unpressed; see the timed-send
  paragraph under the email entry.
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


### ✅ What listens on this computer, and what can reach a local address (entry written 2026-09-27)

**Approved wording:** "Nothing on the network can reach it. Three things listen on 127.0.0.1 only,
and only while in use: a sign-in waiting for the browser to hand you back, the Google Drive picker,
and the browser Archie drives during a Websites job." And: "The web tools refuse private, loopback
and carrier-grade NAT addresses. Three things can reach local addresses: lights added on the local
wifi, an AI model on this computer, and the Websites browser, which is off until turned on."

**Why it's true:** the sign-in listeners in `oauth.rs` and `auth.rs` and the picker in
`drive_picker.rs` bind `127.0.0.1:0`, the picker with a five-minute deadline; the Websites browser
runs with `--remote-debugging-port=0`, which binds loopback. `PublicAddressesOnly` in
`crates/archie-net/src/http.rs` guards the HTTP client only, so the browser's one fence is the
owner's never-open list, a list of host suffixes that cannot fence a subnet. trust/it-review/
carries both since 2026-09-27; it had said Archie listens on no port and cannot reach inside a
network.

### ✅ The video library: YouTube behind a press, and Jack's voice (decided 2026-09-28, LIVE 2026-09-30)

**Live since 2026-09-30, with Level 0.** Jett uploaded 0.0 to 0.8 to YouTube that morning and the
nine pages went up in the same commit that added the YouTube sentence to the website entry below and
named YouTube in the privacy policy. Until then this entry read "NOT LIVE" and nothing in it could
appear on a page.

**Jett's decisions (2026-09-28):** the library lives at `learn/<slug>/`, one page per video, and the
videos are hosted on YouTube, embedded **click to load** on `youtube-nocookie.com`. Each page shows
our own poster image and makes no request to YouTube until the reader presses play.

**One video per section, and the pages are built (2026-09-30).** Jett moved the library from one
video per level back to one per section the same day it was joined, and set the page: the section's
video from YouTube, its notes under it, and a way to move through the library from any page.
`scripts/gen-library.mjs` writes the pages from `assets/library.json`; `js/library.js` swaps our
poster (a plain link to the video on youtube.com) for the nocookie player on the press;
`gen-csp.py`'s `LIBRARY_SOURCES` opens `frame-src` to the nocookie host on `learn/<slug>/` pages and no
other. **A section is published only once it has a YouTube id and no hold**, and the generator
refuses to publish anything until this file's website entry carries the sentence below and the
privacy policy names YouTube, so the first player cannot ship ahead of either. One section is
held in the data: 1.9, whose narration promises which choices to pick when making the key and that
answer is untested (a key tied to no workspace may be refused). 1.8 was held too until Jett approved
its drawn number the same day (below). 0.7's notes carry Google's unverified-app screen since
its own entry below was written the same day.

**What that does to the no-analytics sentence below, on the day it ships:** "It never has" stays
true only for the pages without a player. The website entry's approved wording gains one sentence,
in this form: "Pressing play on a video in the library loads YouTube's player, and YouTube counts
that play." The privacy policy's list of outside resources names YouTube the same day, and
`gen-csp.py` gains `frame-src https://www.youtube-nocookie.com` on the library pages only.
- ⛔ **Never embed the player on page load.** A page view would then reach Google before anybody
  chose to watch, which is the thing the website entry says does not happen.
- ⛔ **Never say the nocookie domain means YouTube keeps nothing.** It defers cookies until play; it
  does not stop YouTube measuring the play.

**Approved wording for the line under each video (changed twice on 2026-09-28):** "Read by Jack."
The library was planned with an AI voice under "The voice is made by AI; Jett and Jack checked every
word of the script." The same evening Jett moved it to Jack reading every script and every Archie
screen drawn from the app mockup, and chose to name the voice and not the drawings. True only while
it is: a video Jack did not read does not ship under it.
- **The screens are drawings, and a drawing makes claims.** A video plays Archie's screens from the
  app mockup and never records a real computer, so every button, word and state it draws has to be
  one the release has, checked against the app and not only against the mockup. A mockup that has
  drifted from the app puts its mistakes in the video; each video's mockup file says in its first
  comment where in the code each thing it draws comes from.
- ⛔ **Never draw another company's screen.** Google's and Microsoft's sign-in pages, the Claude
  Console, Telegram and the Mac and Windows install boxes are real recordings on a demo account.

**Figures stay out of the audio.** `check-facts.py` reads HTML, JS and CSS only, so a price or count
spoken in a narration, drawn in a frame or written in a caption file is checked by nothing. Each page
carries a "current details" box instead, and only FACTS.md figures go in it.

**One figure drawn in a frame, approved by Jett on 2026-09-30: 1.8's "20 jobs a day".** The video
draws the free tier's number while the voice says "a daily limit", and it may, on three conditions
that all hold today: the figure is a FACTS.md row (which now names this frame, so a change there
means re-rendering 1.8), the notes box directly under the player on 1.8's page states the same
number, and the YouTube description carries the notes, so the cut is never posted without them.
Any other figure in a frame needs its own approval here; this is not a general licence.

**The free tier in the narration, decided 2026-09-28 (Jett).** The rule above and the free-tier
entry's "the number goes in the same sentence" collide, because the free tier cannot be named in the
audio with its number. Resolved this way: the voice may say Archie is free on an AI account of your
own "with a daily limit, and the number is right below this video", and the current-details box
directly under the player carries the FACTS.md figure. For this rule only, that box counts as the
same sentence. It holds only while the box is on the same page, directly under the player, and says
the number. ⛔ A cut posted anywhere without the box, such as a 9:16 clip on social, does not
mention the free tier at all.

### ✅ Google's "unverified app" screen before its permission page (added 2026-09-30)

**Approved wording:** "Until Google verifies Archie, connecting a Google account first shows a
screen saying Google hasn't verified this app. It names Otian AI, the company that makes Archie. To
go on, press Advanced, then the link to Otian AI, which Google marks unsafe until it has verified
the app." A shorter form where space is tight: "Until Google verifies Archie, Google shows an
unverified-app screen before its permission page."

**Why it's true:** Archie ships one Google sign-in client for every user (`resolve_google_client`,
loaded from `resources/`), so the app being reviewed is Otian's, and its consent screens name Otian
AI, the publisher (Archie repo, `docs/GOOGLE-SUBMISSION.md`, the App name step). The project is In
production and External and not yet verified (`docs/GOOGLE-SUBMISSION.md` step 5; all 25 steps were
unticked on 2026-09-30), and three of its Gmail scopes are restricted (`docs/BEFORE-SHIP.md`), so
Google shows its unverified-app screen on every connect until verification and the CASA assessment
both pass. The first page to carry it is the Learning Library's 0.7, in its notes. Since
2026-10-04 the short form, with the long form's last sentence on what to press, stands on
`archie/install/` ("Gmail and Google Calendar"), and **the app shows the long form** just before
every button that connects a Google account: the first run's "Which email?" and "Which
calendar?", the Connections tab's chooser, and a skill's calendar and tasks boxes (Archie repo
`335faa4c`, `GOOGLE_UNVERIFIED_NOTE` in `src/app/vocab.ts`, drawn by `GoogleUnverifiedNote`).
The day Google verifies the app, that constant goes to `null`, the install page's section comes
off, and this entry is rewritten, all in the same pass.

**Boundaries:**
- ⛔ **Never say Google has reviewed, approved or is reviewing Archie.** The submission had not
  been made on the day this was written. Change the wording the day it is, and take the sentence off
  every page the day Google verifies the app.
- ⛔ **Never tell a reader the screen is nothing to worry about.** It is Google's own caution, and
  the honest move is to say why it is there and what to press, then let them decide.
- ⚠️ **The same unverified status caps Google connections at 100 accounts in total** until
  verification passes, and each account that connects keeps its place for good (15 of 100 used,
  read by Jett in the console on 2026-10-06, against 5 on 2026-08-28; the "about 94 left" of
  2026-09-28 was a projection, not a reading). The same day Google's verification page showed the
  request submitted and every requirement met but the CASA assessment, so the Letter of Validation
  is the one thing left (the Archie repo's `docs/GOOGLE-SUBMISSION.md`). The count is a capacity fact for Otian, not copy: no page
  prints the count, because a shrinking number on a page is urgency, which the Otian Standard bans.
  If the cap is ever reached, the site has to say Google connections are paused, the same day.
- ⚠️ Microsoft's and Apple's connections are not covered here; nothing checked what Microsoft's
  consent page says about the publisher, so say nothing about it until someone does.

### ✅ This website, and what it asks your browser for (added 2026-09-16)

**Why this is here at all.** Every other claim in this file is about the app. `trust/proof/`
prints the website's own network behaviour out of the reader's browser, live, which makes the
website a thing the site makes claims about. So the claims go in this file like any other, and
they get a pointer like any other.

**Approved wording:** "This site runs no analytics, no tag manager, no session recorder and no
ad pixel. It never has. What it does ask your browser for, besides its own files, is the
typeface from Google Fonts and Firebase's sign-in code, which the account menu in the top bar
runs. Those see your address the way any host sees the address of whoever asks it for a file.
The site is served by GitHub Pages through Cloudflare, so both see the request for the page
itself, for the same reason, and Cloudflare adds one small script of its own that hides email
addresses from bots. Pressing play on a video in the library loads YouTube's player, and YouTube counts
that play."

**The last sentence is new on 2026-09-30**, the day the Learning Library's first pages went up
(`learn/<slug>/`, the video library entry above). "It never has" is still about us: YouTube's
count is YouTube's, it happens only after a press, and no page loads the player before one
(`js/library.js`; `gen-csp.py` allows the nocookie host in `frame-src` on the library pages only).

**Corrected 2026-10-07: Cloudflare was missing.** The live site answers with `server: cloudflare`
and a `cf-ray` header, with GitHub Pages behind it, and every page carries
`/cdn-cgi/scripts/.../email-decode.min.js`, which Cloudflare's email obfuscation adds on the way
out. It is same-origin and it is not in the repo, which is why a grep of the repo never found it
and why `trust/proof/`'s live request list would. The headers also turn on Network Error Logging,
so a browser that fails to load a page may report the failure to `a.nel.cloudflare.com`
(`success_fraction` is 0, so a page that loads sends nothing). No analytics beacon is injected:
checked on `/`, `trust/`, `trust/proof/` and `privacy-policy/` the same day. What our Cloudflare
account keeps about requests was not checked, so the trust page's "hold no logs of it" came off
in the same pass. The privacy policy named only GitHub until the same day, when Jett approved
Cloudflare in its own sentence and in its list of service companies (Terms version 2026-10-07).

**Why it's true:** no page carries an external `<script src>` at all, and the only
cross-origin things any page pulls are the Google Fonts stylesheet and font files, the
Firebase SDK modules from `www.gstatic.com` (imported by `js/account-nav.js`, `js/marketplace.js`
and `js/submit.js`), and `apis.google.com` on a sign-in press. The only outbound
`fetch` to somewhere that is not Firebase or our own billing service is the contact form's
`https://formspree.io/f/...` in `js/contact.js`. There is no `sendBeacon`, no tracking pixel and
no `gtag` anywhere in the repo. The ceiling under all of it is the Content-Security-Policy that
`scripts/gen-csp.py` writes into every page: `connect-src` is an allowlist of four origins, so a
script that tried to send anything anywhere else would be stopped by the browser rather than by
our intentions.

**Boundaries — do not overclaim:**
- ⛔ Never "we do not track you" as an unscoped sentence. Three third parties receive a request
  and therefore an IP address, and one of them is Google twice; a fourth, YouTube, does once a
  reader presses play in the library. Name them, as the approved wording does.
- ⛔ Never say the site "makes no third-party requests". It makes four kinds, listed above, and a
  fifth, YouTube's player, on a library page after a press.
- ⛔ Never "we hold no logs of this site" or of the update check until someone has read what our
  Cloudflare account keeps. Say "we run no server for it", which stays true either way.
- ⚠️ The honest strong form is about **what we collect**, not about what nobody can see: we run
  no measurement of any kind on this site, and the hosts that see a request see it because they
  are serving a file.
- ⚠️ If a font is ever self-hosted or an analytics tool is ever added, this section is wrong the
  same day, and `trust/proof/` will show it before anyone edits this file: the request list there
  is read from the browser's own record, not from a list we maintain. That is the point of
  building it that way and it is also a standing commitment: do not replace it with a list.

**Forms (noted 2026-09-27).** Three scripts post a form to Formspree, and only those three:
`js/contact.js`, `js/marketplace.js` (the marketplace's email list) and `js/questionnaire.js` (the
waitlist and the call booking). This entry named only the first until the marketplace page said
so itself.

### ✅ The claims a reader can run in a browser: `trust/proof/` (added 2026-09-16)

**What the page is.** Four claims from this file, running as instruments rather than sentences:
the activity record's hash chain (real SHA-256 through WebCrypto, over the canonical bytes
`AuditEvent::canonical_bytes` defines, with the `shasum` command that reproduces the number
printed beside it), the phone mailbox's seal (the `seal`/`open` pair inside `js/proof.js`, which
is matched to `crates/archie-core/src/phone.rs`, and to the phone's own `src/relay/envelope.ts`, by
the `opens_an_envelope_sealed_by_the_browser` test vector), the page's own request list and CSP,
and the pairing key in the URL fragment.

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
they apply: the version heartbeat (version, platform, edition, last seen), crash tails (on until turned off),
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
- ⛔ **Never put the catalog count on a page about Archie for Business.** Since 2026-09-18 the two
  editions hold different catalogs (see the row below), so FACTS.md's number is the personal
  edition's and printing it beside the business edition names a store that does not exist. A
  business page enumerates, the way this row already asks everybody to.

### ✅ Archie for Business's Marketplace holds only what a business can use

**Added 2026-09-18, the day the split became real.** Until then both editions were sent the same
catalog and the business store sorted the personal-life add-ons onto a second tab. Now they are not
sent at all, which means "the business store does not carry the meal planner" went from a shelving
habit to a fact about what arrives over the wire, and a fact is the kind of thing this file governs.

**Approved wording:**
- "Archie for Business's Marketplace holds the add-ons built for a team, plus everything a business
  and a person can both use. The personal-life ones are not in it."
- Naming what is out by enumeration: "no expense tracker, no meal planner, no workout log."

**Why it's true**, in the Archie repo:
- `EditionScope::listed_here` in `crates/archie-domain/src/marketplace.rs` answers `false` for a
  `Personal` add-on in a business build. The edition is which binary somebody launched, not a
  setting, so there is nothing to flip.
- It is applied where the catalog is read, not where it is drawn: `src-tauri/src/commands/market.rs`,
  `commands/routine.rs`, `commands/personality.rs`. What does not arrive cannot be searched,
  counted, or reached by id, which is why the store's own code has no edition filter in it.
- `each_scope_lists_in_its_own_edition_only` runs in both builds, so each edition proves its own
  store rather than one build asserting something about the other.
- The tags are in the catalog: on 2026-09-18, 32 skills, 22 routines and 8 personalities carry
  `editions: "personal"`, leaving the business store 53 skills, 32 routines, 4 specialists, 30
  personalities and all 36 resource guides. Seven were retagged `both` in the same pass because
  the business-only department packs named them, which is the catalog saying a business uses them;
  `scripts/check-departments.py` fails the build on that contradiction now.

**Boundaries:**
- ⛔ **Never "Archie for Business has fewer add-ons."** True and useless. It is the same catalog
  with the home half taken out, not a smaller product, and the edition costs more.
- ⛔ **Never say a business owner cannot get one.** They can run Archie, which is the edition those
  add-ons were written for, and anything installed before today keeps running and updating. This
  decides listing, not entitlement.
- ⛔ **Never claim the reverse as new.** The personal store has never carried the team-shaped
  add-ons, since the editions shipped. Only the personal half moved on 2026-09-18.
- ⚠️ **Three travel and admin skills are deliberately in both**: Flight Check-In, Paperwork, and
  Trip Planner. Business travel and business licensing are real, so a page must not say "nothing
  personal" when it means "no personal-life add-ons".

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

### ✅ Your calendar is checked before a reply or a booking about a time: BUILT 2026-10-04 (Archie `fc1b47f5`), SHIPPED in Archie 0.3.5 on October 5, 2026 (Archie for Business follows)

*Released, checked October 6, 2026: `fc1b47f5` is an ancestor of 0.3.5's `2afe4589`. Archie for
Business 0.3.5 is not out yet, so the teammate boundary below describes a release still to come.
The wording below is still Jett's to approve.*

**Wording, once it is in a release (Jett's to approve):** "When a text or an email asks about a
time, your agent looks at your calendar before it writes the reply, so the draft won't say yes to a
time you're already booked. When it offers to put something on your calendar, it tells you if that
time is already taken."

**Why it's true** (Archie `fc1b47f5`):

- **Replies.** `crates/archie-runtime/src/busy.rs` decides whether a message is about a time
  (`mentions_a_time`: weekdays, clock times like 3pm or 10:30, dates like 10/12, and words like
  free, lunch and call; plain code, no AI). When it is, the text drafter
  (`texts/replies/triage.rs`, `triage`) and the email drafter (`email/replies/triage.rs`, `triage`)
  read the next 14 days of calendar before the one drafting call and hand it over as busy times
  (`busy::describe`). The card under the draft says "Checked first: your calendar". There is no
  setting: "Check before writing" no longer covers the calendar, in either skill.
- **Booking from chat.** Before a create or a move is put to the person, `tools_calendar.rs`
  (`lands_on`) reads that slot on one calendar on each connected account the asker can see (its
  main calendar, or the one the calendar skill's settings name), and the sentence they approve
  ends with what it overlaps, for example: It overlaps "Dentist" (Mon Oct 5, 3:00pm to 4:00pm).
- **The "Offer to update your calendar" card.** `arrange.rs` (`taken_line`) adds "That time is
  already taken" with what is there, and says what to press.
- Tested in `busy.rs` (what counts as a time, what a reply is told, real overlaps only),
  `texts/replies/tests.rs` and `tools_calendar.rs`.

**The boundaries.**

- ⚠️ **Only a message that says a time in words it recognizes.** A message about a time written
  with none of them ("are you around later?") is drafted without the calendar. Never "every reply
  checks your calendar".
- ⚠️ **The next 14 days.** A reply about a date further out is not checked.
- ⚠️ **It warns; it does not stop you.** A booking that overlaps can still be approved, and a
  draft can still be edited to say yes. Never "it can't double-book you".
- ⚠️ **Timed events only, for bookings.** An all-day entry (a trip, a birthday) is not called a
  clash. A reply's drafter is told about all-day entries, without their titles.
- ⚠️ **Your calendars, never the other person's.** It cannot tell whether the person you are
  replying to is free.
- ❌ **One calendar on each connected account, never "every calendar".** Holidays, birthdays and
  calendars shared into a Google or Outlook account are not read, and on iCloud it is the first
  calendar the server lists. This entry said "every calendar the asker can see" until the reviewer
  pass on October 5, 2026 found it was one; the agent now says it sees the main calendar of each
  account and never calls a day clear (from 0.3.5, Archie `472b641c`). Reading the others needs a
  further Google permission, which Jett chose to add after Google verifies Archie.
- ⚠️ **What the drafter is told.** When you are busy, and never what with, except meetings the
  person being answered is on themselves. Do not say "the person you reply to never learns your
  schedule": a draft can still say "I'm busy Thursday afternoon", which is the point of it.
- ⚠️ **A teammate's mailbox** on Archie for Business is checked against that teammate's calendars
  and the business's shared ones, the same calendars they see when they ask the agent.
- ⚠️ **Text Replies needs a Mac**, because it reads the Messages app.
- **What the earlier version got wrong.** Until this build the calendar was checked only with
  "Check before writing" switched on, which was off by default, and the settings box for your own
  rules suggested typing "Never agree to a call without checking my calendar first" yourself. That
  version also handed the drafter every title, guest and description for two weeks. Do not
  describe the calendar check as a setting, or as something you ask for.

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
- ⚠️ **A scanned document is read only if the owner turned that on.** Off by default, and off is
  the refusal this boundary used to describe: the file comes back saying it is a picture of a page
  and the agent passes that on. See the entry below for what switching it on buys, and never carry
  the claim without the switch.
- A file over 25 MB coming in, or 15 MB going out, is refused with a sentence rather than
  attempted. Both numbers sit under what mail servers accept, because base64 makes an attachment a
  third larger on the wire.

### ✅ A PDF that is a picture of a page, read — SHIPPED 2026-09-17, off until switched on

**Written 2026-09-19, two days late.** Until now this file said "there is no OCR anywhere in
Archie", which was true when it was written and had been false for two days, and under our own
rule that sentence was the only thing anybody selling was allowed to say. This is the failure the
Websites entry names in the other direction: a stale boundary makes us claim less than we can do.

**Approved wording:** "Some PDFs are photographs of a page, so there are no words in the file to
read: a scanned statement, a signed contract, a fax. Archie can look at the pages and write out
what is on them. It is off until you switch it on, under Response quality, because it costs a cent
or two each time and it needs an Anthropic account."

**Why it's true:** `crates/archie-runtime/src/scanned.rs` sends the pages to Anthropic's document
block and asks for a transcription. Both document paths use it: an attachment on an email
(`email/inbox.rs`) and a file in the agent's knowledge (`gateway/tools_knowledge.rs`). The switch
is `AgentBundleManifest::read_scanned_documents`, drawn on the agent's Response quality pane as
"Read PDFs that are scans".

- **It transcribes and never interprets.** The prompt says to copy every number exactly as
  printed, to keep a table's rows as rows, and to write `[unreadable]` where a figure cannot be
  read: "Never guess at a digit, never complete a partial number, and never supply a value that
  would make a total add up." A gap somebody can chase beats a number nobody can tell from a real
  one.
- **Ten pages and 16 MB, and the ceiling is money wearing a page count.** Anthropic accepts far
  more; each page is billed to the owner, and a two-hundred-page scan read without being asked is
  a bill somebody opens their account to find. The refusal names the number.
- **Off is a real answer, not a dead end.** With the switch off the agent says the file is a scan
  and asks for the original, which is what it did before this existed.

**Boundaries:**
- ⛔ **Never say Archie does OCR.** There is no OCR engine in it and nothing on the computer
  reads the page. The file goes to the owner's own AI account, which is the same place their mail
  already goes when they ask about it, and that is the sentence to use if somebody asks where it
  went.
- ⛔ **Never claim it on a non-Anthropic account.** Only Anthropic's document block renders the
  pages. On any other key the switch does nothing and the screen says so.
- ⛔ **Never claim it is on.** It ships off, deliberately, and a page that describes it without
  the switch is describing something the reader does not have.
- ⚠️ **Never put a figure on the cost beyond "a cent or two".** That is what the screen says and
  it is the only number anybody has measured; a scan's page count is the variable and nobody has
  run a spread of real documents.

### ✅ What the technical log holds, and how far back a restart reads mail (entry written 2026-09-27)

**Approved wording, the log:** "That log holds what your agent read and what it decided: who each
email was from, its subject line, and a short summary of each email or text it left alone. It
does not hold the full text of an email or a text." help/ asks people to export it and send it to
us, so it says this before they do.

**Approved wording, the gap:** "When it starts again, your agent reads what arrived while it was
off, as long as the gap is under about a week. After a longer gap, or sometimes after reconnecting
an Outlook account, it can only start from that moment." And an account removed and added back
reads only from then on, which is why help/ says to use Reconnect.

**Why it's true:** the email lane logs sender and subject on "Read a new email and left it alone"
(the Archie repo's `email/replies/mod.rs`, `card.rs`), and the text lane its summary
(`texts/replies/triage.rs`). The gap is `MailError::CursorExpired` in `email/poller.rs`: Gmail
drops history older than about a week and Graph expires a delta link, and on that path the poller
starts from now. A re-added account gets a new id (`integrations.rs`).

**Boundaries, not to cross:** never "nothing is lost" about a restart or a reconnect. An error
line on the email triage path can carry up to 200 characters of the AI's own reply.

**The gap is said to the owner from Archie 0.3.6, October 6, 2026 (`03538351`).**
Until then the `CursorExpired` branch wrote only an error line to the technical log. It now also
sends the owner one message: which mailbox, the date of the last saved place, that every email is
still in the inbox, and the words that get it read ("what came in since September 28?"), because the
agent already searches the inbox when asked. It does **not** go back through the missed mail on its
own: doing so would hand it to the drafter and the package tracker a second time, which is
duplicate cards and a second AI bill, and that is a decision left open. From the release that
carries it, the approved wording can add: "If it ever loses its place, it tells you which days it
missed, and you can ask it to go through them."

### ✅ It can name the page an answer came from (SHIPPED 2026-09-17, in 0.3.0; entry written 2026-09-27)

**Approved wording:** "Ask where a figure came from and your agent can name the page: Archie reads a
PDF you gave it as numbered pages, so you can open that page yourself."

**Why it's true:** `number_the_pages` in the Archie repo's `crates/archie-domain/src/documents.rs`
(commit `128aa090`, 2026-09-17, an ancestor of the 0.3.0 release commit `6b585b93`) heads each
page's text with its number, and an empty page is skipped without renumbering, so "Page 7" is the
file's seventh page. The knowledge base and files arriving in a conversation use the same extractor.
First used on the site by the blog post "You Trust Your AI Most on the Work You'll Check Least", in
the 2026-09-27 voice pass.

**Boundaries, not to cross:**
- ❌ Never "every answer cites its page". The model decides whether to cite; the numbering only makes
  it possible.
- ❌ A scanned PDF with no text layer has nothing to cite until the picture-of-a-page reader is on.
- What it reads still goes to the AI company, on the account in use.

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

**What is still absolute, and may still be said that way, from 0.3.5.** The agent
**cannot arm a timed send**: a time it puts on a draft is only offered on the card, as a button
(`schedule::offer`, `email/replies/draft.rs`), and a person sets it with a press (or the words, on
a chat app with no buttons). So "your agent cannot send email on its own" holds on every turn,
including one where it read a hostile email. What is **not** true is that a person presses a button
at the moment mail leaves.

**What this said before, and why it was wrong.** It said `timed_send_needs_a_person` made the
absolute true because a routine and an arriving email cannot schedule. The gate asked whether a
person typed the turn, not whether they named the time, so on a turn the owner typed ("summarize my
latest emails") an instruction inside one of those emails could have the agent queue a new email
with a time ten minutes out, and it went unless somebody pressed Back to draft. Found by the
reviewer pass on October 5, 2026; Jett chose to make every agent-picked time a press (Archie
`3451af8e`). It shipped in 0.3.5 on October 5, 2026, so this paragraph's absolute may be said of
0.3.5 and later. In 0.3.4 and earlier the old behavior stands, and that includes Archie for
Business until its 0.3.5 is out.

**Added 2026-09-28: one Send sends one reply.** Approved form: "Each Send sends the one reply on
its card." Why it's true: the button carries its card's action id (`parse_callback` in
`handle_action`, `email/replies/actions.rs`), the `"send"` arm resolves that one pending action and
refuses anything not `Pending` or `Scheduled`, and `send_reply` sends that action's draft. On the
texts lane, `send_now` (`texts/replies/actions.rs`) sends that action's `draft_body` to that
action's `chat_rowid` and nothing else. There is no send-all and no grant that carries over to the
next draft: a grep for `send_all`, `approve_all` and `bulk_send` finds none. This is the Archie half
of the contrast in "Muse, re-read 2026-09-28", where Muse's prompt can grant "the entire task" or
"the future". ⛔ Never widen it past replies: buying is a separate switch with its own limits.

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
  composing fresh email from scratch until that ships. *[Stale, found October 6, 2026: a new email
  to an address shipped in 0.3.0 (Archie `1b8bc044`, `inbox_draft_new_email`). It arrives as the same
  card with the same Send, Edit and Dismiss, and goes when the person sends it or sets a time
  (`email/replies/draft.rs`, "A new email to {to} is drafted and waiting on a card with buttons to
  send it"). It needs an entry of its own, with the address-checking boundary, before a page says
  it; "replies only" is no longer a limit to repeat.]*
- "Sequencing constraint" from the 07-15 entry was honored: the gate landed before/with send.

### ✅ Inbox and text drafts can be written the way you write: BUILT 2026-09-28 (Archie 3700e1ad for mail, 6e7e3168..69c3c612 for texts and the consent screen), SHIPPED in Archie 0.3.1 on September 29, 2026

*Released, checked October 6, 2026: `3700e1ad` and every commit from `6e7e3168` to `69c3c612`
(texts are `bd9dab5d`) are ancestors of 0.3.1's `09c5cb5e`, and every release since carries them.
This heading still said "not yet in a release" until that day.*

**Approved wording, once it is in a release:** "Turn on Write like me and give it some of your own
writing: your sent mail, a document, or something you paste. When your agent drafts a reply, in chat,
to mail that just arrived, or to a text, it writes it the way you write, and a text still reads like
a text. You still read every draft before it goes."

**Why it's true:** the inbox drafter's prompt (`email/replies/triage.rs`, `triage_system`) carries
the owner's style note when Write like me is on and a note has been read, resolved by
`owner_writing_style` (`email/replies/helpers.rs`) through the same gate a chat turn uses
(`owner_style_note` in `gateway/prompt.rs`, which requires the skill to declare `writes_as_owner`),
so Email Manager's row under "Which skills write like me" decides it. The chat half shipped in 0.1.3
(2026-08-19). Reading the Sent folder needs its own dated consent (`WritingStyleConfig::sent_consent_at`)
and is refused on the starter credits. What reaches a prompt is a note of at most 1,200 characters
plus at most five passages of 400, never the samples themselves (`writing_style::limits`). Tests in
`email/replies/tests.rs`. **Texts** go through the same gate: `owner_text_style` and `triage_system`
in `texts/replies/triage.rs`, so Text Replies' row decides it. The owner's own texts still set length,
capitals, punctuation and emoji and win where the two disagree; the note lends word choice and warmth,
never an email's greeting, sign-off or length. About 510 more input tokens a text read on Fast and 670
on Balanced, roughly $0.15 to $0.38 a month at 9.6 texts a day. Tests in `texts/replies/tests.rs`.

**What is kept, approved now:** "If you let Archie read your sent mail, it keeps the parts you wrote
and a short description on this computer, and in backups you make, until you clear them"
(`writing_style_gather_sent`, `docs/BACKUP-FORMAT.md`). ⛔ Never "only a description is kept": the
0.3.0 consent screen says "Archie keeps those lines, not the messages", **which is false in
0.3.0** (samples.json keeps up to 64,000 characters of what the owner wrote). From 0.3.1 the screen
says what is kept, and that the description goes to the AI account each time an add-on set to write
like the owner does its work.

**Boundaries:**
- ⛔ **Never "every draft sounds like you."** Only with Write like me on, a note read, and that
  add-on (Email Manager, or Text Replies) not set to Not like me. Warmer, briefer and more formal do
  not use it, nor does Text Replies' redraft after a lookup or Rewrite it for me, and how formal a
  reply is still follows the person being answered.
- ⚠️ **Texts use it from 0.3.1.** In 0.3.0, text replies learn from the owner's own texts and
  nothing else.
- ⛔ **On Archie for Business, never say a teammate's drafts are in their style.** A teammate's
  mailbox gets nobody's style, because the note belongs to the agent's owner.
- ⚠️ **What leaves the computer:** the note and its passages, which are verbatim lines of the owner's
  own writing, go to the owner's AI company with every email the agent reads in auto-draft mode, every
  text Text Replies reads that could get a draft, and every chat turn routed to an add-on set to write
  like the owner. The samples go each time the owner presses Read my writing, not once. Never say the
  passages stay on the computer.
- ⚠️ **Never "learns as you go."** It learns only when the owner presses Read my writing.

### 🚧 Acuity Scheduling: your agent reads it, and cancels or moves an appointment when you say yes: BUILT 2026-09-28 (Archie 62167b8c..12aedc2a for reading, 769eed7d..5417c884 for cancel and move), IN THE CATALOG for Archie 0.3.1 and later, never run against a real account

**Never run against a real Acuity account yet, reads or changes** (`docs/OPEN-THREADS.md`). Jett
chose on 2026-09-28 to add cancel and move without a live test. Unproven until a Premium account
tries them: the appointment fields the card is built from, the encoded `ignoreAppointmentIDs[]`,
whether `admin=true` lifts the client limits, whether Acuity still tells the client in admin mode
and carries the cancel note, and a cancel of an appointment already canceled. The connection is in
every build from 0.3.1 (September 29) on, and the add-on is in the published catalog, so an owner
can install it today. Nothing here is said in the present tense on the site until one live read has
worked. A tester who books on Acuity is the likeliest first one.

**Approved wording, once it ships:** "Connect Acuity Scheduling with your User ID and API key, and
your agent reads your real appointments: who is booked, what they wrote in your intake form, and
which times are still open. It can also cancel an appointment, or move one to a time Acuity lists as
open. First it shows you whose appointment it is, which one, the new time, and whether Acuity will
tell your client, and nothing changes until you say yes. Booking stays in Acuity. Acuity includes its
API on the Premium plan."

**Why it's true:** the `acuity` row in `KNOWN_SERVICES` (`crates/archie-domain/src/connectors.rs`),
bound to `acuityscheduling.com`, with `AuthStyle::BasicUser` (`crates/archie-net/src/http.rs`),
which attaches the key only when a request's host matches the binding exactly, on every redirect.
`connector_connect` checks the key against `GET /me` before saving it, and only the key goes to the
credential store. GET requests run at once as reads. A cancel or a move is staged, never sent: the
card is built from Acuity's own record of the appointment (`parse` and `prepare` in
`crates/archie-runtime/src/acuity.rs`), a move is proposed only for a time `/availability/times`
lists and is checked again when the owner says yes (`still_true`), and both go with `admin=true`.
Every other write to Acuity, booking, notes and no-shows included, is refused (`dispatch` and
`apply_pending` in `crates/archie-runtime/src/connectors.rs`), custom skills too. The skill is
`data/marketplace/skills/acuity-keeper.json` (1.1.0, `min_app_version` 0.3.1).

**Boundaries:**
- ⛔ Never say it books. Booking, notes and no-shows are refused.
- ⛔ Never "any time". A move goes only to a time Acuity lists as open on that appointment's own
  calendar.
- ⛔ Never without the owner's yes. Each cancel and each move is a card first.
- ⛔ Never "always emails your client". By default Acuity tells the client, by email and by text where
  the account sends texts; the owner can say not to, and the card says which will happen.
- ⛔ Never refunds, and never that it was tried on a live account.
- ⛔ Never say it works on every Acuity plan. The API is on Premium (acuityscheduling.com/pricing:
  "Custom API & CSS for Developers").
- ⛔ Never say the key can be narrowed. Acuity's key covers the whole account, and the connect
  screen says so.
- ⛔ No Acuity or Squarespace logo, and nothing implying they endorse Archie.
- ⚠️ The key goes only to acuityscheduling.com and no Otian server is involved. When saying so, keep
  the provider sentence: what the agent reads goes to the AI company the owner connected.

### 🚧 Square: your agent reads it, drafts an invoice, and sends one or refunds a payment when you say yes: BUILT 2026-09-30 (Archie 8661c63c), in 0.3.4 (released 2026-10-02), never yet run against a real account

**Never run against a real Square account yet** (`docs/OPEN-THREADS.md`). Nothing here is said in
the present tense on the site until a release carries it and one live read has worked. 0.3.4 carries
it (October 2, 2026), so the store lists Square Keeper, in the app and on the site's generated store
page, and its release note names it; the live read is what is left before any page of the site's own
may describe it. Unproven: the
draft invoice's fields the card is built from, a publish with only a version and a key, the derived
refund key, and the pinned `Square-Version`.

**Approved wording, once it ships:** "Connect Square with an access token, and your agent reads your
real payments, invoices, customers and payouts: what came in this week, who hasn't paid, and when
your money lands. Ask it to invoice somebody and it drafts the invoice in your Square, then shows you
who it goes to, the amount, the due date and the email address. Nothing is sent until you say yes. A
refund works the same way: whose payment, how much, and which card it goes back to, first."

**Why it's true:** the `square` row in `KNOWN_SERVICES` (`crates/archie-domain/src/connectors.rs`),
bound to `connect.squareup.com`, with `Square-Version` pinned; `connector_connect` checks the token
against `GET /merchants/me`, which reads no payment and no customer. GET requests and six searches
that only read run at once. `crates/archie-runtime/src/square.rs` decides every write: drafting an
order, a draft invoice or a customer runs at once (a draft reaches nobody and moves no money);
sending an invoice, deleting a draft and refunding a payment are each a card built from Square's own
record and checked again at the yes (`prepare`, `still_true`); everything else is refused, including
charging a card, an invoice that would charge a card on file, canceling a sent invoice, and every
booking change. A refund's idempotency key is derived from the payment, the amount and what was
refunded before, so one card cannot become two refunds. The skill is
`data/marketplace/skills/square-keeper.json` (1.0.0, `min_app_version` 0.3.4).

**Boundaries:**
- ⛔ Never "it charges cards" or "it takes payments". It sends invoices the customer pays.
- ⛔ Never without the owner's yes, for a sent invoice or a refund. Drafting is the one thing that
  runs at once, and only a draft.
- ⛔ Never say the token can be narrowed. Square's own word for it is "full-access (unscoped)", and
  the connect screen says so.
- ⛔ Never that it changes bookings, even Square Appointments ones.
- ⛔ No Square logo, and nothing implying Square endorses Archie.
- ⚠️ The token goes only to connect.squareup.com and no Otian server is involved. Keep the provider
  sentence: what the agent reads goes to the AI company the owner connected.

### 🚧 Posting to Instagram, through Zernio, when you say yes: BUILT 2026-09-30 (Archie f577198e), in 0.3.4 (released 2026-10-02), never yet run against a real account

**Never run against a real Zernio account, and has never posted anything** (`docs/OPEN-THREADS.md`).
Nothing here is said in the present tense on the site until a release carries it and one real post
has gone out. 0.3.4 carries it (October 2, 2026), so the store lists Social Posting, in the app and on
the site's generated store page, and its release note names it; the real post is what is left before
any page of the site's own may describe it.

**Approved wording, once it ships:** "Link your Instagram to Zernio, paste Zernio's key into Archie,
and send your agent a photo with what to say. It writes the caption, shows you the post, which
account and when, and posts it when you say yes, now or at a time you pick. A scheduled post goes
out even if your computer is off. Instagram only lets a business or creator account post this way."

**Why it's true:** the `zernio` row in `KNOWN_SERVICES` (`crates/archie-domain/src/connectors.rs`),
bound to `zernio.com`. `crates/archie-runtime/src/zernio.rs` builds the only post a model may ask for
and refuses every other change but canceling a post that has not gone out; the card names the
account, the time, each picture by name and the whole caption, and is read again at the yes. The
pictures are uploaded only after the yes (`apply_zernio` in `connectors.rs`), to the upload address
Zernio hands back, with no key on it (`put_file` in `crates/archie-net/src/http.rs`). A post may
carry only a picture the owner sent or the agent made, from one folder, checked on the real path.
The skill is `data/marketplace/skills/social-posting.json` (1.0.0, `min_app_version` 0.3.4).

**Boundaries:**
- ⛔ Never "Archie connects to Instagram" on its own. Zernio, a separate service, holds the Instagram
  sign-in and sees what is posted. Say Zernio every time.
- ⛔ Never "free" without the condition. Zernio is free for two linked accounts; past that it charges
  per account.
- ⛔ Never that a post can be taken back. Once it is live on Instagram it can't be taken down from
  Archie, and the card says so before the yes.
- ⛔ Never likes, views, comments, followers, Stories, Reels or video. It posts pictures and words.
- ⛔ Never without the owner's yes, and never on a routine with nobody there.
- ⚠️ **Photos are kept now, on an agent that can post.** With Zernio connected, a photo sent in chat
  (and a picture the agent makes) is kept on the computer, newest 30, so a post can carry it. Any
  sentence saying Archie keeps no copy of a photo you send has to carve this out. Every other agent
  keeps nothing, as before.
- ⛔ No Instagram, Meta or Zernio logo, and nothing implying any of them endorses Archie.

### ✅ Archie asks before an add-on goes on, and says what it will use: BUILT 2026-09-28 (Archie 734c71bb..13cc20f6 for the Marketplace, 717d3056..eb969acf for every other door and the phone, c942bc60..de6e9f32 for a new agent's Researcher; archie-mobile 3d279a3 and 6817d41), SHIPPED in Archie 0.3.2 on 2026-09-30

*Released, checked 2026-09-30: every Archie commit above is an ancestor of 0.3.2's `94f85315`
(`archie/releases.json`). This heading still said "not yet in a release" that day, and the Learning
Library's 2.2 was drawn against it. The phone half is not: archie-mobile has no release on record, so
"on Archie Mobile" stays out of the wording below until one is.*

**Approved wording:** "Whenever you add an add-on, anywhere in Archie, Archie asks first. It shows the add-on, the agent it is going on, and what it will use, says
which of those accounts that agent already has connected, and names anything that comes with it, such
as another add-on it is built on, a routine that starts on a schedule, or a download. Then you press
Install, or Cancel."

**Why it's true:** every door opens the same step: the Marketplace, the Connections tab's add-on
button, the agent page's suggestion for an unused connection, the Add beside a skill's required
add-on, and the first run's mail and calendar doors (`src/app/install-dialog.tsx`, with its facts in
`install-step.ts`); only its Install installs anything. The lines come from
`src/app/install-consent.ts`, which reads each manifest's `required_integrations`, `required_screen`,
`writes_as_owner`, `required_collections`, `needs_own_ai_account` and a specialist's `web_search`, and
each account line says "Connected on Ember." or "Not connected on Ember yet." with a way to connect it
(`agent-reach.ts`). The phone gets the same facts (`skill_row` and `connected_integrations` in
`src-tauri/src/phone.rs`) and shows the same step before its Add does anything (archie-mobile
`src/screens/InstallStep.tsx`).

**Boundaries:**
- ⛔ **Never say it shows everything an add-on can reach, or that an add-on reaches only what it
  lists.** It lists what the add-on declares. Mail tools come from the connection, and Websites is an
  agent-wide switch, so an add-on that lists neither is not walled off from them.
- ⛔ **Never call it a permission prompt, or say installing grants access.** Connecting an account
  is its own step, and installing connects nothing.
- ⛔ **Never "nothing goes on without your yes."** The first agent's starter pack, Researcher included,
  goes on unasked. Every agent after it is offered the Researcher through the step (`useResearcherOffer`
  in `src/app/new-agent.ts`), Jett's choice of 2026-09-28.
- ⛔ **The phone connects nothing.** It says where to connect on the computer.
- ⚠️ A phone paired with an older Archie shows no account line rather than a wrong "not connected".
- ⚠️ **A search is "about 2 to 4 cents", counting the pages it brings back** (FACTS.md; measured 1.6 to
  4.3 cents on Sonnet 5, Archie `docs/COST-MEASURED.md` section 20). The app and the phone say so since
  Archie 9f888e61 and archie-mobile 49f31d9, and the site's submit page since this sync; "about a cent"
  was the search fee alone and is never quoted as a search's cost again. Deep Research: "about 50 cents
  a run", up to 20 searches; never "a few cents".
- ⚠️ An agent proposing an add-on in chat is a separate gate with its own entry, unchanged.

### ✅ Bring an agent over from OpenClaw, scheduled jobs included: SHIPPED in Archie 0.3.1 (2026-09-29; built 2026-09-28 as 63fc6731..2aeeae0a, 8d2085ef, and 5db10191..89070c28 for older memory, shared skills and the free version)

**Status corrected 2026-10-05.** This heading said "not yet in a release" for a week after 0.3.1
(release commit 09c5cb5e) carried every commit above; 0.3.4 carries them unchanged, and no release
note mentioned it. It is on the site since 2026-10-05 as `archie/moving-from-openclaw/`, linked
from `compare/building-it-yourself/` and the compare hub's OpenClaw card. **"On the free trial"
became "on the free version"** in the approved wording the same day: the code's test is the free
allowance of one agent (`agent_allowance(&license) == Some(FREE_AGENTS)` in `room`), and the second
card stopped being a trial and became the free tier on 2026-09-17.

Jett decided on 2026-09-28 to build it, cron jobs included, because a competitor imports OpenClaw
automatically. Its review screen has read one real OpenClaw folder; the step that makes the agent
has run only on sample folders. Nothing here is said in the present tense on the site until a
release carries it.

**Approved wording, once it ships:** "Bring an agent over from OpenClaw. Archie reads its folder on
your computer and shows you what it would make before it makes anything. Its personality, what it
knows about you, its notes, its skills, the OpenClaw skills shared by all its agents that you keep
ticked, and its scheduled jobs become the new agent's. Its newest notes go into its memory and the
rest into older memory, which it checks when you mention something in them, and anything that cannot come over is
listed with the reason. Bringing it over sends nothing anywhere and changes nothing of OpenClaw's,
and none of OpenClaw's keys or passwords come over. On the free version, which has one agent, it can
take the place of an agent nobody has used yet, and says so first."

**Why it's true:** the screens are `src/app/openclaw-import.tsx`, on the "Where should it start?"
screen that opens when you add an agent. Find reads only whether OpenClaw's usual folder exists,
Review is a plan from `openclaw_scan`, which writes nothing, and the button on Review is the one
write. The folder is read by `crates/archie-runtime/src/openclaw.rs`: `IDENTITY.md`, `SOUL.md`, and
`AGENTS.md` only when its box is ticked, into the personality; `USER.md` into what it knows about
you; `MEMORY.md` and the dated notes into the Notes half of memory, newest first up to
`memory::IMPORT_NOTES_BYTES`, and what does not fit into older memory (`gather_memory` and `pieces`),
cut at sentence ends so each line fits recall's 320 bytes, as does every notes file with no date in
its name, in `memory/` or a folder inside it (`notes_files`, `labeled`, Archie ebf068c3); each `skills/*/SKILL.md` through
`skill_from_md`. **The skills OpenClaw shares with all its agents** are read from `skills/` in its
state folder (`shared_skills_dir_for`), one box each, ticked by default, through the same
`skill_from_md`, and the agent's own skill wins a name clash. **On the free trial**, the import may
take the place of the one agent there only when nobody has used it (`room` and `why_used` in
`src-tauri/src/commands/openclaw.rs`: no message anywhere, an empty AI history and usage log, and
nothing kept or set up by hand), checked again when the button is pressed, and the new agent is made
before the old one is deleted. The screen says so above the button. The jobs are read by `crates/archie-core/src/openclaw.rs` from
`state/openclaw.sqlite`, opened read-only, querying only `cron_jobs` and leaving a command job's
`payload_message` (its command, folder and environment) out of the query, or on an older OpenClaw
from `cron/jobs.json`. `openclaw.json`, where OpenClaw keeps its model keys and chat-app tokens, is
never opened. The rules are pure functions in `crates/archie-domain/src/openclaw.rs`:
`routine_for_job` makes a routine only when the schedule means exactly what a routine can mean, and
`skill_from_md` refuses a skill that needs a program, is a list of commands, holds more than 50
files or 5 MB, or matches the shapes of the 2026 registry incidents.

**Boundaries:**
- ⛔ **Never "only the jobs are read outside the agent's folder."** Two things are: OpenClaw's list of
  scheduled jobs, and the skills it shares with all its agents. The screen says both.
- ⛔ **Never "it never reads OpenClaw's keys", "never sees them" or "never opens a file with a key
  in it."** Say none of them come over. The jobs database also holds OpenClaw's sign-in and device
  tokens (the query touches only the jobs table), and an older `cron/jobs.json` is read whole, a
  command job's environment included, which is dropped as it is parsed and never kept. The app's
  own screen said "does not read" until 8d2085ef.
- ⛔ **Never "everything comes over" or "your agent, exactly as it was."** A skill that needs a
  program stays behind, and so does a job that runs one or whose schedule a routine cannot say
  exactly, and OpenClaw's dream reports in `memory/dreaming/`, whose keepers are already in
  MEMORY.md. A notes file over 2 MB, or one that is not plain text, is named with the reason. A job at 9:00 and 17:00 comes over as one routine at both times
  (Archie 2dbcd9b9), and so does an hourly job; more than 24 times a day, or several times on a day of
  the month, stays behind. OpenClaw's chat apps,
  tools and plugins do not come over. The review screen lists each with the reason.
- ⛔ **OpenClaw only, and one way.** No other assistant's folder is read, and nothing goes from
  Archie to OpenClaw. The backup entry's "never a portability claim" still holds.
- ⛔ **Never "nothing is lost" about notes.** Older memory is looked at only when a turn's words match
  a note, and brings back at most three lines a turn.
- ⛔ **Never "replaces your starter" without "unused"**, and never without the screen saying so first.
- ⛔ **Never "no secrets come over."** Notes and skills come over word for word, so anything the owner
  wrote into them comes too; only OpenClaw's own keys and passwords stay behind.
- ⚠️ **Routines run on the owner's AI account.** A job that ran every five minutes in OpenClaw does
  the same here, and the review flags anything hourly or more often (`OFTEN_SECONDS`).
- ⚠️ **Skills and routines keep OpenClaw's words.** One that names a tool only OpenClaw has needs
  editing on the Skills or Routines tab, and the review screen says so.
- ⚠️ **"Sends nothing" is about bringing it over.** Once the agent works, what it reads goes to the
  AI company the owner connected, like any agent. Keep that sentence wherever this one appears.
- ⚠️ No OpenClaw logo (BRAND-MARKS.md), and nothing implying the OpenClaw Foundation endorses Archie.

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

⚠️ **The wording above leaves out the writing sample, and has since it was written (found
2026-09-28).** A text reply also carries up to 8 of the owner's own earlier texts, so the draft
sounds like them: out of 60 read from that conversation (`VOICE_LOOKBACK`), or, when it has fewer
than 4, from the owner's other watched conversations (`general_voice`, filtered by `worth_sampling`).
Those go to the owner's AI account too. **Fixed in the Privacy Policy on 2026-09-28** (Jett: now, since
0.3.0 already sends them), in this wording, which is approved for the current release: "It also sends
up to eight of your own earlier texts, so the reply sounds like you. It picks them from the last sixty
messages of that conversation, or from your other watched conversations when that one has too few."
The other conversations pass the same filters as the watch (group chats, the ignore list and the
allow list, since 2084b469).

✅ **A switch to turn all of it off: BUILT 2026-09-28 (Archie 74eb99bb; the switch itself is
c7376344 and 9690e41a), SHIPPED in Archie 0.3.1 on September 29, 2026.** All three are ancestors of
0.3.1's `09c5cb5e` (checked October 6, 2026), and 0.3.0 has no switch. `read_earlier_messages`
on the text watch (`automation.rs`), **on unless the owner turns it off**, shown beside Group chats
in the app. Off, nothing earlier in any conversation is read: no thread lines, no writing sample from
this conversation or any other, and no "further back" lookup (`read_thread`, `lookup_menu` and
`wanted_lookups` in `texts/replies/triage.rs`, with tests in `texts/replies/tests.rs`). The fold,
which re-reads messages an open card is still answering, stays on either way.
**Approved wording, at that release:** "When a new text arrives it also reads earlier messages,
which can include ones from before you switched it on: the last 12 of that one conversation, so the
reply fits the thread, and up to 8 of your own earlier texts, so the reply sounds like you. Those come
from that conversation, or from your other watched conversations when it has too few, and they go to
your AI account with the new text. A switch in the app, on unless you turn it off, stops all of it:
then only the new messages waiting on an answer are read, and a reply can miss what a message refers
to."
- ⛔ Never call the switch opt-in or off by default.
- ⛔ Never write "it only reads the conversation it is replying to" while the switch is on.
- ⛔ Never say the switch stops Archie reading texts in general: the chat agent's own
  `texts_sent_recent` tool, which runs when the owner asks in chat, is a separate lane.
- ⚠️ **The switch does not cover Write like me** (from 0.3.1, Archie bd9dab5d). When Text Replies writes
  like the owner, the short description of how they write, read from writing they handed over and
  never from Messages, still goes with each text read that could get a draft. "Not like me" on Text
  Replies stops it.

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

**Approved wording, retention (corrected 2026-09-27):** "Message text never enters Archie's logs.
When your agent reads a text and leaves it alone, the technical log keeps its own one-line summary
of that text; every other line in the lane carries ids." *(The older form said every line carries
ids and never text. `triage.rs` has logged a `summary` field on "Read a new text and left it
alone" since 2026-08-25, which is in 0.3.0; help/ says so now, and this wording caught up the same
day.)* " The internal draft record is deleted within a day, on a
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
- **The agent cannot buy anything from us.** `archie-runtime` cannot see `archie-core::purchases`;
  a plan is bought by a human in Stripe Checkout. Buying at a shop on the web is a separate thing,
  an opt-in switch since 2026-09-22: see "Buying, as a switch the owner turns on".
- **Unprompted, the agent messages only its own people** — `Channel::send` targets the chats
  on its roster (in the personal edition, one person: the owner; on a shared business agent,
  approved guests' chats too), and the inbound roster (`access.rs`) governs who may talk *to*
  it. There is no outbound address the model can supply. The old absolute "the agent only
  messages you" died when Text Replies shipped: a draft it wrote reaches a third party once
  the owner presses Send on it. See the Text Replies section for the approved scoping.
- **`remember` is still ungated** — a local write; the persistence vector for an injected
  instruction. Disclose, don't hide. **Narrowed in Archie 0.3.6, 2026-10-06 (`c1891673`), at Jett's pick of a label over a tap:** a note saved on a turn where text somebody else
  wrote reached the model (the wake that started it, or any tool result but the agent's own notes)
  is saved starting "From something you did not write:", the owner sees those words on the
  Knowledge tab, and the system prompt tells the agent such a note is what that text said and never
  an instruction from the owner. It is still saved without asking, so "ungated" stays true. Three
  limits: a model told is not a model that obeys; a compaction rewrite that rewords a labeled note
  past recognition loses the label (`memory::keep_outside_labels` restores it only by matching
  text); and a wake left in the history from an earlier turn does not label, on purpose. **Wording
  for the release that carries it, and not before:** "When your agent saves a note while reading
  something you did not write, such as an email, the note says so, and your agent is told not to
  take it as an instruction from you."

| Claim | Status |
|---|---|
| "Archie asks before it changes anything in your calendar." | ✅ **True now** (two-turn gate) |
| "Nothing reaches Gmail until you tap Send." | ⛔ **Banned 2026-08-31.** A scheduled send leaves with no tap. Use "nothing leaves your account until you send it or set a time." |
| "Nothing leaves your account until you send it or set a time." | ✅ **True now** (single-caller send path; a timed send cannot be armed by the agent) |
| "Archie cannot spend your money." | ⛔ **Retired 2026-09-24.** Buying is a switch the owner can turn on, and the site now says so. Use the Buying entry's wording: "Buys only if you switch it on, only at shops you pick, only up to a limit you set." |
| "Works while you sleep. Checks in before it acts." | ✅ Defensible now: unattended writes are blocked, reported instead |
| "Every Skill tells you what it can do before you install it — including what it can delete." | 🚧 Still Phase 3 |
| **"Nothing sends without your OK"** (unscoped) | ⛔ **Still banned.** Chat replies and provider web-search queries leave without a per-item OK. Use the scoped calendar/Send-tap wordings above. |
| **"Your agent does the work. You say the word."** | ✅ **True now, and only in this scope: a reply that reaches somebody else.** Verified 2026-09-21. No tool can send a text (`texts/replies/tests.rs`, `no_tool_can_send_a_text`); the mail send function is named once, in the private handler behind the Send action; a timed send is refused unless the person asked for it in that turn, so the agent cannot arm one alone (`email/replies/draft.rs`, `timed_send_needs_a_person`); a CRM message is staged and happens only after a later approval (`ghl.rs`, writes are "PROPOSED, never immediate"); an unattended routine gets no `ConfirmCtx`, so its write is blocked rather than staged (`gateway/tools_todo.rs`, `tools_drive.rs`, `tools_records.rs`). ⛔ **Do not widen it to "nothing goes out" or "nothing without your approval."** Those are the banned row above: the answers your agent writes *you* and the searches it runs at a provider leave with no per-item OK. Shipped on the homepage 2026-09-21 as a heading over a figure that draws the gate with three lanes, so the drawing carries the mechanism and the sentence carries who is in charge. Keep it that way: a heading in this family is a statement about authority, and it is only defensible while a figure or a caption beside it names what is actually enforced. Alone on a page it would be the unscoped claim. The words that carry the scope are **in your name**, and the sentence dies without them: they are what excludes the agent answering you and the lookups it runs at a provider, which are the two things the banned row above names. Widened 2026-09-21 from an email-only form, once the write gate was traced: it is one shared mechanism with named lanes (`WriteGateLane` in `gateway/mod.rs`, with `TODO_GATE`, `DRIVE_GATE`, `DOCUMENT_GATE`, records and the CRM), so calendar, to-do, file and record writes stage and wait exactly as a reply does. An email-only sentence was underselling a product-wide property. (⚠️ 2026-09-29: the record half of that was not true at 0.3.1, where a list edit ran at once with an undo. In 0.3.2 only removing a row waits: `5b51b70b` made edits wait and `139029ac` put them back to at once the same day. See the lists rows below.) ⚠️ **Say approve, not send.** "Only you can send it" was live for one commit on 2026-09-21 and reads as though the owner does the sending by hand, copying a draft out the way an ordinary chat app leaves you to: the agent sends it, and what waits is your say-so. Approve is also the verb the code uses for every other gated write.
| **"Replies and calendar moves wait for your yes."** | ✅ **True now (0.3.1), and the homepage heading (`#mine-heading`) since 2026-09-29**, narrowed from the lists form below the same day at Jett's ruling. A reply that reaches somebody else waits: the row above holds the code pointers. A calendar move waits: the Calendar changes entry above (`tools_calendar.rs`, staged on the turn that proposes it and applied only on a later one). The figure under the heading draws those two lanes and no third, and the line under it, "No setting turns that asking off", is scoped by this heading and says nothing without it. The four blog posts that carried the lists form now carry this one (`your-ai-agents-messages-go-out-under-your-name`, `say-maybe-to-your-ai-and-it-hears-do-it`, `your-ai-agent-should-bother-you-more-not-less`, `ai-built-my-workout-program`). ⛔ Never shorten it to "everything waits for your yes", and never let it stand for a purchase, which the Buying entry says it must never cover. The personal edition page carries the same scope as "Replies and calendar changes wait for your approval." |
| **"Removing something from one of your agent's lists waits for your yes."** | ✅ **True in 0.3.2** (`94f85315`; checked 2026-09-30). Adding a row and editing one happen at once, each with a receipt and an undo; removing a row stages through the list lane of the write gate and waits for the owner's yes, and a routine may not remove one (`gateway/tools_records.rs`, its module comment and `RECORDS_GATE`; Archie `139029ac`, Jett's line "what can easily be put back is automatic, what cannot asks first"). **On no page yet**: the homepage heading stays "Replies and calendar moves wait for your yes." until Jett decides whether removals join it. "your agent's" keeps out Package Tracker, as the row below explains. ⛔ Never "edits" or "changes" to your lists: those happen at once. |
| ~~"Replies, calendar moves and your agent's edits to your lists wait for your yes."~~ | ⛔ **Never shipped: reversed before the release.** Found 2026-09-30: this row said it was approved "for the first release that carries Archie `5b51b70b`", and 0.3.2 carries it, but it also carries `139029ac` from the same day, which put edits back to happening at once. Published on the strength of this row, the sentence would have been false on the day it went up. What the row went on to say still explains the two words: In that build an edit to a row on one of the agent's lists, checking one off, or removing one waits for the owner's yes, and a routine that tries is refused and reports what it would have changed (`gateway/tools_records.rs`, `RECORDS_GATE`). Two limits, both ruled by Jett on 2026-09-29, and two words carry them. **"edits"** leaves out adding a row, which still happens at once (a row they did not want is one tap to remove), so never widen it to "changes to your lists" or "anything on your lists". **"your agent's"** leaves out Package Tracker, whose status updates from shipping emails are made by the app below the agent's tools (`email/packages.rs`, `on_email`) and stay automatic, because a yes on every "out for delivery" is noise; Package Tracker's own copy must say its rows update on their own. When the release ships, the homepage figure gets its third lane back (a to-do checked off, never an add) and the four blog posts may take the same wording. |
| ~~"Replies, calendar moves and changes to your lists wait for your yes."~~ | ⛔ **FALSE in 0.3.1, and retired 2026-09-29.** The homepage heading from 2026-09-27 (Jett's voice pass, replacing "Your agent does the work. You say the word.", a two-sentence aphorism) and in four blog posts until the narrowing. Found by the Learning Library claim check: at the 0.3.1 release (`09c5cb5e`) `records_update` and `records_delete` run at once with an undo and a routine may update a row unattended (`gateway/tools_records.rs`, `dispatch_records_tool`), and Task Manager, which every new agent starts with, keeps its tasks in such a list; only edits to existing Todoist or Google Tasks items were staged. Jett chose to change the app, and `5b51b70b` does, but the sentence stays false as written even then, because adding a row does not wait. Use the row above at that release. |

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

### ✅ On Archie for Business, a mailbox marked as one person's answers only that person (entry written 2026-09-27)

**Approved wording:** "A business agent answers everybody the owner lets in, and only that person
is answered from a mailbox marked as theirs."

**Why it's true:** a connected account starts shared. Each one is created with `member_id: None`
and the comment "Shared until somebody assigns it" (the Archie repo's
`src-tauri/src/commands/integrations.rs`), and `calendar_shared: false` beside it, so a calendar is
not shared until somebody says so. The app says it in its own words on the access screen
(`src/app/access.tsx`): "Any account left as 'Everyone (a shared account)' is one a guest can be
answered from, its mail included; an account marked as one person's is only handed to that
person." The choice is "Whose is this?" beside each account, on the Connections tab, under Email,
calendar, files.

**Boundaries, not to cross:**
- ❌ **Never "each person is answered from their own mail and calendar" as the default.** Until
  somebody marks an account it is shared, and a guest can be answered from its mail. archie/business/
  and archie/pricing/ said the default form until 2026-09-27, found by the claims audit that day.
- ❌ Never imply the stores that are not accounts are kept per person: the same screen says every
  guest can read them.

**Short shared-knowledge wording, verified 2026-10-01 against released 0.3.2 (`94f85315`):**
"A shared agent's guests can read its documents, lists and reminders. Keep confidential context
off shared agents." `src/app/access.tsx` names those stores and the connected Google Docs and
Sheets beside them, and says there is no per-person setting on any of them. This is distinct
from marking a mailbox as one person's; never imply that marking the mailbox also restricts
the agent's knowledge.

### ✅ A company's name and logo never leave the computer: VERIFIED 2026-09-16

**Approved wording:** *"put your company's name and logo on it"*, *"they stay on the computer
Archie runs on"*.

Archie for Business lets an owner say what their company is called and add a logo, on the Company
page. Both are written into `structure.json` at the root of the workspace directory, beside the
shared lists, by `set_company_name` and `set_logo` in
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

### ✅ A user-set spending cap: BUILT 2026-09-21, FIRST RUN 2026-10-06, SHIPPED IN FULL IN 0.3.6 AND ON THE PRICING PAGE, and the fourteen places it does NOT change

**The code landed on 2026-09-21** (the Archie repo, commit `11f7d864`). What follows is what was
actually built, checked against the code rather than against the plan this entry used to hold.

**It ran on a real computer on October 6, 2026**, and Jett called the test done that day (Archie
`docs/TEST-DAY.md` item 3). A month of his own calls, about $1.53 counted, passed a one-cent limit
on his Mac. Run by hand: chat kept answering, the first answer after the line ended with the limit's
sentence once and the next did not (now in 0.3.6), and a reminder still went off. **Not run by hand:**
a routine coming due at the limit and the two watches meeting new mail and texts. Those rest on
tests, the pipeline test `a_routine_at_the_monthly_limit_does_not_run_and_says_so_once` and
`a_watch_stops_reading_at_the_owners_monthly_limit`, and both fixes shipped in 0.3.6.
Still owed: November 1's comparison of October's counted figure with the AI company's invoice, the
only check of the estimate boundary below. The ban at the bottom lifted with 0.3.6, by Jett's decision.

**The three conditions this entry set before a word could change were all met.** The cap is
**opt-in** (`MonthOfSpend::enabled` is `false` by default, and a test,
`the_shipped_state_is_no_ceiling_at_all`, holds it there). It is **a number the owner types**, in
whole dollars, on Settings then Account then Spending. And **with it switched off the product
behaves exactly as it did before**: the file is never created, never read, and an agent takes no
branch for it (`archie_runtime::ai_limit`, where the `Option<&Path>` is the whole switch).

**What it actually does, and this is the part that decides the copy.** At the ceiling, the agent
**stops picking work up on its own**: routines stop, the mail watch stops, the text watch stops.
**A person typing is never refused.** That is deliberate, not a gap: the case a ceiling exists for
is a loop running while nobody is watching, and locking the owner out of the conversation would
lock them out of the one screen where the number can be raised. It is enforced in `run_target`
(`crates/archie-runtime/src/gateway/turn.rs`), the point every job passes through, off `Asker`, the
same argument the free tier's daily count already reads.

⚠️ **Through 0.3.5 the two watches did not stop, though the app's panel said they did.** Found
October 6, 2026: the mail and text watches spend through their own quarantined reads
(`email::quarantined_email_read`, `texts/replies/triage.rs` `quarantined_read`) and never reach
`run_target`, so only routines stopped. Archie `a060d5d7`, in 0.3.6, has both ask
`watch_budget::under_monthly_limit` before every unattended read. On 0.3.5 and older, "routines
stop" is the true half and "the mail watch stops, the text watch stops" is not.

**How the owner hears it, and the gap that found.** Through 0.3.5 the agent says the limit was
reached only when it turns a routine or a new message away, so a month that reaches it while
nothing arrives says nothing anywhere but the Spending page. Jett hit that on October 6, 2026 with a
one-cent limit and read it as the limit not working. Archie 0.3.6 also ends the
owner's first answer after the line is crossed with one sentence saying so
(`ai_limit::tell_in_an_answer`, `reached_while_you_asked`), once a month, sharing one marker with the
turn-away so whichever comes first is the only one. A guest on a shared agent never hears it.

⚠️ **Through 0.3.5 a routine at the limit posts the limit's sentence instead of stopping
quietly.** Found October 6, 2026, while checking why Jett read the limit as failing: `run_target`
turns a routine away by handing back the sentence as its answer, and the routine runner, which had
no check of its own, delivered it as the routine's report every time it came due and recorded each
run as a success. No AI is spent on those runs, so "routines stop" was true of the bill and not of
the chat. Archie 0.3.6 (`f8d2dcab`) skips the routine before anything runs, as the
free tier's day already did, and covers a watcher's wake the same way; the pipeline test
`a_routine_at_the_monthly_limit_does_not_run_and_says_so_once` holds it.

**Reminders are not stopped, and the copy says so.** A reminder is one time and its delivery calls
no AI, so the limit has nothing to save by holding it; anything repeating is a routine, and the card
that makes one calls it that. Main (`c8c7afcf`) adds "reminders you set still go off, since they
cost nothing" to both limit sentences and "reminders still go off" to the panel, after a reminder
going off was read as the limit not working.

**Two boundaries, and neither is flattering.**

1. **It is a ceiling on an estimate, not on an invoice.** Archie is BYOK and nobody here can read
   the provider's bill from an ordinary API key. The number counted is token counts times a local
   price table (`src-tauri/src/usage.rs`), which is the same number the Spending page has always
   shown. It leans high on purpose, so the bill lands under the ceiling rather than over it. **Any
   copy that says "you will never be charged more than X" is false copy.** The Spending page says
   the figure is "an estimate from how much your agents read and wrote" and that "the exact figure
   is on your AI company's own billing page". It said "close, not exact" until Archie `b56b81be`
   simplified the page, and this entry quoted that phrase until October 6, 2026.
2. **One AI account is invisible to it.** A Custom endpoint is an address the owner typed, and
   nobody here knows what is charged at it, so those calls are counted in tokens and in no dollar
   figure at all. A ceiling set by an owner on a Custom endpoint never fills. The panel says so.
   DeepSeek and Mistral were in this hole too until the same day and are not any more (`32eb026f`
   added their price rows, and `every_model_the_router_asks_for_has_a_price` keeps them there).

**The fourteen places, and the finding that they do not change.** This entry was written
expecting the cap to force fourteen rewrites. Reading the shipped code against them says it does
not, and the reason is the distinction this entry already insisted on: **every one of the fourteen
is about buying, and the cap is about the AI bill.** They say Archie cannot spend money or buy
anything, meaning it cannot move the owner's money to somebody else. That is still true. A ceiling
on what Anthropic charges for thinking does not make Archie able to buy a thing, and an owner who
sets one has bought nothing.

Two of the fourteen need reading carefully rather than rewriting, and neither turned out to move:

- `privacy-policy/index.html:265` says **"no purchase or payment feature"**. Still true of the
  cap, which takes no card, holds no card, and sends money nowhere. It is the *buying* entry below
  that puts this line under pressure, not this one, and it was rewritten when that entry's ban lifted.
- `faq/index.html:461` says **"It cannot call, text, spend, or press a button"**. "Spend" sits in
  a list of things done *out in the world*, beside calling and pressing, so it reads as spending
  the owner's money at somebody else, which is what it has always meant. Left alone.
- `how-it-works/index.html:733` is the closest call of the fourteen and is worth naming as one.
  Its paragraph opens "When it thinks, it talks to the AI company directly, on your account", and
  closes "It sends email and changes your calendar only after you approve each one, and it can't
  spend money." The AI bill is named two sentences above the word spend. The clause still reads as
  outward action, because it is joined to sending email and changing a calendar, but a careful
  reader could squint at it. Left alone today; it is the first line to reread if the ban below is
  ever lifted.
- `faq/index.html:447` is the clearest of the fourteen and settles the reading for the rest:
  "spend money on its own: there is no purchase feature, and anything shaped like paying on a
  website is stopped and routed to you first." That is buying, in so many words.

**Rewritten 2026-09-24, for buying rather than for the cap.** The finding above still stands: the
cap moved none of them. What moved them is Jett approving buying for copy (the Buying entry below),
and the same pass rewrote every one to that entry's wording. The cap still may not be mentioned,
and the rule below about keeping a limit on thinking away from the buying sentences binds harder
now that the buying sentences exist. The list is kept as the record of where the claim lived. Two
are generated and were changed at their source, not in the file:

| Where | Note |
| --- | --- |
| `index.html:347` | the day-chip "Cannot spend money or buy anything" |
| `archie/business/index.html:531` | "it cannot spend money or buy anything at all" |
| `faq/index.html:447` | "spend money on its own" |
| `faq/index.html:461` | "It cannot call, text, spend, or press a button" |
| `how-it-works/index.html:733` | "it can't spend money" |
| `trust/index.html:625` | |
| `trust/details/index.html:209` | |
| `privacy-policy/index.html:265` | **legal.** "no purchase or payment feature" |
| `terms-of-service/index.html:230` | **legal.** Archive the old version with `scripts/archive-terms.py` |
| `standard/index.html:324` | the published operating principles |
| `llms.txt:21`, `llms.txt:83` | **generated.** `scripts/gen-discovery.py`, and quoted back by machines that will not recheck |
| `skills-marketplace/browse/index.html:1320` | **generated.** Catalog copy, authored in the Archie repo, then `node scripts/gen-marketplace.mjs` |
| `README.md:75` | not served, still wrong if it disagrees |

**And the ones that are not sentences.** The homepage chip is a `day-chip--no`, so a change there
is a drawing changing, and visual-first rule 5 makes TRUST.md govern it. `check-claim-drift.py`
compares the site's copies against this file, so this file moves first or the check reports the
drift backwards.

**The claim that survives either way, and it is the one to lead on.** A cap here is a ceiling the
owner sets on what the **AI company** charges, which is a different sentence from "it can buy
things". Do not let the two merge. The honest form, on the day anything is said at all, is: "This
is a limit on what it spends on thinking, which is a different thing from what it can buy." The
app says it its own way, under the limit on the Spending page: "Not a limit on buying.", then where
the buying switch is and that it has its own limits (`MonthlyLimit` in Archie `src/app/account.tsx`).
This entry said until October 6, 2026 that the panel carried the sentence above in those words. It
never did.

**✅ The ban lifted with 0.3.6, by Jett's decision of October 6, 2026.** 0.3.6, which carries Archie
`f8d2dcab` and `a060d5d7`, was released that evening, and the wording below went onto
`archie/pricing/` the same night. Asked when the pricing page should mention it, Jett chose the day 0.3.6 ships over
today and over never: 0.3.6 is the first release where a routine at the limit stays quiet and new
mail and texts stop being read too, so it is the first release the sentence below is true of in
full. That is also his decision to sell on it, which this paragraph used to say had not been made.

**Approved wording, for 0.3.6 and later.** It goes on `archie/pricing/`, in "The AI bill,
measured", after where the bill goes, and never in a paragraph that also says buy, shop or order:

"You can set one monthly limit on what your agents spend on thinking, all of them together. When
the month reaches it, routines and reading new mail and texts pause until the first. Your agent
still answers when you ask, and reminders still go off. The figure is an estimate, and the exact
one is on your AI company's own billing page."

Where there is room for one more sentence, it is boundary 2: "A custom AI address you typed in
yourself is not counted." The short form, for a table cell or a chip: **"A monthly limit on what
it spends on thinking, if you set one."**

What makes each clause true: the switch, the number and the note, `MonthlyLimit` in Archie
`src/app/account.tsx`. One limit for all agents, `archie_runtime::ai_limit` (one record for the
computer) and `src-tauri/src/usage.rs` (the only writer of the total). Routines pause,
`handle_routine_message` and `run_target`, `f8d2dcab`. Mail and texts pause,
`watch_budget::under_monthly_limit`, `a060d5d7`. Until the first, `ai_limit::this_month`, in local
time. Still answers, `ai_limit::check` returning early for `Asker::You`. Reminders, whose delivery
calls no AI.

- ❌ **Never "it stops spending at your limit."** The owner's own conversation keeps spending, on
  purpose, so the month can go past the number.
- ❌ **Never "you will never be charged more than your limit"**, for that reason and boundary 1's.
- ❌ **Never on 0.3.5 or older.** There a routine at the limit posts the limit's sentence every time
  it is due, and the mail and text watches keep reading.

### ✅ Buying, as a switch the owner turns on: SHIPPED 2026-09-22 (0.3.0), APPROVED FOR COPY 2026-09-24

**Jett lifted both bans on 2026-09-24**, in these words: "agent purchases are allowed, they are just
explicitly gated. We have to offer what these other agents offer, we just have to implement and
market it in a way that aligns with our company values." The earlier version of this entry held
all copy back until one real purchase had been reconciled against a card statement, and held the
fourteen "cannot spend" sentences where they were because changing them was his decision. He has
made it. The sentences were rewritten the same day (see the list in the spending cap entry above).

**Approved wording:** "Your agent can buy things for you on a website, if you switch that on. It is
off until you do. You choose the shops it may buy from, the most it may spend on one order, and the
most over a week or a month. Even then it asks before every order: it stops at Place order and
sends you the page, and it presses the button only after you tap Press it for me, in Archie, on
your phone or in your chat app. Anything outside your limits it will not press at all. It never
types a card you pay with, so your card has to be saved at the shop already. A subscription or free
trial works the same way, and the card says what it will charge each time and when. The limit is checked against the price it reads on the page, so a
shop that adds a charge at the last step can take it over. For a ceiling nobody can get past, give
it a card from your bank that works at one shop, with its own limit."

The short form, for a chip, a table cell or a caption: **"Buys only if you switch it on, only at
shops you pick, only up to a limit you set."** Where there is room for one more clause, it is
"and it asks before every order".

**Changed 2026-09-24, the same day: every purchase waits for a tap.** Jett, in two messages:
"when ember is allowed to buy, it should still be gated by a tap from the user in archie apps or
chat apps", and "when the user says to buy something, the agent should still ask, before it does
the final order confirmation; never just do it." The first version released a purchase inside the
limits with nobody asked. The Archie repo's `860589da` made the tap the release (it shipped in **0.3.1**, not 0.3.0: in 0.3.0 an order inside the limits is still pressed with nobody asked, so a sentence about the tap is true from 0.3.1 on; checked 2026-09-29): the switch and
the limits decide whether a tap is offered at all, and the tap decides whether the press happens.
Asking for the purchase in chat ("buy it", "yes") releases nothing: only the card's own button, or
"press it" typed on a chat app that has no buttons, and only after the card has gone out
(`is_press_approval` and its test in `gateway/tools_screen.rs`, `approved` in `screen/tools.rs`).


**What was actually built** (the Archie repo, 2026-09-21, commits `8d3d95d2` through `09571777`, all
of them in 0.3.0, released September 22):
a switch on the Websites panel (called Computer control from 0.3.4), off by default, that lets the agent press a button that completes a
purchase. Everything about it is in `archie_domain::SpendPolicy`, `crates/archie-runtime/src/screen/
guard.rs` and `.../screen/spend.rs`, and documented in that repo's `docs/SITES-AND-APPS.md`.

**Why it's true, and the four facts that bound it.** Each of these is a line of code, not an
intention:

1. **Off by default, and off is the product the whole site describes.** An owner who never opens
   the fold gets the code that shipped before this existed. Not the same sentence in the system
   prompt any more, from 0.3.5: asked to cancel, order or book on a website with
   Computer control off, the agent used to say it never pays for anything and name no route, which a
   reviewer scores as an agent that cannot. Jett reversed that on October 5, 2026. The off-state
   line now says it needs Computer control, and Buying under it, switched on in Archie on the
   computer, on the agent's Connections tab, and that even then a purchase waits for the owner's tap,
   only at shops they list, within limits they set (`NEVER_LINE_OFF` in the gateway's `prompt.rs`).
   It names the computer only, per the boundary on the phone below. `SpendPolicy::default()` is `enabled: false` with zero limits, and a test
   (`the_shipped_state_buys_nothing`) holds it there.
2. **It still cannot type a card you pay with, ever, switch or no switch.** `guard::typing_stop`
   refuses any field whose `autocomplete` is a `cc-` value, and any whose name says card, and hands
   the window to the person; buying does not touch it. Since 2026-10-02 a name that says gift card,
   library card, loyalty or membership is typed into (`names_a_card_that_is_not_payment`, Jett's
   call), unless the page marks the field `cc-`. The card has to already be saved at the shop or in
   the browser profile the agent drives. **Archie never holds a card you pay with** remains true and
   is now the strongest thing in this area.
3. **Only presses that buy are released.** `click_needs_approval` still catches Submit, Send,
   Delete account, Unsubscribe and Cancel subscription, and a second classifier
   (`click_is_purchase`) decides which of those the switch may release. *Amended 2026-09-24:*
   every one of them now waits for the owner's tap, and a recurring charge (Subscribe, Start free
   trial, Buy membership) is tappable with buying on at a listed shop only once the agent has read
   what repeats and when, which the card then states in the app's words (`click_is_commitment`,
   Archie repo `c85743e7`). Jett's reasoning: every final move is gated by the person, so a trial
   somebody wants is theirs to approve.
4. **Three ceilings, and one of them is not ours.** A shop allow-list that is empty-means-nothing,
   a per-purchase cap, and a rolling total over a window the owner picks. A guest on a shared
   business agent never spends, in code (`may_spend`).

**The boundary that matters most, and it is not flattering.** The amount is **what the model read
off the page**, not what the card is charged. A shop that shows a subtotal and charges a total
passes every limit. The app says so in the panel, in the person's own words, and points them at a
merchant-locked virtual card from their own bank, where the ceiling is held by somebody who is not
us. **Any copy about this that does not carry that sentence is dishonest copy**, however true the
rest of it is.

**Required clauses, every time it is described, however short the description:**

- ⚠️ **Off until they switch it on.** The same clause as the Websites entry, for the same reason.
- ⚠️ **The limits are theirs.** Shops, a per-order cap, and a total over a window. A description
  that names buying and no limit is describing a card handed over.
- ⚠️ **The weak link, in the same breath as the limit.** "The limit is checked against the price it
  reads on the page" or words that say that. **Any copy about this that does not carry that
  sentence, or its short form's promise of a limit the owner sets, is dishonest copy**, however true
  the rest of it is. On a page with room for one more sentence, the bank card is the remedy, and the
  Standard's rule is that a published limitation gets its remedy beside it.
- **Narrowed in Archie 0.3.6, October 6, 2026 (`33910277`).** The press now reads
  the order total off the page in code (`archie_domain::order_total_on_page`, called in
  `screen::tools::op_click`) and checks the larger of that and the agent's figure; the card says, in
  the app's words, which total it read or that it found none; and a tap approves that figure and
  nothing above it, so a total that went up before the press goes back to the card. Tests:
  `screen::tests::the_order_total_is_read_off_the_page` and its two siblings in `archie-domain`, and
  five in `screen::tools::tests` from `the_page_total_is_checked_when_it_is_higher_than_the_agents`.
  **The sentence above may stay as it is**: it is still true, Archie for Business does not read
  the total until its next release, and it is what the legal pages say. From 0.3.6, approved for
  Personal: "Archie reads the order total off the last page and checks your limit against
  it. A charge a shop adds after you place the order can still take it over, so for a ceiling
  nobody can get past, give it a card from your bank that works at one shop." Never "Archie checks
  the real total" without the second sentence: a total drawn as a picture and a charge added after
  the press are both still invisible to it, and no real purchase has been made (`docs/TEST-DAY.md`
  item 27).
- ⚠️ **It never types a card you pay with.** This is the strongest sentence in the area and it
  survives the switch unchanged: `guard::typing_stop` is untouched by buying. It said "a card
  number" until 2026-10-02, when gift, library, loyalty and membership numbers began to be typed;
  "a card you pay with" is the form Jett approved that day.

**Boundaries, do not cross:**

- ❌ **Never "it cannot spend your money" or "there is no purchase feature" again.** Both were true
  of what shipped before September 22 and neither is true now.
- ❌ **Never "hands-free shopping", "it shops for you", "set it and forget it"** or anything that
  drops the switch, the limits or the tap. The capability is a gate the owner opens, and the gate is
  the claim. **Never draw or write a purchase that happens without the card and the tap in
  between**, including one the person asked for in the same breath.
- ❌ **Never that a routine buys on its own.** A routine can reach the card; the tap is still the
  owner's, and a routine has nobody present to give it.
- ❌ **Never "you will never be charged more than your limit."** The reading of the page is the
  weak link, and that sentence is the one the weak link falsifies.
- ❌ **Never a subscription, trial or membership without "what it repeats at" beside it.** They are
  tappable since 2026-09-24, and the card carries the recurring price and the first charge; copy
  that shows one must show that too.
- ❌ **Never that it moves money or signs a contract.** Transfers, wires, sending money to a person
  and signing a contract are never pressed, tap or not (`guard::NEVER_TAPPED_WORDS` and
  `NEVER_TAPPED_PHRASES`): there is no chargeback on a transfer, nothing can check who it goes to,
  and it is the press a scam page would steer toward.
- ⚠️ **Closing or deleting an account is tappable**, and the card says "This can't be undone." in
  the app's words. Say both together or neither.
- ⚠️ **Shared checkout pages are refused** (Stripe's hosted checkout, PayPal, Shop Pay, Square,
  Google Pay), because their address names the payment company and not the shop. Never imply those
  shops can be bought from.
- ⚠️ **Switching buying on asks the owner to agree to a short note first**, recorded with its
  version and the time, and each receipt records when the owner tapped. The draft Terms section for
  this is in the Archie repo's `docs/BUYING-TERMS-DRAFT.md`, awaiting a lawyer; do not publish legal
  wording from it.
- ❌ **Never that a guest on a shared agent can buy.** `may_spend` refuses a guest in code.
- ❌ **Never "tested", "proven" or "reliable at checkout."** The decisions are unit-tested and the
  browser lane runs against a real shop (`shop_live.rs`), but no real purchase has been completed
  and reconciled against a card statement yet (the Archie repo's `docs/OPEN-THREADS.md`). Present
  tense is fine because the code ships; a claim about how well it does it is not, until that
  purchase has been made. Say "if you switch it on", never "it reliably".
- ❌ **Do not merge it with the spending cap on the AI bill** (the entry above). A limit on thinking
  and a limit on buying are two different sentences on two different pages.

**What this does to three older claims.** "Before it presses anything that finalizes an order, it
stops and asks you" (Websites) now needs its exception named, and the Websites entry carries it.
"Your agent does the work. You say the word." is scoped to a reply that reaches somebody else and
does not move, because a purchase is not a reply; do not widen it to cover buying in either
direction. And Flight Check-In's "It buys nothing" stays true, but it is now the add-on's own
instructions holding it rather than the code alone: with buying on and an airline on the shop list,
the code would release a Pay press there.

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

### ✅ An address your agent wrote itself waits for your yes, and a skill that searches holds only its task: BUILT 2026-10-05 (Archie `200982ab`), SHIPPED in Archie 0.3.5 on October 5, 2026 (Archie for Business follows)

Jett asked on 2026-10-05 whether the leak this file admits below could be prevented at all, and chose
to close what can be closed. *Released, checked October 6, 2026:* `200982ab` and `14001b7c` (the
named-site fix in the boundaries below) are ancestors of 0.3.5's `2afe4589`, and 0.3.5's release
note says "Your agent asks before opening a web address it came up with itself." So the wording
below may be used of 0.3.5 and later. The trust page's "Where we fall short" leak paragraph waited
for this release; 0.3.4 and earlier, and Archie for Business until its 0.3.5 is out, still behave
the way it says.

**Approved wording, once it ships:** "Your agent opens a web page on its own only when the address
came from you, from a page it already opened, or from a site you named in your message, until your
agent has read something somebody else wrote in that job. An address
it came up with itself, it shows you first and waits for your yes." And: "A skill that searches the
web is given only the task: none of your memory, your profile, your files or the rest of the chat.
After your agent has read an email, a page or a file in a job, it asks you before handing a search to
one."

**Why it's true:**
- **Where an address may come from.** `crates/archie-runtime/src/outbound.rs`, `TurnGuard`. It reads
  addresses only from user-role messages (the agent's own replies are left out, and a late button
  tap's quote of the agent's card is cut by `without_quoted_card`), from the final address and links
  of each page opened (`connectors::web_fetch_for_turn`, `outbound::links_in_html`), and site names
  written without `https://` only from the message a person typed this turn. `allows` compares a
  tidied form of the address (`key`), so a trailing slash or `www.` does not change the answer.
- **The three tools that open an address.** `gateway/outbound_gate.rs`, `opening_needs_yes`, runs in
  `gateway/turn.rs`'s dispatch before `web_fetch`, before `screen_open` given an http(s) address, and
  before `video_ingest` given one. An address it does not allow is held in `OutboundState`, per chat
  and in memory only, and the reply carries Open it and Don't open it (`decide::outbound_choices`).
  On a routine, with no `ConfirmCtx`, it is refused instead.
- **The yes comes from a person.** `turn.rs` claims what is waiting only when `person_typed`, so a
  watcher's wake can neither answer the question nor use it up. An unanswered question expires
  after the next typed message, like every staged change.
- **Search.** `gateway/tools_specialist.rs`, `isolated_system_prompt`: a searching skill's prompt is
  built with no persona, profile, memory or knowledge list, and its one message is the task
  (`search_on_its_own`), on the delegated path and on the direct route alike (`answer_from_the_web`,
  the early return in `run_target_attributed`). `outbound_gate::search_needs_yes` holds a delegation
  to a searching skill once the turn has read outside text: after any round whose tools are not
  `remember`, `forget` or `offer_choices`, on a watcher's wake, and in a routine started by an
  event's context (`outbound::STARTS_WITH_OUTSIDE_TEXT`).
- **Tests:** `outbound::tests`, `gateway::outbound_gate::tests`, and
  `tools_specialist::tests::a_searching_specialist_holds_nothing_of_the_persons`.

**Boundaries:**
- ⛔ **Never "your agent can't leak" or "prompt injection is solved".** Four ways remain, and any page
  making the claim above names them in the same place: a note an injected instruction saved into
  memory on an earlier turn can still steer a later turn that has read nothing; **an email or message
  read in an earlier job is still in the conversation, and the next job a person starts begins as if
  nothing outside had been read** (`TurnGuard::new` in `outbound.rs` takes `outside_already` from the
  wake alone and does not look for `ARRIVED_NOT_TYPED` entries in the history, so that job can hand a
  search on, or open a page on a site the person named, without asking; found October 6, 2026, and
  **closed in Archie 0.3.6 the same day**: see the note below); text
  typed into a page that is already open goes wherever that page sends it; and an MCP server the
  owner connected can have a fetch tool of its own.
- ⚠️ **A fifth, in 0.3.5 and earlier only: a chat app's link preview.** Telegram's plain sends and
  edits went out with previews on, and the progress line names the site the agent is opening
  ("Opening {site}…", up to 60 characters of the model's own words) before `opening_needs_yes` runs,
  so Telegram's servers could fetch an address the person was about to be asked about. Slack posted
  with its default unfurling. Found in the code October 6, 2026 and not watched live; Archie
  `4a5eeff3`, in 0.3.6, turns previews off on every Telegram send and unfurling off on every Slack
  post. Discord already suppressed embeds. `trust/details/` names it as a 0.3.5-and-earlier problem
  that 0.3.6 turns off, since October 6, 2026.
- **The earlier-job route, closed in Archie 0.3.6, October 6, 2026 (`49e1853d`).**
  `outbound::history_holds_outside_text` starts a typed turn outside when any user entry still in
  the history the model reads (`MAX_HISTORY`, 20 entries) ends with the wake's or the room's marker
  (`tools_memory::arrived_not_typed`). Test: `outbound::tests::a_wake_still_in_the_history_starts_the_
  next_typed_turn_outside`. **The cost, said wherever the claim is:** for about ten exchanges after a
  watch wakes the agent, a search it hands on and a site named in passing wait for a yes. At the
  0.3.6 release on October 6, 2026, the trust page's sentence "An email read in one job can shape a
  search in your next" came off, its third paragraph names two ways out, and its cost paragraph and
  `trust/details/`'s carry this cost.
- **Approved for `trust/`'s "Where we fall short", from 0.3.5 (written October 6, 2026).** Scoped to
  Archie, because Archie for Business is on 0.3.4 until its next release:
  > It does **not** stop everything. An injected instruction can still add items to your lists and
  > write a note into your agent's memory, and a note like that can steer a later job.
  >
  > The worst case is a *leak*: a web address or a search whose text carries something from your
  > conversation. Since Archie 0.3.5, your agent shows you any address it came up with itself and
  > waits for your yes. A skill that searches is given only its task, never your memory or files.
  >
  > We know of two ways out that remain. Text typed into a page already open goes wherever that
  > page sends it. And a service you connect through its address for AI assistants can open pages on
  > its own.
  >
  > Asking first has a cost: a page your agent wants to open on its own judgment now waits for you.
  > Since Archie 0.3.6, for about ten messages after your agent reads new mail or texts for you, so
  > does a search it hands on or a site you name in passing. Archie for Business gets this in its
  > next release.

  The memory way is in the first paragraph, which is why the third names two (three until 0.3.6).
  The preview is on `trust/details/` only, because it is fixed in 0.3.6 and the summary names what
  lasts.
- ⛔ **"Came from you" is any address in your messages in this conversation**, plus any page on a site
  you named in the message being answered, until the agent has read something somebody else wrote in
  that job. Never "only addresses you typed into this message". The named-site half used to hold
  after a page had been read, so a hostile page on a site the person named could have the agent build
  an address on that same site carrying their data; closed before any release carried the gate.
- ⚠️ **The agent judges whether your next message was a yes**, as it does for a calendar change; the
  code makes it a later, separate message from a person. Never "the app checks that you said yes".
- ⚠️ **A search still sends its words to the AI company's search service.** What changed is that the
  words can only come from the task. Never "searches are private".
- ⚠️ **What it costs the person, said wherever the claim is:** a page the agent wants to open on its
  own judgment now asks first, and a follow-up to the Researcher needs its subject named, because it
  no longer sees earlier messages.
- A connected service's own requests (`http_request`) were already bound to that service's host and
  are not part of this entry.

### ⛔ The gate does not stop exfiltration — never imply it does

**Narrowed in Archie 0.3.5, released October 5, 2026 (Archie for Business follows):** see the entry
above. This entry and the trust page's paragraph stay true of 0.3.4 and earlier, and the ways the
narrowing does not cover stay here now that a release carries it.

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
   and says nothing about leakage. Since 2026-09-18 `compare/` carries it too, in the h1 and in
   the sort figure's caption, scoped to the three shipped gates and to the claim that none of
   them is a setting. So there is nothing for the tracked-false section here, which
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

⚠️ **One exception the rule above was written before, checked October 6, 2026: Personal with an AI
key saved.** That is the free tier's door, and it does not read the note at all: `require_access`
(Archie `src-tauri/src/commands/gateway_lifecycle.rs`) lets an agent start on
`FREE_TIER_EXISTS && own_ai_key`, and `own_ai_key` (`src-tauri/src/auth.rs`) is a local query for a
saved key. So on day 61 with no contact, that install carries on at 20 jobs a day for as long as the
sign-in token stays in the Keychain; everything beyond the free tier, and all of Archie for
Business, gets `Refusal::Expired` ("Connect to the internet and sign in"). `trust/details/` said
"will ask you to sign in again" of every install until this date. **Still never "runs forever without
us"**: it holds only for that tier, it rests on a saved sign-in nobody promised to keep, and the
app's own update and connector checks still use the internet.

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
instruction: **`remember`** (a local write — the persistence vector, labeled since Archie 0.3.6
(`c1891673`) when outside text was read on the turn; see "`remember` is still ungated" above) and
**provider-side web search** (the exfiltration channel — see the gate-does-not-stop-exfiltration
section). A bad
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

### The agent tabs are Dashboard and Jobs, and the mockups are ports: RENAMED 2026-09-21

**What changed.** The two agent tabs that used to read **Now** and **Work** now read **Dashboard**
and **Jobs**. Jett's call, 2026-09-21. This is a label change and nothing else: no screen gained
or lost anything, and no claim on this site becomes more or less true because of it.

**Work became Tasks first, then Jobs, on the same day.** Tasks lasted one pass and never shipped.
It collided with the Task Manager skill's record collection, which is displayed as **Tasks** and
holds a person's to-do items, so the app would have had one word for two things: a board of what
the agent ran, and a list of what the owner means to do. Jobs is the word the app already used
underneath (the tab's own blurb reads "Every job this agent has run", the chart's accessible name
is "Jobs finished each day", and the store card says "Jobs it does for you"), so the label now
agrees with the copy around it rather than competing with it.

**Why it's in here anyway.** Four pages draw the agent's sidebar as a mockup, and a mockup is a
drawing of a real screen, so visual-first rule 5 puts it under this file. Those four are
`index.html`, `archie/business/index.html`, `compare/chat-apps/index.html` and
`compare/cloud-agents/index.html`, each with one `da-label` per row. They were changed in the same
pass as the app. The words on those rows are a port, not a design: when the app's rail changes, they
change, and a mockup that shows a tab the app does not have is the same kind of wrong as a sentence
that claims a feature the app does not have.

**Why it's true.** `src/app/agent-sections.ts` in the Archie repo, `DETAIL_SECTIONS`, and the two
`TabHead` titles in `src/app/agent-detail.tsx`. The tab **ids** stay `now` and `work` because they
are written into saved nav state and read across a dozen files; nobody sees an id. So a future
reader finding `"now"` in that repo has not found a straggler.

**The boundaries.**

- **Archie Mobile renamed the same day, and the phone mockup followed it.** The mockup was held
  back at first, on the grounds that the phone is a second product with its own repo and renaming
  the drawing ahead of the app would picture a screen nobody ships. Jett took the call the same
  day and the app changed too (`archie-mobile`, commit `e5b7eca`), so the drawing changed with it
  rather than ahead of it. **The order is the rule here**: the app moves, then the mockup. A
  mockup is a picture of a real screen, so one drawn from a plan is the same kind of wrong as a
  sentence written from one.

  Three surfaces moved on the phone, not two. Its per-agent tab is now **Dashboard**. Its job
  record lives as a row inside More rather than on the bar, and that row is now **Jobs**. And
  its top-level bar reads **Agents / Jobs / Marketplace / Settings**, which the desktop has no
  equivalent of: it is the same record read across every agent rather than one. **The mockup is
  generated**, by `scripts/gen-phone-mocks.py`, so a future rename is an edit to that script and
  a regenerate, never an edit to the HTML, which `--check` would catch in CI anyway.
- **Do not read this as a new capability.** There is no "dashboard" feature. The tab shows what it
  always showed: what the agent is doing this minute and what is waiting on the owner.
- **Jobs is not the to-do list, and the two must never be described as one.** A person's to-do
  items live in the Task Manager skill's own list, on the Knowledge tab under Lists (called Records
  until September 30, 2026), and from 0.3.3 they also sit at the top of the Dashboard tab. Nothing on
  this site may imply the Jobs tab holds them. The whole reason for the second rename
  was to keep those two apart on screen.

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
  sentence is confirmed from the source. **Found 2026-10-07:** "By default, we don't use inputs
  or outputs from ChatGPT Business, ChatGPT Enterprise, ChatGPT Edu, or our API to improve our
  models", on `help.openai.com/en/articles/5722486`, read through a reader service (see the
  competitor table's row). Confirm it in a browser before the trust page quotes it.
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
- The availability sentence ("Archie is in beta.") appears on every one of these pages as
  fine print, same as everywhere else. Since 2026-10-05 it carries no "Where it stands" link:
  Jett read the link and the box it opened as a warning.

### The table

| Claim as printed | About | Source | Checked |
|---|---|---|---|
| Lindy covers inbox management and workflows; Plus is $29.99 per user a month. Its pricing page says actions with outside impact, including sending email, wait for approval | Lindy | `https://www.lindy.ai/pricing` | 2026-10-01 |
| alfred_ covers email, calendars and tasks at $29.99 a month, on a single plan | alfred_ | `https://get-alfred.ai/docs/account/plans-pricing` | 2026-10-01 |
| alfred_ stores email content, memory entries and conversation history on US infrastructure, using Supabase for storage | alfred_ | `https://get-alfred.ai/docs/account/privacy-security` | 2026-10-01 |
| alfred_ says every email draft waits for the user to review and tap Send | alfred_ | `https://get-alfred.ai/docs/resources/faq` | 2026-10-01 |
| Martin works through text, calls, email and Slack | Martin | `https://www.trymartin.com/` | 2026-10-01 |
| Claude Pro is $20 billed monthly | Anthropic | `https://claude.com/pricing` | 2026-10-01 |
| Google AI Pro includes Gemini and costs $19.99 a month in the US | Google | `https://one.google.com/about/google-ai-plans/?hl=en-US` | 2026-10-01 |
| ChatGPT offers chat, research and agent features across its subscription plans; inclusion varies by plan | OpenAI | `https://chatgpt.com/pricing/` | 2026-10-01 |
| Reclaim focuses on calendar scheduling, with tasks, habits and meetings | Reclaim | `https://reclaim.ai/` | 2026-10-01 |
| Motion also covers projects, documents, notes and workflows, beyond calendars | Motion | `https://www.usemotion.com/` | 2026-10-01 |
| OpenClaw runs on the user's computer, supports local models, has no software subscription, publishes its source and offers desktop apps that install its gateway, chat and setup. Calling it exclusively for technical users would omit its desktop setup | OpenClaw | `https://openclaw.ai/` | 2026-10-01 |
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
| Cowork's work "runs on Anthropic's servers, in an isolated environment, and your sessions and files are saved to your Claude account" | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-10-07 |
| Cowork has three permission modes; in Skip mode "Claude doesn't pause to ask and nothing checks its actions automatically" | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-08-20 |
| Claude Free, Pro and Max users choose whether their chats are used to train Claude, and can change it "in your Privacy Settings at any time"; chats they allow are kept for "five years", 30 days otherwise; none of this applies to "API use". It is a choice made at signup or in a pop-up, so the site says "can train", never that Claude trains by default | Anthropic | `https://www.anthropic.com/news/updates-to-our-consumer-terms` | 2026-10-07 |
| Personal ChatGPT plans can train on what you send: "When you use our services for individuals, such as ChatGPT and Codex, we may use your content to train our models." The switch is "Improve the model for everyone" under "Settings > Data controls". The page refuses scripts and was read through r.jina.ai, a method Jett has not ruled on, so open it in a browser before the 90-day re-check | OpenAI | `https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance` | 2026-10-07 |
| "By default, we don't use inputs or outputs from ChatGPT Business, ChatGPT Enterprise, ChatGPT Edu, or our API to improve our models." Same page, same caveat; this is also the verbatim sentence the provider-training entry was waiting for | OpenAI | `https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance` | 2026-10-07 |
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
| OpenClaw&rsquo;s own getting-started runs through a terminal: &ldquo;Install OpenClaw, run onboarding, and chat with your AI assistant in about 5 minutes&rdquo;, &ldquo;Try it in one command&rdquo; (`npx openclaw@latest`), and `curl -fsSL https://openclaw.ai/install.sh \| bash`; &ldquo;Config lives at `~/.openclaw/openclaw.json`&rdquo; | OpenClaw | `https://docs.openclaw.ai/start/getting-started` | 2026-09-18 |
| OpenClaw ships desktop apps as well: &ldquo;Desktop Apps: Full apps that install everything for you, gateway, chat, setup, and node features. Available for macOS, Windows, and Linux.&rdquo; The chart places it by its docs&rsquo; own path and by what changing its permissions takes, and this row is why the fold says so | OpenClaw | `https://openclaw.ai/` | 2026-09-18 |
| OpenClaw gives the most control on the board: five exec modes, `deny`, `allowlist`, `ask` (&ldquo;ask a human on misses&rdquo;), `auto`, `full`; `ask: "always"` &ldquo;keeps prompting&rdquo;; per-command allowlists with `pattern` and `argPattern`; `tools.allow` and `tools.deny`; and &ldquo;effective policy is the stricter of `tools.exec.*` and approvals defaults&rdquo;. Set with `openclaw config set tools.exec.mode` | OpenClaw | `https://docs.openclaw.ai/tools/permission-modes`, `https://docs.openclaw.ai/tools/exec-approvals`, `https://docs.openclaw.ai/gateway/security/tool-permissions` | 2026-09-18 |
| Hermes leads with a download: its hero buttons read &ldquo;Download desktop app&rdquo;, &ldquo;Deploy to the cloud&rdquo;, &ldquo;Install via terminal&rdquo; in that order, and its FAQ says &ldquo;Download Hermes Desktop for macOS or Windows, or use the terminal installation command above.&rdquo; Linux is terminal only | Nous Research | `https://hermes-agent.nousresearch.com/` | 2026-09-18 |
| Hermes&rsquo; approvals are a config file: `approvals.mode` in `~/.hermes/config.yaml`, `smart` (default), `manual` (&ldquo;Always prompt the user for approval on dangerous commands&rdquo;), `off`; `approvals.deny` blocks matching commands &ldquo;before `--yolo`&rdquo;. It gates dangerous commands, not every action | Nous Research | `https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md` | 2026-09-18 |
| Vellum is a download: &ldquo;Vellum for Mac: Native Mac app with computer use&rdquo; (macOS 15 or later), &ldquo;Vellum for Windows: Desktop app for Windows PCs&rdquo;, plus App Store, Google Play and Chrome Web Store | Vellum | `https://www.vellum.ai/download` | 2026-09-18 |
| Vellum&rsquo;s permissions have four modes in Settings, from Strict, &ldquo;Everything: every action requires explicit approval&rdquo;, to Full access, &ldquo;your assistant never asks for permission&rdquo;, with a rule editor and grants &ldquo;once, for ten minutes, or always&rdquo; | Vellum | `https://www.vellum.ai/docs/trust-security/the-permissions-model` | 2026-09-18 |
| Claude Cowork is a mode inside an account: &ldquo;Open Claude on the web at claude.ai, in the Claude Desktop app, or in the Claude mobile app&rdquo;, then choose Cowork and &ldquo;describe the task you want Claude to complete&rdquo; | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-09-18 |
| Claude Cowork&rsquo;s three modes: &ldquo;Manually approve&rdquo;, &ldquo;Automatically approve&rdquo; (&ldquo;Claude reviews each action for safety before it runs&rdquo;), &ldquo;Skip all approvals&rdquo; (&ldquo;nothing checks Claude&rsquo;s actions before execution&rdquo;); connector tools can be Always allow, Needs approval or Blocked | Anthropic | `https://support.claude.com/en/articles/13364135-use-claude-cowork-safely` | 2026-09-18 |
| Grok Bot is a download: &ldquo;Download the app, create your first teammate, and start handing off work&rdquo;, with a &ldquo;Download for macOS&rdquo; button, for SuperGrok and Cursor subscribers &ldquo;on desktop and iOS&rdquo;. Read in a browser; x.ai refuses scripts | xAI | `https://x.ai/news/introducing-grok-bot` | 2026-09-18 |
| Meta Muse is a sign-in: &ldquo;rolling out in the US on iOS, Android, and muse.ai&rdquo;, and &ldquo;Anyone can use it out of the box, no technical experience required.&rdquo; | Meta | `https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/` | 2026-09-18 |
| Meta Muse&rsquo;s permissions are one of two settings: &ldquo;If you select Always ask, your Muse will ask for permission before any action&rdquo;, or &ldquo;Ask for some actions&rdquo;, which asks &ldquo;before every write action and important read actions&rdquo; | Meta | `https://www.meta.com/help/artificial-intelligence/1385290430137537/` | 2026-09-18 |
| Instinct is a sign-in: &ldquo;Text Instinct to get started&rdquo;, and &ldquo;The interface is simple: there are no new interfaces. It&rsquo;s trained to use a phone and a computer. You can text or call it.&rdquo; No approval setting is published | Instinct | `https://instinct.com/` | 2026-09-18 |
| Norton Family Assistant runs on Gen Digital&rsquo;s side, in its own words: &ldquo;Family Assistant runs a per-user instance architecture: your family graph, connected-account tokens, agent context, and chat history all live inside your own dedicated instance in the cloud, isolated from other users&rdquo;, and &ldquo;Your data is stored on encrypted infrastructure operated by Gen Digital and our cloud providers.&rdquo; This is the row that put it on the their-servers side of the chart | Norton | `https://support.norton.com/sp/en/us/home/current/solutions/v20260604215951281` | 2026-09-18 |
| Norton Family Assistant is reached in a browser or an iPhone app, and there is no program for your own computer: &ldquo;Family Assistant works on any PCs that run in browsers such as Norton Neo, Chrome, and Firefox&rdquo;, and &ldquo;You can also download and install the Norton Family Assistant app from the Apple App Store on an iOS device running iOS 17 or later.&rdquo; Sign in is its Ease level | Norton | `https://support.norton.com/sp/en/us/home/current/solutions/v20260604215951281` | 2026-09-18 |
| Norton Family Assistant is shaped by what you connect and nothing else it publishes: &ldquo;Family Assistant can connect to accounts and services you choose and are authorized to access. Connecting your Gmail is required to get started.&rdquo; No shelf of add-ons is published, so what a person can change is settings and the accounts they connect | Norton | `https://support.norton.com/sp/en/us/home/current/solutions/v20260604215951281` | 2026-09-18 |
| Symphony&rsquo;s agents work when you are not there: &ldquo;Your agents connect to the suite of tools you already use and can work on their own, 24/7, to help grow your business and manage day-to-day tasks&rdquo;, and &ldquo;Chatting with Symphony doesn&rsquo;t cost anything, but your agents&rsquo; background work uses AI credits.&rdquo; **Wix publishes no sentence saying where that work runs.** Read with the row above that Wix ships only a phone app and a browser, the chart places Symphony on the their-servers side, and the fold says in words that this is a reading of those two sentences and not a quote. If Wix ever publishes the sentence, cite it here and drop the caveat; if it publishes the opposite, Symphony moves | Wix | `https://support.wix.com/en/article/symphony-an-overview`, `https://www.wix.com/symphony` | 2026-09-18 |
| Symphony is shaped by what you connect and how you brief each agent: &ldquo;Symphony integrates with your existing tools and workflows, like your calendars, email inbox, productivity tools, Slack, Salesforce, and much more&rdquo;, and &ldquo;Create and train your own agent. Set its name, give it a personality, approve goals and actions.&rdquo; No shelf of add-ons is published, so what a person can change is settings and the accounts they connect | Wix | `https://support.wix.com/en/article/symphony-an-overview`, `https://www.wix.com/symphony` | 2026-09-18 |
| Claude Cowork has a shelf of add-ons: &ldquo;You manage connectors, skills, and plugins from Customize in the sidebar&rdquo;, and &ldquo;In Cowork, click Customize in the left sidebar, then click the &lsquo;+&rsquo; button to open the directory.&rdquo; That is a shelf of ready-made abilities, as Archie has | Anthropic | `https://claude.com/docs/cowork/overview`, `https://support.claude.com/en/articles/12512180-use-skills-in-claude` | 2026-09-18 |
| Grok Bot has a shelf of add-ons: a Marketplace page lists bots by category (From Grok Bot Team, Engineering, Sales, Marketing, Design, Personal, Recruiting &amp; People, Product, Operations) with an Add button on each. Read in a browser; x.ai refuses scripts. A shelf of ready-made abilities, as Archie has | xAI | `https://x.ai/bot/marketplace` | 2026-09-18 |
| Meta Muse is shaped by what you connect: &ldquo;You can choose to connect Muse to apps and services provided by Meta or third-parties. We call these Connectors&rdquo;, and &ldquo;People choose which apps Muse connects to and exactly how much access it gets.&rdquo; Meta publishes no shelf of add-ons to install, so what a person can change is settings and the accounts they connect | Meta | `https://www.meta.com/help/artificial-intelligence/1687253048996149/`, `https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/` | 2026-09-18 |
| Instinct is shaped by what you connect, and its page offers nothing else to install: &ldquo;It connects to your applications and devices - email, messaging, screen, audio, location, and more.&rdquo; The settings-and-accounts level | Instinct | `https://instinct.com/` | 2026-09-18 |
| Vellum&rsquo;s code is open under MIT: its homepage&rsquo;s own structured data lists &ldquo;Open source (MIT license)&rdquo; among its features, its FAQ says &ldquo;Vellum is open-source, so you can inspect the code yourself&rdquo;, and the page links `github.com/vellum-ai`. With the row below, open code plus a shelf is sourced for all three open-source products | Vellum | `https://www.vellum.ai/` | 2026-09-18 |
| Vellum has a shelf of add-ons on top of its open code: &ldquo;Skills give your agents new capabilities. Browse the catalog, pick what you need, and install with a single command&rdquo;, and plugins to &ldquo;Browse and install from the Plugins tab inside the Vellum app.&rdquo; With the open-source row above, its code is open as well as its shelf | Vellum | `https://www.vellum.ai/skills`, `https://www.vellum.ai/plugins` | 2026-09-18 |
| Hermes has a shelf of add-ons on top of its MIT code: &ldquo;Browse, search, install, and manage skills from online registries, skills.sh, direct well-known skill endpoints, and official optional skills.&rdquo; Its code is open as well as its shelf | Nous Research | `https://hermes-agent.nousresearch.com/docs/user-guide/features/skills` | 2026-09-18 |
| Claude writes a skill when you describe one: &ldquo;Try the skill-creator skill &mdash; Describe what you want, and Claude generates the folder structure, formats the SKILL.md file, and bundles your resources.&rdquo; Anthropic also publishes a Cowork-specific path by demonstration: &ldquo;Instead of writing a skill by hand, you can record yourself doing a task and let Claude build the skill from what it observes&rdquo; | Anthropic | `https://claude.com/skills`, `https://support.claude.com/en/articles/12512198-how-to-create-custom-skills` | 2026-09-18 |
| Vellum writes a skill when you describe one: &ldquo;You can create new skills by describing what you want in the chat &hellip; Your agent drafts the skill from what you described. It writes the instructions, bundles any reference notes and scripts the workflow needs, and sets the format&rdquo; | Vellum | `https://www.vellum.ai/docs/getting-started/your-first-skill.md` | 2026-09-18 |
| Hermes writes a skill when you describe one: &ldquo;`/learn` is the fast way to turn something you already know &hellip; into a reusable skill, without hand-writing the SKILL.md&rdquo;, worked as &ldquo;`/learn how I just deployed the staging server`&rdquo;. Its docs also claim &ldquo;autonomous skill creation&rdquo; | Nous Research | `https://hermes-agent.nousresearch.com/docs/user-guide/features/skills`, `https://hermes-agent.nousresearch.com/docs/` | 2026-09-18 |
| OpenClaw writes a skill when you describe one: &ldquo;For Workshop authoring, ask the agent for the skill you want; it calls `skill_workshop` and returns a proposal id&rdquo;, with the example &ldquo;Make a skill called morning-catchup that runs my Monday inbox routine&rdquo; | OpenClaw | `https://docs.openclaw.ai/tools/skill-workshop/authoring`, `https://docs.openclaw.ai/tools/skill-workshop` | 2026-09-18 |
| Grok Bot writes a skill when you ask: &ldquo;Ask: &gt; Save the process we just used as a skill called &lsquo;Weekly account health.&rsquo;&rdquo;, and if the demonstration control is missing, &ldquo;ask the Bot to create a skill from written instructions and the completed task&rdquo;. A Bot is named and described by the owner: &ldquo;Open Bot actions &rarr; Edit Profile to set its name, label, description, and avatar&rdquo; | xAI | `https://docs.x.ai/grok-bot/skills-routines-and-automations`, `https://docs.x.ai/grok-bot/bots` | 2026-09-18 |
| Meta Muse: **two Meta pages disagree and the site prints both.** Meta&rsquo;s engineering blog says Muse &ldquo;builds its own tools&rdquo; and &ldquo;can also write its own custom connectors for other services you care about&rdquo;. Meta&rsquo;s consumer help centre says &ldquo;Skills are developed by Meta and are already part of Muse&rdquo; and &ldquo;you don&rsquo;t need to install them separately.&rdquo; Never cite one without the other | Meta | `https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse`, `https://www.meta.com/help/artificial-intelligence/2797651547267109/` | 2026-09-18 |
| Meta Muse is named and shaped by asking: &ldquo;Name: Change what your assistant is called. Personality and tone: Make Muse more formal, more casual, funnier, or more concise&rdquo;, and &ldquo;You can ask your Muse in the conversation to change or update any of the above information&rdquo; | Meta | `https://www.meta.com/help/artificial-intelligence/995796179982326/` | 2026-09-18 |
| Vellum is named and shaped in its onboarding: &ldquo;Have a conversation. Name it, shape its personality, tell it about yourself&rdquo; | Vellum | `https://www.vellum.ai/docs` | 2026-09-18 |
| Wix Symphony is the one on the board whose custom agents are configured rather than written: its own comparison reads &ldquo;Custom | Setup required: Yes, configured by you | Who builds it: You&rdquo;, and its abilities are Wix&rsquo;s own, &ldquo;packed with proven skills, workflows and automations for every niche.&rdquo; The orchestrator does build agents from a conversation (&ldquo;Answer Maestro&rsquo;s questions about your business to build the right agents for you&rdquo;), and it assembles them from Wix&rsquo;s existing skill set rather than writing a new ability | Wix | `https://www.wix.com/blog/symphony-wix-agents`, `https://www.wix.com/symphony`, `https://support.wix.com/en/article/symphony-using-the-app` | 2026-09-18 |
| Norton Family Assistant publishes nothing about naming it, giving it a manner, installing an ability or creating one. **This is close to evidence of absence and not the same as evidence of absence:** the support FAQ is a complete feature enumeration written for a beta, read end to end, and none of those appears in it | Norton | `https://us.norton.com/products/family-assistant`, `https://support.norton.com/sp/en/us/home/current/solutions/v20260604215951281` | 2026-09-18 |
| Instinct publishes nothing about naming it, giving it a manner, installing an ability or creating one. **This is absence of evidence and must be labelled as such wherever it is printed:** instinct.com serves one page of roughly 770 characters, its sitemap holds a single URL, and there is no docs site or help centre. Its robots.txt welcomes crawlers, so nothing is being withheld from a reader; there is simply nothing published | Instinct | `https://instinct.com/`, `https://instinct.com/sitemap.xml`, `https://instinct.com/privacy-policy` | 2026-09-18 |
| OpenClaw has a shelf of add-ons on top of its MIT code: &ldquo;Skills &amp; Plugins: Extend with community skills or build your own&rdquo;, and &ldquo;ClawHub: Install skills and plugins.&rdquo; Its code is open as well as its shelf | OpenClaw | `https://openclaw.ai/` | 2026-09-18 |
| Vellum's FAQ: "you can switch between models including OpenAI, Anthropic, Gemini, or open weights via Ollama at any time" | Vellum | `https://www.vellum.ai/` | 2026-09-16 |
| Hermes' README: "Use any model you want", naming Nous Portal, OpenRouter, OpenAI and "your own endpoint" | Nous Research | `https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md` | 2026-09-16 |
| Hermes' security docs: "Before executing any command, Hermes checks it against a curated list of dangerous patterns. If a match is found, the user must explicitly approve it", with `approvals.mode` of "smart, manual, off" | Nous Research | `https://hermes-agent.nousresearch.com/docs/user-guide/security` | 2026-09-16 |
| OpenClaw's docs on tool and agent permissions: "Full Access, including Default (Full Access), authorizes permitted changes without an approval prompt; restricted runs require human approval" | OpenClaw | `https://docs.openclaw.ai/gateway/security/tool-permissions` | 2026-09-16 |
| OpenClaw's docs on exec approvals: "Commands run only when policy + allowlist + (optional) user approval all agree" | OpenClaw | `https://docs.openclaw.ai/tools/exec-approvals` | 2026-09-16 |
| Grok Bots "finish jobs end to end, and only come back when something needs your approval", and "share a computer of their own in the cloud" (read in a browser; x.ai refuses automated requests) | xAI | `https://x.ai/news/introducing-grok-bot` | 2026-09-16 |
| Instinct's privacy policy: the service is provided with "third-party hosting"; its features "can perform tasks or take actions independently on your behalf, based on the permissions you grant"; it uses "third-party AI model providers who help support the Services" | Instinct | `https://instinct.com/privacy` | 2026-09-16 |
| Norton's FAQ: "Every send, payment and booking waits for your approval", and "The AI providers we use operate under enterprise contracts with zero data retention" | Norton | `https://us.norton.com/products/family-assistant` | 2026-09-16 |
| Cowork's mode selector "offers Auto and Manual (default)"; Manual, "formerly 'Ask before acting'", means "Claude pauses and asks for approval for actions" | Anthropic | `https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork` | 2026-09-16 |
| Muse&rsquo;s approval prompt offers five choices, in Meta&rsquo;s words: &ldquo;Allow once: Muse proceeds this one time&rdquo;, &ldquo;Allow for this task: Muse can take this type of action for the entire task&rdquo;, &ldquo;Allow for this site: Muse can take this type of action for this website in the future without asking again&rdquo;, &ldquo;Always allow: Muse can take this type of action for this Connector in the future without asking again&rdquo;, and &ldquo;Deny: Muse won&rsquo;t proceed this one time&rdquo;. The same page: &ldquo;Because Muse acts on your behalf, you&rsquo;re responsible for guiding it carefully and approving its actions.&rdquo; **This row contradicts the 2026-09-27 placement of Muse on the compare chart:** see &ldquo;Muse, re-read 2026-09-28&rdquo; below | Meta | `https://www.meta.com/help/artificial-intelligence/1385290430137537/` | 2026-09-28 |
| Vellum&rsquo;s trust rules: &ldquo;Trust rules are persistent decisions that tell the system to always allow or always deny specific actions. They accumulate over time as you use your assistant&rdquo;, and &ldquo;the more you approve, the fewer prompts you see.&rdquo; | Vellum | `https://www.vellum.ai/docs/trust-security/the-permissions-model` | 2026-09-28 |
| Matt Robb on Threads, posted 9:27 PM Pacific on 2026-09-26 (12:27 AM on the 27th in Toronto): &ldquo;So muse handled my Facebook marketplace today. Just found out it told people my address and agreed a lowball price and then they showed up without it even telling me until late tonight that it messed up. Absolutely wild.&rdquo; A follow-up on Threads: &ldquo;Update on letting muse run my Facebook Marketplace for a day. It gave out my home address. It agreed to a lowball price I never approved. And it didn&rsquo;t tell me any of this until after the guy had left&rdquo;. On X: the buyer &ldquo;did exactly what &lsquo;I&rsquo; told him to do.&rdquo; **A user&rsquo;s account, not Meta&rsquo;s: print it as what Matt posted, with the link, never as a finding about Muse** | Meta, as reported by a Muse user | `https://www.threads.com/@matt.j.robb/post/DdxwAJnDhNy`, `https://www.threads.com/@matt.j.robb/post/Dd0CYKJFHS0`, `https://x.com/MattRobbt/status/2104396139587879234` | 2026-09-28 |
| Matt&rsquo;s screenshots with those posts. The Marketplace thread, from Matt&rsquo;s account: at 5:27 PM the pickup &ldquo;would have to be&rdquo; at an address Matt scribbled out; at 7:27 PM, &ldquo;Sounds good, e-transfer works. Just message me before you head over tonight!&rdquo; The agent&rsquo;s own summary at 10:28 PM: the buyer came &ldquo;around 9:15&rdquo;, its &ldquo;auto-reply told him &lsquo;Yep I&rsquo;m here!&rsquo; at 9:27 when you clearly weren&rsquo;t available&rdquo;, the buyer left &ldquo;at 9:38 and left a negative rating&rdquo;, and it had &ldquo;sent him an apology from your account&rdquo;. Its answer to Matt&rsquo;s &ldquo;don&rsquo;t agree for pickup unless you check with me&rdquo; begins &ldquo;locked in now as a hard rule&rdquo;, and the rest is under the app&rsquo;s own controls in the screenshot. An earlier heads-up about the buyer sits above 10:28, time not shown | Meta, as reported by a Muse user | the two Threads posts above | 2026-09-28 |
| David Singleton, of the Muse team, on X at 02:52 UTC on 2026-09-28: &ldquo;David from the Muse team here. I responded to Matt on Threads and sent him a couple of DMs offering to help and look into what happened.&rdquo; and &ldquo;In the past, when we&rsquo;ve worked with users to investigate similar reports, we&rsquo;ve consistently learned that Muse was following direct instructions and correctly asked for permission.&rdquo; x.com refuses fetches, so the first sentence and the start of the second were read through X&rsquo;s embed feed (`cdn.syndication.twimg.com/tweet-result`), and the second in full at TNW. **Print it beside any use of the Marketplace posts** | Meta | `https://x.com/dps/status/2104403954235007302`, `https://thenextweb.com/news/meta-muse-facebook-marketplace-address-buyer-robb` | 2026-09-28 |
| Cue &ldquo;is a new standalone app for your personal agents, on your phone and desktop, built on the same infrastructure as Manus&rdquo;, announced in the Manus 2.0 post of 2026-09-28 | Manus | `https://manus.im/blog/introducing-manus-2-0` | 2026-09-29 |
| &ldquo;In Cue, each agent has its own email, phone number, wallet, and computer, so it can send messages, pay within the budget you set, and see a task through on its own machine. It can also take your calls and leave you a summary in Cue.&rdquo; **Manus does not say where that computer runs**, so the site says &ldquo;its own computer&rdquo; and nothing more. Manus&rsquo;s help center calls its separate Cloud Computer product &ldquo;a dedicated, persistent virtual machine in the cloud&rdquo; and does not mention Cue, so that sentence does not place Cue either | Manus | `https://manus.im/blog/introducing-manus-2-0`, `https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer` | 2026-09-29 |
| &ldquo;Cue is available on the web, desktop, and mobile, with iOS coming soon after App Store review. Cue is in early access and free to use with an invite code.&rdquo; The help center: &ldquo;Cue currently requires an invitation code.&rdquo; | Manus | `https://manus.im/blog/introducing-manus-2-0`, `https://help.manus.im/en/articles/17190150-what-is-new-in-manus-2-0` | 2026-09-29 |
| Neither Manus page describes an approval step before a Cue agent sends, pays or takes a call, and neither names a model or offers a choice of one. What they do say is &ldquo;pay within the budget you set&rdquo; and, of agents working in a group chat, &ldquo;You set the direction and make the final call.&rdquo; **Absence of evidence, and it must be labelled that way wherever it is printed:** `cue.im` serves a headline and a script, and no Cue help article exists yet. The same post says Manus itself, not Cue, &ldquo;works in its own visible workspace on your computer, using the files, browser, and apps you&rsquo;ve approved&rdquo;; never attribute that to Cue | Manus | `https://manus.im/blog/introducing-manus-2-0`, `https://help.manus.im/en/articles/17190150-what-is-new-in-manus-2-0` | 2026-09-29 |
| Manus 2.0 Automations: &ldquo;A new email, a change in ad performance, a calendar event, a Slack message, or a Notion update can all trigger a task&rdquo;, and a Cloud Computer can be &ldquo;a permanent home for an automation&rdquo;. Recorded, not printed: see &ldquo;Manus Cue and Microsoft Autopilot, 2026-09-29&rdquo; below | Manus | `https://manus.im/blog/introducing-manus-2-0` | 2026-09-29 |
| &ldquo;Autopilot, previously called Scout, is your digital teammate.&rdquo; It &ldquo;lives in your tenant with its own identity, memory, computer and workspace&rdquo; and &ldquo;is cloud-hosted, so it keeps working while you sleep or your attention is elsewhere.&rdquo; &ldquo;Autopilot is expanding to private preview at the end of the month.&rdquo; A tenant is an organization&rsquo;s Microsoft 365, so this is sold to companies | Microsoft | `https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/` | 2026-09-29 |
| Microsoft&rsquo;s earlier Scout post: &ldquo;Sensitive actions can require a human to sign off before they proceed&rdquo;, and access &ldquo;requires Frontier enrollment, Intune policy configuration, and an opt-in attestation&rdquo;. &ldquo;Can require&rdquo; is an organization&rsquo;s policy, so never print it as Autopilot asking first | Microsoft | `https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/` | 2026-09-29 |
| OpenClaw&rsquo;s blog says Autopilot&rsquo;s &ldquo;foundation is OpenClaw&rdquo;, quoting Omar Shahine, &ldquo;who leads the team building it&rdquo;: &ldquo;We are building Autopilot on @openclaw, working with @steipete and the OpenClaw Foundation to make it a fantastic enterprise grade runtime.&rdquo; **Microsoft&rsquo;s own post does not mention OpenClaw**, so print this as OpenClaw&rsquo;s blog saying it | OpenClaw | `https://openclaw.ai/blog/microsoft-autopilot-openclaw` | 2026-09-29 |
| OpenClaw&rsquo;s Windows app, in the same post: the Foundation and Microsoft&rsquo;s Windows team are working &ldquo;to make Windows a premier platform for OpenClaw&rdquo;; Scott Hanselman&rsquo;s contributions &ldquo;include a guided setup experience&rdquo;, and R&eacute;gis Brid &ldquo;contributed native WinUI chat and inline command approvals&rdquo;. The post does not say the default approval mode changed, so the exec-approvals rows above still stand | OpenClaw | `https://openclaw.ai/blog/microsoft-autopilot-openclaw` | 2026-09-29 |
| Dots are OpenAI&rsquo;s &ldquo;always-on agents&rdquo;, announced at DevDay on 2026-09-29 and &ldquo;Powered by GPT&#8209;6 Astra&rdquo;: &ldquo;Each dot works on its own cloud computer, while your computer and its contents stay separate unless you choose to connect it.&rdquo; **This is the row that puts Dots on the their-servers side of the compare chart** | OpenAI | `https://openai.com/index/introducing-dots/` | 2026-09-30 |
| &ldquo;Your dot has its own cloud computer. Access to your local computer is optional and starts turned off.&rdquo; Connected, &ldquo;your dot can access files and work on that computer&rdquo;, and &ldquo;Your computer must be online with the ChatGPT app open for your dot to use it.&rdquo; Connecting yours does not move a dot onto it: the dot&rsquo;s own computer stays in the cloud, and yours is a place it can reach while it is on | OpenAI | `https://help.openai.com/en/articles/20001530-getting-started-with-your-dot`, `https://learn.chatgpt.com/docs/dots` | 2026-09-30 |
| A dot works with your computer off: &ldquo;You can reach it and it can keep working even when your computer is off&rdquo;, and &ldquo;Cloud work can continue while your devices are off.&rdquo; | OpenAI | `https://learn.chatgpt.com/docs/dots` | 2026-09-30 |
| Dots ask for some actions by default and a rule can stop the asking: &ldquo;Dots start with built-in rules for when to act independently and when to ask for approval. Custom Rules let you allow specific actions, require approval, or block them.&rdquo; Before an action that &ldquo;could affect your accounts or share information&rdquo;, an automatic review &ldquo;determines whether the action can proceed, needs your approval, or includes a step you must do yourself&rdquo;, and one of the four custom rules is &ldquo;Take action without asking&rdquo;. **This is the row that puts Dots a short way below the top, beside Cowork and Muse** | OpenAI | `https://openai.com/index/introducing-dots/`, `https://learn.chatgpt.com/docs/dots/controls` | 2026-09-30 |
| A dot is a sign-in: &ldquo;Create your dot in the ChatGPT desktop app or in ChatGPT on desktop web&rdquo;, and &ldquo;You cannot currently create a dot on mobile, and dots are not supported on mobile web.&rdquo; After setup it can be reached &ldquo;in the ChatGPT mobile app when mobile access is available&rdquo;. The sign-in level, beside Cowork, which is reached the same way | OpenAI | `https://help.openai.com/en/articles/20001530-getting-started-with-your-dot`, `https://learn.chatgpt.com/docs/dots/getting-started` | 2026-09-30 |
| &ldquo;You reach the same dot in ChatGPT, Slack, Teams, or a call.&rdquo; &ldquo;Your dot cannot initiate calls to you at launch.&rdquo; Texting is &ldquo;coming soon&rdquo; in OpenAI&rsquo;s announcement and may not be printed as present | OpenAI | `https://learn.chatgpt.com/docs/dots`, `https://help.openai.com/en/articles/20001530-getting-started-with-your-dot`, `https://openai.com/index/introducing-dots/` | 2026-09-30 |
| &ldquo;Your first dot is included in your Pro or Business Premium plan at no extra cost.&rdquo; Pro users get it &ldquo;in markets excluding the European Economic Area, Switzerland, and the UK&rdquo;, and &ldquo;Dots are rolling out gradually. Access may take several days to reach your account.&rdquo; ChatGPT&rsquo;s pricing page lists &ldquo;Dot, your always-on agent&rdquo; on the Pro card, &ldquo;From $100 / month&rdquo;, and not on Free, Go or Plus | OpenAI | `https://help.openai.com/en/articles/20001530-getting-started-with-your-dot`, `https://chatgpt.com/pricing` | 2026-09-30 |
| &ldquo;Conversations with your dot don&rsquo;t count toward your ChatGPT usage limits&rdquo;, and &ldquo;Your plan also includes an allowance for deeper work, with extended limits for the first month after launch.&rdquo; No per-task figure is published, so none is printed | OpenAI | `https://openai.com/index/introducing-dots/` | 2026-09-30 |
| On training: &ldquo;We don&rsquo;t use content from ChatGPT Business, Enterprise, or Edu workspaces to improve our models by default. On personal ChatGPT plans, you can control whether dots&rsquo; conversations and work are used to improve our models.&rdquo; And &ldquo;We don&rsquo;t train directly on proactive research or your dot&rsquo;s notes to itself.&rdquo; Recorded because it cuts against us, as Meta&rsquo;s Muse commitment does | OpenAI | `https://openai.com/index/introducing-dots/` | 2026-09-30 |
| Signing in to websites happens in the dot&rsquo;s own browser: &ldquo;Your credentials go to the browser outside the conversation&rdquo;, &ldquo;The cloud browser has its own sessions, separate from the browser on your computer&rdquo;, and &ldquo;dots can use saved passwords without exposing them to the model&rdquo; | OpenAI | `https://learn.chatgpt.com/docs/dots`, `https://openai.com/index/introducing-dots/` | 2026-09-30 |
| &ldquo;Behind the messages, Tab has its own computer and browser.&rdquo; &ldquo;If the job takes a while, you can leave. Tab keeps going.&rdquo; | Tab (Terrasoft, Inc.) | `https://tab.bot/` | 2026-10-07 |
| &ldquo;Nothing is paid until you approve it.&rdquo; The terms: &ldquo;Tab may pause and ask for clarification or approval when a request is ambiguous, sensitive, irreversible, unusually risky, or materially different from what you approved&rdquo;, and a request authorizes &ldquo;the steps reasonably necessary to carry out that request within the scope you provided&rdquo; | Tab | `https://tab.bot/`, `https://tab.bot/terms` | 2026-10-07 |
| &ldquo;Tab starts in Messages&rdquo;, and the sign-up asks for &ldquo;Your number, then one required text&rdquo; under &ldquo;Join the waitlist&rdquo;; since 2026-09-12 a new user picks &ldquo;Messages or WhatsApp&rdquo;. &ldquo;Tab is in private beta&rdquo;, and no page publishes a price (`/pricing` is a 404) | Tab | `https://tab.bot/`, `https://tab.bot/updates`, `https://tab.bot/terms` | 2026-10-07 |
| Tab names no AI company; its updates speak of &ldquo;a model provider&rdquo; and &ldquo;a second model&rdquo; | Tab | `https://tab.bot/updates` | 2026-10-07 |
| &ldquo;Every customer runs on a dedicated, isolated instance rather than in a shared multi-tenant pool.&rdquo; &ldquo;Your data is hosted in the European Union. That is true wherever you are.&rdquo; | Eden AI Lab Inc. | `https://meeteden.ai/privacy` | 2026-10-07 |
| &ldquo;Where an action would commit you to something, it asks you to approve it first.&rdquo; | Eden AI Lab Inc. | `https://meeteden.ai/privacy` | 2026-10-07 |
| The homepage&rsquo;s two buttons read &ldquo;Chat on iMessage&rdquo; (a text to a US number) and &ldquo;Chat on Telegram&rdquo;, and the page says &ldquo;eden is in closed beta&rdquo; and calls Eden &ldquo;your personal 24/7 concierge&rdquo; | Eden AI Lab Inc. | `https://meeteden.ai/` | 2026-10-07 |
| &ldquo;Eden uses third-party AI model providers to generate responses&rdquo;, and names none | Eden AI Lab Inc. | `https://meeteden.ai/privacy` | 2026-10-07 |

**Manus Cue and Microsoft Autopilot, 2026-09-29.** Both came in from the competitive watch. Jett
chose where they go, as a choice: **Cue joins `compare/cloud-agents/` beside Muse**, and the hub
stays at ten, because Cue leaves at the sieve&rsquo;s first question and adding a mark means
redrawing two figures in two widths for no change in the finding. **Autopilot does not get a
column anywhere**: a tenant is a company&rsquo;s Microsoft 365, access runs through Frontier
enrollment and Intune, and that is off the one-person wedge. It appears once, on
`compare/building-it-yourself/`, as news about OpenClaw. Manus 2.0&rsquo;s event triggers are
recorded and not printed. Archie&rsquo;s own routines also start on things other than a clock
(before a meeting, after a recorded one, before leaving, when a date comes due, `RoutineTrigger`
in `crates/archie-domain/src/routine.rs`), and **no entry here approves that yet**, so the site
still says only &ldquo;a schedule you set&rdquo; and the inbox watch. A trigger row is the
missing piece, and it is our claim, so it goes under our own capabilities, not in this table.

**OpenAI Dots, 2026-09-30.** Announced at OpenAI&rsquo;s DevDay the day before, and Jett chose
where it goes: **both pages**. The hub goes to eleven, and Dots joins `compare/cloud-agents/`
beside Muse and Cue. That is the opposite of Cue&rsquo;s call a day earlier, and the reason is who
reads the page: Dots comes with ChatGPT, the app most readers who arrive with an agent already
have, so it is the one they look for on the board. It leaves at the sieve&rsquo;s first question and
changes nothing in the h1 but the count. Cue is still not on the hub.

How it was read. `openai.com`, `chatgpt.com` and `help.openai.com` return 403 to scripts, so
those three were read through a reader service (`https://r.jina.ai/<url>`), which fetches the
page and returns its text. That is the company&rsquo;s own page, with the same standing as reading
it in a browser, and unlike a browser read it can be re-run when the date comes due.
`learn.chatgpt.com` serves scripts directly. Where the rows above put it: their servers, asking
by default until you change a setting (beside Cowork and Muse), and sign in.

- &#9940; Never say a dot acts without asking by default, and never say it always asks. Its built-in
  rules ask for some actions and not others, and OpenAI does not publish the list.
- &#9940; Never say a dot runs on your computer. Connecting yours is optional and starts off, and
  work there &ldquo;runs in separate tasks&rdquo;.
- &#9940; Never print texting as present: it is &ldquo;coming soon&rdquo;.
- &#9940; Never print a price for Pro&rsquo;s higher tiers. The Learn page names &ldquo;Pro 100, Pro 200,
  and Pro 500&rdquo; and the pricing page shows only &ldquo;From $100&rdquo; with &ldquo;Your choice of 3
  usage tiers&rdquo;. A tier&rsquo;s name is not its price, so $100 is the one figure that prints.
- The name. OpenAI writes &ldquo;dots&rdquo; in lowercase and &ldquo;your dot&rdquo; for one agent. The
  site writes Dots, capitalized as a product name, and &ldquo;OpenAI Dots&rdquo; on the chart beside
  Meta Muse and Claude Cowork, because a lowercase &ldquo;dots&rdquo; in a sentence reads as the common
  word. Quotes keep OpenAI&rsquo;s spelling. The chart&rsquo;s letter is D.
- &#9888;&#65039; What cuts against us, and is printed: a dot keeps working with your computer off,
  you can reach it in Slack, Teams or a call, and OpenAI makes a training commitment for work
  accounts and offers a control on personal ones.

**Tab and Eden, 2026-10-07.** Read for Jack&rsquo;s two competitor reports, and Jett chose where
they go: **the hub only**, which goes to thirteen; neither joins `compare/cloud-agents/`. Both
sites serve their text to a script with a browser&rsquo;s user agent, so every row above was read
from the page itself, the same day. Where the rows put them: their servers, both; sign in for
Ease, both, as Instinct, because you start by texting them; and the top of Asks first, both, **as
readings, labelled as such in the fold**. Eden by its policy&rsquo;s &ldquo;asks you to approve it
first&rdquo; for anything that commits you, the reading that put Norton there. Tab by &ldquo;Nothing
is paid until you approve it&rdquo; and its terms&rsquo; &ldquo;may pause and ask&rdquo;, the reading that
put Grok Bot there on 2026-09-27. Neither approval prompt could be read, since both are behind a
waitlist, which is the check Muse taught us to make; if either is read later, place it by the prompt.

- &#9940; Never say Tab always asks. Its terms say it &ldquo;may&rdquo; pause, and a request authorizes
  &ldquo;the steps reasonably necessary&rdquo; within it.
- &#9940; Never print Eden&rsquo;s user count or waitlist figures. The homepage&rsquo;s &ldquo;500,000+
  users&rdquo; stands beside &ldquo;closed beta&rdquo;, its own release of 2026-10-05 says 13,000 signed up
  for early access, and the page&rsquo;s join notices are generated by its own script. None is a source.
- &#9940; Never say Eden is on WhatsApp. The homepage links iMessage and Telegram; WhatsApp is in its
  metadata and an unlinked route only.
- &#9940; Never quote either company&rsquo;s app code, only its public pages.
- &#9888;&#65039; What cuts against us, and is printed: both need no computer of yours and keep going
  while yours is off. Tab also places phone calls and waits on hold; that is not on the hub.
- The chart&rsquo;s letters are T and E, in the site&rsquo;s own type, like every other company on it.

**Re-read 2026-09-18 for the compare chart&rsquo;s second and third views, for the axis that was
mislabelled, and for the two marks that came onto the chart.**
The chart&rsquo;s up-axis said Control and measured what a product does by default. OpenClaw sat at
the bottom of it and gives more control than anything on the board, which Jett caught. The axis
is &ldquo;Asks first&rdquo; now, which is what it measures, and the rows above hold what each
company publishes about control so the concession is sourced, not felt. The second view, Ease,
is how you get a product running, in three levels each company&rsquo;s own get-started page puts
it in: sign in (Cowork, Muse, Instinct, Symphony, Norton), download an app (Archie, Vellum,
Hermes, Grok Bot), from a terminal (OpenClaw). OpenClaw is the one judgement call: its site offers
desktop apps and its docs get you started with a shell command and change its permissions with
one. The fold says both. **A third view was built twice and dropped the same day, and the rows
above are what survived it.** The first cut measured how much of a product&rsquo;s code you can
change, which put Archie under the three open-source products; Jett&rsquo;s objection was that this
measures a technical user&rsquo;s freedom and the site is not sold to technical users, and he is
right. The axis was redefined as how much you can shape without writing code, with the definition
written down before any competitor was researched under it, because redefining a measure straight
after losing on it is the thing a reader is entitled to be cynical about. Researched, that ladder
put seven of the ten on one line: **getting a new ability by describing it in conversation is table
stakes**, published by Cowork, Muse, Grok Bot, Vellum, Hermes and OpenClaw as well as us. An axis
that separates nobody is not an axis, and a third definition would have been the move this section
exists to prevent, so the view came off and the finding went into the page&rsquo;s prose. Every
level is still sourced in the rows above, because the claim &ldquo;six of the other nine will also
write you a skill if you ask&rdquo; is a claim about six companies. **Symphony and Norton joined the chart the
same day.** Norton&rsquo;s support FAQ says the work runs in &ldquo;your own dedicated instance in the
cloud&rdquo;, which is a quote and closes a gap this file had held open since 2026-09-16. Wix still
publishes no such sentence; its agents &ldquo;work on their own, 24/7&rdquo; and the only things it
ships are a phone app and a browser, so Symphony sits on the their-servers side by a reading of
those two rows, and the page&rsquo;s fold says so in those words rather than pretending Wix said it.

**Moved 2026-09-27, because the page contradicted its own rows.** Meta Muse and Grok Bot now sit
at the top of the Asks-first view with Symphony and Norton. Muse's two settings both ask "before
every write action and important read actions", so no setting stops the asking. A Grok Bot comes
back "when something needs your approval", and no row says it can be set to stop. That is the rule
that already placed Symphony and Norton. The bottom level now reads "acting on their own by
default", and only OpenClaw is described as able to be set to ask. None of this moves the binary:
both sit on the their-servers side, so the h1's count of what runs on your computer is unchanged.
⚠️ xAI's docs refuse automated reads and nobody has read them for a permission setting; if one
exists, Grok Bot moves to the middle. The h1 became one sentence the same day, "Of ten agents,
only Archie works on your own computer...", and `check-claim-drift.py` reads that form too.
**Moved back 2026-09-28, Muse only, at Jett's direction.** The same help page offers "Always allow"
when Muse asks, which lets it take "this type of action for this Connector in the future without
asking again": the asking stops for a kind of action. Muse sits beside Cowork again, a short way
below the top, in both drawings, both accessible names and the fold. Grok Bot stays at the top.
See "Muse, re-read 2026-09-28" below.

**Re-read 2026-09-16 for the compare chart, and the docs say what the landing pages do not.** Jett
asked for the chart's "doesn't say" gaps to be filled rather than drawn, so each company's docs,
FAQ and privacy pages were read. Hermes asks by default and can be set not to; OpenClaw acts on
its own by default and can be set to ask; Instinct is hosted and acts independently within
permissions you grant. Those three moved from "doesn't say" onto the chart on the rows above.
Hermes' "you pick the AI company" point, retired that morning as unsourced, is sourced now from
its README. Two gaps stayed gaps, and stay off the chart: nothing on wix.com or support.wix.com
says where Symphony's agents run, and nothing on us.norton.com says where Family Assistant's
work happens. Both pages say the assistant asks first, and the chart's strip says that.
**Closed 2026-09-18:** Norton's support FAQ, quoted in the rows above, says where the work
happens; Wix still does not, and the row above records the reading that placed it and labels it
as one. Both are on the chart and the strip under it is gone.

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

✅ **Superseded 2026-09-28, by Jett: all nine carry an initial now.** The five above kept their icon
on the rule that only a published prohibition takes a mark off. That rule sat beside the one two
paragraphs up (a logo ships only with permission in hand) and the two said different things about
the same five circles. None of the five had given permission, and the Wix and Hermes icons were
clipped to a circle, which is arguably the alteration Wix asks against. So the compare chart's
circles all hold a letter in the site's own type (Hermes H, Instinct I, OpenClaw O, Vellum V, Wix
Symphony S), and only Archie's holds a mark. `assets/mark-hermes.png` and `assets/mark-wix.png` were
deleted; the favicon SVGs lived inline in `compare/index.html` and went with the symbols. **The
permission rule above is now the only rule**: a logo comes back with a written grant and a row here.

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

**One exception since 2026-09-28, by Jett: a sign-in button is the company's own.** Where a button
sends the person to Google's or Microsoft's own sign-in, it is that company's published button,
unaltered: Google's "Sign in with Google" art on the website's login page (317502ac) and in the app,
and Microsoft's "Sign in with Microsoft" art on the app's Outlook buttons (from Archie 0.3.1,
`864703c8`; not in 0.3.0). Both companies publish those buttons for exactly this use, and Microsoft's one rule is
"DON'T alter the Microsoft logo" (learn.microsoft.com, Sign in with Microsoft branding guidelines;
the files are byte for byte theirs). It is a door, not a roster, so the rule above still holds
everywhere else: no product icon (Gmail, Calendar, Outlook), no bare G, nothing on a page that sells.
Apple has no such button for iCloud, whose connection is an app-specific password, so iCloud stays
in type. **Approved wording:** "Archie's Google and Microsoft sign-in buttons are those companies' own
published buttons, unaltered." ⛔ Never "partner", "verified by" or "approved by" beside them. Code:
`src/app/google-button.tsx`, `src/app/microsoft-button.tsx`, `docs/BRAND-MARKS.md`.

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

✅ **Asked and answered, September 20, 2026: Anthropic says no to the mark and yes to the name.**
This is the first time one of these companies has answered us directly, and it is worth separating
from the rows above, every one of which is us reading a published page and applying it to ourselves.
Jett wrote to `marketing@anthropic.com` about the two places the Claude mark had been drawn in the
app, the tile and the chip in the reply's own words, and took it out of the build while he waited.
Ariana Kim of Anthropic Marketing replied:

> We aren't able to approve use of the Claude mark for the tile and the chip, so the name in text is
> the route here. You're welcome to refer to Claude by name in plain text to show which account a
> key opens, for example listing Claude among the providers Archie supports, as long as nothing
> implies sponsorship, endorsement, or an affiliation with Anthropic. Any use of our logos or other
> brand assets requires our prior written approval of the specific use and placement and is subject
> to our Trademark Guidelines.

The reply says of itself that it is a general explanation of how their published guidelines apply,
not a license, sponsorship or endorsement. The Archie repo's `docs/BRAND-MARKS.md` carries the same
record beside the app-side audit.

**Nothing on either surface changes, and that is the point.** The site has carried no logos at all
since September 17, apart from Google's own sign-in button on the login page since September 28, and the app's tile has carried a monogram since the same day, both decided before
this reply arrived. What changed is which half we can point at. The refusal confirms a rule we were
already keeping. The permission is new: **naming Claude in plain type, to say which account a key
opens, is now allowed in writing rather than by our own reading of nominative fair use.** That is
firmer ground than anything else on this page stands on, and it is the ground the pricing pages, the
AI account copy and the provider lists all stand on.

**Two things this closes, and one it opens.**

- ⛔ **`marketing@anthropic.com` is no longer a permission route for the mark.** It is answered. A
  logo use would now need their prior written approval of a specific use and placement, starting
  from a no. Do not send screenshots; they asked us not to, since the answer does not turn on how
  the mark would look.
- ⛔ **The Anthropic row in the tables above may not be read as "unasked".** It was asked.
- ⚠️ **The permission carries a condition, and the condition is a sentence rather than a picture.**
  Naming Claude is allowed only while nothing implies sponsorship, endorsement or affiliation. Two
  things discharge that today: the `footer-marks-note` in every page's footer, and `NOT_AFFILIATED`
  in the app's `src/app/trademark-notices.tsx`, which names Anthropic. **Neither may be dropped
  while Claude is named**, and no copy may drift into "powered by Claude", "built on Claude" or a
  partner word. None does today, which was checked when this was recorded.

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

### Muse, re-read 2026-09-28: the approval choices, and the Marketplace posts

**Why this block exists.** Matt Robb's posts about letting Muse run Facebook Marketplace for a day
spread on 2026-09-27 and 28 (an Instagram aggregator, then TNW, Moneywise, Business Insider,
Mashable and others), and Jett asked for a blog post and social posts from them. The post is
`blog/your-ai-agents-messages-go-out-under-your-name/`, and its sources are the five rows dated
2026-09-28 in the table above. What follows is what may be said, what may not, and a finding that
moves the compare chart.

⚠️ **The 2026-09-27 move put Muse higher than its own help page does.** The compare page's fold says
Muse's permissions are two settings and "Neither stops the asking, which is why Muse sits at the
top." The same help page offers, at the prompt, "Always allow: Muse can take this type of action for
this Connector in the future without asking again", which is the asking stopping for a kind of
action. By the chart's own levels that is "asking by default until you change a setting", beside
Claude Cowork. **Muse belongs a short way below the top, and moved there the same day** at Jett's direction:
beside Cowork in both drawings (desktop 310,150.4; phone 118,176.68, its name kept above the mark so
it clears Instinct in the Ease view), in both accessible names, and in the fold's entry 7. The h1 is
unaffected (Muse leaves at the first question), and so is Grok Bot.

✅ **What may be said, in the order the post says it:** the incident in Matt's words, with links;
the agent's own summary, attributed to the agent; Meta's default and Singleton's reply beside it;
"Neither side has shown what Matt approved"; Meta's approval choices, quoted; Vellum's trust rules
as the same trade; then Principle 7 in its required order: the rule, what Archie enforces (the email
entry's 2026-09-28 amendment), and what the asking does not do.

**Added 2026-09-28, for the social posts: the buyer's side of the thread.** Jett found the slides
hard to follow with one side of the chat, so they quote the buyer too, word for word from Matt's
screenshots and never by name, and only these lines: "I will try my level best to pick it up
tonight", "I will message you before coming. I will most definitely pick it up between 8 to 10 pm",
"Hello I am on my way", "Will be there by 9:25", "Please confirm your availability", "Hello?", "???"
and "I am at your location". The rest stay out: one carries a money figure, and the angry ones would
put a private person's grammar on show. The order the slides draw holds. The 9:38 PM screenshot runs
from 7:27 to "???" with nothing from Matt's account after 7:27, and "Yep I'm here!" is in neither it
nor the 9:39 PM one, which starts at the buyer's photo of the door, so it came after "???" and before
"I am at your location" and the rating. The slides also quote the agent's 10:28 line "Worse, my
auto-reply told him "Yep I'm here!" at 9:27 when you clearly weren't available, which is on me." The
photo on them is a credited stock photo of a phone on a table whose blank screen carries that
exchange, retyped word for word; two earlier picks (a building at night, then a keyboard) were dropped
the same day as ominous or meaningless.

**Superseded 2026-09-29 for the social posts.** At Jett's direction they became a made-up example
that names nobody (a bike sold over texts, one yes at noon, "Coming down now!" sent while you are
out), labeled "A made-up example" on the images and in every caption, and they quote none of the
above. Muse is not in them either: a real product beside an invented story reads as that product's
incident. Archie's slide is the texts lane's own card (`texts/replies/card.rs`: "Text from", "Your
reply (sends as you, to ...)", Send / Edit it / Dismiss), and the posts point to the July post. The
blog post above is now the only place the Marketplace story is told.

⛔ **What no page may say:**
- That Muse sent anything without permission, stated as fact. Matt says the price was one "I never
  approved"; Meta says similar reports turned out to be approved. Nobody has published the record.
- How it happened. Moneywise reports the agent saying the pickup location "was in the auto-reply
  template you approved when we set up the marketplace replies"; no screenshot of that was found, so
  it is secondhand and does not ship. Mashable's "did not ask him about the sale until the buyer had
  already shown up" is its paraphrase, not Matt's words.
- The buyer's name, anywhere, including this file and commit messages. A private person in somebody
  else's screenshot.
- The wording of the apology. Matt's 9:39 PM screenshot does show it, sent at 10:27 PM (read later on
  2026-09-28, after this line first said no screenshot did). It stays out anyway: its excuse for the
  no-show is one the agent gave in Matt's name, and nobody has confirmed it.
- That the agent told Matt nothing until 10:28. Its chat shows an earlier heads-up.
- Any sentence making Muse careless or unsafe in general, or Archie safer in general. The contrast is
  one design choice, sourced on both sides.
- Money figures from the screenshots (the listing and the offer). None is in FACTS.md, none is needed.
- A Meta or Muse mark, per the logos note. The aggregator's images are theirs and are not reposted.

⚠️ **Re-read for this post, and two older rows that did not re-read.** The Cowork row citing
`support.claude.com/.../13364135` for connector tools being "Always allow, Needs approval or Blocked"
no longer matches that page, which now carries the modes ("Skip all approvals", in which "nothing
checks its actions") and not the connector wording; Cowork's middle placement stands on the modes.
The Vellum row's grants "once, for ten minutes, or always" were not found on the permissions page
either, though its trust rules (row above) make the same point. No served page prints either clause.

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

**The hub leads with a short ownership overview, 2026-10-01.** At the user's request, the opening
now says "Own your agent without writing code", followed by four groups of alternatives.
The existing eleven-agent binary, its full claim, scoped approval explanation and default
provider-egress clause remain together in the expandable detailed comparison. Its count and
egress clause still supply `check-claim-drift.py`; the ownership overview does not claim that
Archie's software license becomes perpetual when a subscription ends.

**The hub was cut to the binary, 2026-09-18.** Jett's direction: cut every sentence another
of the nine could say unchanged, put the one line all nine fail where the reader lands first,
and make the binary do the selling. The line is the h1 on `compare/`: ten agents, and only
Archie works on your own computer and asks first, with no off switch. It is the
chart's own finding read as two yes-or-no questions, and a figure under the h1 sorts the ten
marks by them: six leave at whose computer (Symphony by the reading above), three of the four
on yours leave at whether asking your permission is a setting (Jett, the same evening: "asking as a
setting" alone is vague, so the page says permission and the two answers are "can be turned off"
and "no off switch"), and Archie is what is left. Every sentence
about us that OpenClaw, Vellum or Hermes could have printed unchanged (your computer, your
account, at cost, a shelf, a skill written on request) came off the page; the concessions
stayed, one line each. **One sentence retired with the old prose, and it stays retired:**
"every other agent on the board that asks can be told to stop asking." Symphony and Norton
publish no setting either way, which is why the chart places them at Archie's own level (and,
since 2026-09-27, Muse and Grok Bot on the same reading), and the sentence contradicted the
drawing above it. The two-question form never needs it: those
two leave at the first question, and the second is asked only of the four on your computer,
where it is true of all three. `compare/symphony/` merged into `compare/cloud-agents/` the same
day (zero body inbound links, the product already named 31 times on the destination) and is a
redirect stub; its one point the destination lacked, that Symphony is built for a phone first,
is a clause there now.

**The h1 was cut from 24 words to 18 on 2026-09-21** (Jett: the title is too long), and two
things about the cut are the rule for any later one. "Archie is the only one that works"
became "Only Archie works", which says the same thing in four fewer words, and
`check-claim-drift.py` reads both forms now so the wording can move without an edit there.
But "asks your permission first" became "asks first", and **the word permission has to stay
on the page**: the lede directly under the h1 and both questions in the figure still say it,
which is what Jett asked for on 2026-09-18 when "asking as a setting" alone read as vague.
The tail cannot go at all. The sentence sorts ten agents onto "your own computer" and three
of the other nine are there too, so the h1 is true only because it asks two things of the
one agent left. Cutting it to the first clause would be a false claim, not a shorter one.

**The egress clause moved from that figure's band to that figure's caption, and it is still
required** (Jett asked for the band off on 2026-09-18, the sort figure being the third thing on
that screen to carry the sentence, after the caption and the chart under it). CLAUDE.md's visual
rule 5 allows either: "The limitation belongs in the figure or in its caption." So the caption
now ends "All ten send your words to an AI company's computers by default", and the sentence has
to survive any later edit of that caption. A drawing that sorts ten agents onto "your computer"
with no egress clause anywhere on it is the banned claim in pictures, whichever of the two places
carries it.

---

## Change Process

1. A new claim requires a pointer to the code path that makes it true. No pointer, no claim.
2. A claim whose code path is deleted or changed is **dead** until re-verified. Ripping out a
   feature means ripping out its copy in the same PR.
3. Re-run the full egress audit before any launch, funding round, or press push. The audit is
   the only thing standing between us and a claim that quietly went stale.
4. The owner named at the top has veto. Not consensus — veto.
