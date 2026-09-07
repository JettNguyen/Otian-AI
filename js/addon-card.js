/* ========================================
   Otian AI | Add-on card rendering
   js/addon-card.js

   One add-on, rendered as the card the store shows. Pure: it takes a normalized manifest and
   returns a string, touching no DOM, no network and no Firebase.

   IT IS PURE BECAUSE TWO CALLERS NEED IT AND ONLY ONE OF THEM IS A BROWSER.

   js/marketplace.js calls it with what Firestore returned, which is the live store and the only
   authority: it alone can see the private items shared with a signed-in account, and it is what
   a visitor ends up looking at. scripts/gen-marketplace.py calls it through Node with the public
   manifests in the Archie repo, and writes the result into skills-marketplace/browse/ as static
   HTML, because until 2026-09-07 the grid on that page was an empty <div> filled in by script
   and everything without JavaScript saw a catalog of 146 add-ons render as the words "No add-ons
   match your filters." That is every crawler, every answer engine, and every link preview: the
   largest thing on this site was, to all of them, a blank.

   So the page now ships the public catalog in its markup and the script replaces it on load.
   Both paths have to produce the same card or the page visibly rewrites itself in front of
   somebody, which is why this file exists instead of a second copy of the renderer in Python.
   scripts/check-marketplace.py fails when the shipped HTML and the manifests disagree.

   Extracted from js/marketplace.js on 2026-09-07, which is where all of it was written and where
   the page wiring still lives. Same reason js/catalog.js was extracted before it.
   ======================================== */

import { faceHtml } from "./faces.js";

/* Render order = the order the user asked for: Personalities, Skills, Routines.
   `coll` is the Firestore subcollection name; `kind` is what the catalog document calls itself.

   `shelf` is what a shopper sees, and it is not always `kind`. The `subagents` collection is
   shown as a skill: the two differ in how the runtime calls them, which is a fact about our
   code and never a question to put to somebody at a shelf. The collection, the kind and the
   install path are all untouched; only the word and the colour collapse. */
export var COLLECTIONS = [
  { coll: "personalities", kind: "personality", shelf: "personality", label: "Personality", plural: "Personalities" },
  { coll: "skills",        kind: "skill",       shelf: "skill",       label: "Skill",       plural: "Skills" },
  { coll: "subagents",     kind: "specialist",  shelf: "skill",       label: "Skill",       plural: "Skills" },
  { coll: "routines",      kind: "routine",     shelf: "routine",     label: "Routine",     plural: "Routines" },
];

/** The shelf a kind sits on. Everything user-visible sorts, counts, filters and colours by this. */
export function shelfKind(kind) {
  var c = COLLECTIONS.filter(function (x) { return x.kind === kind; })[0];
  return c ? c.shelf : kind;
}


/* Friendly names for integration slugs, for the "Works with" hint on a card's detail.
   The two mail slugs are named after Google because Google was the only provider when they were
   written, and they cannot be renamed now: the slug is in every published add-on. Several
   providers serve each of them now, so the chip says what is needed rather than whose. Kept in
   step with `INTEGRATION_LABELS` in the Archie repo's src/app/store-widgets.tsx. */
export var INTEGRATION_LABELS = {
  fireflies: "Fireflies",
  google_calendar: "a calendar",
  gmail: "an email account",
  google_tasks: "Google Tasks",
  home_assistant: "Home Assistant",
  local_devices: "Hue, WiZ or LIFX on your wifi",
  imessage: "Messages on a Mac",
};
export function formatIntegration(slug) {
  return INTEGRATION_LABELS[slug] ||
    String(slug).replace(/[_-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}
export function titleCase(s) {
  return String(s || "").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}
export function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}



export function normalize(kind, id, data) {
  return {
    kind: kind,
    id: id,
    name: data.name || id,
    author: data.author || "Otian AI",
    price_cents: typeof data.price_cents === "number" ? data.price_cents : 0,
    // Incremented by the backend on every install, so it is measured, never modelled. Zero for
    // an add-on nobody has installed yet, and shown only once it is above that.
    install_count: typeof data.install_count === "number" ? data.install_count : 0,
    // ISO date, as every manifest carries it. Missing sorts last under "Recently added".
    created_at: typeof data.created_at === "string" ? data.created_at : "",
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


/* ── Card rendering ─────────────────────────────────────────────────────── */

export function detailHtml(item) {
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

export function cardHtml(item) {
  var kindLabel = COLLECTIONS.filter(function (c) { return c.kind === item.kind; })[0].label;
  var isPrivate = item.visibility === "private";
  var searchBlob = [item.name, item.description, item.long_description, item.tagline, item.category,
    item.role, item.tone].concat(item.triggers).join(" ").toLowerCase();
  var detail = detailHtml(item);

  var html = "";
  html += '<article class="mp-product-card" data-type="' + shelfKind(item.kind) + '"' +
    ' data-category="' + escapeHtml(item.category) + '"' +
    ' data-visibility="' + item.visibility + '"' +
    ' data-name="' + escapeHtml(item.name.toLowerCase()) + '"' +
    ' data-search="' + escapeHtml(searchBlob) + '">';

  // The card is laid out the way the app lays out a shelf card: the face leads and the name sits
  // beside it, the kind and category badges hang under the name, then the one line of copy, and
  // the footer carries who made it and how many have it. Every line answers a different
  // question, so nothing on the card competes with the line above it.
  html += '<div class="mp-card-top">' + faceHtml(item.kind, item.id, "card");
  html += '<div class="mp-card-heading"><h3>' + escapeHtml(item.name) + "</h3>";
  html += '<div class="mp-card-badges"><span class="mp-type-badge">' + escapeHtml(kindLabel) + "</span>";
  if (item.category) html += '<span class="mp-category-badge">' + escapeHtml(item.category) + "</span>";
  html += "</div></div></div>";

  if (item.kind === "personality" && item.tagline) {
    html += '<p class="mp-card-tagline">' + escapeHtml(item.tagline) + "</p>";
  }
  html += '<p class="mp-card-desc">' + escapeHtml(item.description) + "</p>";

  if (detail) html += '<div class="mp-card-detail" hidden>' + detail + "</div>";

  html += '<div class="mp-card-bottom"><div class="mp-card-meta">';
  html += '<span class="mp-card-author">by ' + escapeHtml(item.author) + "</span>";
  // The count the app shows, in the app's words: a download arrow and the number, hidden at zero
  // so a new add-on does not read "0 installs".
  if (item.install_count > 0) {
    html += '<span class="mp-card-installs" title="Installed ' + item.install_count.toLocaleString() +
      " time" + (item.install_count === 1 ? "" : "s") + '">' +
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 21h14"/></svg>' +
      item.install_count.toLocaleString() + " install" + (item.install_count === 1 ? "" : "s") + "</span>";
  }
  if (isPrivate) {
    html += '<span class="mp-exclusive-badge" title="Shared privately with your account">' +
      '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' +
      "Exclusive</span>";
  }
  html += "</div>";
  if (detail) {
    html += '<button type="button" class="mp-card-link mp-card-expand" aria-expanded="false">View Details &rarr;</button>';
  }
  html += "</div></article>";
  return html;
}

