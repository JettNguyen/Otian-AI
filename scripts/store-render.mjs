/* The pieces the add-on store's pages are drawn from, for scripts/gen-marketplace.mjs.
 *
 * WHAT THE STORE IS. "Areas first", the design Jett picked on October 6, 2026 (the Archie repo's
 * docs/MARKETPLACE-AREAS.md, its section "The website"). Browse screens carry names and pictures
 * only; every sentence about an add-on lives on the sheet a press opens. So each function here
 * draws either a picture (an icon, a face, a tile, a card) or a sheet's contents, and nothing else
 * on a browse screen says anything.
 *
 * WHY ONLY NODE CALLS THESE. The old store had one card renderer shared by the generator and the
 * browser, because the browser redrew the grid from Firestore on every load. The store shows the
 * public shelf only now, so the pages are complete as written: js/store.js opens a sheet by copying
 * the one already in the page, and searches by reading what the page already holds. There is one
 * renderer because there is one caller.
 *
 * Every string a reader sees comes from the catalog snapshot (data/public-catalog.json), the app's
 * store lines (js/store-lines.js) or the app's areas (data/areas.json). The few words written here
 * are labels: "Try saying", "Runs", "Every add-on is included with Archie".
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { GLYPH_PATHS, faceOf, glyphSvg } from "../js/faces.js";
import { storeLine } from "../js/store-lines.js";
import { escapeHtml as esc, formatIntegration, titleCase } from "../js/addon-card.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* ── Ember ──────────────────────────────────────────────────────────────────────────────────────
 * The faces are drawn by the site's own Ember (js/ember.js), not by a copy of it, so a personality
 * in the store is the same drawing as every Ember on the site. ember.js is a browser script that
 * mounts itself, so it runs here in a sandbox with a page that has nothing on it to mount, and only
 * its drawing function (window.Ember.svg) is kept. */
let drawEmber = null;
function ember() {
  if (drawEmber) return drawEmber;
  const src = fs.readFileSync(path.join(ROOT, "js", "ember.js"), "utf8");
  const noop = () => {};
  const page = {
    readyState: "complete", hidden: true, addEventListener: noop,
    querySelectorAll: () => [], querySelector: () => null,
  };
  const win = { matchMedia: () => ({ matches: true }), addEventListener: noop };
  const sandbox = { window: win, document: page, setTimeout: noop, clearTimeout: noop,
    requestAnimationFrame: () => 0, cancelAnimationFrame: noop };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  if (!win.Ember || typeof win.Ember.svg !== "function") throw new Error("js/ember.js no longer exposes Ember.svg");
  drawEmber = win.Ember.svg;
  return drawEmber;
}

/* Gradient and clip ids are per drawing, so each face's are named for it. */
function ownIds(svg, uid) {
  return svg.replace(/\b(ember|sheen|rim|blush|shade|lip)-e\d+\b/g, `$1-${uid}`);
}

const AGENT_LOOK = { hue: "terracotta", topper: "peak", eyes: "pill", extra: "none", mouth: "smile" };

/** A personality's face, the way the app's voiceSVG (src/app/voice-looks.ts) edits the drawing:
 *  the mouths and the closed eyes are already in Ember's markup, shown or hidden by a presentation
 *  attribute, so a look moves that attribute and draws nothing new. */
export function voiceSvg(look, uid) {
  const v = look || AGENT_LOOK;
  let svg = ownIds(ember()({ hue: v.hue, topper: v.topper, eyes: v.eyes, extra: v.extra }), uid);
  if (v.mouth && v.mouth !== "smile") {
    svg = svg.replace('<path class="mouth mouth-smile"', '<path class="mouth mouth-smile" opacity="0"');
    if (v.mouth === "blep") {
      svg = svg.replace('<g class="mouth mouth-blep" opacity="0">', '<g class="mouth mouth-blep">');
    } else {
      svg = svg.replace(new RegExp(`(<path class="mouth mouth-${v.mouth}"[^>]*?) opacity="0"`), "$1");
    }
  }
  if (v.closed) {
    svg = svg.split('<g class="eye-open">').join('<g class="eye-open" opacity="0">')
      .replace(/(<path class="happy"[^>]*?) opacity="0"/g, "$1");
  }
  return svg;
}

/* ── The faces' sprite ──────────────────────────────────────────────────────────────────────────
 * A face is about five kilobytes of drawing, and a page shows one personality's face up to three
 * times (its icon, its sheet, its sample) and the agent's in every bubble. So each face is drawn
 * once per page, as a <symbol> in a sprite at the end of the page, and every place it appears is a
 * <use> of it: a page of thirty-six personalities is one drawing each rather than a hundred. The
 * sprite is out of sight but not display:none, because a gradient inside a display:none subtree
 * draws as nothing in some browsers. */
