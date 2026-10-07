/* Copy the add-on store's areas out of the Archie app into data/areas.json.
 *
 * WHAT THIS IS FOR. The store was rebuilt "areas first" on October 7, 2026, to the design Jett picked
 * the day before (the Archie repo's docs/MARKETPLACE-AREAS.md). Its first screen is a tile per part
 * of life, and a tile opens that area: a sample exchange, a starter set, one personality that suits
 * it, then everything else in the area as icons. All of that is decided in the app, in
 * src/app/areas.ts, src/app/lives.ts, src/app/packs.ts and src/app/voice-looks.ts, and the site never
 * decides any of it again. This copies it, the way scripts/gen-store-lines.py copies the store lines
 * and js/faces.js copies the marks, and scripts/gen-marketplace.mjs draws the pages from the copy.
 *
 * WHY A COPY AND NOT A READ. The deploy runs on a computer with no Archie checkout beside the site,
 * and `node scripts/gen-marketplace.mjs --check` runs there. So what the pages are drawn from has to
 * be in this repo, and this file is what keeps it honest against the app on a computer that has both.
 *
 * PUBLIC ONLY. Everything here is filtered to data/public-catalog.json, the snapshot of the public
 * store. areas.ts files private add-ons too (they render for the accounts allowed to see them), and
 * a private id written into a file this site serves is a private add-on listed, however quietly.
 *
 * Three things come from the add-ons' own manifests rather than from areas.ts, because the store's
 * sheet shows them and the public snapshot does not carry them:
 *   - `say`: up to two things to say, lifted from the quoted phrases in a skill's usage hint, the
 *     same rule as `sayables` in the app's src/app/store-layout.ts. Nothing is written for a sheet.
 *   - `runs`: a routine's schedule in words, from its default trigger.
 *   - `businessOnly`: the add-ons only Archie for Business lists (`editions: "business"`), so a sheet
 *     never offers the personal download for something that is not in it.
 *
 * Usage:
 *   node scripts/gen-areas.mjs           write data/areas.json from the Archie checkout
 *   node scripts/gen-areas.mjs --check   exit 1 if data/areas.json disagrees with the app
 *
 * Without the Archie checkout there is nothing to compare against, so it says so and passes, like
 * scripts/check-faces.py.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ARCHIE = "/Users/Games/Desktop/Code/Archie";
const APP = path.join(ARCHIE, "src", "app");
const MARKET = path.join(ARCHIE, "data", "marketplace");
const OUT = path.join(ROOT, "data", "areas.json");
const CATALOG = path.join(ROOT, "data", "public-catalog.json");

/* The catalog folder for each kind, in the store's own kind names. */
const FOLDER = { skill: "skills", specialist: "subagents", routine: "routines", personality: "personalities" };

/* The app's sayables() (src/app/store-layout.ts): quoted spans of 3 to 90 characters, first letter
 * raised because a phrase quoted mid-sentence starts lowercase and a bubble starts a message.
 *
 * One difference, on purpose: straight quotes count as well as curly ones, the way the app's own
 * tryPhrases() (src/app/try-phrases.ts) reads them. sayables() assumes every usage hint quotes in
 * curly pairs, and on October 7, 2026 only 19 of the 84 public skills did; 57 quote in straight
 * pairs, so curly alone left two sheets in three with no sample. */
function sayables(hint, max = 2) {
  if (!hint) return [];
  const out = [];
  const seen = new Set();
  for (const m of hint.matchAll(/“([^”]{3,90})”|"([^"]{3,90})"/g)) {
    const phrase = (m[1] ?? m[2]).trim();
    const key = phrase.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(phrase.charAt(0).toUpperCase() + phrase.slice(1));
    if (out.length === max) break;
  }
  return out;
}

/* A time the way the app writes one: (13, 5) is "1:05 PM". */
function clock(hour, minute) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

