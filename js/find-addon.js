/* Find an add-on: plain word matching, no model, no network.
 *
 * The whole point of this file is what it does NOT do. There is no fetch, no API key, no
 * model call, and no logging. What somebody types stays in the tab, which is what lets the
 * page say so in plain words. If a future version wants to interpret a description rather
 * than match words in it, that is a different tool with a different privacy line, and the
 * sentence on the page has to change in the same commit.
 *
 * JOBS is hand written and deliberately so. It maps how a person says a problem ("my inbox
 * is a mess") onto what the catalog calls the answer ("Email Replies"), which is exactly the
 * gap the browse page's own search cannot cross: none of those words appear in any add-on's
 * text. Slugs are not names here either (email-manager is "Email Replies", bill-tracker is
 * "Bills & Subscriptions"), so every name below is copied from the catalog rather than
 * derived, and a rename in the Archie repo's data/marketplace has to be mirrored here.
 *
 * Adding a job: put in the words somebody would actually type, not the words we use. "Chase",
 * "nag" and "waiting" earn their place; "workflow automation" does not.
 */

var JOBS = [
  { words: ["inbox", "email", "unread", "e-mail", "mail pile", "reply to emails", "emails"],
    addons: ["Email Replies", "Inbox Rules", "The Right Words"] },
  { words: ["calendar", "schedule", "book a time", "find a time", "double booked", "diary"],
    addons: ["Calendar Manager", "Find a Time"] },
  { words: ["meeting", "meetings", "minutes", "notes from", "recap", "standup", "call notes"],
    addons: ["Meeting Notes", "Meeting Prep"] },
  { words: ["todo", "to-do", "task", "tasks", "forget", "forgetting", "keep track of what"],
    addons: ["Task Manager", "To-Do List (Todoist)", "To-Do List (Google Tasks)", "Commitment Keeper"] },
  { words: ["bill", "bills", "subscription", "subscriptions", "recurring charge", "direct debit"],
    addons: ["Bills & Subscriptions", "Money In & Out"] },
  { words: ["spend", "spending", "budget", "money", "expenses", "savings", "cashback", "credit card points"],
    addons: ["Savings Goals", "Money In & Out", "Card Rewards"] },
  { words: ["invoice", "invoices", "unpaid", "chase payment", "owed", "get paid", "bookkeeping", "receipts"],
    addons: ["Owed to Customers", "Statement Collector", "Clean Books"] },
  { words: ["text", "texts", "sms", "imessage", "messages", "whatsapp"],
    addons: ["Text Replies", "The Right Words"] },
  { words: ["follow up", "follow-up", "chase", "chasing", "waiting on", "nobody replied", "no response"],
    addons: ["Waiting On", "Circle Back", "Commitment Keeper"] },
  { words: ["keep in touch", "friends", "family", "birthday", "birthdays", "anniversary", "lost touch"],
    addons: ["Stay in Touch", "Birthday & Anniversary Keeper"] },
  { words: ["news", "briefing", "morning", "catch up on", "headlines", "markets", "stocks"],
    addons: ["Personal News Briefing", "Market Digest"] },
  { words: ["research", "look into", "find out", "compare options", "dig into"],
    addons: ["Researcher", "Lead-Gen Playbook"] },
  { words: ["write", "writing", "draft", "blog", "post", "wording", "how to say"],
    addons: ["Writer", "The Right Words"] },
  { words: ["client", "clients", "crm", "deal", "deals", "pipeline", "prospect", "sales"],
    addons: ["Client Brain", "Deal Desk", "Engagement & Scoring", "Strategist"] },
  { words: ["lead", "leads", "outreach", "cold email", "new business", "prospecting"],
    addons: ["Outreach Studio", "Lead-Gen Playbook"] },
  { words: ["document", "documents", "paperwork", "filing", "forms", "form", "admin"],
    addons: ["My Documents", "Paperwork", "Form Filler"] },
  { words: ["package", "delivery", "deliveries", "order", "parcel", "returns", "warranty"],
    addons: ["Package Tracker", "Warranty & Returns"] },
  { words: ["house", "home", "maintenance", "boiler", "repairs", "lights", "away from home"],
    addons: ["Home Maintenance", "House Watch", "Home Lights"] },
  { words: ["health", "medication", "prescription", "refill", "doctor", "appointment"],
    addons: ["Health Record", "Medication & Refill Reminder"] },
  { words: ["habit", "habits", "gym", "workout", "exercise", "fitness", "streak"],
    addons: ["Habit Tracker", "Home Workout Coach"] },
  { words: ["learn", "learning", "study", "studying", "course", "revision", "vocabulary"],
    addons: ["Learning Coach", "Course Companion", "Word of the Day"] },
  { words: ["trip", "travel", "holiday", "vacation", "flight", "itinerary"],
    addons: ["Trip Planner"] },
  { words: ["meal", "meals", "dinner", "cooking", "recipes", "groceries", "shopping list"],
    addons: ["Meal Planner"] },
  { words: ["kids", "school", "children", "term dates", "childcare"],
    addons: ["School & Family"] },
  { words: ["price", "prices", "deal alert", "cheaper", "watch for a discount"],
    addons: ["Price Watch"] },
  { words: ["journal", "journalling", "reflect", "diary entry", "how my week went"],
    addons: ["Reflection", "The Honest Week"] },
  { words: ["reading", "books", "watchlist", "to read", "to watch"],
    addons: ["Reading & Watch List"] },
  { words: ["pet", "pets", "plants", "dog", "cat", "watering"],
    addons: ["Plant & Pet Care"] },
  { words: ["car", "mot", "insurance renewal", "service due", "vehicle"],
    addons: ["Car Keeper"] },
  { words: ["github", "code", "pull request", "repo", "issues"],
    addons: ["GitHub Keeper"] },
  { words: ["notion"], addons: ["Notion Keeper"] },
  { words: ["team", "handover", "onboarding", "new starter", "who is doing", "delegate"],
    addons: ["The Handover", "New Teammate Welcome", "Who's Got This"] }
];