export function faces() {
  const used = new Map();
  return {
    /** A <use> of one face, recording that the page needs it. `id` is a personality, or "agent". */
    use(id, look) {
      if (!used.has(id)) used.set(id, look || AGENT_LOOK);
      // The window is the symbol's own (9 15 182 182); this outer box is the plain 0 0 182 182 it is
      // fitted into. Giving both the window offset it twice: every face sat 15 units high and had
      // its top sliced off flat, which took the tips off bunny ears and antennas (October 7, 2026).
      return `<svg viewBox="0 0 182 182" aria-hidden="true" focusable="false"><use href="#face-${id}" width="182" height="182"/></svg>`;
    },
    /** Every face the page used, drawn once. Hidden elements (the mouths and eyes a look does not
     *  show) are dropped, since nothing animates these. */
    sprite() {
      if (!used.size) return "";
      const defs = [];
      const symbols = [];
      for (const [id, look] of used) {
        let svg = voiceSvg(look, id.replace(/[^a-z0-9]/gi, ""));
        svg = svg.replace(/<path class="mouth mouth-[a-z]+"[^>]*opacity="0"\/>/g, "")
          .replace(/<g class="mouth mouth-blep" opacity="0">.*?<\/g><\/g><\/g>/, "");
        const d = svg.match(/<defs>(.*?)<\/defs>/);
        if (d) defs.push(d[1]);
        const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/<defs>.*?<\/defs>/, "");
        symbols.push(`<symbol id="face-${id}" viewBox="9 15 182 182">${inner}</symbol>`);
      }
      return `<svg class="sv-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>${defs.join("")}</defs>${symbols.join("")}</svg>`;
    },
  };
}

/* ── Marks ──────────────────────────────────────────────────────────────────────────────────── */

const CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/><path d="M12 7.5V12l3 2"/></svg>';

export const DOWNLOAD = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>';

export const CHEVRON_LEFT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';

/** A mark as white strokes, sized by its container. Thinner strokes as the drawing grows, so a large
 *  mark keeps the weight of a small one. */
export function mark(glyph, stroke = 1.6) {
  return glyphSvg(GLYPH_PATHS[glyph] ? glyph : "addon", stroke);
}

/** An add-on's icon: its mark in white on its area's color, a clock badge on a routine. */
export function icon(item, hue) {
  const badge = item.kind === "routine" ? `<span class="sv-rb"><i>${CLOCK}</i></span>` : "";
  return `<span class="sv-ai sv-hue-${hue}" aria-hidden="true">${mark(faceOf(item.kind, item.id), 1.6)}${badge}</span>`;
}

/** A personality's face on a soft round ground in its own hue. */
export function face(id, ctx) {
  const look = ctx.data.voiceLook[id];
  return `<span class="sv-face sv-hue-${(look && look.hue) || "terracotta"}" aria-hidden="true">${ctx.faces.use(id, look)}</span>`;
}

/** The picture an add-on is known by: a personality's face, or anything else's icon. */
export function picture(item, ctx) {
  return item.kind === "personality" ? face(item.id, ctx) : icon(item, ctx.hueOf(item));
}

/* ── Bubbles ────────────────────────────────────────────────────────────────────────────────── */

/** One exchange: the ask on the right, the reply on the left beside a face. */
export function chat(ask, reply, faceSvg, cls = "") {
  return `<span class="sv-chat${cls ? " " + cls : ""}">` +
    (ask ? `<span class="sv-msg sv-msg--me"><span class="sv-bub">${esc(ask)}</span></span>` : "") +
    `<span class="sv-msg"><span class="sv-av">${faceSvg}</span><span class="sv-bub">${esc(reply)}</span></span>` +
    "</span>";
}

/* ── The sheet ──────────────────────────────────────────────────────────────────────────────────
 * Written into every page that can open it, hidden, and copied into the page's one <dialog> by
 * js/store.js. Hidden rather than fetched, so a crawler and a reader without scripts both get the
 * whole shelf: without scripts, the icon is a link to this section and css/styles.css shows it on
 * :target. */

/** The id a sheet's section carries, which is also the address that opens it. */
export function sheetId(key) {
  return "addon-" + key.replace(":", "-");
}

