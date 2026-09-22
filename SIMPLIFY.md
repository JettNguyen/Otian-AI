# SIMPLIFY: one clear site for someone who has never heard of an AI agent

Audit written 2026-09-21 by the Fable session, for the Opus session that makes the changes and
for Jett to approve the decisions in the first section. Every number here was measured on that
day with `scripts/check-copy-length.py --report` and a scratch extractor that reads each page's
`<main>` in order and counts words per paragraph. Re-run the report before trusting a count.

The brief, in Jett's words: too many sections and pages, hard to find things; someone with no
prior knowledge of AI agents should know exactly what we do without being talked down to; no
big visual chunks of text, nothing daunting, easy to follow.

## The diagnosis in one paragraph

The word budgets are working page by page: every budgeted page is under its ceiling. The problem
is between pages. A visitor can meet 36 substantive pages carrying 58,171 words (blog posts,
the legal pages and the catalog not counted), reached through a top bar of five menus and 23
rows, and the same ten facts are told on ten to nineteen pages each. The four things a newcomer
wants (what is it, what does it do for me, what does it cost, how do I get it) each live on four
to six pages, every one restating the others. So the fix is not another round of trimming
paragraphs. It is fewer pages, one owner per fact, one name per concept, and a top bar a
first-time reader can hold in their head.

| What the site carries today | Count |
|---|---|
| index pages on disk | 95 |
| redirect stubs among them | 20 |
| substantive visitor pages (no blog posts, legal, catalog) | 36 |
| words on those pages | 58,171 |
| top-bar rows (5 menus) plus the CTA | 23 |
| pages saying "Archie is in testing" | 19 (33 times) |
| pages linking to a status box that says only "Archie is in testing" | 16 |
| pages quoting $250 an hour | 10 (24 times) |
| pages describing a free call | 14 (47 times) |
| different terms on the selling pages for the AI account and the company behind it | 10 |

## What Jett decided, and what shipped (2026-09-21)

All seven were answered the same day the audit was written, and the work below is done. Where
the outcome differs from what this file first proposed, the reason is written beside it.

| # | Decision | Answer | Shipped |
|---|---|---|---|
| 1 | Which page carries the product story | The homepage | Personal 1,271 to 939, Business 1,104 to 845, both mirrored |
| 2 | Top bar | Four menus, Add-ons and Trust as plain links, Trust across the top | 15 rows where there were 22 |
| 3 | Services | One row, "Work With Us", under About | Its three anchor rows retired |
| 4 | Archie Mobile | Keep the row and the page; the page says coming soon | Eyebrow reads "Coming soon"; no date invented |
| 5 | The Otian Standard | Footer only | In the About column, beside its PDF |
| 6 | The button | "Join the Waitlist" everywhere it goes to the questionnaire | Nav bar and drawer; 94 "Get Started" gone |
| 7 | FAQ | Keep all 32 questions, cap every answer | 3,868 words to 2,147, no question dropped |

Three pages merged away and are redirect stubs: `archie/business/install/` into the one install
page, `skills-marketplace/what-is-an-add-on/` into the Browse hero, and
`skills-marketplace/commission/` into Work With Us. Jett's steer on the last one was that the
whole services side should be "cleaned up to be straightforward and easy to understand" with
"minimal loss of detail", so Work With Us now opens on three ways to work with us and every
step of all three survives; what came off was the restatement.

**Where the outcome differs from the plan in this file.**

- **How It Works is 1,162, not 800.** The 800 assumed the kit moved to `archie/install/`. That
  page is `noindex` and off the menus on purpose while Archie is in testing, so moving the
  answer to "what do I need" onto it would have hidden it from search and from four inbound
  links. The kit stayed, the prose around it was cut, and both equipment lists went behind a
  fold: the reader now opens them instead of walking past them.
- **Trust is 5,150, not 3,000.** Nine of its longest paragraphs were rewritten in place and the
  h1 now says what the page is, but no claim was moved to `trust/details/`. Every sentence there
  is TRUST.md-governed, and moving one between pages is the kind of edit that has produced the
  drift incidents that file records. The remaining work is real and is written up below.
- **Work With Us is 1,050, not 950.** It absorbed a third page. Three pages in at 1,405 words
  combined, one page out at 1,050.
