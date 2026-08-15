// Colour contrast, measured rather than asserted.
//
// This is the site's copy of the check that lives in the Archie repo at
// `scripts/check-contrast.mjs`, and it exists because the two share a palette: every token below
// was aligned to the app's in 2026-08. Both bugs it was written for were on both sides.
//
// The focus ring was `outline: 2px solid var(--accent)` in ten rules, which is 2.38 to 2.64:1
// depending on the ground, so nobody navigating by keyboard could see where they were. Five text
// fields were worse: they set `outline: none` and dressed focus as an orange border, and two of
// those had no halo at all. Separately `--field-border` was 1.36:1 on a field whose fill matches
// the page it stands on, so the only thing saying "you can type here" was saying nothing.
//
// Both were fixed by picking better numbers. Numbers drift, and a colour that drifts back breaks
// nothing a person would notice while editing. So this reads the real values out of
// `css/styles.css` and re-measures them.
//
// WCAG 2.2 asks 4.5:1 of body text (SC 1.4.3) and 3:1 of anything that has to be SEEN rather than
// read: focus indicators and the boundary of a control (SC 1.4.11, SC 2.4.13).
//
// What it does not check, so nobody mistakes green here for done:
//   - colours written inline in a page rather than as a token
//   - reading order, announcements, or whether a control can be reached at all
//   - anything about the app, which has its own copy of this
//
// Run: node scripts/check-contrast.mjs
import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../css/styles.css", import.meta.url), "utf8");

function block(selector) {
  const start = CSS.indexOf(selector);
  if (start < 0) throw new Error(`block ${selector} not found`);
  const open = CSS.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < CSS.length; i++) {
    if (CSS[i] === "{") depth++;
    else if (CSS[i] === "}" && --depth === 0) return CSS.slice(open, i);
  }
  throw new Error(`block ${selector} is unterminated`);
}

function token(name, b) {
  const m = b.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!m) throw new Error(`token --${name} not found (did it get renamed?)`);
  return m[1].trim();
}

const LIGHT = block(":root {");
const DARK = block('[data-theme="dark"] {');

// ── Colour maths ────────────────────────────────────────────────────────────────────────────────

function parse(value) {
  const v = value.trim();
  const rgba = v.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const parts = rgba[1].split(/[,/\s]+/).filter(Boolean).map(Number);
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  }
  let h = v.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
}

/** Composite a possibly-translucent colour onto an opaque ground. */
function flatten(fg, bg) {
  const [r, g, b, a] = parse(fg);
  const [br, bg_, bb] = parse(bg);
  return [r * a + br * (1 - a), g * a + bg_ * (1 - a), b * a + bb * (1 - a), 1];
}

function luminance([r, g, b]) {
  const ch = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function ratio(fg, bg) {
  const a = luminance(flatten(fg, bg));
  const b = luminance(parse(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function opaque(fg, bg) {
  const [r, g, b] = flatten(fg, bg);
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

// ── What gets measured ──────────────────────────────────────────────────────────────────────────

const TEXT = 4.5;
const UI = 3.0;
const checks = [];

for (const [theme, b] of [["light", LIGHT], ["dark", DARK]]) {
  const g = {
    card: token("bg-card", b),
    "bg-primary": token("bg-primary", b),
    "bg-secondary": token("bg-secondary", b),
  };
  const ring = token("focus-ring", b);

  // The ring's two neighbours. On a field it is drawn just outside a halo; everywhere else it sits
  // straight on the page. Both have to clear 3:1 or the ring has an edge that disappears.
  for (const [name, ground] of Object.entries(g)) {
    checks.push([`${theme}: focus ring on ${name}`, ratio(ring, ground), UI]);
  }
  checks.push([
    `${theme}: focus ring on the --accent-subtle halo`,
    ratio(ring, opaque(token("accent-subtle", b), g.card)),
    UI,
  ]);
  // The other halo, the 14% accent wash under .form-input and .marketplace-search-input. Written
  // out rather than read, because it is an inline rgba() in five rules and not a token.
  checks.push([
    `${theme}: focus ring on the 14% accent halo`,
    ratio(ring, opaque(`rgba(${parse(token("accent", b)).slice(0, 3).join(", ")}, 0.14)`, g.card)),
    UI,
  ]);

  // A field's border is the only thing separating it from the page, because its fill is the page.
  for (const t of ["field-border", "field-border-strong"]) {
    for (const [name, ground] of Object.entries(g)) {
      checks.push([`${theme}: --${t} on ${name}`, ratio(token(t, b), ground), UI]);
    }
  }

  // Text.
  for (const t of ["text-primary", "text-secondary", "text-muted"]) {
    checks.push([`${theme}: --${t} on card`, ratio(token(t, b), g.card), TEXT]);
    checks.push([`${theme}: --${t} on --bg-primary`, ratio(token(t, b), g["bg-primary"]), TEXT]);
  }
  checks.push([`${theme}: --text-on-accent on --accent`, ratio(token("text-on-accent", b), token("accent", b)), TEXT]);
  checks.push([`${theme}: --accent-ink on --accent-subtle`, ratio(token("accent-ink", b), token("accent-subtle", b)), TEXT]);
}

let failed = 0;
for (const [label, got, need] of checks) {
  const ok = got >= need;
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "FAIL  "}${got.toFixed(2).padStart(6)} / ${need.toFixed(1)}  ${label}`);
}

console.log(
  failed === 0
    ? `\nAll ${checks.length} contrast checks pass.`
    : `\n${failed} of ${checks.length} contrast checks FAILED.`,
);
process.exit(failed === 0 ? 0 : 1);
