# TRUST.md — What Otian AI Is Allowed To Claim

Trust is the product. This file is the contract that keeps it true.

Every privacy or safety claim on otianai.com must appear below, in approved wording,
with a pointer to the code that makes it true. If a claim isn't here, it doesn't ship.

**Owner: Jett.** Jett owns technical processes; Jack owns business ops and marketing.

That split is the point. The person who knows what the code actually does holds a **veto** over
the person who writes the copy — not a seat at the table, a veto. If Jett says a sentence isn't
true, it doesn't ship, and there is no appeal to how good it sounds.

**Last verified against the Archie source:** 2026-08-04 (pricing reconciliation, `Archie@main`)

**Reconciliation — 2026-08-04.** **Pricing changed from a one-time licence to a plan**: $149 a
year or $19 a month, both Stripe subscriptions granting the `subscriber` tier. Everyone who bought
the one-time licence keeps the permanent `lifetime` tier and full access, forever
(`crates/archie-core/src/auth.rs`, `verify_access`). Three consequences for this file, all of them
copy the change made false and all of them fixed in the same pass as the code:

1. **"Whether you own Archie" is retired** in the What We Hold wording, everywhere. There is no
   ownership to report any more; the server knows **whether you have a current plan**.
2. **"If you stop paying us, nothing happens to Archie: you already own it" is now FALSE and is
   removed** from `trust/`, `trust/details/`, `faq/`, `index.html` and the Terms. The honest
   replacement, live now: a plan ends at the close of the period already paid for, nothing on the
   person's computer is deleted, and restarting a plan restores access.
3. **"If we disappear, it still keeps working" stays, unchanged and still true.** The Terms
   commitment (a final version needing no sign-in, published within 30 days of ceasing operations)
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
`commands.rs:1744`, not `:1112`.

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
Site copy on business/, faq/, how-it-works/, privacy-policy/, questionnaire/,
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
what we actually hold: your email, whether you have a current plan, and which paid add-ons you
bought."

**Why it's true:** a synthesis of three already-verified claims below — "Your prompts never
touch an Otian server" (`llm.rs:16,18`, `lib.rs:41-48`), "What We Hold — three things"
(`auth.rs:237-244`, `stripe-webhook`), and "We ship no telemetry and no analytics." There is
no Otian datastore of user content for a breach or subpoena to reach.

**Boundaries — do not cross:**
- ❌ Never "no third party ever holds/sees your data." Prompts still go to Anthropic/OpenAI
  (a third party) for inference. This claim is about **Otian** custody, not the provider. Keep
  the provider-egress clause visible wherever this appears.
- ❌ Never say "your data" unscoped — we **do** hold email + license status + paid add-ons.
  Scope it to content: "conversations, files, calendar." The three-things disclosure is the floor.
- ❌ Never "nothing to subpoena." A subpoena to us yields email + license status + paid add-ons.
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
(`crates/archie-net/src/llm.rs:16,18`) — no env var, setting, or flag can redirect them.
The HTTP client is built with no proxy (`crates/archie-net/src/lib.rs:41-48`). The agent
runtime crate contains zero Otian hosts. The webview's CSP (`src-tauri/tauri.conf.json:24`)
forbids the frontend from reaching any host at all.

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

**Approved wording:** "One exception, and it is ours: the free credits you start with are
paid for on our account, so while you are using them your messages pass through our server
on the way to Anthropic. The moment you connect a key of your own, that stops, and nothing
of yours touches us again."

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
- ✅ It is passed through, not kept. `stripe-webhook/index.js:485-487`: nothing there logs a
  request body, a response body, a prompt, or a completion; what is logged is the uid, hashes
  of the device and IP, token counts and amounts. The reply is buffered in memory to read the
  `usage` block that decides the debit, and that is the whole of it. Say "passes through"
  rather than "is stored", and never upgrade this to "we cannot see it": a proxy we operate
  could be changed to log, and the honest claim is that it does not.

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
`heartbeats/{uid}` with three fields, app version, platform and last seen, at most once per
six hours per process (`HEARTBEAT_EVERY`), overwriting the same document. `flush` uploads
queued crash tails to `error_reports` with uid, version, platform, kind, message and build,
capped at 2000 characters, five reports per launch, and nothing whose `crash.log` is older
than seven days (`MAX_CRASH_AGE`). Every string passes the same `Redactor` the gateway logs
use before it is written to disk, so the copy uploaded is the copy the user can read. There
is still no Sentry, PostHog, Amplitude, Mixpanel, Segment or GA in `Cargo.lock` or
`package-lock.json`, the Tauri log plugin is a no-op stub, and the webview CSP still makes
frontend network calls impossible.

