/* ========================================
   Otian AI | Marketplace catalog reader
   js/catalog.js

   The live add-on catalog from Firestore (project archie-77170), the same store the Archie desktop
   app reads. Shared by the marketplace browse page and by "Archie on your phone", which both answer
   the same question and must never disagree about what is in the store.

   VISIBILITY IS THE PART THAT IS EASY TO GET WRONG. Firestore security rules are NOT filters: a
   query that would return any single unreadable document is rejected outright, not trimmed. So the
   catalog cannot be fetched in one pass. It takes two scoped queries whose results are both wholly
   readable: the public store (`visibility == "public"`) and, when signed in, the private items
   shared with this account (`audience_uids array-contains uid`). Merging happens here. Never
   replace this with an unfiltered read; it will fail for everyone the moment one private item
   exists.

   Extracted from js/marketplace.js when the phone page needed the same data. Keep the shape in step
   with `data/marketplace/**` in the Archie repo, which is what CI seeds into these collections.
   ======================================== */

import {
  getFirestore, collection, query, where, getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/** Every collection the store sells from, with the names each side uses.
 *
 *  `coll` is the Firestore subcollection; `kind` is what the document calls itself; `shelf` is
 *  what a shopper sees. A `subagents` document is shown as a skill: it differs from a skill in
 *  how the runtime calls it, not in what it does for the person buying it, so the store offers
 *  one word. The collection and the kind are unchanged, because install still needs both. */
export const COLLECTIONS = [
  { coll: "personalities", kind: "personality", shelf: "personality", label: "Personality", plural: "Personalities" },
  { coll: "skills", kind: "skill", shelf: "skill", label: "Skill", plural: "Skills" },
  { coll: "subagents", kind: "specialist", shelf: "skill", label: "Skill", plural: "Skills" },
  { coll: "routines", kind: "routine", shelf: "routine", label: "Routine", plural: "Routines" },
];

/** The shelf a kind sits on. Anything a shopper sorts, counts or filters by goes through here. */
export function shelfKind(kind) {
  const c = COLLECTIONS.find((x) => x.kind === kind);
  return c ? c.shelf : kind;
}

/** One catalog item, with every field defaulted so no caller has to guard. */
function normalize(kind, id, data) {
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
    required_variables: Array.isArray(data.required_variables) ? data.required_variables : [],
    required_skill: data.required_skill || "",
    preview_exchanges: Array.isArray(data.preview_exchanges) ? data.preview_exchanges : [],
    visibility: data.visibility === "private" ? "private" : "public",
  };
}

function itemsQuery(db, coll, clause) {
  return getDocs(query(collection(db, "marketplace", coll, "items"), clause));
}

function fetchScoped(db, clause, tolerateFailure) {
  return Promise.all(COLLECTIONS.map(function (c) {
    return itemsQuery(db, c.coll, clause)
      .then(function (snap) {
        var out = [];
        snap.forEach(function (d) { out.push(normalize(c.kind, d.id, d.data())); });
        return out;
      })
      .catch(function (e) {
        // The private pass is allowed to fail (signed out, or rules tightened); the public one is
        // not, because silently showing an empty store looks like an empty store.
        if (tolerateFailure) return [];
        throw e;
      });
  })).then(function (groups) {
    return groups.reduce(function (a, b) { return a.concat(b); }, []);
  });
}

/**
 * The whole catalog this viewer is allowed to see.
 *
 * @param {import("firebase/app").FirebaseApp} app  the initialised Firebase app
 * @param {string|null} uid  signed-in user, or null for the public store alone
 * @returns {Promise<Array>} every item, public first then private, deduplicated by kind+id
 */
export function loadCatalog(app, uid) {
  const db = getFirestore(app);
  return Promise.all([
    fetchScoped(db, where("visibility", "==", "public"), false),
    uid ? fetchScoped(db, where("audience_uids", "array-contains", uid), true) : Promise.resolve([]),
  ]).then(function (pair) {
    const seen = new Set();
    const out = [];
    // Public first, so an item that is somehow in both keeps its public form and no card appears
    // twice.
    pair[0].concat(pair[1]).forEach(function (item) {
      const key = item.kind + ":" + item.id;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(item);
    });
    return out;
  });
}
