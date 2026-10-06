/* ========================================
   Otian AI | Product Marketplace
   js/marketplace.js

   Renders the browse grid LIVE from the Archie marketplace catalog in Firestore
   (project archie-77170), the same store the desktop app reads. Public add-ons show
   for everyone; a signed-in user also sees the private/"Exclusive" add-ons shared with
   their account. No placeholders: what's in the DB is what shows.

   Visibility model (see Archie firestore.rules): rules are NOT filters (a query that
   returns any unreadable doc is rejected wholesale), so we run two scoped queries and
   merge: the public store (where visibility == "public") and, when signed in, the
   user's private items (where audience_uids array-contains uid). Never an unfiltered read.
   ======================================== */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { faceHtml, categoryGlyphHtml, glyphSvg } from "./faces.js?v=20261006-6";
/* The card renderer and the manifest shape live in their own module so that
   scripts/gen-marketplace.mjs can call the very same code through Node and write the
   public catalog into the page as static HTML. Before that the grid was an empty div,
   and everything that does not run JavaScript saw 146 add-ons as "No add-ons match your
   filters." See the header of js/addon-card.js. */
import {
  COLLECTIONS, shelfKind, escapeHtml, titleCase, formatIntegration,
  normalize, detailHtml, cardHtml,
} from "./addon-card.js?v=20261006-6";

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

/* Shelves in render order, deduped, so two collections sharing one shelf make one tab. */
var KIND_ORDER = COLLECTIONS.map(function (c) { return c.shelf; }).filter(function (v, i, a) {
  return a.indexOf(v) === i;
});

function kindLabel(kind) {
  var c = COLLECTIONS.filter(function (x) { return x.kind === kind; })[0];
  return c ? c.label : kind;
}

/* Featured Starter Packs: curated bundles of add-ons that already exist in the catalog, referenced
   by kind + id. A copy of every pack in Archie's src/app/packs.ts that is not marked exclusive,
   regenerated from that file on 2026-09-01 (it had drifted: one pack had been added there and
   another had become exclusive), and again on 2026-10-06, when College and Money at Home had been
   missing and Student had become Self-Study. An exclusive pack is one the app shows only to the accounts
   every one of its items was shared with, so it does not belong on a public page at all. A pack
   carries no logic of its own: the page resolves each item against the loaded catalog, so a
   private item a visitor can't see simply doesn't appear in that pack (and is counted as "shared
   with select accounts" instead). Keep in step with packs.ts in the Archie repo. */
/* The mark a pack wears, beside its name, in the pack's own accent. One per pack rather than
   the faces of everything inside: a row of five tiles on twelve cards was more icons than the
   landing view could carry, and a pack has a subject of its own. Chosen from the same set the
   add-ons use (js/faces.js), by what the pack is mostly for. */
var PACK_FACE = {
  "everyday-assistant": "list",
  "personal-organizer": "list",
  "mind-wellness": "leaf",
  "creators-desk": "pen",
  "college": "calendar",
  "self-study": "book",
  "home-kitchen": "food",
  "daily-briefing": "news",
  "life-admin": "doc",
  "home-errands": "home",
  "money-at-home": "money",
  "close-thoughtful": "people",
  "healthy-active": "pulse",
  "fun-curious": "spark",
};