**Amended 2026-08-07: there is now an off switch, and it is real.** The app's Account page, under Crash
reports, carries the switch and the full list of what is in one. Off stops the
heartbeat, stops the upload, and stops the queue being written at all; anything already
queued is deleted when the switch is thrown (`telemetry::set_off`, and `is_off` is read at
all three entry points). It is a marker file in the data directory rather than a setting in
the database, because a panic hook mid-crash holds a path and nothing else.

**Approved wording for the switch:** "You can turn both off, in the app, under Account. Off
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

**Approved wording:** "Archie runs on an AI account you connect: Anthropic, OpenAI, Google,
Groq or xAI. You pick, and you can change it later. The free credits you start with run on
Claude, because that is the account we pay for."

**Why it's true:** `crates/archie-net/src/llm.rs` builds requests for all five, and the
provider is a per-agent setting rather than a build-time constant. `TRIAL_MODEL` in
`stripe-webhook/index.js` is an Anthropic model, because the trial spends our Anthropic key.

**Boundaries — do not cross:**
- ❌ Never write "Archie uses Claude" as a bare statement of what the product is. It was in
  the trust page's own headline until 2026-08-07, where it made a page about who holds your
  data say something false about the product in its first sentence.
- ❌ Never list a provider we have not shipped. Five, and the list is in `llm.rs`.
- The five names are a set, not a ranking. Do not imply one is required or recommended
  without saying why, and never imply the others are degraded.

### ✅ The other free trial runs on your own key, so nothing passes through us

**Approved wording:** "The free credits are limited per computer, so if someone has already used
them on yours, a second account cannot have them. There is another way to try Archie: connect an
AI account of your own and you get 14 days, on the same terms as everyone else. Because your key
is paying, your conversations go straight to them, exactly as they do for a paying customer. We
are never in the middle of them."

**Why it's true:** two facts, and the second is the one that carries the privacy claim.

1. A days-only trial is granted with `kind: "own_key"` and no money in it
   (`stripe-webhook/index.js`, `/trial/claim`). It is offered only after the credits have been
   refused for that computer.
2. **A key of the user's own always wins over the trial credential**, and that is what keeps the
   proxy out of the path. `src-tauri/src/commands.rs:3975-3989` resolves in a fixed order:
   Anthropic, OpenAI, Gemini, xAI, Groq, and only then the trial. Anybody on a days-only trial has
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

**Why it's true:** `src-tauri/tauri.conf.json:45` has no substitution placeholders, so the
updater plugin sends a bare GET. Version comparison happens client-side.

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
with 12 add-ons, that checkbox took about four fifths off the monthly cost."

**Why it's true:** `resolve_for` (`crates/archie-runtime/src/gateway.rs:711-718`) is the single
place the model is chosen for a reply. With the flag off it calls `resolve_model`, which lets a
skill's own declared tier win; with it on it calls `resolve_model_forced`, which uses the agent's
dial for every target. The flag is `AgentBundleManifest::force_model_tier`, written by
`agent_set_force_tier` (`src-tauri/src/commands.rs:622`) from the "Use this for every skill"
checkbox in `src/app/agent-detail.tsx`. Web search is bumped to Balanced rather than broken
(`resolve_model_forced`, same file line 699).

**The four fifths is measured, not modelled:** `crates/archie-runtime/examples/cost_bench.rs`
run with `--live --force-fast` against a twelve-skill agent on 2026-08-10. Forced Economy came to
18% of forced Balanced on a warm turn and 21% on a cold one. The unforced dial on the same agent
saved 4% to 7%. Figures and the full dataset: `docs/COST-MEASURED.md` in the Archie repo.

