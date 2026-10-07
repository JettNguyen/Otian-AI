/* ========================================
   Otian AI | Add-on faces
   js/faces.js

   A face for every add-on: a mark for what it is about, on a field in a color. This is the Archie
   app's iconography (src/app/faces.ts in the Archie repo), carried over so the store on the site
   reads the way the store in the app does: by shape and color first, words last. The marks, the
   assignments and the rules are the app's; only the rendering is the site's.

   THE RULES, ALL THE APP'S:

   * The mark is shared, not per add-on, and assigned by subject. Two add-ons wearing the same
     mark says they are about the same thing. There were 27 marks until October 7, 2026, when the
     app drew thirty more so an area page in the store is not one shape repeated.
   * Inside the store, color is the part of life: a mark sits on its area's hue (the browse pages
     under skills-marketplace/browse/, drawn by scripts/gen-marketplace.mjs from data/areas.json).
     Everywhere else color is the kind: terracotta a skill, teal a routine, plum a personality,
     which is what faceHtml() below paints, for the homepage's coverage grid. The two never share
     a screen, so one color never says two things at once.
   * Personalities have no entry. All of them are voices, so a mark would be the same speech
     bubble on every one; in the store each wears an Ember face of its own instead.

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
  receipt: ["M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5z", "M9 8h6", "M9 11.5h6", "M9 15h3.5"],
  tag: ["M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.4 7.4a1.6 1.6 0 0 1 0 2.3l-7.4 7.4a1.6 1.6 0 0 1-2.3 0l-7.2-7.2a1 1 0 0 1-.3-.7z", "M8.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"],
  target: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"],
  bank: ["M3.5 9 12 4l8.5 5z", "M6 11.5v5.5", "M10 11.5v5.5", "M14 11.5v5.5", "M18 11.5v5.5", "M3.5 20h17"],
  store: ["M4.5 11v9h15v-9", "M3 9.5 4.8 4h14.4L21 9.5", "M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0", "M10 20v-4.5h4V20"],
  trend: ["M3 17.5 9 11.5l4 4L21 7.5", "M15.5 7.5H21V13"],
  pie: ["M10.5 5.1A7.5 7.5 0 1 0 18.9 13.5h-8.4z", "M13.5 2.5a8 8 0 0 1 8 8h-8z"],
  wallet: ["M3.5 7.5V17a2.5 2.5 0 0 0 2.5 2.5h12.5a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5H6A2.5 2.5 0 0 1 3.5 5a2.5 2.5 0 0 1 2.5-2.5h10.5v5", "M16.5 12.5h3.5v3h-3.5a1.5 1.5 0 0 1 0-3z"],
  coins: ["M12 3.5c4.1 0 7.5 1.3 7.5 3s-3.4 3-7.5 3-7.5-1.3-7.5-3 3.4-3 7.5-3z", "M4.5 6.5v5.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6.5", "M4.5 12v5.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V12"],
  inbox: ["M3.5 13.5 6 5.5h12l2.5 8", "M3.5 13.5V18a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-4.5", "M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5"],
  hourglass: ["M6.5 3.5h11", "M6.5 20.5h11", "M8 3.5c0 4.5 4 5 4 8.5 0-3.5 4-4 4-8.5", "M8 20.5c0-4.5 4-5 4-8.5 0 3.5 4 4 4 8.5"],
  board: ["M5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4z", "M8.5 8v8", "M12 8v4.5", "M15.5 8v6"],
  video: ["M4.5 6.5h9a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 3 16V8a1.5 1.5 0 0 1 1.5-1.5z", "m15 10.5 6-3.5v10l-6-3.5"],
  phone: ["M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5z", "M10.5 18.5h3"],
  heart: ["M12 20s-8-4.8-8-10.4A4.4 4.4 0 0 1 12 7.1a4.4 4.4 0 0 1 8 2.5C20 15.2 12 20 12 20z"],
  dumbbell: ["M6.5 7v10", "M17.5 7v10", "M3.5 9.5v5", "M20.5 9.5v5", "M6.5 12h11"],
  moon: ["M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z"],
  bulb: ["M9.5 17.5h5", "M10.5 20.5h3", "M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2v1.5h5V16c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"],
  key: ["M7.5 12.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M10.3 13.7 20 4", "m16.5 7.5 2.5 2.5", "m13.8 10.2 2 2"],
  wrench: ["M15.5 3.5a5 5 0 0 0-4.6 6.9l-7.1 7.1a1.9 1.9 0 0 0 2.7 2.7l7.1-7.1a5 5 0 0 0 6.9-4.6l-3 3-3-.5-.5-3z"],
  cap: ["M2.5 9 12 4.5 21.5 9 12 13.5z", "M6.5 11v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11", "M21.5 9v5"],
  question: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4", "M12 16.8v.2"],
  megaphone: ["M4 9.5h3.5L16 5v14l-8.5-4.5H4z", "M7.5 14.5 9 19.5h2.5l-1.4-4.2", "M19 9a4 4 0 0 1 0 6"],
  funnel: ["M3.5 4.5h17l-6.5 8v6l-4 2v-8z"],
  star: ["M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"],
  compass: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "m15.5 8.5-2 5-5 2 2-5z"],
  bookmark: ["M7 3.5h10a1 1 0 0 1 1 1v16l-6-4-6 4v-16a1 1 0 0 1 1-1z"],
  sun: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2.5v2", "M12 19.5v2", "M2.5 12h2", "M19.5 12h2", "m5.3 5.3 1.4 1.4", "m17.3 17.3 1.4 1.4", "m5.3 18.7 1.4-1.4", "m17.3 6.7 1.4-1.4"],
  folder: ["M3.5 6.5A1.5 1.5 0 0 1 5 5h4.5l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5v9.5A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5z"],
  flag: ["M5 21V4", "M5 4.5h12l-2.5 4 2.5 4H5"],
};

/** Which mark an add-on wears, keyed `kind:id` with the site's own kind names, so "specialist"
 *  appears here and "subagent" never does. Assigned by subject, not by the manifest's category:
 *  two categories hold most of the catalog, and a mark shared by sixty things is not a mark. */