var PACKS = [
  { id: "everyday-assistant", name: "Everyday Assistant", tagline: "A bit of everything to try", accent: "accent", recommended: true,
    description: "A to-do list, a private journal, web lookups, and the Friendly personality. Nothing to set up.",
    example: "add “call the dentist” to my to-do list",
    items: [["skill","task-manager"],["skill","personal-journal"],["specialist","researcher"],["personality","friendly"]] },
  { id: "personal-organizer", name: "Personal Organizer", tagline: "Tasks and habits, with a nudge before anything slips", accent: "blue",
    description: "A task list and habit tracker, a morning list of what’s due, and a Sunday look back at the week.",
    example: "what have I got on today?",
    items: [["skill","task-manager"],["skill","habit-tracker"],["routine","daily-task-digest"],["routine","weekly-review"]] },
  { id: "mind-wellness", name: "Mind & Wellness", tagline: "Journal, mood, and streaks, from one reply a night", accent: "teal",
    description: "Your journal, mood, and streaks, filed from one reply to an evening nudge.",
    example: "I had a good day today, here’s why…",
    items: [["skill","personal-journal"],["skill","habit-tracker"],["routine","evening-reflection"],["routine","habit-check-in"]] },
  { id: "creators-desk", name: "Creator’s Desk", tagline: "Drafts, flashcards, and a reading list", accent: "plum",
    description: "A writer that drafts and sharpens, a coach for what you’re learning, a reading list, and a personality with ideas first, judgment later.",
    example: "help me write an opening line for this post",
    items: [["specialist","writer"],["skill","learning-coach"],["skill","reading-list"],["personality","creative-muse"]] },
  { id: "college", name: "College", tagline: "Syllabus, deadlines, and what you need on the final", accent: "gold",
    description: "Add each syllabus and your agent tracks due dates, grades, and school deadlines like the last day to drop. At registration it reads your degree audit and lays out what to take next. Signing up stays yours.",
    example: "what’s due this week?",
    items: [["skill","my-classes"],["skill","class-planner"],["skill","learning-coach"],["specialist","researcher"],["routine","class-week"],["routine","coursework-due"],["routine","term-dates"]] },
  { id: "self-study", name: "Self-Study", tagline: "Flashcards, quizzes, and sources that make it stick", accent: "gold",
    description: "For learning on your own. Flashcards that bring back what you keep missing, sources from the live web with where each came from, and a study-partner personality that keeps you at it.",
    example: "quiz me on what I studied yesterday",
    items: [["skill","learning-coach"],["specialist","researcher"],["personality","study-partner"]] },
  { id: "home-kitchen", name: "Home & Life", tagline: "Meals, money, trips, and a reading list", accent: "green",
    description: "Meals from your fridge, spending, trips, and one list to read and watch. Saved between chats.",
    example: "what can I make with chicken, rice and half a lemon?",
    items: [["skill","meal-planner"],["skill","bill-tracker"],["skill","money-in-out"],["skill","trip-planner"],["skill","reading-list"]] },
  { id: "daily-briefing", name: "Daily Briefing", tagline: "Wake up already caught up", accent: "blue",
    description: "Your news, markets, and team scores, gathered from the live web overnight.",
    example: "what happened in the news overnight?",
    items: [["specialist","researcher"],["skill","news-briefing"],["skill","market-digest"],["skill","sports-follow"],["routine","morning-news"],["routine","market-morning"],["routine","sports-digest"]] },
  { id: "life-admin", name: "Life Admin", tagline: "Paperwork and appointments, held for you", accent: "gold",
    description: "Get the clause from your lease or policy, keep long forms moving, remember what the doctor said, and leave a sitter one note. Nothing to connect.",
    example: "does my lease let me have a dog?",
    items: [["skill","my-documents"],["skill","paperwork"],["skill","health-record"],["skill","the-handover"],["specialist","researcher"]] },
  { id: "home-errands", name: "Home & Errands", tagline: "Every renewal date, remembered for you", accent: "gold",
    description: "Keeps track of bills, the house, the car, return windows, plants, pets, and prices you’re watching.",
    example: "my car insurance renews in March, remind me",
    items: [["skill","bill-tracker"],["skill","home-maintenance"],["skill","plant-pet-care"],["skill","car-keeper"],["skill","warranty-returns"],["skill","price-watch"],["routine","bill-reminders"],["routine","home-checkup"],["routine","care-reminders"],["routine","price-check"],["routine","return-window-watch"]] },
  { id: "money-at-home", name: "Money at Home", tagline: "Spending, bills, and savings goals", accent: "green",
    description: "Log spending by chat, track every bill with a reminder three days ahead, save toward goals, and ask which card to use. Nothing to connect.",
    example: "where did my money go this month?",
    items: [["skill","money-in-out"],["skill","bill-tracker"],["skill","savings-goals"],["skill","card-rewards"],["routine","bill-reminders"],["routine","quarterly-card-categories"]] },
  { id: "close-thoughtful", name: "Close & Thoughtful", tagline: "Remember the people who matter", accent: "plum",
    description: "Birthdays and people to keep up with, a nudge before it’s too late, and help writing the card or reply.",
    example: "remind me about mom’s birthday next month",
    items: [["skill","birthday-keeper"],["skill","stay-in-touch"],["skill","reply-helper"],["routine","birthday-heads-up"],["routine","stay-in-touch-nudge"]] },
  { id: "healthy-active", name: "Healthy & Active", tagline: "A workout you can start now, and medications on time", accent: "green",
    description: "Home workouts with a nudge to do them, and a daily medication reminder.",
    example: "give me a 20 minute workout I can do at home",
    items: [["skill","home-workout"],["skill","medication-reminder"],["routine","workout-nudge"],["routine","med-reminders"]] },
  { id: "fun-curious", name: "Fun & Curious", tagline: "A word, a trivia question, and a pick for tonight", accent: "accent",
    description: "A new word and a trivia question each day, on their own, plus one list to read and watch with a pick when you can’t decide.",
    example: "what should I watch tonight?",
    items: [["skill","word-of-the-day"],["skill","daily-trivia"],["skill","reading-list"],["routine","daily-word"],["routine","trivia-time"]] },
];

