/* ========================================
   Otian AI | Product Marketplace
   js/marketplace.js

   Renders the browse grid LIVE from the Archie marketplace catalog in Firestore
   (project archie-77170), the same store the desktop app reads. Public add-ons show
   for everyone; a signed-in user also sees the private/"Exclusive" add-ons shared with
   their account. No placeholders — what's in the DB is what shows.

   Visibility model (see Archie firestore.rules): rules are NOT filters — a query that
   returns any unreadable doc is rejected wholesale — so we run two scoped queries and
   merge: the public store (where visibility == "public") and, when signed in, the
   user's private items (where audience_uids array-contains uid). Never an unfiltered read.
   ======================================== */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA46RqJV4tcJD8h4mdcSZ26dDoikA9L64M",
  authDomain: "archie-77170.firebaseapp.com",
  projectId: "archie-77170",
  storageBucket: "archie-77170.firebasestorage.app",
  messagingSenderId: "516396797258",
  appId: "1:516396797258:web:362cf2815128f3c82345b3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* Render order = the order the user asked for: Personalities, Skills, Workers, Routines.
   `coll` is the Firestore subcollection name; `subagents` is what the app calls a Worker. */
var COLLECTIONS = [
  { coll: "personalities", kind: "personality", label: "Personality", plural: "Personalities" },
  { coll: "skills",        kind: "skill",       label: "Skill",       plural: "Skills" },
  { coll: "subagents",     kind: "worker",      label: "Worker",      plural: "Workers" },
  { coll: "routines",      kind: "routine",     label: "Routine",     plural: "Routines" },
];
var KIND_ORDER = COLLECTIONS.map(function (c) { return c.kind; });

function kindLabel(kind) {
  var c = COLLECTIONS.filter(function (x) { return x.kind === kind; })[0];
  return c ? c.label : kind;
}

/* Featured Starter Packs — curated bundles of add-ons that already exist in the catalog, referenced
   by kind + id (mirrors Archie's src/app/packs.ts). A pack carries no logic of its own: the page
   resolves each item against the loaded catalog, so a private item a visitor can't see simply
   doesn't appear in that pack (and is counted as "shared with select accounts" instead). Keep the
   ids in sync with data/marketplace/<kind>/ in the Archie repo. */