/** The sample a sheet shows, chosen in the spec's order. Nothing is written for a sheet. */
function sample(item, ctx) {
  const key = `${item.kind}:${item.id}`;
  const own = ctx.data.areas.find((a) => a.sample.from === key);
  if (own) return chat(own.sample.ask, own.sample.reply, ctx.faces.use("agent"), "sv-chat--sheet");
  if (item.kind === "personality" && item.preview_exchanges.length) {
    const ex = item.preview_exchanges.reduce((best, e) => (e.bot.length < best.bot.length ? e : best));
    return chat(ex.user, ex.bot, ctx.faces.use(item.id, ctx.data.voiceLook[item.id]), "sv-chat--sheet");
  }
  const say = ctx.data.say[key];
  if (say && say.length) {
    return '<div class="sv-say"><p class="sv-say-label">Try saying</p><span class="sv-chat sv-chat--sheet">' +
      say.map((p) => `<span class="sv-msg sv-msg--me"><span class="sv-bub">${esc(p)}</span></span>`).join("") +
      "</span></div>";
  }
  const runs = ctx.data.runs[key];
  if (runs) return `<p class="sv-runs">${CLOCK}<span><b>Runs</b> ${esc(runs)}</span></p>`;
  return "";
}

/* What an add-on asks to have switched on, said the way TRUST.md's Websites entry says it, beside
 * the thing the agent will not do there. Copied from js/addon-card.js, where the old cards said it. */
const SCREEN_NEEDS = {
  sites: "Needs Computer control turned on, which is off until you switch it on. Your agent works " +
         "the site in a browser window on your own computer, and you can watch it. It never types a " +
         "password or a card you pay with, and it asks before pressing anything that finalizes.",
};

/** More about it: the long description, what it is built on, its setup steps and who made it. */
function more(item, ctx) {
  const parts = [];
  const long = item.long_description || item.description;
  for (const para of long.split(/\n{2,}/)) if (para.trim()) parts.push(`<p>${esc(para.trim())}</p>`);
  if (item.kind === "personality" && item.preview_exchanges.length > 1) {
    const rest = item.preview_exchanges.map((ex) =>
      `<span class="sv-msg sv-msg--me"><span class="sv-bub">${esc(ex.user)}</span></span>` +
      `<span class="sv-msg"><span class="sv-bub">${esc(ex.bot)}</span></span>`).join("");
    parts.push(`<h3>${esc(item.name)} in a conversation</h3><span class="sv-chat sv-chat--sheet">${rest}</span>`);
  }
  const needs = item.required_screen.map((k) => SCREEN_NEEDS[k]).filter(Boolean);
  if (needs.length) parts.push(`<h3>What ${esc(item.name)} needs</h3>` + needs.map((n) => `<p>${esc(n)}</p>`).join(""));
  const built = item.required_integrations.map(formatIntegration);
  if (item.required_skill) built.push(titleCase(item.required_skill.replace(/[-_]+/g, " ")) + " skill");
  if (built.length) {
    parts.push(`<h3>Works with</h3><ul class="sv-chips">${built.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`);
  }
  if (item.setup_steps.length) {
    parts.push(`<h3>Setting up ${esc(item.name)}</h3><ol class="sv-steps">` +
      item.setup_steps.map((s) => `<li>${esc(s)}</li>`).join("") + "</ol>");
  }
  parts.push(`<p class="sv-by">Made by ${esc(item.author)}.</p>`);
  const deep = ctx.deep[`${item.kind}:${item.id}`];
  if (deep) parts.push(`<p><a class="marketplace-text-link" href="${ctx.up}${deep}">Open the page for ${esc(item.name)}&nbsp;&rarr;</a></p>`);
  return parts.join("");
}

/** Where the sheet sends somebody to get the add-on, in place of the app's Add button. */
function getIt(key, ctx) {
  if (ctx.data.businessOnly.includes(key)) {
    return '<div class="sv-get"><p class="sv-get-line">Included with Archie for Business.</p>' +
      `<a class="btn btn-primary sv-get-btn" href="${ctx.up}archie/business/">See Archie for Business</a></div>`;
  }
  return '<div class="sv-get"><p class="sv-get-line">Every add-on is included with Archie.</p>' +
    `<a class="btn btn-primary sv-get-btn" href="${ctx.up}archie/install/">${DOWNLOAD}Download Archie</a></div>`;
}

/** One add-on's sheet, hidden in the page until a press opens it. The data attributes are what the
 *  front's search reads. */
export function sheet(item, ctx) {
  const key = `${item.kind}:${item.id}`;
  const line = storeLine(item);
  const search = [item.name, line, item.description, item.tagline, item.category, item.role, item.tone,
    ctx.areaName(item)].concat(item.triggers).join(" ").toLowerCase().replace(/\s+/g, " ");
  return `<section class="sv-src" id="${sheetId(key)}" hidden data-key="${esc(key)}" data-installs="${item.install_count}" ` +
    `data-name="${esc(item.name)}" data-search="${esc(search)}">` +
    `<div class="sv-sheet-head"><span class="sv-pic">${picture(item, ctx)}</span>` +
    `<div class="sv-sheet-title"><h2>${esc(item.name)}</h2><p class="sv-sheet-line">${esc(line)}</p></div></div>` +
    sample(item, ctx) +
    getIt(key, ctx) +
    `<details class="sv-more"><summary>More about ${esc(item.name)}</summary><div class="sv-more-body">${more(item, ctx)}</div></details>` +
    `<p class="sv-src-close"><a href="#">Close</a></p>` +
    "</section>";
}