**Required clause, do not drop it:** say that the checkbox also takes the add-ons off the level
they chose. A saving quoted without its trade is a claim we cannot defend.

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
them"), which is unchanged. Both `archie/` and `how-it-works/` previously ran the term AND its
gloss inside one sentence, which is what made those paragraphs unreadable. Use one, and prefer
the plain one outside this document. Still banned either way: "your keys never leave your
computer" (see Banned Phrasings).

### ✅ We keep no per-person record of the free add-ons you install

**Approved wording:** "When you add a free add-on, Archie bumps its public popularity count by
one. That request is signed in as you, so the number can't be faked, but all we ever keep is the
running total. We hold no list of which free add-ons are yours."

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

### ✅ It works while you sleep

**Approved wording:** "It Works While You Sleep" / "works in the background while you sleep."
Used as a homepage proof chip and in the homepage meta description.

**Why it's true:** Routines fire on a schedule, unattended, and deliver their result to the
connected chat (`crates/archie-domain/src/routine.rs:70-100`); Telegram is the default delivery.
The agent genuinely runs and reports without the user present.

**⚠️ Scope guard — do not extend this into a Phase 2 claim.** "Works while you sleep" (background
execution) is true today. "Works while you sleep **and checks in for your approval before it
acts**" is NOT — that is the approval gate, which does not exist. The chip must stay a pure
capability claim. And note the honest tension: the unattended path is exactly where an ungated
agent is most exposed to prompt injection (see the gate section). The claim is true; the risk it
implies is the reason the gate is being built.

### ✅ Add-ons are data, not code

**Approved wording:** "An add-on is a text file, not a program. A Skill is markdown plus
settings. It cannot run code on your computer, because Archie has nowhere to run it."

**Why it's true:** No `std::process::Command`, no shell, no `dlopen`/`libloading`, no WASM,
no JS `eval` anywhere in `crates/` or `src-tauri/`. Tauri capabilities are deny-by-default
(`src-tauri/gen/schemas/capabilities.json`) and expose no shell, fs, or http permission to
the webview.

---

## What We Hold — state all three, always

**Approved wording:** "Our servers know three things about you: your email address, whether
you have a current plan, and which **paid** add-ons you've bought. Not your prompts, not
your files, not your calendar, not a single conversation. We keep no per-person record of the
free add-ons you install."

*(Updated 2026-07-26: was "whether your subscription is active" — false since the one-time
license shipped. Ownership is the `lifetime` tier, checked with no subscription lookup.)*

**Why all three:** Firebase Auth + the Firestore user doc hold email, uid, `access_tiers`,
`subscription_status`, `stripe_customer_id` (`crates/archie-core/src/auth.rs:238-267`). The
Stripe webhook writes a permanent purchase record per paid item — item id, amount, session
id, timestamp (`stripe-webhook/index.js` → `users/{uid}/purchases/{item_id}`).

✅ **Resolved 2026-07-15.** The old falsehood ("the only thing our servers know is whether
your subscription is active") has been removed everywhere and replaced with the three-things
wording above. Now live correctly at `index.html:573`, `archie/index.html:275`,
`archie/install/index.html:186`, `faq/index.html:306`, `business/index.html:223`,
`privacy-policy/index.html:154`, `trust/index.html:296`. **Do not let the shorter,
false form return** — "email + subscription + paid add-ons" is the floor; never fewer.

✅ **Amended 2026-08-06: three became three plus two.** Both of the things this section warned
about arrived, and the old sentence survived both of them for a while, which is exactly the failure
mode it names below.

- **Phone access shipped.** The sealed mailbox between somebody's computer and their phone is a
  fourth item in our custody. We have no key to it, and we **hold** it.
- **Crash reporting and version heartbeats shipped** (`crates/archie-core/src/telemetry.rs`). A
  record keyed to the account ID, carrying the app version, the platform and a last-seen time, is a
  fifth. See the telemetry claim above, which was corrected the same day.

**Approved wording**, now live on the five pages listed above:

> Our servers hold your email address, whether you have a current plan, and which **paid** add-ons
> you've bought. Two more only where they apply: which version of Archie you are running, so we
> know what is still out there before we ever switch one off, and, if you turn on phone access, the
> messages between your computer and your phone, sealed with a key we never receive.

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
  it is also a commercial term), `faq/index.html` and `business/index.html`.
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

### ✅ Calendar changes require your confirmation — SHIPPED, enforced in code (was ⛔ until 2026-07-20)