var PACKS = [
  { id: "everyday-assistant", name: "Everyday Assistant", tagline: "A great all-rounder to start with", accent: "accent", recommended: true,
    description: "The best first pack for anyone. Your agent keeps your to-do list and a private journal, can research anything on the live web, and greets you in a warm, friendly voice — useful from the first message, nothing to set up.",
    items: [["skill","task-manager"],["skill","personal-journal"],["worker","researcher"],["personality","friendly"]] },
  { id: "personal-organizer", name: "Personal Organizer", tagline: "Stay on top of tasks and habits", accent: "blue",
    description: "Turn your agent into the thing that keeps your life on track: a real task list and habit tracker, plus a morning digest of what's due and a Sunday review of the week. It nudges you so you don't have to remember to check.",
    items: [["skill","task-manager"],["skill","habit-tracker"],["routine","daily-task-digest"],["routine","weekly-review"]] },
  { id: "mind-wellness", name: "Mind & Wellness", tagline: "Reflect, and build good habits", accent: "teal",
    description: "A calmer corner of your day. Keep a private journal, note your mood, log a daily gratitude, and track the habits you're building — with gentle evening and check-in nudges, all in an unhurried, grounding voice.",
    items: [["skill","personal-journal"],["skill","mood-tracker"],["skill","gratitude"],["skill","habit-tracker"],["routine","evening-journal"],["routine","mood-check-in"],["routine","gratitude-wind-down"],["routine","habit-check-in"],["personality","calm-anchor"]] },
  { id: "creators-desk", name: "Creator's Desk", tagline: "Write, learn, and stay inspired", accent: "plum",
    description: "For making things. A writing worker that drafts and sharpens your words, a learning coach to skill up, a saved reading list for inspiration, and a bright, imaginative voice to bounce ideas off.",
    items: [["worker","writer"],["skill","learning-coach"],["skill","reading-list"],["personality","creative-muse"]] },
  { id: "student", name: "Student", tagline: "Learn faster, study smarter", accent: "gold",
    description: "A study partner that sticks. The learning coach makes flashcards and quizzes you with spaced repetition, the researcher digs up sources on the live web, and the study-partner voice keeps you focused and encouraged.",
    items: [["skill","learning-coach"],["worker","researcher"],["personality","study-partner"]] },
  { id: "home-kitchen", name: "Home & Life", tagline: "Meals, money, trips, and reading", accent: "green",
    description: "The everyday-life bundle. Plan meals around your tastes (or around what's already in your fridge), track spending, set savings goals, plan trips, and keep one list of everything you want to read — saved tools your agent remembers between chats.",
    items: [["skill","meal-planner"],["skill","fridge-dinner"],["skill","expense-tracker"],["skill","savings-goals"],["skill","trip-planner"],["skill","reading-list"]] },
  { id: "daily-briefing", name: "Daily Briefing", tagline: "Wake up already caught up", accent: "blue",
    description: "Your morning catch-up, handled. Each day your agent pulls the news that matters to you, a market snapshot, and your teams' scores — gathered on the live web by a research worker and delivered in a crisp, no-fluff voice.",
    items: [["worker","researcher"],["skill","news-briefing"],["skill","market-digest"],["skill","sports-follow"],["routine","morning-news"],["routine","market-morning"],["routine","sports-digest"],["personality","concise"]] },
  { id: "home-errands", name: "Home & Errands", tagline: "The household admin, off your plate", accent: "gold",
    description: "The stuff that's easy to forget. Track bills, home upkeep, your car, warranties and returns, and your plants and pets — each with a timely reminder — plus a watch on prices for things you're waiting to buy, all run by an unflappable concierge.",
    items: [["skill","bill-tracker"],["skill","home-maintenance"],["skill","plant-pet-care"],["skill","car-keeper"],["skill","warranty-returns"],["skill","price-watch"],["routine","bill-reminders"],["routine","home-checkup"],["routine","care-reminders"],["routine","price-check"],["personality","exec-concierge"]] },
  { id: "close-thoughtful", name: "Close & Thoughtful", tagline: "Never miss a moment that matters", accent: "plum",
    description: "Be the person who always remembers. Your agent keeps birthdays and the people you mean to stay in touch with, nudges you before it's too late, and helps you write the card, note, or reply — in a warm, personal voice.",
    items: [["skill","birthday-keeper"],["skill","stay-in-touch"],["skill","card-note-writer"],["skill","reply-helper"],["routine","birthday-heads-up"],["routine","stay-in-touch-nudge"],["personality","warm-companion"]] },
  { id: "healthy-active", name: "Healthy & Active", tagline: "Move more, stay on top of your health", accent: "green",
    description: "A pocket coach for body and routine. Get home workouts you can do anywhere with a nudge to actually do them, and keep your medications on schedule with a daily reminder — all in an upbeat, motivating voice.",
    items: [["skill","home-workout"],["skill","medication-reminder"],["routine","workout-nudge"],["routine","med-reminders"],["personality","hype-coach"]] },
  { id: "fun-curious", name: "Fun & Curious", tagline: "A little delight, every day", accent: "accent",
    description: "For the fun of it. Learn a new word and a piece of trivia each day, and get a spot-on pick for what to watch tonight — a light, playful sidekick that makes your agent enjoyable to open, not just useful.",
    items: [["skill","word-of-the-day"],["skill","daily-trivia"],["skill","watch-tonight"],["routine","daily-word"],["routine","trivia-time"],["personality","playful-sidekick"]] },
  { id: "sales-business", name: "Sales & Business", tagline: "For teams working a pipeline", accent: "accent",
    description: "The lead-gen toolkit. A shared client memory, a strategist that reasons about your next move, and a deal desk that matches buyers to suppliers — plus engagement scoring, outreach drafting, a lead-gen playbook, a prospecting worker, pipeline reports, a weekly strategy note, and a closer's voice. Built for sales teams.",
    items: [["skill","client-brain"],["skill","strategist"],["skill","deal-desk"],["skill","engagement-scoring"],["skill","outreach-studio"],["skill","lead-gen-playbook"],["worker","prospector"],["routine","daily-pipeline-report"],["routine","weekly-pipeline-review"],["routine","weekly-strategy"],["personality","deal-closer"]] },
];