/* ── Catalog fetch ──────────────────────────────────────────────────────── */

function itemsQuery(coll, clause) {
  return getDocs(query(collection(db, "marketplace", coll, "items"), clause));
}
/* Public catalog: everyone sees it. */
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

/* ── Page wiring ────────────────────────────────────────────────────────── */

var typeTabs    = document.getElementById("mpTypeTabs");
var filterBar   = document.getElementById("marketplaceFilterBar");
var searchInput = document.getElementById("marketplaceSearchInput");
var controlsRow = document.getElementById("mpControlsRow");
var grid        = document.getElementById("mpProductGrid");
var packGrid    = document.getElementById("mpPackGrid");
var emptyState  = document.getElementById("marketplaceFilterEmpty");
var statusEl    = document.getElementById("mpGridStatus");
var sortSelect  = document.getElementById("mpSort");

var state = { publicItems: [], privateItems: [], loaded: false };
/* The line above the pack cards while a search is running ("2 packs for this"). Made here rather
   than in the page, so the browse page carries no element that only a search ever fills. */
var packHitsEl = null;
if (packGrid && packGrid.parentNode) {
  packHitsEl = document.createElement("p");
  packHitsEl.className = "mp-grid-status";
  packHitsEl.hidden = true;
  packGrid.parentNode.insertBefore(packHitsEl, packGrid);
}
var lastPackHits = 0;
// Starter Packs are the default landing view, matching the Archie app.
var activeType = "packs";
var activeCategory = "all";
/* The order of the grid, the app's three choices with the app's default. "Most installed" ties
   break on name, so the many add-ons nobody has installed yet still read as a list. */
var sortMode = sortSelect ? sortSelect.value : "installs";

