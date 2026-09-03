/* ========================================
   Otian AI | Add-on faces
   js/faces.js

   A face for every add-on: a mark for what it is about, on a field in the colour of what it is.
   This is the Archie app's iconography (src/app/faces.ts in the Archie repo), carried over so the
   store on the site reads the way the store in the app does: by shape and colour first, words
   last. The marks, the assignments and the rules are the app's; only the rendering is the site's.

   THREE RULES, ALL THE APP'S:

   * The mark is shared, not per add-on. Two money add-ons wearing the same banknote is the
     system working: it says they are about the same thing, which is true.
   * Colour is the kind and never the subject. Terracotta is a skill, teal a routine, plum a
     personality, and each of those already means "from the marketplace" everywhere on the site.
     Tinting by subject would put a second meaning on the same colour. So the field takes the
     kind's tint and the glyph carries the subject.
   * Personalities have no entry. All of them are voices, so all of them fall through to the
     kind's default, the speech bubble, and what tells them apart on a card is the tagline.

   KEEP IN STEP WITH THE APP. `GLYPH_PATHS` and `FACE` are copied from faces.ts, and
   scripts/check-faces.py fails when they drift from the Archie checkout on this computer. A new
   add-on published to the store lands here before it lands in a shipped app, so an id missing
   from the map is normal for a few days and falls back by kind; the checker reports it so it does
   not stay that way.
   ======================================== */

/** Each mark as the `d` of one or more paths, drawn on a 24 by 24 box and stroked, never filled.
 *  Stroked because the field behind them is a 13% wash: a filled shape on that reads as a blot at
 *  small sizes, while a 1.6px stroke keeps its shape all the way down. */