export const FACE = {
  // ---- Skills ----
  "skill:bill-tracker": "receipt",
  "skill:birthday-keeper": "gift",
  "skill:calendar-management": "calendar",
  "skill:call-intelligence": "phone",
  "skill:car-keeper": "car",
  "skill:card-rewards": "money",
  "skill:circle-back": "people",
  // The pie rather than "doc", which skill:statement-collector already wears: what arrives is a
  // statement, but what this one hands back is the spending inside it, cut into where it went.
  "skill:clean-books": "pie",
  "skill:client-brain": "people",
  "skill:commitment-keeper": "flag",
  "skill:class-planner": "calendar",
  "skill:course-companion": "cap",
  // The question mark, because what this keeps is the answers to the ones customers ask.
  "skill:common-questions": "question",
  // The funnel, like the other add-ons about leads coming in. Job Hunt took the magnifier
  // instead because a hunt is a search; a seller already knows who their leads are and is
  // watching them narrow toward a sale. The bar chart stays with the pipeline reports.
  "skill:lead-desk": "funnel",
  "skill:daily-trivia": "spark",
  "skill:deal-desk": "chart",
  "skill:email-manager": "mail",
  "skill:engagement-scoring": "star",
  "skill:find-a-time": "calendar",
  "skill:fireflies": "mic",
  "skill:flight-check-in": "plane",
  "skill:form-filler": "doc",
  "skill:github-keeper": "code",
  "skill:gohighlevel": "chart",
  "skill:google-tasks": "list",
  "skill:habit-tracker": "target",
  "skill:health-record": "heart",
  // The two smart-home skills take different marks on purpose. Lights are the bulb; the house
  // itself, which is what house-watch reads, is the house.
  "skill:home-lights": "bulb",
  "skill:home-maintenance": "wrench",
  "skill:home-workout": "dumbbell",
  "skill:honest-week": "clock",
  // The tray rather than the envelope: this one sorts what has already arrived, where Email
  // Manager reads and answers one message at a time.
  "skill:inbox-rules": "inbox",
  "skill:house-watch": "home",
  // The magnifier, and it is the literal reading rather than a stretch: a job hunt is a search.
  // "chart" was the other candidate, because the funnel is what this skill has that Waiting On
  // does not, but a bar chart on a card reads as reporting, and somebody scanning a shelf for the
  // thing that helps them find work is not looking for a report.
  "skill:job-hunt": "search",
  "skill:lead-gen-playbook": "funnel",
  // The car, not the clock. The answer it gives is a time, but what it knows about is the drive.
  "skill:leave-time": "car",
  "skill:learning-coach": "bulb",
  "skill:market-digest": "trend",
  "skill:meal-planner": "food",
  "skill:medication-reminder": "pill",
  "skill:meeting-prep": "people",
  "skill:money-in-out": "wallet",
  "skill:my-classes": "book",
  "skill:my-documents": "folder",
  "skill:new-teammate-welcome": "people",
  "skill:news-briefing": "news",
  "skill:notion-keeper": "code",
  // The ten connector keepers, faced by the job rather than by the service, because a person
  // scanning the grid is looking for what it does and has usually forgotten which app it was.
  "skill:booking-watch": "calendar",
  "skill:acuity-keeper": "calendar",
  "skill:revenue-watch": "coins",
  "skill:square-keeper": "store",
  "skill:gitlab-keeper": "code",
  "skill:linear-keeper": "board",
  "skill:airtable-keeper": "board",
  "skill:ynab-keeper": "pie",
  "skill:lunch-money-keeper": "pie",
  "skill:splitwise-keeper": "people",
  "skill:readwise-keeper": "bookmark",
  "skill:zotero-keeper": "bookmark",
  "skill:mercury-watch": "bank",
  "skill:campaign-watch": "megaphone",
  "skill:outreach-studio": "mail",
  "skill:owed-to-customers": "hourglass",
  "skill:package-tracker": "parcel",
  "skill:paperwork": "doc",
  "skill:personal-journal": "pen",
  "skill:plant-pet-care": "leaf",
  "skill:price-watch": "tag",
  "skill:project-desk": "board",
  "skill:reading-list": "bookmark",
  "skill:reply-helper": "voice",
  // The pen, the same mark specialist:writer and skill:personal-journal wear. This one writes.
  "skill:writing-desk": "pen",
  // The megaphone rather than the pen, and the pair is deliberate: Writing Desk writes a piece
  // and this one writes what the business says out loud in public. Same trade, different
  // register, and on a shelf the two marks are what tells them apart.
  "skill:ready-to-post": "megaphone",
  "skill:social-posting": "megaphone",
  "skill:savings-goals": "target",
  "skill:school-family": "people",
  "skill:sports-follow": "ball",
  "skill:statement-collector": "doc",
  "skill:stay-in-touch": "phone",
  // A speech bubble, not the envelope. Email Manager and Text Replies do the same job on different
  // wires, and the face is the thing that tells them apart on a shelf where the words are small.
  "skill:text-replies": "voice",
  "skill:strategist": "compass",
  "skill:task-manager": "list",
  "skill:the-handover": "key",
  "skill:todoist": "list",
  "skill:trip-planner": "plane",
  "skill:video-synthesizer": "video",
  "skill:waiting-on": "hourglass",
  "skill:warranty-returns": "parcel",
  "skill:whos-got-this": "flag",
  "skill:word-of-the-day": "book",

  // ---- Specialists ----
  "specialist:deep-researcher": "search",
  "specialist:prospector": "search",
  "specialist:researcher": "search",
  "specialist:writer": "pen",

  // ---- Routines ----
  // "search", the same mark skill:job-hunt wears, because this is that skill keeping its own list
  // up to date rather than a separate job. Same reasoning as routine:statement-round below.
  "routine:application-sweep": "search",
  "routine:bill-reminders": "receipt",
  "routine:birthday-heads-up": "gift",
  "routine:car-checkup": "car",
  "routine:care-reminders": "leaf",
  "routine:check-in-window": "plane",
  "routine:circle-back-nudge": "people",
  "routine:class-week": "calendar",
  "routine:commitment-sweep": "flag",
  "routine:coursework-due": "book",
  "routine:daily-briefing": "sun",
  "routine:daily-pipeline-report": "chart",
  "routine:daily-team-summary": "list",
  "routine:daily-task-digest": "list",
  "routine:daily-word": "book",
  "routine:evening-reflection": "moon",
  "routine:fireflies-sync": "mic",
  // The same mark as the Meeting Recap it stands in for: what it is made of is still the
  // recorded call, whatever it does with one afterwards.
  "routine:meeting-desk-sync": "mic",
  "routine:habit-check-in": "target",
  "routine:health-month": "pulse",
  "routine:home-checkup": "wrench",
  "routine:inbox-sweep": "inbox",
  "routine:market-morning": "trend",
  // The car, matching skill:leave-time, for the same reason meeting-briefing is not a clock: the
  // early hour is when it runs, and the journeys are what it is about.
  "routine:leave-time-morning": "car",
  "routine:leave-time-traffic": "car",
  "routine:med-reminders": "pill",
  // "people" like skill:meeting-prep, not "clock". What it sends is the prep for whoever you are
  // about to sit with; the half hour is when, not what.
  "routine:meeting-briefing": "people",
  "routine:morning-brief": "sun",
  "routine:morning-news": "news",
  // The bulb, matching skill:home-lights, because what this routine switches off is the lights.
  "routine:nightly-sweep": "bulb",
  "routine:price-check": "tag",
  "routine:project-check": "board",
  "routine:quarterly-card-categories": "money",
  "routine:receipt-sweep": "receipt",
  // Each of these four wears its own skill's mark, the same reasoning as routine:statement-round
  // below: a companion routine is that skill keeping its own appointment, not a separate subject.
  "routine:revenue-digest": "coins",
  "routine:lead-sweep": "funnel",
  "routine:next-piece": "pen",
  "routine:queue-check": "megaphone",
  "routine:question-sweep": "question",
  "routine:campaign-check": "megaphone",
  "routine:reply-watch": "hourglass",
  "routine:return-window-watch": "parcel",
  "routine:scheduling-watch": "calendar",
  "routine:school-week": "people",
  "routine:sports-digest": "ball",
  // "doc", the same mark skill:statement-collector wears, because this is that skill keeping its
  // own appointment: the thing that arrives is the statement, not the money in it.
  "routine:statement-round": "doc",
  "routine:stay-in-touch-nudge": "phone",
  "routine:study-review": "bulb",
  "routine:term-dates": "clock",
  "routine:team-standup": "news",
  "routine:trivia-time": "spark",
  "routine:vendor-scorecard": "star",
  "routine:week-check": "clock",
  "routine:weekly-pipeline-review": "chart",
  "routine:weekly-review": "clock",
  "routine:weekly-strategy": "compass",
  "routine:workout-nudge": "dumbbell",
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
 * An add-on's face as HTML: its mark on a field in its kind's color.
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