- **The FAQ's longest answer is 84 words, not 60.** Twelve answers sit between 62 and 84. Every
  one is a single paragraph with a link, and the ones still over are the privacy and pricing
  answers where cutting further means cutting a claim.

**Still open, in the order worth doing them.**

1. **Trust and its long companion.** Move "Taking access back", "Taking your agent with you" and
   the crisis section's history to `trust/details/` under their own anchors, which is the split
   Jett approved and the only remaining way to get the short page near 3,000.
2. **`skills-marketplace/browse/` is 41,498 words**, the largest thing on the site by a factor of
   six. It is generated from the catalog, so the fix is in the Archie repo's add-on copy, not
   here. Nobody has read it end to end.
3. **`ai-explained/` at 5,530 and `help/` at 2,582** are reference pages doing their job, but the
   glossary is the page `llms.txt` points machines at and deserves a read.
4. **`check-faces.py` fails** on seven add-ons the Archie catalog gained (class-planner,
   flight-check-in, my-classes and four routines). That is an Archie-repo sync, not site work,
   and it was failing before this pass.
5. **`check-styles.py` fails** on 36 flagged lines, all of them pre-existing and none of them in
   the CSS this pass added. Verified by running the check against the stylesheet as it stood
   before the first commit.

## 1. What a first-time reader meets today

The top bar reads: Archie ▾ (For Personal, For Business, How It Works, Archie Mobile, Pricing),
Add-ons ▾ (What an Add-on Is, Browse All, Build One), Services ▾ (Working With Us, Guided
Setup, Consulting, Have an Add-on Built), Learn ▾ (AI Explained, Comparisons, Blog, FAQ,
Troubleshooting), About ▾ (Our Story, Testimonials, Contact, What We Can and Can't See, The
Otian Standard), then Get Started.

What is wrong with it for a newcomer, row by row:

- Three rows in the first menu answer "what is Archie" (For Personal, How It Works, and the
  homepage behind the logo), and nothing tells you how they differ. They do not differ much;
  see section 4.
- "Add-ons" is a word the reader does not have yet, and the first row under it exists to define
  it. A menu that needs a glossary row is a menu carrying a concept the homepage should have
  planted. "Build One" is for developers, whose spec "is still coming together".
- Services is our time at $250 an hour. Filing it beside the product makes a first-time reader
  ask whether this is software or a consultancy. Two of its four rows are anchors on one page.
- Learn mixes a reference glossary, a support page for people already running Archie
  (Troubleshooting), and the comparisons, which carry the site's sharpest claim two levels
  down.
- About hides Trust under a label nobody scans for ("What We Can and Can't See") on a site
  whose product is trust. Trust is the second most linked page in body copy (24 pages).
- "Get Started" goes to a chat-style questionnaire whose first question is "who would your
  agent work for" and whose second is a choice of waitlist, guided setup or consulting. That
  is honest, but the label promises you can start.

Where the four answers live today, and where each should live (one owner per fact):

| Question | Told today on | Owner after |
|---|---|---|
| What is Archie, what does it do | home, personal, how-it-works, FAQ 1, browse hero | home (story), how-it-works (mechanism) |
| What does it cost | home band, pricing (three tellings), both edition forks, how-it-works item 3, services, FAQ 10 to 15, every comparison | pricing; one line plus link everywhere else |
| What do I need | how-it-works (three sections), install, FAQ 27 and 32, personal "getting started" | install (the full kit), how-it-works (three chips) |
| Can I trust it | trust and its three siblings, home, personal, business, install, FAQ 16 to 21, every comparison | trust; TRUST.md's one-sentence forms elsewhere |
| Where does Archie stand | 19 pages, 33 times, all pointing at a two-sentence box | one status section, dated, drawn from `archie/releases.json` |

## 2. Vocabulary: one name per concept

The single biggest source of "I do not understand this" for a newcomer is the AI account. It is
the thing that makes the free tier free and the privacy claim true, and on the eleven selling
pages it is called: AI account (31), AI company (44), AI key (12), your key (9), own key (8),
provider (13), AI provider (5), API key (3), tokens (4), endpoint (2). A reader cannot know
these are one thing. The homepage's hero uses "your own AI account" in its fourth sentence and
defines it in the pricing band, a thousand words later, in a 75-word paragraph.