function allItems() {
  // Dedupe by kind+id (a private item could in principle also match public if mislabeled).
  var seen = {};
  var out = [];
  state.publicItems.concat(state.privateItems).forEach(function (it) {
    var key = it.kind + "/" + it.id;
    if (!seen[key]) { seen[key] = 1; out.push(it); }
  });
  out.sort(function (a, b) {
    if (sortMode === "name") return a.name.localeCompare(b.name);
    if (sortMode === "recent") {
      return (b.created_at || "").localeCompare(a.created_at || "") || a.name.localeCompare(b.name);
    }
    return (b.install_count - a.install_count) || a.name.localeCompare(b.name);
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
    counts[shelfKind(it.kind)]++;
    if (it.visibility === "private") counts.exclusive++;
  });

  // Starter Packs leads, then All + the three add-on kinds. Packs is its own kind of thing (a
  // curated bundle), so it sits first as a distinct entry, mirroring the Archie app.
  var html = '<button type="button" class="mp-type-tab mp-type-tab--packs' +
    (activeType === "packs" ? " is-active" : "") + '" data-type="packs">Starter Packs' +
    ' <span class="mp-card-count">(' + PACKS.length + ")</span></button>";
  var tabs = [{ type: "all", label: "All" }].concat(
    KIND_ORDER.map(function (shelf) {
      var c = COLLECTIONS.filter(function (x) { return x.shelf === shelf; })[0];
      return { type: shelf, label: c.plural };
    })
  );
  html += tabs.map(function (t) {
    return '<button type="button" class="mp-type-tab' + (t.type === activeType ? " is-active" : "") +
      '" data-type="' + t.type + '">' + t.label +
      ' <span class="mp-card-count">(' + counts[t.type] + ")</span></button>";
  }).join("");
  // Exclusive tab, only when the signed-in account actually has private add-ons.
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
      categoryGlyphHtml(c) + escapeHtml(titleCase(c)) + "</button>";
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
    return '<li class="mp-pack-item">' + faceHtml(it.kind, it.id, "row") +
      '<span class="' + cls + '">' + escapeHtml(kindLabel(it.kind)) +
      '</span><span class="mp-pack-item-name">' + escapeHtml(it.name) + "</span></li>";
  }).join("");

  // The description sits in here with the list, and the card itself is the name and the tagline:
  // a dozen cards of two to four lines each was the first thing a visitor met (2026-10-06).
  var detail = '<p class="mp-pack-desc">' + escapeHtml(pack.description) + "</p>";
  if (itemsHtml) detail += '<ul class="mp-pack-items">' + itemsHtml + "</ul>";
  if (hiddenCount > 0) {
    detail += '<p class="mp-pack-note">+ ' + hiddenCount + " private add-on" + (hiddenCount === 1 ? "" : "s") +
      " shared with select accounts. Sign in to your account to see " + (hiddenCount === 1 ? "it" : "them") + ".</p>";
  }

  var html = '<article class="mp-pack-card mp-pack-card--' + pack.accent + '">';
  // The face leads and the name sits beside it, the way the app lays out a card. The Recommended
  // mark shares the line, in the pack's own tint the way the app draws its "Start here", so a
  // long name wraps under the mark instead of running into it.
  html += '<div class="mp-pack-head">';
  html += '<span class="mp-face mp-face--card mp-face--pack" aria-hidden="true">' +
    glyphSvg(PACK_FACE[pack.id] || "addon", 1.6) + "</span>";
  html += "<h3>" + escapeHtml(pack.name) + "</h3>";
  if (pack.recommended) html += '<span class="mp-pack-ribbon">Recommended</span>';
  html += "</div>";
  html += '<p class="mp-pack-tagline">' + escapeHtml(pack.tagline) + "</p>";
  html += '<div class="mp-pack-bottom">';
  html += '<span class="mp-pack-count">' + pack.items.length + " add-on" + (pack.items.length === 1 ? "" : "s") + "</span>";
  html += '<button type="button" class="mp-card-link mp-card-expand" aria-expanded="false">See what&rsquo;s inside &rarr;</button>';
  html += "</div>";
  html += '<div class="mp-card-detail mp-pack-detail" hidden>' + detail + "</div>";
  html += "</article>";
  return html;
}

/* Packs answer the search box too, the way they do in the app (Archie's marketplace.tsx, "Packs
   answer the search box too"). Until 2026-09-01 typing anything dropped the whole packs view, so
   "student" found a learning skill and never the Student pack, and a bundle that hides when you
   search for the bundle is not a bundle. Matched on the pack's own words, its example message,
   and the names and descriptions of what is inside it, because somebody typing "invoices" wants
   the pack that handles invoices whatever it is called. Every typed word has to appear. */