/* Seeded because a blank box kills adoption, and because these teach the register the
   matcher expects: a complaint in your own words, not a product category. */
var EXAMPLES = [
  "my inbox is a mess",
  "I keep forgetting to follow up",
  "chasing unpaid invoices",
  "I never remember birthdays",
  "prepping for meetings",
  "no idea where my money goes"
];

var input   = document.getElementById("findInput");
var chipsEl = document.getElementById("findChips");
var results = document.getElementById("findResults");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* Score by how many of a job's words appear in the query. Substring rather than token
   match, so "emails" finds "email" and a typed phrase like "follow up" counts once as the
   phrase rather than twice as two common words. */
function match(query) {
  var q = String(query || "").toLowerCase().trim();
  if (q.length < 2) return [];
  var scored = [];
  JOBS.forEach(function (job) {
    var hits = 0;
    job.words.forEach(function (w) { if (q.indexOf(w) !== -1) hits += 1; });
    if (hits > 0) scored.push({ job: job, hits: hits });
  });
  scored.sort(function (a, b) { return b.hits - a.hits; });

  var seen = {};
  var out = [];
  scored.slice(0, 3).forEach(function (s) {
    s.job.addons.forEach(function (name) {
      if (!seen[name]) { seen[name] = 1; out.push(name); }
    });
  });
  return out.slice(0, 8);
}

function render(query) {
  if (!results) return;
  var q = String(query || "").trim();
  if (q.length < 2) { results.innerHTML = ""; return; }

  var found = match(q);
  if (!found.length) {
    results.innerHTML =
      '<p class="find-empty">Nothing in the catalog matches those words yet. That is worth telling us: ' +
      '<a class="marketplace-text-link" href="../commission/">say what you need</a>, ' +
      'or <a class="marketplace-text-link" href="../browse/">look through all of them</a>.</p>';
    return;
  }

  var html = '<p class="find-count">' + found.length +
    (found.length === 1 ? ' add-on already does something like that.' : ' add-ons already do something like that.') +
    '</p><ul class="find-list">';
  found.forEach(function (name) {
    // Deep-links into the browse page's own search, so there is one catalog and one renderer.
    html += '<li><a class="find-hit" href="../browse/?q=' + encodeURIComponent(name) + '">' +
            escapeHtml(name) + '</a></li>';
  });
  html += '</ul><p class="find-more">Not it? <a class="marketplace-text-link" href="../commission/">' +
          'Tell us what you actually need&nbsp;&rarr;</a></p>';
  results.innerHTML = html;
}

if (chipsEl) {
  chipsEl.innerHTML = EXAMPLES.map(function (e) {
    return '<li><button type="button" class="find-chip">' + escapeHtml(e) + "</button></li>";
  }).join("");
  chipsEl.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".find-chip");
    if (!btn || !input) return;
    input.value = btn.textContent;
    input.focus();
    render(input.value);
  });
}

if (input) {
  input.addEventListener("input", function () { render(input.value); });
  // A query in the URL makes a result shareable, which is the point of giving it a page.
  try {
    var pre = new URLSearchParams(window.location.search).get("q");
    if (pre) { input.value = pre; render(pre); }
  } catch (e) { /* no URLSearchParams, no prefill */ }
}