The rule to apply everywhere outside Trust and the proof page:

| Say | Never, on a selling page | Why |
|---|---|---|
| your AI account | your key, own key, AI key, API key, tokens, credential | the key is how the app connects; the account is what the reader opens and pays |
| the AI company (Anthropic, OpenAI, Google and four more) | provider, AI provider, endpoint | provider is jargon; endpoint is for the one line on Pricing that says you can name your own |
| your plan | license, license check, license note | license reads as legalese; the plan is what they bought |
| whose computer, what we can and can't see | custody (10 uses on selling pages, including the CTA "Read the Custody Receipts") | internal vocabulary leaking out |
| free credits | starter credits | two names, one thing |
| the plan with the AI included | AI-included plan | same |
| a job (one piece of work: a reply, a routine run) | a job with no gloss | "20 jobs a day" is in the hero; the four-word gloss travels with the number the first time it appears on a page |

Define "AI account" once on the homepage at first use, in one line under the hero CTA: "An AI
account is a pay-as-you-go account you open with an AI company. They bill you for the thinking.
We add nothing." That replaces the 75-word paragraph in the pricing band.

Two more mannerisms worth a sweep. "quietly" appears 58 times on the visitor pages, catalog included, and has become a
tic; keep it where it is literal (the agent stays quiet) and cut it as decoration. "None of it
is hard" is a heading on the homepage and a lede on the business page.