**Approved wording:** "When your agent wants to change a calendar you've connected — create,
move, or delete an event — it proposes the exact change and applies it only after you approve
it in a later message. Unattended routines can't apply calendar changes at all — they report
what they would make instead of making it."

**Why it's true:** every calendar write is staged, never executed, on the turn that proposes
it (`gateway.rs:2018-2049`). The apply/discard tools are only added to the tool set on a turn
where a proposal is already pending, so the model *cannot* apply a change in the same message
that proposed it (`gateway.rs:1963-1979`; snapshot rule documented at `gateway.rs:1946-1950`).
`calendar_apply_pending_change` applies the staged change verbatim and nothing else
(`gateway.rs:2051-2061`). The unattended routine path returns
`blocked_needs_user_confirmation` (`gateway.rs:2041-2047`) — the 3am-delete exploit chain this
file used to document is closed. Guarded by test (`gateway.rs:4617-4626`).

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

### ✅ Email goes out only when you tap Send — SHIPPED (was 🚧 roadmap until 2026-07-20)

**Approved wording:** "Archie can draft email replies, but it cannot send one on its own. The
draft comes to your chat as a card with Send / Edit / Dismiss buttons, and nothing reaches
Gmail until you tap Send."

**Amended 2026-08-16: Outlook rides the same gate, and the wording may now name it.** Approved
form: "nothing reaches Gmail or Outlook until you tap Send", and "Gmail and Outlook stay
read-only unless you turn replies on". Why it's true: the send path is provider-generic behind
one trait, and the Send button's handler is still the only caller of `send_reply`
(`crates/archie-runtime/src/email/replies/actions.rs:404`, dispatched from the tap at `:68`).
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

**Still true, unchanged:**
- **The agent cannot buy anything.** `archie-runtime` cannot see `archie-core::purchases`;
  purchases require a human in Stripe Checkout.
- **The agent only messages you** — `Channel::send` targets the owner's chat; the inbound
  roster (`access.rs`) governs who may talk *to* it.
- **`remember` is still ungated** — a local write; the persistence vector for an injected
  instruction. Disclose, don't hide.

| Claim | Status |
|---|---|
| "Archie asks before it changes anything in your calendar." | ✅ **True now** (two-turn gate) |
| "Nothing reaches Gmail until you tap Send." | ✅ **True now** (single-caller send path) |
| "Archie cannot spend your money." | ✅ True (and no purchase code path exists in the runtime) |
| "Works while you sleep. Checks in before it acts." | ✅ Defensible now: unattended writes are blocked, reported instead |
| "Every Skill tells you what it can do before you install it — including what it can delete." | 🚧 Still Phase 3 |
| **"Nothing sends without your OK"** (unscoped) | ⛔ **Still banned.** Chat replies and provider web-search queries leave without a per-item OK. Use the scoped calendar/Send-tap wordings above. |

### ✅ One agent answers one person — ENFORCED IN CODE 2026-08-20

**Approved wording:** *"an agent answering you and nobody else"*, *"each one answering you and
nobody else"*, *"only to the one person who paired with it"*. On the Business card, and only
there: *"one agent your whole team can message"*, in the future tense the roadmap rule requires.

A fresh agent is `Claiming`; the first person to send the pairing code becomes its `Owner`, and it
settles into `OwnerOnly` (`crates/archie-domain/src/access.rs`). Guests are the mode above that,
and both doors into it now refuse: `access_approve` and `access_invite` check
`archie_core::plan::may_add_person` before the write
(`src-tauri/src/commands/access.rs`). The invite door has to be checked too and not just the
approve door, because an invite code is redeemed over chat by `AccessRoster::try_join` inside the
gateway, where no command runs; refusing to mint the code is what closes that path.

The gate is the **edition**, not the licence: `archie_domain::product::IS_BUSINESS`, a
compile-time constant. No plan buys a second person, and a personal build cannot be configured
into allowing one. Guarded by `plan::tests::one_person_per_agent_on_every_licence_a_customer_can_hold`,
which asserts it for every paid tier by name, so making this a plan feature breaks a test that
names this file. Staff builds are exempt so the guest paths stay reachable while they are being
developed.