function times(t) {
  const all = [{ hour: t.hour, minute: t.minute }, ...(t.also_at || [])];
  const words = all
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute))
    .map((x) => clock(x.hour, x.minute));
  if (words.length <= 2) return words.join(" and ");
  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`;
}

const DAY = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ordinal(n) {
  const tail = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" })[n % 10] || "th";
  return `${n}${tail}`;
}

/* What follows "Runs" on a routine's sheet ("Runs every Monday at 7:30 AM"). The same facts the
 * app's describeTrigger (src/app/schedule.ts) prints on a routine's row, said as a sentence, and no
 * time zone: a default schedule runs on the owner's own clock. An unknown shape says nothing rather
 * than guessing, and the sheet then shows no sample, which the spec allows. */
export function runsText(t) {
  if (!t || !t.type) return "";
  if (t.type === "daily_at") return `every day at ${times(t)}`;
  if (t.type === "weekly_at") return `every ${DAY[t.weekday]} at ${clock(t.hour, t.minute)}`;
  if (t.type === "days_of_week") {
    const days = [...t.weekdays].sort((a, b) => a - b);
    const key = days.join(",");
    const which =
      key === "0,1,2,3,4,5,6" ? "every day"
      : key === "0,1,2,3,4" ? "on weekdays"
      : key === "5,6" ? "on weekends"
      : "every " + (days.length === 2
        ? `${DAY[days[0]]} and ${DAY[days[1]]}`
        : `${days.slice(0, -1).map((d) => DAY[d]).join(", ")}, and ${DAY[days[days.length - 1]]}`);
    const every = t.every_weeks > 1 ? (t.every_weeks === 2 ? ", every other week" : `, every ${t.every_weeks} weeks`) : "";
    return `${which} at ${times(t)}${every}`;
  }
  if (t.type === "monthly_on") {
    const which = t.day === 0 ? "the last day" : `the ${ordinal(t.day)}`;
    const every = t.every_months === 3 ? "every three months" : t.every_months > 1 ? `every ${t.every_months} months` : "every month";
    return `${every} on ${which} at ${clock(t.hour, t.minute)}`;
  }
  if (t.type === "when_due") {
    const longest = Math.max(0, ...t.fields.map((f) => f.days_before));
    const notice = longest === 0 ? "on the day" : longest === 1 ? "a day ahead" : longest === 7 ? "a week ahead" : `${longest} days ahead`;
    const list = String(t.collection).replace(/[-_]+/g, " ").trim();
    return `when anything in ${list} is due, ${notice}, checked at ${clock(t.hour, t.minute)}`;
  }
  if (t.type === "after_meeting") return "when a new meeting recording comes in";
  if (t.type === "before_leaving") return "when the traffic changes a journey you are about to make";
  if (t.type === "before_meeting") {
    const m = t.minutes;
    const notice = m === 60 ? "an hour" : m % 60 === 0 ? `${m / 60} hours` : `${m} minute${m === 1 ? "" : "s"}`;
    return `${notice} before each meeting`;
  }
  if (t.type === "interval") {
    const mins = Math.round(t.seconds / 60);
    return `every ${mins} minute${mins === 1 ? "" : "s"}`;
  }
  return "";
}

/* voice-looks.ts imports ember-gen without an extension, which Node cannot resolve, so its one table
 * is read as text. Every entry is one line, `id: { hue: "...", ... },`, and check-faces in the app
 * keeps it that way. */
function voiceLooks() {
  const src = fs.readFileSync(path.join(APP, "voice-looks.ts"), "utf8");
  const start = src.indexOf("export const VOICE_LOOK");
  const end = src.indexOf("};", start);
  if (start < 0 || end < 0) throw new Error("VOICE_LOOK not found in voice-looks.ts");
  const out = {};
  for (const m of src.slice(start, end).matchAll(/^\s*"?([a-z0-9-]+)"?:\s*\{([^}]*)\},?\s*$/gm)) {
    const look = {};
    for (const f of m[2].matchAll(/(\w+):\s*(?:"([^"]*)"|(true|false))/g)) {
      look[f[1]] = f[2] !== undefined ? f[2] : f[3] === "true";
    }
    out[m[1]] = look;
  }
  if (!Object.keys(out).length) throw new Error("no looks read from voice-looks.ts");
  return out;
}

function manifests() {
  const out = {};
  for (const [kind, folder] of Object.entries(FOLDER)) {
    const dir = path.join(MARKET, folder);
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      const m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      out[`${kind}:${m.id}`] = m;
    }
  }
  return out;
}

async function build() {
  const areasTs = await import(pathToFileURL(path.join(APP, "areas.ts")).href);
  const livesTs = await import(pathToFileURL(path.join(APP, "lives.ts")).href);
  const packsTs = await import(pathToFileURL(path.join(APP, "packs.ts")).href);
  const { items } = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
  const pub = new Set(items.map((i) => `${i.kind}:${i.id}`));
  const key = (it) => `${it.kind}:${it.id}`;
  const man = manifests();

  const areas = areasTs.AREAS.map((a) => {
    let start = "life" in a.start ? livesTs.LIVES.find((l) => l.id === a.start.life)?.core : a.start.items;
    if (!start) throw new Error(`area ${a.id} names a life that is not in lives.ts: ${a.start.life}`);
    start = start.map(key).filter((k) => pub.has(k));
    const from = key(a.sample.from);
    if (!pub.has(from)) throw new Error(`area ${a.id}'s sample is from ${from}, which is not public`);
    if (!pub.has(`personality:${a.voice.id}`)) throw new Error(`area ${a.id}'s voice ${a.voice.id} is not public`);
    const sample = { from, reply: a.sample.reply };
    if (a.sample.ask) sample.ask = a.sample.ask;
    return { id: a.id, name: a.name, hue: a.hue, marks: a.marks, start, sample, voice: a.voice, look: a.look };
  });

  const areaOf = {};
  for (const [k, v] of Object.entries(areasTs.AREA_OF)) if (pub.has(k)) areaOf[k] = v;
  const unfiled = [...pub].filter((k) => !k.startsWith("personality:") && !areaOf[k]);
  if (unfiled.length) throw new Error("public add-ons with no area in areas.ts: " + unfiled.join(", "));

  const looks = voiceLooks();
  const voiceLook = {};
  for (const [id, look] of Object.entries(looks)) if (pub.has(`personality:${id}`)) voiceLook[id] = look;

  /* A pack the app hides from anyone who cannot see all of it is not a public pack, and neither is
     one left with fewer than two public items once the private ones are taken out. */
  const packs = packsTs.PACKS
    .filter((p) => !p.exclusive)
    .map((p) => ({ id: p.id, name: p.name, tagline: p.tagline, description: p.description, example: p.example,
      items: p.items.map(key).filter((k) => pub.has(k)) }))
    .filter((p) => p.items.length >= 2);

  const say = {};
  const runs = {};
  const businessOnly = [];
  for (const k of [...pub].sort()) {
    const m = man[k];
    if (!m) throw new Error(`${k} is in the public snapshot and not in the Archie catalog`);
    if (m.editions === "business") businessOnly.push(k);
    if (k.startsWith("skill:") || k.startsWith("specialist:")) {
      const phrases = sayables(m.usage_hint);
      if (phrases.length) say[k] = phrases;
    }
    if (k.startsWith("routine:")) {
      const words = runsText(m.default_trigger);
      if (words) runs[k] = words;
    }
  }

  return {
    _generated: "By scripts/gen-areas.mjs from the Archie app's src/app/areas.ts, lives.ts, packs.ts, voice-looks.ts and data/marketplace. Do not hand-edit.",
    areas,
    voicesTile: areasTs.VOICES_TILE,
    areaOf,
    voiceLook,
    packs,
    say,
    runs,
    businessOnly,
  };
}

async function main() {
  const check = process.argv.includes("--check");
  if (!fs.existsSync(path.join(APP, "areas.ts"))) {
    console.log(`gen-areas: no Archie checkout at ${ARCHIE}, nothing to compare against. Skipped.`);
    return 0;
  }
  const wanted = JSON.stringify(await build(), null, 2) + "\n";
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (have === wanted) {
    console.log("gen-areas: clean. data/areas.json matches the app.");
    return 0;
  }
  if (check) {
    console.log("gen-areas: data/areas.json is out of date with the app. Run: node scripts/gen-areas.mjs");
    return 1;
  }
  fs.writeFileSync(OUT, wanted);
  const d = JSON.parse(wanted);
  console.log(`gen-areas: wrote data/areas.json (${d.areas.length} areas, ${Object.keys(d.areaOf).length} filed add-ons, ` +
    `${Object.keys(d.voiceLook).length} faces, ${d.packs.length} packs).`);
  return 0;
}

process.exit(await main());