Talking down is mostly absent (zero "don't worry", no "it's that simple"). The spots that do
it, all salesman voice or analogy: the commission hero ("Every easy AI tool is easy because
it's limited"), What an Add-on Is ("You're not doing this alone", "Think of it like
onboarding", the Hevy workout example), FAQ 1 ("Think of it as a personal helper"). The plainest
definition of an agent on the whole site is inside the questionnaire, where nobody reads it:
"An agent is AI that does tasks for you, like sorting email, rather than just answering
questions." Put that sentence on the homepage.

## 3. Boilerplate to remove site-wide (mechanical, no decisions needed)

- **The status sentence.** "Archie is in testing. The waitlist hears the day it opens. See
  where it stands →" is on 19 pages, often twice (hero and CTA), and its target
  `archie/personal/#status` is a box that says the same thing. Build one real status section
  (on Pricing or Install: what ships today, Mac and Windows testing builds with the version and
  date from `archie/releases.json`; what does not, paid signup and the phone app; what the
  waitlist gets you). Point all 16 links there. Every other in-body status sentence goes; the
  waitlist button is the status. `js/questionnaire.js` links `../archie/#status`, a redirect
  stub that drops the hash: fix it in the same pass.
- **$250.** Ten pages. Owner: Work With Us and Pricing. Everywhere else, "with us beside you"
  plus a link.
- **The free call.** Fourteen pages, 47 mentions. Owner: Work With Us, Contact, the
  questionnaire.
- **The custody sentence.** Eight pages carry the long form. Selling pages carry TRUST.md's
  one-sentence approved form plus a link; Trust carries the full one.
- **"Two people", "Jett or Jack".** Thirteen pages, 25 mentions. Keep on Our Story, Contact and
  the Standard. Elsewhere it survives only where it carries a remedy or a trigger, per the
  smallness rule in CLAUDE.md.
- **The chat-app roster** (Telegram, Discord, Slack, Matrix, iMessage) is typed on 10 pages.
  Owner: How It Works and the connections band; elsewhere "the chat app you already use".
- **One CTA label** (decision 6). The 94 "Get Started" buttons are the nav CTA on every page, bar and
  drawer, so this is the nav script's job.

## 4. Page by page

Targets are words of body copy as `check-copy-length.py` counts them. Where a page is under
budget already, the budget still comes down to the new count with the arithmetic written
beside it, the way every other change to BUDGETS has been.

| Page | Today | Target | Verdict |
|---|---|---|---|
| index.html | 1,070 | 950 | keep the stage; cut two duplicates and the AI-account paragraph |
| how-it-works/ | 1,334 | 800 | keep the mechanism; move the kit to install |
| archie/personal/ | 1,271 | 550 | edition page (decision 1A) |
| archie/business/ | 1,104 | 550 | edition page, mirrored |
| archie/pricing/ | 2,973 | 2,200 | every number once |
| archie/install/ | 560 | 900 | absorbs the kit and the business install page |
| archie/business/install/ | 328 | stub | merge into install |
| archie/mobile/ | 1,385 | 1,300 | leave; one paragraph to a list |
| services/ | 995 | 950 | absorbs commission; loses nothing else |
| skills-marketplace/what-is-an-add-on/ | 644 | stub | its three cards move to the browse hero |
| skills-marketplace/commission/ | 410 | stub | merge into services |
| skills-marketplace/for-developers/ and submit/* | about 600 | 550 | keep, footer only |
| skills-marketplace/find/ | 177 | 177 | keep |
| testimonials/ | 883 | 400 | the quote stays; the four card walls go |
| our-story/ | 1,090 | 700 | bios to one line each |
| contact/ | 423 | 200 | four facts, then the form |
| faq/ | 3,868 | 1,200 | decision 7 |
| help/ | 2,582 | 2,500 | keep, footer only, becomes the support hub |
| trust/ | 5,476 | 3,000 | short page; the long paragraphs move to details/ |
| trust/details/ | 2,125 | 3,000 | the one long version |
| trust/proof/, trust/it-review/, security/ | 3,887 | same | leave |
| compare/ | 1,952 | 1,400 | one figure, shorter h1 |
| compare/cloud-agents/ | 3,600 | 2,400 | drop the bolted-on per-unit table |
| four other comparisons | 914 to 1,170 | same | leave, minus the status sentence |
| standard/, privacy, terms, ai-explained/, blog | | same | reference, leave |

Details, in the order a newcomer meets them.

### index.html (1,070 → about 950)

Keep the day stage, the why-Archie gate, the connections band, Patrick, the pricing band.

- Hero: "It is free on your own AI account: 20 jobs a day, no card" is the first use of both
  terms. Add the one-line definition of an AI account under the CTA (section 2) and the
  four-word gloss on job. Three small lines under one button (for one person, running a team,
  in testing) is a lot; the in-testing line goes once the status has a home.
- Cut "Ask your agent what you would ask any AI chat" (66 words). The same paragraph is on How
  It Works word for word, and the stage's second act already shows asking. One sentence in
  the act 2 caption if anything.
- Pricing band: the 75-word AI-account paragraph becomes the hero line above. The 47-word
  footnote under the Business card ("On the $30 plan, what we charge does not move…") is
  Pricing's sentence; cut.
- Closing CTA: three sentences (questions reach Jett or Jack, guided setup starts with a free
  call, watch the demo) become one line and the button.

### how-it-works/ (1,334 → about 800)

Ten sections today, three of them about hardware. After: hero, the handover (phone with seven
things), what it hands you (one line), the moving parts figure, three chips for what you need,
the five steps with the recording, CTA.

- Cut the duplicate "Not every question is a job to hand off" paragraph.
- "A file on your computer, not text to copy out" (66 words plus a figure) is a detail; keep
  the figure and its caption, cut the 45-word allowlist paragraph (Trust has it).
- Under the moving-parts figure, the 64-word paragraph restates the caption and the custody
  clause; keep the one-sentence exception ("the free credits reach Anthropic through a server
  of ours") because TRUST.md requires it wherever the figure implies otherwise, and cut the rest.
- **Move to install:** the four need-items (their two BIG paragraphs, 70 and 80 words, are
  Pricing's free-tier and AI-bill sentences), the kit picker, and both "not needed / worth
  having" lists. In their place, three chips: a computer that stays on, an AI account, the app.
  Repoint the `what-you-need/` stub and the four body links (home, personal, business, FAQ).
- "On your own, or with us beside you" (42 words, also on personal) becomes one line under the
  steps.
- The five steps stay as they are; they are the page's most concrete words.

### archie/personal/ (1,271 → about 550) and archie/business/ (1,104 → about 550)

Under decision 1A both become edition pages, mirrored, changed in one commit. What each keeps:
hero (one sentence), "Which one is this?", its scene (drafts, ring of phones) with caption, its
picker (six lives, four roles), the ceilings section, one custody sentence with a link, one CTA.

Personal cuts: "The idea" (a restatement of the homepage hero plus a three-step figure that
duplicates How It Works' moving parts); "Building your agent" (five parts and a 60-word backup
paragraph; this is How It Works' step 3 and Trust's record section); "Getting started" (the
services fork again); the 50-word limits paragraph under the picker (one line, the gate is on
the homepage). "This is Ember" stays: it is the one place Ember is defined.

Business cuts: the 51-word "shaped to each role" paragraph (the caption says it); the 65-word
data paragraph and the 75-word backup paragraph (Trust and Pricing own both; one line each);
the Consulting section (57 words) and the guided-setup section with its three price cards
(about 160 words retyping $250, $99 and the AI cost) become one line: "Rather have us set it up
with your team? Work With Us →". Its closing CTA becomes the waitlist, with the free call as
the line under it.

The budget comment for both already records the picker arithmetic; write the new numbers
beside it.

### archie/pricing/ (2,973 → about 2,200)

The budget note says a cut here reads as a hidden fee. That protects the numbers, not the
number of times each is typed. Every figure below is still on the page once.

- The 66-word plans lede becomes 30.
- The free tier is told twice: the Free card (five bullets, about 150 words) and "2 ways to use
  Archie for nothing" (the lanes figure and two prose cards, about 250). Keep the second as the
  explanation, cut the card to three bullets that link down.
- Cut "Running Archie yourself" whole: its first card says "that is the plan above", its
  second is a bullet every plan card already carries, its third is the lede of the AI-cost
  section. Keep two of its trailing sentences (launch excludes the EEA, UK and Switzerland;
  some add-ons reach services with fees of their own) as two lines in the plans section.
- AI cost: keep the three tiles, the range sentence and the fold. The 110-word "spends in three
  places" paragraph becomes a three-item list (you typing: two thirds to nine tenths; scheduled
  reports: a tenth to a third; mail it reads: under a tenth). Inside the fold, the 151, 85, 103
  and 73-word paragraphs stay as facts but become the labelled list they already almost are,
  each item under 60 words.
- Guided Setup (two cards and a 53-word lede) becomes one line and a link.
- Cut "Put Archie next to the alternative" (four paragraphs): the hiring comparison owns it.
- The closing CTA says "in testing" twice; once.

### archie/install/ (560 → about 900) absorbing archie/business/install/ (328)

The business install page is three paragraphs whose whole content is "read it on the other
page". One install page: two download blocks (Personal, Business, one line on how they sit
side by side), then what you need (the four items, cut to one short paragraph each, no prices),
the kit picker, the not-needed list, the Windows warning once, keys in one line with a link to
Trust (today 160 words that Trust carries in full), help once. Stub the business URL.

### archie/mobile/ (leave)

Jett's mockups and a sourced table. Two edits only: the 75-word "Sealed" paragraph becomes 45
words and the three bullets already under it; the status sentence goes with the sweep.

### services/ (995 → about 950) absorbing skills-marketplace/commission/ (410)

The page is well built: two forks, three steps each, the free-call list, "what this is not".
Add a third short section, "Have an add-on built", from commission: three lines for the three
steps and one sentence on why (every one we build becomes a listing). Drop commission's
63-word hero (salesman voice), its three kind cards (browse has the kinds) and its "why we work
this way" pair. Stub `skills-marketplace/commission/` to `services/#commission` and update the
eight body links that reach it, since our own links never go through a stub.

### skills-marketplace/ (browse, what-is-an-add-on, find, for-developers, submit)

- **What an Add-on Is → stub.** Its three kind cards and the three-plug figure move into the
  browse hero as a short strip: "An add-on is one job you hand your agent. Three kinds: a skill
  (something it can do), a routine (something it does on a schedule), a personality (how it
  talks to you)." Everything else on the page is a second, third and fourth way of saying that
  (the onboarding analogy, the Hevy example, the day-to-day examples, the three-step how-you-
  get-one). The browse page is generated, so the strip lives in `scripts/gen-marketplace.mjs`.
  Keep the count at three kinds; the CLAUDE.md note about not "fixing" it to four still holds.
- **Find** stays as it is. It is already linked from the browse hero.
- **For Developers and the submit forms** stay, footer only. Cut the 61-word hero to 35.

### testimonials/ (883 → about 400)

Patrick's words carry the page now. The four "What a well-built agent actually does" cards are
the biggest walls on any selling page (95, 71, 60 and 76-word "How:" paragraphs) and each
describes an add-on that has its own catalog entry. Cut each card to its "what leaves your
week" line and a link to the catalog card, or drop the section, since the personal page's
picker does the same job. The 84-word "note on how this page works" becomes 30.

### our-story/ (1,090 → about 700)

The founders' bullet lists read as job descriptions ("Leads sales end to end", "Owns the
roadmap"). One sentence each. The 61-word "we met as coworkers" paragraph becomes 35. The three
value cards repeat the Standard; three one-liners or a link. The LinkedIn thread stays: it is
the one memorable thing on the page.

### contact/ (423 → about 200)

Four facts, one line each (a person within one business day; you reach the people who build
Archie; support costs nothing; either founder can spend up to $500 putting a mistake right),
one link to the Standard, then the addresses and the form. Today those four are 45 to 65-word
paragraphs restating the Standard, and "Primary contact" is printed twice.

### faq/ (3,868 → about 1,200; decision 7)

Thirty-two questions. The ones a first-time reader asks, about a dozen: 1, 2, 11, 13, 14, 15,
17, 18, 19, 20, 21, 25, 28 (16 folds into 17; 23 and 24 fold into 1 and 25). Questions 4 to 6
are objections the comparisons handle; 7 to 9 are add-on philosophy ("why can't I make one
add-on that does everything"); 3, 10, 12, 22 and 26 are tagged Guided Setup and move to Work
With Us; 27 and 32 are the kit and move to Install; 29, 30 and 31 are in-app choices and move
to Help. Every surviving answer under 60 words with one link, because today the six accordion
groups run 228 to 910 words each.

### help/ (leave; footer only)

The best-structured long page on the site: each item is what you saw, what is happening, how
to check, what to do. It is for people already running Archie, so it leaves the newcomer's
menu and becomes the footer's Help link, and it takes the five practical FAQ questions. The two
66-word intro paragraphs become one.

### trust/ (5,476 → about 3,000) and trust/details/ (2,125 → about 3,000)

Trust is the page every selling page sends the reader to, and it carries 35 paragraphs over
50 words, the two longest at 133 and 127. Its structure is right; its paragraphs are walls,
and three of its ten sections are on details/ as well, two of them at full length (the
10-minute check and the marketplace) and one in both a short and a long form (where we fall
short), which is the worst of both. The cut is placement only: every claim stays in TRUST.md's wording, and the short page
links "the full version" as it already does.

- The three answers under "the awkward part": 77, 100 and 216 words become at most 45 each.
- "In their own words": seven companies, entries up to 104 words, become one table (company;
  trains on what you send; their one quoted line; link). The xAI and DeepSeek cautions survive
  as their rows' notes.
- The outbound-connections table stays; its 144, 121 and 114-word cells lose their second
  halves to details/.
- "The one part that crosses somebody else's servers": two sentences and a link to Mobile.
- "Where we fall short": six items at 90 to 127 words each, every one already carrying a
  "full version" link. At most 40 words each.
- "If you tell your agent you are in trouble": keep the first paragraph (the rule and 988).
  The history and the "three things it is not" move to details/.
- "On your computer": keep the interactive chain and a 40-word intro; "Taking access back"
  (115) and "Taking your agent with you" (133 and 101) move to details/ under their own
  headings.
- "Check for yourself": keep the four steps; the paragraphs under steps 3 and 4 (62, 126, 56
  and 72 words) become the host list plus one line each.
- "An add-on is a text file": caption plus 40 words; details/ already has the long version
  under "Why an add-on can't reach your files".
- Swap the h1 and the nav label: the nav says "Trust", the h1 says "What we can and can't
  see". Today the h1 is "The question you're actually asking", which a newcomer cannot parse.

### compare/ (1,952 → about 1,400) and compare/cloud-agents/ (3,600 → about 2,400)

The hub's h1 is 22 words, followed by a 56-word lede, then the same claim in two figure
captions and a 118-word paragraph explaining the axes. Keep the quadrant (the one Jett reads
fastest) and make the two-question sort its default view or drop it; h1 under twelve words;
the axes paragraph becomes its caption. "Five things they do that Archie does not" stays.

Cloud-agents: the 122-word short answer becomes 50 (the two desks and the two lists carry it).
The second table, per-unit prices for Lindy, Zapier Agents, Copilot Studio, Salesforce and
Claude Code, compares products the page does not name in its title; its one useful sentence is
already in Pricing's AI-cost fold, so the table and its 151-word reading note go. The 96-word
prices paragraph becomes 40; the 80 and 141-word "where renting wins" items 40 each; the
167-word Symphony paragraph 60.

The four other comparisons are already the tightest pages on the site and share one skeleton.
Only the status sentence comes off them.

## 5. Rules for the rewrite, so the cuts hold

1. On a selling page no paragraph runs past 45 words, and a section is a heading, at most one
   short paragraph, and then a list, a figure or a control. RESTYLE.md rule 5 already says this;
   the audit found 40 paragraphs over 50 words on selling pages, so it needs enforcing. Worth
   adding to `check-copy-length.py`: report, and on budgeted pages fail, any `<p>` over 60 words
   outside `<details>`, `<figcaption>` and `<td>`.
2. One owner per fact (the table in section 1). Any other page gets one sentence and a link.
3. Reference pages may be long but never dense: lists, tables, folds; paragraphs under 60 words;
   sources stay in folds.
4. One name per concept (section 2). Sweep with grep before and after; the words to hunt are in
   the table's middle column.
5. One CTA label (decision 6).
6. TRUST.md governs every sentence that moves. Moving a claim between trust/ and details/ is
   allowed; rewording one is not without the file. `check-claim-drift.py` derives the binary's
   count and egress clause from compare/, so that page changes first and the pages carrying
   the binary follow.
7. Editions stay mirrored: whatever comes off personal comes off business in the same commit.
8. A merge is a net cut: write the old count, the new count and the difference beside each
   budget you touch.

## 6. Order of work for the Opus session

1. **Section 3 sweeps first** (status sentence, $250, free call, custody form, two people,
   roster, vocabulary). They are scripted find-and-replace across pages, they need no
   decision, and they shrink every page before any page is restructured. Run `check-facts`,
   `check-claim-drift`, `check-pronouns`, `check-copy-length` after.
2. **The status section**: build it once, point the 16 links and `js/questionnaire.js` at it.
3. **The nav** (decisions 2 to 6): one script, three edit sites per page across 72 pages;
   `check-nav.py` after, and remember the page a change is merging into is the one the sweep
   misses. Bump the asset version if `js/nav.js` changes; `check-asset-versions.py`.
4. **The merges** (business install → install, commission → services, what-is-an-add-on →
   browse): stubs, every inbound body link repointed, `check-links.py`, `gen-discovery.py`
   (sitemap, robots, llms.txt), and `gen-marketplace.mjs` for the browse hero. Recheck
   `llms.txt` by hand: its section "Add-ons" names both retired pages.
5. **Page cuts** in the order a newcomer meets them: home, how-it-works, pricing, then personal
   and business together, install, trust and details together, FAQ and help together, then
   the rest. One page per commit, `check-copy-length`, `check-figures`, `check-pronouns` each
   time; budgets down to the new count with the arithmetic beside them.
6. **After every pass**, read the homepage, How It Works and Pricing end to end as someone who
   has never heard of an agent. That read is the check no script runs. Jett's five tests apply:
   clear, useful, trusted, memorable, consistent.

## 7. Things found on the way that are bugs, not layout

- `js/questionnaire.js` links `../archie/#status`; `archie/` is a redirect stub and the hash is
  lost on the way.
- The status box every page points at (`archie/personal/#status`) contains only the sentence
  the link already said.
- The personal page and How It Works each carry "On your own, or with us beside you" as an
  H2, word for word; the business page has its own version of the same section.
- The homepage and How It Works carry the "Not every question is a job to hand off" paragraph
  word for word.
- Trust and Trust: The Long Version both carry the 10-minute check and the marketplace section
  at full length, and the "where we fall short" items in a short and a long form, with the
  "full version" link between them.
- The nav CTA is "Get Started" on 94 pages for a product that is not for sale.