**Boundaries.** This is a product limit, not a security boundary, exactly as the agent cap is: it
counts what is in a roster file on this computer. Do not write it as a guarantee that nobody else
can ever reach your agent; the roster's own fail-closed behavior is the claim that carries that
weight. It also does not apply retroactively: a roster that already had guests keeps them, since
the check is on adding.

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
reach, so it advertises a capability that is not on sale; it was replaced on `business/index.html`
and `faq/index.html` with the one-person wording above. Restore the plural only alongside the
business edition.]*

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
subscription check, within 30 days.* That promise survives any change to the license mechanism,
which means the piracy hole can now be fixed freely without touching the claim.

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
✅ **Do claim:** "If you leave, the app stops. If we disappear, it doesn't." Backed by the Terms.

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
| "The only thing our servers know is whether your subscription is active" | **False.** Also your email and every paid add-on you own. |
| "Fully private" / "completely private" / "100% private" | Unfalsifiable. Means nothing. Say what we hold and what we don't. |
| "Zero data collection" | **False.** We collect your email. |
| "Bank-grade" / "military-grade" encryption | Meaningless. We use the OS Keychain and TLS. Say that. |
| "We can't see anything" | Overbroad. We can see three things. Name them. |
| "Nothing sends without your OK" (unscoped) | Chat replies and provider web-search queries leave without a per-item OK. Use the scoped forms: calendar-confirmation / Send-tap wordings. |
| "Sandboxed add-ons" | Misleading. Add-ons are data, not code — there is nothing to sandbox. The true claim is *stronger*; make it instead. |
| "Your keys never leave your computer" / "keys stay on your computer" | **False.** The key is sent to Anthropic/OpenAI as a request header on every call (`secrets.rs`, `x-api-key`/bearer). The true claim is storage + custody: "keys sit in your system's keychain, where we have no way to read them." |
| "We never hold your data" (unscoped) | Unscoped "your data" is false — we hold email + license + paid add-ons. Scope to content: "We never hold your conversations." Caught 2026-07-20 on the homepage proof chip, and again 2026-08-03 as the `business/` feature-card **heading** — the body underneath stated all three things we hold, but a heading is what gets scanned and the correction sat four sentences down. Check headings, not just body copy. |
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

### Subscription gating

Archie is gated by payment; we do not pretend otherwise. We do not market "runs forever"
and we do not claim a grace period. If the gate is ever made to fail *closed*, this section
gets rewritten and the Trust page's honest-limits section updated the same day.

### ✅ What the AI providers say about training on API traffic (third-party, sourced)

**Approved wording:** the "In their own words" block on the Trust page, quoting or citing each
provider Archie connects to on whether it trains on API data.

**Why it's true / source:** these are NOT Otian claims and have no Archie code path. Each is a
citation of the provider's own current policy, linked inline. Verification status (checked
2026-08-14):
- Anthropic, Google (paid tier), Groq: **verbatim**, pulled directly from the linked policy pages.
- OpenAI, xAI: **accurate summary, not verbatim.** Their sites block automated fetching, so the
  wording is a paraphrase with the source linked; upgrade to a direct quote once the exact
  sentence is confirmed from the source.

**Boundaries — do not cross:**
- ❌ Never state or imply that *all five* providers commit to not training. xAI is the exception:
  its consumer Grok trains by default, and a self-serve API key's status is not clearly its
  enterprise no-train terms. Keep the xAI entry candid.
- ❌ Never drop Google's paid-vs-free caveat: the no-train line is the paid tier only, which is
  what a user's own key uses.
- Provider policies change. Re-verify all five, and re-pull the verbatim ones, before any launch
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
| Grok Bot comes with SuperGrok Heavy at $300 a month or Cursor Ultra at $200 a month (Cursor Teams Premium at $120 a seat also carries it); plan cards read in a browser, since xAI refuses fetches | xAI, Cursor | `https://x.ai/bot` | 2026-08-20 |

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

---

## Change Process

1. A new claim requires a pointer to the code path that makes it true. No pointer, no claim.
2. A claim whose code path is deleted or changed is **dead** until re-verified. Ripping out a
   feature means ripping out its copy in the same PR.
3. Re-run the full egress audit before any launch, funding round, or press push. The audit is
   the only thing standing between us and a claim that quietly went stale.
4. The owner named at the top has veto. Not consensus — veto.
