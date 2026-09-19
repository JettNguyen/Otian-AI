/* Plain word matching. Queries stay in the tab. Names come from the generated public catalog. */
import { CATALOG_INDEX } from './catalog-index.js?v=20260918-39';
const byKey = new Map(CATALOG_INDEX.map(item => [item.key, item]));

var JOBS = [
  { words: ["inbox", "email", "unread", "e-mail", "mail pile", "reply to emails", "emails"],
    addons: ["skill:email-manager", "skill:inbox-rules", "skill:reply-helper"] },
  { words: ["calendar", "schedule", "book a time", "find a time", "double booked", "diary"],
    addons: ["skill:calendar-management", "skill:find-a-time"] },
  { words: ["meeting", "meetings", "minutes", "notes from", "recap", "standup", "call notes"],
    addons: ["skill:fireflies", "skill:meeting-prep"] },
  { words: ["todo", "to-do", "task", "tasks", "forget", "forgetting", "keep track of what"],
    addons: ["skill:task-manager", "skill:todoist", "skill:google-tasks", "skill:commitment-keeper"] },
  { words: ["bill", "bills", "subscription", "subscriptions", "recurring charge", "direct debit"],
    addons: ["skill:bill-tracker", "skill:money-in-out"] },
  { words: ["spend", "spending", "budget", "money", "expenses", "savings", "cashback", "credit card points"],
    addons: ["skill:savings-goals", "skill:money-in-out", "skill:card-rewards"] },
  { words: ["invoice", "invoices", "unpaid", "chase payment", "owed", "get paid", "bookkeeping", "receipts"],
    addons: ["skill:owed-to-customers", "skill:statement-collector", "skill:clean-books"] },
  { words: ["text", "texts", "sms", "imessage", "messages", "whatsapp"],
    addons: ["skill:text-replies", "skill:reply-helper"] },
  { words: ["follow up", "follow-up", "chase", "chasing", "waiting on", "nobody replied", "no response"],
    addons: ["skill:waiting-on", "skill:circle-back", "skill:commitment-keeper"] },
  { words: ["keep in touch", "friends", "family", "birthday", "birthdays", "anniversary", "lost touch"],
    addons: ["skill:stay-in-touch", "skill:birthday-keeper"] },
  { words: ["news", "briefing", "morning", "catch up on", "headlines", "markets", "stocks"],
    addons: ["skill:news-briefing", "skill:market-digest"] },
  { words: ["research", "look into", "find out", "compare options", "dig into"],
    addons: ["specialist:researcher", "specialist:deep-researcher"] },
  { words: ["write", "writing", "draft", "blog", "post", "wording", "how to say"],
    addons: ["specialist:writer", "skill:reply-helper"] },
  { words: ["client", "clients", "crm", "deal", "deals", "pipeline", "prospect", "sales"],
    addons: ["skill:owed-to-customers", "skill:waiting-on", "skill:the-handover"] },
  { words: ["lead", "leads", "outreach", "cold email", "new business", "prospecting"],
    addons: ["skill:reply-helper", "specialist:deep-researcher"] },
  { words: ["document", "documents", "paperwork", "filing", "forms", "form", "admin"],
    addons: ["skill:my-documents", "skill:paperwork", "skill:form-filler"] },
  { words: ["package", "delivery", "deliveries", "order", "parcel", "returns", "warranty"],
    addons: ["skill:package-tracker", "skill:warranty-returns"] },
  { words: ["house", "home", "maintenance", "boiler", "repairs", "lights", "away from home"],
    addons: ["skill:home-maintenance", "skill:house-watch", "skill:home-lights"] },
  { words: ["health", "medication", "prescription", "refill", "doctor", "appointment"],
    addons: ["skill:health-record", "skill:medication-reminder"] },
  { words: ["habit", "habits", "gym", "workout", "exercise", "fitness", "streak"],
    addons: ["skill:habit-tracker", "skill:home-workout"] },
  { words: ["learn", "learning", "study", "studying", "course", "revision", "vocabulary"],
    addons: ["skill:learning-coach", "skill:course-companion", "skill:word-of-the-day"] },
  { words: ["trip", "travel", "holiday", "vacation", "flight", "itinerary"],
    addons: ["skill:trip-planner"] },
  { words: ["meal", "meals", "dinner", "cooking", "recipes", "groceries", "shopping list"],
    addons: ["skill:meal-planner"] },
  { words: ["kids", "school", "children", "term dates", "childcare"],
    addons: ["skill:school-family"] },
  { words: ["price", "prices", "deal alert", "cheaper", "watch for a discount"],
    addons: ["skill:price-watch"] },
  { words: ["journal", "journalling", "reflect", "diary entry", "how my week went"],
    addons: ["skill:personal-journal", "skill:honest-week"] },
  { words: ["reading", "books", "watchlist", "to read", "to watch"],
    addons: ["skill:reading-list"] },
  { words: ["pet", "pets", "plants", "dog", "cat", "watering"],
    addons: ["skill:plant-pet-care"] },
  { words: ["car", "mot", "insurance renewal", "service due", "vehicle"],
    addons: ["skill:car-keeper"] },
  { words: ["github", "code", "pull request", "repo", "issues"],
    addons: ["skill:github-keeper"] },
  { words: ["notion"], addons: ["skill:notion-keeper"] },
  { words: ["team", "handover", "onboarding", "new starter", "who is doing", "delegate"],
    addons: ["skill:the-handover", "skill:new-teammate-welcome", "skill:whos-got-this"] }
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
      if (!seen[name]) { seen[name] = 1; if (byKey.has(name)) out.push(byKey.get(name)); }
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
  found.forEach(function (item) {
    // Deep-links into the browse page's own search, so there is one catalog and one renderer.
    html += '<li><a class="find-hit" href="../browse/?addon=' + encodeURIComponent(item.key) + '">' +
            escapeHtml(item.name) + '</a></li>';
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