/* Friendly names for integration slugs, for the "Works with" hint on a card's detail. */
var INTEGRATION_LABELS = {
  fireflies: "Fireflies",
  google_calendar: "Google Calendar",
  gmail: "Gmail",
};
function formatIntegration(slug) {
  return INTEGRATION_LABELS[slug] ||
    String(slug).replace(/[_-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}
function titleCase(s) {
  return String(s || "").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ── Catalog fetch ──────────────────────────────────────────────────────── */

function itemsQuery(coll, clause) {
  return getDocs(query(collection(db, "marketplace", coll, "items"), clause));
}

function normalize(kind, id, data) {
  return {
    kind: kind,
    id: id,
    name: data.name || id,
    author: data.author || "Otian AI",
    price_cents: typeof data.price_cents === "number" ? data.price_cents : 0,
    description: data.description || "",
    long_description: data.long_description || "",
    tagline: data.tagline || "",
    category: data.category || "",
    role: data.role || "",
    tone: data.tone || "",
    triggers: Array.isArray(data.triggers) ? data.triggers : [],
    setup_steps: Array.isArray(data.setup_steps) ? data.setup_steps : [],
    required_integrations: Array.isArray(data.required_integrations) ? data.required_integrations : [],
    required_skill: data.required_skill || "",
    preview_exchanges: Array.isArray(data.preview_exchanges) ? data.preview_exchanges : [],
    visibility: data.visibility === "private" ? "private" : "public",
  };
}

/* Public catalog — everyone sees it. */
function fetchPublic() {
  return Promise.all(COLLECTIONS.map(function (c) {
    return itemsQuery(c.coll, where("visibility", "==", "public")).then(function (snap) {
      var out = [];
      snap.forEach(function (d) { out.push(normalize(c.kind, d.id, d.data())); });
      return out;
    });
  })).then(function (groups) {
    return groups.reduce(function (a, b) { return a.concat(b); }, []);
  });
}

/* Private add-ons shared with this account. Scoped to the user's uid so the query stays
   inside what the rules allow (no unreadable docs returned). */
function fetchPrivate(uid) {
  return Promise.all(COLLECTIONS.map(function (c) {
    return itemsQuery(c.coll, where("audience_uids", "array-contains", uid)).then(function (snap) {
      var out = [];
      snap.forEach(function (d) { out.push(normalize(c.kind, d.id, d.data())); });
      return out;
    }).catch(function () { return []; });
  })).then(function (groups) {
    return groups.reduce(function (a, b) { return a.concat(b); }, []);
  });
}

/* ── Card rendering ─────────────────────────────────────────────────────── */

function priceLabel(cents) {
  if (!cents) return { cls: "is-free", text: "Free" };
  return { cls: "is-premium", text: "$" + (cents / 100).toFixed(2).replace(/\.00$/, "") + " · one-time" };
}

function detailHtml(item) {
  var parts = [];

  if (item.long_description && item.long_description !== item.description) {
    item.long_description.split(/\n{2,}/).forEach(function (para) {
      if (para.trim()) parts.push("<p>" + escapeHtml(para.trim()) + "</p>");
    });
  }

  if (item.kind === "personality" && item.preview_exchanges.length) {
    var chat = item.preview_exchanges.map(function (ex) {
      return '<div class="bubble user">' + escapeHtml(ex.user) + "</div>" +
             '<div class="bubble bot">' + escapeHtml(ex.bot) + "</div>";
    }).join("");
    parts.push('<div><h4>Sample conversation</h4><div class="mp-card-chat">' + chat + "</div></div>");
  }

  var worksWith = [];
  item.required_integrations.forEach(function (s) { worksWith.push(formatIntegration(s)); });
  if (item.required_skill) worksWith.push(titleCase(item.required_skill.replace(/[-_]+/g, " ")) + " skill");
  if (worksWith.length) {
    parts.push('<div><h4>Works with</h4><div class="mp-chip-row">' +
      worksWith.map(function (w) { return '<span class="mp-chip">' + escapeHtml(w) + "</span>"; }).join("") +
      "</div></div>");
  }

  if (item.triggers.length) {
    var chips = item.triggers.slice(0, 12).map(function (t) {
      return '<span class="mp-chip">' + escapeHtml(t) + "</span>";
    }).join("");
    parts.push('<div><h4>Try saying</h4><div class="mp-chip-row">' + chips + "</div></div>");
  }

  if (item.setup_steps.length) {
    var steps = item.setup_steps.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("");
    parts.push('<div><h4>Setup</h4><ol>' + steps + "</ol></div>");
  }

  return parts.join("");
}

function cardHtml(item) {
  var kindLabel = COLLECTIONS.filter(function (c) { return c.kind === item.kind; })[0].label;
  var price = priceLabel(item.price_cents);
  var isPrivate = item.visibility === "private";
  var searchBlob = [item.name, item.description, item.long_description, item.tagline, item.category,
    item.role, item.tone].concat(item.triggers).join(" ").toLowerCase();
  var detail = detailHtml(item);

  var html = "";
  html += '<article class="mp-product-card" data-type="' + item.kind + '"' +
    ' data-category="' + escapeHtml(item.category) + '"' +
    ' data-price="' + (item.price_cents ? "premium" : "free") + '"' +
    ' data-visibility="' + item.visibility + '"' +
    ' data-name="' + escapeHtml(item.name.toLowerCase()) + '"' +
    ' data-search="' + escapeHtml(searchBlob) + '">';

  html += '<div class="mp-card-badges"><span class="mp-type-badge">' + escapeHtml(kindLabel) + "</span>";
  if (item.category) html += '<span class="mp-category-badge">' + escapeHtml(item.category) + "</span>";
  html += "</div>";

  html += "<h3>" + escapeHtml(item.name) + "</h3>";
  html += '<p class="mp-card-author">by ' + escapeHtml(item.author) + "</p>";
  if (item.kind === "personality" && item.tagline) {
    html += '<p class="mp-card-tagline">' + escapeHtml(item.tagline) + "</p>";
  }
  html += '<p class="mp-card-desc">' + escapeHtml(item.description) + "</p>";

  if (detail) html += '<div class="mp-card-detail" hidden>' + detail + "</div>";

  html += '<div class="mp-card-bottom">';
  html += '<span class="mp-price-badge ' + price.cls + '">' + price.text + "</span>";
  if (isPrivate) {
    html += '<span class="mp-exclusive-badge" title="Shared privately with your account">' +
      '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' +
      "Exclusive</span>";
  }
  if (detail) {
    html += '<button type="button" class="mp-card-link mp-card-expand" aria-expanded="false">View Details &rarr;</button>';
  }
  html += "</div></article>";
  return html;
}

/* ── Page wiring ────────────────────────────────────────────────────────── */

var typeTabs    = document.getElementById("mpTypeTabs");
var filterBar   = document.getElementById("marketplaceFilterBar");
var searchInput = document.getElementById("marketplaceSearchInput");
var priceToggle = document.getElementById("mpPriceToggle");
var controlsRow = document.getElementById("mpControlsRow");
var grid        = document.getElementById("mpProductGrid");
var packGrid    = document.getElementById("mpPackGrid");
var emptyState  = document.getElementById("marketplaceFilterEmpty");
var statusEl    = document.getElementById("mpGridStatus");

var state = { publicItems: [], privateItems: [], loaded: false };
// Starter Packs are the default landing view, matching the Archie app.
var activeType = "packs";
var activeCategory = "all";
var activePrice = "all";

function allItems() {
  // Dedupe by kind+id (a private item could in principle also match public if mislabeled).
  var seen = {};
  var out = [];
  state.publicItems.concat(state.privateItems).forEach(function (it) {
    var key = it.kind + "/" + it.id;
    if (!seen[key]) { seen[key] = 1; out.push(it); }
  });
  out.sort(function (a, b) {
    var ka = KIND_ORDER.indexOf(a.kind), kb = KIND_ORDER.indexOf(b.kind);
    return ka !== kb ? ka - kb : a.name.localeCompare(b.name);
  });
  return out;
}

function setStatus(msg) {
  if (!statusEl) return;
  statusEl.textContent = msg || "";
  statusEl.hidden = !msg;
}

function renderTabs(items) {
  if (!typeTabs) return;
  var counts = { all: items.length, exclusive: 0 };
  KIND_ORDER.forEach(function (k) { counts[k] = 0; });
  items.forEach(function (it) {
    counts[it.kind]++;
    if (it.visibility === "private") counts.exclusive++;
  });

  // Starter Packs leads, then All + the four add-on kinds. Packs is its own kind of thing (a
  // curated bundle), so it sits first as a distinct entry, mirroring the Archie app.
  var html = '<button type="button" class="mp-type-tab mp-type-tab--packs' +
    (activeType === "packs" ? " is-active" : "") + '" data-type="packs">Starter Packs' +
    ' <span class="mp-card-count">(' + PACKS.length + ")</span></button>";
  var tabs = [{ type: "all", label: "All" }].concat(
    COLLECTIONS.map(function (c) { return { type: c.kind, label: c.plural }; })
  );
  html += tabs.map(function (t) {
    return '<button type="button" class="mp-type-tab' + (t.type === activeType ? " is-active" : "") +
      '" data-type="' + t.type + '">' + t.label +
      ' <span class="mp-card-count">(' + counts[t.type] + ")</span></button>";
  }).join("");
  // Exclusive tab — only when the signed-in account actually has private add-ons.
  if (counts.exclusive > 0) {
    html += '<button type="button" class="mp-type-tab' + (activeType === "exclusive" ? " is-active" : "") +
      '" data-type="exclusive">Exclusive <span class="mp-card-count">(' + counts.exclusive + ")</span></button>";
  } else if (activeType === "exclusive") {
    activeType = "all";
  }
  typeTabs.innerHTML = html;
}

function renderCategories(items) {
  if (!filterBar) return;
  var cats = {};
  items.forEach(function (it) { if (it.category) cats[it.category] = 1; });
  var list = Object.keys(cats).sort();
  var html = '<button type="button" class="marketplace-filter-pill' +
    (activeCategory === "all" ? " is-active" : "") + '" data-filter="all">All</button>';
  html += list.map(function (c) {
    return '<button type="button" class="marketplace-filter-pill' +
      (activeCategory === c ? " is-active" : "") + '" data-filter="' + escapeHtml(c) + '">' +
      escapeHtml(titleCase(c)) + "</button>";
  }).join("");
  filterBar.innerHTML = html;
}

function renderGrid(items) {
  if (!grid) return;
  grid.innerHTML = items.map(cardHtml).join("");
}

function packHtml(pack, index) {
  var resolved = pack.items
    .map(function (pair) { return index[pair[0] + "/" + pair[1]]; })
    .filter(Boolean);
  var hiddenCount = pack.items.length - resolved.length;

  var itemsHtml = resolved.map(function (it) {
    var cls = "mp-type-badge" + (it.kind === "skill" ? "" : " mp-type-badge--" + it.kind);
    return '<li class="mp-pack-item"><span class="' + cls + '">' + escapeHtml(kindLabel(it.kind)) +
      '</span><span class="mp-pack-item-name">' + escapeHtml(it.name) + "</span></li>";
  }).join("");

  var detail = "";
  if (itemsHtml) detail += '<ul class="mp-pack-items">' + itemsHtml + "</ul>";
  if (hiddenCount > 0) {
    detail += '<p class="mp-pack-note">+ ' + hiddenCount + " private add-on" + (hiddenCount === 1 ? "" : "s") +
      " shared with select accounts. Sign in to your account to see " + (hiddenCount === 1 ? "it" : "them") + ".</p>";
  }

  var html = '<article class="mp-pack-card mp-pack-card--' + pack.accent + '">';
  if (pack.recommended) html += '<span class="mp-pack-ribbon">Recommended</span>';
  html += "<h3>" + escapeHtml(pack.name) + "</h3>";
  html += '<p class="mp-pack-tagline">' + escapeHtml(pack.tagline) + "</p>";
  html += '<p class="mp-pack-desc">' + escapeHtml(pack.description) + "</p>";
  html += '<div class="mp-pack-bottom">';
  html += '<span class="mp-pack-count">' + pack.items.length + " add-on" + (pack.items.length === 1 ? "" : "s") + "</span>";
  html += '<button type="button" class="mp-card-link mp-card-expand" aria-expanded="false">See what&rsquo;s inside &rarr;</button>';
  html += "</div>";
  html += '<div class="mp-card-detail mp-pack-detail" hidden>' + detail + "</div>";
  html += "</article>";
  return html;
}

function renderPacks() {
  if (!packGrid) return;
  var index = {};
  allItems().forEach(function (it) { index[it.kind + "/" + it.id] = it; });
  packGrid.innerHTML = PACKS.map(function (p) { return packHtml(p, index); }).join("");
}

/* Show the packs grid or the add-on grid depending on the active tab. Packs is a distinct view
   with no category/price filtering; searching always drops into the add-on grid. */
function updateView() {
  var searching = searchInput && searchInput.value.trim().length > 0;
  var showPacks = activeType === "packs" && !searching;
  if (packGrid) packGrid.hidden = !showPacks;
  if (controlsRow) controlsRow.hidden = showPacks;
  if (grid) grid.hidden = showPacks;
  if (showPacks) {
    if (emptyState) emptyState.hidden = true;
  } else {
    applyFilters();
  }
}

function applyFilters() {
  if (!grid) return;
  var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
  var cards = grid.querySelectorAll(".mp-product-card");
  var visible = 0;
  Array.prototype.forEach.call(cards, function (card) {
    var matchType = activeType === "all" ? true
      : activeType === "exclusive" ? card.dataset.visibility === "private"
      : card.dataset.type === activeType;
    var matchCat = activeCategory === "all" || card.dataset.category === activeCategory;
    var matchPrice = activePrice === "all" || card.dataset.price === activePrice;
    var matchSearch = !q || (card.dataset.search || "").indexOf(q) !== -1;
    var match = matchType && matchCat && matchPrice && matchSearch;
    card.hidden = !match;
    if (match) visible++;
  });
  if (emptyState) emptyState.hidden = visible !== 0 || !state.loaded;
}

function rerender() {
  var items = allItems();
  renderTabs(items);
  renderCategories(items);
  renderGrid(items);
  renderPacks();
  updateView();
}

/* Event delegation: tabs, category pills, price toggle, card expand. */
if (typeTabs) {
  typeTabs.addEventListener("click", function (e) {
    var tab = e.target.closest(".mp-type-tab");
    if (!tab) return;
    activeType = tab.dataset.type;
    Array.prototype.forEach.call(typeTabs.querySelectorAll(".mp-type-tab"), function (t) {
      t.classList.toggle("is-active", t === tab);
    });
    updateView();
  });
}
if (filterBar) {
  filterBar.addEventListener("click", function (e) {
    var pill = e.target.closest(".marketplace-filter-pill");
    if (!pill) return;
    activeCategory = pill.dataset.filter;
    Array.prototype.forEach.call(filterBar.querySelectorAll(".marketplace-filter-pill"), function (p) {
      p.classList.toggle("is-active", p === pill);
    });
    applyFilters();
  });
}
if (priceToggle) {
  priceToggle.addEventListener("click", function (e) {
    var btn = e.target.closest(".mp-price-btn");
    if (!btn) return;
    activePrice = btn.dataset.price;
    Array.prototype.forEach.call(priceToggle.querySelectorAll(".mp-price-btn"), function (b) {
      b.classList.toggle("is-active", b === btn);
    });
    applyFilters();
  });
}
if (searchInput) {
  searchInput.addEventListener("input", function () {
    // A search spans every add-on, so it can't stay on the packs view — drop into the add-on grid
    // and move the highlight to "All" the moment the user types.
    if (searchInput.value.trim() && activeType === "packs") {
      activeType = "all";
      Array.prototype.forEach.call(typeTabs.querySelectorAll(".mp-type-tab"), function (t) {
        t.classList.toggle("is-active", t.dataset.type === "all");
      });
    }
    updateView();
  });
}

/* Expand toggle for both add-on cards and pack cards. `collapsedLabel` differs per surface. */
function wireExpand(container, cardSel, collapsedLabel) {
  if (!container) return;
  container.addEventListener("click", function (e) {
    var btn = e.target.closest(".mp-card-expand");
    if (!btn) return;
    var card = btn.closest(cardSel);
    var detail = card.querySelector(".mp-card-detail");
    if (!detail) return;
    var open = detail.hasAttribute("hidden");
    if (open) { detail.removeAttribute("hidden"); } else { detail.setAttribute("hidden", ""); }
    btn.setAttribute("aria-expanded", String(open));
    btn.innerHTML = open ? "Hide &uarr;" : collapsedLabel;
  });
}
wireExpand(grid, ".mp-product-card", "View Details &rarr;");
wireExpand(packGrid, ".mp-pack-card", "See what&rsquo;s inside &rarr;");

/* Initial public load, then layer in private items once auth resolves. */
if (grid) {
  setStatus("Loading add-ons…");
  fetchPublic().then(function (items) {
    state.publicItems = items;
    state.loaded = true;
    setStatus("");
    rerender();
  }).catch(function () {
    setStatus("Couldn't load the marketplace right now. Please refresh in a moment.");
  });

  onAuthStateChanged(auth, function (user) {
    if (!user) {
      if (state.privateItems.length) { state.privateItems = []; rerender(); }
      return;
    }
    fetchPrivate(user.uid).then(function (items) {
      state.privateItems = items;
      if (state.loaded) rerender();
    });
  });
}

/* ── Waitlist form ──────────────────────────────────────────────────────── */
(function () {
  var form = document.getElementById("marketplaceWaitlistForm");
  var confirmation = document.getElementById("marketplaceConfirmationMessage");
  if (!form) return;

  function showError(input, msg) {
    input.classList.add("field-error");
    var errEl = input.parentElement.querySelector(".form-error-msg");
    if (errEl) { errEl.textContent = msg; errEl.classList.add("visible"); }
  }
  function clearError(input) {
    input.classList.remove("field-error");
    var errEl = input.parentElement.querySelector(".form-error-msg");
    if (errEl) errEl.classList.remove("visible");
  }
  function isValidEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

  form.querySelectorAll(".form-input").forEach(function (el) {
    el.addEventListener("input", function () { clearError(el); });
    el.addEventListener("change", function () { clearError(el); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameEl = document.getElementById("waitlistName");
    var emailEl = document.getElementById("waitlistEmail");
    var interestEl = document.getElementById("waitlistInterest");
    var valid = true;

    if (nameEl && !nameEl.value.trim()) { showError(nameEl, "Please enter your name."); valid = false; }
    if (emailEl) {
      if (!emailEl.value.trim()) { showError(emailEl, "Please enter your email address."); valid = false; }
      else if (!isValidEmail(emailEl.value.trim())) { showError(emailEl, "Please enter a valid email address."); valid = false; }
    }
    if (interestEl && !interestEl.value) { showError(interestEl, "Please choose an option."); valid = false; }
    if (!valid) return;

    form.style.display = "none";
    if (confirmation) confirmation.classList.add("visible");
  });
})();
