/* Write the public add-on catalog into skills-marketplace/browse/ as static HTML.
 *
 * THE BUG THIS FIXES. The browse page's grid was an empty <div id="mpProductGrid"></div> that
 * js/marketplace.js filled from Firestore on load. That is correct for a visitor and invisible
 * to everything else: a crawler, an answer engine, a link preview and anyone with JavaScript off
 * were served a page that announces "146 Verified Add-ons" in its stat row and then renders the
 * words "No add-ons match your filters." The largest thing this site has was, to all of them, a
 * blank page. A competitor with six integration pages was out-ranking a catalog of 146 real ones
 * because ours were not in the HTML.
 *
 * WHAT THIS DOES NOT CHANGE. Firestore is still the authority. js/marketplace.js still fetches on
 * load and still replaces the grid wholesale, because it is the only path that can see the
 * private add-ons shared with a signed-in account, and because an install count moves without a
 * site deploy. What ships in the markup is a snapshot of the public shelf: complete, correct, and
 * knowingly a moment old.
 *
 * WHY IT IS JAVASCRIPT AND NOT PYTHON LIKE THE OTHER SCRIPTS. Both paths have to produce the same
 * card. A second implementation of cardHtml() in Python is a second thing to keep in step with
 * the first, and this repo has a file (js/faces.js) whose whole header is about what happens when
 * two copies of one thing drift. So the renderer moved to js/addon-card.js, and this script
 * imports the very code the browser runs.
 *
 * Usage:
 *   node scripts/gen-marketplace.mjs           write the grid into the page
 *   node scripts/gen-marketplace.mjs --check   exit 1 if the page is out of date
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COLLECTIONS, normalize, cardHtml } from "../js/addon-card.js";
import { faceHtml } from "../js/faces.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PAGE = path.join(ROOT, "skills-marketplace", "browse", "index.html");
const HOME = path.join(ROOT, "index.html");
const SLOT = '<span class="cover-mark" data-face-slot>';

/* The catalog is authored in the Archie repo and seeded into Firestore by its own CI, exactly as
 * scripts/check-facts.py and scripts/check-faces.py already assume. Sitting beside this repo is
 * the arrangement both of those encode; without it there is nothing to generate from, and that is
 * a skip rather than a failure, because a machine that only has the site checkout is not broken. */
const CATALOG = path.join(path.dirname(ROOT), "Archie", "data", "marketplace");

/* The markers the grid lives between. Generated content sits inside a container that says so, so
 * that a person opening this page in an editor is not left wondering why 146 articles they cannot
 * find the author of are sitting in a hand-written file. */
const OPEN = '<div class="mp-product-grid fade-up delay-2" id="mpProductGrid">';
const CLOSE = "</div>";

/* The markers scripts/check-facts.py looks for. Inside them, a "$" is an add-on's own copy and
 * not a price this site charges: several manifests show a sample conversation ("Rent cleared
 * this morning at 6am for $1,450"), and FACTS.md governs what Otian says things cost, not the
 * illustrative figures in a product description written in another repo. Everything outside
 * these markers on this page is checked exactly as before, and the em-dash rule is not scoped
 * out at all: it applies here like it applies everywhere. */
const START_MARK = "<!-- GENERATED-CATALOG-START -->";
const END_MARK = "<!-- GENERATED-CATALOG-END -->";

const BANNER = `
          <!-- ==========================================================================
               GENERATED. Do not hand-edit: run \`node scripts/gen-marketplace.mjs\`.

               The public catalog, rendered by the same js/addon-card.js the browser runs, so a
               crawler, an answer engine and a reader with JavaScript off all see the shelf
               instead of the empty div that used to be here. js/marketplace.js replaces every
               card below on load with the live store, which is the authority and the only thing
               that can see private add-ons or a current install count.

               Sorted by name. The live grid defaults to most-installed, which cannot be known
               here: install_count is incremented by the backend and is not in the manifests.
               ========================================================================== -->`;

function readCatalog() {
  if (!fs.existsSync(CATALOG)) return null;
  const items = [];
  for (const c of COLLECTIONS) {
    const dir = path.join(CATALOG, c.coll);
    if (!fs.existsSync(dir)) return null;
    for (const file of fs.readdirSync(dir).sort()) {
      if (!file.endsWith(".json")) continue;
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      /* Absent means public: the same default the seeder and the store query use. A private
       * manifest is one client's own work or a testing account's, and it reaches an allowlisted
       * account through Firestore. It must never be in a file the whole internet can read. */
      if (data.visibility === "private") continue;
      items.push(normalize(c.kind, file.replace(/\.json$/, ""), data));
    }
  }
  /* Name order, not the page's default. See the banner above. */
  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

function render(items) {
  const cards = items
    .map((item) => "            " + cardHtml(item))
    .join("\n");
  return OPEN + BANNER + "\n          " + START_MARK + "\n" + cards +
    "\n          " + END_MARK + "\n        " + CLOSE;
}

function currentBlock(html) {
  const start = html.indexOf(OPEN);
  if (start === -1) throw new Error("mpProductGrid opening tag not found in " + PAGE);
  /* The grid holds <article> elements, which nest divs, so the first </div> after the opening tag
   * is not the closing one. Count depth instead. */
  let depth = 0;
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return { start, end: m.index + m[0].length };
  }
  throw new Error("mpProductGrid is never closed in " + PAGE);
}

