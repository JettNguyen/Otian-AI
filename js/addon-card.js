/* ========================================
   Otian AI | The add-on catalog's shape
   js/addon-card.js

   One add-on as the site reads it: `normalize()` turns a store document into a manifest with
   every field defaulted, and the helpers below say its parts in words. Pure, with no DOM, no
   network and no Firebase.

   Two callers, both in Node. scripts/sync-public-catalog.mjs snapshots the public store THROUGH
   normalize(), so a field missing here is a field missing from data/public-catalog.json however
   faithfully the store holds it. scripts/store-render.mjs draws the store's pages from that
   snapshot (scripts/gen-marketplace.mjs).

   Until October 7, 2026 this file also drew the browse page's card, for the generator and for the
   browser at once, because js/marketplace.js redrew the whole grid from Firestore on every load.
   The store shows the public shelf only now and its pages are complete as written, so the card and
   that script are gone; their code is in the git history before the commit that removed them.
   ======================================== */

/* Render order = the order the user asked for: Personalities, Skills, Routines.
   `coll` is the Firestore subcollection name; `kind` is what the catalog document calls itself.

   `shelf` is what a shopper sees, and it is not always `kind`. The `subagents` collection is
   shown as a skill: the two differ in how the runtime calls them, which is a fact about our
   code and never a question to put to somebody at a shelf. The collection, the kind and the
   install path are all untouched; only the word and the color collapse. */
export var COLLECTIONS = [
  { coll: "personalities", kind: "personality", shelf: "personality", label: "Personality", plural: "Personalities" },
  { coll: "skills",        kind: "skill",       shelf: "skill",       label: "Skill",       plural: "Skills" },
  { coll: "subagents",     kind: "specialist",  shelf: "skill",       label: "Skill",       plural: "Skills" },
  { coll: "routines",      kind: "routine",     shelf: "routine",     label: "Routine",     plural: "Routines" },
];

/* Friendly names for integration slugs, for the "Works with" list in a sheet's More about it.
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
    // A capability the owner has to switch on, not an account to connect, so it is kept apart
    // from required_integrations and rendered as a sentence rather than a chip: the switch is
    // half the fact and what the agent will not do on a site is the other half.
    // scripts/sync-public-catalog.mjs snapshots the store THROUGH this function, so a field
    // missing here is a field missing from the page, however faithfully the store holds it.
    required_screen: Array.isArray(data.required_screen) ? data.required_screen : [],
    required_skill: data.required_skill || "",
    preview_exchanges: Array.isArray(data.preview_exchanges) ? data.preview_exchanges : [],
    visibility: data.visibility === "private" ? "private" : "public",
  };
}