export const GLYPH_PATHS = {
  money: ["M4 6.5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z", "M2 11h20", "M6 14.5h4"],
  home: ["M3 10.5 12 3l9 7.5", "M5.5 9.5V20h13V9.5", "M10 20v-5h4v5"],
  calendar: ["M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M3 11h18", "M8 3v4", "M16 3v4"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7.5V12l3 2"],
  pulse: ["M2.5 12.5h4l2-5 3.5 10 2.5-6 1.5 3h5.5"],
  pill: ["M16.2 4.3a4.7 4.7 0 0 1 0 6.6l-5.3 5.3a4.7 4.7 0 0 1-6.6-6.6l5.3-5.3a4.7 4.7 0 0 1 6.6 0z", "m7.3 7.6 6.6 6.6"],
  mail: ["M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "m3.5 7.5 8.5 6 8.5-6"],
  parcel: ["m12 3 8 4.5v9L12 21l-8-4.5v-9z", "m4 7.5 8 4.5 8-4.5", "M12 12v9"],
  doc: ["M6.5 3H13l5 5v13H6.5z", "M13 3v5h5", "M9.5 13h5", "M9.5 16.5h3.5"],
  people: ["M9 4a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 9 4z", "M3.5 19.5a5.5 5.5 0 0 1 11 0", "M16 6.6a3.2 3.2 0 0 1 0 6.2", "M17.5 19.5a5.6 5.6 0 0 0-2.2-4.4"],
  gift: ["M4 11.5h16V20H4z", "M3 8h18v3.5H3z", "M12 8v12", "M12 8S9.6 3.6 7.6 5.3 12 8 12 8z", "M12 8s2.4-4.4 4.4-2.7S12 8 12 8z"],
  food: ["M4 11h16a8 8 0 0 1-16 0z", "M3 19.5h18", "M9 7c0-1.6 1-2.1 1-3.6", "M13 7c0-1.6 1-2.1 1-3.6"],
  car: ["M5 13.5 6.6 8.8a2 2 0 0 1 1.9-1.3h7a2 2 0 0 1 1.9 1.3L19 13.5", "M3.5 13.5h17v4h-17z", "M6.5 17.5V19.5", "M17.5 17.5V19.5"],
  leaf: ["M12 21v-6.5", "M12 14.5c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6z", "M12 16.5c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5z"],
  book: ["M12 6.5C10.5 5 8.3 4.3 5 4.5v13c3.3-.2 5.5.5 7 2 1.5-1.5 3.7-2.2 7-2v-13c-3.3-.2-5.5.5-7 2z", "M12 6.5v14"],
  pen: ["M4 20.5 5 16 16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z", "m14.5 6.5 3 3", "m4 20.5 4-1.5"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "m20 20-3.9-3.9"],
  news: ["M4 5h13v14.5H4z", "M17 8.5h3v9a2 2 0 0 1-3 1.7", "M7 9h7", "M7 12.5h7", "M7 16h4"],
  ball: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 3c3 3.5 3 14.5 0 18", "M12 3c-3 3.5-3 14.5 0 18", "M3.4 9h17.2", "M3.4 15h17.2"],
  list: ["M9 4.5H7.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H15", "M9 3h6v3H9z", "m9 13 2 2 4-4"],
  voice: ["M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H9.5L5 19.5z"],
  mic: ["M12 3.5a2.7 2.7 0 0 0-2.7 2.7v5.4a2.7 2.7 0 0 0 5.4 0V6.2A2.7 2.7 0 0 0 12 3.5z", "M6 11a6 6 0 0 0 12 0", "M12 17v3.5", "M9 20.5h6"],
  plane: ["M21 3 3 10.5l7 3 3 7z", "M21 3 10 13.5"],
  spark: ["M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9z", "M18.5 4v2.5", "M19.75 5.25h-2.5"],
  code: ["m8.5 8.5-4 3.5 4 3.5", "m15.5 8.5 4 3.5-4 3.5", "m13.5 5.5-3 13"],
  chart: ["M4 3.5v17h16", "M8 17.5v-5", "M12.5 17.5v-9", "M17 17.5v-6"],
  addon: ["M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M9.75 9.75h4.5v4.5h-4.5z"],
};

/** Which mark an add-on wears, keyed `kind:id` with the site's own kind names, so "specialist"
 *  appears here and "subagent" never does. Assigned by subject, not by the manifest's category:
 *  two categories hold most of the catalog, and a mark shared by sixty things is not a mark. */
export const FACE = {
  // ---- Skills ----
  "skill:bill-tracker": "money",
  "skill:birthday-keeper": "gift",
  "skill:calendar-management": "calendar",
  "skill:call-intelligence": "mic",
  "skill:car-keeper": "car",
  "skill:card-rewards": "money",
  "skill:circle-back": "people",
  "skill:clean-books": "money",
  "skill:client-brain": "people",
  "skill:commitment-keeper": "list",
  "skill:course-companion": "book",
  "skill:daily-trivia": "spark",
  "skill:deal-desk": "chart",
  "skill:email-manager": "mail",
  "skill:engagement-scoring": "chart",
  "skill:find-a-time": "calendar",
  "skill:fireflies": "mic",
  "skill:form-filler": "doc",
  "skill:github-keeper": "code",
  "skill:gohighlevel": "chart",
  "skill:google-tasks": "list",
  "skill:habit-tracker": "pulse",
  "skill:health-record": "pulse",
  "skill:home-lights": "spark",
  "skill:home-maintenance": "home",
  "skill:home-workout": "pulse",
  "skill:honest-week": "clock",
  "skill:inbox-rules": "mail",
  "skill:house-watch": "home",
  "skill:lead-gen-playbook": "chart",
  "skill:learning-coach": "book",
  "skill:market-digest": "chart",
  "skill:meal-planner": "food",
  "skill:medication-reminder": "pill",
  "skill:meeting-prep": "people",
  "skill:money-in-out": "money",
  "skill:my-documents": "doc",
  "skill:new-teammate-welcome": "people",
  "skill:news-briefing": "news",
  "skill:notion-keeper": "code",
  "skill:booking-watch": "calendar",
  "skill:revenue-watch": "money",
  "skill:gitlab-keeper": "code",
  "skill:linear-keeper": "list",
  "skill:airtable-keeper": "list",
  "skill:ynab-keeper": "chart",
  "skill:lunch-money-keeper": "chart",
  "skill:splitwise-keeper": "people",
  "skill:readwise-keeper": "book",
  "skill:zotero-keeper": "search",
  "skill:mercury-watch": "money",
  "skill:campaign-watch": "mail",
  "skill:outreach-studio": "mail",
  "skill:owed-to-customers": "mail",
  "skill:package-tracker": "parcel",
  "skill:paperwork": "doc",
  "skill:personal-journal": "pen",
  "skill:plant-pet-care": "leaf",
  "skill:price-watch": "money",
  "skill:project-desk": "people",
  "skill:reading-list": "book",
  "skill:reply-helper": "voice",
  "skill:savings-goals": "money",
  "skill:school-family": "people",
  "skill:sports-follow": "ball",
  "skill:statement-collector": "doc",
  "skill:stay-in-touch": "mail",
  "skill:text-replies": "voice",
  "skill:strategist": "chart",
  "skill:task-manager": "list",
  "skill:the-handover": "home",
  "skill:todoist": "list",
  "skill:trip-planner": "plane",
  "skill:video-synthesizer": "mic",
  "skill:waiting-on": "mail",
  "skill:warranty-returns": "parcel",
  "skill:whos-got-this": "list",
  "skill:word-of-the-day": "book",

  // ---- Specialists ----
  "specialist:deep-researcher": "search",
  "specialist:prospector": "search",
  "specialist:researcher": "search",
  "specialist:writer": "pen",

  // ---- Routines ----
  "routine:bill-reminders": "money",
  "routine:birthday-heads-up": "gift",
  "routine:car-checkup": "car",
  "routine:care-reminders": "leaf",
  "routine:circle-back-nudge": "people",
  "routine:commitment-sweep": "list",
  "routine:daily-briefing": "news",
  "routine:daily-pipeline-report": "chart",
  "routine:daily-team-summary": "list",
  "routine:daily-task-digest": "list",
  "routine:daily-word": "book",
  "routine:evening-reflection": "pen",
  "routine:fireflies-sync": "mic",
  "routine:habit-check-in": "pulse",
  "routine:health-month": "pulse",
  "routine:home-checkup": "home",
  "routine:inbox-sweep": "mail",
  "routine:market-morning": "chart",
  "routine:med-reminders": "pill",
  "routine:meeting-briefing": "people",
  "routine:morning-brief": "news",
  "routine:morning-news": "news",
  "routine:nightly-sweep": "spark",
  "routine:price-check": "money",
  "routine:project-check": "pulse",
  "routine:quarterly-card-categories": "money",
  "routine:receipt-sweep": "money",
  "routine:campaign-check": "mail",
  "routine:reply-watch": "mail",
  "routine:return-window-watch": "parcel",
  "routine:scheduling-watch": "calendar",
  "routine:school-week": "people",
  "routine:sports-digest": "ball",
  "routine:statement-round": "doc",
  "routine:stay-in-touch-nudge": "mail",
  "routine:study-review": "book",
  "routine:team-standup": "news",
  "routine:trivia-time": "spark",
  "routine:vendor-scorecard": "chart",
  "routine:week-check": "clock",
  "routine:weekly-pipeline-review": "chart",
  "routine:weekly-review": "clock",
  "routine:weekly-strategy": "chart",
  "routine:workout-nudge": "pulse",
};

/** What a kind wears when nothing more specific is written down: every personality, and any
 *  add-on published since this file was last brought in step with the app. */
const BY_KIND = {
  skill: "addon",
  specialist: "search",
  routine: "clock",
  personality: "voice",
};

/** The mark for one add-on. Falls back by kind, so a face is never missing, only ever generic. */
export function faceOf(kind, id) {
  return FACE[kind + ":" + id] || BY_KIND[kind] || "addon";
}

/** The mark a category filter wears. The app has no category marks (its shelves replaced the
 *  filter rail), so this is the site's own use of the app's set: one mark per category, chosen
 *  for the kind of thing most of that category is about. A category the app adds later shows no
 *  mark rather than a wrong one. */
export const CATEGORY_FACE = {
  productivity: "list",
  personal: "home",
  finance: "money",
  sales: "chart",
  communication: "mail",
  research: "search",
  operations: "clock",
  custom: "addon",
};

/* How big a face is, by where it sits. The stroke thins as the field grows, so a mark keeps the
   same visual weight at every size instead of getting heavier as it gets bigger. */
const SIZES = {
  /** A pack's contents list, and a store row on the phone page. */
  row: { cls: "mp-face--row", stroke: 1.7 },
  /** A product card, and a detail page header. */
  card: { cls: "mp-face--card", stroke: 1.6 },
};

/** The SVG for one mark, as a string. `stroke` in px on the 24-box; `cls` on the svg element. */
export function glyphSvg(glyph, stroke, cls) {
  var paths = GLYPH_PATHS[glyph] || GLYPH_PATHS.addon;
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + stroke +
    '" stroke-linecap="round" stroke-linejoin="round"' + (cls ? ' class="' + cls + '"' : "") +
    ' aria-hidden="true">' +
    paths.map(function (d) { return '<path d="' + d + '"/>'; }).join("") +
    "</svg>";
}

/**
 * An add-on's face as HTML: its mark on a field in its kind's colour.
 *
 * The field carries `mp-face--<kind>` so it tints itself wherever it lands, with no need for a
 * card around it to say what kind it is. Decorative: the kind badge beside it already says the
 * kind in words, and the subject is in the name.
 */
export function faceHtml(kind, id, size) {
  var s = SIZES[size] || SIZES.card;
  var tint = kind === "specialist" ? "skill" : kind;
  return '<span class="mp-face ' + s.cls + " mp-face--" + tint + '" aria-hidden="true">' +
    glyphSvg(faceOf(kind, id), s.stroke) + "</span>";
}

/** The mark inside a category filter pill, or an empty string for a category with no mark. */
export function categoryGlyphHtml(category) {
  var glyph = CATEGORY_FACE[category];
  return glyph ? glyphSvg(glyph, 2, "mp-pill-glyph") : "";
}