/** The press that opens an add-on's sheet: its picture with its name under it. */
export function app(item, ctx) {
  const key = `${item.kind}:${item.id}`;
  const routine = item.kind === "routine" ? '<span class="sr-only">, a routine</span>' : "";
  return `<a class="sv-app" href="#${sheetId(key)}" aria-haspopup="dialog">${picture(item, ctx)}` +
    `<span class="sv-an">${esc(item.name)}${routine}</span></a>`;
}

/** A starter-set card: a tall square of the area's color with the mark large in it, the name under. */
export function card(item, ctx, hue) {
  const key = `${item.kind}:${item.id}`;
  const glyph = faceOf(item.kind, item.id);
  const badge = item.kind === "routine" ? `<span class="sv-rb"><i>${CLOCK}</i></span>` : "";
  const routine = item.kind === "routine" ? '<span class="sr-only">, a routine</span>' : "";
  return `<a class="sv-card" href="#${sheetId(key)}" aria-haspopup="dialog">` +
    `<span class="sv-card-art sv-hue-${hue}" aria-hidden="true"><span class="sv-card-bg">${mark(glyph, 1)}</span>` +
    `<span class="sv-card-fg">${mark(glyph, 1.5)}</span>${badge}</span>` +
    `<span class="sv-card-name">${esc(item.name)}${routine}</span></a>`;
}

/* ── Packs ──────────────────────────────────────────────────────────────────────────────────── */

export function packId(pack) {
  return "pack-" + pack.id;
}

/** A pack as a folder of up to four of its add-ons' icons. */
export function folder(pack, ctx) {
  const minis = pack.items.slice(0, 4).map((k) => {
    const item = ctx.byKey.get(k);
    if (item.kind === "personality") {
      return `<span class="sv-mi sv-mi--face">${ctx.faces.use(item.id, ctx.data.voiceLook[item.id])}</span>`;
    }
    return `<span class="sv-mi sv-hue-${ctx.hueOf(item)}">${mark(faceOf(item.kind, item.id), 2)}</span>`;
  }).join("");
  return `<span class="sv-folder" aria-hidden="true">${minis}</span>`;
}

export function packApp(pack, ctx) {
  return `<a class="sv-app" href="#${packId(pack)}" aria-haspopup="dialog">${folder(pack, ctx)}` +
    `<span class="sv-an">${esc(pack.name)}</span></a>`;
}

/** A pack's sheet: what is in it, each a link to its own sheet on its area's page, then the
 *  download. The app's pack dialog installs them; the site says where they are. */
export function packSheet(pack, ctx) {
  const names = pack.items.map((k) => ctx.byKey.get(k).name);
  const search = [pack.name, pack.tagline, pack.description, pack.example].concat(names).join(" ").toLowerCase();
  const rows = pack.items.map((k) => {
    const item = ctx.byKey.get(k);
    return `<li><a href="${ctx.homeOf(item)}#${sheetId(k)}">${picture(item, ctx)}<span>${esc(item.name)}</span></a></li>`;
  }).join("");
  const example = pack.example
    ? '<div class="sv-say"><p class="sv-say-label">Try saying</p><span class="sv-chat sv-chat--sheet">' +
      `<span class="sv-msg sv-msg--me"><span class="sv-bub">${esc(pack.example.charAt(0).toUpperCase() + pack.example.slice(1))}</span></span></span></div>`
    : "";
  return `<section class="sv-src sv-src--pack" id="${packId(pack)}" hidden data-key="pack:${esc(pack.id)}" data-pack ` +
    `data-name="${esc(pack.name)}" data-search="${esc(search)}">` +
    `<div class="sv-sheet-head"><span class="sv-pic">${folder(pack, ctx)}</span>` +
    `<div class="sv-sheet-title"><h2>${esc(pack.name)}</h2><p class="sv-sheet-line">${esc(pack.tagline)}</p></div></div>` +
    `<p class="sv-pack-desc">${esc(pack.description)}</p>` +
    example +
    `<ul class="sv-pack-items">${rows}</ul>` +
    getIt(`pack:${pack.id}`, ctx) +
    `<p class="sv-src-close"><a href="#">Close</a></p>` +
    "</section>";
}