/* The homepage's coverage grid names six real add-ons, and each of them already has a mark in
 * the app's own set. The copy stays in index.html, where it is written and edited; only the mark
 * is filled in here, keyed by the `data-face="kind:id"` on each row, so the six glyph paths are
 * not hand-copied into a third place after js/faces.js and the Archie repo. A row naming an id
 * that is not in the catalog is a mistake worth stopping for: it means the homepage is pointing
 * at an add-on nobody can install.
 *
 * Returns the page's new text, or throws. */
function renderHomeFaces(items) {
  const byKey = new Map(items.map((i) => [i.kind + ":" + i.id, i]));
  const html = fs.readFileSync(HOME, "utf8");
  const missing = [];
  let next = "";
  let at = 0;
  /* Counted, not asserted. Both messages below said "six marks" as a literal, and the coverage
     grid is four rows since the homepage's "Where it starts" section took the mail and calendar
     ones. A generator that reports a number it is not measuring is a generator that will keep
     reporting it after the next edit too. */
  let marks = 0;

  const ROW = /<li data-face="([^"]+)">/g;
  let row;
  while ((row = ROW.exec(html))) {
    const key = row[1];
    if (!byKey.has(key)) { missing.push(key); continue; }

    const slot = html.indexOf(SLOT, row.index);
    if (slot === -1) throw new Error("row " + key + " has no mark slot in index.html");

    /* The mark is itself spans inside spans, so the first </span> after the slot is not the
     * slot's own. Count depth, exactly as currentBlock() does for the grid's divs. Getting this
     * wrong is not a crash: it is a generator that rewrites a slightly different string every
     * run, so --check never goes green and the page churns on every commit. */
    const tags = /<span\b[^>]*>|<\/span>/g;
    tags.lastIndex = slot;
    let depth = 0;
    let end = -1;
    let m;
    while ((m = tags.exec(html))) {
      depth += m[0] === "</span>" ? -1 : 1;
      if (depth === 0) { end = m.index + m[0].length; break; }
    }
    if (end === -1) throw new Error("mark slot for " + key + " is never closed in index.html");

    const colon = key.indexOf(":");
    next += html.slice(at, slot) + SLOT +
      faceHtml(key.slice(0, colon), key.slice(colon + 1), "row") + "</span>";
    at = end;
    marks++;
  }
  next += html.slice(at);

  if (missing.length) {
    throw new Error("index.html names add-ons that are not in the catalog: " + missing.join(", "));
  }
  return { html, next, marks };
}

function main() {
  const check = process.argv.includes("--check");
  const items = readCatalog();

  if (items === null) {
    console.log("gen-marketplace: the Archie catalog is not beside this repo; nothing to do.");
    return 0;
  }

  const html = fs.readFileSync(PAGE, "utf8");
  const { start, end } = currentBlock(html);
  const wanted = render(items);
  const have = html.slice(start, end);

  const changed = have !== wanted;
  const home = renderHomeFaces(items);
  const homeChanged = home.html !== home.next;

  if (!changed && !homeChanged) {
    console.log(`gen-marketplace: clean. ${items.length} public add-ons in the page, ` +
      `${home.marks} marks on the homepage.`);
    return 0;
  }

  if (check) {
    const shipped = (have.match(/<article class="mp-product-card"/g) || []).length;
    console.log(
      "gen-marketplace: generated markup is out of date.\n\n" +
      (changed
        ? `  skills-marketplace/browse/: ${shipped} card(s) in the page, ` +
          `${items.length} public add-on(s) in the catalog\n`
        : "") +
      (homeChanged ? "  index.html: the coverage grid's marks have moved\n" : "") +
      "\nRun: node scripts/gen-marketplace.mjs"
    );
    return 1;
  }

  if (changed) {
    fs.writeFileSync(PAGE, html.slice(0, start) + wanted + html.slice(end), "utf8");
  }
  if (homeChanged) fs.writeFileSync(HOME, home.next, "utf8");
  console.log(
    `gen-marketplace: ${changed ? items.length + " add-on cards into skills-marketplace/browse/" : "browse page unchanged"}` +
    `, ${homeChanged ? home.marks + " marks into index.html" : "homepage unchanged"}.`
  );
  return 0;
}

process.exit(main());