function packMatches(q, index) {
  var terms = q.split(/\s+/).filter(Boolean);
  if (!terms.length) return PACKS;
  return PACKS.filter(function (p) {
    var inside = p.items.map(function (pair) {
      var it = index[pair[0] + "/" + pair[1]];
      return it ? it.name + " " + (it.description || "") : "";
    });
    var hay = [p.name, p.tagline, p.description, p.example || ""].concat(inside).join(" ").toLowerCase();
    return terms.every(function (t) { return hay.indexOf(t) !== -1; });
  });
}

/* Draws the pack cards for the current search (every pack when nothing is typed) and returns how
   many there are, so updateView can tell whether the grid has anything to show. */
function renderPacks(q) {
  if (!packGrid) return 0;
  var index = {};
  allItems().forEach(function (it) { index[it.kind + "/" + it.id] = it; });
  var packs = packMatches(q, index);
  packGrid.innerHTML = packs.map(function (p) { return packHtml(p, index); }).join("");
  return packs.length;
}

/* Show the packs grid, the add-on grid, or both. The Starter Packs tab is a distinct view with no
   category filtering. A search shows the add-on grid and, above it, whichever packs match, with a
   line saying so: a pack is a whole answer to a search where a single add-on is a piece of one. */
var selectedAddon = new URLSearchParams(window.location.search).get("addon") || "";
if (selectedAddon) activeType = "all";

function updateView() {
  var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
  var searching = q.length > 0;
  var packsTab = activeType === "packs" && !searching;
  var hits = renderPacks(q);
  lastPackHits = searching ? hits : 0;
  var packsShown = packsTab || lastPackHits > 0;
  if (packGrid) packGrid.hidden = !packsShown;
  if (packHitsEl) {
    packHitsEl.hidden = lastPackHits === 0;
    packHitsEl.textContent = lastPackHits === 1
      ? "A pack for this. It installs several add-ons at once."
      : lastPackHits + " packs for this. Each installs several add-ons at once.";
  }
  if (controlsRow) controlsRow.hidden = packsTab;
  if (grid) grid.hidden = packsTab;
  if (packsTab) {
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
    var matchSearch = selectedAddon ? card.dataset.addon === selectedAddon
      : !q || (card.dataset.search || "").indexOf(q) !== -1;
    var match = matchType && matchCat && matchSearch;
    card.hidden = !match;
    if (match) visible++;
  });
  // A search that found a pack and no single add-on is not empty: the pack is the answer.
  if (emptyState) emptyState.hidden = visible !== 0 || lastPackHits > 0 || !state.loaded;
}

function rerender() {
  var items = allItems();
  renderTabs(items);
  renderCategories(items);
  renderGrid(items);
  updateView();
}

/* Reordering redraws the grid, so the cards' open details close; the filters and the search
   are read again from their own state, so nothing else moves. */
if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    sortMode = sortSelect.value;
    renderGrid(allItems());
    applyFilters();
  });
}

/* Event delegation: tabs, category pills, card expand. */
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
/* A search spans every add-on, so it can't stay on the packs-only view: drop into the add-on grid
   (the packs that match are drawn above it by updateView) and move the highlight to "All".
   Shared by typing and by an incoming ?q=, which must land the reader in exactly the state they
   would have reached by typing it themselves. */
function leavePacksForSearch() {
  if (!searchInput || !searchInput.value.trim() || activeType !== "packs") return;
  activeType = "all";
  if (!typeTabs) return;
  Array.prototype.forEach.call(typeTabs.querySelectorAll(".mp-type-tab"), function (t) {
    t.classList.toggle("is-active", t.dataset.type === "all");
  });
}
if (searchInput) {
  searchInput.addEventListener("input", function () {
    selectedAddon = "";
    leavePacksForSearch();
    updateView();
  });
  /* ?q= makes a result linkable, which is what lets /skills-marketplace/find/ hand off to the
     real catalog instead of rendering a second copy of it. Applied before the fetch resolves:
     the value is read by the filter, and the load path rerenders when the items arrive. */
  try {
    var incoming = new URLSearchParams(window.location.search).get("q");
    if (incoming) {
      searchInput.value = incoming;
      leavePacksForSearch();
    }
  } catch (e) { /* no URLSearchParams, so no deep link; the page still works */ }
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
