// Every text box on this site has to say what it is to something other than an eye.
//
// This site is 74 static pages with no build step and no framework, which means there is nothing
// between writing an `<input>` and shipping it. Twenty of them shipped named by their placeholder
// and nothing else, and a placeholder is not a name: it is deleted by the first keystroke, so a
// screen reader announces "edit text, blank" on a field the user has already half filled in, and
// there is no way back to what it was asking for.
//
// The pages it happened on are the ones nobody can skip: sign-in, password reset, the account
// screen, the security screen and the two-factor code boxes. That is the whole argument for
// checking it on every deploy rather than remembering.
//
// An accessible name here means one of three things, which is the same list the browser uses:
//   - a `<label for="...">` pointing at the field's id
//   - a `<label>` wrapped around the field
//   - `aria-label` or `aria-labelledby` on the field itself
// A `placeholder` is deliberately NOT on that list, even though browsers do fall back to it. The
// fallback is a last resort for the accessibility tree, not a design that works.
//
// Skipped, because none of them takes a name: hidden, submit, button, reset, image, checkbox and
// radio (a checkbox is virtually always wrapped in its label here, and the wrap check covers it),
// and anything with `display:none`, which is the spam honeypot on the questionnaire.
//
// Run: node scripts/check-input-labels.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

// Not published, so not checked. Kept in step with the "Withhold unpublished pages" step in
// .github/workflows/deploy.yml: if a directory is added there, add it here.
const UNPUBLISHED = ["business", "firebase-hosting", "node_modules", ".git"];

const NO_NAME_NEEDED = new Set(["hidden", "submit", "button", "reset", "image", "checkbox", "radio"]);

function pages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (UNPUBLISHED.includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) pages(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Is this element wrapped in a `<label>`, i.e. is there an unclosed `<label` before it? */
function insideLabel(html, index) {
  const before = html.slice(0, index);
  const open = (before.match(/<label\b/g) || []).length;
  const close = (before.match(/<\/label>/g) || []).length;
  return open > close;
}

const problems = [];

for (const file of pages(ROOT)) {
  const html = readFileSync(file, "utf8");
  const re = /<(input|textarea|select)\b[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const type = (tag.match(/type="([^"]+)"/) || [, "text"])[1];
    if (NO_NAME_NEEDED.has(type)) continue;
    if (/style="[^"]*display:\s*none/.test(tag)) continue;

    if (/aria-label=|aria-labelledby=/.test(tag)) continue;
    const id = (tag.match(/id="([^"]+)"/) || [])[1];
    if (id && new RegExp(`for="${id}"`).test(html)) continue;
    if (insideLabel(html, m.index)) continue;

    const line = html.slice(0, m.index).split("\n").length;
    problems.push({
      where: `${relative(ROOT, file)}:${line}`,
      what: id ? `#${id}` : `<${m[1]} type="${type}">`,
    });
  }
}

if (problems.length === 0) {
  console.log("Every input, textarea and select on the site has an accessible name.");
  process.exit(0);
}

console.log(`${problems.length} field${problems.length === 1 ? "" : "s"} with no accessible name:\n`);
for (const p of problems) console.log(`  ${p.where}  ${p.what}`);
console.log(
  "\nGive each one an aria-label, or a <label for=\"...\"> pointing at its id.\n" +
    "A placeholder does not count: it is gone the moment somebody types.",
);
process.exit(1);
