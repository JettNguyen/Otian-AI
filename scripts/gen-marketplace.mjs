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

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PAGE = path.join(ROOT, "skills-marketplace", "browse", "index.html");

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

  if (have === wanted) {
    console.log(`gen-marketplace: clean. ${items.length} public add-ons in the page.`);
    return 0;
  }

  if (check) {
    const shipped = (have.match(/<article class="mp-product-card"/g) || []).length;
    console.log(
      "gen-marketplace: skills-marketplace/browse/ is out of date.\n\n" +
      `  in the page:   ${shipped} add-on card(s)\n` +
      `  in the catalog: ${items.length} public add-on(s)\n\n` +
      "Run: node scripts/gen-marketplace.mjs"
    );
    return 1;
  }

  fs.writeFileSync(PAGE, html.slice(0, start) + wanted + html.slice(end), "utf8");
  console.log(`gen-marketplace: wrote ${items.length} add-on cards into skills-marketplace/browse/.`);
  return 0;
}

process.exit(main());
